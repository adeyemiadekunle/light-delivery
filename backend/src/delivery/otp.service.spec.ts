import { OtpService } from './otp.service';

describe('OtpService', () => {
  it('accepts matching active OTP codes', () => {
    const service = new OtpService();

    expect(service.matches('123456', '123456')).toBe(true);
    expect(service.matches('123456', '654321')).toBe(false);
  });
});
