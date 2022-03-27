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
}
