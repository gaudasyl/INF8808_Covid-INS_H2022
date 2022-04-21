import { selectedDate } from './covidViz'

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

/**
 * @param dateString
 */
export function ToNiceString (dateString) {
  const d = new Date(dateString)
  return d.getDay() + 1 + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear()
}

/**
 * @param data
 */
export function FindDataAtHoverDate (data) {
  const hoverData = data.values.find(element => element.date === selectedDate)
  if (hoverData === undefined) {
    return data.values[0]
  }
  return hoverData
}
