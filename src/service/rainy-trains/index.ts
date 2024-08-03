import { Temporal } from '@js-temporal/polyfill'
import trainTimetable from '../train-timetable'
import type { RainyTrain } from './type'
import getRainPlansByPositions from '../rainy-plan/get-rain-plan-by-position'
import PRINCIPAL_STATIONS from './principal-stations'
import type { TrainPlan } from '../train-timetable/type'
import type { RainPlanWithTime } from '../rainy-plan/type'

export async function getRainyTrains(): Promise<RainyTrain[]> {
    const rainPlansInPrincipalStations = await getRainPlansByPositions([
        ...PRINCIPAL_STATIONS.values(),
    ])

    const rainyTrainPlans =
        rainPlansInPrincipalStations.flatMap(getTrainsByRainyTime)

    const uniqueRainyTrainPlansMap = new Map<string, RainyTrain>(
        rainyTrainPlans.map((rainyTrainPlan) => [
            `${
                rainyTrainPlan.trainPlan.trainNumber
            }-${rainyTrainPlan.rainyPlan.startsAt.toPlainDate().toString()}`,
            rainyTrainPlan,
        ])
    )

    return [...uniqueRainyTrainPlansMap.values()]
}

function getTrainsByRainyTime(rainyPlan: RainPlanWithTime) {
    const rainyStart = rainyPlan.startsAt.toPlainTime()

    const weekdayTrainPlans = trainTimetable.getTrainPlans({
        day: rainyPlan.startsAt.dayOfWeek,
    })

    return weekdayTrainPlans
        .filter(figureIsRainyTrain(rainyStart))
        .map((trainPlan) => ({
            trainPlan,
            rainyPlan,
        }))
}

const figureIsRainyTrain =
    (rainyStart: Temporal.PlainTime) => (trainPlan: TrainPlan) => {
        const departureAt = trainPlan.departure.time
        const arrivalAt = trainPlan.arrival.time

        const rainBeginsAfterDeparture =
            Temporal.PlainTime.compare(departureAt, rainyStart) <= 0

        const rainBeginsBeforeArrival =
            Temporal.PlainTime.compare(rainyStart, arrivalAt) <= 0

        return rainBeginsAfterDeparture && rainBeginsBeforeArrival
    }
