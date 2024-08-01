import { Temporal } from '@js-temporal/polyfill'

export default function parseKMADatetimeString(datetime: string) {
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
