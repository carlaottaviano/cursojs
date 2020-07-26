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

function setSearchKeyRender(key) {
    var searchKey = document.getElementById("search-key");
    $(searchKey).html(key);
};
