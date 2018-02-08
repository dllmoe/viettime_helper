var btnHtml = '<div style="float:left"><a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-top:9px;border-radius:3px;">Vào viettime để mua</a></div>'
var rate

function process(info) {
    try {
        document.querySelector(info.buttonTo).innerHTML += info.button.replace('%s', encodeURIComponent(location.href))
    } catch (er) {
        console.error(er)
        console.log(info.buttonTo)
    }

    var timer = setInterval(function () {
        if (!document.querySelector(info.price)) return
        if (document.querySelector(info.price).innerHTML != 'Hỏi') {
            var str = document.querySelector(info.price).innerHTML
            var arr = str.split('-')
            document.querySelector(info.label).innerHTML = '₫'
            getRate(function (rate) {
                if (!rate) return

                arr = arr.map(function (item) {
                    return ((+item) * rate).toFixed(0)
                })
                document.querySelector(info.price).innerHTML = arr.join('-')
                clearInterval(timer)
            })
        }
    }, 50)
}

function startWatch() {

}

function watchElem(node, callback){
    var old = node.innerHTML
    var timer = setInterval(function(){
        var html = node.innerHTML
        if(html != old){
            clearInterval(timer)
            callback()
        }
    }, 50)
}
function watchCreate(selector, callback){
    var timer = setInterval(function(){
        if(document.querySelector(selector)){
            clearInterval(timer)
            callback()
        }
    }, 50)
}

function taobao(){
    document.querySelector('.tb-action').innerHTML += btn.replace('%s', encodeURIComponent(location.href))
    document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML = rate * (+document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML)
    function update1(){
        document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML = rate * (+document.querySelector('#J_StrPrice .tb-rmb-num').innerHTML)
        watchElem(document.querySelector('#J_StrPrice .tb-rmb-num'), update1)
    }
}

var rules = [{
    pattern: /item\.taobao\.com/,
    button: '<div style="float:left"><a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-top:9px;border-radius:3px;">Vào viettime để mua</a></div>',
    buttonTo: '.tb-action',
    price: ['#J_StrPrice .tb-rmb-num', '#J_PromoPriceNum'],
    label: ['#J_StrPrice .tb-rmb', '#J_PromoHd .tb-rmb']
}, {
    pattern: /detail\.tmall\.com/,
    button: '<div style="float:left"><a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-top:9px;border-radius:3px;">Vào viettime để mua</a></div>',
    buttonTo: '.tb-action',
    price: '#J_PromoPrice .tm-price',
    label: '#J_PromoPrice .tm-yen'
}, {
    pattern: /detail\.1688\.com/,
    button: '<a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;float:left;display:block;line-height:40px;height:40px;font-weight:bold;padding:0 12px;margin-left:9px;border-radius:3px;">Vào viettime để mua</a>',
    buttonTo: '.unit-detail-order-action',
    price: '#mod-detail-price .price-discount-sku .value',
    label: '#mod-detail-price .price-discount-sku .fd-cny'
}, {
    pattern: /item\.taobao\.com/,
    button: '<div style="float:left"><a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-top:9px;border-radius:3px;">Vào viettime để mua</a></div>',
    buttonTo: '.tb-action',
    price: '#J_StrPrice .tb-rmb-num',
    label: '#J_StrPrice .tb-rmb'
}]

var info = rules.filter(function (item) {
    return item.pattern.test(location.href)
})
info.forEach(i => process(i))

function getRate(callback) {
    chrome.runtime.sendMessage("GETRATE", function (res) {
        rate = res
        callback(res || false)
    })
}