import { Temporal } from '@js-temporal/polyfill'

const today = Temporal.Now.plainDateISO()

export default function getDateString(date: Temporal.PlainDate) {
    const daysDifference = date.since(today).days

    const { isoMonth, isoDay } = date.getISOFields()

    if (daysDifference === 0) {
        return '오늘'
    }

    if (daysDifference === 1) {
        return `내일(${isoMonth}월 ${isoDay}일)`
    }

    if (daysDifference === 2) {
        return `모레(${isoMonth}월 ${isoDay}일)`
    }

    return `${date.month}월 ${date.daysInMonth}일`
}
