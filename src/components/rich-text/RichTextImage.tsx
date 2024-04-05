import { cloneElement } from 'react';

import { PictureProps } from 'components/picture/Picture';

import s from './RichTextImage.module.scss';

type Props = {
  width?: number;
  height?: number;
  children: React.ReactElement<PictureProps>;
  caption?: string;
};

export const RichTextImage = ({ children, caption, width, height }: Props) => {
  const ratioWidth = width ?? 16;
  const ratioHeight = height ?? 9;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!children) {
    return null;
  }

  return (
    <div
      className={s.richTextImage}
      style={{ '--w': ratioWidth, '--h': ratioHeight } as React.CSSProperties}
    >
      <div className={s.richTextImage__inner}>
        <figure>
          <div className={s.richTextImage__imageWrap}>
            {cloneElement(children, {
              className: s.richTextImage__image,
            })}
          </div>
          {caption && (
            <figcaption className={s.richTextImage__caption}>{caption}</figcaption>
          )}
        </figure>
      </div>
    </div>
  );
};
