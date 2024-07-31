import type { Temporal } from '@js-temporal/polyfill'
import type { RainPlan } from '../rainy-day/type'
import type { TrainPlan } from '../train-timetable/type'

export interface RainyTrainPlan {
    trainPlan: TrainPlan
    rainyPlan: RainPlan & {
        rainyTime: Temporal.PlainDateTime
    }
}
