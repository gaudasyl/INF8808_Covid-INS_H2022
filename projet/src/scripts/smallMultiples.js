/* eslint-disable no-unused-vars */
import { MARGIN, GRIDLINE_COLOR, GRIDLINE_STROKE_WIDTH, LINE_COLOR, textOffsetX, textOffsetY } from './marginAndColors'

import { dateRange, ChangeSelectedDate } from './covidViz'
import * as helper from './helper'
import * as interaction from './interaction'

const SM_WIDTH = 275 - MARGIN.left - MARGIN.right
const SM_HEIGHT = 275 - MARGIN.top - MARGIN.bottom

const FREQ_STROKE_WIDTH = 1
const HOVER_CIRCLE_RADIUS = 2

const MIN_VISIT_THRESHOLD = 250

var xScaleSM
var yScaleSM

var showAll = false

/**
 * @param data
 */
export function DrawSMViz (data) {
  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function (d) { return d.sport })
    .entries(data)

  // Order by frequency
  sumstat.sort(
    (a, b) =>
      d3.sum(a.values.map(o => o.moving_avg)) -
            d3.sum(b.values.map(o => o.moving_avg))
  ).reverse()

  // Limit minimum number of visits
  sumstat = sumstat.filter(
    (a) =>
      d3.sum(a.values.map(o => o.moving_avg)) > MIN_VISIT_THRESHOLD
  )

  // Only show some parts of the graph
  if (!showAll) {
    sumstat = sumstat.slice(0, 4)
  }

  // What is the list of groups?
  const allKeys = sumstat.map(function (d) { return d.key })

  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  var svg = d3.select('#smallMultiple-svg')
    .selectAll('uniqueChart')
    .data(sumstat)
    .enter()
    .append('svg')
    .attr('width', SM_WIDTH + MARGIN.left + MARGIN.right)
    .attr('height', SM_HEIGHT + MARGIN.top + MARGIN.bottom)
    .append('g')
    .attr('transform',
      'translate(' + MARGIN.left + ',' + MARGIN.top + ')')

  // Add X axis --> it is a date format
  xScaleSM = d3.scaleTime()
    .domain(dateRange)
    .range([0, SM_WIDTH])
  svg.append('g')
    .attr('class', 'x-axis-small-multiple')
    .attr('transform', 'translate(0,' + SM_HEIGHT + ')')
    .call(d3.axisBottom(xScaleSM).ticks(2))

  // Add Y axis
  yScaleSM = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(data, function (d) { return +d.moving_avg }) / 10) * 10])
    .range([SM_HEIGHT, 0])
  svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScaleSM).ticks(5))

  // Add Y grid
  const yAxisGrid = d3.axisLeft(yScaleSM).tickSize(-SM_WIDTH).tickFormat('').ticks(5)
  svg.append('g')
    .attr('class', 'y-axis-grid')
    .attr('color', GRIDLINE_COLOR)
    .attr('stroke-width', GRIDLINE_STROKE_WIDTH)
    .call(yAxisGrid)
    .call(g => g.select('.domain').remove())

  // Draw the line
  /**
   * @param d
   */
  function filterDateString (d) {
    var date = new Date(d.date)
    return dateRange[0] <= date & date <= dateRange[1]
  }
  svg.append('path')
    .attr('class', 'small-multiple-line')
    .style('pointer-events', 'none')
    .attr('stroke', LINE_COLOR)
    .attr('fill', 'none')
    .attr('stroke-width', FREQ_STROKE_WIDTH)
    .attr('d', function (d) {
      return d3.line()
        .x(function (d) { return xScaleSM(new Date(d.date)) })
        .y(function (d) { return yScaleSM(+d.moving_avg) })(d.values.filter((d) => filterDateString(d)))
    })

  // Create event listener
  svg.append('rect')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('width', SM_WIDTH)
    .attr('height', SM_HEIGHT)
    .attr('id', function (d) { return d.key })
    .on('mouseover', interaction.ShowHoverTextAndCircles(1))
    .on('mousemove', function (d) { mousemove(this, d) })
    .on('mouseout', interaction.ShowHoverTextAndCircles(0))

  /**
   * @param rect
   */
  function mousemove (rect) {
    // recover coordinate we need
    var dateOfMousPos = xScaleSM.invert(d3.mouse(rect)[0])
    ChangeSelectedDate(dateOfMousPos)
    interaction.UpdateHover()
  }

  // Create the circle that travels along the curve of chart
  svg.append('g')
    .append('circle')
    .classed('hover-circle', true)
    .style('fill', LINE_COLOR)
    .attr('r', HOVER_CIRCLE_RADIUS)
    .style('opacity', 0)

  // Create the text that travels along the curve of chart
  var text = svg.append('g')
    .style('pointer-events', 'none')
  text.append('rect')
    .classed('hover-text-bg', true)
    .style('opacity', 0)
    .attr('width', 50)
    .attr('height', 40)
    .attr('fill', '#EFEFEF')
  text.append('rect')
    .classed('hover-x-axis-line', true)
    .style('opacity', 0)
    .attr('width', 1)
    .attr('fill', '#b5b5b5')
    .attr('y', SM_HEIGHT)
  text.append('text')
    .classed('hover-text', true)
    .style('opacity', 0)
    .attr('text-anchor', 'left')
    .attr('alignment-baseline', 'middle')
    .style('font-weight', 'bold')

  // Add title
  svg.append('text')
    .attr('text-anchor', 'start')
    .attr('y', -5)
    .attr('x', 0)
    .attr('font-size', 14)
    .attr('font-weight', 'bold')
    .classed('sm-title', true)
    .text(function (d) { return (d.key) })

  // Add counter
  svg.append('text')
    .attr('id', function (d) { return `${d.key}-counter`.replace(/ /g, '') })
    .attr('text-anchor', 'start')
    .attr('y', -10)
    .attr('x', SM_WIDTH - 28)
    .attr('font-size', 10)
    .classed('sm-title', true)
    .classed('counter', true)
    .text('x')

  // Add subtitle
  svg.append('text')
    .attr('text-anchor', 'start')
    .attr('y', -1)
    .attr('x', SM_WIDTH - MARGIN.right - MARGIN.left - 16)
    .attr('font-size', 10)
    .classed('sm-title', true)
    .text('entraîn. sauvés')

  d3.select('button').on('click', () => ShowButton(data))
}

/**
 *
 */
export function UpdateHoverSMViz () {
  d3.selectAll('.hover-circle')
    .attr('cx', data => xScaleSM(new Date(helper.FindDataAtHoverDate(data).date)))
    .attr('cy', data => yScaleSM(helper.FindDataAtHoverDate(data).moving_avg))

  d3.selectAll('.hover-x-axis-line')
    .attr('x', data => xScaleSM(new Date(helper.FindDataAtHoverDate(data).date)))
    .attr('y', data => yScaleSM(helper.FindDataAtHoverDate(data).moving_avg))
    .attr('height', data => SM_HEIGHT - yScaleSM(helper.FindDataAtHoverDate(data).moving_avg))

  d3.selectAll('.hover-text')
    .attr('x', function (data) {
      const hoverData = helper.FindDataAtHoverDate(data)
      const xPos = xScaleSM(new Date(hoverData.date))
      if (xPos > SM_WIDTH / 2) {
        return xPos - 4 * textOffsetX
      } else {
        return xPos + textOffsetX
      }
    })
    .attr('y', function (data) {
      const hoverData = helper.FindDataAtHoverDate(data)
      return yScaleSM(hoverData.moving_avg) - textOffsetY
    })
    .html(function (data) {
      const hoverData = helper.FindDataAtHoverDate(data)
      return parseInt(hoverData.moving_avg)
    })

  d3.selectAll('.hover-text-bg')
    .attr('x', function (data) {
      const hoverData = helper.FindDataAtHoverDate(data)
      const xPos = xScaleSM(new Date(hoverData.date))
      if (xPos > SM_WIDTH / 2) {
        return xPos - 4 * textOffsetX
      } else {
        return xPos + textOffsetX
      }
    })
    .attr('y', function (data) {
      const hoverData = helper.FindDataAtHoverDate(data)
      return yScaleSM(hoverData.moving_avg) - textOffsetY - 25
    })
}

/**
 *
 */
export function UpdateTimeSM () {
  // update xScale
  xScaleSM.domain(dateRange)

  // update xaxis
  d3.selectAll('.x-axis-small-multiple')
    .transition()
    .duration(5)
    .call(d3.axisBottom(xScaleSM).ticks(2))

  function filterDateString (d) {
    var date = new Date(d.date)
    return dateRange[0] <= date & date <= dateRange[1]
  }

  d3.selectAll('.small-multiple-line')
    .transition().duration(5).attr('d', function (d) {
      return d3.line()
        .x(function (d) { return xScaleSM(new Date(d.date)) })
        .y(function (d) { return yScaleSM(+d.moving_avg) })(d.values.filter((d) => filterDateString(d)))
    })
}

/**
 * @param data
 */
function ShowButton (data) {
  showAll = !showAll
  if (showAll) {
    d3.select('button').text('Cacher')
  } else {
    d3.select('button').text('Tout Montrer')
  }
  d3.select('#smallMultiple-svg').selectAll('svg').remove()
  DrawSMViz(data)
}
