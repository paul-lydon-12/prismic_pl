import { Section } from 'components/section/Section';

import { logger } from 'utils/logger';

/**
 * Generic prismic slice.
 * Only requirement on a slice is that is potentially has a type.
 */
export type GenericSlice = { type?: string | null };

/** Slice data that is passed along to a slice renderer */
export type SliceData = {
  /** Key for React */
  key: string;

  /** Rendered element */
  element: React.ReactElement | null;

  /** Slice data from prismic */
  data?: unknown;

  /** Slice type from prismic */
  type?: string;
};

/** Potential extra data to pass to slices */
export type SliceExtraData = null;

/**
 * Slice renderer recieves `SliceData` and returns an element or null.
 */
export type SliceRenderer = (slice: SliceData) => React.ReactElement | null;

/**
 * Generic slices record that maps (slice type) => (element or null)
 */
export type SlicesRecord<T extends GenericSlice> = Record<
  string,
  (s: T, key?: string, extraData?: SliceExtraData | null) => React.ReactElement | null
>;

/**
 * Default slice renderer.
 * @param sliceData Data to render
 * @returns Rendered slice element wrapped in a `<Section>`
 */
const defaultRender: SliceRenderer = (sliceData: SliceData): React.ReactElement => {
  return <Section key={sliceData.key}>{sliceData.element}</Section>;
};

/**
 * Map slices from prismic into elements.
 *
 * @example
 * ```typescript
 * // Map of type => slice render
 * const slicesMap: SlicesRecord<SliceTypeFromPrismic> = {
 *   text: (s: SliceTypeFromPrismic) =>
 *     prismicSliceToText(s as SliceTypeFromPrismicText),
 *   image: (s: SliceTypeFromPrismic) =>
 *     prismicSliceToImage(s as SliceTypeFromPrismicImage),
 * };
 *
 * const customRenderer: SliceRenderer = (sliceData: SliceData) => {
 *   console.log(sliceData);
 *   return <div key={sliceData.key}>{sliceData.element}</ChapterItem>;
 * };
 *
 * // Then to render all slices
 *
 * return (
 *   <section>
 *     {mapSlices<SliceTypeFromPrismic>(slicesMap, slices ?? [], customRenderer)}
 *   </section>
 * );
 * ```
 *
 * @param slices Map of the slices we are rendering keyed to the type
 * @param data Slice data from prismic
 * @param renderer Renderer for element based on slice data
 * @returns Array of rendered slices
 */
export function mapSlices<T extends GenericSlice>(
  slices: SlicesRecord<T>,
  data: Array<T>,
  renderer?: SliceRenderer,
  extraData?: SliceExtraData | null
): Array<React.ReactElement> {
  const sliceMapper = (slice: T, index: number) => {
    if (!slice.type) {
      logger.debug('slice has no type', { metadata: { slice } });
      return null;
    }

    const key = `slice-${slice.type}-${index}`;

    if (slice.type && slice.type in slices) {
      const r = renderer ?? defaultRender;
      return r({
        key,
        element: slices[slice.type](slice, key, extraData),
        type: slice.type,
        data: slice,
      });
    }

    logger.info(`unknown slice type ${slice.type}`, {
      metadata: { slice },
    });
    return null;
  };
  return data
    .map(sliceMapper)
    .filter((element: React.ReactElement | null): element is React.ReactElement =>
      Boolean(element)
    );
}
