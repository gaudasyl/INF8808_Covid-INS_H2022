import d3 from "d3"

/**
 * Defines the contents of the tooltip.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  
  // Instantiating the tooltip content (HTML) using a string as required
  let tooltip = `<div id='tooltip-title'> Act ${d.act} </div> </br>` +
  `<div class='tooltip-value'> <span style='font-weight:bold'>Player : </span> ${d.player}</div>` +
  `<div class='tooltip-value'> <span style='font-weight:bold'>Count : </span> ${d.count}</div>`
  
  return tooltip
}
