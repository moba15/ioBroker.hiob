/* eslint-disable @typescript-eslint/no-base-to-string */
import type * as m from '../..//main';
import * as grpc from '@grpc/grpc-js';
import * as proto from '../../generated/state/state';
import type { SearchStateResponse, StateSubscribtion } from '../../generated/state/state';
import { checkAuthentication } from './authenticator/authenticator';

export function addStateServices(gRpcServer: grpc.Server, adapter: m.SamartHomeHandyBis): void {
    gRpcServer.addService(proto.StateUpdateClient.service, {
        Subscibe: async (call: grpc.ServerWritableStream<StateSubscribtion, proto.StatesValueUpdate>) => {
            const authStatus = await checkAuthentication(call.metadata, adapter);
            if (authStatus.code != grpc.status.OK) {
                call.emit('error', authStatus);
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = await adapter.subscribeToDataPointsProto(call.request.stateIds, call);
            const id = call.metadata.get('deviceId')[0].toString();
            adapter.listener.addWriter(id, call);
        },
        UpdateValue: async (
            call: grpc.ServerUnaryCall<proto.StateValueUpdateRequest, proto.StateValueUpdateResponse>,
            _callback: grpc.sendUnaryData<proto.StateValueUpdateResponse>,
        ) => {
            adapter.log.debug(`Update value for state ${call.request.stateId} to ${call.request.value}`);
            const authStatus = await checkAuthentication(call.metadata, adapter);
            if (authStatus.code != grpc.status.OK) {
                call.emit('error', authStatus);
                return;
            }
            // Extract the actual value from the request based on the selected value variant
            let valueToSet: any;
            switch (call.request.value) {
                case 'stringValue':
                    valueToSet = call.request.stringValue;
                    break;
                case 'boolValue':
                    valueToSet = call.request.boolValue;
                    break;
                case 'doubleValue':
                    valueToSet = call.request.doubleValue;
                    break;
                case 'other':
                    valueToSet = call.request.other;
                    break;
                default:
                    valueToSet = undefined;
            }
            try {
                adapter.setForeignState(call.request.stateId, valueToSet, false);
            } catch (e: any) {
                adapter.log.warn(`The data point ${call.request.stateId} does not exist! ${e}`);
            }
            _callback(null, new proto.StateValueUpdateResponse({ suc: true }));
        },
        searchStateStream: (call: grpc.ServerDuplexStream<proto.SearchStateRequest, SearchStateResponse>) => {
            adapter.log.debug('Start search');
            //1. Return first level
            const firstLevelMap = adapter.stateSearchEngine.getFirstLevel();
            const firstLevelResponse: proto.State[] = [];
            for (const [id] of firstLevelMap) {
                firstLevelResponse.push(
                    new proto.State({
                        stateId: id,
                    }),
                );
            }
            call.write(new proto.SearchStateResponse({ states: firstLevelResponse }));
        },
        GetAllObjects: async (call: grpc.ServerWritableStream<proto.AllObjectRequest, proto.AllObjectsResults>) => {
            let result: proto.State[] = [];

            const sendBatch = (): void => {
                if (result.length > 0) {
                    call.write(new proto.AllObjectsResults({ states: result }));
                    result = [];
                }
            };

            const safeNumber = (val: any): number | undefined => {
                if (val === undefined || val === null) {
                    return undefined;
                }
                const num = Number(val);
                return isNaN(num) ? undefined : Math.round(num);
            };
            const safeBool = (val: any): boolean => {
                if (val === undefined || val === null) {
                    return false;
                }
                if (typeof val === 'boolean') {
                    return val;
                }
                return val === 'true' || val === 1 || val === '1';
            };

            const pushState = (objectId: string, object: ioBroker.Object): void => {
                result.push(
                    new proto.State({
                        stateId: objectId,
                        common: new proto.State.StateCommon({
                            name: object.common.name?.toString() ?? 'No name found',
                            unit: object.common.unit?.toString(),
                            desc: object.common.desc?.toString() ?? 'No name found',
                            max: safeNumber(object.common.max),
                            min: safeNumber(object.common.min),
                            type: object.common.type?.toString() ?? 'No name found',
                            step: safeNumber(object.common.step),
                            read: safeBool(object.common.read),
                            write: safeBool(object.common.write),
                            role: object.common.role?.toString() ?? '',
                        }),
                    }),
                );
                if (result.length >= 100) {
                    sendBatch();
                }
            };

            if (call.request.filterPatterns.length != 0) {
                adapter.log.debug(`Get all objects with filter patterns: ${call.request.filterPatterns.join(', ')}`);
                let objects: Record<string, ioBroker.Object> =
                    await adapter.getForeignObjectsAsync('system.adapter.*.alive');
                for (const objectId in objects) {
                    pushState(objectId, objects[objectId]);
                }
                for (const filterPattern of call.request.filterPatterns) {
                    objects = await adapter.getForeignObjectsAsync(`${filterPattern}.*`);
                    for (const objectId in objects) {
                        pushState(objectId, objects[objectId]);
                    }
                }
            } else {
                const objects: Record<string, ioBroker.Object> = await adapter.getForeignObjectsAsync('*');
                adapter.log.debug(`Get all objects without filter patterns${Object.keys(objects).length}`);
                for (const objectId in objects) {
                    pushState(objectId, objects[objectId]);
                }
            }

            sendBatch();
            call.end();
        },
    });
}
