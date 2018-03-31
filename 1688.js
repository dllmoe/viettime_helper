(function(){
    getVietRate(function(rate){
        var btn = '<a href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-left:9px;border-radius:3px;float:left">Vào viettime để mua</a>'

        $('.unit-detail-order-action.action-activity').append(btn.replace('%s', encodeURIComponent(location.href)))
    })
})()