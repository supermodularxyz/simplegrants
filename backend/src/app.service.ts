import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Status: OK\nLast Report: [ ${new Date()} ]`;
  }
}
