// test-scenario.js

// Імпортуємо всі необхідні класи
import { User, Order, Payment, NovaPoshtaShipping } from './backend/data/entities.js';
import { Flower, Bouquet, DecorItem } from './backend/data/products.js';

// --- Демонстрація клієнтського коду ---

console.log("--- Сценарій: Оформлення замовлення в квітковому магазині ---");

// 1. Створення об'єктів
console.log("\n1. Створюємо об'єкти: користувач, квіти, букет.");
const user = new User(1, "Іван Петренко", "ivan.petrenko@example.com");
user.setShippingAddress("Київ, вул. Шевченка, 10");

const rose = new Flower(1, "Червона троянда", 50, "url_rose.jpg", "червоний", 60);
const lily = new Flower(2, "Біла лілія", 45, "url_lily.jpg", "білий", 45);
const ribbon = new DecorItem(4, "Шовкова стрічка", 25, "url_ribbon.jpg", "silk");

// 2. Створення замовлення
console.log("\n2. Створюємо нове замовлення для користувача.");
const order = new Order(101, user);
order.addItem({ id: rose.getId(), name: rose.getName(), price: rose.getPrice(), quantity: 5 });
order.addItem({ id: lily.getId(), name: lily.getName(), price: lily.getPrice(), quantity: 2 });
order.addItem({ id: ribbon.getId(), name: ribbon.getName(), price: ribbon.getPrice(), quantity: 1 });

// 3. Розрахунок та оплата
console.log("\n3. Розраховуємо суму замовлення та створюємо платіж.");
const totalAmount = order.calculateTotal();
console.log(`Загальна сума замовлення: ${totalAmount} грн`);

const payment = new Payment(201, totalAmount, 'card');
payment.processPayment();
console.log(`Статус платежу: ${payment.isPaid() ? "Оплачено" : "Не оплачено"}`);

// 4. Демонстрація поліморфізму (для відстеження)
console.log("\n4. Демонстрація поліморфізму для доставки.");
const shipping = new NovaPoshtaShipping(301, user.getShippingAddress(), 15);
const shippingCost = shipping.calculateCost(); // Використовується динамічний поліморфізм
const trackingNumber = shipping.generateTrackingNumber();

console.log(`Вартість доставки: ${shippingCost} грн`);
console.log(`Номер відстеження: ${trackingNumber}`);

// 5. Оновлення статусу замовлення
console.log("\n5. Оновлюємо статус замовлення.");
order.updateStatus('shipped');
console.log(`Новий статус замовлення: ${order.getStatus()}`);