import { describe, expect, it } from '@jest/globals';

import { getSource, parse } from './videoService';

describe('videoService', () => {
  it('should parse youtube links', () => {
    expect(parse('https://www.youtube.com/watch?v=My2FRPA3Gf8')).toEqual({
      type: 'YouTube',
      id: 'My2FRPA3Gf8',
    });
    expect(parse('//www.youtube.com/watch?v=My2FRPA3Gf8')).toEqual({
      type: 'YouTube',
      id: 'My2FRPA3Gf8',
    });
    expect(parse('https://youtu.be/My2FRPA3Gf8')).toEqual({
      type: 'YouTube',
      id: 'My2FRPA3Gf8',
    });
    expect(parse('https://www.youtube.com/embed/My2FRPA3Gf8')).toEqual({
      type: 'YouTube',
      id: 'My2FRPA3Gf8',
    });
  });

  it('should not parse almost youtube links', () => {
    expect(parse('https://www.xyoutube.com/watch?v=My2FRPA3Gf8')).toBe(null);
    expect(parse('//www.xyoutube.com/watch?v=My2FRPA3Gf8')).toBe(null);
    expect(parse('https://xyoutu.be/My2FRPA3Gf8')).toBe(null);
    expect(parse('https://www.youtubex.com/watch?v=My2FRPA3Gf8')).toBe(null);
  });

  it('should parse vimeo links', () => {
    expect(parse('https://vimeo.com/25451551')).toEqual({
      type: 'Vimeo',
      id: '25451551',
    });
    expect(parse('https://player.vimeo.com/video/25451551')).toEqual({
      type: 'Vimeo',
      id: '25451551',
    });
  });

  it('should not parse almost vimeo player links', () => {
    expect(parse('https://vimeox.com/25451551')).toBe(null);
    expect(parse('https://player.example.com/video/25451551')).toBe(null);
  });

  it('should return null for invalid input to parse', () => {
    expect(parse(null)).toBe(null);
    expect(parse(undefined)).toBe(null);
    expect(parse(0)).toBe(null);
    expect(parse(1)).toBe(null);
    expect(parse(false)).toBe(null);
    expect(parse('')).toBe(null);
    expect(parse([])).toBe(null);
    expect(parse({})).toBe(null);
    expect(parse()).toBe(null);
  });

  it('should return embeddable url for youtube', () => {
    expect(
      getSource('YouTube', undefined, 'https://www.youtube.com/watch?v=My2FRPA3Gf8')
    ).toBe('https://www.youtube-nocookie.com/embed/My2FRPA3Gf8?&autoplay=0&hl=en&rel=0');
  });

  it('should return embeddable url for vimeo', () => {
    expect(getSource('Vimeo', 123)).toBe(
      'https://player.vimeo.com/video/123?autoplay=0&title=0&byline=0&portrait=0&quality=720p&dnt=1'
    );
  });

  it('should return embeddable url for vimeo events', () => {
    expect(getSource('Vimeo', 123, 'https://vimeo.com/event/1234/1234')).toBe(
      'https://vimeo.com/event/1234/embed/1234?autoplay=0&title=0&byline=0&portrait=0&quality=720p&dnt=1'
    );
  });

  it('should return null for invalid input for getSource', () => {
    expect(getSource('')).toBe(null);
  });
});
