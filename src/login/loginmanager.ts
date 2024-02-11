import { Events, StateChangeEvent } from "../listener/listener";
import { SamartHomeHandyBis } from "../main";
import { Client } from "../server/client";
import { LoginApprovedPacket, LoginDeclinedPacket, LoginKeyPacket, RequestLoginPacket, WrongAesKeyPack, NewAesPacket } from "../server/datapacks";
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"
export class LoginManager {
    adapter: SamartHomeHandyBis;
    pendingClients: Client[];
	approveLogins: boolean = false;
	approveLoginsTimeout?: NodeJS.Timeout;
    constructor(adapter: SamartHomeHandyBis) {
        this.adapter = adapter;
        this.adapter.listener.on(Events.StateChange, this.onStateChange.bind(this));
        this.pendingClients = []
    }

    private async onStateChange(event: StateChangeEvent) : Promise<void>  {
		this.adapter.log.debug(JSON.stringify(event));
		if(event.objectID.startsWith("hiob.") && !event.ack) {
			const splited = event.objectID.split(".");
			//If Datapoint is approved Datapoint
			if(splited.length>4 && splited[2] == "devices" && splited[4] == "approved") {
				const deviceID = splited[3];
				//Get Client from pending list
				const cl = this.pendingClients.find((e) => e.id == deviceID);
				//If Approved was set to true
				if(cl && event.value) {
					await this.setAndSendLoginKeys(deviceID, cl);
				} else {
					this.adapter.log.debug("No pending client found");
				}
			} else if(splited.length>4 && splited[2] == "devices" && splited[4] == "aesKey_active") {
				const deviceID = splited[3];
				const cl = this.pendingClients.find((e) => e.id == deviceID);
				if(cl) {
					if (event.value) {
						this.setAesStatus(deviceID, cl);
					} else {
						cl.setAESKey("");
						this.adapter.log.info(`AES encryption disabled!`);
					}
					this.adapter.setState(event.objectID, {ack: true});
				} else {
					this.adapter.log.debug("No pending client found");
				}
			} else if(splited.length>4 && splited[2] == "devices" && splited[4] == "aesKey_new") {
				const deviceID = splited[3];
				const cl = this.pendingClients.find((e) => e.id == deviceID);
				if(cl) {
					if (event.value) {
						this.setAesNewAndSentInfo(deviceID, cl);
					}
					this.adapter.setState(event.objectID, false, true);
				} else {
					this.adapter.log.debug("No pending client found");
				}
			} else if(splited[2] == "approveNextLogins") {
				if(event.value) {
					if(this.approveLoginsTimeout) {
						clearTimeout(this.approveLoginsTimeout);
					}
					this.approveLogins = true;
					this.approveLoginsTimeout = setTimeout(() => {
						this.approveLogins = false;
						this.approveLoginsTimeout = undefined;
						this.adapter.setStateAsync("approveNextLogins", false, true);
					}, 1000*60)
				} else {
					this.approveLogins = false;
				}
			}
		}
	}

	private async setAesNewAndSentInfo(deviceID: string , cl: Client) : Promise<void> {
		const random_key = this.genRandomString(6, true);
		await this.adapter.setStateAsync(`devices.${deviceID}.aesKey`, random_key, true);
		cl.aesKey = random_key;
		cl.setAESKey(random_key);
		cl.sendMSG(new NewAesPacket().toJSON(), false);
	}

	private async setAesStatus(deviceID: string , cl: Client) : Promise<void> {
		const get_aes = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey`);
		if (get_aes && get_aes.val) {
			cl.setAESKey(get_aes.val.toString());
			this.adapter.log.info(`AES encryption enabled!`);
		} else {
			cl.setAESKey("");
			this.adapter.log.info(`AES encryption disabled!`);
		}
	}

	private async setAndSendLoginKeys(deviceID: string , cl: Client) : Promise<void> {
		const keys = await this.genKey();
		const aes_status = await this.adapter.getStateAsync("devices." + deviceID + ".aesKey_active");
		if (aes_status && aes_status.val) {
			const aes = await this.adapter.getStateAsync("devices." + deviceID + ".aesKey");
			if (aes != null && aes.val != null) {
				cl.setAESKey(aes.val.toString());
			} else {
				cl.setAESKey("");
			}
		} else {
			cl.setAESKey("");
		}
		await this.adapter.setStateAsync("devices." + deviceID + ".key", keys[1], true);
		for(const current of this.pendingClients) {
			if(current.id == cl.id) {
				current.sendMSG(new LoginKeyPacket(keys[0]).toJSON(), false);
			}
		}
	}

	public async onWrongAesKey(client: Client) : Promise<boolean> {
        this.adapter.log.debug("Client(" + client.toString() + ") send wrong aes!")
        this.wrongAesKey(client);
		return false;
    }

	public async onLoginRequest(client: Client, loginRequestData: RequestLoginPacket ) : Promise<boolean> {
        this.adapter.log.debug("Client(" + client.toString() + ") requested to login")
        this.pendingClients.push(client);
		this.pendingClients = this.pendingClients.filter((cli, i, s) => s.indexOf(cli) == i );
        let deviceIDRep = loginRequestData.deviceID.replace(".", "-");
		while(deviceIDRep.includes(".")) {
			deviceIDRep = deviceIDRep.replace(".", "-");
		}
		client.id = deviceIDRep;
        await this.createObjects(client, deviceIDRep, loginRequestData.deviceName, loginRequestData.key, loginRequestData.version);
        this.adapter.subscribeStatesAsync("devices." + deviceIDRep + ".approved");
        this.adapter.setStateAsync("devices." + deviceIDRep + ".connected", true, true);
		client.setID(deviceIDRep);
        if(!await this.validateLoginRequest(client, deviceIDRep, loginRequestData)) {
            this.loginDeclined(client);
			return false;
        }
		this.pendingClients = this.pendingClients.filter((cl, i) => cl != client);
		client.onApprove();
		const version = this.adapter.version != null ? this.adapter.version.toString() : "";
		client.sendMSG(new LoginApprovedPacket(version).toJSON(), false);
		return true;


    }

    private async validateLoginRequest(client: Client, deviceIDRep: string, loginRequestData: RequestLoginPacket) : Promise<boolean>{
        const approved = await this.adapter.getStateAsync("devices." + deviceIDRep + ".approved");
		const keyState = await this.adapter.getStateAsync("devices." + deviceIDRep + ".key");
		const needPWD = await this.adapter.getStateAsync("devices." + deviceIDRep + ".noPwdAllowed");
		//Check if next should be accepted:
		let apr = true;
        if(!approved || !approved.val) {
            this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): not approved");
            apr = false;
        }
        if(keyState == null || keyState.val == null) {
            apr = false;
        }
		if(!loginRequestData.key) {
			apr = false;
		}

		if(needPWD && !needPWD?.val) {

			if(!loginRequestData.user || !loginRequestData.password || !(await this.adapter.checkPasswordAsync(loginRequestData.user, loginRequestData.password))) {
				this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): wrong password");
				apr = false;
			}

		}
		if(loginRequestData.key == null) {
			apr = false;
		}
        if( keyState != null && keyState.val != null && loginRequestData.key  && !(await bcrypt.compare( loginRequestData.key, keyState.val.toString()))) {
            this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): wrong key" + !(await bcrypt.compare(  loginRequestData.key, keyState.val.toString()))) ;
           	apr = false;
        }
		if(!apr && this.approveLogins) {
			await this.adapter.setStateAsync("devices." + deviceIDRep + ".approved", true, true);

			//Send Login Keys
			await this.setAndSendLoginKeys(deviceIDRep, client);


			apr = true;
		}
        return apr;

    }

    /**
     * This method creates all IoBroker Objects needed for the login request. If they exists this method will not create any
     * @param deviceIDRep Id of the device
     * @param deviceName Name of the device
     */
    private async createObjects(client: Client, deviceIDRep: string, deviceName: string, key: string, version: string) : Promise<void>{
        await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.connected`, {
			type: "state",
			common: {
				name: {
					"en": "Connected",
					"de": "Verbunden",
					"ru": "Ð¡Ð¾ÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ðµ",
					"pt": "Conectado",
					"nl": "Verbonden",
					"fr": "ConnectÃ©",
					"it": "Collegato",
					"es": "Conectado",
					"pl": "PoÅ‚Ä…czone",
					"uk": "Ð—Ð²'ÑÐ·Ð°Ñ‚Ð¸ÑÑ",
					"zh-cn": "å·²è¿žæŽ¥"
				},
				type: "boolean",
				role: "info.status",
				desc: "Created by Adapter",
				def: true,
				read: true,
				write: false,
			},
			native: {},
		});
		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.app_version`, {
			type: "state",
			common: {
				name: {
					"en": "APP Version",
					"de": "APP-Version",
					"ru": "Версия APP",
					"pt": "Versão do APP",
					"nl": "Versie APP",
					"fr": "Version APP",
					"it": "Versione APP",
					"es": "Versión APP",
					"pl": "Wersja APP",
					"uk": "Версія APP",
					"zh-cn": "APP 版本"
				},
				type: "string",
				role: "info.firmware",
				desc: "Created by Adapter",
				def: version,
				read: true,
				write: false,
			},
			native: {},
		});
		await this.adapter.setStateAsync(`devices.${deviceIDRep}.app_version`, version, true);
		await this.adapter.setObjectAsync(`devices.${deviceIDRep}` , {
			type: "channel",
			common: {
				name: deviceName,
				desc: "Created by Adapter",
			},
			native: {},
		});
		await this.adapter.setObjectAsync(`devices.${deviceIDRep}.name`, {
			type: "state",
			common: {
				name: {
					"en": "Name",
					"de": "Name",
					"ru": "Ð˜Ð¼Ñ",
					"pt": "Nome",
					"nl": "Naam",
					"fr": "DÃ©nomination",
					"it": "Nome",
					"es": "Nombre",
					"pl": "Nazwa",
					"uk": "Ð†Ð¼'Ñ",
					"zh-cn": "åç§°"
				},
				type: "string",
				role: "info.name",
				desc: "Created by Adapter",
				def: deviceName,
				read: true,
				write: false,
			},
			native: {},
		});

		await this.adapter.setStateAsync(`devices.${deviceIDRep}.name`, deviceName, true);

		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.id`, {
			type: "state",
			common: {
				name: {
					"en": "ID",
					"de": "ID",
					"ru": "ID",
					"pt": "ID",
					"nl": "ID",
					"fr": "NUMÃ‰RO",
					"it": "ID",
					"es": "ID",
					"pl": "ID",
					"uk": "Ð†Ðœ'Ð¯",
					"zh-cn": "èº«ä»½è¯"
				},
				type: "string",
				role: "info.address",
				desc: "Created by Adapter",
				def: deviceIDRep,
				read: true,
				write: false,
			},
			native: {},
		});

		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.key`, {
			type: "state",
			common: {
				name: {
					"en": "Key",
					"de": "SchlÃ¼ssel",
					"ru": "ÐšÐ»ÑŽÑ‡",
					"pt": "Chaveiro",
					"nl": "Sleutel",
					"fr": "ClÃ©",
					"it": "Chiave",
					"es": "Clave",
					"pl": "Klucz",
					"uk": "Ð“Ð¾Ð»Ð¾Ð²Ð½Ð°",
					"zh-cn": "å¯†é’¥"
				},
				type: "string",
				role: "state",
				desc: "Created by Adapter",
				def: key,
				read: false,
				write: false,
			},
			native: {},
		});


		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.lastConnection`, {
			type: "state",
			common: {
				name: {
					"en": "Last Connection",
					"de": "Letzte Verbindung",
					"ru": "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ ÑÐ¾ÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ðµ",
					"pt": "Ãšltima conexÃ£o",
					"nl": "Laatste verbinding",
					"fr": "DerniÃ¨re connexion",
					"it": "Ultima connessione",
					"es": "Ãšltima conexiÃ³n",
					"pl": "Ostatnie poÅ‚Ä…czenie",
					"uk": "ÐžÑÑ‚Ð°Ð½Ð½Ñ” Ð¿Ñ–Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð½Ñ",
					"zh-cn": "ä¸Šæ¬¡è¿žæŽ¥"
				},
				type: "number",
				role: "date",
				desc: "Created by Adapter",
				def: 0,
				read: true,
				write: true,
			},
			native: {},
		});

		this.adapter.setState(`devices.${deviceIDRep}.lastConnection`, Date.now(), true)


		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.approved`, {
			type: "state",
			common: {
				name: {
					"en": "Approved",
					"de": "Genehmigt",
					"ru": "Ð£Ñ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð½Ñ‹Ðµ",
					"pt": "Aprovado",
					"nl": "Goedgekeurd",
					"fr": "ApprouvÃ©",
					"it": "Approvazione",
					"es": "Aprobado",
					"pl": "Zatwierdzone",
					"uk": "Ð—Ð°Ñ‚Ð²ÐµÑ€Ð´Ð¶ÐµÐ½Ð½Ñ",
					"zh-cn": "æ ¸å®šæ•°"
				},
				type: "boolean",
				role: "switch",
				desc: "Created by Adapter",
				def: false,
				read: true,
				write: true,
			},
			native: {},
		});

		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.noPwdAllowed`, {
			type: "state",
			common: {
				name: {
					"en": "No Password Allowed",
					"de": "Kein Passwort erlaubt",
					"ru": "Ð‘ÐµÐ· Ð¿Ð°Ñ€Ð¾Ð»Ñ",
					"pt": "Nenhuma senha permitida",
					"nl": "Geen wachtwoord toegestaan",
					"fr": "Pas de mot de passe autorisÃ©",
					"it": "Nessuna password consentita",
					"es": "No se admite contraseÃ±a",
					"pl": "Brak hasÅ‚a",
					"uk": "ÐÐµÐ¼Ð°Ñ” Ð¿Ð°Ñ€Ð¾Ð»Ñ",
					"zh-cn": "æ²¡æœ‰å…è®¸çš„å¯†ç "
				},
				type: "boolean",
				role: "switch",
				desc: "Created by Adapter",
				def: false,
				read: true,
				write: true,
			},
			native: {},
		});


		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.sendNotification`, {
			type: "state",
			common: {
				name: {
					"en": "Send Notification",
					"de": "Mitteilung senden",
					"ru": "ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ",
					"pt": "Enviar notificaÃ§Ã£o",
					"nl": "Kennisgeving versturen",
					"fr": "Envoyer une notification",
					"it": "Invia notifica",
					"es": "Enviar notificaciÃ³n",
					"pl": "WyÅ›lij powiadomienie",
					"uk": "ÐÐ°Ð´Ñ–ÑÐ»Ð°Ñ‚Ð¸ Ð¿Ð¾Ð²Ñ–Ð´Ð¾Ð¼Ð»ÐµÐ½Ð½Ñ",
					"zh-cn": "å‘é€é€šçŸ¥"
				},
				type: "string",
				role: "state", //TODO: Indicator
				desc: "Created by Adapter",
				def: "",
				read: true,
				write: true,
			},
			native: {},
		});
		await this.adapter.subscribeStatesAsync(`devices.${deviceIDRep}.sendNotification`);
		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey`, {
			type: "state",
			common: {
				name: {
				  "en": "Insert AES-key into the APP.",
				  "de": "AES-key in die APP einfÃ¼gen.",
				  "ru": "Ð’ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ AES-ÐºÐ»ÑŽÑ‡ Ð² APP.",
				  "pt": "Insira o AES-key no APP.",
				  "nl": "Plaats AES-toets in de APP.",
				  "fr": "InsÃ©rer la touche AES dans l'APP.",
				  "it": "Inserire AES-chiave nella APP.",
				  "es": "Inserte AES-key en el APP.",
				  "pl": "Wstaw klucz AES- do APP.",
				  "uk": "Ð’ÑÑ‚Ð°Ð²Ñ‚Ðµ AES-ÐºÐ»ÑŽÑ‡ Ñƒ APP.",
				  "zh-cn": "åœ¨APPä¸­æ’å…¥AESé”®."
				},
				type: "string",
				role: "state",
				desc: "Created by Adapter",
				def: "",
				read: true,
				write: false
			  },
			native: {},
		});
		const get_aes = await this.adapter.getStateAsync(`devices.${deviceIDRep}.aesKey`);
		const random_key = this.genRandomString(6, true);
		if (!get_aes || get_aes.val == null || get_aes.val == "") {
			await this.adapter.setStateAsync(`devices.${deviceIDRep}.aesKey`, random_key, true);
			client.aesKey = random_key;
			client.setAESKey(client.aesKey);
		} else if (get_aes != null && typeof get_aes.val === "string") {
			client.aesKey = get_aes.val;
			client.setAESKey(client.aesKey);
		} else {
			this.adapter.log.warn("Cannot find AES Key. Please Restart Adapter!")
		}
		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey_new`, {
			type: "state",
			common: {
				name: {
					"en": "Create new AES-Key",
					"de": "Neue AES-Key erstellen",
					"ru": "Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ Ð½Ð¾Ð²Ñ‹Ðµ AES-Key",
					"pt": "Criar novo AES-Key",
					"nl": "Nieuwe AES-sleutel aanmaken",
					"fr": "CrÃ©er une nouvelle clÃ© AES",
					"it": "Crea nuovo AES-Key",
					"es": "Crear nuevo AES-Key",
					"pl": "UtwÃ³rz nowy klucz AES-",
					"uk": "Ð¡Ñ‚Ð²Ð¾Ñ€ÐµÐ½Ð½Ñ Ð½Ð¾Ð²Ð¸Ñ… AES-Key",
					"zh-cn": "åˆ›å»ºæ–° AES å¯†é’¥"
				},
				type: "boolean",
				role: "button",
				desc: "Created by Adapter",
				def: false,
				read: true,
				write: false
			  },
			native: {},
		});
		await this.adapter.subscribeStatesAsync(`devices.${deviceIDRep}.aesKey_new`);
		await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey_active`, {
			type: "state",
			common: {
				name: {
					"en": "AES encryption active",
					"de": "AES-VerschlÃ¼sselung aktiv",
					"ru": "ÐÐºÑ‚Ð¸Ð²Ð½Ð¾Ðµ ÑˆÐ¸Ñ„Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ AES",
					"pt": "AES criptografia ativa",
					"nl": "AES-versleuteling actief",
					"fr": "Cryptage AES actif",
					"it": "AES crittografia attiva",
					"es": "AES encriptaciÃ³n activa",
					"pl": "Aktywne szyfrowanie AES",
					"uk": "AES ÑˆÐ¸Ñ„Ñ€ÑƒÐ²Ð°Ð½Ð½Ñ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð°",
					"zh-cn": "AES åŠ å¯†æ´»åŠ¨"
				},
				type: "boolean",
				role: "switch",
				desc: "Created by Adapter",
				def: false,
				read: true,
				write: true
			  },
			native: {},
		});
		await this.adapter.subscribeStatesAsync(`devices.${deviceIDRep}.aesKey_active`);
    }


    private genRandomString(length: number, woCharacters: boolean) : string {
		let result = "";
		let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-\\/&%$!;<>*+#";
		if (woCharacters) {
			characters = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
		}
		const charactersLength = characters.length;
		for ( let i = 0; i < length; i++ ) {
			result += characters.charAt(crypto.randomInt(0, charactersLength));
		}
		return result;
	}

    private async genKey() : Promise<[string, string]> {
		const key = this.genRandomString(512, false);
		const hashedKey = await bcrypt.hash(key, 5);
        return [key, hashedKey];
    }

    private loginDeclined(client: Client) : void {
        client.sendMSG(new LoginDeclinedPacket().toJSON(), false);
    }

	private wrongAesKey(client: Client) : void {
        client.sendMSG(new WrongAesKeyPack().toJSON(), false);
    }
}