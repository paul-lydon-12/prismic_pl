import { H2 } from 'components/heading/Heading';
import { Link } from 'components/link/Link';

import { HTMLElementList } from 'types/html-types';

import s from './Card.module.scss';

type CardProps = {
  title: string | React.ReactElement;
  as?: HTMLElementList;
  link?: string;
  date?: string;
  children: React.ReactNode;
};

// styled with subgrid to align content
export const Card = ({ title, date, link, children, as }: CardProps) => {
  const Wrapper = as ?? 'li';

  return (
    <Wrapper className={s.card}>
      <H2 as="h3" className={s.card__title}>
        {link ? <Link to={link}>{title}</Link> : title}
      </H2>
      {children}
      {date && <div className={s.card__date}>{date}</div>}
    </Wrapper>
  );
};
