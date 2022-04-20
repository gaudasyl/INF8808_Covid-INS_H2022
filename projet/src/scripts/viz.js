/* eslint-disable camelcase */
/* eslint-disable indent */

const MARGIN = { top: 30, right: 0, bottom: 30, left: 50 }

const SM_WIDTH = 275 - MARGIN.left - MARGIN.right
const SM_HEIGHT = 275 - MARGIN.top - MARGIN.bottom

const COVID_WIDTH = 700 - MARGIN.left - MARGIN.right
const COVID_HEIGHT = 400 - MARGIN.top - MARGIN.bottom

const LINE_COLOR = '#E83A14'

const COVID_STROKE_WIDTH = 1.5
const FREQ_STROKE_WIDTH = 1
const HOVER_CIRCLE_RADIUS = 2

const GRIDLINE_STROKE_WIDTH = 0.5
const GRIDLINE_COLOR = '#C4C4C4'

var FIRST_INS_DATE = new Date('2020-06-22')
var LAST_INS_DATE = new Date('2022-02-12')
var dateRange = [FIRST_INS_DATE, LAST_INS_DATE]

const closedGymDates = [
    { start: new Date('2020-03-15'), end: new Date('2020-06-21') },
    { start: new Date('2020-10-08'), end: new Date('2021-03-21') },
    { start: new Date('2021-04-08'), end: new Date('2021-06-06') },
    { start: new Date('2021-12-20'), end: new Date('2022-02-13') }
]

const MIN_DATE_SELECTION_DAYS = 30

const MIN_VISIT_THRESHOLD = 250

var selectedDate
var mousedownDate
var isMouseDown = false

var xScaleSM
var yScaleSM
var xScaleGlob
var yScaleGlob
var xScaleCov
var yScaleCov

var covid_data_selected = 'cases'

var showAll = false

/**
 * @param data
 * @param startDate
 * @param endDate
 */
export function DrawCountAndBindDataToCounter (data) {
    d3.select('#training-count').datum(data)
    UpdateMainTrainingSavedCounter()
}

/**
 *
 */
function UpdateMainTrainingSavedCounter () {
    const data = d3.select('#training-count').data()[0]
    let saved = 0
    let total = 0
    data.forEach(element => {
        const d = new Date(element.date)
        if (dateRange[0] < d && d < new Date(dateRange[1])) {
            total += Number(element.athletes)
            closedGymDates.forEach(function (date) {
                if (date.start < d && d < date.end) {
                    saved += Number(element.athletes)
                }
            })
        }
    })
    d3.select('#training-count').datum(data).text(saved)
    d3.select('#total-training-count').datum(data).text(`sur ${total}`)
}

/**
 *
 */

const SELECTOR_TO_ATTR = {
    cases: 'cases_moving_avg',
    deaths: 'death_moving_avg',
    hospitalisations: 'hospi_moving_avg'
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
    TimeWindowChange()
}

/**
 * @param data
 * @param dataFermetures
 * @param startDate
 * @param endDate
 */
export function DrawCovidViz (data) {
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
    var circle = svg.append('g')
        .append('circle')
        .datum(data)
        .classed('hover-circle_covid', true)
        .style('fill', LINE_COLOR)
        .attr('r', 3)
        .style('opacity', 0)

    // Create the text that travels along the curve of chart
    var text = svg.append('g')
        .append('text')
        .datum(data)
        .classed('hover-text_covid', true)
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
        .on('mouseover', mouseover)
        .on('mousemove', function (d) { mousemove(this, d) })
        .on('mouseout', mouseout)
        .on('mousedown', function (d) { mousedown(this, d) })
        .on('mouseup', mouseup)

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

        if (isMouseDown) {
            UpdateTimeWindow()
        }
    }

    /**
     *
     */
    function mouseout () {
        ShowHoverTextAndCircles(0)
        isMouseDown = false
    }

    /**
     *
     */
    function mouseup () {
        isMouseDown = false
    }
    /**
     * @param rect
     */
    function mousedown (rect) {
        var dateOfMousPos = xScaleCov.invert(d3.mouse(rect)[0])
        mousedownDate = `${dateOfMousPos.getFullYear()}-${String(dateOfMousPos.getMonth() + 1).padStart(2, '0')}-${String(dateOfMousPos.getDate()).padStart(2, '0')}`
        isMouseDown = true
    }

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
 * @param data
 * @param startDate
 * @param endDate
 */
export function DrawSmallMultiple (data) {
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
                .y(function (d) { return yScaleSM(+d.moving_avg) })
                (d.values.filter((d) => filterDateString(d)))
        })

    // Create event listener
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

    // What happens when the mouse move -> show the annotations at the right positions.
    /**
     *
     */
    function mouseover () {
        ShowHoverTextAndCircles(1)
        UpdateSavedTraining(data)
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

    UpdateSavedTraining(data)

    d3.select('button').on('click', () => ShowButton(data))
}

/**
 * @param data
 */
function UpdateSavedTraining (data) {
    const sport_dict = {}
    data.forEach(element => {
       if (!sport_dict[element.sport]) {
           sport_dict[element.sport] = 0
       }
    })
    data.forEach(element => {
        const d = new Date(element.date)
        if (dateRange[0] <= d && d <= dateRange[1]) {
            closedGymDates.forEach(function (date) {
                if (date.start < d && d < date.end) {
                    sport_dict[element.sport] += Number(element.athletes)
                }
            })
            }
        })

    for (const [key, value] of Object.entries(sport_dict)) {
        d3.select(`#${key.replace(/ /g, '')}-counter`).text('')
        d3.select(`#${key.replace(/ /g, '')}-counter`).text(value)
    }
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
    DrawSmallMultiple(data, null, null)
}

/**
 *
 */
function UpdateHover () {
    d3.select('#hover-date').text('hovered date: ' + selectedDate)
    UpdateHoverSMViz()
    UpdateHoverCovid()
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

    TimeWindowChange()
}

/**
 *
 */
function TimeWindowChange () {
    d3.select('.time-window-left')
    .attr('width', xScaleCov(dateRange[0]))
    d3.select('.time-window-right')
        .attr('x', xScaleCov(dateRange[1]))
        .attr('width', COVID_WIDTH - xScaleCov(dateRange[1]))

    UpdateTimeSM()
    UpdateMainTrainingSavedCounter()
}

/**
 *
 */
function UpdateTimeSM () {
    // update xScale
    xScaleSM.domain(dateRange)

    // update xaxis
    d3.selectAll('.x-axis-small-multiple')
        .transition()
        .duration(5)
        .call(d3.axisBottom(xScaleSM).ticks(2))

    // update line
    /**
     * @param d
     */
    function filterDateString (d) {
        var date = new Date(d.date)
        return dateRange[0] <= date & date <= dateRange[1]
    }

    d3.selectAll('.small-multiple-line')
        .transition().duration(5).attr('d', function (d) {
            return d3.line()
                .x(function (d) { return xScaleSM(new Date(d.date)) })
                .y(function (d) { return yScaleSM(+d.moving_avg) })
                (d.values.filter((d) => filterDateString(d)))
        })
}

/**
 *
 */
function UpdateHoverSMViz () {
        d3.selectAll('.hover-circle')
            .attr('cx', data => xScaleSM(new Date(data.values.find(element => element.date === selectedDate).date)))
            .attr('cy', data => yScaleSM(data.values.find(element => element.date === selectedDate).moving_avg))

        d3.selectAll('.hover-x-axis-line')
            .attr('x', data => xScaleSM(new Date(data.values.find(element => element.date === selectedDate).date)))
            .attr('y', data => yScaleSM(data.values.find(element => element.date === selectedDate).moving_avg))
            .attr('height', data => SM_HEIGHT - yScaleSM(data.values.find(element => element.date === selectedDate).moving_avg))

    const textOffsetX = 10
    const textOffsetY = 20

    d3.selectAll('.hover-text')
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
            return parseInt(hoverData.moving_avg)
        })

    d3.selectAll('.hover-text-bg')
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
            return yScaleSM(hoverData.moving_avg) - textOffsetY - 25
        })
}

/**
 *
 */
function UpdateHoverCovid () {
    var selector = document.getElementById('covid_data_select')
    var selection = selector.options[selector.selectedIndex].value

    var attribute = SELECTOR_TO_ATTR[selection]

    d3.select('.hover-circle_covid')
        .attr('cx', data => xScaleCov(new Date(data.find(element => element.date === selectedDate).date)))
        .attr('cy', data => yScaleCov(data.find(element => element.date === selectedDate)[attribute]))
    const textOffsetX = 10
    const textOffsetY = 20

    d3.selectAll('.hover-text_covid')
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
            return yScaleCov(hoverData[attribute]) - textOffsetY
        })
        .html(function (data) {
            const hoverData = data.find(element => element.date === selectedDate)
            return Math.round(hoverData[attribute])
        })
}

/**
 * @param opacity
 */
function ShowHoverTextAndCircles (opacity) {
    d3.selectAll('.hover-text').style('opacity', opacity)
    d3.selectAll('.hover-text-bg').style('opacity', opacity)
    d3.selectAll('.hover-x-axis-line').style('opacity', opacity)
    d3.selectAll('.hover-circle').style('opacity', opacity)
    d3.selectAll('.hover-text_covid').style('opacity', opacity)
    d3.selectAll('.hover-circle_covid').style('opacity', opacity)

    if (opacity === 0) {
        d3.select('#hover-date').text('hovered date:')
    }
}

// Draw global sport viz
/**
 * @param data
 * @param startDate
 * @param endDate
 */
export function DrawGlobalSport (data, startDate, endDate) {
    const svg = d3.select('#global-sport-svg')
    }
