import { Temporal } from '@js-temporal/polyfill'
import korailExpress from './korail-express-train.json'
import korailNormal from './korail-normal-train.json'
import srt from './srt.json'

import type { TrainPlan, TrainPlanQueryFilter } from './type'

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
