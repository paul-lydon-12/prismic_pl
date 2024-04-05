// global components
import { H1 } from 'components/heading/Heading';
import { Link } from 'components/link/Link';
import { Picture } from 'components/picture/Picture';
import { RichTextImage } from 'components/rich-text/RichTextImage';
import { RichTextStatic } from 'components/rich-text/RichTextStatic';
import { Section } from 'components/section/Section';
import { Meta } from 'containers/meta/Meta';

export default function ElementsPage() {
  return (
    <>
      <Meta title="Next-js starter: elements page" />

      <Section container>
        <H1>Html elements</H1>
        <RichTextStatic>
          <p>
            HTML defaults, set by the <code>&lt;RichText&gt;</code> or{' '}
            <code>&lt;RichTextStatic&gt;</code> components.
          </p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>
              Item 3
              <ul>
                <li>Item 3a</li>
                <li>Item 3b</li>
                <li>Item 3c</li>
              </ul>
            </li>
          </ul>

          <ol>
            <li>Nec aetas sacri nescius</li>
            <li>Nostro et in iustius exturbare tumefecit inque</li>
            <li>
              Condidit et ista
              <ol>
                <li>Step 3.1</li>
                <li>Step 3.2</li>
                <li>Step 3.3</li>
              </ol>
            </li>
            <li>Ascac</li>
            <li>Ascac (again)</li>
          </ol>

          <h3>Rapidum vaticinos neque de undas versus cognoscenda</h3>
          <p>
            Armentis formosus ut domos, usquam meus munus ego supera passim et? Temptanda
            ne auris succidere quaeque visura. Teneas avem! Vidit nunc non revocantis
            vultum.
          </p>
          <h4>Utque inmissa arsuro duplici icta timetque fertque</h4>

          <RichTextImage
            width={1200}
            height={900}
            caption="This is a RichText image for when images are added to a content block"
          >
            <Picture src="/images/temp/sunset.webp" width={1200} height={900} />
          </RichTextImage>
          <p>
            Oculos subito, locutum,{' '}
            <Link to="https://hugsmidjan.is">collaque mentis</Link> ea caesa{' '}
            <strong>Liternum</strong> petiitque <strong>aversata donec</strong>, ratione
            vicinos ignem. A tertia stagnumque concidere et ergo,{' '}
            <Link to="https://hugsmidjan.is/6klst">invita cursu illa</Link> rector; virgo.
            Iuppiter locum: digna nutu repetens, quis nasci summas graia illo, hominis,
            protinus et lucem stellatus.
          </p>
          <h5>Quis nasci summas</h5>
          <p>
            Confinia quoque numina. Adveniens ad sceptra spectans foedantem! Auget vacuas
            Parthaoniae orantem aures. Nato Nostra in cognatumque quoque. Vastum tenet
            tuque quam duabus: incoluit: usus prior, traduxit.
          </p>
          <h6>Quod cum natum opportuna speratque ista</h6>
          <p>
            Lorem markdownum fruges durum Tirynthius redolentia apud, nescit quinque est
            inputat undis. Quod cum natum opportuna speratque ista nexilibus terra,
            externo, modo. In tenus quidve prodis, adgnovitque parum: ultroque dextro
            fronde.
          </p>
          <hr />
          <h2>Nec esset</h2>
          <p>
            Quantus in, in nunc, mihi veterum, totidem! Nec pedum extenuatur fautrix
            Haemonia simplex! <em>Dei tamen egerat</em> non ferit inquit parte, est{' '}
            <em>qualia</em>, timent certa dixerat! Nec at merentem pressit. Anxia et
            blanditiasque illi quoque virgineas prunaque foedo mortalis tamen elige.
          </p>
          <h2>Deforme dixit pura tectis latos uno est</h2>
          <p>
            Confinia quoque numina. Adveniens ad sceptra spectans foedantem! Auget vacuas
            Parthaoniae orantem aures. Nato Nostra in cognatumque quoque. Vastum tenet
            tuque quam duabus: incoluit: usus prior, traduxit.
          </p>
          <p>
            Litora sanguine toto aethera{' '}
            <Link to="https://www.arsenal.com/">mandata manifestaque moenia</Link> laceris
            odoribus Amor tegebant. Precatur plura de quem inplet silvamque meorum Aurora
            arma secabant. Lege et patiuntur cibus.
          </p>
        </RichTextStatic>
      </Section>
    </>
  );
}
