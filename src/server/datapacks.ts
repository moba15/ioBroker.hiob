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

    toJSON() : any {
        const map = {
            "type": this.type,
            "objectID": this.objectID,
            "newValue": this.newValue,
        };
        return map;
    }

}

export class StateChangedDataPack extends DataPack {
    objectID
    value
    ack
    constructor(objectID: string, value: any, ack: boolean) {
        super("iobStateChanged")
        this.objectID = objectID;
        this.value = value;
        this.ack = ack;
    }

    toJSON() : any {
        const map = {
            "type": this.type,
            "objectID": this.objectID,
            "value": this.value,
            "ack": this.ack,
        };
        return map;
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

    toJSON() : any {
        const map = {
            "type": this.type,
            "enums": this.enumsJSON,
        };
        return map;
    }

}

export class FirstPingPack extends DataPack {


    constructor() {
        super("firstPingFromIob2");
    }

    toJSON() : string {
        const map = {
            "type": this.type,
            content: {}
        };
        return JSON.stringify(map).toString();
    }

}


export class NewAesPacket extends DataPack {
    constructor() {
        super("setNewAes");
    }

    toJSON() : any {
        const map = {
            "type": this.type,
            content: {}
        };
        return map;
    }

}

export class RequestLoginPacket extends DataPack {
    deviceName: string;
    deviceID: string
    key: string
    version: string
    user: string
    password: string
    constructor(deviceName: string, deviceID: string, key: string, version: string, user: string, password: string ) {
        super("requestLogin");
        this.deviceName = deviceName;
        this.deviceID = deviceID;
        this.key = key;
        this.version = version;
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

    toJSON() : any {
        const map = {
            "type": this.type,
            "key": this.key,
            "suc": this.suc
        };
        return map;
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

    toJSON() : any {
        const map = {
            "type": this.type,
            "key": this.key,
        };
        return map;
    }
}

export class LoginApprovedPacket extends DataPack {
    release
    constructor(release: string) {
        super("loginApproved");
        this.release = release;
    }

    toJSON() : any {
        const map = {
            "type": this.type,
            "release": this.release,
        };
        return map;
    }
}


export class LoginDeclinedPacket extends DataPack {
    constructor() {
        super("loginDeclined");
    }


    toJSON() : any {
        const map = {
            "type": this.type,
        };
        return map;
    }
}

export class WrongAesKeyPack extends DataPack {
    constructor() {
        super("wrongAesKey");
    }
    toJSON() : any {
        const map = {
            "type": this.type,
        };
        return map;
    }
}

export class TemplateSettingCreatePack extends DataPack {
    name
    constructor(name: any) {
        super("templateSettingCreate");
        this.name = name;
    }

    toJSON() : any {
        const map = {
            "type": this.type,
        };
        return map;
    }

}

export class TemplateSettingsRequestedPack extends DataPack {
    list
    constructor(list : string[]) {
        super("requestTemplatesSettings");
        this.list = list;
    }

    toJSON() : any {
        const map = {
            "type": this.type,
            "settings": this.list,
        };
        return map;
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

    toJSON() : any {
        const map = {
            "type": this.type,
        };
        return map;
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

    toJSON() : any {
        const map = {
            "type": this.type,
            "screens": this.screens,
            "widget": this.widgets,
            "devices": this.devices,
        };
        return map;
    }


}


export class NotificationPack extends DataPack {
    onlySendNotification? : boolean
    content?: string | Map<string, any>;
    date?: Date
    constructor(onlySendNotification?: boolean, content?: string | Map<string, any>, date?: Date) {
        super("notification");
        this.onlySendNotification = onlySendNotification;
        this.content = content;
        this.date = date;
    }
    toJSON() : any {
        const map = {
            "type": this.type,
            "onlySendNotification": this.onlySendNotification,
            "content": this.content,
            "date": this.date
        };
        return map;
    }
}