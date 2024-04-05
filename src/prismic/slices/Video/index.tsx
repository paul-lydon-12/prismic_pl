import { ArticleSlicesVideo, PageSlicesVideo } from 'prismic-types';

import { PrismicImage } from 'prismic/types/image';
import { PrismicRichText } from 'prismic/types/richtext';
import { PrismicVideoEmbed, PrismicVimeoVideoEmbed } from 'prismic/types/video';

import { H2 } from 'components/heading/Heading';
import { asText, RichText } from 'components/rich-text/RichText';

import { getSource } from 'utils/videoService';

type Props = {
  video: PrismicVideoEmbed;
  title?: PrismicRichText;
  caption?: PrismicRichText;
  poster?: PrismicImage;
};

function getWidthHeight(video: PrismicVideoEmbed) {
  const width = parseInt(video?.width.toString() ?? '0', 10);
  const height = parseInt(video?.height.toString() ?? '0', 10);

  return { width, height };
}

export default function VideoSlice({ video, title, caption }: Props) {
  if (!video) {
    return null;
  }

  const { width, height } = getWidthHeight(video);

  const provider = video.provider_name ?? null;
  const embedUrl = video.embed_url ?? null;
  const id = parseInt((video as PrismicVimeoVideoEmbed).video_id ?? '0', 10);

  if (!provider || !embedUrl) {
    return null;
  }

  const src = getSource(provider, id, embedUrl);

  if (!src) {
    return null;
  }

  return (
    <>
      {title && <H2>{asText(title)}</H2>}
      <iframe src={src} width={width} height={height} />
      {caption && <RichText>{caption}</RichText>}
    </>
  );
}

export function prismicSliceToVideoSlice(s: PageSlicesVideo | ArticleSlicesVideo) {
  return (
    <VideoSlice
      video={(s.variation?.primary?.video ?? null) as PrismicVideoEmbed}
      title={(s.variation?.primary?.title ?? null) as PrismicRichText}
      caption={(s.variation?.primary?.caption ?? null) as PrismicRichText}
      poster={(s.variation?.primary?.poster ?? null) as PrismicImage}
    />
  );
}
