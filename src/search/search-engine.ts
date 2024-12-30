import * as m from "../main";
export class StateSearchEngine {
    adapater : m.SamartHomeHandyBis;
    firstLevel: Map<string, ioBroker.Object> = new Map();
    constructor(adapter : m.SamartHomeHandyBis) {
        this.adapater = adapter;
    }

    async loadFirstLevel() : Promise<void> {
        const allObjects = await this.adapater.getForeignObjectsAsync("*");
        for(const obj in allObjects) {
            const splitted = obj.split(".");
            if(splitted.length < 2) {
                continue;
            }
            const level = splitted[0] + "." + splitted[1];
            if(this.firstLevel.has(level)) {
                continue;
            }
            const adapaterObj = await this.adapater.getForeignObjectAsync(level);
            if(adapaterObj != null) {
                this.firstLevel.set(level, adapaterObj);
            }
        }
    }
    /**
     * Get the first layer of states. So basicly all adapters
     */
    public getFirstLevel() : Map<string, ioBroker.Object> {
        return this.firstLevel;

    }

    /**
     * Searches states by pattern
     */
    public async searchKeyWord(keyword: string) : Promise<void> {
        const allObjects = await this.adapater.getForeignObjectsAsync("*" + keyword + "*");
        for(const obj in allObjects) {
        }

    }

    public getPossibleEnums() {

    }

    public getPossibleFunctions() {

    }
}