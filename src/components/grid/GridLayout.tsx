// an alternative to using @include grid, @inclide grid-item(foo) mixins
// used to align components within the defined default layout @grid;
import { forwardRef } from 'react';
import classNames from 'classnames/bind';

import { HTMLElementList } from 'types/html-types';
import { UIBreakpoints } from 'types/ui';

import s from './GridLayout.module.scss';

const c = classNames.bind(s);

type GridLayoutProps = {
  as?: HTMLElementList;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  id?: string;
  debug?: boolean;
};

export type GridLayoutItemProps = GridLayoutProps & {
  columns?: UIBreakpoints;
  offset?: UIBreakpoints;
};

export const GridLayout = forwardRef<HTMLDivElement, GridLayoutProps>((props, ref) => {
  const { children, as, className, style, id, debug } = props;

  if (!children) {
    return null;
  }

  const attributes = {
    className: c(s.gridLayout, className, { debug }),
    style,
    id,
  };

  if (ref) {
    return (
      <div ref={ref} {...attributes}>
        {children}
      </div>
    );
  }

  const Wrapper = as ?? 'div';

  return <Wrapper {...attributes}>{children}</Wrapper>;
});

export const GridLayoutItem = forwardRef<HTMLDivElement, GridLayoutItemProps>(
  (props, ref) => {
    const { columns, offset, as, className, children, style, id } = props;

    const classes: Array<string> = [];

    columns &&
      Object.entries(columns).forEach(([k, v]) => {
        const entry = s[`${k}${v}`];
        classes.push(entry);
      });

    offset &&
      Object.entries(offset).forEach(([k, v]) => {
        const entry = s[`${k}Offset${v}`];
        classes.push(entry);
      });

    const attributes = {
      className: c(s.gridLayout__item, className, classes),
      style,
      id,
    };

    // todo: cant use "as" prop if ref is passed to item
    if (ref) {
      return (
        <div ref={ref} {...attributes}>
          {children}
        </div>
      );
    }

    const Wrapper = as ?? 'div';

    return <Wrapper {...attributes}>{children}</Wrapper>;
  }
);
