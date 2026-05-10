import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot() {
    return {
      name: 'asset-light-delivery-backend',
      status: 'ok',
    };
  }
}
