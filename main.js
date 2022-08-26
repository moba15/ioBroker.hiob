"use strict";
/*
 * Created with @iobroker/create-adapter v2.1.1
 */
const adapterName = require("./io-package.json").common.name;
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
// @ts-ignore
const utils = require("@iobroker/adapter-core");
const Server = require("./lib/server.js");
const StateChangedDataPack = require("./lib/datapackages.js");

let server;
let enumDevices;


// Load your modules here, e.g.:
// const fs = require("fs");

class SamartHomeHandyBis extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({...options,name: adapterName,});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		this.on("objectChange", this.onObjectChange.bind(this));
		this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		this.setState("info.connection", false, true); // change to yellow
		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
		await this.setObjectNotExistsAsync("testVariable", {
			type: "state",
			common: {
				name: "testVariable",
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
				smartName: "Name",
			},
			native: {},
		});
		await this.getObjectAsync("test").then((v) => {if(v) v.common.type;});
		await this.setObjectNotExistsAsync("devices.connected", {
			type: "state",
			common: {
				name: "Connected Devices",
				type: "number",
				role: "indicator",
				read: true,
				write: false,
				history: true
			},
			native: {},
		});
		await this.getForeignObjectAsync("test").then((v) => {if(v) v.common.max;});

		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates("lights.*");
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates("*");

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		//await this.setStateAsync("testVariable", true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		//await this.setStateAsync("testVariable", { val: true, ack: true });

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		// await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		//const result = await this.checkPasswordAsync("admin", this.config.option2.toString);
		//this.log.info("check user admin pw iobroker: " + result);

		//result = await this.checkGroupAsync("admin", "admin");
		//this.log.info("check group user admin group admin: " + result)
		this.log.info("Sql Abfrage");
		const a = this;
		this.sendTo("sql.0", "getHistory", {
			id: "*",
			options: {
				end:       Date.now(),
				count:     50,
				aggregate: "onchange",
				addId: true
			}
		}, function (result) {
			if(result) {
				for (let i = 0; i < result.message.result.length; i++) {
					a.log.info(result.message.result[i].id + " " + new Date(result.message.result[i].ts).toISOString());
				}
			}
		});

		this.log.info("Selected port: " + this.config.option1);
		server = new Server(this, this.config.option1);
		server.start();
		//this.log.info("D" + await this.getObjectListJSON());
	}

	writeState(objectID, value) {
		this.setForeignState(objectID, value);
	}

	/**
	 * @param {string} id
	 */
	async getEnumListJSON(id)  {
		enumDevices = await this.getForeignObjectsAsync(id, "enum");
		const list = [];
		for (const i in enumDevices){
			const members = enumDevices[i].common.members;
			const dataPoints = [];
			for(const z in members) {
				const dataPoint = await this.getForeignObjectAsync(members[z]);
				if(!dataPoint)
					continue;
				dataPoints.push({
					"name": dataPoint.common.name,
					"id": members[z],
					"role": dataPoint.common.role,
					"otherDetails": dataPoint.common.custom,
				});
			}
			const map = {
				"id": enumDevices[i]._id,
				"name": enumDevices[i].common.name,
				"icon": enumDevices[i].common.icon,
				"dataPointMembers": dataPoints,
			};
			list.push(map);
		}
		return JSON.stringify(list);
	}

	/**
	 * @param {String} id
	 */
	async getObjectInfo(id)  {
		const dataPoint = await this.getForeignObjectAsync(id);
		if(!dataPoint)
			return;
		const d = {
			"name": dataPoint.common.name,
			"id": id,
			"role": dataPoint.common.role,
			"otherDetails": dataPoint.common,
		};
		return JSON.stringify(d);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);
			server.stop();
			callback();
		} catch (e) {
			callback();
		}
	}

	onMessage(message) {
		this.log.info("message " + message);
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	onObjectChange(id, obj) {
		if (obj) {
			// The object was changed
			this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
		} else {
			// The object was deleted
			this.log.info(`object ${id} deleted`);
		}
	}

	async subscribeToDataPoints(dataPoints, client) {
		this.log.info(JSON.stringify(dataPoints));
		for(const i in dataPoints) {
			//this.log.info("sub to11" + dataPoints[i] );
			const state = await this.getForeignStateAsync(dataPoints[i]);
			if(state) {
				//this.log.info("sub to " + dataPoints[i]);
				this.subscribeForeignStates(dataPoints[i]);
				client.sendMesg(new StateChangedDataPack(dataPoints[i], state.val).toJSON());
			}
		}
	}


	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			//this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
			server.broadcastMsg(new StateChangedDataPack(id, state.val).toJSON());
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }

}
if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new SamartHomeHandyBis(options);
} else {
	// otherwise start the instance directly
	new SamartHomeHandyBis();
}