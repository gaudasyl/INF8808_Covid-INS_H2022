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
  // TODO : Select the squares and set their event handlers
  d3.selectAll('rect').on('mouseover', function(element)
                            {
                              rectSelected(this, element, xScale, yScale);
                              selectTicks(element.Arrond_Nom, element.Plantation_Year);
                            })
                      .on('mouseout', function(element, index)
                      {
                        rectUnselected(this, element);
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
export function rectSelected (rect, element, xScale, yScale) {
  // TODO : Display the number of trees on the selected element
  // Make sure the nimber is centered. If there are 1000 or more
  // trees, display the text in white so it contrasts with the background.
  d3.select(rect).style('opacity', 0.75)
  let w = rect.width.baseVal.value
  let h = rect.height.baseVal.value
  d3.select(rect.parentNode).insert('text')
                            .text(element.Counts)
                            .attr('x', xScale(element.Plantation_Year)+w/2)
                            .attr('y', yScale(element.Arrond_Nom)+h/2)
                            .style('fill', element.Counts>=1000?'white':'black')
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
export function rectUnselected (rect, element) {
  // TODO : Unselect the element
    d3.select(rect).style('opacity', 1.0)
    d3.select(rect.parentNode).select('text').remove()
  }

/**
 * Makes the font weight of the ticks texts with the given name and year bold.
 *
 * @param {string} name The name of the neighborhood associated with the tick text to make bold
 * @param {number} year The year associated with the tick text to make bold
 */
export function selectTicks (name, year) {
  // TODO : Make the ticks bold
  d3.select('.y.axis').selectAll('.tick').filter((n)=>{return n==name}).select('text').style('font-weight','bold')
  d3.select('.x.axis').selectAll('.tick').filter((y)=>{return y==year}).select('text').style('font-weight','bold')
}

/**
 * Returns the font weight of all ticks to normal.
 */
export function unselectTicks () {
  // TODO : Unselect the ticks
  d3.selectAll('.tick').select('text').style('font-weight','normal')
}
