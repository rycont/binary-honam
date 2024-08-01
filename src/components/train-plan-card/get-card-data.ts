import mugunghwa from './train-images/무궁화.svg'
import itxMaum from './train-images/ITX-마음.svg'
import itxSaemaeul from './train-images/ITX-새마을.svg'
import ktx from './train-images/KTX.svg'
import ktxSancheon from './train-images/KTX-산천.svg'
import ktxCheongryong from './train-images/KTX-청룡.svg'
import srt from './train-images/SRT.svg'

import {
    trainNameToCodeMap,
    type TrainPlan,
} from '../../service/train-timetable/type'
import type { Temporal } from '@js-temporal/polyfill'

export default function getCardData(trainPlan: TrainPlan) {
    const code = trainNameToCodeMap[trainPlan.trainName].toLowerCase()

    const mainline = trainPlan.mainline
    const isPureHonam = mainline === '호남선'

    const image = trainImages[trainPlan.trainName].src

    const departureAt = formatTime(trainPlan.departure.time)
    const arrivalAt = formatTime(trainPlan.arrival.time)

    const name = trainPlan.trainName
    const number = trainPlan.trainNumber

    return {
        plan: {
            departure: {
                station: trainPlan.departure.station,
                time: departureAt,
            },
            arrival: {
                station: trainPlan.arrival.station,
                time: arrivalAt,
            },
            isPureHonam,
            number,
        },
        train: {
            name,
            code,
            image,
        },
    }
}

function formatTime(time: Temporal.PlainTime) {
    return (
        time.hour.toString().padStart(2, '0') +
        ':' +
        time.minute.toString().padStart(2, '0')
    )
}

const trainImages = {
    무궁화: mugunghwa,
    'ITX-마음': itxMaum,
    'ITX-새마을': itxSaemaeul,
    KTX: ktx,
    'KTX-산천': ktxSancheon,
    'KTX-청룡': ktxCheongryong,
    SRT: srt,
}
