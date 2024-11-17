/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 5.28.3
 * source: login/login.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
export class CompatibilityRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        buildnumber?: string;
        versionumber?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("buildnumber" in data && data.buildnumber != undefined) {
                this.buildnumber = data.buildnumber;
            }
            if ("versionumber" in data && data.versionumber != undefined) {
                this.versionumber = data.versionumber;
            }
        }
    }
    get buildnumber() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set buildnumber(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get versionumber() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set versionumber(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        buildnumber?: string;
        versionumber?: string;
    }): CompatibilityRequest {
        const message = new CompatibilityRequest({});
        if (data.buildnumber != null) {
            message.buildnumber = data.buildnumber;
        }
        if (data.versionumber != null) {
            message.versionumber = data.versionumber;
        }
        return message;
    }
    toObject() {
        const data: {
            buildnumber?: string;
            versionumber?: string;
        } = {};
        if (this.buildnumber != null) {
            data.buildnumber = this.buildnumber;
        }
        if (this.versionumber != null) {
            data.versionumber = this.versionumber;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.buildnumber.length)
            writer.writeString(1, this.buildnumber);
        if (this.versionumber.length)
            writer.writeString(2, this.versionumber);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CompatibilityRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new CompatibilityRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.buildnumber = reader.readString();
                    break;
                case 2:
                    message.versionumber = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): CompatibilityRequest {
        return CompatibilityRequest.deserialize(bytes);
    }
}
export class CompatibilityResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        buildnumber?: string;
        versionumber?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("buildnumber" in data && data.buildnumber != undefined) {
                this.buildnumber = data.buildnumber;
            }
            if ("versionumber" in data && data.versionumber != undefined) {
                this.versionumber = data.versionumber;
            }
        }
    }
    get buildnumber() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set buildnumber(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get versionumber() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set versionumber(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        buildnumber?: string;
        versionumber?: string;
    }): CompatibilityResponse {
        const message = new CompatibilityResponse({});
        if (data.buildnumber != null) {
            message.buildnumber = data.buildnumber;
        }
        if (data.versionumber != null) {
            message.versionumber = data.versionumber;
        }
        return message;
    }
    toObject() {
        const data: {
            buildnumber?: string;
            versionumber?: string;
        } = {};
        if (this.buildnumber != null) {
            data.buildnumber = this.buildnumber;
        }
        if (this.versionumber != null) {
            data.versionumber = this.versionumber;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.buildnumber.length)
            writer.writeString(1, this.buildnumber);
        if (this.versionumber.length)
            writer.writeString(2, this.versionumber);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CompatibilityResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new CompatibilityResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.buildnumber = reader.readString();
                    break;
                case 2:
                    message.versionumber = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): CompatibilityResponse {
        return CompatibilityResponse.deserialize(bytes);
    }
}
export class FirstPing extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        buildnumber?: string;
        versionumber?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("buildnumber" in data && data.buildnumber != undefined) {
                this.buildnumber = data.buildnumber;
            }
            if ("versionumber" in data && data.versionumber != undefined) {
                this.versionumber = data.versionumber;
            }
        }
    }
    get buildnumber() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set buildnumber(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get versionumber() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set versionumber(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        buildnumber?: string;
        versionumber?: string;
    }): FirstPing {
        const message = new FirstPing({});
        if (data.buildnumber != null) {
            message.buildnumber = data.buildnumber;
        }
        if (data.versionumber != null) {
            message.versionumber = data.versionumber;
        }
        return message;
    }
    toObject() {
        const data: {
            buildnumber?: string;
            versionumber?: string;
        } = {};
        if (this.buildnumber != null) {
            data.buildnumber = this.buildnumber;
        }
        if (this.versionumber != null) {
            data.versionumber = this.versionumber;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.buildnumber.length)
            writer.writeString(1, this.buildnumber);
        if (this.versionumber.length)
            writer.writeString(2, this.versionumber);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): FirstPing {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new FirstPing();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.buildnumber = reader.readString();
                    break;
                case 2:
                    message.versionumber = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): FirstPing {
        return FirstPing.deserialize(bytes);
    }
}
export class LoginRequest extends pb_1.Message {
    #one_of_decls: number[][] = [[5]];
    constructor(data?: any[] | ({
        deviceName?: string;
        deviceId?: string;
        key?: string;
        user?: string;
    } & (({
        password?: string;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("deviceName" in data && data.deviceName != undefined) {
                this.deviceName = data.deviceName;
            }
            if ("deviceId" in data && data.deviceId != undefined) {
                this.deviceId = data.deviceId;
            }
            if ("key" in data && data.key != undefined) {
                this.key = data.key;
            }
            if ("user" in data && data.user != undefined) {
                this.user = data.user;
            }
            if ("password" in data && data.password != undefined) {
                this.password = data.password;
            }
        }
    }
    get deviceName() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set deviceName(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get deviceId() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set deviceId(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get key() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set key(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get user() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set user(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get password() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set password(value: string) {
        pb_1.Message.setOneofField(this, 5, this.#one_of_decls[0], value);
    }
    get has_password() {
        return pb_1.Message.getField(this, 5) != null;
    }
    get _password() {
        const cases: {
            [index: number]: "none" | "password";
        } = {
            0: "none",
            5: "password"
        };
        return cases[pb_1.Message.computeOneofCase(this, [5])];
    }
    static fromObject(data: {
        deviceName?: string;
        deviceId?: string;
        key?: string;
        user?: string;
        password?: string;
    }): LoginRequest {
        const message = new LoginRequest({});
        if (data.deviceName != null) {
            message.deviceName = data.deviceName;
        }
        if (data.deviceId != null) {
            message.deviceId = data.deviceId;
        }
        if (data.key != null) {
            message.key = data.key;
        }
        if (data.user != null) {
            message.user = data.user;
        }
        if (data.password != null) {
            message.password = data.password;
        }
        return message;
    }
    toObject() {
        const data: {
            deviceName?: string;
            deviceId?: string;
            key?: string;
            user?: string;
            password?: string;
        } = {};
        if (this.deviceName != null) {
            data.deviceName = this.deviceName;
        }
        if (this.deviceId != null) {
            data.deviceId = this.deviceId;
        }
        if (this.key != null) {
            data.key = this.key;
        }
        if (this.user != null) {
            data.user = this.user;
        }
        if (this.password != null) {
            data.password = this.password;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.deviceName.length)
            writer.writeString(1, this.deviceName);
        if (this.deviceId.length)
            writer.writeString(2, this.deviceId);
        if (this.key.length)
            writer.writeString(3, this.key);
        if (this.user.length)
            writer.writeString(4, this.user);
        if (this.has_password)
            writer.writeString(5, this.password);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): LoginRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new LoginRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.deviceName = reader.readString();
                    break;
                case 2:
                    message.deviceId = reader.readString();
                    break;
                case 3:
                    message.key = reader.readString();
                    break;
                case 4:
                    message.user = reader.readString();
                    break;
                case 5:
                    message.password = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): LoginRequest {
        return LoginRequest.deserialize(bytes);
    }
}
export class LoginResponse extends pb_1.Message {
    #one_of_decls: number[][] = [[2]];
    constructor(data?: any[] | ({
        status?: LoginResponse.Status;
        sessionId?: string;
    } & (({
        errorMsg?: string;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("status" in data && data.status != undefined) {
                this.status = data.status;
            }
            if ("errorMsg" in data && data.errorMsg != undefined) {
                this.errorMsg = data.errorMsg;
            }
            if ("sessionId" in data && data.sessionId != undefined) {
                this.sessionId = data.sessionId;
            }
        }
    }
    get status() {
        return pb_1.Message.getFieldWithDefault(this, 1, LoginResponse.Status.succesfull) as LoginResponse.Status;
    }
    set status(value: LoginResponse.Status) {
        pb_1.Message.setField(this, 1, value);
    }
    get errorMsg() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set errorMsg(value: string) {
        pb_1.Message.setOneofField(this, 2, this.#one_of_decls[0], value);
    }
    get has_errorMsg() {
        return pb_1.Message.getField(this, 2) != null;
    }
    get sessionId() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set sessionId(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get _errorMsg() {
        const cases: {
            [index: number]: "none" | "errorMsg";
        } = {
            0: "none",
            2: "errorMsg"
        };
        return cases[pb_1.Message.computeOneofCase(this, [2])];
    }
    static fromObject(data: {
        status?: LoginResponse.Status;
        errorMsg?: string;
        sessionId?: string;
    }): LoginResponse {
        const message = new LoginResponse({});
        if (data.status != null) {
            message.status = data.status;
        }
        if (data.errorMsg != null) {
            message.errorMsg = data.errorMsg;
        }
        if (data.sessionId != null) {
            message.sessionId = data.sessionId;
        }
        return message;
    }
    toObject() {
        const data: {
            status?: LoginResponse.Status;
            errorMsg?: string;
            sessionId?: string;
        } = {};
        if (this.status != null) {
            data.status = this.status;
        }
        if (this.errorMsg != null) {
            data.errorMsg = this.errorMsg;
        }
        if (this.sessionId != null) {
            data.sessionId = this.sessionId;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.status != LoginResponse.Status.succesfull)
            writer.writeEnum(1, this.status);
        if (this.has_errorMsg)
            writer.writeString(2, this.errorMsg);
        if (this.sessionId.length)
            writer.writeString(3, this.sessionId);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): LoginResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new LoginResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.status = reader.readEnum();
                    break;
                case 2:
                    message.errorMsg = reader.readString();
                    break;
                case 3:
                    message.sessionId = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): LoginResponse {
        return LoginResponse.deserialize(bytes);
    }
}
export namespace LoginResponse {
    export enum Status {
        succesfull = 0,
        wrongKey = 1,
        wrongPassword = 2,
        error = 3,
        notApproved = 4
    }
}
export class NewAesPacket extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}): NewAesPacket {
        const message = new NewAesPacket({});
        return message;
    }
    toObject() {
        const data: {} = {};
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): NewAesPacket {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new NewAesPacket();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): NewAesPacket {
        return NewAesPacket.deserialize(bytes);
    }
}
export class WrongAesKeyPack extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}): WrongAesKeyPack {
        const message = new WrongAesKeyPack({});
        return message;
    }
    toObject() {
        const data: {} = {};
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): WrongAesKeyPack {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new WrongAesKeyPack();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): WrongAesKeyPack {
        return WrongAesKeyPack.deserialize(bytes);
    }
}
export class ApprovalRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        deviceName?: string;
        deviceId?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("deviceName" in data && data.deviceName != undefined) {
                this.deviceName = data.deviceName;
            }
            if ("deviceId" in data && data.deviceId != undefined) {
                this.deviceId = data.deviceId;
            }
        }
    }
    get deviceName() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set deviceName(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get deviceId() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set deviceId(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        deviceName?: string;
        deviceId?: string;
    }): ApprovalRequest {
        const message = new ApprovalRequest({});
        if (data.deviceName != null) {
            message.deviceName = data.deviceName;
        }
        if (data.deviceId != null) {
            message.deviceId = data.deviceId;
        }
        return message;
    }
    toObject() {
        const data: {
            deviceName?: string;
            deviceId?: string;
        } = {};
        if (this.deviceName != null) {
            data.deviceName = this.deviceName;
        }
        if (this.deviceId != null) {
            data.deviceId = this.deviceId;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.deviceName.length)
            writer.writeString(1, this.deviceName);
        if (this.deviceId.length)
            writer.writeString(2, this.deviceId);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ApprovalRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new ApprovalRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.deviceName = reader.readString();
                    break;
                case 2:
                    message.deviceId = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): ApprovalRequest {
        return ApprovalRequest.deserialize(bytes);
    }
}
export class ApprovalResponse extends pb_1.Message {
    #one_of_decls: number[][] = [[2]];
    constructor(data?: any[] | ({
        status?: ApprovalResponse.Status;
    } & (({
        key?: string;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("status" in data && data.status != undefined) {
                this.status = data.status;
            }
            if ("key" in data && data.key != undefined) {
                this.key = data.key;
            }
        }
    }
    get status() {
        return pb_1.Message.getFieldWithDefault(this, 1, ApprovalResponse.Status.aprroved) as ApprovalResponse.Status;
    }
    set status(value: ApprovalResponse.Status) {
        pb_1.Message.setField(this, 1, value);
    }
    get key() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set key(value: string) {
        pb_1.Message.setOneofField(this, 2, this.#one_of_decls[0], value);
    }
    get has_key() {
        return pb_1.Message.getField(this, 2) != null;
    }
    get _key() {
        const cases: {
            [index: number]: "none" | "key";
        } = {
            0: "none",
            2: "key"
        };
        return cases[pb_1.Message.computeOneofCase(this, [2])];
    }
    static fromObject(data: {
        status?: ApprovalResponse.Status;
        key?: string;
    }): ApprovalResponse {
        const message = new ApprovalResponse({});
        if (data.status != null) {
            message.status = data.status;
        }
        if (data.key != null) {
            message.key = data.key;
        }
        return message;
    }
    toObject() {
        const data: {
            status?: ApprovalResponse.Status;
            key?: string;
        } = {};
        if (this.status != null) {
            data.status = this.status;
        }
        if (this.key != null) {
            data.key = this.key;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.status != ApprovalResponse.Status.aprroved)
            writer.writeEnum(1, this.status);
        if (this.has_key)
            writer.writeString(2, this.key);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ApprovalResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new ApprovalResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.status = reader.readEnum();
                    break;
                case 2:
                    message.key = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): ApprovalResponse {
        return ApprovalResponse.deserialize(bytes);
    }
}
export namespace ApprovalResponse {
    export enum Status {
        aprroved = 0,
        timeout = 1
    }
}
interface GrpcUnaryServiceInterface<P, R> {
    (message: P, metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    (message: P, metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    (message: P, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    (message: P, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
}
interface GrpcStreamServiceInterface<P, R> {
    (message: P, metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
    (message: P, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
}
interface GrpWritableServiceInterface<P, R> {
    (metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    (metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    (options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    (callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
}
interface GrpcChunkServiceInterface<P, R> {
    (metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
    (options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
}
interface GrpcPromiseServiceInterface<P, R> {
    (message: P, metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): Promise<R>;
    (message: P, options?: grpc_1.CallOptions): Promise<R>;
}
export abstract class UnimplementedLoginService {
    static definition = {
        CheckCompatibility: {
            path: "/Login/CheckCompatibility",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: CompatibilityRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => CompatibilityRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: CompatibilityResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => CompatibilityResponse.deserialize(new Uint8Array(bytes))
        },
        Login: {
            path: "/Login/Login",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: LoginRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => LoginRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: LoginResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => LoginResponse.deserialize(new Uint8Array(bytes))
        },
        RequestApproval: {
            path: "/Login/RequestApproval",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: ApprovalRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => ApprovalRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: ApprovalResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => ApprovalResponse.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract CheckCompatibility(call: grpc_1.ServerUnaryCall<CompatibilityRequest, CompatibilityResponse>, callback: grpc_1.sendUnaryData<CompatibilityResponse>): void;
    abstract Login(call: grpc_1.ServerUnaryCall<LoginRequest, LoginResponse>, callback: grpc_1.sendUnaryData<LoginResponse>): void;
    abstract RequestApproval(call: grpc_1.ServerUnaryCall<ApprovalRequest, ApprovalResponse>, callback: grpc_1.sendUnaryData<ApprovalResponse>): void;
}
export class LoginClient extends grpc_1.makeGenericClientConstructor(UnimplementedLoginService.definition, "Login", {}) {
    constructor(address: string, credentials: grpc_1.ChannelCredentials, options?: Partial<grpc_1.ChannelOptions>) {
        super(address, credentials, options);
    }
    CheckCompatibility: GrpcUnaryServiceInterface<CompatibilityRequest, CompatibilityResponse> = (message: CompatibilityRequest, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<CompatibilityResponse>, options?: grpc_1.CallOptions | grpc_1.requestCallback<CompatibilityResponse>, callback?: grpc_1.requestCallback<CompatibilityResponse>): grpc_1.ClientUnaryCall => {
        return super.CheckCompatibility(message, metadata, options, callback);
    };
    Login: GrpcUnaryServiceInterface<LoginRequest, LoginResponse> = (message: LoginRequest, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<LoginResponse>, options?: grpc_1.CallOptions | grpc_1.requestCallback<LoginResponse>, callback?: grpc_1.requestCallback<LoginResponse>): grpc_1.ClientUnaryCall => {
        return super.Login(message, metadata, options, callback);
    };
    RequestApproval: GrpcUnaryServiceInterface<ApprovalRequest, ApprovalResponse> = (message: ApprovalRequest, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<ApprovalResponse>, options?: grpc_1.CallOptions | grpc_1.requestCallback<ApprovalResponse>, callback?: grpc_1.requestCallback<ApprovalResponse>): grpc_1.ClientUnaryCall => {
        return super.RequestApproval(message, metadata, options, callback);
    };
}