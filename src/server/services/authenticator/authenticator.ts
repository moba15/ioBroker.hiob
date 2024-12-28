import * as grpc from "@grpc/grpc-js";
export function checkAuthentication(metadata: grpc.Metadata) {
    const keyValue = metadata.get("key");
    const id = metadata.get("id");
    if(id && keyValue) {
        //TODO check
        return {code: grpc.status.OK};

    } else {
        return {code: grpc.status.UNAUTHENTICATED, details: "request missing metadata required field: id or key"}
    }
}