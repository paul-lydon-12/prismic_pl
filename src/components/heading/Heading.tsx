import classNames from 'classnames/bind';

import { HeadingTags } from 'types/html-types';

import s from './Heading.module.scss';

const c = classNames.bind(s);

type HeadingProps = {
  type?: HeadingTags;
  as?: HeadingTags;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const Heading = ({ type = 'h1', as, children, className, style }: HeadingProps) => {
  if (!children) {
    return null;
  }

  const Wrap = as ?? type;

  return (
    <Wrap className={c(s[type], className)} style={style}>
      {children}
    </Wrap>
  );
};

export const H1 = (props: HeadingProps) => <Heading type="h1" {...props} />;

export const H2 = (props: HeadingProps) => <Heading type="h2" {...props} />;

export const H3 = (props: HeadingProps) => <Heading type="h3" {...props} />;

export const H4 = (props: HeadingProps) => <Heading type="h4" {...props} />;

export const H5 = (props: HeadingProps) => <Heading type="h5" {...props} />;

export const H6 = (props: HeadingProps) => <Heading type="h6" {...props} />;
