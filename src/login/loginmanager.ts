import { Events, StateChangeEvent } from "../listener/listener";
import { SamartHomeHandyBis } from "../main";
import { Client } from "../server/client";
import { LoginApprovedPacket, LoginDeclinedPacket, LoginKeyPacket, RequestLoginPacket } from "../server/datapacks";
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"
export class LoginManager {
    adapter: SamartHomeHandyBis;
    pendingClients: Client[]
    constructor(adapter: SamartHomeHandyBis) {
        this.adapter = adapter;
        this.adapter.listener.on(Events.StateChange, this.onStateChange.bind(this));
        this.pendingClients = []
    }

    private async onStateChange(event: StateChangeEvent) : Promise<void>  {
		this.adapter.log.debug("Something changed");
		if(event.objectID.startsWith("hiob.")) {
			this.adapter.log.debug("HioB Datapoint changed");
			const splited = event.objectID.split(".");
			if(splited[2] == "devices" && splited[4] == "approved") {
				this.adapter.log.debug("HioB device Datapoint changed");
				const deviceID = splited[3];
				this.adapter.log.debug("DeviceID: " + deviceID.toString());
				//Get Client from pending list;
				const cl = this.pendingClients.find((e) => e.id == deviceID);
				if(cl && event.value) {
					const keys = await this.genKey();
					await this.adapter.setStateAsync("devices." + deviceID + ".key", keys[1], true);
					cl.sendMSG(new LoginKeyPacket(keys[0]).toJSON(), false);

				} else {
					this.adapter.log.debug("No pending client found");
				}
			}
		}


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
        if(!approved || !approved.val) {
            this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): not approved");
            return false;
        }
        if(keyState == null || keyState.val == null) {
            return false;
        }

        if(!await bcrypt.compare(loginRequestData.key, keyState.val.toString())) {
            this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): wrong key");
            return false;
        }
		//TODO: Check for password
        return true;

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