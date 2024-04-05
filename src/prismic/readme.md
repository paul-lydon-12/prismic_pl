# Prismic integrations

Collects (almost) all Prismic related logic.

## Getting started

1. Create a prismic repo
2. Create your content types (custom types), you can create `layout` as
   single, `article` as repeatable, `page` as repeatable and paste in the JSON
   definitions in `./masks`
3. Set the prismic API stuff in `.env.example` and `.env`
4. Create one instance of each content type and publish them
5. Run `yarn generate` to create TypeScript types based on the content types
6. Visit pages under `./src/pages/prismic` to test

## After you've started

1. Correctly define `./linkResolver.ts` to handle all content types
2. Setup preview

## Removing prismic

If your project doesn't need prismic, you can remove it:

1. Delete this folder
2. Delete `./src/api/prismic.ts`
3. Delete `./src/pages/prismic` folder
4. Delete `./graphql.schema.json`
5. Remove `generate:*` scripts from `package.json`
6. Remove `@graphql-codegen/*` dependencies
7. Remove `@prismicio/client`
8. Build/lint and fix all errors
