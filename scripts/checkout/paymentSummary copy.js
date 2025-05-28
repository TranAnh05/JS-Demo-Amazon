import { cart, getQuantity, getItemInCart, makeCartEmpty } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { renderOrderSummary } from "./orderSummary.js";

const checkoutCartItem = document.querySelector(".js-checkout-cart-item");

export function renderPaymentSummary() {
    let productPriceTotal = 0;

    cart.forEach((cardItem) => {
        const product = getProduct(cardItem.productId);
        productPriceTotal += product.priceCents * cardItem.quantity;
    });

    const taxCents = productPriceTotal * 0.1;
    const totalCents = productPriceTotal + taxCents;
    const cartItemTotal = getItemInCart();

    const paymentSummaryHTML = `
                <div class="payment-summary-title">Order Summary</div>

                <div class="payment-summary-row">
                    <div>Items (${cartItemTotal}):</div>
                    <div class="payment-summary-money">$${(productPriceTotal / 100).toFixed(2)}</div>
                </div>

                <div class="payment-summary-row subtotal-row">
                    <div>Total before tax:</div>
                    <div class="payment-summary-money">$${(productPriceTotal / 100).toFixed(2)}</div>
                </div>

                <div class="payment-summary-row">
                    <div>Estimated tax (10%):</div>
                    <div class="payment-summary-money">$${(taxCents / 100).toFixed(2)}</div>
                </div>

                <div class="payment-summary-row total-row">
                    <div>Order total:</div>
                    <div class="payment-summary-money">$${(totalCents / 100).toFixed(2)}</div>
                </div>

                <button class="place-order-button button-primary js-place-order">Place your order</button>
           
        `;

    const paymentSummaryContainer = document.querySelector(".js-payment-summary");
    checkoutCartItem.innerHTML = cartItemTotal;
    paymentSummaryContainer.innerHTML = paymentSummaryHTML;
    if (productPriceTotal === 0) {
        paymentSummaryContainer.remove();
        document.querySelector(".js-page-title").innerText = `Your cart is empty`;
    }

    document.querySelector(".js-place-order").addEventListener("click", () => {
        makeCartEmpty();
        renderOrderSummary();
        paymentSummaryContainer.remove();
        document.querySelector(".js-page-title").innerText = `You have just placed an order successfully!`;
        checkoutCartItem.innerHTML = `0`;
    });
}
