function getVietRate(callback) {
    chrome.runtime.sendMessage("GETRATE", function (res) {
        try {
            callback(+res || 3600)
        } finally {
            console.log('viettime rate:' + (+res || 3600))
        }
    })
}

function getVietString(str, rate) {
    var arr = str.split('-')
    arr = arr.map(function (i) {
        return ((+i) * rate).toFixed(0)
    })
    return arr.join('-')
}