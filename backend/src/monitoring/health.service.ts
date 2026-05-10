import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getLive() {
    return { status: 'live' };
  }

  getVersion() {
    return {
      name: 'asset-light-delivery-backend',
      version: process.env.npm_package_version ?? '0.1.0',
      nodeEnv: process.env.NODE_ENV ?? 'development',
    };
  }
}
