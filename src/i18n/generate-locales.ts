/* eslint-disable no-console */
/*
  Generates translation files based on english extracted strings
*/
import { writeFile } from 'fs';

import english from './strings/en.json' assert { type: 'json' };
import icelandic from './strings/is.json' assert { type: 'json' };

const locales = {
  is: icelandic,
};

type Translation = { defaultMessage: string; description?: string };
type Locale = {
  [key: string]: Translation;
};

for (const [key, value] of Object.entries(locales)) {
  const compiled: Record<string, Translation> = {};
  Object.keys(english).forEach((key) => {
    const source = (english as Locale)[key];
    const target = (value as Locale)[key];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (target) {
      compiled[key] = {
        defaultMessage: target.defaultMessage,
        description: target.description || source.description,
      };
    } else {
      compiled[key] = {
        defaultMessage: source.defaultMessage,
        description: source.description,
      };
    }
  });

  writeFile(
    `./src/i18n/strings/${key}.json`,
    JSON.stringify(compiled, null, '  '),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`File "${key}.json"  written successfully\n`);
      }
    }
  );
}
