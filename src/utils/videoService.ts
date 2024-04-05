/**
 * Name of the provider, either YouTube or Vimeo.
 * These exactly match the `provider_name` from OEmbeds in Prismic.
 * @see ./src/prismic/types/video.ts
 */
export type VideoServiceProvider = 'YouTube' | 'Vimeo';

export type VideoServiceLink = {
  type: VideoServiceProvider;
  id: string;
};

/**
 * Parse a potential video from YouTube or Vimeo from a URL.
 * Supported YouTube URL formats:
 *   - Video links: https://www.youtube.com/watch?v=My2FRPA3Gf8
 *   - Short links: https://youtu.be/My2FRPA3Gf8
 *   - Embed links: https://www.youtube.com/embed/My2FRPA3Gf8
 * Supported Vimeo URL formats:
 *   - https://vimeo.com/25451551
 *   - https://player.vimeo.com/video/25451551
 *   - https://vimeo.com/event/3370756/028c6b945d
 * Also supports relative URLs:
 *  - //www.youtube.com/watch?v=My2FRPA3Gf8
 *  - //player.vimeo.com/video/25451551
 *
 * @param url URL to try and parse video service data from
 * @returns VideoServiceProvider and video id if found, otherwise `null`
 */
export function parse(url?: unknown): VideoServiceLink | null {
  if (typeof url !== 'string') {
    return null;
  }

  const matched = url.match(
    /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/
  );

  if (!matched || matched.length < 7) {
    return null;
  }

  let type: VideoServiceProvider | undefined;

  const potentialProvider = matched[3];

  if (potentialProvider.indexOf('youtu') > -1) {
    type = 'YouTube';
  } else if (potentialProvider.indexOf('vimeo') > -1) {
    type = 'Vimeo';
  }

  if (!type) {
    return null;
  }

  const id = matched[6];

  return {
    type,
    id,
  };
}

/**
 *
 * @param provider Video service provider as string, will be checked against `VideoServiceProvider`
 * @param id Potential id of the video
 * @param embedUrl Potential url for the video
 * @param autoplay Enable autoplay for the video
 * @param lang Two letter lang code for player ui (youtube only)
 * @returns URL that can be embedded
 */
export function getSource(
  provider: string,
  id?: number,
  embedUrl?: string,
  autoplay?: boolean,
  lang = 'en'
) {
  if (provider === 'Vimeo') {
    const vimeoParams = `autoplay=${
      autoplay ? 1 : 0
    }&title=0&byline=0&portrait=0&quality=720p&dnt=1`;

    if (embedUrl && /\/event/.test(embedUrl)) {
      const eventIds = embedUrl.replace('https://vimeo.com/event/', '').split('/');
      return `https://vimeo.com/event/${eventIds[0]}/embed/${eventIds[1]}?${vimeoParams}`;
    }

    return `https://player.vimeo.com/video/${id}?${vimeoParams}`;
  }

  if (provider === 'YouTube' && embedUrl) {
    const parsed = parse(embedUrl);
    const ytParams = `&autoplay=${autoplay ? 1 : 0}&hl=${lang}&rel=0`;

    if (parsed) {
      return `https://www.youtube-nocookie.com/embed/${parsed.id}?${ytParams}`;
    }
  }

  return null;
}
