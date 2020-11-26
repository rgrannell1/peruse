import docopt from 'docopt';
import peruse from './peruse.js';
import constants from './constants.js';
const docs = `
Name:
  peruse - scroll and cycle through pages

Usage:
  peruse --links <path> [--rate <px> | --fast | --medium | --slow] [--executable <executable>]

Description:
  peruse automated the scrolling down through dashboards, tabbing between pages, and starting over task so commonly required
  in operations work.

Options:
  --links <path>               The path to the file containing line-delimited URLs to visit. If executable, the file will first be run and
                                 stdout will be used as a list of links.
  --executable <executable>    Optional. If specified, use the specified Chrome / Chromium instance instead of
                                 the default version bundled with this package.
  --rate <px>                  Optional. The number of pixels to scroll per second.
  --slow                       Optional. Sets pixels / second to ${constants.rates.slow}
  --medium                     Optional. Sets pixels / second to ${constants.rates.medium}
  --fast                       Optional. Sets pixels / second to ${constants.rates.fast}
`;
const cli = async () => {
    const args = docopt.docopt(docs, {});
    await peruse(args);
};
cli();
