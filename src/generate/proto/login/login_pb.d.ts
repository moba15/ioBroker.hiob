// package: 
// file: proto/login/login.proto

import * as jspb from "google-protobuf";

export class CompatibilityRequest extends jspb.Message {
  getBuildnumber(): string;
  setBuildnumber(value: string): void;

  getVersionumber(): string;
  setVersionumber(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompatibilityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CompatibilityRequest): CompatibilityRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CompatibilityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompatibilityRequest;
  static deserializeBinaryFromReader(message: CompatibilityRequest, reader: jspb.BinaryReader): CompatibilityRequest;
}

export namespace CompatibilityRequest {
  export type AsObject = {
    buildnumber: string,
    versionumber: string,
  }
}

export class CompatibilityResponse extends jspb.Message {
  getBuildnumber(): string;
  setBuildnumber(value: string): void;

  getVersionumber(): string;
  setVersionumber(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompatibilityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CompatibilityResponse): CompatibilityResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CompatibilityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompatibilityResponse;
  static deserializeBinaryFromReader(message: CompatibilityResponse, reader: jspb.BinaryReader): CompatibilityResponse;
}

export namespace CompatibilityResponse {
  export type AsObject = {
    buildnumber: string,
    versionumber: string,
  }
}

export class FirstPing extends jspb.Message {
  getBuildnumber(): string;
  setBuildnumber(value: string): void;

  getVersionumber(): string;
  setVersionumber(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FirstPing.AsObject;
  static toObject(includeInstance: boolean, msg: FirstPing): FirstPing.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FirstPing, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FirstPing;
  static deserializeBinaryFromReader(message: FirstPing, reader: jspb.BinaryReader): FirstPing;
}

export namespace FirstPing {
  export type AsObject = {
    buildnumber: string,
    versionumber: string,
  }
}

export class LoginRequest extends jspb.Message {
  getDevicename(): string;
  setDevicename(value: string): void;

  getDeviceid(): string;
  setDeviceid(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  getUser(): string;
  setUser(value: string): void;

  hasPassword(): boolean;
  clearPassword(): void;
  getPassword(): string;
  setPassword(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LoginRequest): LoginRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LoginRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginRequest;
  static deserializeBinaryFromReader(message: LoginRequest, reader: jspb.BinaryReader): LoginRequest;
}

export namespace LoginRequest {
  export type AsObject = {
    devicename: string,
    deviceid: string,
    key: string,
    user: string,
    password: string,
  }
}

export class LoginResponse extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LoginResponse): LoginResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LoginResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginResponse;
  static deserializeBinaryFromReader(message: LoginResponse, reader: jspb.BinaryReader): LoginResponse;
}

export namespace LoginResponse {
  export type AsObject = {
    key: string,
  }

  export interface statusMap {
    SUCCESFULL: 0;
    WRONGKEY: 1;
    WRONGPASSWORD: 2;
    ERROR: 3;
  }

  export const status: statusMap;
}

export class NewAesPacket extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NewAesPacket.AsObject;
  static toObject(includeInstance: boolean, msg: NewAesPacket): NewAesPacket.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NewAesPacket, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NewAesPacket;
  static deserializeBinaryFromReader(message: NewAesPacket, reader: jspb.BinaryReader): NewAesPacket;
}

export namespace NewAesPacket {
  export type AsObject = {
  }
}

export class WrongAesKeyPack extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WrongAesKeyPack.AsObject;
  static toObject(includeInstance: boolean, msg: WrongAesKeyPack): WrongAesKeyPack.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WrongAesKeyPack, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WrongAesKeyPack;
  static deserializeBinaryFromReader(message: WrongAesKeyPack, reader: jspb.BinaryReader): WrongAesKeyPack;
}

export namespace WrongAesKeyPack {
  export type AsObject = {
  }
}

