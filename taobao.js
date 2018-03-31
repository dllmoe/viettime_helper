(function () {
    getVietRate(function (rate) {
        var price1 = '<strong class="tb-promo-price"><em class="tb-rmb">₫</em><em id="viet-price"></em></strong>'
        var price2 = '<strong><em class="tb-rmb">₫</em><em id="viet-price-2"></em></strong>'
        var btn = '<div style="float:left"><a target="_blank" href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-top:9px;border-radius:3px;">Vào viettime để mua</a></div>'

        $('.tb-action').append(btn.replace('%s', encodeURIComponent(location.href)))

        $('#J_PromoHd').on('DOMNodeInserted', function () {
            if ($('#J_PromoHd .tb-promo-item-bd') && !$('#viet-price').length) {
                $('#J_PromoHd .tb-promo-item-bd').append(price1)
                update_price_A()
            }
        })

        $('#J_StrPriceModBox').on('DOMSubtreeModified', function () {
            if ($('#J_StrPriceModBox .tb-property-cont') && !$('#viet-price-2').length) {
                $('#J_StrPriceModBox .tb-property-cont').append(price2)
            }
        })

        $('#J_StrPrice').on('DOMSubtreeModified', update_price_B)

        function update_price_A() {
            $('#viet-price').html(getVietString($('#J_PromoPriceNum').html(), rate))
        }
        function update_price_B() {
            $('#viet-price-2').html(getVietString($('#J_StrPrice .tb-rmb-num').html(), rate))
        }
    })
})()