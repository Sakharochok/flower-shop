// frontend/js/main.js

// Імпортуємо масив товарів та клас Flower, оскільки нам потрібна його логіка
import { products, Flower } from '../../backend/data/products.js';
import { updateCartCount, addToCart } from './cart.js';

const productListContainer = document.getElementById('product-list');

// Функція для генерації однієї картки товару
function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Перевіряємо, чи є товар квіткою для відображення додаткової інформації
    const isFlower = product instanceof Flower;
    
    // Вміст картки
    card.innerHTML = `
        <img src="${product.getImage()}" alt="${product.getName()}" class="product-image">
        <h3>${product.getName()}</h3>
        <p>${product.getDescription()}</p>
        <p>Ціна: ${product.getPrice()} грн</p>
        ${isFlower ? `<p style="font-size: 0.8em; color: gray;">Довжина стебла: ${product.isSuitableForTallVase() ? 'Довге' : 'Коротке'}</p>` : ''}
        <button class="add-to-cart-btn" data-id="${product.getId()}">Додати в кошик</button>
    `;

    // Обробник кліку для кнопки "Додати в кошик"
    const button = card.querySelector('.add-to-cart-btn');
    button.addEventListener('click', () => {
        // Додаємо об'єкт товару в кошик
        addToCart(product);
    });

    return card;
}

// Функція для відображення всіх товарів
function renderProductList() {
    if (!productListContainer) return;
    
    // Очищаємо контейнер
    productListContainer.innerHTML = ''; 

    // Додаємо картки товарів
    products.forEach(product => {
        const cardElement = renderProductCard(product);
        productListContainer.appendChild(cardElement);
    });
}

// Запускаємо відображення товарів після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    // Оновлюємо лічильник кошика при завантаженні
    updateCartCount(); 
    // Відображаємо список товарів
    renderProductList();
});