import { Temporal } from '@js-temporal/polyfill'
import korailExpress from './korail-express-train.json'
import korailNormal from './korail-normal-train.json'
import srt from './srt.json'

import { TrainName, type TrainPlan, type TrainPlanQueryFilter } from './type'

const trainKorNameToEnumMap: Record<string, TrainName> = {
    '무궁화': TrainName.MUGUNGHWA,
    'ITX-마음': TrainName.ITX_MAUM,
    'ITX-새마을': TrainName.ITX_SAEMAEUL,
    'KTX-산천': TrainName.KTX_SANCHEON,
    'KTX-청룡': TrainName.KTX_CHUNGRYONG,
    'KTX': TrainName.KTX,
    'SRT': TrainName.SRT,
}

const allTrainPlans: TrainPlan[] = [
    ...korailExpress,
    ...korailNormal,
    ...srt,
].map((trainPlan) => ({
    ...trainPlan,
    departure: {
        station: trainPlan.departure.station,
        time: parsePlanTime(trainPlan.departure.time),
    },
    arrival: {
        station: trainPlan.arrival.station,
        time: parsePlanTime(trainPlan.arrival.time),
    },
    trainName: trainKorNameToEnumMap[trainPlan.trainName],
}))

const trainTimetable = {
    getTrainPlans(filter: Partial<TrainPlanQueryFilter>) {
        let filteredTrainPlans = allTrainPlans

        if (filter.pureHonamLineOnly) {
            filteredTrainPlans = filteredTrainPlans.filter(
                (trainPlan) => trainPlan.mainline === '호남선'
            )
        }

        if (filter.trainName) {
            filteredTrainPlans = filteredTrainPlans.filter(
                (trainPlan) => trainPlan.trainName === filter.trainName
            )
        }

        if (filter.day) {
            const day = filter.day
            filteredTrainPlans = filteredTrainPlans.filter((trainPlan) =>
                trainPlan.runningDay.includes(day)
            )
        }

        return filteredTrainPlans
    },
}

function parsePlanTime(timeString: string) {
    const [hour, minute] = timeString.split(':').map(Number)
    return Temporal.PlainTime.from({ hour, minute })
}

export default trainTimetable
