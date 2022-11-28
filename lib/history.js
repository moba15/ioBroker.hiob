"use strict";

const SamartHomeHandyBis = require("../main");
const { Client } = require("./server");

const subscriptionType = {
	complete: 0,
	only_new: 1,
};

const getHistoryData = function(/** @type {{ sendTo: (arg0: string, arg1: string, arg2: { id: any; options: { start: any; end: any; aggregate: string; addId: boolean; }; }, arg3: any) => void; }} */ adapter, /** @type {any} */ objectID, /** @type {any} */ start, /** @type {any} */ end, /** @type {any} */ callback) {
	adapter.sendTo("sql.0", "getHistory", {
		id: objectID,
		options: {
			start: start,
			end:       end,
			aggregate: "onchange",
			addId: true
		}
	}, callback);
};

// eslint-disable-next-line no-unused-vars
class HistorySubscription {

	/**
	 * @param {string} objectID
	 * @param {number} subscriptionType
	 * @param {SamartHomeHandyBis} adapter
	 * @param {number} initalStart
	 * @param {number} intialEnd
	 * @param {Client} client
	 */
	constructor(adapter, objectID, subscriptionType, initalStart, intialEnd, client) {
		this.adapter = adapter;
		this.objectID = objectID;
		this.subscriptionType = subscriptionType;
		this.initalStart = initalStart;
		this.intialEnd = intialEnd;
		this.client = client;
	}

	/**
	 * @param {any} result
	 */
	processData(result) {
		if(result) {
			this.adapter.log.debug("DATA: \n " + JSON.stringify(result.result));
			this.client.sendMesg(JSON.stringify({"type" : "historyDataUpdate", "data": JSON.stringify(result.result)}), true);
			for (let i = 0; i < result.result.length; i++) {
				//this.adapter.log.info(result.result[i].id + " " + new Date(result.result[i].ts).toISOString() + " val: " + result.result[i].val.toString);
			}
		}
	}

	updateData() {
		if(this.lastUpdated != null) {
			this.adapter.log.info("Updating history data from: " + (new Date(this.lastUpdated).toTimeString()) + " to: " + (new Date(Date.now()).toTimeString()));
			this.adapter.sendTo("sql.0", "getHistory", {
				id: this.objectID,
				options: {
					start: this.lastUpdated,
					end:       Date.now(),
					aggregate: "none",
					addId: true
				}
			}, this.processData.bind(this));
		} else if(this.lastUpdated == null) {
			this.adapter.log.info("Get inital data from: " + (new Date(this.initalStart).toTimeString()) + " to: " + (new Date(this.intialEnd).toTimeString()));
			this.adapter.sendTo("sql.0", "getHistory", {
				id: this.objectID,
				options: {
					end:       this.intialEnd,
					start: this.initalStart,
					aggregate: "none",
					addId: true
				}
			}, this.processData.bind(this));
		}

		this.lastUpdated = Date.now();
	}

	start() {}
	end() {}
}

// eslint-disable-next-line no-unused-vars
class IntervalHistorySubscription extends HistorySubscription {

	/**
	 * @param {string} objectID
	 * @param {number} minInterval
	 * @param {any} adapter
	 * @param {number} subscriptionType
	 * @param {number} initalStart
	 * @param {number} intialEnd
	 * @param {any} client
	 */
	constructor(adapter, objectID, minInterval, initalStart, intialEnd, subscriptionType, client) {
		super(adapter, objectID, subscriptionType, initalStart, intialEnd , client);
		this.minInterval = minInterval;
	}




	start() {
		if(this.timer) {
			clearInterval(this.timer);
		}
		this.updateData();
		this.timer = setInterval(this.updateData.bind(this), this.minInterval);
	}
	end() {
		if(this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
}

// eslint-disable-next-line no-unused-vars
class OnUpdateHistorySubscription extends HistorySubscription {

	/**
	 * @param {any} adapter
	 * @param {string} objectID
	 * @param {number} minInterval
	 * @param {number} subscriptionType
	 * @param {number} initalStart
	 * @param {number} intialEnd
	 * @param {any} client
	 */
	constructor(adapter, objectID, minInterval, initalStart, intialEnd, subscriptionType, client) {
		super(adapter, objectID, subscriptionType, initalStart, intialEnd, client );
		this.minInterval = minInterval;
		this.adapter = adapter;

	}


	// eslint-disable-next-line no-unused-vars
	/**
	 * @param {{ objectID: string; }} event
	 */
	onUpdate(event) {
		if(event.objectID != this.objectID) {
			return;
		}
		this.adapter.log.debug("Update connection:" + this.client.isConnected.toString());
		if(!this.client.isConnected) {
			this.end();
		}
		let interval = this.minInterval;
		if(this.lastUpdated)
			interval = Date.now() - this.lastUpdated;
		this.adapter.log.debug("Interval: " + interval.toString() + " MinInterval");
		if(interval>=this.minInterval) {
			this.adapter.log.debug("Updating Date after change");
			this.updateData();
		}

	}

	start() {
		this.stoped = false;
		this.updateData();
		this.adapter.subscribeForeignStates(this.objectID);
		this.method = this.onUpdate.bind(this);
		this.adapter.listener.on("stateChanged", this.method); //TODO: Check
	}
	end() {
		this.stoped = true;
		this.adapter.log.debug("Stop OnUpdate");
		this.adapter.listener.removeListener("stateChanged", this.method); //TODO: Check
	}
}
module.exports = {
	HistorySubscription,
	IntervalHistorySubscription,
	OnUpdateHistorySubscription,
	subscriptionType
};


