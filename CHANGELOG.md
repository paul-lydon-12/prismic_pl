# Changelog

## v1.0.0

### Added:

- **New** `<GridLayout>` and `<GridLayoutItem>` layout components, reducing
  usage of the `@grid` and `@grid-item` mixins to shrink css bundle.
- **New** `<Modal>` component
- **New** `<Video>` component for autoplaying in viewport or
  manually-controlled playback.
- **New** `useInterval()` and `useTimeout()` hooks
- `<Picture>` & `<PrismicPicture>` components add positioning value props, css
  custom properties (variables) usage via `styles/utils @media-position` mixin
- `@section` mixin now responds vertically as well has horizontally

### Refactored:

- Prismic pages default under `pages/prismic` directory.
- More consistent structure for Hooks (todo: review? add as separate package?)
- better loading screen logic. `<PageTransition>` and `<Loading>` components
  logic together, with separate `<LoadingIndicator>` component for reuse in
  other possible loading states
- Cleanup of `UIState` default values, add `useUiState` hook.
- Default usage of `<CSSTransition>` for the nav
- Removed style-opinionated `MediaBlock` component

### Fixed:

- `DevTools` toggling & hydration warnings
- `useKeyDown` hook no longer causing multiple rerenders
- `@grid-item` non longer requires subsequent offset items on the same row to
  have `offset` explicity defined.
- App will build without Prismic environment vars (todo: review / improve
  this)
- `Button` & `Link` removed generic `[key]:value` spread props
- Dark mode scss variables disabled by default

## v0.2.0

_No changelog for this release._
