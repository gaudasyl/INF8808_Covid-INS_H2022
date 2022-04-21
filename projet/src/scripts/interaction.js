import { selectedDate, dateRange, UpdateHoverCovid } from './covidViz'
import * as mainCounter from './mainCounter'
import * as covidViz from './covidViz'
import * as smallMultiples from './smallMultiples'

/**
 *
 */
export function UpdateHover () {
  d3.select('#hover-date').text('hovered date: ' + selectedDate)
  UpdateHoverCovid()
  const hoverDate = new Date(selectedDate)
  // check if the selectedDate is in the selectedTime Window (if not we don't updateHover for SM viz)
  if (hoverDate >= dateRange[0] && hoverDate <= dateRange[1]) {
    ShowHoverTextAndCirclesSM(1)
    smallMultiples.UpdateHoverSMViz()
  } else {
    ShowHoverTextAndCirclesSM(0)
  }
}

/**
 *
 */
export function TimeWindowChange () {
  covidViz.UpdateTimeCovid()
  smallMultiples.UpdateTimeSM()
  mainCounter.Update(dateRange)
}

/**
 * @param opacity
 */
export function ShowHoverTextAndCircles (opacity) {
  ShowHoverTextAndCirclesSM(opacity)
  d3.selectAll('.hover-x-axis-line').style('opacity', opacity)
  d3.selectAll('.hover-text_covid').style('opacity', opacity)
  d3.selectAll('.hover-date_covid').style('opacity', opacity)
  d3.selectAll('.hover-circle_covid').style('opacity', opacity)

  if (opacity === 0) {
    d3.select('#hover-date').text('hovered date:')
  }
}

/**
 * @param opacity
 */
function ShowHoverTextAndCirclesSM (opacity) {
  d3.selectAll('.hover-text').style('opacity', opacity)
  d3.selectAll('.hover-text-bg').style('opacity', opacity)
  d3.selectAll('.hover-circle').style('opacity', opacity)
}
