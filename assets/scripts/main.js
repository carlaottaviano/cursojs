function searchProducts(key, myShoppingCart) {
    var url = `https://api.mercadolibre.com/sites/MLA/search?q=${key}`;
    $.ajax({
        method: "GET",
        url: url,
    }).done(function (data) {
        products.init(data.results);
        var searchResultNullText = $("#js-search-result-null");
        var searchResultText = $("#js-search-result");
        if (data.results.length > 0) {
            setSearchKeyRender(searchBoxInput.value);
            $(searchResultText).show();
            $(searchResultText).html(`${data.results.length} resultados`);
            $(searchResultNullText).hide();
            products.buildList('products-container', data.results);
            Array.from(document.getElementsByClassName("js-btn-add-to-cart")).forEach(function (element) {
                element.onclick = function () {
                    myShoppingCart.add(element.id);
                }
            });
        } else {
            setSearchKeyRender('');
            $(searchResultText).hide();
            $(searchResultNullText).show();
            products.cleanList('products-container');
        }
    }).fail(function (error) {
        console.log(error)
    });
}

// listado de productos
function Products() {
    this.data = [];
    this.results = [];

    this.init = function (dataJSON) {
        this.data = dataJSON;
    }

    this.getProductById = function (id) {
        var productFound = null;
        this.data.forEach(function (product) {
            if (product.id == id) {
                productFound = product;
            }
        })
        return productFound;
    };

    this.buildHtmlProduct = function (product) {
        return `
            <div class="col-md- col-md-4 col-lg-3 card card--product border-0 mb-4">
                <img class="card-img-top" src="${product.thumbnail}" alt="${product.title}">
                <div class="card-body pt-3">
                    <h5 class="card-title mb-1 line-clamp" title="${product.title}">${product.title}</h5>
                    <p class="card-text">$${product.price}</p>
                    <button id="${product.id}" type="button" class="btn btn--sm btn-primary btn-block js-btn-add-to-cart">Agregar al carrito</button>
                </div>
            </div>
        `
    }

    this.buildList = function (containerId, sourceData) {
        var container = document.getElementById(containerId);
        container.innerHTML = "";
        var html = '';

        sourceData.forEach(product => {
            html = html + this.buildHtmlProduct(product);
        });

        container.innerHTML = html;
    }

    this.search = function (key) {
        this.results = [];
        this.data.forEach((product) => {
            if (product.title.toLowerCase().includes(key.toLowerCase())) {
                this.results.push(product);
            }
        });
        return this.results;
    }

    this.cleanList = function (containerId) {
        var container = document.getElementById(containerId);
        container.innerHTML = "";
    }
}

// carrito
function ShoppingCart() {
    var listShoppingCart = [];

    this.add = function (id) {
        manageLocalStorage(id, true);
        manageDOM(id, true);
        this.totalQuantity();
        document.getElementById('total').innerHTML = `$ ${this.total()}`;
    }

    this.delete = function (id){
        manageLocalStorage(id, false);
        manageDOM(id, false);
        this.totalQuantity();
        document.getElementById('total').innerHTML = `$ ${this.total()}`;
    }

    function manageLocalStorage (id, isAdd) {
        if(isAdd) {
            if (localStorage.getItem(id) !== null) {
                localStorage.setItem(id, parseInt(localStorage.getItem(id)) + 1);
            } else {
                localStorage.setItem(id, 1);
            }
        } else {
            if (parseInt(localStorage.getItem(id)) > 1) {
                localStorage.setItem(id, parseInt(localStorage.getItem(id)) - 1);
            } else {
                localStorage.removeItem(id);
            }
        }
    }

    function manageDOM (id, isAdd) {
        if(isAdd) {
            if (parseInt(localStorage.getItem(id)) > 1) {
                document.getElementById(`product-quantity-${id}`).innerHTML = ` x ${localStorage.getItem(id)}`;
            } else {
                addNewItemToCart(id);
            }
        } else {
            if (parseInt(localStorage.getItem(id)) >= 1) {
                document.getElementById(`product-quantity-${id}`).innerHTML = ` x ${localStorage.getItem(id)}`;
            } else {
                document.getElementById(`product-cart-${id}`).remove();
            }
        }
    }

    // retorna el contenido del carrito
    this.get = function () {
        return listShoppingCart;
    }

    this.totalQuantity = function () {
        var totalQuantity = 0;
        listShoppingCart.forEach(function (element) {
            totalQuantity = totalQuantity + parseInt(localStorage.getItem(element.id));
        })
        $("#badge-total").html(totalQuantity);
    }

    // calcula el precio total de los productos del carrito
    this.total = function () {
        var total = 0;
        listShoppingCart.forEach(function (element) {
            total = element.price * parseInt(localStorage.getItem(element.id)) + total;
        })
        return total;
    }

    function addNewItemToCart(id) {
        var productoSeleccionado = products.getProductById(id);
        listShoppingCart.push(productoSeleccionado);
        var li = document.createElement("li");
        setLiInnerHtml(li, productoSeleccionado, id);
        li.id = `product-cart-${id}`;
        document.getElementById('cart-list').appendChild(li);
        // document.getElementById(`trash-${id}`).addEventListener("click", myShoppingCart.delete(id));
        document.getElementById(`trash-${id}`).addEventListener("click", function(){
            myShoppingCart.delete(id)
        });
    }

    function setLiInnerHtml(li, productoSeleccionado, id) {
        li.innerHTML = `
            <div class="card card--cart mb-3">
                <div class="card-body">
                    <div class="media align-items-center">
                        <img class="mr-3" src="${productoSeleccionado.thumbnail}" alt="Card image cap">
                        <div class="media-body d-flex justify-content-between">
                            <div>
                                <h5 class="card-title mb-1 line-clamp" title="${productoSeleccionado.title}">${productoSeleccionado.title}</h5>
                                <p class="card-text mb-3">$${productoSeleccionado.price}</p>
                                <span id="product-quantity-${id}">x 1</span>
                            </div>
                            <button id="trash-${id}" type="button" class="btn btn-link text-danger btn--icon">
                                <i class="far fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function setSearchKeyRender(key) {
    var searchKey = document.getElementById("search-key");
    $(searchKey).html(key);
};

window.onload = function () {

    localStorage.clear();

    // productos
    products = new Products();

    // carrito de compras
    var myShoppingCart = new ShoppingCart();
    // buscador
    searchBoxInput = document.getElementById("search-box-input");
    document.getElementById("search-box-button").onclick = function () {
        searchProducts(searchBoxInput.value, myShoppingCart);
    }
    document.getElementById("search-form").onsubmit = function (event) {
        event.preventDefault();
        searchProducts(searchBoxInput.value, myShoppingCart);
    }
    // open sidebar
    document.getElementById("iconShoppingCart").onclick = function () {
        document.getElementById("shoppingCart").classList.add("show")
    }
    document.getElementById("shoppingCartClose").onclick = function () {
        document.getElementById("shoppingCart").classList.remove("show")
    }
    // traigo resultados para tener productos al ingresar
    searchProducts("cuaderno", myShoppingCart);
}
