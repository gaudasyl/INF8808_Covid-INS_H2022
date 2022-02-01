import d3 from "d3"

/**
 * Defines the contents of the tooltip.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  /* TODO : Define and return the tooltip contents including :
      + A title stating the hovered element's group, with:
        - Font family: Grenze Gotish
        - Font size: 24px
        - Font weigth: normal
      + A bold label for the player name followed
        by the hovered elements's player's name
      + A bold label for the player's line count
        followed by the number of lines
  */
  var tooltip = `<div id='tooltip-title'> Act ${d.act} </div> </br>` +
  `<div class='tooltip-value'> <span style='font-weight:bold'>Player : </span> ${d.player}</div>` +
  `<div class='tooltip-value'> <span style='font-weight:bold'>Count : </span> ${d.count}</div>`
  
  return tooltip
}
