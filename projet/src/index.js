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
        viz.DrawCountAndBindDataToCounter(data)
        viz.DrawSmallMultiple(data)
        viz.DrawGlobalSport(data)
    })

    d3.csv('./merged_covid_dataset.csv').then((data) => {
        viz.DrawCovidViz(data)
    })
})(d3)
