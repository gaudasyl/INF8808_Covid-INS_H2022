/* eslint-disable indent */

export function DrawCount (data, date1, date2) {
    console.log('--- Counter ---')
    const saved = data.filter(x => x.date < date2 && x.date > date1 && x.etat === 'Accepté').length
    const total = data.filter(x => x.etat === 'Accepté').length
    d3.select('#training-count').text(saved)
    d3.select('#total-training-count').text(`sur ${total}`)
}

export function DrawCovidViz () {
    console.log('--- Covid Viz ---')
}

export function DrawSmallMultiple (data, date1, date2) {
    console.log('--- Small mutliples viz ---')
    Object.keys(data).forEach((sport) => {
        const days = {}
        data[sport].forEach(date => {
            if (days[date] == null) {
                days[date] = 1
            }
            days[date] += 1
        })
        Object.fromEntries(Object.entries(days).filter(([d]) => d > date1 && d < date2))
        const scaleX = d3.scaleTime()
                        .domain([date1, date2])
                        .range([0, 200])
        const scaleY = d3.scaleLinear()
                        .domain([0, d3.max(Object.entries(days))])
                        .range([0, 200])
        DrawOneSportMultiple(days, sport, scaleX, scaleY)
    })
}

function DrawOneSportMultiple (data, sportName, scaleX, scaleY) {
    d3.select('#smallMultiple-svg')
        .append('g')
        .append('path')
        .attr('id', sportName)
        .classed('smallMultiple', true) // add style sheet rule for smallMultiple lineCharts
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        // .attr('d', )
}
