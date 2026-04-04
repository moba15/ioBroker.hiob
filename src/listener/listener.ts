import { EventEmitter } from 'stream';
import type { SamartHomeHandyBis } from '../main';
import { Mutex } from 'async-mutex';
import * as proto from '../generated/state/state';
import type { ServerWritableStream } from '@grpc/grpc-js';

export enum Events {
    StateChange = 'stateChanged',
}

export class Listener extends EventEmitter {
    static subscribtionThresholdPerInstance = 15;
    adapter: SamartHomeHandyBis;
    busy: boolean = false;
    subscribedStates: Map<string, { overThreshold: boolean; subscribed: Set<string>; pending: Set<string> }> =
        new Map();
    pendingSubscribeStates: Set<string> = new Set();
    mutex: Mutex = new Mutex();
    subscribedWritersMutex: Mutex = new Mutex();
    subscribedWriters: {
        device: string;
        writer: ServerWritableStream<proto.StateSubscribtion, proto.StatesValueUpdate>;
    }[] = [];
    constructor(adapter: SamartHomeHandyBis) {
        super();
        this.adapter = adapter;
    }

    onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        this.adapter.log.debug(`Send${JSON.stringify(this.pendingSubscribeStates)}`);
        if (state != null) {
            // The state was changed
            this.adapter.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            //Check if notification
            if (!id.startsWith(`${this.adapter.namespace}.`)) {
                const adapterKey = `${id.split('.')[0]}.${id.split('.')[1]}`;
                if (
                    this.subscribedStates.has(adapterKey) &&
                    this.subscribedStates.get(adapterKey)?.subscribed.has(id)
                ) {
                    if (this.adapter.valueDatapoints[id] == null) {
                        this.adapter.valueDatapoints[id] = {};
                    }
                    this.adapter.valueDatapoints[id].val = state.val;
                    this.adapter.valueDatapoints[id].ack = state.ack;
                    const stateValueUpdate = new proto.StateValueUpdate({
                        stateId: id,
                        acc: state.ack,
                        stringValue: state.val?.toString(),
                        time: state.ts,
                    });
                    this.subscribedWriters.forEach(e =>
                        e.writer.write(new proto.StatesValueUpdate({ stateUpdates: [stateValueUpdate] })),
                    );
                }
            }
            this.emit(Events.StateChange, new StateChangeEvent(id, state.val, state.ack));
            this.emit(Events.StateChange + id, new StateChangeEvent(id, state.val, state.ack));
        } else {
            this.emit('stateDeleted', new StateChangeEvent(id, null, null));
            this.adapter.log.info(`state ${id} deleted`);
        }
    }
    /**
     * Adds a State id to the pending list
     *
     * @param id The id of the State you want to subscribe to
     */
    addPendingSubscribeState(id: string): void {
        const adapterKey = `${id.split('.')[0]}.${id.split('.')[1]}`;

        if (!this.subscribedStates.has(adapterKey)) {
            // Create new entry for this adapter
            this.adapter.log.debug(`Creating new subscription entry for adapter: ${adapterKey}`);
            this.subscribedStates.set(adapterKey, {
                overThreshold: false,
                subscribed: new Set(),
                pending: new Set([id]),
            });
        } else {
            const subscribedStatesStatus = this.subscribedStates.get(adapterKey);
            if (subscribedStatesStatus && !subscribedStatesStatus.subscribed.has(id)) {
                this.adapter.log.debug(`Adding state ${id} to pending subscriptions for ${adapterKey}`);
                subscribedStatesStatus.pending.add(id);
            } else {
                this.adapter.log.debug(`State ${id} already subscribed for ${adapterKey}`);
            }
        }
    }
    /**
     * Subscribes to all States listed in the pending (see addPendingSubscribeState)
     * If there are more than 50 subscriptions for one instance it subscribses to all changes inside this instance
     */
    subscribeToPendingStates(): void {
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
            for (const [adapterKey, subscribedStatesStatus] of this.subscribedStates) {
                if (subscribedStatesStatus.pending.size > 0) {
                    this.adapter.log.debug(
                        `Processing ${subscribedStatesStatus.pending.size} pending subscriptions for ${adapterKey}`,
                    );
                    if (subscribedStatesStatus.overThreshold) {
                        this.adapter.log.debug(
                            `Adapter ${adapterKey} already over threshold, adding pending states to subscribed`,
                        );
                        subscribedStatesStatus.pending.forEach(e => subscribedStatesStatus.subscribed.add(e));
                    } else {
                        const newSubscriptionSize =
                            subscribedStatesStatus.pending.size + subscribedStatesStatus.subscribed.size;
                        if (
                            newSubscriptionSize > Listener.subscribtionThresholdPerInstance &&
                            !adapterKey.startsWith('alias.')
                        ) {
                            subscribedStatesStatus.pending.forEach(e => {
                                subscribedStatesStatus.subscribed.add(e);
                            });
                            this.adapter.log.debug(
                                `More than ${Listener.subscribtionThresholdPerInstance} states of ${
                                    adapterKey
                                } were subscribed. Now only listening to ${adapterKey}.*`,
                            );
                            //subscribe to * instead
                            await this.adapter.subscribeForeignStatesAsync(`${adapterKey}.*`);
                            //Unsubscribe to the exesting subscriptions
                            this.adapter.log.debug(
                                `Unsubscribing from ${subscribedStatesStatus.subscribed.size} individual states for ${adapterKey}`,
                            );
                            for (const i of subscribedStatesStatus.subscribed) {
                                await this.adapter.unsubscribeForeignStatesAsync(i);
                            }
                            subscribedStatesStatus.overThreshold = true;
                        } else {
                            this.adapter.log.debug(
                                `Subscribing to ${subscribedStatesStatus.pending.size} individual states for ${adapterKey}`,
                            );
                            subscribedStatesStatus.pending.forEach(e => {
                                subscribedStatesStatus.subscribed.add(e);
                                this.adapter.subscribeForeignStates(e);
                            });
                        }
                    }
                    subscribedStatesStatus.pending.clear();
                }
            }
        });
    }

    addWriter(device: string, writer: ServerWritableStream<proto.StateSubscribtion, proto.StatesValueUpdate>): void {
        this.subscribedWritersMutex.runExclusive(() => {
            this.subscribedWriters.push({
                device: device,
                writer: writer,
            });
        });
    }

    removeWriter(device: string): void {
        this.subscribedWritersMutex.runExclusive(() => {
            this.subscribedWriters = this.subscribedWriters.filter(v => v.device == device);
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
