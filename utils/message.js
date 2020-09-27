const moment = require('moment')

function formatMessage(sender, msg) {
    return {
        sender, msg, 
        time: moment(Date()).format('h:mm a')
    }
}

module.exports = formatMessage
