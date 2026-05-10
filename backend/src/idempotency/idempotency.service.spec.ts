import { IdempotencyService } from './idempotency.service';

describe('IdempotencyService', () => {
  it('creates a deterministic lookup key from actor, scope, and key', () => {
    const service = new IdempotencyService({} as never);

    expect(service.buildLookupKey('user-1', 'parcel-booking', 'abc')).toBe('user-1:parcel-booking:abc');
  });
});
