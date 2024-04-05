import { _Linkable, Meta } from 'prismic-types';

export type PrismicLink = _Linkable | null;

// Expose the meta __typename field to Prismic__Linkable so we can figure out
// what's implementing the interface
export type _LinkableWithType = _Linkable & {
  __typename?: string;
};

export type PrismicLinkWithMeta = _LinkableWithType & {
  _meta?: Meta;
};
