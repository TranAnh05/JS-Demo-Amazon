export let cart = JSON.parse(localStorage.getItem("cart")) || [];

export function makeCartEmpty() {
    cart = [];
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function getQuantity() {
    return cart.reduce((a, b) => a + b.quantity, 0);
}

export function getItemInCart() {
    let itemTotal = 0;
    let lengthCart = cart.length;
    for (let i = 0; i < lengthCart; i++) {
        itemTotal++;
    }
    return itemTotal;
}

export function addToCart(productId, numOfItem) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    if (matchingItem) {
        matchingItem.quantity = Number(matchingItem.quantity) + Number(numOfItem);
    } else {
        cart.push({
            productId: productId,
            quantity: numOfItem,
        });
    }
    saveToStorage();
}

// export function removeFromCart(productId) {
//     const newCart = [];

//     cart.forEach((cartItem) => {
//         if (cartItem.productId !== productId) {
//             newCart.push(cartItem);
//         }
//     });

//     cart = newCart;
//     saveToStorage();
// }

export function removeFromCart(productId) {
    cart.forEach((cartItem, index) => {
        if (cartItem.productId === productId) {
            cart.splice(index, 1);
        }
    });
    saveToStorage();
}

export function updateQuantityToCart(productId, changedNum) {
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            cartItem.quantity = Number(changedNum);
        }
    });
    saveToStorage();
}
