/**
 * Draws a legend in the area at the bottom of the screen, corresponding to the bars' colors
 *
 * @param {string[]} data The data to be used to draw the legend elements
 * @param {*} color The color scale used throughout the visualisation
 */
export function draw (data, color) {
  // TODO : Generate the legend in the div with class "legend". Each SVG rectangle
  // should have a width and height set to 15.
  // Tip : Append one div per legend element using class "legend-element".
  console.log(data)
  console.log(color)
  var legend = d3.select('.legend')
  var legendElements = legend.selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .attr('class', 'legend-element')
  legendElements.append('svg').attr('width', 20).attr('height', 15)
    .append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', element => color(element))
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
  legendElements.append('text').text(element => element)
}
