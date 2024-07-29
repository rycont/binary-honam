import { Temporal } from '@js-temporal/polyfill'
import { PRINCIPAL_STATIONS, getRainyTimes } from '../rainy-day'
import trainTimetable from '../train-timetable'
import type { RainyTrainPlans } from './type'

export async function getRainyTrains(): Promise<RainyTrainPlans[]> {
    const rainPlans = new Map(
        (
            await Promise.all(
                Object.values(PRINCIPAL_STATIONS).map(getRainyTimes)
            )
        ).flatMap((rainyTimesByStation) => [...rainyTimesByStation.entries()])
    )

    const rainyTimes = [...new Set(rainPlans.keys())].map((datetime) => ({
        raw: datetime,
        plainDateTime: datetimeToTemporalInstance(datetime),
    }))

    const rainyTrainPlans = rainyTimes.flatMap((rainyTime) => {
        const rainyStart = rainyTime.plainDateTime.toPlainTime()

        const weekdayTrainPlans = trainTimetable.getTrainPlans({
            day: rainyTime.plainDateTime.dayOfWeek,
        })

        return weekdayTrainPlans
            .filter((trainPlan) => {
                const departureAt = trainPlan.departure.time
                const arrivalAt = trainPlan.arrival.time

                const rainBeginsAfterDeparture =
                    Temporal.PlainTime.compare(departureAt, rainyStart) <= 0

                const rainBeginsBeforeArrival =
                    Temporal.PlainTime.compare(rainyStart, arrivalAt) <= 0

                const rainBeginsBetweenDepartureAndArrival =
                    rainBeginsAfterDeparture && rainBeginsBeforeArrival

                return rainBeginsBetweenDepartureAndArrival
            })
            .map((trainPlan) => ({
                trainPlan,
                rainyPlan: {
                    ...rainPlans.get(rainyTime.raw)!,
                    rainyTime: rainyTime.plainDateTime,
                },
            }))
    })

    const uniqueRainyTrainPlansMap = new Map<string, RainyTrainPlans>(
        rainyTrainPlans.map((rainyTrainPlan) => [
            `${
                rainyTrainPlan.trainPlan.trainNumber
            }-${rainyTrainPlan.rainyPlan.rainyTime.toString()}`,
            rainyTrainPlan,
        ])
    )

    return [...uniqueRainyTrainPlansMap.values()]
}

function datetimeToTemporalInstance(datetime: string) {
    const year = datetime.slice(0, 4)
    const month = datetime.slice(4, 6)
    const day = datetime.slice(6, 8)

    const hour = datetime.slice(9, 11)
    const minute = datetime.slice(11, 13)

    const temporalInstance = Temporal.PlainDateTime.from({
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
    })

    return temporalInstance
}
