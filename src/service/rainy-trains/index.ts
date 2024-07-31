import { Temporal } from '@js-temporal/polyfill'
import { PRINCIPAL_STATIONS, getRainyTimesByPosition } from '../rainy-day'
import trainTimetable from '../train-timetable'
import type { RainyTrainPlan } from './type'

export async function getRainyTrains(): Promise<RainyTrainPlan[]> {
    const rainPlans = await getRainPlans()

    const rainyTrainPlans = rainPlans.flatMap((rainyTime) => {
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
                    ...rainyTime.plan,
                    rainyTime: rainyTime.plainDateTime,
                }
            }))
    })

    const uniqueRainyTrainPlansMap = new Map<string, RainyTrainPlan>(
        rainyTrainPlans.map((rainyTrainPlan) => [
            `${
                rainyTrainPlan.trainPlan.trainNumber
            }-${rainyTrainPlan.rainyPlan.rainyTime.toString()}`,
            rainyTrainPlan,
        ])
    )

    return [...uniqueRainyTrainPlansMap.values()]
}

async function getRainPlans() {
    const rainPlans = new Map(
        (
            await Promise.all(
                Object.values(PRINCIPAL_STATIONS).map(getRainyTimesByPosition)
            )
        ).flatMap((rainyTimesByStation) => [...rainyTimesByStation.entries()])
    )

    const rainyTimes = [...new Set(rainPlans.keys())].map((datetime) => ({
        plainDateTime: datetimeToTemporalInstance(datetime),
        plan: rainPlans.get(datetime)!,
    }))

    return rainyTimes
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
