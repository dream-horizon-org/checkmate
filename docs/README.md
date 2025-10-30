# Checkmate docs

The entire documentation of Checkmate resides here. It is powered by [Astro Starlight](https://starlight.astro.build/), and [Tailwind](https://tailwindcss.com/).

This directory is not part of the workspace. To setup, you can simply install the dependencies in this directory:

```bash
cd docs && yarn install
```

To run the development server, you can run:

```bash
yarn dev
```

Any commit made to the `master` branch will automatically deploy.

## API Documentation

The docs site includes comprehensive API documentation:

- **API Overview** - Introduction to the Checkmate REST API
- **Authentication Guide** - Learn how to authenticate using session cookies or API tokens
- **API Reference** - Complete reference for all endpoints with request/response examples
- **Code Examples** - Ready-to-use code snippets in JavaScript, Python, cURL, and more
- **OpenAPI Specification** - Download the OpenAPI 3.0 spec for use with Swagger, Postman, etc.

### Updating API Documentation

The OpenAPI specification (`openapi.yaml`) is automatically copied from the root directory during the build process. To update:

1. Update `/openapi.yaml` in the root directory
2. Run `yarn build` in the docs folder
3. The latest spec will be available at `/openapi.yaml` on the docs site

### API Documentation Structure

```
src/content/docs/guides/api/
├── api.mdx             # Overview and getting started
├── authentication.mdx  # Authentication methods and RBAC
├── reference.mdx       # Complete endpoint reference
├── examples.mdx        # Code examples and use cases
└── openapi.mdx        # OpenAPI spec usage guide
```
