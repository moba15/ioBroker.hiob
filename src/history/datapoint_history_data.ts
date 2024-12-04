import type { HistoryBound } from './history_bound';
import type { HistoryMethod } from './history_method';

export class DatapointHistoryData {
    datapoint: string;
    method: HistoryMethod;
    lastUpdated: number;
    lowerBound: HistoryBound;
    upperBound: HistoryBound;

    constructor(
        datapoint: string,
        method: HistoryMethod,
        lastUpadted: number,
        lowerBound: HistoryBound,
        upperBound: HistoryBound,
    ) {
        this.datapoint = datapoint;
        this.method = method;
        this.lastUpdated = lastUpadted;
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
    }
}
