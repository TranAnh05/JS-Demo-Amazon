import { cart, removeFromCart, updateQuantityToCart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
    let cartSummaryHTML = "";

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const matchingItem = getProduct(productId);

        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container">
                <div class="cart-item-details-grid">
                    <img
                        class="product-image"
                        src="${matchingItem.image}"
                    />

                    <div class="cart-item-details">
                        <div class="product-name">${matchingItem.name}</div>
                        <div class="product-price">$${(matchingItem.priceCents / 100).toFixed(2)}</div>
                        <div class="product-quantity">
                            <span> Quantity:</span>
                            <input type="number" 
                                value="${
                                    cartItem.quantity
                                }" min="1" max="100" class="product-increase js-product-increase" data-product-id="${
            matchingItem.id
        }"/>
                            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                                matchingItem.id
                            }"> Delete </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

    document.querySelectorAll(".js-delete-link").forEach((deleteElement) => {
        deleteElement.addEventListener("click", () => {
            const productId = deleteElement.dataset.productId;
            removeFromCart(productId);
            const containerElement = document.querySelector(".js-cart-item-container");
            containerElement.remove();
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

    document.querySelectorAll(".js-product-increase").forEach((updateItem) => {
        updateItem.addEventListener("change", (e) => {
            const productId = updateItem.dataset.productId;
            const changedNum = e.target.value;

            updateQuantityToCart(productId, changedNum);
            renderPaymentSummary();
        });
    });
}
