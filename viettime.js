function watchEle(selector, callback){
    var old, timer
    function resume(){
        if(timer) timer = setInterval(loop, 1)
    }
    if(document.querySelector(selector)){
        old = document.querySelector(selector).innerHTML
    }
    function loop(){
        var node = document.querySelector(selector)
        if(node){
            if(!old){
                callback(resume)
                old = node.innerHTML
                return
            }else if(old != node.innerHTML){
                callback(resume)
                old = node.innerHTML
                return
            }
        }
    }
    timer = setInterval(loop, 1)
}

var btnHtml = '<div style="float:left"><a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-top:9px;border-radius:3px;">Vào viettime để mua</a></div>'
var btnHtml2 = '<a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-left:9px;border-radius:3px;float:left">Vào viettime để mua</a>'
var rate = 3600
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

function convert(str) {
    var arr = str.split('-')
    arr = arr.map(function (i) {
        return ((+i) * rate).toFixed(0)
    })
    return arr.join('-')
}

function taobao(){
    var labels = '#J_StrPrice .tb-rmb,#J_Promo .tb-rmb'
    document.querySelector('.tb-action').innerHTML += btnHtml.replace('%s', encodeURIComponent(location.href))
    document.querySelectorAll('#J_StrPriceModBox .tb-rmb-num').forEach(function(item){
        item.innerHTML = convert(item.innerHTML)
    })
    document.querySelectorAll(labels).forEach(function(item){
        item.innerHTML = '₫'
    })
    watchEle('#J_StrPriceModBox .tb-rmb-num', function(resume){
        document.querySelectorAll('#J_StrPriceModBox .tb-rmb-num').forEach(function(item){
            item.innerHTML = convert(item.innerHTML)
        })
        resume()
    })
    watchEle('#J_PromoPriceNum', function(resume){
        var node = document.querySelector('#J_PromoPriceNum')
        node.innerHTML = convert(node.innerHTML)
        document.querySelectorAll(labels).forEach(function(item){
            item.innerHTML = '₫'
        })
        resume()
    })
}

function tmall(){
    var labels = '#J_DetailMeta .tm-yen'
    document.querySelector('.tb-action.tm-clear').innerHTML += btnHtml.replace('%s', encodeURIComponent(location.href))
    document.querySelectorAll(labels).forEach(function(item){
        item.innerHTML = '₫'
    })
    watchEle('#J_StrPriceModBox .tm-price', function(resume){
        document.querySelectorAll('#J_StrPriceModBox .tm-price').forEach(function(item){
            item.innerHTML = convert(item.innerHTML)
            item.dataset.old = item.innerHTML
        })
        document.querySelectorAll(labels).forEach(function(item){
            item.innerHTML = '₫'
        })
        resume()
    })
    watchEle('#J_PromoPrice .tm-price', function(resume){
        var node = document.querySelector('#J_PromoPrice .tm-price')
        node.innerHTML = convert(node.innerHTML)
        document.querySelectorAll(labels).forEach(function(item){
            item.innerHTML = '₫'
        })
        resume()
    })
}
function alibaba(){
    var labels = '.fd-cny,.price-unit'
    document.querySelector('.unit-detail-order-action.action-activity').innerHTML += btnHtml2.replace('%s', encodeURIComponent(location.href))
    document.querySelectorAll(labels).forEach(function(item){
        item.innerHTML = '₫'
    })
    document.querySelectorAll('#mod-detail-price .price .value').forEach(function(item){
        item.innerHTML = convert(item.innerHTML)
    })
    document.querySelectorAll('.table-sku .price .value').forEach(function(item){
        item.innerHTML = convert(item.innerHTML)
    })
    watchEle('#mod-detail-price .price .value', function(resume){
        document.querySelectorAll('#mod-detail-price .price .value').forEach(function(item){
            item.innerHTML = convert(item.innerHTML)
        })
        document.querySelectorAll(labels).forEach(function(item){
            item.innerHTML = '₫'
        })
        resume()
    })
    watchEle('.table-sku .price .value', function(resume){
        document.querySelectorAll('.table-sku .price .value').forEach(function(item){
            item.innerHTML = convert(item.innerHTML)
        })
        document.querySelectorAll(labels).forEach(function(item){
            item.innerHTML = '₫'
        })
        resume()
    })
    watchEle('.obj-list.fd-hide .price .value', function(resume){
        document.querySelectorAll('.obj-list.fd-hide .price .value').forEach(function(item){
            item.innerHTML = convert(item.innerHTML)
        })
        document.querySelectorAll(labels).forEach(function(item){
            item.innerHTML = '₫'
        })
        resume()
    })
}

chrome.runtime.sendMessage("GETRATE", function (res) {
    rate = +res
    var info = rules.find(function (i) {
        return i.pattern.test(location.href)
    })
    if (info) info.callback()
})