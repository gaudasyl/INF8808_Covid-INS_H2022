/* eslint-disable camelcase */
/* eslint-disable indent */

const MARGIN = { top: 30, right: 0, bottom: 30, left: 50 }

const SM_WIDTH = 275 - MARGIN.left - MARGIN.right
const SM_HEIGHT = 275 - MARGIN.top - MARGIN.bottom

const COVID_WIDTH = 700 - MARGIN.left - MARGIN.right
const COVID_HEIGHT = 400 - MARGIN.top - MARGIN.bottom

const FREQ_COLOR = '#E83A14'
const CASES_COLOR = '#E83A14'
const DEATH_COLOR = '#890F0D'
const HOSPI_COLOR = '#373636'
const COVID_STROKE_WIDTH = 2.5
const FREQ_STROKE_WIDTH = 1.5
const HOVER_STROKE_WIDTH = 2

var selectedDate

var xScaleSM
var yScaleSM
var xScaleCov
var yScaleCov

/**
 * @param data
 * @param startDate
 * @param endDate
 */
export function DrawCount (data, startDate, endDate) {
    console.log('--- Counter ---')
    let saved = 0
    let total = 0
    data.forEach(element => {
        total += Number(element.athletes)
        if (startDate <= element.date && element.date <= endDate) {
            saved += Number(element.athletes)
        }
    })
    d3.select('#training-count').text(saved)
    d3.select('#total-training-count').text(`sur ${total}`)
}

/**
 * @param data
 * @param startDate
 * @param endDate
 */
export function DrawCovidViz (data, startDate, endDate) {
    console.log(data)

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
        .attr('transform', 'translate(0,' + COVID_HEIGHT + ')')
        .call(d3.axisBottom(xScaleCov))

    // Add Y axis
    yScaleCov = d3.scaleLinear()
        .domain(
            [0, d3.max(data, function (d) {
                return Math.max(d.cases_moving_avg, d.death_moving_avg, d.hospi_moving_avg)
            })])
        .range([COVID_HEIGHT, 0])
    svg.append('g')
        .call(d3.axisLeft(yScaleCov))

    // Add the lines
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', CASES_COLOR)
        .attr('stroke-width', COVID_STROKE_WIDTH)
        .attr('d', d3.line()
            .x(function (d) { return xScaleCov(new Date(d.date)) })
            .y(function (d) { return yScaleCov(d.cases_moving_avg) })
        )

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', DEATH_COLOR)
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(function (d) { return xScaleCov(new Date(d.date)) })
            .y(function (d) { return yScaleCov(d.death_moving_avg) })
        )

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', HOSPI_COLOR)
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(function (d) { return xScaleCov(new Date(d.date)) })
            .y(function (d) { return yScaleCov(d.hospi_moving_avg) })
        )

    svg.append('rect')
        .datum(data)
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('width', COVID_WIDTH)
        .attr('height', COVID_HEIGHT)
        .attr('id', 'covid')
        .on('mouseover', mouseover)
        .on('mousemove', function (d) { mousemove(this, d) })
        .on('mouseout', mouseout)

    // Create the circle that travels along the curve of chart
    var focus = svg
    .append('g')
    .append('circle')
    .datum(data)
    .classed('hover_circle_covid', true)
    .style('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', HOVER_STROKE_WIDTH)
    .attr('r', 8.5)
    .style('opacity', 0)

    // Create the text that travels along the curve of chart
    var focusText = svg
    .append('g')
    .append('text')
    .datum(data)
    .classed('hover_text_covid', true)
    .style('opacity', 0)
    .attr('text-anchor', 'left')
    .attr('alignment-baseline', 'middle')
    .style('font-weight', 'bold')

    // What happens when the mouse move -> show the annotations at the right positions.
    /**
     *
     */
     function mouseover () {
        ShowHoverTextAndCircles(1)
    }

    /**
     * @param rect
     * @param d
     */
    function mousemove (rect) {
        // recover coordinate we need
        var dateOfMousPos = xScaleCov.invert(d3.mouse(rect)[0])
        selectedDate = `${dateOfMousPos.getFullYear()}-${String(dateOfMousPos.getMonth() + 1).padStart(2, '0')}-${String(dateOfMousPos.getDate()).padStart(2, '0')}`
        UpdateHover()
    }

    /**
     *
     */
    function mouseout () {
        ShowHoverTextAndCircles(0)
    }
}

/**
 * @param data
 * @param startDate
 * @param endDate
 */
export function DrawSmallMultiple (data, startDate, endDate) {
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
    const VISIT_THRESHOLD = 100
    sumstat = sumstat.filter(
        (a) =>
            d3.sum(a.values.map(o => o.moving_avg)) > VISIT_THRESHOLD
    )

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
        .domain(d3.extent(data, function (d) { return new Date(d.date) }))
        .range([0, SM_WIDTH])
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + SM_HEIGHT + ')')
        .call(d3.axisBottom(xScaleSM).ticks(2))

    // Add Y axis
    yScaleSM = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.moving_avg })])
        .range([SM_HEIGHT, 0])
    svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScaleSM).ticks(5))

      // This allows to find the closest X index of the mouse:
  var bisect = d3.bisector(function (d) { return d.date }).left

    // Draw the line
    svg.append('path')
        .attr('stroke', FREQ_COLOR)
        .attr('fill', 'none')
        .attr('stroke-width', FREQ_STROKE_WIDTH)
        .attr('d', function (d) {
            return d3.area()
                .x(function (d) { return xScaleSM(new Date(d.date)) })
                .y0(yScaleSM(0))
                .y1(function (d) { return yScaleSM(+d.moving_avg) })(d.values)
        })

    svg.append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('width', SM_WIDTH)
        .attr('height', SM_HEIGHT)
        .attr('id', function (d) { return d.key })
        .on('mouseover', mouseover)
        .on('mousemove', function (d) { mousemove(this, d) })
        .on('mouseout', mouseout)

    // Create the circle that travels along the curve of chart
    var focus = svg
    .append('g')
    .append('circle')
    .classed('hover_circle', true)
    .style('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', HOVER_STROKE_WIDTH)
    .attr('r', 8.5)
    .style('opacity', 0)

    // Create the text that travels along the curve of chart
    var focusText = svg
    .append('g')
    .append('text')
    .classed('hover_text', true)
    .style('opacity', 0)
    .attr('text-anchor', 'left')
    .attr('alignment-baseline', 'middle')
    .style('font-weight', 'bold')

    // What happens when the mouse move -> show the annotations at the right positions.
    /**
     *
     */
    function mouseover () {
        ShowHoverTextAndCircles(1)
    }

    /**
     * @param rect
     * @param d
     */
    function mousemove (rect) {
        // recover coordinate we need
        var dateOfMousPos = xScaleSM.invert(d3.mouse(rect)[0])
        selectedDate = `${dateOfMousPos.getFullYear()}-${String(dateOfMousPos.getMonth() + 1).padStart(2, '0')}-${String(dateOfMousPos.getDate()).padStart(2, '0')}`
        UpdateHover()
    }

    /**
     *
     */
    function mouseout () {
        ShowHoverTextAndCircles(0)
    }

    // Add titles
    svg.append('text')
        .attr('text-anchor', 'start')
        .attr('y', -5)
        .attr('x', 0)
        .classed('sm-title', true)
        .text(function (d) { return (d.key) })
}

function UpdateHover () {
    d3.select('#hover-date').text('hovered date: ' + selectedDate)
    UpdateHoverSMViz()
    UpdateHoverCovid()
}

function UpdateHoverSMViz () {
    d3.selectAll('.hover_circle')
        .attr('cx', data => xScaleSM(new Date(data.values.find(element => element.date === selectedDate).date)))
        .attr('cy', data => yScaleSM(data.values.find(element => element.date === selectedDate).moving_avg))

    const textOffsetX = 10
    const textOffsetY = 20

    d3.selectAll('.hover_text')
    .attr('x', function (data) {
        const hoverData = data.values.find(element => element.date === selectedDate)
        const xPos = xScaleSM(new Date(hoverData.date))
        if (xPos > SM_WIDTH / 2) {
            return xPos - 4 * textOffsetX
        } else {
            return xPos + textOffsetX
        }
    })
    .attr('y', function (data) {
        const hoverData = data.values.find(element => element.date === selectedDate)
        return yScaleSM(hoverData.moving_avg) - textOffsetY
    })
    .html(function (data) {
        const hoverData = data.values.find(element => element.date === selectedDate)
        return (hoverData.moving_avg)
        })
}

function UpdateHoverCovid () {
   d3.select('.hover_circle_covid')
        .attr('cx', data => xScaleCov(new Date(data.find(element => element.date === selectedDate).date)))
        .attr('cy', data => yScaleCov(data.find(element => element.date === selectedDate).cases_moving_avg))
        const textOffsetX = 10
        const textOffsetY = 20
        d3.selectAll('.hover_text_covid')
        .attr('x', function (data) {
            const hoverData = data.find(element => element.date === selectedDate)
            const xPos = xScaleCov(new Date(hoverData.date))
            if (xPos > SM_WIDTH / 2) {
                return xPos - 4 * textOffsetX
            } else {
                return xPos + textOffsetX
            }
        })
        .attr('y', function (data) {
            const hoverData = data.find(element => element.date === selectedDate)
            return yScaleCov(hoverData.cases_moving_avg) - textOffsetY
        })
        .html(function (data) {
            const hoverData = data.find(element => element.date === selectedDate)
            return (hoverData.cases_moving_avg)
            })
}

function ShowHoverTextAndCircles (opacity) {
    d3.selectAll('.hover_text').style('opacity', opacity)
    d3.selectAll('.hover_circle').style('opacity', opacity)
    d3.selectAll('.hover_text_covid').style('opacity', opacity)
    d3.selectAll('.hover_circle_covid').style('opacity', opacity)

    if (opacity === 0) {
        d3.select('#hover-date').text('hovered date:')
    }
}
