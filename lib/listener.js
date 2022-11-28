"use strict";

const StateChangedDataPack = require("./datapackages");
const EventEmitter = require("events").EventEmitter;
// eslint-disable-next-line no-unused-vars
class Listener extends EventEmitter{

	/**
     * @param [adapter]
     */
	constructor(adapter) {
		super();
		this.adapter = adapter;
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
			this.adapter.server.broadcastMsg(new StateChangedDataPack(id, state.val).toJSON());
			this.emit("stateChanged", new StateChangeEvent(id, state.val));
		} else {
			this.emit("stateDeleted", new StateChangeEvent(id, null));
			this.adapter.log.info(`state ${id} deleted`);
		}
	}
}

module.exports = Listener;

class StateChangeEvent {
	/**
     * @param {string} objectID
     * @param {string | number | boolean | null} value
     */
	constructor(objectID, value) {
		this.objectID = objectID;
		this.value = value;
	}
}