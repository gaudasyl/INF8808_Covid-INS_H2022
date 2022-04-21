var gymDates = []

/**
 * @param data
 * @param startDate
 * @param endDate
 * @param dateRange
 * @param closedGymDates
 */
export function DrawAndBindData (data, dateRange, closedGymDates) {
  d3.select('#training-count').datum(data)
  gymDates = closedGymDates
  Update(dateRange)
}

/**
 * @param dateRange the currently selected date Range
 */
export function Update (dateRange) {
  const data = d3.select('#training-count').data()[0]
  var sportsCount = {}
  data.forEach(element => {
    const d = new Date(element.date)
    const sport = element.sport
    if (dateRange[0] < d && d < new Date(dateRange[1])) {
      if (!(sport in sportsCount)) { sportsCount[sport] = { total: 0, saved: 0 } }
      sportsCount[sport].total += Number(element.athletes)
      gymDates.forEach(function (date) {
        if (date.start < d && d < date.end) {
          sportsCount[sport].saved += Number(element.athletes)
        }
      })
    }
  })
  var total = 0
  var saved = 0
  for (const [key, value] of Object.entries(sportsCount)) {
    total += value.total
    saved += value.saved
    d3.select(`#${key.replace(/ /g, '')}-counter`).text('')
    d3.select(`#${key.replace(/ /g, '')}-counter`).text(value.saved)
  }

  d3.select('#training-count').datum(data).text(saved)
  d3.select('#total-training-count').datum(data).text(`sur ${total}`)
}
