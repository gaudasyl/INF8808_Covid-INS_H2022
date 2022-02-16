import { selectAll } from "d3"

/**
 * Sets up an event handler for when the mouse enters and leaves the squares
 * in the heatmap. When the square is hovered, it enters the "selected" state.
 *
 * The tick labels for the year and neighborhood corresponding to the square appear
 * in bold.
 *
 * @param {*} xScale The xScale to be used when placing the text in the square
 * @param {*} yScale The yScale to be used when placing the text in the square
 * @param {Function} rectSelected The function to call to set the mode to "selected" on the square
 * @param {Function} rectUnselected The function to call to remove "selected" mode from the square
 * @param {Function} selectTicks The function to call to set the mode to "selected" on the ticks
 * @param {Function} unselectTicks The function to call to remove "selected" mode from the ticks
 */
export function setRectHandler (xScale, yScale, rectSelected, rectUnselected, selectTicks, unselectTicks) {
  d3.selectAll("#graph-g").selectAll('g .data')
                          .selectAll('g')
                          .on('mouseover', function(element)
                              {
                                rectSelected(d3.select(this), xScale, yScale);
                                selectTicks(element.Arrond_Nom, element.Plantation_Year);
                              })
                              .on('mouseout', function()
                              {
                                rectUnselected(d3.select(this));
                                unselectTicks();
                              })
}

/**
 * The function to be called when one or many rectangles are in "selected" state,
 * meaning they are being hovered
 *
 * The text representing the number of trees associated to the rectangle
 * is displayed in the center of the rectangle and their opacity is lowered to 75%.
 *
 * @param {*} element The selection of rectangles in "selected" state
 * @param {*} xScale The xScale to be used when placing the text in the square
 * @param {*} yScale The yScale to be used when placing the text in the square
 */
export function rectSelected (element, xScale, yScale) {
  element.select('rect').style('opacity', 0.75)
  let w = parseFloat(element.select('rect').style("width").replace("px", ""))
  let h = parseFloat(element.select('rect').style("height").replace("px", ""))
  element.append('text', 'rect').text(element.select('rect').data()[0].Counts)
                  .attr('x', xScale(element.select('rect').data()[0].Plantation_Year)+ w/2)
                  .attr('y', yScale(element.select('rect').data()[0].Arrond_Nom)+ h/2)
                  .style('fill', element.select('rect').data()[0].Counts>=1000?'white':'black')
                  .style('dominant-baseline', 'middle')
                  .style('text-anchor','middle')
                  .style('pointer-events', 'none')
                  .style('text-alignement', 'center')
}

/**
 * The function to be called when the rectangle or group
 * of rectangles is no longer in "selected state".
 *
 * The text indicating the number of trees is removed and
 * the opacity returns to 100%.
 *
 * @param {*} element The selection of rectangles in "selected" state
 */
export function rectUnselected (element) {
    element.select('rect').style('opacity', 1.0)
    element.select('text').remove()
  }

/**
 * Makes the font weight of the ticks texts with the given name and year bold.
 *
 * @param {string} name The name of the neighborhood associated with the tick text to make bold
 * @param {number} year The year associated with the tick text to make bold
 */
export function selectTicks (name, year) {
  d3.select('.y.axis').selectAll('.tick').filter((n)=>{return n==name}).select('text').style('font-weight','bold')
  d3.select('.x.axis').selectAll('.tick').filter((y)=>{return y==year}).select('text').style('font-weight','bold')
}

/**
 * Returns the font weight of all ticks to normal.
 */
export function unselectTicks () {
  d3.selectAll('.tick').select('text').style('font-weight','normal')
}
