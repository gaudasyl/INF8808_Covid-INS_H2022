/* eslint-disable indent */
'use strict'

// import d3Tip from 'd3-tip'
import * as preprocess from './scripts/preprocessing.js'
import * as viz from './scripts/viz.js'

/**
 * @file This file is the entry-point for the the code for the Project for the course INF8808.
 * @author Matthieu Beaud ...
 * @version v1.0.0
 */

(function (d3) {
    d3.dsv(';', './data.csv').then(function (data) {
        const cleanData = preprocess.cleanData(data)
        const validEntries = preprocess.getOnlyValidEntries(data)
        console.log(validEntries.length + ' entrées acceptées')
        
        // const entryDatesBySports = preprocess.getDateAndGroupBySport(validEntries)
        // console.log(entryDatesBySports)
        // const sportsEntriesByDay = preprocess.getSportEntriesgroupByDays(entryDatesBySports)
        // console.log(sportsEntriesByDay)

        // start and end dates to define
        const dateDebut = new Date(2020, 0, 1)
        const dateFin = new Date(2022, 0, 1)
        viz.DrawCount(cleanData, dateDebut, dateFin)
        viz.DrawCovidViz()
        // viz.DrawSmallMultiple(sportsEntriesByDay, dateDebut, dateFin)
        viz.DrawSmallMultiplev2(cleanData)
    })
})(d3)
