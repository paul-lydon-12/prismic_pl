import classnames from 'classnames/bind';

import { Link } from 'components/link/Link';

import s from './Button.module.scss';

const c = classnames.bind(s);

type ButtonDefaults = {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  transition?: boolean;
};

type ButtonLinkProps = {
  to?: string;
  onClick?: never;
  transition?: boolean;
} & ButtonDefaults &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonButtonProps = {
  to?: never;
  onClick?: () => void;
  transition?: never;
} & ButtonDefaults &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

// either a link or a button but dont mix!
export type ButtonProps = ButtonButtonProps | ButtonLinkProps;

export const Button = ({
  to,
  children,
  className,
  disabled,
  transition,
  ...props
}: ButtonProps) => {
  const classNames = c(className, s.button, { disabled });

  if (to) {
    return (
      <Link
        to={to}
        transition={transition}
        className={classNames}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      aria-disabled={disabled}
      className={classNames}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};
