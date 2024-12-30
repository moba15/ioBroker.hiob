import * as grpc from "@grpc/grpc-js";
export function checkAuthentication(metadata: grpc.Metadata) {
    const keyValue = metadata.get("token");
    const id = metadata.get("deviceId");
    if(id && keyValue && id.length == 1 && keyValue.length == 1) {
        //TODO check
        return {code: grpc.status.OK, name:""};

    } else {
        return {code: grpc.status.UNAUTHENTICATED, details: "request missing metadata required field: id or key", name: "Not authenticated"}
    }
}