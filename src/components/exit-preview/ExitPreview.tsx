import { useRouter } from 'next/router';

import s from './ExitPreview.module.scss';

export const ExitPreview = () => {
  const { asPath } = useRouter();
  return (
    <div className={s.exitPreview}>
      Preview mode active.{' '}
      <a
        className={s.exitPreview__button}
        href={`/api/exit-preview${asPath ? `?redirect=${asPath}` : ''}`}
      >
        Exit preview
      </a>
    </div>
  );
};
