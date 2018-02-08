function getRate(callback) {
    var req = new XMLHttpRequest
    req.open('GET', 'http://viettime.shop/index.php?controller=simple&action=getHuilv', true)
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            try {
                var result = JSON.parse(req.responseText)
            } catch (err) {
                console.log(err)
            }
            callback(result || false)
        }
    }
    req.send()
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg != 'GETRATE') return false

    if (localStorage.rate) {
        var rate = JSON.parse(localStorage.rate)
        var lastUpdate = new Date(rate.updatetime + ' GMT+0800')
        if (Date.now() - lastUpdate.getTime > 86400000) {
            getRate(function (rate) {
                if (!rate) return response(false)
                localStorage.rate = JSON.stringify(rate)
                response(+rate.rate)
            })
            return true
        } else {
            response(+rate.rate)
        }
    } else {
        getRate(function (rate) {
            if (!rate) return response(false)
            localStorage.rate = JSON.stringify(rate)
            response(+rate.rate)
        })
        return true
    }
})

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({ url: 'http://viettime.shop/' })
})