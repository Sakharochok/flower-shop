export class ShippingStrategy {
    calculate(address) {
        throw new Error("Method 'calculate' must be implemented");
    }
}

export class NovaPoshtaStrategy extends ShippingStrategy {
    calculate(address) {
        console.log(`Calculating Nova Poshta delivery to ${address}...`);
        return 80;
    }
}

export class PickupStrategy extends ShippingStrategy {
    calculate(address) {
        console.log("Customer will pick up the order.");
        return 0;
    }
}