/* eslint-disable indent */

export function DrawCount () {
    const saved = 10701
    const total = 121487
    d3.select('#training-count').text(saved)
    d3.select('#total-training-count').text(`sur ${total}`)
}
