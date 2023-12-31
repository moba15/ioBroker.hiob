export class DataPack {
    type: string;
    constructor(type: string) {
        this.type = type;
    }

    toJSON() : string {return ""}
}
export class StateChangeRequestPack extends DataPack {
    objectID;
    newValue : any;
    constructor(objectID: string, newValue: any) {
        super("iobStateChangeRequest");
        this.objectID = objectID;
        this.newValue = newValue;
    }

    toJSON() : string {
        const map = {
            "type": this.type,
            "objectID": this.objectID,
            "newValue": this.newValue,
        };
        return JSON.stringify(map).toString();
    }

}

export class StateChangedDataPack extends DataPack {
    objectID
    value
    constructor(objectID: string, value: any) {
        super("iobStateChanged")
        this.objectID = objectID;
        this.value = value;
    }

    toJSON() : string {
        const map = {
            "type": this.type,
            "objectID": this.objectID,
            "value": this.value,
        };
        return JSON.stringify(map).toString();
    }

}

export class EnumUpdateRequestPack extends DataPack {

    id: string
    constructor(id: string) {
        super("enumUpdateRequest");
        this.id = id;
    }

}

export class EnumUpdatePack extends DataPack {

    id: string
    enumsJSON: any
    constructor(id: string, enumsJSON: any) {
        super("enumUpdate");
        this.id = id;
        this.enumsJSON = enumsJSON;
    }

    toJSON() : string {
        const map = {
            "type": this.type,
            "enums": this.enumsJSON,
        };
        return JSON.stringify(map).toString();
    }

}

export class FirstPingPack extends DataPack {


    constructor() {
        super("firstPingFromIob2");
    }

    toJSON() : string {
        const map = {
            "type": this.type,
        };
        return JSON.stringify(map).toString();
    }

}

export class RequestLoginPacket extends DataPack {
    deviceName: string;
    deviceID: string
    key: string
    user: string
    password: string
    constructor(deviceName: string, deviceID: string, key: string, user: string, password: string ) {
        super("requestLogin");
        this.deviceName = deviceName;
        this.deviceID = deviceID;
        this.key = key;
        this.user = user;
        this.password = password;
    }
}

export class LoginAnswer extends DataPack {
    key
    suc
    constructor(key: string, suc: boolean)  {
        super("answerLogin");
        this.key = key;
        this.suc = suc;
    }

    toJSON() : string {
        const map = {
            "type": this.type,
            "key": this.key,
            "suc": this.suc
        };
        return JSON.stringify(map).toString();
    }
}

export class SubscribeToDataPointsPack extends DataPack {


    dataPoints
    constructor(dataPoints: any ) {
        super("subscribeToDataPoints");
        this.dataPoints = dataPoints;
    }

}

export class SubscribeToDataPointsHistory extends DataPack {


    dataPoint
    end
    start
    minInterval
    constructor(dataPoint: any, end: any, start: any, minInterval: any) {
        super("subscribeHistory");
        this.dataPoint = dataPoint;
        this.end = end;
        this.start = start;
        this.minInterval = minInterval;
    }

}

export class LoginKeyPacket extends DataPack {
    key
    constructor(key: string) {
        super("loginKey");
        this.key = key;
    }

    toJSON() : string {
        const map = {
            "type": this.type,
            "key": this.key,
        };
        return JSON.stringify(map).toString();
    }
}

export class LoginApprovedPacket extends DataPack {
    constructor() {
        super("loginApproved");
    }

    toJSON() : string{
        const map = {
            "type": this.type,
        };
        return JSON.stringify(map).toString();
    }
}


export class LoginDeclinedPacket extends DataPack {
    constructor() {
        super("loginDeclined");
    }


    toJSON() : string{
        const map = {
            "type": this.type,
        };
        return JSON.stringify(map).toString();
    }
}

export class TemplateSettingCreatePack extends DataPack {
    name
    constructor(name: any) {
        super("templateSettingCreate");
        this.name = name;
    }

    toJSON() : string {
        const map = {
            "type": this.type,
        };
        return JSON.stringify(map).toString();
    }

}

export class TemplateSettingsRequestedPack extends DataPack {
    list
    constructor(list : string[]) {
        super("requestTemplatesSettings");
        this.list = list;
    }

    toJSON() : string {
        const map = {
            "type": this.type,
            "settings": this.list,
        };
        return JSON.stringify(map).toString();
    }

}

export class TemplateSettingUploadPack extends DataPack {
    name
    devices
    screens
    widgets
    constructor(name: any, devices: any, screens: any, widgets: any) {
        super("uploadTemplateSetting");
        this.name = name;
        this.devices = devices;
        this.screens = screens;
        this.widgets = widgets;
    }


}

export class TemplateSettingUploadSuccessPack extends DataPack {

    constructor() {
        super("uploadTemplateSettingSuccess");
    }

    toJSON() : string {
        const map = {
            "type": this.type,
        };
        return JSON.stringify(map).toString();
    }


}

export class GetTemplateSettingPack extends DataPack {

    devices
    screens
    widgets

    constructor(devices : any, screens: any, widgets : any) {
        super("getTemplatesSetting");
        this.devices = devices;
        this.screens = screens;
        this.widgets = widgets;
    }

    toJSON() : string {
        const map = {
            "type": this.type,
            "screens": this.screens,
            "widg": this.widgets,
            "devices": this.devices,
        };
        return JSON.stringify(map).toString();
    }


}