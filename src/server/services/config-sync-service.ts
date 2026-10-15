import type * as m from '../..//main';
import type * as grpc from '@grpc/grpc-js';
import * as proto from '../../generated/config_sync/config_sync';
import { checkAuthentication } from './authenticator/authenticator';

export function addConfigSyncServices(gRpcServer: grpc.Server, adapter: m.SamartHomeHandyBis): void {
    gRpcServer.addService(proto.ConfigSyncClient.service, {
        GetAvailableConfigs: async (
            call: grpc.ServerUnaryCall<proto.AvailableConfigsRequest, proto.AvailableConfigsResponse>,
            callback: grpc.sendUnaryData<proto.AvailableConfigsResponse>,
        ) => {
            const authStatus = await checkAuthentication(call.metadata, adapter);
            if (authStatus.code !== 0) {
                callback({ code: authStatus.code, message: authStatus.details ?? 'Unauthenticated' }, null);
                return;
            }

            const list = await adapter.templateManager.fetchTemplateSettings();
            callback(
                null,
                new proto.AvailableConfigsResponse({
                    configNames: list,
                }),
            );
        },
        ConfigSyncUp: async (
            call: grpc.ServerUnaryCall<proto.ConfigSyncUpRequest, proto.ConfigSyncUpResponse>,
            _callback: grpc.sendUnaryData<proto.ConfigSyncUpResponse>,
        ) => {
            const authStatus = await checkAuthentication(call.metadata, adapter);
            if (authStatus.code !== 0) {
                _callback({ code: authStatus.code, message: authStatus.details ?? 'Unauthenticated' }, null);
                return;
            }

            await adapter.templateManager.uploadTemplateSetting(
                call.request.config.name,
                call.request.config.screens.toString(),
                call.request.config.templates.toString(),
            );
        },
        ConfigSyncDown: async (
            call: grpc.ServerUnaryCall<proto.ConfigSyncDownRequest, proto.Config>,
            callback: grpc.sendUnaryData<proto.Config>,
        ) => {
            const authStatus = await checkAuthentication(call.metadata, adapter);
            if (authStatus.code !== 0) {
                callback({ code: authStatus.code, message: authStatus.details ?? 'Unauthenticated' }, null);
                return;
            }

            const map = await adapter.templateManager.getTemplateSettings(call.request.configName);
            callback(
                null,
                new proto.Config({
                    name: call.request.configName,
                    screens: map.screens,
                    templates: map.widgets,
                }),
            );
        },
        ConfigCreateDelete: async (
            call: grpc.ServerUnaryCall<proto.ConfigCreateDeleteRequest, proto.ConfigCreateDeleteResponse>,
            callback: grpc.sendUnaryData<proto.ConfigCreateDeleteResponse>,
        ) => {
            const authStatus = await checkAuthentication(call.metadata, adapter);
            if (authStatus.code !== 0) {
                callback({ code: authStatus.code, message: authStatus.details ?? 'Unauthenticated' }, null);
                return;
            }

            if (!call.request.delete) {
                await adapter.templateManager.createNewTemplateSetting(call.request.configName);
            }
            callback(
                null,
                new proto.ConfigCreateDeleteResponse({
                    success: true,
                }),
            );
        },
    });
}
