# zod-build-json-schemas
Wrapper around [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema), that makes it easier to use it with `Fastify` & `OpenAPI`.  
Define your models using `zod` in a single place without redundancy / conflicting sources of truth, out of the box type-safety in `fastify` & first-class support for `fastify-swagger` and `openapi-typescript`.

## Table of Contents
- [Summary](#summary)
- [Usage](#usage)
  - [Basic example](#basic-example) 
  - [Fastify Integration Example](#fastify-integration-example)
- [Configuration](#configuration)
  - [Override default options](#override-default-options) 

## Summary   
- ✅ Allows easily referensing individual models via `$ref` function.  
- ✅ Applies a consistent `$id` and `basePath`, making the resulting schema suitable for referencing in `OpenAPI` or other tools.  
- ✅ Outputs schemas as an array, structured in a way that's friendly for things like `Fastify` or `OpenAPI` schema registration.

## Usage
```
npm i zod-build-json-schemas
```

### Basic example
```ts
import z from "zod";
import { buildJsonSchemas } from "zod-build-json-schemas";

const loginBody = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8),
});
const loginResponse = z.object({
  accessToken: z.string(),
});

export const { schemas, $ref } = buildJsonSchemas(
  {
    loginBody,
    loginResponse
  },
  {
    $id: 'auth',
  }
);
```
`schemas` - An array containing JSON Schemas structured like this:
```json
[
  {
    "$id": "auth",
    "type": "object",
    "properties": {
      "loginBody": {
        "type": "object",
        "properties": {
          "email": { "type": "string", "format": "email", "minLength": 1 },
          "password": { "type": "string", "minLength": 8 }
        },
        "required": ["email", "password"]
      },
      "loginResponse": {
        "type": "object",
        "properties": {
          "accessToken": { "type": "string" }
        },
        "required": ["accessToken"]
      }
    },
    "required": ["loginInput", "loginResponse"],
    "additionalProperties": false
  }
]
```
This format is ideal for schema registration in tools like `Fastify`, which can register an array of JSON Schemas for validation or `OpenAPI` generation.  
`$ref` - A helper function for referencing individual models in the schema using their key:
```ts
$ref('loginBody') // => { $ref: 'auth#/properties/loginBody' }
```

## Fastify Integration example
1 - declare schemas (auth/schemas.ts)
```ts
import z from "zod";
import { buildJsonSchemas } from "zod-build-json-schemas";

const loginBody = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8),
});
const loginResponse = z.object({
  accessToken: z.string(),
});

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    loginBody,
    loginResponse
  },
  {
    $id: 'auth',
  }
);

// types
export type LoginBody = z.infer<typeof loginBody>;
```
2 - register schemas (auth/index.ts)
```ts
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import authRoutes from './routes';
import { authSchemas } from './schemas';

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  for (let schema of authSchemas) {
    fastify.addSchema(schema);
  }

  await fastify.register(authRoutes);
});
```
3 - reference schemas in routes (auth/routes.ts)
```ts
import { FastifyInstance } from 'fastify';
import { $ref } from './schemas';

export default async (fastify: FastifyInstance) => {
  fastify.post(
    '/login',
    {
      schema: {
        body: $ref('loginBody'),
        response: {
          200: $ref('loginResponse'),
        },
      },
    },
    () => {}
  ); // ✔️
};
```
4 (optional) - register @fastify/swagger & @fastify/swagger-ui plugins
```ts
import fastifyPlugin from "fastify-plugin";
import { FastifyInstance } from "fastify";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifySwagger, {
      mode: 'dynamic',
      openapi: {
        openapi: '3.1.0',
        info: {
          title: 'API',
          description: 'Description',
          version: '0.0.0',
        }
      },
    });

    await fastify.register(fastifySwaggerUI, {
      routePrefix: '/api/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
    });
  })
```

## Configuration
`buildJsonSchemas` accept options object as second paramenter, it supports all the options from [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema), except:  
* It overrides `basePath`, you cannot specify it  
* Default for `$refStrategy` is 'none' | reason: better integration with [openapi-typescript](https://github.com/openapi-ts/openapi-typescript)
### Override default options
1 - Create `buildJsonSchemas` function using `createBuildJsonSchemas` utility & pass in the overrides
```ts
import { createBuildJsonSchemas } from "zod-build-json-schemas";

const buildJsonSchemas = createBuildJsonSchemas({ $refStrategy: 'root' })

export default buildJsonSchemas;
```
2 - Use it
```ts
import buildJsonSchemas from "~/utils/buildJsonSchemas";
```
## License
MIT License Copyright (c) Zapotinschii Augustin
