
function formatMessage(sender, msg) {
    let x = new Date()
    return {
        sender, msg, 
        time: x.toLocaleTimeString()
    }
}

module.exports = formatMessage
