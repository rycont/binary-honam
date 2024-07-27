export interface StationStop {
    station: string;
    time: string;
}

export interface TrainPlan {
    departure: StationStop;
    arrival: StationStop;
    trainName: string;
    trainNumber: string;
    runningDay?: number[]
}
