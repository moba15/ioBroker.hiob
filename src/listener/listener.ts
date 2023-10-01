"use strict";

import EventEmitter from "events";
import { HiobTs } from "../main";
import { StateChangedDataPack } from "../server/datapacks";

export enum Events {
    StateChange = "stateChanged",
}
// eslint-disable-next-line no-unused-vars
export class Listener extends EventEmitter {

	adapter
	constructor(adapter: HiobTs) {
		super();
		this.adapter = adapter;
	}



	onStateChange(id: string, state: ioBroker.State | null | undefined) : void {
		if (state != null) {
			// The state was changed
			//this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
			this.adapter.log.debug("State chnaged:" + state.toString());
			this.adapter.server?.broadcastMsg(new StateChangedDataPack(id, state.val).toJSON());
			this.emit(Events.StateChange, new StateChangeEvent(id, state.val));
		} else {
			this.emit("stateDeleted", new StateChangeEvent(id, null));
			this.adapter.log.info(`state ${id} deleted`);
		}
	}
}

export class StateChangeEvent {
    objectID
    value
	constructor(objectID: string, value: string | number | boolean | undefined| null) {
		this.objectID = objectID;
		this.value = value;
	}
}