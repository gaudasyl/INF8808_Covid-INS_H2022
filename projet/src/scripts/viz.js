/* eslint-disable indent */

const margin = { top: 30, right: 0, bottom: 30, left: 50 }
const width = 210 - margin.left - margin.right
const height = 210 - margin.top - margin.bottom

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
    console.log('--- Covid Viz ---')
    // TODO
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
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')')

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return new Date(d.date) }))
        .range([0, width])
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).ticks(3))

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.moving_avg })])
        .range([height, 0])
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5))

    // Draw the line
    svg.append('path')
        .attr('fill', '#1c87c9')
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

    console.log(sumstat)
}
