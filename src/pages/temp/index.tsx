import { useState } from 'react';

import { Button } from 'components/button/Button';
import { Container } from 'components/container/Container';
import { Bleed } from 'components/examples/bleed/Bleed';
import { Card } from 'components/examples/card/Card';
import { Grid } from 'components/grid/Grid';
import { GridLayout, GridLayoutItem } from 'components/grid/GridLayout';
import { H1, H2, H3 } from 'components/heading/Heading';
import { Link } from 'components/link/Link';
import { Modal } from 'components/modal/Modal';
import { Picture } from 'components/picture/Picture';
import { RichTextStatic } from 'components/rich-text/RichTextStatic';
import { Section } from 'components/section/Section';
import { Video } from 'components/video/Video';
import { Meta } from 'containers/meta/Meta';

import { logger } from 'utils/logger';

import breakpoints from 'styles/breakpoints.module.scss';

export default function StarterHome() {
  const [modalActive, setModalActive] = useState(false);

  return (
    <>
      <Meta title="Next-js starter" />

      <Section container>
        <H1>Next-js / prismic starter v1.0.0</H1>

        <RichTextStatic>
          <p>
            This starter-kit contains bootstrapping (S)CSS and some commonly-used React
            component patterns and functionality:
          </p>
        </RichTextStatic>
      </Section>

      <Section>
        <GridLayout debug>
          <GridLayoutItem columns={{ wide: 10 }} offset={{ wide: 1 }}>
            <H2>
              Positioning items using <code>&lt;GridLayout&gt;</code> components
            </H2>
            <RichTextStatic style={{ marginBottom: '2em' }}>
              <p>
                For generic layout. The example below shows elements positioned along a
                along a grid using <code>&lt;GridLayout&gt;</code>(the parent) &{' '}
                <code>&lt;GridLayoutItem&gt;</code> components, the aim being to cut down
                the amount of css comparent to using the <code>@grid</code> &{' '}
                <code>@grid-item</code> mixins.
              </p>
              <p>
                Should be used as a high-level layout component similar to{' '}
                <code>&lt;Section&gt;</code> and <code>&lt;Container&gt;</code>, but in
                conjunction with a module <code>classname</code> for any additional non
                grid-related styles.
              </p>
            </RichTextStatic>
          </GridLayoutItem>
          <GridLayoutItem columns={{ desktop: 4 }} offset={{ wide: 1 }}>
            desktop: 4 columns, offset by 1 in wide breakpoint
          </GridLayoutItem>
          <GridLayoutItem
            columns={{ tablet: 9, desktop: 5, wide: 4 }}
            offset={{ tablet: 2, desktop: 0 }}
          >
            tablet 9, desktop 5, wide 4, reset offset in desktop
          </GridLayoutItem>
          <GridLayoutItem
            columns={{ mobile: 6, desktop: 3, wide: 2 }}
            offset={{ tablet: 1, desktop: 0 }}
          >
            small one!
          </GridLayoutItem>
          <GridLayoutItem
            columns={{ tablet: 4, desktop: 10 }}
            offset={{ wide: 1, desktop: 2 }}
          >
            tablet 4, desktop 10, offset 2 desktop, 1 wide
          </GridLayoutItem>
        </GridLayout>
      </Section>

      <Section>
        <Container>
          <H2>Card grid</H2>
          <RichTextStatic style={{ marginBottom: '2em' }}>
            <p>
              uses a <code>&lt;Grid&gt;</code> component to generate an equal-column grid.
              We're using css variables to pass in column values now. There should be no
              nesting of these components so this is "safe"
            </p>
          </RichTextStatic>
        </Container>

        <Grid as="ul" columns={{ wide: 4, desktop: 3, tablet: 2 }}>
          <Card link="/" title="Link somewhere" date="today">
            How form elements work with some basic generic styles from global.scss. More
            info?: Praesent at diam in mauris porttitor maximus. Aliquam at efficitur est,
            ut mollis turpis.
          </Card>
          <Card title={<span>HTML elements</span>} date="today">
            Here is a &ldquo;kitchen sink&rdquo; html elements page
          </Card>
          <Card title={<Link to="/temp/elements">Third card</Link>}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit
            tincidunt ex vehicula rhoncus. Cras pharetra sapien eget tellus condimentum,
            in auctor lorem varius. Praesent at diam in mauris porttitor maximus. Aliquam
            at efficitur est, ut mollis turpis. Quisque id orci a urna. Aenean sapien
            tortor, auctor ut finibus quis, varius eget risus
          </Card>
          <Card title={<Link to="/">4th card</Link>} date="meh">
            Aliquam at efficitur est, ut mollis turpis. Quisque id orci at turpis dictum
            tincidunt. Maecenas interdum rutrum eleifend. Nunc at pretium urna. Aenean
            sapien tortor, auctor ut finibus quis, varius eget risus
          </Card>
        </Grid>
      </Section>

      <Section>
        <Container>
          <H3 as="h2">Buttons</H3>
        </Container>

        <Grid columns={{ desktop: 4, wide: 6 }}>
          <Button onClick={() => logger.info('onClick event')}>default button</Button>
          <Button disabled to="#test" aria-busy="true">
            a disabled button
          </Button>
          <Button to="/temp/elements">internal link</Button>
          <Button to="/" tabIndex={0} transition={false}>
            no page transition
          </Button>
          <Button to="https://hugsmidjan.is">external link</Button>
        </Grid>
      </Section>

      <Section container>
        <H3 as="h2">
          <code>&lt;Picture&gt;</code> component
        </H3>
        <Picture
          src="/images/temp/sunset.webp"
          alt="picture of a sunset"
          width={1200}
          height={900}
          imagePosition={{ y: 20, x: 0 }}
          sizes={`(max-width: ${breakpoints.maxDesktop}) 90vw, 1200px`}
        />
      </Section>

      <Section>
        <Container>
          <H3 as="h2">Bleeding outside grid</H3>
        </Container>

        <Bleed />
      </Section>

      <Section container>
        <H3 as="h2">
          <code>&lt;Video&gt;</code> component
        </H3>
        <RichTextStatic>
          <p style={{ marginBottom: '2rem' }}>
            video component with options <code>loop</code>, <code>autoplay</code> and{' '}
            <code>addLayout</code>
          </p>
        </RichTextStatic>
        <Video
          addLayout
          autoplay
          loop
          src="/videos/temp/temp.mp4"
          width={960}
          height={540}
          poster="/videos/temp/poster.jpg"
        />
        <RichTextStatic>
          <p style={{ margin: '2rem 0' }}>
            video with no options, constrained by parent layout (default){' '}
            <code>addLayout=false</code>
          </p>
        </RichTextStatic>
        <div
          style={{ position: 'relative', width: 'min(100%, 700px)', height: '50vmin' }}
        >
          <Video src="/videos/temp/temp.mp4" width={960} height={540} />
        </div>
      </Section>

      <Section container>
        <H2>
          <code>&lt;Modal&gt;</code> component
        </H2>

        <Button onClick={() => setModalActive(true)}>Show modal</Button>

        <Modal active={modalActive} onClose={() => setModalActive(false)}>
          <RichTextStatic style={{ padding: 30 }}>
            <p>
              Nulla cursus libero eget tincidunt pretium. Maecenas sit amet convallis
              risus. Duis risus dui, commodo id scelerisque nec, vehicula eget tortor.
              Donec quis magna in lacus aliquam maximus. Proin porttitor placerat nunc,
              sit amet viverra purus euismod vitae. Nam a tellus porta purus aliquam
              pharetra vitae id ex
            </p>
          </RichTextStatic>
        </Modal>
      </Section>
    </>
  );
}
