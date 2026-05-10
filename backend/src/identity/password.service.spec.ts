import { PasswordService } from './password.service';

describe('PasswordService', () => {
  it('verifies a password against its hash', async () => {
    const service = new PasswordService();
    const hash = await service.hash('strong-password');

    await expect(service.verify('strong-password', hash)).resolves.toBe(true);
    await expect(service.verify('wrong-password', hash)).resolves.toBe(false);
  });
});
