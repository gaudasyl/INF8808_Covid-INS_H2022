/* eslint-disable indent */

const months =
{
    janvier: 'Jan',
    février: 'Feb',
    mars: 'Mar',
    avril: 'Apr',
    mai: 'May',
    juin: 'Jun',
    juillet: 'Jul',
    août: 'Aug',
    septembre: 'Sep',
    octobre: 'Oct',
    novembre: 'Nov',
    décembre: 'Dec'
}

/**
 * @param data
 */
export function getOnlyValidEntries (data) {
    return data.filter(x => x.etat === 'Accepté')
}

/**
 * @param data
 */
export function getDateAndGroupBySport (data) {
    const sports = {}
    data.forEach(entry => {
        if (sports[entry.sport] == null) {
            sports[entry.sport] = []
        }
        const cd = cleanDate(entry.date)
        sports[entry.sport].push(cd)
    })
    return sports
}

/**
 * @param date
 */
function cleanDate (date) {
    const dateArray = date.split(' ')
    const cleanDate = dateArray[0] + ' ' + months[dateArray[1]] + ' ' + dateArray[2] + ' ' + dateArray[4] + ':00 GMT'
    const d = Date.parse(cleanDate)
    return d
}
