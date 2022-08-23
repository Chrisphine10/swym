var productCardMarkup = `
 <div class="grid-container">
 <div class="separator"></div>
 {{#products}}
   <div class="product-holder">
      <div>
        <a href="" data-stk="{{stk}}" data-variant="{{variants}}" data-url="{{iu}}" data-pr="{{pr}}" data-empi-id="{{empi}}" data-du="{{du}}" data-epi-id="{{epi}}" class="cancel-holder wishlist-icon lazyautosizes remove-from-wishlist">
        </a>
      </div>
      <a class="cards" href="{{du}}" aria-label="{{dt}}">
        <div>
              <div> 
                <img width="" class="image-wrapper lazyautosizes" src="{{iu}}" />
              </div>
              <div class="name-holder h4 grid-view-item__title product-card__title">
                <p class="title-wishlist">{{bt}}</p>
                <p>{{dt}}</p>
              </div>
              <div class="price-holder">
                <span style="color: #f90303;"><span style="color: #f90303;">$</span>{{pr}}</span>
                <strike style="margin-left: 10px;" id="{{empi}}"></strike>
              </div>
        </div>
      </a>
      <button id="cart{{empi}}">
      <a style="color: white;" href="" data-product-id="{{empi}}" data-url="{{du}}" data-variant-id="{{epi}}" class="add-to-cart">
			{{#isInCart}}Add to Bag{{/isInCart}}
			{{^isInCart}}Add to Bag{{/isInCart}}
		</a>
      </button>
    </div>
  {{/products}}
  {{^products}}
    <div class="empty-holder">
        <h1 class="title-wishlist">Love It? Add To My Wishlist</h1>
        <br>
        <div class="empty-text">
          <p style="text-align: center;">My Wishlist allows you to keep track of all of your favorites and shopping activity whether you're on your computer, phone, or tablet. You won't have to waste time searching all over again for that item you loved on your phone the other day - it's all here in one place!</p>
        </div>
        <div style="margin-top: 20px;text-align: center;">
          <button><a href="/" style="color: white; padding-left: 20px; padding-right: 20px;">Continue Shopping</a><button>
        </div>
    </div>
  {{/products}}
 </div>
 <style>
   .empty-text{
     text-align: center; 
     width: 40%; 
     margin: auto;"
   }
   .empty-holder{
       padding: 20px;
       justify-content: center;
   }
   .title-wishlist{
     font-size: 22px;
     font-weight: 400;
     font-style: normal;
     text-transform: uppercase;
     text-align: center;
   }
   .add-to-bag{
   }
   .product-holder{
      position: relative;
      justify-content: center;
      vertical-align:bottom;
      padding: 10px;
      margin: 10px;
      margin-bottom: 30px;
   }
   .product-holder button{
      width: 91%;
      position: absolute;
      bottom: 0;
      text-align: center;
      margin: auto;
   }
   .price-holder{
       text-align: center;
       margin-bottom: 50px;
       bottom: 0;
   }
   .price-holder span{
     
   }
   .name-holder{
       text-align: center;
       justify-content: center;
   }
   .name-holder p{
       text-align: center;
       width: 200px;
   }
   @media only screen and (max-device-width: 800px) {
      .separator { margin-bottom: 3%!important; margin-top: 15%!important; }
      .grid-container{
          align-content: center;
      }
      .empty-text{
         text-align: center; 
         width: 90%; 
         margin: auto;"
       }
   }
   .wishlist-icon {
        overflow-x: hidden;
        height: 100%;
        background: url("https://cdn.shopify.com/s/files/1/0493/2124/6886/files/icons8-cancel-64.png?v=1659709637");
        background-repeat: no-repeat;
        background-size: auto;
        background-size: 15px 15px;
        background-position: left top;
        height: 15px;
        width: 15px;
        display: block;
        position: relative;
        left: 166px;
    }
    .cancel-holder {
        top: 0;
        right: 0; 
    }
   .grid-container{
      max-width: 1180px;
      margin: auto;
      width: 100%;
      flex-wrap: wrap;
      display: flex;
      justify-content: center;
   }
   .cards {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      gap: 2rem;
      width: 200px;
   }
   .image-wrapper {
      overflow: hidden;
      height: 200px;
   }
   .separator{
      height: 1px;
      background: #c4c4c4;
      margin: 0;
      width: 100%;
      margin-bottom: 3%;
   }
 </style>
`;

function getVariantInfo(variants) {
    try {
        let variantKeys = ((variants && variants != "[]") ? Object.keys(JSON.parse(variants)[0]) : []), variantinfo;
        if (variantKeys.length > 0) {
            variantinfo = variantKeys[0];
            if (variantinfo == "Default Title") {
                variantinfo = "";
            }
        } else {
            variantinfo = "";
        }
        return variantinfo;
    } catch (err) {
        return variants;
    }
}


function swymCallbackFn() {
    // gets called once Swym is ready
    var wishlistContentsContainer = document.getElementById("wishlist-items-container");
    _swat.fetchWrtEventTypeET(
        function (products) {
            // Get wishlist items
            var formattedWishlistedProducts = products.map(function (p) {
                p = SwymUtils.formatProductPrice(p);    // formats product price and adds currency to product Object
                p.isInCart = _swat.platform.isInDeviceCart(p.epi) || (p.et == _swat.EventTypes.addToCart);
                p.variantinfo = (p.variants ? getVariantInfo(p.variants) : "");
                console.log(p);
                allProducts(p.empi);
                checkComingSoon(p.empi);
                return p;
            });
            var productCardsMarkup = SwymUtils.renderTemplateString(productCardMarkup, { products: formattedWishlistedProducts });
            wishlistContentsContainer.innerHTML = productCardsMarkup;

            attachClickListeners();
            RemoveClickListeners();
        },
        window._swat.EventTypes.addToWishList
    );
}

if (!window.SwymCallbacks) {
    window.SwymCallbacks = [];
}

window.SwymCallbacks.push(swymCallbackFn);

function onAddToCartClick(e) {
    e.preventDefault();
    var productId = e.target.getAttribute("data-product-id");
    var variantId = e.target.getAttribute("data-variant-id");
    var du = e.target.getAttribute("data-url");
    var cartButtonValue = document.getElementById("cart" + productId).innerHTML;
    if (cartButtonValue == "Sold out" || cartButtonValue == "coming-soon") {
        console.log(cartButtonValue);
    } else {
        e.target.innerHTML = "Adding..";
        window._swat.replayAddToCart(
            { empi: productId, du: du },
            variantId,
            function () {
                e.target.innerHTML = "Added to Bag";
                window.location.reload();
                console.log("Successfully added product to cart.");
            },
            function (e) {
                console.log(e);
            }
        );
    }
}

async function allProducts(id) {
    var productPromise = await fetch(`/search/suggest.json?type=product&q=id:${id}&resources[type]=product`)
        .then(data => { return data.json() })
        .then(response => response.resources)
        .then(response => response.results)
        .then(response => response.products[0])
        .then(response => response.compare_at_price_max)
        .then(response => {
            var opr = parseFloat(JSON.parse(response));
            if (opr != "0") {
                opr = "$" + opr + ".00";
                document.getElementById(id).innerHTML = opr;
            }
        })
        .catch(e => console.log(e, "Can't retrieve data from shopify api products"));
}

async function checkComingSoon(id) {
    var productPromise = await fetch(`/search/suggest.json?type=product&q=id:${id}&resources[type]=product`)
        .then(data => { return data.json() })
        .then(response => response.resources)
        .then(response => response.results)
        .then(response => response.products[0])
        .then(response => response.tags)
        .then(response => {
            var tags = response;
            for (let i = 0; i < tags.length; i++) {
                if (tags[i] == "Sold out") {
                    document.getElementById("cart" + id).innerHTML = "Sold out";
                    document.getElementById('cart' + id).style.backgroundColor = "grey";
                }
                else if (tags[i] == "coming-soon") {
                    document.getElementById('cart' + id).innerHTML = "Coming Soon";
                    document.getElementById('cart' + id).style.backgroundColor = "grey";
                }

            }
            console.log("tags: " + tags)
        })
        .catch(e => console.log(e, "Can't retrieve data from shopify api products"));
}


function onRemoveFromWishlist(e) {
    e.preventDefault();
    var productId = e.target.getAttribute("data-empi-id");
    var variantId = e.target.getAttribute("data-epi-id");
    var du = e.target.getAttribute("data-du");
    var stk = e.target.getAttribute("data-stk");
    var pr = e.target.getAttribute("data-pr");
    var url = e.target.getAttribute("data-url");
    var variant = e.target.getAttribute("data-variant");
    console.log("product: " + du);
    window._swat.removeFromWishList(
        {
            "epi": variantId,
            "du": du,
            "empi": productId,
            "iu": url,
            "pr": pr,
            "stk": stk,
            "variants": variant
        },
        function (r) {
            window.SwymCallbacks.push(swymCallbackFn);
            console.log('Removed to wishlist ' + r);
        }
    );
}

function attachClickListeners() {
    var addToCartButtons = document.getElementsByClassName("add-to-cart");
    for (var i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener('click', onAddToCartClick, false);
    }
}

function RemoveClickListeners() {
    var removeFromWishlist = document.getElementsByClassName("remove-from-wishlist");
    for (var j = 0; j < removeFromWishlist.length; j++) {
        removeFromWishlist[j].addEventListener('click', onRemoveFromWishlist, false);
    }
}
