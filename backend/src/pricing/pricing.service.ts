import { Injectable } from '@nestjs/common';

type PriceInput = {
  weightKg: number;
};

@Injectable()
export class PricingService {
  quote(input: PriceInput) {
    const basePrice = 1500;
    const weightCharge = Math.max(0, input.weightKg - 1) * 300;

    return {
      currency: 'NGN',
      amount: basePrice + weightCharge,
      breakdown: {
        basePrice,
        weightCharge,
      },
    };
  }
}
