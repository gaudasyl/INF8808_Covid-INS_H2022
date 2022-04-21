import { MARGIN, GRIDLINE_COLOR, GRIDLINE_STROKE_WIDTH, LINE_COLOR, textOffsetX, textOffsetY } from './marginAndColors'
import * as helper from './helper'
import * as interaction from './interaction'

const COVID_WIDTH = 700 - MARGIN.left - MARGIN.right
const COVID_HEIGHT = 400 - MARGIN.top - MARGIN.bottom
const COVID_STROKE_WIDTH = 1.5

var FIRST_INS_DATE = new Date('2020-06-22')
var LAST_INS_DATE = new Date('2022-02-12')
export var dateRange = [FIRST_INS_DATE, LAST_INS_DATE]

var xScaleCov
var yScaleCov

var isMouseDown = false

export var selectedDate
export var mousedownDate

const SELECTOR_TO_ATTR = {
  cases: 'cases_moving_avg',
  deaths: 'death_moving_avg',
  hospitalisations: 'hospi_moving_avg'
}

/**
 * @param data
 * @param dataFermetures
 * @param startDate
 * @param endDate
 * @param closedGymDates
 */
export function DrawCovidViz (data, closedGymDates) {
  var svg = d3.select('#covid-svg')
    .append('svg')
    .attr('width', COVID_WIDTH + MARGIN.left + MARGIN.right)
    .attr('height', COVID_HEIGHT + MARGIN.top + MARGIN.bottom)
    .append('g')
    .attr('transform',
      'translate(' + MARGIN.left + ',' + MARGIN.top + ')')

  // Add X axis --> it is a date format
  xScaleCov = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return new Date(d.date) }))
    .range([0, COVID_WIDTH])
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + COVID_HEIGHT + ')')
    .call(d3.axisBottom(xScaleCov))

  // Add Y axis
  yScaleCov = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => Math.max(d.cases_moving_avg))])
    .range([COVID_HEIGHT, 0])
  var yAxis = svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScaleCov))

  // Add Y grid
  const yAxisGrid = d3.axisLeft(yScaleCov).tickSize(-COVID_WIDTH).tickFormat('')
  svg.append('g')
    .attr('class', 'y-axis-grid')
    .attr('color', GRIDLINE_COLOR)
    .attr('stroke-width', GRIDLINE_STROKE_WIDTH)
    .call(yAxisGrid)
    .call(g => g.select('.domain').remove())

  // Add the cases line
  var line = svg.append('path')
    .datum(data)
    .style('pointer-events', 'none')
    .attr('fill', LINE_COLOR)
    .attr('fill-opacity', 0.2)
    .attr('stroke', LINE_COLOR)
    .attr('stroke-width', COVID_STROKE_WIDTH)
    .attr('d', d3.area()
      .x(function (d) { return xScaleCov(new Date(d.date)) })
      .y1(function (d) { return yScaleCov(d.cases_moving_avg) })
      .y0(yScaleCov(0))
    )

  // Create the circle that travels along the curve of chart
  svg.append('g')
    .append('circle')
    .datum(data)
    .classed('hover-circle_covid', true)
    .style('fill', LINE_COLOR)
    .attr('r', 3)
    .style('opacity', 0)

  // Create the text that travels along the curve of chart
  svg.append('g')
    .append('text')
    .datum(data)
    .classed('hover-text_covid', true)
    .style('opacity', 0)
    .attr('text-anchor', 'left')
    .attr('alignment-baseline', 'middle')
    .style('font-weight', 'bold')

  // Create the date that travels along the curve of chart
  svg.append('g')
    .append('text')
    .datum(data)
    .classed('hover-date_covid', true)
    .style('opacity', 0)
    .attr('text-anchor', 'left')
    .attr('alignment-baseline', 'middle')
    .style('font-weight', 'bold')

  // Add closed gyms
  svg.append('g')
    .classed('fermetures_gym', true)
    .selectAll('rect')
    .data(closedGymDates)
    .enter()
    .append('rect')
    .attr('x', element => xScaleCov(element.start))
    .attr('y', COVID_HEIGHT + 1)
    .attr('width', element => xScaleCov(element.end) - xScaleCov(element.start))
    .attr('height', 8)
    .attr('fill', 'black')
    .attr('opacity', 0.35)
    .on('mouseover', function () { OnGymClosedHover(this, 0.8) })
    .on('mouseout', function () { OnGymClosedHover(this, 0.5) })
    .on('mousedown', function (dates) { OnGymClosedClick(dates) })

  // Event listeners
  svg.append('rect')
    .datum(data)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('y', 30)
    .attr('width', COVID_WIDTH)
    .attr('height', COVID_HEIGHT - 30)
    .attr('id', 'covid')
    .on('mouseover', function () { interaction.ShowHoverTextAndCircles(1) })
    .on('mousemove', function (d) { mousemove(this, d) })
    .on('mouseout', function () {
      interaction.ShowHoverTextAndCircles(0)
      isMouseDown = false
    })
    .on('mousedown', function (d) { mousedown(this, d) })
    .on('mouseup', function () { isMouseDown = false })

  /**
   * @param rect
   * @param d
   */
  function mousemove (rect) {
    // recover coordinate we need
    var dateOfMousPos = xScaleCov.invert(d3.mouse(rect)[0])
    selectedDate = `${dateOfMousPos.getFullYear()}-${String(dateOfMousPos.getMonth() + 1).padStart(2, '0')}-${String(dateOfMousPos.getDate()).padStart(2, '0')}`
    interaction.UpdateHover()
    if (isMouseDown) {
      UpdateTimeWindow()
    }
  }

  /**
   * @param rect
   */
  function mousedown (rect) {
    var dateOfMousPos = xScaleCov.invert(d3.mouse(rect)[0])
    if (dateOfMousPos < FIRST_INS_DATE) {
      dateOfMousPos = FIRST_INS_DATE
    }
    mousedownDate = `${dateOfMousPos.getFullYear()}-${String(dateOfMousPos.getMonth() + 1).padStart(2, '0')}-${String(dateOfMousPos.getDate()).padStart(2, '0')}`
    isMouseDown = true
  }

  // create time windows
  svg.append('rect')
    .style('pointer-events', 'none')
    .style('fill', GRIDLINE_COLOR)
    .style('opacity', 0.4)
    .attr('class', 'time-window-left')
    .attr('height', COVID_HEIGHT)
    .attr('width', xScaleCov(dateRange[0]))
  svg.append('rect')
    .style('pointer-events', 'none')
    .style('fill', GRIDLINE_COLOR)
    .style('opacity', 0.4)
    .attr('x', COVID_WIDTH)
    .attr('class', 'time-window-right')
    .attr('height', COVID_HEIGHT)
    .attr('x', xScaleCov(LAST_INS_DATE))
    .attr('width', COVID_WIDTH - xScaleCov(dateRange[1]))

  /**
   *
   */
  function updateSelection () {
    var selector = document.getElementById('covid_data_select')
    var selection = selector.options[selector.selectedIndex].value

    var attribute = SELECTOR_TO_ATTR[selection]

    // update scale
    yScaleCov = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d[attribute]))])
      .range([COVID_HEIGHT, 0])

    // update line
    line
      .datum(data)
      .transition()
      .duration(500)
      .attr('d', d3.area()
        .x(function (d) { return xScaleCov(new Date(d.date)) })
        .y1(function (d) { return yScaleCov(d[attribute]) })
        .y0(yScaleCov(0))
      )

    // update axis
    yAxis
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScaleCov))
  }

  d3.select('#covid_data_select').on('change', updateSelection)
}

/**
 * @param rect
 * @param opacity
 */
function OnGymClosedHover (rect, opacity) {
  d3.select(rect).attr('opacity', opacity)
}

/**
 * @param closingDates
 * @param closingPeriod
 */
function OnGymClosedClick (closingPeriod) {
  if (closingPeriod.end < FIRST_INS_DATE || closingPeriod.start > LAST_INS_DATE) {
    console.log('no INS data for this closing time period')
    return
  }
  // keep the selected time range valid
  const validStartDate = closingPeriod.start > FIRST_INS_DATE ? closingPeriod.start : FIRST_INS_DATE
  const validEndDate = closingPeriod.end < LAST_INS_DATE ? closingPeriod.end : LAST_INS_DATE

  dateRange = [validStartDate, validEndDate]
  interaction.TimeWindowChange()
}

/**
 *
 */
function UpdateTimeWindow () {
  var a = new Date(mousedownDate)
  var b = new Date(selectedDate)
  var leftDate = a < b ? a : b
  var rightDate = a > b ? a : b

  if (leftDate < FIRST_INS_DATE) {
    leftDate = FIRST_INS_DATE
  }
  if (rightDate > LAST_INS_DATE) {
    rightDate = LAST_INS_DATE
  }

  dateRange = [leftDate, rightDate]

  interaction.TimeWindowChange()
}

export function UpdateTimeCovid () {
  d3.select('.time-window-left')
    .attr('width', xScaleCov(dateRange[0]))
  d3.select('.time-window-right')
    .attr('x', xScaleCov(dateRange[1]))
    .attr('width', COVID_WIDTH - xScaleCov(dateRange[1]))
}

/**
 *
 */
export function UpdateHoverCovid () {
  var selector = document.getElementById('covid_data_select')
  var selection = selector.options[selector.selectedIndex].value

  var attribute = SELECTOR_TO_ATTR[selection]

  d3.select('.hover-circle_covid')
    .attr('cx', xScaleCov(new Date(selectedDate)))
    .attr('cy', function (data) {
      const dataElement = data.find(element => element.date === selectedDate)
      if (dataElement === undefined) {
        return yScaleCov(data[0][attribute])
      }
      return yScaleCov(dataElement[attribute])
    })

  d3.selectAll('.hover-text_covid')
    .attr('x', function () {
      const xPos = xScaleCov(new Date(selectedDate))
      if (xPos > COVID_WIDTH / 2) {
        return xPos - 4 * textOffsetX
      } else {
        return xPos + textOffsetX
      }
    })
    .attr('y', function (data) {
      let hoverData = data.find(element => element.date === selectedDate)
      if (hoverData === undefined) {
        hoverData = data[0]
      }
      const yPos = yScaleCov(hoverData[attribute])
      if (yPos < 2 * textOffsetY) {
        return yPos + 2 * textOffsetY
      } else {
        return yPos - textOffsetX
      }
    })
    .html(function (data) {
      let hoverData = data.find(element => element.date === selectedDate)
      if (hoverData === undefined) {
        hoverData = data[0]
      }
      return Math.round(hoverData[attribute])
    })

  d3.selectAll('.hover-date_covid')
    .attr('x', function () {
      const xPos = xScaleCov(new Date(selectedDate))
      if (xPos > COVID_WIDTH / 2) {
        return xPos - 4 * textOffsetX
      } else {
        return xPos + textOffsetX
      }
    })
    .attr('y', function (data) {
      let hoverData = data.find(element => element.date === selectedDate)
      if (hoverData === undefined) {
        hoverData = data[0]
      }
      const yPos = yScaleCov(hoverData[attribute])
      if (yPos < 2 * textOffsetY) {
        return yPos + textOffsetY
      } else {
        return yPos - 2 * textOffsetY
      }
    })
    .html(function (data) {
      let hoverData = data.find(element => element.date === selectedDate)
      if (hoverData === undefined) {
        hoverData = data[0]
      }
      return helper.ToNiceString(hoverData.date)
    })
}

export function ChangeSelectedDate (newDate) {
  selectedDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`
}
