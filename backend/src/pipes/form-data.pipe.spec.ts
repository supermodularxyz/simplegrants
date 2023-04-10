import { ArgumentMetadata } from '@nestjs/common';
import { FormDataPipe } from './form-data.pipe';

describe('FormDataPipe', () => {
  it('should be defined', () => {
    expect(new FormDataPipe()).toBeDefined();
  });

  it('should transform numerical strings', () => {
    const pipe = new FormDataPipe();
    const body = {
      a: '1',
      b: '2',
      c: '3',
    };
    const metadata: ArgumentMetadata = {
      type: 'body',
    };
    expect(pipe.transform(body, metadata)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  it('should ignore undefined attributes', () => {
    const pipe = new FormDataPipe();
    const body = {
      a: '1',
      b: undefined,
      c: '3',
    };
    const metadata: ArgumentMetadata = {
      type: 'body',
    };
    expect(pipe.transform(body, metadata)).toEqual({
      a: 1,
      b: undefined,
      c: 3,
    });
  });

  it('should ignore null attributes', () => {
    const pipe = new FormDataPipe();
    const body = {
      a: '1',
      b: null,
      c: '3',
    };
    const metadata: ArgumentMetadata = {
      type: 'body',
    };
    expect(pipe.transform(body, metadata)).toEqual({
      a: 1,
      b: null,
      c: 3,
    });
  });

  it('should ignore string attributes', () => {
    const pipe = new FormDataPipe();
    const body = {
      a: '1',
      b: 'string',
      c: '3',
    };
    const metadata: ArgumentMetadata = {
      type: 'body',
    };
    expect(pipe.transform(body, metadata)).toEqual({
      a: 1,
      b: 'string',
      c: 3,
    });
  });

  it('should ignore non-body arguments', () => {
    const pipe = new FormDataPipe();
    const body = {
      a: '1',
      b: '2',
      c: '3',
    };

    expect(
      pipe.transform(body, {
        type: 'custom',
      }),
    ).toEqual(body);
    expect(
      pipe.transform(body, {
        type: 'param',
      }),
    ).toEqual(body);
    expect(
      pipe.transform(body, {
        type: 'query',
      }),
    ).toEqual(body);
  });
});
