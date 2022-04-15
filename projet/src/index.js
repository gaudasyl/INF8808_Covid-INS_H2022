/* eslint-disable indent */
'use strict'

// import d3Tip from 'd3-tip'
import * as viz from './scripts/viz.js'

/**
 * @file This file is the entry-point for the the code for the Project for the course INF8808.
 * @author Matthieu Beaud ...
 * @version v1.0.0
 */

const fermeturesGym = [
    { start: new Date('2020-03-15'), end: new Date('2020-06-21') },
    { start: new Date('2020-10-08'), end: new Date('2021-03-21') },
    { start: new Date('2021-04-08'), end: new Date('2021-06-06') },
    { start: new Date('2021-12-20'), end: new Date('2022-02-13') }
]

// start and end dates to define
const startDate = "2020-06-15"
const endDate = "2022-02-16"

console.log('test');

(function (d3) {
    d3.csv('./moving_avg_dataset.csv').then(function (data) {
        viz.DrawCount(data, startDate, endDate)
        viz.DrawSmallMultiple(data, startDate, endDate)
        viz.DrawGlobalSport(data, startDate, endDate)
    })

    d3.csv('./merged_covid_dataset.csv').then((data) => {
        viz.DrawCovidViz(data, fermeturesGym, startDate, endDate)
    })
})(d3)
