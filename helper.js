var btnHtml = '<div style="float:left"><a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-top:9px;border-radius:3px;">Vào viettime để mua</a></div>'
var btnHtml2 = '<a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-left:9px;border-radius:3px;float:left">Vào viettime để mua</a>'
var rate
var rules = [{
    pattern: /item\.taobao\.com/,
    callback: taobao
}, {
    pattern: /detail\.tmall\.com/,
    callback: tmall
}, {
    pattern: /detail\.1688\.com/,
    callback: alibaba
}]

getRate(function () {
    console.log(rate)
    var info = rules.find(function (i) {
        return i.pattern.test(location.href)
    })
    if (info) info.callback()
})

function watchElem(node, callback) {
    var old = node.innerHTML
    var timer = setInterval(function () {
        var html = node.innerHTML
        if (html != old) {
            clearInterval(timer)
            callback()
        }
    }, 1)
}
function watchCreate(selector, callback) {
    var timer = setInterval(function () {
        if (document.querySelector(selector)) {
            clearInterval(timer)
            callback()
        }
    }, 50)
}
function watchRemove(selector, callback) {
    var timer = setInterval(function () {
        if (!document.querySelector(selector)) {
            clearInterval(timer)
            callback()
        }
    }, 50)
}
function convert(str) {
    var arr = str.split('-')
    arr = arr.map(function (i) {
        return ((+i) * rate).toFixed(0)
    })
    return arr.join('-')
}
function taobao() {
    document.querySelector('.tb-action').innerHTML += btnHtml.replace('%s', encodeURIComponent(location.href))
    document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML = convert(document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML)
    function update1() {
        document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML = convert(document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML)
        watchElem(document.querySelector('#J_StrPrice .tb-rmb-num'), update1)
    }
    function update2() {
        watchCreate('#J_PromoPriceNum', function () {
            document.querySelector('#J_PromoPriceNum').innerHTML = convert(document.querySelector('#J_PromoPriceNum').innerHTML)

            watchElem(document.querySelector('#J_PromoHd'), update2)
        })
    }
    update1()
    update2()
}
function tmall() {
    document.querySelector('.tb-action').innerHTML += btnHtml.replace('%s', encodeURIComponent(location.href))
    // document.querySelector('#J_DetailMeta .tm-price').innerHTML = convert(document.querySelector('#J_DetailMeta .tm-price').innerHTML)
    function update1() {
        watchCreate('#J_DetailMeta .tm-price', function () {
            document.querySelector('#J_DetailMeta .tm-price').innerHTML = convert(document.querySelector('#J_DetailMeta .tm-price').innerHTML)

            watchElem(document.querySelector('.tm-fcs-panel'), update1)
        })
    }
    function update2() {
        watchCreate('.tm-promo-price .tm-price', function () {
            document.querySelector('.tm-promo-price .tm-price').innerHTML = convert(document.querySelector('.tm-promo-price .tm-price').innerHTML)

            watchElem(document.querySelector('#J_PromoPrice'), update2)
        })
    }
    update1()
    update2()
}
function alibaba() {
    document.querySelector('.unit-detail-order-action.action-activity').innerHTML += btnHtml2.replace('%s', encodeURIComponent(location.href))
    // document.querySelectorAll('#mod-detail-price .price .value').forEach(function(item){
    //     item.innerHTML = convert(item.innerHTML)
    // })
    // document.querySelectorAll('.table-sku .price .value').forEach(function(item){
    //     item.innerHTML = convert(item.innerHTML)
    // })
    function update1(){
        document.querySelectorAll('#mod-detail-price .price .value').forEach(function(node){
            node.innerHTML = convert(node.innerHTML)
            watchElem(node, update1)
        })
    }
    function update2(){
        document.querySelectorAll('.table-sku .price .value').forEach(function(node){
            node.innerHTML = convert(node.innerHTML)
            watchElem(node, update1)
        })
    }
    update1()
    update2()
    
    // document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML = convert(document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML)
    // function update1() {
    //     document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML = convert(document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML)
    //     watchElem(document.querySelector('#J_StrPrice .tb-rmb-num'), update1)
    // }
    // function update2() {
    //     watchCreate('#J_PromoPriceNum', function () {
    //         document.querySelector('#J_PromoPriceNum').innerHTML = convert(document.querySelector('#J_PromoPriceNum').innerHTML)

    //         watchElem(document.querySelector('#J_PromoHd'), update2)
    //     })
    // }
    // update1()
    // update2()
}
function getRate(callback) {
    chrome.runtime.sendMessage("GETRATE", function (res) {
        rate = res
        callback(res || false)
    })
}