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

  // Creating the legend container
  g.append('g')
    .attr('class', 'legendOrdinal')
    .attr('transform', 'translate(' + (width) + ',-30)')

  // Setuping the legend
  let legendOrdinal = d3Legend.legendColor()
    .shape('path', d3.symbol().type(d3.symbolCircle).size(400)())
    .cellFilter(function (d) { return d.label !== 'e' })
    .scale(colorScale)
    .title('Legend')

  // Instantiating legend
  g.select('.legendOrdinal')
    .call(legendOrdinal)
}
