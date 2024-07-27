export interface StationStop {
    station: string
    time: string
}

export interface TrainPlan {
    departure: StationStop
    arrival: StationStop
    trainName: string
    trainNumber: string
    mainline: string
    runningDay: number[]
}

export interface TrainPlanQueryFilter {
    pureHonamLineOnly: boolean
    trainName: string | null
    day: number
}
