// Prismic uses OEmbed, with some custom additions
// https://oembed.com/#section2

export type Oembed = {
  type: string;
  version: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  cache_age?: string | null;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  embed_url?: string;
};

export type OembedPhoto = {
  url: string;
  width: number | string;
  height: number | string;
} & Oembed;

export type OembedVideo = {
  html: string;
  width: number | string;
  height: number | string;
} & Oembed;

export type OembedRich = {
  html: string;
  width: number | string;
  height: number | string;
} & Oembed;

export type PrismicVideoEmbedProps = {
  embed_url?: string;
} & OembedRich;

export type PrismicVimeoVideoEmbed = {
  is_plus?: string;
  account_type?: string;
  duration?: number;
  description?: string;
  thumbnail_url_with_play_button?: string;
  upload_date?: string;
  video_id?: string;
  uri?: string;
} & PrismicVideoEmbed;

export type PrismicVideoEmbed = PrismicVideoEmbedProps | null;
