import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FormDataPipe implements PipeTransform {
  transform(body: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const parsed = {};
      for (const key in body) {
        const temp = Number(body[key]);
        if (isNaN(temp)) {
          parsed[key] = body[key];
        } else {
          parsed[key] = temp;
        }
      }
      return parsed;
    }

    return body;
  }
}
