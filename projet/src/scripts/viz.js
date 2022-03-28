/* eslint-disable indent */

/**
 * @param data
 * @param date1
 * @param date2
 */
export function DrawCount (data, date1, date2) {
    console.log('--- Counter ---')
    const saved = data.filter(x => x.date < date2 && x.date > date1 && x.etat === 'Accepté').length
    const total = data.filter(x => x.etat === 'Accepté').length
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
