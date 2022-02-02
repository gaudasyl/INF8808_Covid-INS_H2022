
/**
 * Sets the domain and range of the X scale.
 *
 * @param {*} scale The x scale
 * @param {object[]} data The data to be used
 * @param {number} width The width of the graph
 */
export function updateGroupXScale (scale, data, width) {
  let acts = data.map((act) => act["Act"])  
  scale
    .domain(acts)
    .range([0, width])
}

/**
 * Sets the domain and range of the Y scale.
 *
 * @param {*} scale The Y scale
 * @param {object[]} data The data to be used
 * @param {number} height The height of the graph
 */
export function updateYScale (scale, data, height) {
  // TODO : Set the domain and range of the graph's y scale
  let max = 0
  data.forEach(act => {
    act["Players"].forEach(player => {
        max = Math.max(player["Count"], max)
      })
    })
  scale
    .domain([max, 0])
    .range([0, height])
}

/**
 * Creates the groups for the grouped bar chart and appends them to the graph.
 * Each group corresponds to an act.
 *
 * @param {object[]} data The data to be used
 * @param {*} x The graph's x scale
 */
export function createGroups (data, x) {
  // TODO : Create the groups
  d3.select('#graph-g')
    .selectAll('.group')
    .data(data)
    .join('g')
    .attr('class', 'group')
    .attr('transform', group => `translate(${x(group.Act)})`)
}

/**
 * Draws the bars inside the groups
 *
 * @param {*} y The graph's y scale
 * @param {*} xSubgroup The x scale to use to position the rectangles in the groups
 * @param {string[]} players The names of the players, each corresponding to a bar in each group
 * @param {number} height The height of the graph
 * @param {*} color The color scale for the bars
 * @param {*} tip The tooltip to show when each bar is hovered and hide when it's not
 */
export function drawBars (y, xSubgroup, players, height, color, tip) {
  // TODO : Draw the bars
  let bars = d3.select('#graph-g')
    .selectAll('.group')
    .selectAll('rect')
    .data(data => {
      return data.Players.map(player => {
        return { act: data.Act, player: player.Player, count: player.Count }
      })
    })
    .join('rect')
    .attr('x', d => xSubgroup(d.player))
    .attr('y', d => y(d.count))
    .attr('width', xSubgroup.bandwidth())
    .attr('height', d => height - y(d.count))
    .style('fill', d => color(d.player))

  bars.on("mouseover", tip.show)
      .on("mouseout", tip.hide)
    
}
