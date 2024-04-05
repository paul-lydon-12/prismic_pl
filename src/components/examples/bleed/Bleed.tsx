import { GridLayout, GridLayoutItem } from 'components/grid/GridLayout';
import { RichTextStatic } from 'components/rich-text/RichTextStatic';

import s from './Bleed.module.scss';

export const Bleed = () => {
  return (
    <GridLayout className={s.bleed}>
      <GridLayoutItem className={s.bleed__bleedWrap} columns={{ wide: 8 }}>
        <div className={s.bleed__bleedWidth}>
          <RichTextStatic>
            <p>
              this item bleeds outside the grid item parent, (optionally) back to the left
              using <code>direction</code> property.
            </p>
          </RichTextStatic>
        </div>
      </GridLayoutItem>

      <GridLayoutItem className={s.bleed__containerMargin}>
        <RichTextStatic>
          <p>
            This just bleeds outside the grid container. Uses{' '}
            <code>var(--viewport-container-gutter)</code> to offset outside the container.
            No parent hack needed
          </p>
        </RichTextStatic>
      </GridLayoutItem>
    </GridLayout>
  );
};
