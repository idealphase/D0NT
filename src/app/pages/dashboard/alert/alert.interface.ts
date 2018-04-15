export interface Alert {
    timestamp_s: string;
    client: string;
    query: string;
    _id: string;
    answer: string;
}
export interface AlertSource {
    source: Alert;
}