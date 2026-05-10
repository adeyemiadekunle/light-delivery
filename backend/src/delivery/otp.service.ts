import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  matches(expectedCode: string, submittedCode: string) {
    return expectedCode === submittedCode;
  }
}
