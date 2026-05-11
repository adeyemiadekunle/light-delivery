import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { setupApiDocs } from '../src/docs/swagger';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    process.env.SKIP_PRISMA_CONNECT = 'true';
    process.env.SKIP_QUEUE_CONNECT = 'true';
    const { AppModule } = await import('../src/app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    setupApiDocs(app);
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('/api/v1/health/live returns live status', () => {
    return request(app.getHttpServer()).get('/api/v1/health/live').expect(200).expect({
      status: 'live',
    });
  });

  it('/api/docs serves Swagger UI', async () => {
    const response = await request(app.getHttpServer()).get('/api/docs').expect(200);

    expect(response.text).toContain('Swagger UI');
  });

  it('/api/docs-json exposes OpenAPI metadata and DTO schemas', async () => {
    const response = await request(app.getHttpServer()).get('/api/docs-json').expect(200);

    expect(response.body.info.title).toBe('Asset-Light Delivery API');
    expect(response.body.components.securitySchemes.bearer).toMatchObject({
      type: 'http',
      scheme: 'bearer',
    });
    expect(response.body.paths['/api/v1/hubs']).toBeDefined();
    expect(response.body.components.schemas.CreateHubDto.required).toContain('localAreaId');
    expect(response.body.components.schemas.CreateHubDto.properties.localAreaId).toMatchObject({
      type: 'string',
      description: 'Required local area id used to group hubs into service zones',
    });
  });
});
