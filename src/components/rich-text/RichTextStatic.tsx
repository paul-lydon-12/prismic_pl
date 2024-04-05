/* wrapper component to pass to some non-reset styles for html elements */

import classNames from 'classnames/bind';

import s from './RichText.module.scss';

const c = classNames.bind(s);

export type RichTextDefaultProps = {
  html?: string;
  className?: string;
  style?: React.CSSProperties;
  addStyles?: boolean;
};

type Props = RichTextDefaultProps & {
  children?: React.ReactNode;
};

export const RichTextStatic = ({
  html,
  children,
  className,
  style,
  addStyles = true,
}: Props) => {
  if (!html && !children) {
    return null;
  }

  const passProps: Props = {};
  passProps.className = addStyles ? c(s.richText, className) : className;
  passProps.style = style;

  // prioritise children
  if (children) {
    return <div {...passProps}>{children}</div>;
  }

  return <div {...passProps} dangerouslySetInnerHTML={{ __html: html ?? '' }} />;
};
