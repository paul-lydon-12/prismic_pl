import classNames from 'classnames/bind';

import { Container } from 'components/container/Container';

import { HTMLElementList } from 'types/html-types';

import s from './Section.module.scss';

const c = classNames.bind(s);

type SectionProps = {
  children: React.ReactNode;
  container?: boolean;
  as?: HTMLElementList;
  className?: string;
};

export const Section = ({
  children,
  container,
  as = 'section',
  className,
}: SectionProps) => {
  const SectionEl = as;
  const content = container ? <Container>{children}</Container> : children;

  return <SectionEl className={c(s.section, className)}>{content}</SectionEl>;
};
