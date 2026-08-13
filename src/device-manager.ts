import type { SamartHomeHandyBis } from './main';

export class DeviceManager {
    private adapter: SamartHomeHandyBis;

    constructor(adapter: SamartHomeHandyBis) {
        this.adapter = adapter;
    }

    public async handleMessage(obj: ioBroker.Message): Promise<void> {
        if (obj.command === 'getDevices') {
            try {
                // Mobile phone devices are stored as 'channel' objects under 'devices'
                const devices = await this.adapter.getChannelsOfAsync('devices');
                const result = [];

                for (const device of devices) {
                    // Extract device ID from full ioBroker object ID (e.g. hiob.0.devices.abc -> abc)
                    const idParts = device._id.split('.');
                    const shortId = idParts[idParts.length - 1];

                    // We only want devices that are direct children of 'devices'
                    if (idParts[idParts.length - 2] === 'devices') {
                        let name = shortId;
                        if (device.common && device.common.name) {
                            if (typeof device.common.name === 'string') {
                                name = device.common.name;
                            } else if (typeof device.common.name === 'object' && device.common.name.en) {
                                name = device.common.name.en; // Fallback to english name if object
                            }
                        }

                        const approvedState = await this.adapter.getStateAsync(`devices.${shortId}.approved`);
                        const approved = approvedState ? !!approvedState.val : false;

                        result.push({
                            id: shortId,
                            name: name,
                            approved: approved,
                        });
                    }
                }

                if (obj.callback) {
                    this.adapter.sendTo(obj.from, obj.command, { devices: result }, obj.callback);
                }
            } catch (e: any) {
                this.adapter.log.error(`Error getting devices: ${e.message}`);
                if (obj.callback) {
                    this.adapter.sendTo(obj.from, obj.command, { error: e.message }, obj.callback);
                }
            }
        } else if (obj.command === 'setDeviceApproval') {
            if (
                typeof obj.message === 'object' &&
                obj.message &&
                'deviceId' in obj.message &&
                'approved' in obj.message
            ) {
                const deviceId = obj.message.deviceId;
                const approved = obj.message.approved;

                try {
                    await this.adapter.setStateAsync(`devices.${deviceId}.approved`, approved, true);
                    this.adapter.log.info(`Device ${deviceId} approval set to ${approved} via Admin UI`);

                    // Trigger state change immediately for internal state manager
                    this.adapter.emit('stateChange', `${this.adapter.namespace}.devices.${deviceId}.approved`, {
                        val: approved,
                        ack: true,
                        ts: Date.now(),
                        lc: Date.now(),
                        from: `system.adapter.${this.adapter.namespace}`,
                    });

                    if (obj.callback) {
                        this.adapter.sendTo(obj.from, obj.command, { success: true }, obj.callback);
                    }
                } catch (e: any) {
                    this.adapter.log.error(`Error setting device approval: ${e.message}`);
                    if (obj.callback) {
                        this.adapter.sendTo(obj.from, obj.command, { error: e.message }, obj.callback);
                    }
                }
            } else {
                if (obj.callback) {
                    this.adapter.sendTo(obj.from, obj.command, { error: 'Invalid parameters' }, obj.callback);
                }
            }
        } else if (obj.command === 'setDevicePasswordRequired') {
            if (
                typeof obj.message === 'object' &&
                obj.message &&
                'deviceId' in obj.message &&
                'needPwd' in obj.message
            ) {
                const deviceId = obj.message.deviceId;
                const needPwd = obj.message.needPwd;
                const noPwdAllowed = !needPwd; // invert it

                try {
                    await this.adapter.setStateAsync(`devices.${deviceId}.noPwdAllowed`, noPwdAllowed, true);
                    this.adapter.log.info(`Device ${deviceId} password required set to ${needPwd} via Admin UI`);

                    this.adapter.emit('stateChange', `${this.adapter.namespace}.devices.${deviceId}.noPwdAllowed`, {
                        val: noPwdAllowed,
                        ack: true,
                        ts: Date.now(),
                        lc: Date.now(),
                        from: `system.adapter.${this.adapter.namespace}`,
                    });

                    if (obj.callback) {
                        this.adapter.sendTo(obj.from, obj.command, { success: true }, obj.callback);
                    }
                } catch (e: any) {
                    this.adapter.log.error(`Error setting device password requirement: ${e.message}`);
                    if (obj.callback) {
                        this.adapter.sendTo(obj.from, obj.command, { error: e.message }, obj.callback);
                    }
                }
            } else {
                if (obj.callback) {
                    this.adapter.sendTo(obj.from, obj.command, { error: 'Invalid parameters' }, obj.callback);
                }
            }
        }
    }
}
