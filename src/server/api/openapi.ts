import { generateOpenApiDocument } from 'trpc-openapi';

import { appRouter } from './root';

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Example Application using tRPC with Next.js, OpenAPI, and Unkey',
  description: 'OpenAPI compliant REST API built using tRPC with Next.js',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000/api',
  docsUrl: 'http://localhost:3000/docs',
  tags: ['auth', 'users', 'projects'],
});