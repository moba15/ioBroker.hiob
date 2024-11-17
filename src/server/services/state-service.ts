
import * as m from "../..//main";
import * as grpc from "@grpc/grpc-js";
import * as proto from "../../generated/state/state"
import { SearchState, SearchStateResponse, StateSubscribtion, StateValueUpdate, StateValueUpdateRequest, StateValueUpdateResponse, UnimplementedStateUpdateService } from "../../generated/state/state";
class Test  extends UnimplementedStateUpdateService {
    Subscibe(call: grpc.ServerWritableStream<StateSubscribtion, StateValueUpdate>): void {
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
        Subscibe: (call: grpc.ServerWritableStream<StateSubscribtion, StateValueUpdate>) => {
            adapter.subscribeToDataPointsProto(call.request.stateIds);
        } });
   

}