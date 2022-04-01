/* eslint-disable indent */

const MARGIN = { top: 30, right: 0, bottom: 30, left: 50 }

const SM_WIDTH = 300 - MARGIN.left - MARGIN.right
const SM_HEIGHT = 300 - MARGIN.top - MARGIN.bottom

const COVID_WIDTH = 600 - MARGIN.left - MARGIN.right
const COVID_HEIGHT = 400 - MARGIN.top - MARGIN.bottom

const FREQ_COLOR = '#E83A14'
const CASES_COLOR = '#E83A14'
const DEATH_COLOR = '#890F0D'
const HOSPI_COLOR = '#373636'


/**
 * @param data
 * @param startDate
 * @param endDate
 */
export function DrawCount(data, startDate, endDate) {
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
 *
 */
export function DrawCovidViz(data, startDate, endDate) {
    console.log(data)

    var svg = d3.select('#covid-svg')
        .append('svg')
        .attr('width', COVID_WIDTH + MARGIN.left + MARGIN.right)
        .attr('height', COVID_HEIGHT + MARGIN.top + MARGIN.bottom)
        .append('g')
        .attr('transform',
            'translate(' + MARGIN.left + ',' + MARGIN.top + ')')

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return new Date(d.date) }))
        .range([0, COVID_WIDTH]);
    svg.append("g")
        .attr("transform", "translate(0," + COVID_HEIGHT + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain(
            [0, d3.max(data, function (d) {
                return Math.max(d.cases_moving_avg, d.death_moving_avg, d.hospi_moving_avg)
            })])
        .range([COVID_HEIGHT, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the lines
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", CASES_COLOR)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(new Date(d.date)) })
            .y(function (d) { return y(d.cases_moving_avg) })
        )

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", DEATH_COLOR)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(new Date(d.date)) })
            .y(function (d) { return y(d.death_moving_avg) })
        )

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", HOSPI_COLOR)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(new Date(d.date)) })
            .y(function (d) { return y(d.hospi_moving_avg) })
        )


    console.log(svg)
}

/**
 * @param data
 * @param startDate
 * @param endDate
 */
export function DrawSmallMultiple(data, startDate, endDate) {

    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) { return d.sport })
        .entries(data)

    // Order by frequency
    sumstat.sort(
        (a, b) =>
            d3.sum(a.values.map(o => o.moving_avg))
            - d3.sum(b.values.map(o => o.moving_avg))
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
    var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return new Date(d.date) }))
        .range([0, SM_WIDTH])
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + SM_HEIGHT + ')')
        .call(d3.axisBottom(x).ticks(2))

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.moving_avg })])
        .range([SM_HEIGHT, 0])
    svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y).ticks(5))

    // Draw the line
    svg.append('path')
        .attr('fill', FREQ_COLOR)
        .attr('d', function (d) {
            return d3.area()
                .x(function (d) { return x(new Date(d.date)) })
                .y0(y(0))
                .y1(function (d) { return y(+d.moving_avg) })(d.values)
        })

    // Add titles
    svg.append('text')
        .attr('text-anchor', 'start')
        .attr('y', -5)
        .attr('x', 0)
        .text(function (d) { return (d.key) })
}
