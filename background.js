var searchUrl = 'http://viettime.shop/index.php?controller=site&action=shop_products&search_buy='

function getRate(callback) {
    var req = new XMLHttpRequest
    req.open('GET', 'http://viettime.shop/index.php?controller=simple&action=getHuilv', true)
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            try {
                var result = JSON.parse(req.responseText)
                var found = result.find(function (item) {
                    return item.from == 'CNY' && item.to == 'VND'
                })
                if (found) {
                    var rate = +found.rate
                }
            } catch (err) {
                console.log(err)
            }
            callback(rate || 3600)
        }
    }
    req.send()
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg != 'GETRATE') return false

    if (localStorage.rate) {
        var rate = JSON.parse(localStorage.rate)
        var lastUpdate = new Date(rate.date)
        if (Date.now() - lastUpdate.getTime > 86400000) {
            getRate(function (rate) {
                localStorage.rate = JSON.stringify({ rate: rate, date: Date.now() })
                response(rate)
            })
            return true
        } else {
            response(rate.rate)
        }
    } else {
        getRate(function (rate) {
            localStorage.rate = JSON.stringify({ rate: rate, date: Date.now() })
            response(rate)
        })
        return true
    }
})

chrome.browserAction.onClicked.addListener(function (tab) {
    var matches = [
        /^https:\/\/item\.taobao\.com\//i,
        /^https:\/\/detail\.tmall\.com\//i,
        /^https:\/\/detail\.1688\.com\//i,
    ]
    if (matches.find(function (i) { return i.test(tab.url) })) {
        chrome.tabs.create({ url: searchUrl + encodeURIComponent(tab.url) })
    } else {
        chrome.tabs.create({ url: 'http://viettime.shop/' })
    }
})