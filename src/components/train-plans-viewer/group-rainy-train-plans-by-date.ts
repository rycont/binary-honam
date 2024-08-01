import { Temporal } from '@js-temporal/polyfill'
import type { RainyTrain } from '../../service/rainy-trains/type'

export default function groupRainyTrainPlansByDate(rainyTrains: RainyTrain[]) {
    const rainyTrainPlansByDateMap = Map.groupBy(rainyTrains, (train) =>
        train.rainyPlan.startsAt.toPlainDate().toString()
    )

    const rainyTrainPlansByDate = [...rainyTrainPlansByDateMap.entries()]
        .map(([date, rainyTrainPlans]) => ({
            date: Temporal.PlainDate.from(date),
            rainyTrainPlans: rainyTrainPlans!,
        }))
        .toSorted((a, b) => Temporal.PlainDate.compare(a.date, b.date))

    return rainyTrainPlansByDate
}
