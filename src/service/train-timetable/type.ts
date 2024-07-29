import type { Temporal } from '@js-temporal/polyfill'

export interface StationStop {
    station: string
    time: Temporal.PlainTime
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
