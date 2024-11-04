// package: 
// file: proto/packages.proto

import * as jspb from "google-protobuf";

export class Package extends jspb.Message {
  getType(): PackageTypeMap[keyof PackageTypeMap];
  setType(value: PackageTypeMap[keyof PackageTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Package.AsObject;
  static toObject(includeInstance: boolean, msg: Package): Package.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Package, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Package;
  static deserializeBinaryFromReader(message: Package, reader: jspb.BinaryReader): Package;
}

export namespace Package {
  export type AsObject = {
    type: PackageTypeMap[keyof PackageTypeMap],
  }
}

export interface PackageTypeMap {
  FIRSTPING: 0;
}

export const PackageType: PackageTypeMap;

