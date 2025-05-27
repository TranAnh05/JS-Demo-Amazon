import { products, filterProductsByName } from "../data/products.js";
import { cart, addToCart, updateQuantityToCart } from "../data/cart.js";
import { productsDetail, getProductDetail } from "../data/productsDetail.js";

// let htmls = "";
renderProducts(products);

function renderProducts(typeProducts) {
    let htmls = "";
    typeProducts.forEach((product) => {
        htmls += `
        <div class="product-container">
            <div class="product-image-container">
                <img class="product-image" src="${product.image}" />
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${product.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars" src="./assets/img/ratings/rating-${product.rating.stars * 10}.png" />
                <div class="product-rating-count link-primary">${product.rating.count}</div>
            </div>

            <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>

            <div class="product-quantity-container">
                <select class="js-select">
                    <option selected value="1" >1</option>
                    <option value="2" >2</option>
                    <option value="3" >3</option>
                    <option value="4" >4</option>
                    <option value="5" >5</option>
                    <option value="6" >6</option>
                    <option value="7" >7</option>
                    <option value="8" >8</option>
                    <option value="9" >9</option>
                    <option value="10" >10</option>
                </select>
            </div>

            <div class="product-spacer"></div>
            <button class="view-detail-button button-primary js-view-detail-btn" data-product-id="${
                product.id
            }">View detail</button>
            <button class="add-to-cart-button button-primary js-add-to-card" data-product-id="${
                product.id
            }">Add to Cart</button>
        </div>
    `;
    });
    document.querySelector(".js-products-grid").innerHTML = htmls;

    function showProductDetail(productId) {
        const product = products.find((p) => p.id === productId);
        console.log(productId);

        const productDetail = getProductDetail(productId);

        if (!product && !productDetail) return;

        const viewDetailContainer = document.querySelector(".js-view-detail-container");
        viewDetailContainer.innerHTML = `
        <div class="container">
            <div class="view-detail-inner">
                <div class="close-detail-wrap js-close-view-detail">
                    <img src="./assets/icon/close-detail.svg" alt="" class="close-detail-btn" />
                </div>
                <!-- image -->
                <img
                    src="${product.image}"
                    alt=""
                    class="view-detail-img"
                />
                <!-- info -->
                <div class="view-detail-info">
                    <h2 class="view-detail-name">${product.name}</h2>
                    <p class="view-detail-desc">${productDetail.desc}</p>
                    <div class="product-rating-container view-detail-rating-container">
                        <img class="product-rating-stars view-detail-rating-stars" src="./assets/img/ratings/rating-${
                            product.rating.stars * 10
                        }.png" />
                        <div class="product-rating-count link-primary view-detail-rating-count">${
                            product.rating.count
                        }</div>
                    </div>
                    <span class="view-detail-price">$${(product.priceCents / 100).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
        document.querySelector(".js-close-view-detail").addEventListener("click", closeOpenViewDetail);
    }

    function closeOpenViewDetail() {
        const viewDetailContainer = document.querySelector(".js-view-detail-container");
        const overlay = document.querySelector(".js-overlay");
        viewDetailContainer.classList.toggle("show");
        overlay.classList.toggle("show");
    }

    document.querySelectorAll(".js-view-detail-btn").forEach((viewDetailItem) => {
        viewDetailItem.addEventListener("click", () => {
            const productId = viewDetailItem.dataset.productId;
            showProductDetail(productId);
            closeOpenViewDetail();
        });
    });

    function updateToCart() {
        let addedTotal = 0;
        cart.forEach((cartItem) => {
            addedTotal++;
        });

        document.querySelector(".js-cart-quantity").innerText = addedTotal;
    }

    let numOfItem = 1;
    document.querySelectorAll(".js-select").forEach((selectItem) => {
        selectItem.addEventListener("change", (e) => {
            numOfItem = e.target.value;
        });
    });

    document.querySelectorAll(".js-add-to-card").forEach((buttonElement) => {
        buttonElement.addEventListener("click", () => {
            const productId = buttonElement.dataset.productId;

            addToCart(productId, numOfItem);
            numOfItem = 1;
            updateToCart();
            updateQuantityToCart();
        });
    });
    updateToCart();
}

function toCapitalizeFirstLetter(str) {
    const words = str.split(" ");

    const capitalizedWords = words
        .map((word) => {
            return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ");

    return capitalizedWords;
}

let wordArray;
document.querySelector(".js-input-amazon").addEventListener("change", (e) => {
    const searchValue = toCapitalizeFirstLetter(e.target.value.trim());
    wordArray = searchValue.split(" ");
});

document.querySelector(".js-input-amazon").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const searchValue = toCapitalizeFirstLetter(e.target.value.trim());
        wordArray = searchValue.split(" ");
        const filteredProducts = filterProductsByName(wordArray);
        if (filteredProducts.length !== 0) {
            renderProducts(filteredProducts);
        } else {
            renderProducts(products);
        }
    }
});

document.querySelector(".js-btn-amazon").addEventListener("click", () => {
    const filteredProducts = filterProductsByName(wordArray);
    if (filteredProducts.length !== 0) {
        renderProducts(filteredProducts);
    } else {
        renderProducts(products);
    }
});
