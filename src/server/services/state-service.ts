
import * as m from "../..//main";
import * as grpc from "@grpc/grpc-js";
import * as proto from "../../generated/state/state"
import { SearchState, SearchStateResponse, StateSubscribtion, StateValueUpdate, StateValueUpdateRequest, StateValueUpdateResponse, UnimplementedStateUpdateService } from "../../generated/state/state";
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

export function addStateServices(gRpcServer: grpc.Server, adapter : m.SamartHomeHandyBis) {
    gRpcServer.addService(proto.StateUpdateClient.service, {
        Subscibe: async (call: grpc.ServerWritableStream<StateSubscribtion, proto.StatesValueUpdate>) => {
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
            adapter.listener.addWriter("DeviceIdFromHeader", call);
        } });


}