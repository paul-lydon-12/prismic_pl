import s from './Footer.module.scss';

type FooterProps = { children?: React.ReactNode };

export const Footer = ({ children }: FooterProps) => {
  return <footer className={s.footer}>{children}</footer>;
};
