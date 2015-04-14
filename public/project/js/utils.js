var convertTo2Digits = function(number) {
    var result = '' + number
    if (result.length == 1) {
        return '0' + number
    }
    return number
}

var secToHours = function(sec) {
    return ( sec / 3600).toFixed(2)
}

var formatDate = function(date) {
    return date.toLocaleString()
}

