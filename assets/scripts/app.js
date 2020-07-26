window.onload = function () {

    localStorage.clear();

    // create products
    products = new Products();

    // create shopping cart
    var myShoppingCart = new ShoppingCart();

    // search on click and enter
    searchBoxInput = document.getElementById("search-box-input");
    document.getElementById("search-box-button").onclick = function () {
        searchProducts(searchBoxInput.value, myShoppingCart);
    }
    document.getElementById("search-form").onsubmit = function (event) {
        event.preventDefault();
        searchProducts(searchBoxInput.value, myShoppingCart);
    }

    // open and close sidebar
    document.getElementById("iconShoppingCart").onclick = function () {
        document.getElementById("shoppingCart").classList.add("show")
    }
    document.getElementById("shoppingCartClose").onclick = function () {
        document.getElementById("shoppingCart").classList.remove("show")
    }

    // traigo resultados para tener productos al ingresar
    searchProducts("cuaderno", myShoppingCart);
}
