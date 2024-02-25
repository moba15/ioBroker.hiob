export enum HistoryBound {
    now = Date.now(),
    end_of_month = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getMilliseconds(),
    start_of_month = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getMilliseconds(),
}
