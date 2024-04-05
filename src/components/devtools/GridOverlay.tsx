/*
 * Visual grid reference, viewed in dev environment only.
 * overlays content with grid columns / grid container for reference
 */

import s from './GridOverlay.module.scss';

export const GridOverlay = () => {
  return (
    <div className={s.grid}>
      <div className={s.grid__container}>
        <div className={s.grid__visual} />
      </div>
    </div>
  );
};
