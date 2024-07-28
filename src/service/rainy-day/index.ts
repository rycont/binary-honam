import { KMA_API_KEY } from 'astro:env/server'
import type { Position, WeatherItem } from './type'
import { Temporal } from '@js-temporal/polyfill'

const API_BASE_URL =
    'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?'

export const PRINCIPAL_STATIONS = {
    용산: {
        x: 60,
        y: 126,
    },
    광주송정: {
        x: 57,
        y: 74,
    },
    서대전: {
        x: 68,
        y: 100,
    },
    목포: {
        x: 50,
        y: 66,
    },
}

export async function getRainyTimes(position: Position) {
    const options = { method: 'GET' }
    const requestURL = getRequestURL(position)

    const response = await fetch(requestURL, options)
    const data = await response.json()

    const item = data.response.body.items.item as WeatherItem[]

    const recordsByDate = Object.groupBy(
        item.filter(isRainyField),
        (item) => item.fcstDate + ' ' + item.fcstTime
    )

    const groupedRecords = new Map(
        Object.entries(recordsByDate)
            .map(([date, records]) => {
                return [date, parseGroupedRecords(records!)] as const
            })
            .filter(([_, data]) => data.precipitation !== '강수없음')
    )

    return groupedRecords
}

function isRainyField(item: WeatherItem) {
    return ['POP', 'PCP'].includes(item.category)
}

function getRequestURL(position: Position) {
    let baseDateInstance = Temporal.Now.zonedDateTimeISO('Asia/Seoul').with({
        minute: 0,
        second: 0,
        microsecond: 0,
        millisecond: 0,
        nanosecond: 0,
    })

    const currentHour = baseDateInstance.hour

    if (currentHour < 5) {
        baseDateInstance = baseDateInstance.add({ days: -1 })
        baseDateInstance = baseDateInstance.with({ hour: 17 })
    } else if (currentHour < 17) {
        baseDateInstance = baseDateInstance.with({ hour: 5 })
    } else {
        baseDateInstance = baseDateInstance.with({ hour: 17 })
    }

    const baseDate =
        baseDateInstance.year.toString() +
        baseDateInstance.month.toString().padStart(2, '0') +
        baseDateInstance.day.toString().padStart(2, '0')

    const baseTime =
        baseDateInstance.toPlainTime().hour.toString().padStart(2, '0') + '00'

    const params = {
        serviceKey: KMA_API_KEY,
        dataType: 'JSON',
        numOfRows: '1024',
        pageNo: '1',
        base_date: baseDate,
        base_time: baseTime,
        nx: position.x.toString(),
        ny: position.y.toString(),
    }

    const queryString = new URLSearchParams(params).toString()

    return API_BASE_URL + queryString
}

const shortcutToReadable: Record<string, string> = {
    POP: 'probability',
    PCP: 'precipitation',
}

function parseGroupedRecords(records: WeatherItem[]) {
    const entries = records.map((record) => [
        shortcutToReadable[record.category],
        record.fcstValue,
    ])
    return Object.fromEntries(entries) as Record<
        'probability' | 'precipitation',
        string
    >
}
