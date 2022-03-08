import { color } from 'd3'
import d3Legend from 'd3-svg-legend'

/**
 * Draws the legend.
 *
 * @param {*} colorScale The color scale to use
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {number} width The width of the graph, used to place the legend
 */
export function drawLegend (colorScale, g, width) {
  // TODO : Draw the legend using d3Legend
  // For help, see : https://d3-legend.susielu.com/
  g.append('g')
    .attr('class', 'legendOrdinal')
    .attr('transform', 'translate(' + (width) + ',-30)')

  var legendOrdinal = d3Legend.legendColor()
    .shape('path', d3.symbol().type(d3.symbolCircle).size(400)())
    .cellFilter(function (d) { return d.label !== 'e' })
    .scale(colorScale)
    .title('Legend')

  g.select('.legendOrdinal')
    .call(legendOrdinal)
}
