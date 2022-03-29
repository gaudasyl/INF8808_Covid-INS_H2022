/* eslint-disable indent */

const margin = { top: 30, right: 0, bottom: 30, left: 50 }
const width = 210 - margin.left - margin.right
const height = 210 - margin.top - margin.bottom

/**
 * @param data
 * @param date1
 * @param date2
 */
export function DrawCount (data, date1, date2) {
    console.log('--- Counter ---')
    console.log(data)
    const saved = data.filter(x => x.date < date2 && x.date > date1).length
    const total = data.length
    d3.select('#training-count').text(saved)
    d3.select('#total-training-count').text(`sur ${total}`)
}

/**
 *
 */
export function DrawCovidViz () {
    console.log('--- Covid Viz ---')
}

/**
 * @param data
 * @param date1
 * @param date2
 */
export function DrawSmallMultiple (data, date1, date2) {
    console.log('--- Small mutliples viz ---')
    Object.keys(data).forEach((sport) => {
        DrawOneSportMultiple(data[sport], sport, 200, 200)
    })
}

/**
 * @param data
 * @param sportName
 * @param width
 * @param height
 */
function DrawOneSportMultiple (data, sportName, width, height) {
    const svg = d3.select('#smallMultiple-svg')
        .append('div')
        .attr('id', sportName)
        .classed('smallMultiple', true) // add style sheet rule for smallMultiple lineCharts
        .attr('width', width)
        .attr('height', height)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

    svg.append('text')
        .attr('transform', 'translate(0,' + 20 + ')')
        .classed('title', true)
        .text(sportName)

    height -= 20
    width -= 20
        // Add X axis --> it is a date format
    var xScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date }))
        .range([0, width])
        svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .classed('xAxis', true)
        .call(d3.axisBottom(xScale))

    // Add Y axis
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.entries })])
        .range([height, 0])
    svg.append('g')
        .classed('yAxis', true)
        .call(d3.axisLeft(yScale))

    // Add the line
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(function (d) { return xScale(d.date) })
            .y(function (d) { return yScale(d.entries) })
        )
}

/**
 * @param data
 */
export function DrawSmallMultiplev2 (data) {
    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                .key(function (d) { return d.sport })
                .entries(data)

    // What is the list of groups?
    const allKeys = sumstat.map(function (d) { return d.key })

    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    var svg = d3.select('#smallMultiple-svg')
                .selectAll('uniqueChart')
                .data(sumstat)
                .enter()
                .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform',
                        'translate(' + margin.left + ',' + margin.top + ')')

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.date }))
            .range([0, width])
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).ticks(3))

    // Add Y axis
    var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d.weeklyAvg })])
                .range([height, 0])
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5))

    // Draw the line
    svg.append('path')
        .attr('fill', '#1c87c9')
       .attr('stroke', 'red')
       .attr('d', function (d) {
        return d3.area()
        .x(function (d) { return x(d.date) })
        .y0(y(0))
        .y1(function (d) { return y(+d.weeklyAvg) })(d.values)
       })

    // Add titles
    svg.append('text')
        .attr('text-anchor', 'start')
        .attr('y', -5)
        .attr('x', 0)
        .text(function (d) { console.log(d); return (d.key) })
}
