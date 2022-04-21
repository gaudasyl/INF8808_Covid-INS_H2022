/* eslint-disable indent */
'use strict'
/**
 * @file This file is the entry-point for the the code for the Project for the course INF8808.
 * @author Matthieu Beaud ...
 * @version v1.0.0
 */

import * as viz from './scripts/viz.js'

const closedGymDates = [
    { start: new Date('2020-03-15'), end: new Date('2020-06-21') },
    { start: new Date('2020-10-08'), end: new Date('2021-03-21') },
    { start: new Date('2021-04-08'), end: new Date('2021-06-06') },
    { start: new Date('2021-12-20'), end: new Date('2022-02-13') }
]

document.getElementById('help-button').onclick = togglePopUp
document.getElementById('close-button').onclick = togglePopUp;

(function (d3) {
    d3.csv('./moving_avg_dataset.csv').then(function (data) {
        viz.DrawGlobalSport(data)
        viz.DrawSmallMultiple(data, closedGymDates)
        viz.DrawCountAndBindDataToCounter(data, closedGymDates)
    })

    d3.csv('./merged_covid_dataset.csv').then((data) => {
        viz.DrawCovidViz(data, closedGymDates)
    })
})(d3)

function togglePopUp() {
    var popup = document.getElementById('help-pop-up')
    popup.classList.toggle('visible')
}
