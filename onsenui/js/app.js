$(window).on('load', function () {
    //Refreshing page
    ons.ready(function () {
        var pullHook = document.getElementById('pull-hook');

        pullHook.addEventListener('changestate', function (event) {
            var message = '';

            switch (event.state) {
                case 'initial':
                    message = 'Pull to refresh';
                    break;
                case 'preaction':
                    message = 'Release';
                    break;
                case 'action':
                    message = 'Loading...';
                    break;
            }

            pullHook.innerHTML = message;
        });

        pullHook.onAction = function (done) {
            setTimeout(done, 1000);
        };
    });
    //Refreshing page

    //carousel (Edited By Myself)
    var prev = function () {
        var carousel = document.getElementById('carousel');
        carousel.prev();
    };

    var carousel_counter = 0;
    var next = function () {
        var carousel = document.getElementById('carousel');
        const count_carousel = $('.count-carousel');
        carousel_counter++;
        if (carousel_counter >= count_carousel.length) {
            $(count_carousel).each(function (index, element) {
                if (count_carousel.length - 2 >= index) {
                    setTimeout(() => {
                        prev();
                    }, 1);
                }
            });
            carousel_counter = 0;
        }
        carousel.next();
    };
    ons.ready(function () {
        var carousel = document.addEventListener('postchange', function (event) {
            // console.log('Changed to ' + event.activeIndex);
        });
    });
    $(document).ready(function () {
        setInterval(function () {
            next();
        }, 3000);
    });
    //carousel

    //var addToCart = document.querySelectorAll(".add-to-cart");
    var addToCart = $('.add-to-cart');
    $(addToCart).on("click", function () {
        $(this).addClass('addedToCart');
        $(this).text("Added!");
        var name = $(this).closest('.our-list').find('.food-name').text();
        var price = $(this).closest('.our-list').find('.food-price').text();
        var srcImg = $(this).closest('.our-list').find('img').attr('src');
        AddToCartList(name, price, srcImg);
    });

    function AddToCartList(name, price, srcImg) {
        var items = $('.All-list-cart .food-title-cart');
        let existInList = false;
        $(items).each(function () {
            if (name == $(this).text()) {
                existInList = true;
            }
        })
        if (existInList) {
            return;
        }
        var txtList = `<ons-list-item>
        <div class="inside-list-cart">
          <div class="left img-cart">
            <img
              src="${srcImg}"
              class="img-responsive med-curve"
              alt=""
            />
          </div>
          <div class="food-title-cart">${name}</div>
          <div class="price-item-cart fl-left" cost="${price.replace("$","")}">${price}</div>

          <div class="Box-plus-food-cart">
            <div class="plus-food-cart fl-right">
              <ons-icon
                size="25px"
                icon="fa-plus-circle"
                style="color: #bb0000"
              ></ons-icon>
            </div>
            <div class="count-food-cart center">
              <input class="input-cart" type="number" value="1" />
            </div>
            <div class="minus-food-cart fl-left">
              <ons-icon size="25px" icon="fa-minus-circle"></ons-icon>
            </div>
          </div>
          <div class="remove-cart fl-right">
            <ons-icon icon="fa-times"></ons-icon>
          </div>
        </div>
      </ons-list-item>`
        $(".All-list-cart").append(txtList);
        calculateItemPrice();
        updateBadge();
    }
    $('.All-list-cart').on('change', '.input-cart', function () {
        if (isNaN($(this).val()) || $(this).val() < 1) {
            $(this).val(1);
        }
        calculateItemPrice();
    });
    $('.All-list-cart').on("click", ".remove-cart", function () {
        $(this).closest('ons-list-item').remove();
        var listCart = $(this).closest('.inside-list-cart').find('.food-title-cart');
        var listShop = $('.All-list-home-page .food-name');
        $(listShop).each(function () {
            if ($(this).text() == $(listCart).text()) {
                var myItem = $(this).closest('.our-list').find('.add-to-cart');
                $(myItem).removeClass('addedToCart');
                $(myItem).text('Add To Cart');
            }
        })
        calculateItemPrice();
        updateBadge();
    });
    $('.All-list-cart').on("click", ".plus-food-cart", function () {
        var value = $(this).closest('.Box-plus-food-cart').find('.input-cart').val();
        $(this).closest('.Box-plus-food-cart').find('.input-cart').val(++value);
        calculateItemPrice();
    });
    $('.All-list-cart').on("click", ".minus-food-cart", function () {
        var value = $(this).closest('.Box-plus-food-cart').find('.input-cart').val();
        if(value<2){
            return;
        }
        $(this).closest('.Box-plus-food-cart').find('.input-cart').val(--value);
        calculateItemPrice();
    });

    function calculateItemPrice() {
        var itemPrice = $('.All-list-cart .price-item-cart');
        var itemNum = $(".All-list-cart .input-cart");
        var totalPrice = 0;
        $(itemNum).each(function (index, el) {
            var price = parseFloat($(itemPrice[index]).attr('cost'));
            price *= $(this).val();
            $(itemPrice[index]).text("$" + (Math.floor(price * 100) / 100));
            totalPrice += price;
        })
        totalPrice = Discount(totalPrice);
        var total = $(".total");
        total.text('Total : $');
        total.append(Math.round(totalPrice * 100) / 100);
    }

    function updateBadge() {
        var list = $('.All-list-cart .inside-list-cart').length
        if (list > 0) {
            $("#badge-cart").attr("badge", list);
        } else {
            $("#badge-cart").attr("badge", '');
        }
    }
    $(".continue-shopping").on("click", function () {
        if (parseFloat($(".total").html().replace('Total : $', '')) > 0) {
            showTemplateDialog();
        }
    });
    //List-Cart Process

    //Calculate Discount
    function Discount(total_price) {
        var discontTxt = $(".discount");
        var discount = 1 / 10;
        if (total_price > 15.00) {
            var disC = total_price * discount;
            var disCPrice = total_price - disC;
            discontTxt.html("Discount : $");
            discontTxt.append(Math.round(disC * 100) / 100);
            return disCPrice;
        } else {
            discontTxt.html("Discount : $0");
            return total_price;
        }
    }
    //Calculate Discount


    //Show Dialog
    var showTemplateDialog = function () {
        var dialog = document.getElementById('my-dialog');

        if (dialog) {
            dialog.show();
        } else {
            ons.createElement('dialog.html', {
                    append: true
                })
                .then(function (dialog) {
                    dialog.show();
                });
        }
    };
    $(".closeDialog").on("click", function () {
        hideDialog('my-dialog');
    });
    //show dialog
})


//Order page (Adding A list of Orders)

//Order page

//List-Cart Process (Adding Food And Their Information To Cart Page And Calculate Total Price And ...)



//Hide Dialog  (Edited By Myself)
var hideDialog = function (id) {
    document.getElementById(id).hide();
    var total = $(".total");
    var price = parseFloat(total.html().replace('Total : $', ''));
    total.text('Total :$0') ;
    var ShopList = $(".All-list-cart");
    while ($(ShopList).children().length > 0 ) {
        $(ShopList).find(':first-child').remove();
    }
    var addtoCartList = $(".add-to-cart");
    $(addtoCartList).each(function () {
        if($(this).hasClass('addedToCart')){
            $(this).removeClass('addedToCart');
            $(this).text("Add To Cart");
        }
    })
    var badgeCart = $("#badge-cart");
    badgeCart.attr("badge", "");
    ordersPage(price);
    var discontTxt = $(".discount");
    discontTxt.text("Discount : $0");

};
//Hide Dialog
function ordersPage(price) {
    var Badge = $("#list-orders-page .price-orders");
    var txt = `<ons-list-item modifier="longdivider" tappable>
            <div class="left">${Badge.length}</div>
            <div class="center price-orders">$${price}</div>
            <div class="right status-order">In-Process</div>
        </ons-list-item>`
    $('#badge-order').attr("badge", Badge.length);
    $('#list-orders-page').append(txt);
}