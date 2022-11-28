// eslint-disable-next-line no-unused-vars
const Adapter = require("../../main.js");
const crypto = require("crypto");

// eslint-disable-next-line no-unused-vars
const { Client, Server, LoginApprovedPacket, LoginDeclinedPacket, LoginKeyPacket} = require("../server.js");


class LoginManager {

	/**
     * @param {Adapter} adapter
     */
	constructor(adapter) {
		this.adapter = adapter;
		this.loginedClients = [];
		this.pendingClients = [];
		this.adapter.listener.on("stateChanged", this.onStateChange.bind(this));
	}




	/**
	 * @param {Client} client
	 * @param {string} deviceName
	 * @param {string} deviceID
	 * @param {string} key
	 * @param {any} user
	 * @param {any} password
	 */
	async onLoginRequest(client, deviceName, deviceID, key, user, password)  {
		let deviceIDRep = deviceID.replace(".", "-");
		while(deviceIDRep.includes(".")) {
			deviceIDRep = deviceIDRep.replace(".", "-");
		}
		client.deviceID = deviceIDRep;
		this.adapter.log.debug("Login request: " + client.toString());
		this.adapter.log.debug("Object does not exist");
		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep, {
			type: "device",
			common: {
				name: deviceName,
			},
			native: {},
		});

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

		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".name", {
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

		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".id", {
			type: "state",
			common: {
				name: "ID",
				type: "string",
				role: "info.address",
				def: deviceID,
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


		await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".date", {
			type: "state",
			common: {
				name: "Date",
				type: "string",
				role: "date",
				def: Date.now().toString(),
				read: true,
				write: true,
			},
			native: {},
		});


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
		this.adapter.subscribeStatesAsync("devices." + deviceIDRep + ".approved");

		this.adapter.setStateAsync("devices." + deviceIDRep + ".connected", true, true);
		const approved = await this.adapter.getStateAsync("devices." + deviceIDRep + ".approved");
		const keyState = await this.adapter.getStateAsync("devices." + deviceIDRep + ".key");
		if(approved) {
			if(approved.val) {
				// @ts-ignore
				if(keyState.val == key) {
					const pw = await this.adapter.checkPasswordAsync(user, password);
					if(pw == "true,system.user." + user) {
						this.adapter.log.debug("Login approved for client: " + client.toString() + " (" + deviceName + ") " + pw);
						this.loginApprove(client);
					} else {
						this.loginDeclinedWrongKey(client,deviceIDRep);
					}
				} else {
					this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + deviceName + ") Reason: wrong key");
					this.loginDeclinedWrongKey(client,deviceIDRep);
				}
			} else {
				this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + deviceName + ") Reason: not approved");
				this.loginDeclinedNotApproved(client, deviceIDRep);
			}


		} else  {
			// @ts-ignore
			this.adapter.log.error("States not found to approve login from client " + deviceName + "   "  + deviceIDRep) ;
		}
	}



	/**
	 * @param {Client} client
	 */
	loginApprove(client) {
		//TODO: Send packet
		client.sendMesg(new LoginApprovedPacket().toJSON(), false );
		client.onApprove();
	}

	/**
	 * @param {Client} client
	 * @param {string} deviceIDRep
	 */
	loginDeclinedWrongKey(client, deviceIDRep) {
		this.adapter.setStateAsync("devices." + deviceIDRep + ".approved", false, true);
		this.adapter.setStateAsync("devices." + deviceIDRep + ".key", null, true);
		//TODO: Send Packet
		client.sendMesg(new LoginDeclinedPacket().toJSON(), false);
		this.pendingClients.push(client);

	}

	/**
	 * @param {Client} client
	 * @param {string} deviceIDRep
	 */
	loginDeclinedNotApproved(client, deviceIDRep) {
		this.adapter.setStateAsync("devices." + deviceIDRep + ".key", null, true);
		//TODO: Send Packet
		client.sendMesg(new LoginDeclinedPacket().toJSON(), false);
		this.pendingClients.push(client); //TODO: Remove if disconnected

	}


	/**
	 * @param {{ objectID: string; value: boolean; }} event
	 */
	async onStateChange(event)   {
		if(event.objectID.startsWith("hiob.")) {
			this.adapter.log.debug("HioB Datapoint changed");
			const splited = event.objectID.split(".");
			if(splited[2] == "devices" && splited[4] == "approved") {
				this.adapter.log.debug("HioB device Datapoint changed");
				const deviceID = splited[3];
				this.adapter.log.debug("DeviceID: " + deviceID.toString());
				//Get Client from pending list;
				const cl = this.pendingClients.find((e) => e.deviceID == deviceID);
				if(cl && event.value) {
					const keyString = this.makeid(512);
					await this.adapter.setStateAsync("devices." + deviceID + ".key", keyString, true);
					cl.sendMesg(new LoginKeyPacket(keyString).toJSON());

				} else {
					this.adapter.log.debug("No pending client found");
				}
			}
		}


	}


	/**
	 * @param {number} length
	 */
	makeid(length) {
		let result           = "";
		const characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-\\/&%$!;<>*+#";
		const charactersLength = characters.length;
		for ( let i = 0; i < length; i++ ) {
			result += characters.charAt(crypto.randomInt(0, charactersLength));
		}
		return result;
	}




}



module.exports = {
	LoginManager,
};