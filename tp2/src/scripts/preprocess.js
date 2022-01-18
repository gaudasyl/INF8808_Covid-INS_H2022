import d3, { count } from "d3"
import { leastIndex } from "d3"
import { sort } from "d3"

/**
 * Sanitizes the names from the data in the "Player" column.
 *
 * Ensures each word in the name begins with an uppercase letter followed by lowercase letters.
 *
 * @param {object[]} data The dataset with unsanitized names
 * @returns {object[]} The dataset with properly capitalized names
 */
export function cleanNames (data) {
  data.forEach(
    function (element) {
      var name = element.Player
      element.Player = name[0].toUpperCase() + name.slice(1).toLowerCase()
      return element
    }
  )
  return data
}

/**
 * Finds the names of the 5 players with the most lines in the play.
 *
 * @param {object[]} data The dataset containing all the lines of the play
 * @returns {string[]} The names of the top 5 players with most lines
 */
export function getTopPlayers (data) {
  var counts = [] // to count the number of line each player has
  data.reduce(
    function (counts, element) {
      if (!counts[element.Player]) {
        counts[element.Player] = 1
      } else {
        counts[element.Player] += 1
      }
      return counts
    }, counts
  )
  var top5Names = Object.entries(counts) // convert to a 2d array [[Player, nbOfLines], ...]
    .sort(function (a, b) { // order all the players by the number of lines they have
      return b[1] - a[1]
    })
    .slice(0, 5) // keep the first 5 players
    .map(function (element) { // keep only the names and not the number of lines
      return element[0]
    })
  return top5Names
}

/**
 * Transforms the data by nesting it, grouping by act and then by player, indicating the line count
 * for each player in each act.
 *
 * The resulting data structure ressembles the following :
 *
 * [
 *  { Act : ___,
 *    Players : [
 *     {
 *       Player : ___,
 *       Count : ___
 *     }, ...
 *    ]
 *  }, ...
 * ]
 *
 * The number of the act (starting at 1) follows the 'Act' key. The name of the player follows the
 * 'Player' key. The number of lines that player has in that act follows the 'Count' key.
 *
 * @param {object[]} data The dataset
 * @returns {object[]} The nested data set grouping the line count by player and by act
 */
export function summarizeLines (data) {
  // TODO : Generate the data structure as defined above
  var nestedDataSet = []
  data.forEach(
    function (line) {
      if (!nestedDataSet[line.Act - 1]) { // if the Act doesn't exist in the structure, we add it, with the player
        nestedDataSet.push(
          {
            Act: line.Act,
            Players: [
              {
                Player: line.Player,
                Count: 1
              }
            ]
          }
        )
      } else { // if the Act already exists in the structure
        var playerInAct = nestedDataSet[line.Act - 1].Players.find(element => element.Player === line.Player)
        if (playerInAct) { // if the player already has a line in the act, we increment the count
          playerInAct.Count += 1
        } else { // if it's the player's first line in the act, we add him to the players list of the act
          nestedDataSet[line.Act - 1].Players.push(
            {
              Player: line.Player,
              Count: 1
            }
          )
        }
      }
    }
  )
  return nestedDataSet
}

/**
 * For each act, replaces the players not in the top 5 with a player named 'Other',
 * whose line count corresponds to the sum of lines uttered in the act by players other
 * than the top 5 players.
 *
 * @param {object[]} data The dataset containing the count of lines of all players
 * @param {string[]} top The names of the top 5 players with the most lines in the play
 * @returns {object[]} The dataset with players not in the top 5 summarized as 'Other'
 */
export function replaceOthers (data, top) {
  // TODO : For each act, sum the lines uttered by players not in the top 5 for the play
  // and replace these players in the data structure by a player with name 'Other' and
  // a line count corresponding to the sum of lines
  data.forEach(
    function (act) {
      var othersCount = 0
      // we delete the non-top 5 players in a while not a foreach to not skip any
      var index = act.Players.length - 1
      while (index >= 0) {
        if (top.indexOf(act.Players[index].Player) === -1) {
          othersCount += act.Players[index].Count
          act.Players.splice(index, 1)
        }
        index -= 1
      }
      act.Players.push( // we add the "Others" player
        {
          Player: 'Others',
          Count: othersCount
        }
      )
    }
  )
  return data
}
