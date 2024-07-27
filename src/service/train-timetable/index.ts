import korailExpress from './korail-express-train.json'
import korailNormal from './korail-normal-train.json'
import srt from './srt.json'

import type { TrainPlan, TrainPlanQueryFilter } from './type'

const allTrainPlans: TrainPlan[] = [...korailExpress, ...korailNormal, ...srt]

const trainTimetable = {
    getTrainPlans(filter: TrainPlanQueryFilter) {
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
            filteredTrainPlans = filteredTrainPlans.filter((trainPlan) =>
                trainPlan.runningDay.includes(filter.day)
            )
        }

        return filteredTrainPlans
    },
}

export default trainTimetable
