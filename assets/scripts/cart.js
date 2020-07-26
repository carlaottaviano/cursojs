function ShoppingCart() {
    var listShoppingCart = [];

    this.add = function (id) {
        manageLocalStorage(id, true);
        manageDOM(id, true);
        totalQuantity();
        document.getElementById('total').innerHTML = `$ ${total()}`;
    }

    function deletePROD(id) {
        manageLocalStorage(id, false);
        manageDOM(id, false);
        totalQuantity();
        document.getElementById('total').innerHTML = `$ ${total()}`;
    }

    function manageLocalStorage(id, isAdd) {
        if (isAdd) {
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

    function manageDOM(id, isAdd) {
        if (isAdd) {
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
                var prodIndex = listShoppingCart.findIndex(elem => elem.id == id);
                listShoppingCart.splice(prodIndex, 1);
            }
        }
    }

    this.get = function () {
        return listShoppingCart;
    }

    function totalQuantity() {
        var totalQuantity = 0;
        listShoppingCart.forEach(function (element) {
            totalQuantity = totalQuantity + parseInt(localStorage.getItem(element.id));
        })
        $("#badge-total").html(totalQuantity);
    }

    function total() {
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
        document.getElementById(`trash-${id}`).addEventListener("click", function () {
            deletePROD(id)
        }
        );
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