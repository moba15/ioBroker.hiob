
import * as m from "../..//main";
import * as grpc from "@grpc/grpc-js";
import * as proto from "../../generated/login/login"
export function addLoginServices(gRpcServer: grpc.Server, adapter : m.SamartHomeHandyBis) {
    gRpcServer.addService(proto.LoginClient.service, { 
        Login: (call: grpc.ServerUnaryCall<proto.LoginRequest, proto.LoginResponse>,
         callback: grpc.sendUnaryData<proto.LoginResponse>) => {
        const request : proto.LoginRequest = call.request;
        adapter.loginManager.onLoginRequestProto(request);
    }});

}