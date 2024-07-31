import type { Temporal } from '@js-temporal/polyfill'

export interface StationStop {
    station: string
    time: Temporal.PlainTime
}

export enum TrainName {
    MUGUNGHWA = '무궁화',
    ITX_MAUM = 'ITX-마음',
    ITX_SAEMAEUL = 'ITX-새마을',
    KTX_SANCHEON = 'KTX-산천',
    KTX_CHUNGRYONG = 'KTX-청룡',
    KTX = 'KTX',
    SRT = 'SRT'
}

export interface TrainPlan {
    departure: StationStop
    arrival: StationStop
    trainName: TrainName
    trainNumber: string
    mainline: string
    runningDay: number[]
}

export interface TrainPlanQueryFilter {
    pureHonamLineOnly: boolean
    trainName: TrainName | null
    day: number
}
