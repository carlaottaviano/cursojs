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