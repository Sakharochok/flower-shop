# 📄 Lab 3: Retrospective Report

## 1. Project Context
Integration of external libraries into the "Flower Shop" project.

## 2. Answers to Retrospective Questions

### 2.1. Tasks solved
* **Validation:** Used `validator` library to secure API endpoints (email format, string sanitization).
* **Date Logic:** Used `date-fns` to calculate estimated delivery dates (Next Day Delivery).

### 2.2. Why these libraries?
* **validator:** The standard for Node.js string validation. Lightweight and secure.
* **date-fns:** Modern, immutable alternative to Moment.js. Allows tree-shaking (importing only what is needed).

### 2.3. Installation & Usage
* Installation: `npm install validator date-fns` was straightforward.
* Documentation: Both libraries have excellent official docs.
* Integration: `validator` was easy to plug into the Express request handler. `date-fns` fit perfectly into the `Order` class entity.

### 2.4. Problems encountered
No significant technical issues. The main challenge was deciding logical delivery times (changed from 3 days to 1 day for perishable goods).

### 2.5. Positive aspects
* Code is cleaner (no regex for email validation).
* Date logic is reliable and handles month/year rollovers automatically.

## 3. Resources
* [Validator.js Documentation](https://github.com/validatorjs/validator.js)
* [date-fns Documentation](https://date-fns.org/)