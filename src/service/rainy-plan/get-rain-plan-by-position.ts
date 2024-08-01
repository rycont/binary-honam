import { Temporal } from '@js-temporal/polyfill'
import { getRainyTimesByPosition } from '.'
import type { Position, RainPlanWithTime } from './type'

export default async function getRainPlansByPositions(
    positions: Position[]
): Promise<RainPlanWithTime[]> {
    const rainPlansByPositionMaps = await Promise.all(
        positions.map(getRainyTimesByPosition)
    )

    const mergedRainPlans = mergeMaps(rainPlansByPositionMaps)

    const rainyTimes = [...new Set(mergedRainPlans.keys())].map((datetime) => ({
        ...mergedRainPlans.get(datetime)!,
        startsAt: datetimeToTemporalInstance(datetime),
    }))

    return rainyTimes
}

function mergeMaps<K, V>(maps: Map<K, V>[]) {
    return new Map<K, V>(maps.flatMap((map) => [...map.entries()]))
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
