
import * as m from "../..//main";
import * as grpc from "@grpc/grpc-js";
import * as proto from "../../generated/config_sync/config_sync";
import { TemplateSettings } from "../../template/template_manager";

export function addConfigSyncServices(gRpcServer: grpc.Server, adapter : m.SamartHomeHandyBis) {
    gRpcServer.addService(proto.ConfigSyncClient.service, { 
        GetAvailableConfigs: async (call: grpc.ServerUnaryCall<proto.AvailableConfigsRequest, proto.AvailableConfigsResponse>,
         callback: grpc.sendUnaryData<proto.AvailableConfigsResponse>) => {
            const list = await adapter.templateManager.fetchTemplateSettings();
            callback(null, new proto.AvailableConfigsResponse({
               configNames: list
            }));
        
    },
    ConfigSyncUp: async (call: grpc.ServerUnaryCall<proto.ConfigSyncUpRequest, proto.ConfigSyncUpResponse>,
         callback: grpc.sendUnaryData<proto.ConfigSyncUpResponse>) => {
            await adapter.templateManager.uploadTemplateSetting(call.request.config.name, call.request.config.screens.toString(), call.request.config.templates.toString());
        
    },
    ConfigSyncDown: async (call: grpc.ServerUnaryCall<proto.ConfigSyncDownRequest, proto.Config>,
         callback: grpc.sendUnaryData<proto.Config>) => {
            const map = await adapter.templateManager.getTemplateSettings(call.request.configName);
            callback(null, new proto.Config({
                name: call.request.configName,
                screens: map["screens"],
                templates: map["widgets"]
            }

            ))
        
    },
    ConfigCreateDelete: async (call: grpc.ServerUnaryCall<proto.ConfigCreateDeleteRequest, proto.ConfigCreateDeleteResponse>,
         callback: grpc.sendUnaryData<proto.ConfigCreateDeleteResponse>) => {
            if(!call.request.delete) {
                await adapter.templateManager.createNewTemplateSetting(call.request.configName);
            }
            callback(null, new proto.ConfigCreateDeleteResponse({
                success: true
            }))
             
        
    },
});
   

}