import { getRainyTimesByPosition } from '.'
import type { Position, RainPlanWithTime } from './type'
import parseKMADatetimeString from './utils/parse-kma-datetime-string'
import mergeMaps from './utils/merge-maps'

export default async function getRainPlansByPositions(
    positions: Position[]
): Promise<RainPlanWithTime[]> {
    const rainPlansByPositionMaps = await Promise.all(
        positions.map(getRainyTimesByPosition)
    )

    const mergedRainPlans = mergeMaps(rainPlansByPositionMaps)

    const rainyTimes = [...new Set(mergedRainPlans.keys())].map((datetime) => ({
        ...mergedRainPlans.get(datetime)!,
        startsAt: parseKMADatetimeString(datetime),
    }))

    return rainyTimes
}
