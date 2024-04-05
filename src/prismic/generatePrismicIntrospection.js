/**
 * Queries Prismic REST API for the master ref, then queries the
 * GraphQL API to get the full schema.
 * This is then used by `graphql-codegen` to create ts types.
 * See readme.
 */

require('dotenv').config();

const fs = require('fs');
const util = require('util');
const fetch = require('node-fetch');

const writeFileAsync = util.promisify(fs.writeFile);

const { PRISMIC_REST_URL: prismicRestUrl, PRISMIC_GRAPHQL_URL: prismicGraphQlUrl } =
  process.env;

if (!prismicRestUrl || !prismicGraphQlUrl) {
  console.error('Missing env, see readme');
  process.exit(1);
}

/* Copied from query graphiql makes to get schema */
const query = `
query IntrospectionQuery {
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      ...FullType
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type { ...TypeRef }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
`;

async function getMasterRef() {
  const response = await fetch(prismicRestUrl);

  if (!response.ok) {
    console.error('Response from REST API not OK');
    console.info(await response.text());
    process.exit(1);
  }

  const data = await response.json();

  const masterRef = (data.refs || []).find((response) => response.id === 'master');

  if (!masterRef) {
    return null;
  }

  return masterRef.ref;
}

async function fetchAndWriteIntrospectionFile() {
  const masterRef = await getMasterRef();

  if (!masterRef) {
    console.error('Unable to get master ref');
    process.exit(1);
  }

  const queryWithoutWhitespaces = query.replace(/\s+/g, ' ');
  const response = await fetch(`${prismicGraphQlUrl}?query=${queryWithoutWhitespaces}`, {
    headers: {
      'prismic-ref': masterRef,
    },
  });

  if (!response.ok) {
    console.error('Response from GraphQL not OK');
    console.info(await response.text());
    process.exit(1);
  }

  const json = await response.json();

  await writeFileAsync('./graphql.schema.json', JSON.stringify(json));
}

fetchAndWriteIntrospectionFile().catch((e) => console.error(e));
