# zod-build-json-schemas

![GitHub Release](https://img.shields.io/github/release/YoungSKC/zod-build-json-schemas.svg) ![License](https://img.shields.io/github/license/YoungSKC/zod-build-json-schemas.svg)

Welcome to **zod-build-json-schemas**! This project serves as a wrapper around `zod-to-json-schema`, simplifying its integration with Fastify and OpenAPI. 

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)
- [Releases](#releases)

## Introduction

In the world of web development, schema validation plays a crucial role in ensuring data integrity. This project leverages the power of Zod and combines it with Fastify and OpenAPI, making it easier for developers to validate and document their APIs. With **zod-build-json-schemas**, you can streamline your workflow and focus on building robust applications.

## Features

- **Easy Integration**: Seamlessly integrates with Fastify for quick setup.
- **OpenAPI Support**: Automatically generates OpenAPI documentation from your schemas.
- **TypeScript Compatibility**: Built with TypeScript, ensuring type safety and better developer experience.
- **Validation**: Utilizes Zod for efficient schema validation.
- **Lightweight**: Minimal overhead, making it suitable for high-performance applications.

## Installation

To get started, you need to install the package. Run the following command in your terminal:

```bash
npm install zod-build-json-schemas
```

Make sure you have Node.js and npm installed on your machine.

## Usage

Using **zod-build-json-schemas** is straightforward. Here’s a simple example to demonstrate its capabilities.

### Basic Example

1. Import the necessary modules:

```javascript
import { buildJsonSchemas } from 'zod-build-json-schemas';
import { z } from 'zod';
```

2. Define your Zod schemas:

```javascript
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});
```

3. Build JSON schemas:

```javascript
const { schemas } = buildJsonSchemas({
  User: UserSchema,
});
```

4. Use the schemas in Fastify:

```javascript
fastify.post('/users', {
  schema: {
    body: schemas.User,
  },
}, async (request, reply) => {
  // Handle user creation
});
```

### Advanced Usage

You can define multiple schemas and use them together. Here’s how:

```javascript
const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().positive(),
});

const { schemas } = buildJsonSchemas({
  User: UserSchema,
  Product: ProductSchema,
});
```

Now you can use both schemas in your Fastify routes, ensuring that your API is well-documented and validated.

## Examples

For more in-depth examples, please refer to the [examples](https://github.com/YoungSKC/zod-build-json-schemas/examples) directory in the repository.

## Contributing

We welcome contributions! If you want to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Create a pull request to the main repository.

Please ensure your code follows the project's coding standards and includes tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/YoungSKC/zod-build-json-schemas/LICENSE) file for details.

## Releases

To view the latest releases and download the package, visit [Releases](https://github.com/YoungSKC/zod-build-json-schemas/releases). Here, you can find the latest versions and their changelogs.

## Conclusion

With **zod-build-json-schemas**, you can enhance your API development process by simplifying schema validation and documentation. We encourage you to explore the project, contribute, and help us improve it further. 

For any questions or issues, feel free to open an issue in the repository or reach out to the maintainers.

Happy coding!