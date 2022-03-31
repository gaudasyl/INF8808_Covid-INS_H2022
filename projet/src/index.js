/* eslint-disable indent */
'use strict'

// import d3Tip from 'd3-tip'
import * as viz from './scripts/viz.js'

/**
 * @file This file is the entry-point for the the code for the Project for the course INF8808.
 * @author Matthieu Beaud ...
 * @version v1.0.0
 */

(function (d3) {
    d3.csv('./moving_avg_dataset.csv').then(function (data) {
        console.log(data)
        // start and end dates to define
        const startDate = new Date(2020, 0, 1)
        const endDate = new Date(2022, 0, 1)
        viz.DrawCount(data, startDate, endDate)
        viz.DrawCovidViz()
        viz.DrawSmallMultiple(data, startDate, endDate)
    })
})(d3)
