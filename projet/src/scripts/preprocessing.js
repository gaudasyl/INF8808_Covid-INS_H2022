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

const months2 =
{
    janvier: 1,
    février: 2,
    mars: 3,
    avril: 4,
    mai: 5,
    juin: 6,
    juillet: 7,
    août: 8,
    septembre: 9,
    octobre: 10,
    novembre: 11,
    décembre: 12
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
    // const cleanDate = dateArray[0] + ' ' + months[dateArray[1]] + ' ' + dateArray[2] + ' ' + dateArray[4] + ':00 GMT'
    // const d = new Date(Date.parse(cleanDate))
    // console.log(dateArray)
    const d = new Date(dateArray[2], months2[dateArray[1]], dateArray[0])
    return d
}
