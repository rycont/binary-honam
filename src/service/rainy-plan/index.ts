import { cachedFetch } from '../cached-fetch'
import { RAINY_FIELD_ALIASES } from './constant'
import { getRequestURL } from './get-request-url'
import parsePrecipitationString from './utils/parse-precipitation-string'
import type { Position, RainPlan, WeatherReport } from './type'
import entryActions from './utils/entry-actions'

export async function getRainyTimesByPosition(position: Position) {
    const timelogString = `Fetching rain plan for ${position.x},${position.y}`
    console.time(timelogString)

    const requestURL = getRequestURL(position)
    const reports = await getKMAWeatherReportsFromURL(requestURL)

    const rainyCategoryReports = reports.filter(isRainyCategory)
    const reportsByTime = Object.groupBy(rainyCategoryReports, createTimeKey)

    const mergedRecords = new Map(
        Object.entries(reportsByTime)
            .map(entryActions.map(mergeReportsIntoRecord))
            .filter(entryActions.filter(isRainy))
    )

    console.timeEnd(timelogString)
    return mergedRecords
}

async function getKMAWeatherReportsFromURL(url: string) {
    const response = await cachedFetch(url)
    const data = await response.json()

    return data.response.body.items.item as WeatherReport[]
}

function createTimeKey(record: WeatherReport) {
    return record.fcstDate + ' ' + record.fcstTime
}

function mergeReportsIntoRecord(
    weatherReports: WeatherReport[] = []
): RainPlan {
    const entries = weatherReports.map((record) => [
        RAINY_FIELD_ALIASES[record.category],
        record.fcstValue,
    ])

    const mergedRecord = Object.fromEntries(entries)

    const precipitation = parsePrecipitationString(mergedRecord.precipitation)
    const probability = parseInt(mergedRecord.probability, 10)

    return { precipitation, probability }
}

function isRainy(record: RainPlan) {
    return record.precipitation > 0
}

function isRainyCategory(record: WeatherReport) {
    return record.category in RAINY_FIELD_ALIASES
}
