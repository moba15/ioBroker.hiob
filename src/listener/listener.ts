import { EventEmitter } from "stream";
import { SamartHomeHandyBis } from "../main";
import { StateChangedDataPack } from "../server/datapacks";
import { Mutex } from "async-mutex";

export enum Events {
    StateChange = "stateChanged",
}
// eslint-disable-next-line no-unused-vars
export class Listener extends EventEmitter {
    static subscribtionThresholdPerInstance = 50;
    adapter;
    busy : boolean = false;
    subsribedStates: Map<string, {overThreshold: boolean, subscribed: Set<string>, pending: Set<string>}> = new Map();
    mutex : Mutex = new Mutex();
    constructor(adapter: SamartHomeHandyBis) {
        super();
        this.adapter = adapter;
    }

    onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state != null) {
            // The state was changed
            //this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            //Check if notification
            if (!id.startsWith("hiob.")) {
                if (this.adapter.valueDatapoints[id] == null) {
                    this.adapter.valueDatapoints[id] = {};
                }
                this.adapter.valueDatapoints[id].val = state.val;
                this.adapter.valueDatapoints[id].ack = state.ack;
                this.adapter.server?.broadcastMsg(
                    new StateChangedDataPack(id, state.val, state.ack, state.lc, state.ts).toJSON()
                );
            }
            this.emit(Events.StateChange, new StateChangeEvent(id, state.val, state.ack));
        } else {
            this.emit("stateDeleted", new StateChangeEvent(id, null, null));
            this.adapter.log.info(`state ${id} deleted`);
        }
    }

    async addPendingSubscribeState(id: string)  {
       this.mutex.runExclusive(async () => {
        const adapaterKey : string = id.split(".")[0] + "." +  id.split(".")[1];
        if(this.subsribedStates.has(adapaterKey)) {
            const t = this.subsribedStates.get(adapaterKey);
            t?.pending.add(id);
        } else {
            this.subsribedStates.set(adapaterKey, {overThreshold: false, subscribed: new Set(), pending:  new Set([id])});
        }
       });
    }
    subscribeToPendingStates() {
        this.mutex.runExclusive(async () => {
            for(const [adapaterKey, subsribedStatesStatus] of this.subsribedStates) {
                if(subsribedStatesStatus.pending.size > 0) {
                    if(subsribedStatesStatus.overThreshold) {
                        subsribedStatesStatus.pending.forEach((e) => subsribedStatesStatus.subscribed.add(e));
                    } else {
                        const newSubscriptionSize = subsribedStatesStatus.pending.size + subsribedStatesStatus.subscribed.size;
                        if(newSubscriptionSize >  Listener.subscribtionThresholdPerInstance) {
                            //Unsubscribe to the exesting subscriptions
                            for(const i of subsribedStatesStatus.subscribed) {
                                this.adapter.unsubscribeForeignStatesAsync(i);
                            }
                            this.adapter.log.debug("More than 50 states of " + adapaterKey + " where subscribed. Now only listening to " + adapaterKey + ".*");
                            //subscribe to adapaterKey.* instead
                            this.adapter.subscribeForeignStates(adapaterKey + ".*");
                        } else {
                            subsribedStatesStatus.pending.forEach((e) => {
                                subsribedStatesStatus.subscribed.add(e);
                                this.adapter.subscribeForeignStates(e);
                            });
                        }
                    }
                    subsribedStatesStatus.pending.clear();
                }
            }
        });
    }
}

export class StateChangeEvent {
    objectID: string;
    value: any;
    ack: any;
    constructor(
        objectID: string,
        value: string | number | boolean | undefined | null,
        ack: boolean | undefined | null,
    ) {
        this.objectID = objectID;
        this.value = value;
        this.ack = ack;
    }
}
