/* eslint-disable camelcase */
/* eslint-disable indent */

import * as covidViz from './covidViz'
import * as mainCounter from './mainCounter'
import * as smallMultiples from './smallMultiples'

export function DrawCountAndBindDataToCounter (data, closedGymDates) {
    mainCounter.DrawAndBindData(data, covidViz.dateRange, closedGymDates)
}

export function DrawCovidViz (data, closedGymDates) {
    covidViz.DrawCovidViz(data, closedGymDates)
}

export function DrawSmallMultiple (data) {
    smallMultiples.DrawSMViz(data)
}

export function DrawGlobalSport (data) {
    const svg = d3.select('#global-sport-svg')
}
