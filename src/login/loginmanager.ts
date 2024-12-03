import { Events, StateChangeEvent } from "../listener/listener";
import { SamartHomeHandyBis } from "../main";
import { Client } from "../server/client";
import {
    LoginApprovedPacket,
    LoginDeclinedPacket,
    LoginKeyPacket,
    RequestLoginPacket,
    WrongAesKeyPack,
    NewAesPacket,
} from "../server/datapacks";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
export class LoginManager {
    adapter: SamartHomeHandyBis;
    pendingClients: Client[];
    approveLogins: boolean = false;
    approveLoginsTimeout: any;
    aesViewTimeout: { [deviceID: string]: any } = {};
    constructor(adapter: SamartHomeHandyBis) {
        this.adapter = adapter;
        this.adapter.listener.on(Events.StateChange, this.onStateChange.bind(this));
        this.pendingClients = [];
        this.approveLoginsTimeout = undefined;
    }

    private async onStateChange(event: StateChangeEvent): Promise<void> {
        if (event.objectID.startsWith("hiob.") && !event.ack) {
            const splited = event.objectID.split(".");
            //If Datapoint is approved Datapoint
            if (splited.length > 4 && splited[2] == "devices") {
                const deviceID = splited[3];
                if (splited[4] == "approved") {
                    //Get Client from pending list
                    const cl = this.pendingClients.find((e) => e.id == deviceID);
                    //If Approved was set to true
                    if (cl && event.value) {
                        this.setAndSendLoginKeys(deviceID, cl);
                    } else {
                        const client = this.adapter.server?.getClient(deviceID);
                        if (client) {
                            this.setAndSendLoginKeys(deviceID, client);
                        } else {
                            this.adapter.log.debug("No pending client found");
                        }
                    }
                    this.adapter.setStateAsync(event.objectID, {ack: true});
                } else if (splited[4] == "aesKey_active") {
                    const cl = this.pendingClients.find((e) => e.id == deviceID);
                    if (cl) {
                        if (event.value) {
                            this.setAesStatus(deviceID, cl);
                        } else {
                            cl.setAESKey("");
                            if(!this.adapter.server?.useCert) {
                                this.adapter.log.info(`AES encryption disabled!`);
                            }
                        }
                        this.adapter.setState(event.objectID, { ack: true });
                    } else {
                        const client = this.adapter.server?.getClient(deviceID);
                        if (client) {
                            this.setAesStatus(deviceID, client);
                        } else {
                            this.adapter.log.debug("No pending client found");
                        }
                    }
                    this.adapter.setStateAsync(event.objectID, {ack: true});
                } else if (splited[4] == "aesKey_view") {
                    this.viewAesKey(deviceID);
                    this.adapter.setStateAsync(event.objectID, false, true);
                } else if (splited[4] == "aesKey_new") {
                    const cl = this.pendingClients.find((e) => e.id == deviceID);
                    if (cl) {
                        if (event.value) {
                            this.setAesNewAndSentInfo(deviceID, cl);
                        }
                        this.adapter.setState(event.objectID, false, true);
                    } else {
                        const client = this.adapter.server?.getClient(deviceID);
                        if (client && event.value) {
                            this.setAesNewAndSentInfo(deviceID, client);
                        } else {
                            this.adapter.log.debug("No pending client found");
                        }
                    }
                    this.adapter.setStateAsync(event.objectID, false, true);
                } else if (splited[4] == "noPwdAllowed") {
                    this.adapter.setStateAsync(event.objectID, {ack: true});
                }
            } else if (splited[2] == "approveNextLogins") {
                this.setApproveNextLogins(event.value);
            }
        }
    }

    private setApproveNextLogins(value: boolean): void {
        if (value) {
            if (this.approveLoginsTimeout) {
                this.adapter.clearTimeout(this.approveLoginsTimeout);
                this.approveLoginsTimeout = undefined;
            }
            this.approveLogins = true;
            // Start timer without set ack flag true
            this.approveLoginsTimeout = this.adapter.setTimeout(() => {
                this.approveLogins = false;
                this.approveLoginsTimeout = undefined;
            this.adapter.setStateAsync("approveNextLogins", false, true);
            }, 1000 * 60);
        } else {
            this.approveLogins = false;
            this.adapter.setStateAsync("approveNextLogins", {ack: true});
        }
    }

    private async viewAesKey(deviceID: string): Promise<void> {
        if (!this.aesViewTimeout[deviceID]) {
            const state = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey`);
            if (state != null && state.val != null) {
                if (state.val.toString().length > 6) {
                    const dec_shaAes = this.adapter.decrypt(state.val.toString());
                    await this.adapter.setStateAsync(`devices.${deviceID}.aesKey`, dec_shaAes, true);
                }
            } else {
                return;
            }
            this.aesViewTimeout[deviceID] = this.adapter.setTimeout( async () => {
                const state = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey`);
                if (state != null && state.val != null) {
                    if (state.val.toString().length === 6) {
                        const shaAes = this.adapter.encrypt(state.val.toString());
                        await this.adapter.setStateAsync(`devices.${deviceID}.aesKey`, shaAes, true);
                    }
                }
                this.aesViewTimeout[deviceID] = undefined;
            }, 1000 * 60);
        }
    }

    private async setAesNewAndSentInfo(deviceID: string, cl: Client): Promise<void> {
        if (this.aesViewTimeout[deviceID]) {
            this.adapter.clearTimeout(this.aesViewTimeout[deviceID]);
            this.aesViewTimeout[deviceID] = undefined;
        }
        const random_key = this.genRandomString(6, true);
        await this.adapter.setStateAsync(`devices.${deviceID}.aesKey`, this.adapter.encrypt(random_key.toString()), true);
        cl.aesKey = random_key;
        cl.setAESKey(random_key);
        cl.sendMSG(new NewAesPacket().toJSON(), false);
    }

    private async setAesStatus(deviceID: string, cl: Client): Promise<void> {
        const get_aes = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey`);
        const aes_status = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey_active`);
        if (get_aes && get_aes.val && aes_status && aes_status.val) {
            if (get_aes.val.toString().length > 6) {
                get_aes.val = this.adapter.decrypt(get_aes.val.toString());
            }
            cl.setAESKey(get_aes.val.toString());
            this.adapter.log.info(`AES encryption enabled!`);
        } else {
            cl.setAESKey("");
            if(!this.adapter.server?.useCert) {
                this.adapter.log.info(`AES encryption disabled!`);
            }
        }
    }

    private async setAndSendLoginKeys(deviceID: string, cl: Client): Promise<void> {
        const keys = await this.genKey();
        const aes_status = await this.adapter.getStateAsync("devices." + deviceID + ".aesKey_active");
        if (aes_status && aes_status.val) {
            const aes = await this.adapter.getStateAsync("devices." + deviceID + ".aesKey");
            if (aes != null && aes.val != null) {
                if (aes.val.toString().length > 6) {
                    aes.val = this.adapter.decrypt(aes.val.toString());
                }
                cl.setAESKey(aes.val.toString());
            } else {
                cl.setAESKey("");
            }
        } else {
            cl.setAESKey("");
        }
        await this.adapter.setStateAsync("devices." + deviceID + ".key", keys[1], true);
        for (const current of this.pendingClients) {
            if (current.id == cl.id) {
                current.sendMSG(new LoginKeyPacket(keys[0]).toJSON(), false, false);
            }
        }
    }

    public async stop(): Promise<boolean> {
        this.approveLoginsTimeout && this.adapter.clearTimeout(this.approveLoginsTimeout);
        this.approveLoginsTimeout = undefined;
        if (this.aesViewTimeout && Object.keys(this.aesViewTimeout).length > 0) {
            for (const cl in this.aesViewTimeout) {
                this.aesViewTimeout[cl] && this.adapter.clearTimeout(this.aesViewTimeout[cl]);
                this.aesViewTimeout[cl] = undefined;
            }
        }
        return false;
    }

    public async onWrongAesKey(client: Client): Promise<boolean> {
        this.adapter.log.debug("Client(" + client.toString() + ") send wrong aes!");
        this.wrongAesKey(client);
        return false;
    }

    public async onLoginRequest(client: Client, loginRequestData: RequestLoginPacket): Promise<boolean> {
        this.adapter.log.debug("Client(" + client.toString() + ") requested to login");
        this.pendingClients.push(client);
        this.pendingClients = this.pendingClients.filter((cli, i, s) => s.indexOf(cli) == i);
        let deviceIDRep = loginRequestData.deviceID.replace(".", "-");
        while (deviceIDRep.includes(".")) {
            deviceIDRep = deviceIDRep.replace(".", "-");
        }client.id = deviceIDRep;
        if (!this.adapter.clientinfos[deviceIDRep] || !this.adapter.clientinfos[deviceIDRep].firstload) {
            this.adapter.clientinfos[deviceIDRep] = {};
        }
        //!Quick fix
        await this.createObjects(
            client,
            deviceIDRep,
            loginRequestData.deviceName,
            loginRequestData.key,
            loginRequestData.version,
        );
        this.adapter.clientinfos[deviceIDRep].firstload = true;
        this.adapter.setStateAsync("devices." + deviceIDRep + ".connected", true, true);
        client.setID(deviceIDRep);
        if (!(await this.validateLoginRequest(client, deviceIDRep, loginRequestData))) {
            this.loginDeclined(client);
            return false;
        }
        this.pendingClients = this.pendingClients.filter((cl, ) => cl != client);
        await this.setAesStatus(deviceIDRep, client);
        client.onApprove();
        const version = this.adapter.version != null ? this.adapter.version.toString() : "";
        client.sendMSG(new LoginApprovedPacket(version).toJSON(), false);
        return true;
    }

    private async validateLoginRequest(
        client: Client,
        deviceIDRep: string,
        loginRequestData: RequestLoginPacket,
    ): Promise<boolean> {
        const approved = await this.adapter.getStateAsync("devices." + deviceIDRep + ".approved");
        const keyState = await this.adapter.getStateAsync("devices." + deviceIDRep + ".key");
        const needPWD = await this.adapter.getStateAsync("devices." + deviceIDRep + ".noPwdAllowed");
        //Check if next should be accepted:
        let apr = true;
        if (!approved || !approved.val) {
            this.adapter.log.debug(
                "Login declined for client: " +
                    client.toString() +
                    " (" +
                    loginRequestData.deviceName +
                    "): not approved",
            );
            apr = false;
        }
        if (keyState == null || keyState.val == null) {
            apr = false;
        }
        if (!loginRequestData.key) {
            apr = false;
        }

        if (needPWD && !needPWD?.val) {
            if (
                !loginRequestData.user ||
                !loginRequestData.password ||
                !(await this.adapter.checkPasswordAsync(loginRequestData.user, loginRequestData.password))
            ) {
                this.adapter.log.debug(
                    "Login declined for client: " +
                        client.toString() +
                        " (" +
                        loginRequestData.deviceName +
                        "): wrong password",
                );
                apr = false;
            }
        }
        if (loginRequestData.key == null) {
            apr = false;
        }
        if (
            keyState != null &&
            keyState.val != null &&
            loginRequestData.key &&
            !(await bcrypt.compare(loginRequestData.key, keyState.val.toString()))
        ) {
            this.adapter.log.debug(
                "Login declined for client: " +
                    client.toString() +
                    " (" +
                    loginRequestData.deviceName +
                    "): wrong key" +
                    !(await bcrypt.compare(loginRequestData.key, keyState.val.toString())),
            );
            apr = false;
        }
        if (!apr && this.approveLogins) {
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
    private async createObjects(
        client: Client,
        deviceIDRep: string,
        deviceName: string,
        key: string,
        version: string,
    ): Promise<void> {
        await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}`, {
            type: "channel",
            common: {
                name: deviceName,
                desc: "Created by Adapter",
            },
            native: {},
        });
        // Delete setObjectAsync after first latest release -->
        await this.adapter.setObjectAsync(`devices.${deviceIDRep}`, {
            type: "channel",
            common: {
                name: deviceName,
                desc: "Created by Adapter",
            },
            native: {},
        });
        // <-- Delete setObjectAsync after first latest release
        await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.connected`, {
            type: "state",
            common: {
                name: {
                    en: "Connected",
                    de: "Verbunden",
                    ru: "Соединение",
                    pt: "Conectado",
                    nl: "Verbonden",
                    fr: "Connecté",
                    it: "Collegato",
                    es: "Conectado",
                    pl: "Połączone",
                    uk: "Зв'язатися",
                    "zh-cn": "已连接",
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
                    en: "APP Version",
                    de: "APP-Version",
                    ru: "Версия APP",
                    pt: "Versão do APP",
                    nl: "Versie APP",
                    fr: "Version APP",
                    it: "Versione APP",
                    es: "Versión APP",
                    pl: "Wersja APP",
                    uk: "Версія APP",
                    "zh-cn": "APP 版本",
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
        await this.adapter.setObjectAsync(`devices.${deviceIDRep}.name`, {
            type: "state",
            common: {
                name: {
                    en: "Name",
                    de: "Name",
                    ru: "Имя",
                    pt: "Nome",
                    nl: "Naam",
                    fr: "Dénomination",
                    it: "Nome",
                    es: "Nombre",
                    pl: "Nazwa",
                    uk: "Ім'я",
                    "zh-cn": "名称",
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
                    en: "ID",
                    de: "ID",
                    ru: "ID",
                    pt: "ID",
                    nl: "ID",
                    fr: "NUMÉRO",
                    it: "ID",
                    es: "ID",
                    pl: "ID",
                    uk: "ІМ'Я",
                    "zh-cn": "身份证",
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
                    en: "Key",
                    de: "Schlüssel",
                    ru: "Ключ",
                    pt: "Chaveiro",
                    nl: "Sleutel",
                    fr: "Clé",
                    it: "Chiave",
                    es: "Clave",
                    pl: "Klucz",
                    uk: "Головна",
                    "zh-cn": "密钥",
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
                    en: "Last Connection",
                    de: "Letzte Verbindung",
                    ru: "Последнее соединение",
                    pt: "Última conexão",
                    nl: "Laatste verbinding",
                    fr: "Dernière connexion",
                    it: "Ultima connessione",
                    es: "Última conexión",
                    pl: "Ostatnie połączenie",
                    uk: "Останнє підключення",
                    "zh-cn": "上次连接",
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

        this.adapter.setState(`devices.${deviceIDRep}.lastConnection`, Date.now(), true);

        await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.approved`, {
            type: "state",
            common: {
                name: {
                    en: "Approved",
                    de: "Genehmigt",
                    ru: "Утвержденные",
                    pt: "Aprovado",
                    nl: "Goedgekeurd",
                    fr: "Approuvé",
                    it: "Approvazione",
                    es: "Aprobado",
                    pl: "Zatwierdzone",
                    uk: "Затвердження",
                    "zh-cn": "核定数",
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
                    en: "No Password Allowed",
                    de: "Kein Passwort erlaubt",
                    ru: "Без пароля",
                    pt: "Nenhuma senha permitida",
                    nl: "Geen wachtwoord toegestaan",
                    fr: "Pas de mot de passe autorisé",
                    it: "Nessuna password consentita",
                    es: "No se admite contraseña",
                    pl: "Brak hasła",
                    uk: "Немає пароля",
                    "zh-cn": "没有允许的密码",
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
                    en: "Send Notification",
                    de: "Mitteilung senden",
                    ru: "Отправить уведомление",
                    pt: "Enviar notificação",
                    nl: "Kennisgeving versturen",
                    fr: "Envoyer une notification",
                    it: "Invia notifica",
                    es: "Enviar notificación",
                    pl: "Wyślij powiadomienie",
                    uk: "Надіслати повідомлення",
                    "zh-cn": "发送通知",
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
        await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.notificationBacklog`, {
            type: "state",
            common: {
                name: {
                    en: "Notification Backlog",
                    de: "Rückstand bei der Benachrichtigung",
                    ru: "Уведомления",
                    pt: "Atraso de notificação",
                    nl: "Kennisgeving Achterstand",
                    fr: "Carnet de notifications",
                    it: "Arretrati di notifica",
                    es: "Notificaciones atrasadas",
                    pl: "Zaległości w powiadomieniach",
                    uk: "Відставання сповіщень",
                    "zh-cn": "通知积压",
                },
                type: "array",
                role: "state",
                desc: "Created by Adapter",
                def: "",
                read: true,
                write: false,
            },
            native: {},
        });
        await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey_view`, {
            type: "state",
            common: {
                name: {
                    "en": "decrypt AES key for 30 seconds.",
                    "de": "AES Schlüssel für 30 Sekunden entschlüsseln.",
                    "ru": "расшифровать ключ AES в течение 30 секунд.",
                    "pt": "descriptografar AES chave por 30 segundos.",
                    "nl": "decodeer AES sleutel gedurende 30 seconden.",
                    "fr": "déchiffrer la clé AES pendant 30 secondes.",
                    "it": "decifrare la chiave AES per 30 secondi.",
                    "es": "descifrar la tecla AES durante 30 segundos.",
                    "pl": "odszyfrować klucz AES przez 30 sekund.",
                    "uk": "розшифрувати ключ AES на 30 секунд.",
                    "zh-cn": "解密AES密钥30秒."
                },
                type: "boolean",
                role: "button",
                desc: "Created by Adapter",
                def: false,
                read: true,
                write: true,
            },
            native: {},
        });
        await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey`, {
            type: "state",
            common: {
                name: {
                    en: "Insert AES-key into the APP.",
                    de: "AES-key in die APP einfügen.",
                    ru: "Вставить AES-ключ в APP.",
                    pt: "Insira o AES-key no APP.",
                    nl: "Plaats AES-toets in de APP.",
                    fr: "Insérer la touche AES dans l'APP.",
                    it: "Inserire AES-chiave nella APP.",
                    es: "Inserte AES-key en el APP.",
                    pl: "Wstaw klucz AES- do APP.",
                    uk: "Вставте AES-ключ у APP.",
                    "zh-cn": "在APP中插入AES键.",
                },
                type: "string",
                role: "state",
                desc: "Created by Adapter",
                def: "",
                read: true,
                write: false,
            },
            native: {},
        });
        const get_aes = await this.adapter.getStateAsync(`devices.${deviceIDRep}.aesKey`);
        const random_key = this.genRandomString(6, true);
        if (!get_aes || get_aes.val == null || get_aes.val == "") {
            await this.adapter.setStateAsync(`devices.${deviceIDRep}.aesKey`, this.adapter.encrypt(random_key.toString()), true);
            client.aesKey = random_key;
        } else if (get_aes != null && typeof get_aes.val === "string") {
            if (get_aes.val.toString().length > 6) {
                get_aes.val = this.adapter.decrypt(get_aes.val.toString());
            }
            client.aesKey = get_aes.val;
        } else {
            this.adapter.log.warn("Cannot find AES Key. Please Restart Adapter!");
        }
        await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey_new`, {
            type: "state",
            common: {
                name: {
                    en: "Create new AES-Key",
                    de: "Neue AES-Key erstellen",
                    ru: "Создать новые AES-Key",
                    pt: "Criar novo AES-Key",
                    nl: "Nieuwe AES-sleutel aanmaken",
                    fr: "Créer une nouvelle clé AES",
                    it: "Crea nuovo AES-Key",
                    es: "Crear nuevo AES-Key",
                    pl: "Utwórz nowy klucz AES-",
                    uk: "Створення нових AES-Key",
                    "zh-cn": "创建新 AES 密钥",
                },
                type: "boolean",
                role: "button",
                desc: "Created by Adapter",
                def: false,
                read: true,
                write: true,
            },
            native: {},
        });
        await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey_active`, {
            type: "state",
            common: {
                name: {
                    en: "AES encryption active",
                    de: "AES-Verschlüsselung aktiv",
                    ru: "Активное шифрование AES",
                    pt: "AES criptografia ativa",
                    nl: "AES-versleuteling actief",
                    fr: "Cryptage AES actif",
                    it: "AES crittografia attiva",
                    es: "AES encriptación activa",
                    pl: "Aktywne szyfrowanie AES",
                    uk: "AES шифрування активна",
                    "zh-cn": "AES 加密活动",
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
    }

    private genRandomString(length: number, woCharacters: boolean): string {
        let result = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-\\/&%$!;<>*+#";
        if (woCharacters) {
            characters = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
        }
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(crypto.randomInt(0, charactersLength));
        }
        return result;
    }

    private async genKey(): Promise<[string, string]> {
        const key = this.genRandomString(512, false);
        const hashedKey = await bcrypt.hash(key, 5);
        return [key, hashedKey];
    }

    private loginDeclined(client: Client): void {
        client.sendMSG(new LoginDeclinedPacket().toJSON(), false);
    }

    private wrongAesKey(client: Client): void {
        client.sendMSG(new WrongAesKeyPack().toJSON(), false);
    }
}
