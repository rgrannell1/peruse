import * as fs from 'fs';
import * as path from 'path';
import execa from 'execa';
import signale from 'signale';
import puppeteer from 'puppeteer';
import constants from './constants.js';
/**
 * Read URLs from the provided file-path.
 *
 * @param fpath
 */
const readUrls = async (fpath) => {
    let isExecutable = false;
    try {
        await fs.promises.access(fpath, fs.constants.X_OK);
        isExecutable = true;
    }
    catch (err) { }
    let content;
    if (isExecutable) {
        try {
            const { stdout } = await execa(fpath, []);
            content = stdout;
            signale.success(`successfully ran ${fpath}`);
        }
        catch (err) {
            signale.fatal(`failed to execute "${fpath}"; does it include a shebang and a valid program?\n`);
            process.exit(1);
        }
    }
    else {
        content = await fs.promises.readFile(fpath);
    }
    return content.toString().split('\n');
};
/**
 *
 * @param page
 * @param opts
 *
 */
const scrollPage = async (page, opts) => {
    await page.evaluate(async (opts) => {
        // -- bind shortcuts to control speed.
        const state = {
            px: opts.distance
        };
        const rates = {
            slow: Math.round(100 / (1000 / 25)),
            medium: Math.round(200 / (1000 / 25)),
            fast: Math.round(300 / (1000 / 25))
        };
        window.document.addEventListener("keydown", event => {
            if (event.key === '1') {
                state.px = rates.slow;
            }
            if (event.key === '2') {
                state.px = rates.medium;
            }
            if (event.key === '3') {
                state.px = rates.fast;
            }
            if (event.code === 'Space') {
                state.px = state.px === 0
                    ? rates.slow
                    : 0;
            }
            event.preventDefault();
        });
        // -- scroll.
        await new Promise(resolve => {
            let totalHeight = 0;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, state.px);
                document.title = `${((totalHeight / scrollHeight) * 100).toFixed()}%`;
                totalHeight += state.px;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, opts.frequency);
        });
    }, opts);
};
const stats = {
    pageCount: 0
};
/**
 * Load each provided page, and scroll though them endlessly.
 *
 * @param browser
 * @param urls
 *
 */
const browsePages = async (browser, urls, rate) => {
    let idx = 0;
    while (true) {
        let now = Date.now();
        let focusUrl = urls[idx % urls.length];
        const page = await browser.newPage();
        // -- load the URL
        try {
            await page.goto(focusUrl, {
                timeout: constants.timeouts.default
            });
        }
        catch (err) {
            signale.warn(`failed to load ${focusUrl}, skipping...    ${err.message}`);
            await page.close();
            continue;
        }
        // -- they see me scrollin'...
        try {
            let distance = Math.round(rate / (1000 / 25));
            await scrollPage(page, {
                distance,
                frequency: 25
            });
        }
        catch (err) {
            // -- they hatin'
            if (err.message.includes('Target closed')) {
                signale.success(`peruse exiting (${stats.pageCount} pages visited)`);
                process.exit(0);
            }
            else {
                signale.warn(`an error occured while scrolling through "${focusUrl}":\n${err.message}`);
            }
        }
        finally {
            await page.close();
        }
        // -- to stop excessively fast looping
        if (Date.now() - now < 3000) {
            await new Promise(resolve => {
                setTimeout(resolve, 3000);
            });
        }
        stats.pageCount++;
        idx++;
    }
};
process.on('SIGINT', () => {
    signale.success(`peruse exiting (${stats.pageCount} pages visited)`);
    process.exit(0);
});
/**
 * Determine the number of pixels to scroll per second.
 *
 * @param args CLI arguments
 */
const getPixelTarget = (args) => {
    if (args['--fast']) {
        return constants.rates.fast;
    }
    if (args['--medium']) {
        return constants.rates.medium;
    }
    if (args['--slow']) {
        return constants.rates.slow;
    }
    if (args['--rate']) {
        const provided = parseInt(args['--rate'].replace('px', '').trim());
        return Number.isNaN(provided)
            ? provided
            : constants.rates.medium;
    }
    return constants.rates.medium;
};
/**
 * Validate and parse arguments provided to peruse.
 *
 * @param args
 */
const validateArguments = async (args) => {
    return {
        path: args['--links'],
        px: getPixelTarget(args),
        executable: args['<executable>']
    };
};
/**
 * The main function. Runs the peruse app.
 *
 * @param rawArgs
 */
const peruse = async (rawArgs) => {
    const args = await validateArguments(rawArgs);
    const fpath = path.resolve(args.path);
    const urls = await readUrls(fpath);
    let browser;
    try {
        browser = await puppeteer.launch({
            timeout: constants.timeouts.default,
            headless: false,
            defaultViewport: null
        });
    }
    catch (err) {
        if (typeof args.executable !== 'undefined') {
            signale.fatal(`Browser "${args.executable}" failed to launch!\n${err.message}`);
        }
        else {
            signale.fatal(`Browser failed to launch!\n${err.message}`);
        }
        process.exit(1);
    }
    await browsePages(browser, urls, args.px);
};
export default peruse;
