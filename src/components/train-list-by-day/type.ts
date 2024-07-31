import type { Temporal } from "@js-temporal/polyfill";

import type { RainyTrainPlan } from "../../service/rainy-trains/type";

export interface TrainListByDay {
    date: Temporal.PlainDate;
    rainyTrainPlans: RainyTrainPlan[];
}
