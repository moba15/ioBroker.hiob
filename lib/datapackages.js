/* eslint-disable indent */
const types = {
    stateChaged: "iobStateChanged",
    stateChangeRequest: "iobStateChangeRequest"
};
class DataPack {
    /**
     * @param {string} type
     */
    constructor(type) {
        this.type = type;
    }

    toJSON() {}
}
class StateChangedDataPack extends DataPack {
    constructor(objectID, value) {
        super(types.stateChaged);
        this.objectID = objectID;
        this.value = value;
    }

    toJSON() {
        const map = {
            "type": this.type,
            "objectID": this.objectID,
            "value": this.value,
        };
        return JSON.stringify(map).toString();
    }

}

module.exports = StateChangedDataPack;

