import type { Temporal } from '@js-temporal/polyfill'
import type { RainPlan, RainPlanWithTime } from '../rainy-plan/type'
import type { TrainPlan } from '../train-timetable/type'

export interface RainyTrain {
    trainPlan: TrainPlan
    rainyPlan: RainPlanWithTime
}
