(function () {
    getVietRate(function (rate) {
        var price1 = '<div class="tm-promo-price"><em class="tm-yen">₫</em><em class="tm-price" id="viet-price"></em></div>'
        var price2 = '<dd><em class="tm-yen">₫</em><em id="viet-price-2"></em></dd>'
        var btn = '<div style="float:left"><a target="_blank" href="http://viettime.shop/index.php?controller=site&action=shop_products&search_buy=%s" style="background:rgb(176,31,35);color:#fff;display:block;line-height:38px;height:38px;font-weight:bold;padding:0 12px;margin-top:9px;border-radius:3px;">Vào viettime để mua</a></div>'

        $('.tb-action.tm-clear').append(btn.replace('%s', encodeURIComponent(location.href)))

        $('#J_PromoPrice').on('DOMNodeInserted', function () {
            if ($('#J_PromoPrice dd') && !$('#viet-price').length) {
                $('#J_PromoPrice dd').append(price1)
                update_price_A()
            }
        })

        $('#J_StrPriceModBox').on('DOMNodeInserted', function () {
            if ($('#J_StrPriceModBox') && !$('#viet-price-2').length) {
                $('#J_StrPriceModBox').append(price2)
                update_price_B()
            }
        })

        $('#J_StrPriceModBox dd').on('DOMSubtreeModified', update_price_B)

        function update_price_A() {
            $('#viet-price').html(getVietString($('#J_PromoPrice .tm-price').html(), rate))
        }
        function update_price_B() {
            $('#viet-price-2').html(getVietString($('#J_StrPriceModBox .tm-price').html(), rate))
        }
    })
})()