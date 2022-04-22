var gymDates = []
var dataIdxByDate = {}

/**
 * @param data
 * @param startDate
 * @param endDate
 * @param dateRange
 * @param closedGymDates
 */
export function DrawAndBindData(data, dateRange, closedGymDates) {
  data = data.sort((a, b) => new Date(a.date) - new Date(b.date))
  for (let i = 0; i < data.length; i++) {
    var date = data[i].date
    if (!(date in dataIdxByDate)) { dataIdxByDate[date] = i }
  }
  d3.select('#training-count').datum(data)
  gymDates = closedGymDates
  Update(dateRange)
}

/**
 * @param dateRange the currently selected date Range
 */
export function Update(dateRange) {
  const data = d3.select('#training-count').data()[0]
  var sportsCount = {}
  var i = dataIdxByDate[dateRange[0].toLocaleDateString('en-CA')]
  var j = dataIdxByDate[dateRange[1].toLocaleDateString('en-CA')]
  data.slice(i, j).forEach(element => {
    const d = new Date(element.date)
    const sport = element.sport
    if (!(sport in sportsCount)) { sportsCount[sport] = { total: 0, saved: 0 } }
    sportsCount[sport].total += Number(element.athletes)
    gymDates.forEach(function (date) {
      if (date.start < d && d < date.end) {
        sportsCount[sport].saved += Number(element.athletes)
      }
    })
  })
  var total = 0
  var saved = 0
  for (const [key, value] of Object.entries(sportsCount)) {
    total += value.total
    saved += value.saved
    d3.select(`#${key.replace(/ /g, '')}-counter`).text('')
    d3.select(`#${key.replace(/ /g, '')}-counter`).text(numberWithSpaces(value.saved))
  }

  d3.select('#training-count').datum(data).text(numberWithSpaces(saved))
  d3.select('#total-training-count').datum(data).text(`sur ${numberWithSpaces(total)}`)
}

function numberWithSpaces(x) {
  // https://stackoverflow.com/questions/16637051/adding-space-between-numbers
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
