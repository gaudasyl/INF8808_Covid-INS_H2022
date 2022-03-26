/* eslint-disable indent */
'use strict'

import d3Tip from 'd3-tip'
import * as preprocess from './scripts/preprocessing.js'
import * as viz from './scripts/viz.js'

/**
 * @file This file is the entry-point for the the code for the Project for the course INF8808.
 * @author Matthieu Beaud ...
 * @version v1.0.0
 */

(function (d3) {
    d3.dsv(';', './data.csv').then(function (data) {
        console.log(data)
        const cleanData = preprocess.getDateAndGroupBySport(data)
        console.log(cleanData)

        viz.DrawCount()
    })
})(d3)
