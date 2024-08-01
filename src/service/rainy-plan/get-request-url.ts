import { Temporal } from '@js-temporal/polyfill'

import type { Position } from './type'
import { API_BASE_URL } from './constant'

export function getRequestURL(position: Position) {
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
        serviceKey: import.meta.env.KMA_API_KEY,
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
