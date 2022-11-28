const history = require("../history.js");
class HistroyManager {
	constructor(adapter) {
		this.adapter = adapter;
	}


	subscribeToHistory(dataPoint, start, end, client, interval) {
		this.adapter.log.debug("Subscribe to history: "  + dataPoint + ":" + start.toString() + "-" + end.toString() +  " Int:" + interval.toString());
		new history.OnUpdateHistorySubscription(this.adapter, dataPoint, interval, start, end, 1, client).start();

	}
}


module.exports = {
	HistroyManager,
};