import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import classnames from 'classnames/bind';

import { useUiState } from 'hooks/useUiState';
import { MediaPosition } from 'types/ui';

import s from './Video.module.scss';

const c = classnames.bind(s);

export type VideoProps = {
  src: string;
  poster?: string | null;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  paused?: boolean;
  className?: string;
  videoPosition?: MediaPosition;
  cover?: boolean;
  width?: number;
  height?: number;
  addLayout?: boolean; // set to true if a parent element does not provide aspect-ratio styles
};

export const Video = ({
  src,
  poster,
  autoplay,
  loop,
  muted,
  paused,
  className,
  videoPosition,
  cover = true,
  width,
  height,
  addLayout,
}: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { uiState } = useUiState();

  const [inViewRef, inView] = useInView();
  const [isPlaying, setIsPlaying] = useState(false); // actual play state
  const [hasStarted, setHasStarted] = useState(false); // visual state
  const [canAutoplay, setCanAutoplay] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !autoplay || uiState.prefersReducedMotion) {
      return;
    }

    if (paused || !inView) {
      videoRef.current.pause();
    } else {
      const startPlayPromise = videoRef.current.play();

      startPlayPromise
        .then(() => {
          setCanAutoplay(true);
        })
        .catch(() => setCanAutoplay(false));
    }
  }, [autoplay, inView, paused, uiState.prefersReducedMotion]);

  const handleClick = () => {
    if (!videoRef.current) {
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    if (!loop) {
      setIsPlaying(false);
      setHasStarted(false);
    }
  };

  if (!src) {
    return null;
  }

  let style = {} as React.CSSProperties;

  if (videoPosition) {
    Object.entries(videoPosition).forEach(([k, v]) => {
      const pair = { [`--object-${k}`]: v };
      style = { ...style, ...pair };
    });
  }

  if (addLayout && width && height) {
    const aspectRatio = { '--aspect-ratio': height / width };
    style = { ...style, ...aspectRatio };
  }

  if (poster) {
    style = { ...style, backgroundImage: `url('${poster}')` };
  }

  return (
    <div
      className={c(s.video, className, {
        addLayout,
        cover,
        noPoster: !poster,
        hasStarted,
        isPlaying,
      })}
      ref={inViewRef}
      style={style}
    >
      <video
        className={s.video__media}
        preload="auto"
        muted={autoplay ? true : muted}
        playsInline
        loop={loop}
        ref={videoRef}
        poster={poster ?? undefined}
        // use media fragment force safari iOS to render first frame if no poster
        src={poster ? src : `${src}#t=0.1`}
        onPlaying={() => {
          setIsPlaying(true);
          setHasStarted(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        width={width}
        height={height}
      />
      {(!canAutoplay || !autoplay) && (
        <button className={s.video__button} onClick={handleClick}>
          {isPlaying ? 'pause' : 'play'}
        </button>
      )}
    </div>
  );
};
