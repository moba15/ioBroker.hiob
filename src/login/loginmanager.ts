import { Events, StateChangeEvent } from "../listener/listener";
import { SamartHomeHandyBis } from "../main";
import { Client } from "../server/client";
import { LoginApprovedPacket, LoginDeclinedPacket, LoginKeyPacket, RequestLoginPacket } from "../server/datapacks";
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

		if(event.objectID.startsWith("hiob.")) {
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


	private async setAndSendLoginKeys(deviceID: string , cl: Client) : Promise<void> {
		const keys = await this.genKey();
		await this.adapter.setStateAsync("devices." + deviceID + ".key", keys[1], true);
		cl.sendMSG(new LoginKeyPacket(keys[0]).toJSON(), false);
	}

	public async onLoginRequest(client: Client, loginRequestData: RequestLoginPacket ) : Promise<boolean> {
        this.adapter.log.debug("Client(" + client.toString() + ") requested to login")
        this.pendingClients.push(client);
        let deviceIDRep = loginRequestData.deviceID.replace(".", "-");
		while(deviceIDRep.includes(".")) {
			deviceIDRep = deviceIDRep.replace(".", "-");
		}
		client.id = deviceIDRep;
        this.createObjects(deviceIDRep, loginRequestData.deviceName, loginRequestData.key);
        this.adapter.subscribeStatesAsync("devices." + deviceIDRep + ".approved");
        this.adapter.setStateAsync("devices." + deviceIDRep + ".connected", true, true);
        if(!await this.validateLoginRequest(client, deviceIDRep, loginRequestData)) {
            this.loginDeclined(client);
			return false;
        }
		this.pendingClients.filter((cl, i) => cl != client);
		client.onApprove();
		client.sendMSG(new LoginApprovedPacket().toJSON(), false);
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
        if( keyState != null && keyState.val != null && loginRequestData.key  && ! (await bcrypt.compare( keyState.val.toString(), loginRequestData.key))) {
            this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): wrong key");
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

    private async createObjects(deviceIDRep: string, deviceName: string, key: string) : Promise<void>{
        await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".connected", {
			type: "state",
			common: {
				name: "Connected",
				type: "boolean",
				role: "indicator.reachable",
				def: true,
				read: true,
				write: false,
			},
			native: {},
		});
		await this.adapter.setObjectAsync("devices." + deviceIDRep , {
			type: "folder",
			common: {
				name: deviceName,
			},
			native: {},
		});

		await this.adapter.setObjectAsync("devices." + deviceIDRep + ".name", {
			type: "state",
			common: {
				name: "Name",
				type: "string",
				role: "info.name",
				def: deviceName,
				read: true,
				write: false,
			},
			native: {},
		});

		await this.adapter.setStateAsync("devices." + deviceIDRep + ".name", deviceName, true);

		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".id", {
			type: "state",
			common: {
				name: "ID",
				type: "string",
				role: "info.address",
				def: deviceIDRep,
				read: true,
				write: false,
			},
			native: {},
		});

		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".key", {
			type: "state",
			common: {
				name: "Key",
				type: "string",
				role: "key",
				def: key,
				read: false,
				write: false,
			},
			native: {},
		});


		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".lastConnection", {
			type: "state",
			common: {
				name: "Last Connection",
				type: "number",
				role: "date",
				def: Date.now(),
				read: true,
				write: true,
			},
			native: {}, 
		});

		this.adapter.setState("devices." + deviceIDRep + ".lastConnection", Date.now())


		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".approved", {
			type: "state",
			common: {
				name: "Approved",
				type: "boolean",
				role: "indicator",
				def: false,
				read: true,
				write: true,
			},
			native: {},
		});

		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".noPwdAllowed", {
			type: "state",
			common: {
				name: "No Pwd Allowed",
				type: "boolean",
				role: "indicator",
				def: false,
				read: true,
				write: true,
			},
			native: {},
		});


		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".sendNotification", {
			type: "state",
			common: {
				name: "Send Notification",
				type: "string",
				role: "indicator", //TODO: Indicator
				def: "",
				read: true,
				write: true,
			},
			native: {},
		});
		await this.adapter.subscribeStatesAsync("devices." + deviceIDRep  + ".sendNotification");
    }

    private genRandomString(length: number) : string {
		let result           = "";
		const characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-\\/&%$!;<>*+#";
		const charactersLength = characters.length;
		for ( let i = 0; i < length; i++ ) {
			result += characters.charAt(crypto.randomInt(0, charactersLength));
		}
		return result;
	}

    private async genKey() : Promise<[string, string]> {
		const key = this.genRandomString(512);
		const hashedKey = await bcrypt.hash(key, 5);
        return [key, hashedKey];
    }

    private loginDeclined(client: Client) : void {
        client.sendMSG(new LoginDeclinedPacket().toJSON(), false);
    }

}