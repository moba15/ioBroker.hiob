
import * as m from "../..//main";
import * as grpc from "@grpc/grpc-js";
import * as proto from "../../generated/state/state"
import { SearchState, SearchStateResponse, StateSubscribtion, StateValueUpdate, StateValueUpdateRequest, StateValueUpdateResponse, UnimplementedStateUpdateService } from "../../generated/state/state";
import { checkAuthentication } from "./authenticator/authenticator";
class Test  extends UnimplementedStateUpdateService {
    Subscibe(call: grpc.ServerWritableStream<StateSubscribtion, proto.StatesValueUpdate>): void {
        throw new Error("Method not implemented.");
    }
    updateValue(call: grpc.ServerUnaryCall<StateValueUpdateRequest, StateValueUpdateResponse>, callback: grpc.sendUnaryData<StateValueUpdateResponse>): void {
        throw new Error("Method not implemented.");
    }
    searchState(call: grpc.ServerUnaryCall<SearchState, SearchStateResponse>, callback: grpc.sendUnaryData<SearchStateResponse>): void {
        throw new Error("Method not implemented.");
    }
    searchStateStream(call: grpc.ServerDuplexStream<SearchState, SearchStateResponse>): void {
        throw new Error("Method not implemented.");
    }

}

export function addStateServices(gRpcServer: grpc.Server, adapter : m.SamartHomeHandyBis) : void {
    gRpcServer.addService(proto.StateUpdateClient.service, {
        Subscibe: async (call: grpc.ServerWritableStream<StateSubscribtion, proto.StatesValueUpdate>) => {
            const authStatus = checkAuthentication(call.metadata)
            if(authStatus.code != grpc.status.OK) {
                call.emit("error", authStatus );
                return;
            }


            const result = await adapter.subscribeToDataPointsProto(call.request.stateIds);
            const stateValueUpdates = result.map(e => {
                return new proto.StateValueUpdate({
                    stateId: e.objectID,
                    stringValue: e.val.toString(),
                    acc: e.ack,
                    time: 0,
                });
            });
            call.write(new proto.StatesValueUpdate({stateUpdates: stateValueUpdates}));
            //TODO Device Id from header
            const id = call.metadata.get("deviceId")[0].toString();
            adapter.listener.addWriter(id, call);
        },
        searchStateStream: async (call: grpc.ServerDuplexStream<SearchState, SearchStateResponse>) => {
            adapter.log.debug("Start search");
            //1. Return first level
            const firstLevelMap = adapter.stateSearchEngine.getFirstLevel();
            const firstLevelResponse : proto.State[] = [];
            for(const [id, adapaterObj] of firstLevelMap ) {
                firstLevelResponse.push(new proto.State({
                    stateId: id,
                }))
            }
            call.write(new proto.SearchStateResponse({states: firstLevelResponse}));

        } });


}