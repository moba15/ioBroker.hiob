import { EventEmitter } from "stream";
import { SamartHomeHandyBis } from "../main";
import { StateChangedDataPack } from "../server/datapacks";
import { Mutex } from "async-mutex";
import * as proto from "../generated/state/state";
import { ServerWritableStream } from "@grpc/grpc-js";

export enum Events {
    StateChange = "stateChanged",
}
// eslint-disable-next-line no-unused-vars 
export class Listener extends EventEmitter {
    static subscribtionThresholdPerInstance = 15;
    adapter : SamartHomeHandyBis;
    busy : boolean = false;
    subsribedStates: Map<string, {overThreshold: boolean, subscribed: Set<string>, pending: Set<string>}> = new Map();
    //subscribedStates: Set<string> = new Set();
    pendingSubscribeStates: Set<string> = new Set();
    mutex : Mutex = new Mutex();
    subscribedWritersMutex : Mutex = new Mutex();
    subscribedWriters: {device: string, writer: ServerWritableStream<proto.StateSubscribtion, proto.StatesValueUpdate>}[] = [];
    constructor(adapter: SamartHomeHandyBis) {
        super();
        this.adapter = adapter;
    }

    onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        this.adapter.log.debug("Send" + JSON.stringify(this.pendingSubscribeStates));
        if (state != null) {
            // The state was changed
            //this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            //Check if notification
            if (!id.startsWith("hiob.")) {
                const adapaterKey : string = id.split(".")[0] + "." +  id.split(".")[1];
                if(this.subsribedStates.has(adapaterKey) && this.subsribedStates.get(adapaterKey)?.subscribed.has(id)) {
                    if (this.adapter.valueDatapoints[id] == null) {
                        this.adapter.valueDatapoints[id] = {};
                    }
                    this.adapter.valueDatapoints[id].val = state.val;
                    this.adapter.valueDatapoints[id].ack = state.ack;
                    this.adapter.server?.broadcastMsg(
                        new StateChangedDataPack(id, state.val, state.ack, state.lc, state.ts).toJSON()
                    );
                    const stateValueUpdate = new proto.StateValueUpdate({stateId: id, acc: state.ack, stringValue: state.val?.toString(), time: state.ts});
                    this.subscribedWriters.forEach((e) => e.writer.write(new proto.StatesValueUpdate({stateUpdates: [stateValueUpdate]})))

                }
            }
            this.emit(Events.StateChange, new StateChangeEvent(id, state.val, state.ack));
            this.emit(Events.StateChange + id, new StateChangeEvent(id, state.val, state.ack));
        } else {
            this.emit("stateDeleted", new StateChangeEvent(id, null, null));
            this.adapter.log.info(`state ${id} deleted`);
        }
    }
    /**
     * Adds a State id to the pending list
     * @param id The id of the State you want to subscribe to
     */
    addPendingSubscribeState(id: string) : void {
       this.mutex.runExclusive(async () => {
        this.pendingSubscribeStates.add(id);
        const adapaterKey : string = id.split(".")[0] + "." +  id.split(".")[1];
        if(this.subsribedStates.has(adapaterKey)) {
            const t = this.subsribedStates.get(adapaterKey);
            if(!t!.subscribed.has(id)) {
                t?.pending.add(id);
            } else {
                this.adapter.log.debug("Already has subscribed to " + id + "!");
            }
        } else {
            this.subsribedStates.set(adapaterKey, {overThreshold: false, subscribed: new Set(), pending:  new Set([id])});
        }
       });
    }
    /**
     * Subscribes to all States listed in the pending (see addPendingSubscribeState)
     * If there are more than 50 subscriptions for one instance it subscribses to all changes inside this instance
     */
    subscribeToPendingStates() : void {
        this.mutex.runExclusive(async () => {
            
               /* if(this.subscribedStates.size + this.pendingSubscribeStates.size >= Listener.subscribtionThresholdPerInstance) {
                    this.adapter.log.debug("More than 50 states. Subscribing to *")
                    await this.adapter.subscribeForeignStatesAsync("*");
                    this.subscribedStates.forEach((e) => this.adapter.unsubscribeForeignStatesAsync(e));
                    this.pendingSubscribeStates.forEach((e) => this.subscribedStates.add(e));
                } else {
                    this.pendingSubscribeStates.forEach((e) => this.adapter.subscribeForeignStatesAsync(e));
                }
                this.pendingSubscribeStates.clear();*/
            for(const [adapaterKey, subsribedStatesStatus] of this.subsribedStates) {
                if(subsribedStatesStatus.pending.size > 0) {
                    if(subsribedStatesStatus.overThreshold) {
                        subsribedStatesStatus.pending.forEach((e) => subsribedStatesStatus.subscribed.add(e));
                    } else {
                        const newSubscriptionSize = subsribedStatesStatus.pending.size + subsribedStatesStatus.subscribed.size;
                        if(newSubscriptionSize >  Listener.subscribtionThresholdPerInstance && !adapaterKey.startsWith("alias.")) {
                            subsribedStatesStatus.pending.forEach((e) => {
                                subsribedStatesStatus.subscribed.add(e);
                            });
                            this.adapter.log.debug("More than " + Listener.subscribtionThresholdPerInstance + " states of " + adapaterKey + " were subscribed. Now only listening to " + adapaterKey + ".*");
                            //subscribe to * instead
                            await this.adapter.subscribeForeignStatesAsync(adapaterKey + ".*");
                            //Unsubscribe to the exesting subscriptions
                            for(const i of subsribedStatesStatus.subscribed) {
                                this.adapter.unsubscribeForeignStatesAsync(i);
                            }
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

    addWriter(device: string, writer: ServerWritableStream<proto.StateSubscribtion, proto.StatesValueUpdate>) : void {
        this.subscribedWritersMutex.runExclusive(() => {
            this.subscribedWriters.push({
                device: device,
                writer: writer
            });
        });
    }

    removeWriter(device: string) : void {
        this.subscribedWritersMutex.runExclusive(() => {
            this.subscribedWriters = this.subscribedWriters.filter((v) => v.device == device);
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
