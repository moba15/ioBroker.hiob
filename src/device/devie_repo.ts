import { Events } from "../listener/listener";
import { SamartHomeHandyBis } from "../main";
import { Client } from "../server/client";
import { GetIoBFunctionsDataPackage } from "../server/datapacks";

export class DeviceRepo {
    adapter: SamartHomeHandyBis;
    constructor(adapter: SamartHomeHandyBis) {
        this.adapter = adapter;
    }



    public async onGetIoBFunctions(client: Client) : Promise<void> {
        const functions: {id: string, name: string, icon: string | undefined}[] = [];
        const results = await this.adapter.getEnumsAsync("functions");
        const functionsResult = results["enum.functions"];
        for(const functionsId in functionsResult) {
            const func = functionsResult[functionsId];
            let name :ioBroker.StringOrTranslated = func.common.name;
            if(typeof name != "string") {
                name = (name as ioBroker.Translated).de ??  (name as ioBroker.Translated).en;
            }
            functions.push({
                id: functionsId,
                name: name,
                icon: func.common.icon
            });
        }

        client.sendMSG(new GetIoBFunctionsDataPackage(functions).toJSON(), true, true);
    }



}