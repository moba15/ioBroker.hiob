"use strict";

import EventEmitter from "events";
import { SamartHomeHandyBis } from "../main";
import { StateChangedDataPack } from "../server/datapacks";

export enum Events {
    StateChange = "stateChanged",
}
// eslint-disable-next-line no-unused-vars
export class Listener extends EventEmitter {

	adapter
	constructor(adapter: SamartHomeHandyBis) {
		super();
		this.adapter = adapter;
	}



	onStateChange(id: string, state: ioBroker.State | null | undefined) : void {
		if (state != null) {
			// The state was changed
			//this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
			//Check if notification
			if (!id.startsWith("hiob.")) {
				this.adapter.server?.broadcastMsg(new StateChangedDataPack(id, state.val, state.ack).toJSON(), false);
			}
			this.emit(Events.StateChange, new StateChangeEvent(id, state.val, state.ack));
		} else {
			this.emit("stateDeleted", new StateChangeEvent(id, null, null));
			this.adapter.log.info(`state ${id} deleted`);
		}
	}
}

export class StateChangeEvent {
    objectID: string
    value: any
	ack: any
	constructor(objectID: string, value: string | number | boolean | undefined| null, ack: boolean | undefined | null) {
		this.objectID = objectID;
		this.value = value;
		this.ack = ack;
	}
}