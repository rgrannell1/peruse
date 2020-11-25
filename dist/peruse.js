import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
const readUrls = async (fpath) => {
    const content = await fs.promises.readFile(fpath);
    return content.toString().split('\n');
};
const autoScroll = async (page, opts) => {
    await page.evaluate(async (opts) => {
        await new Promise(resolve => {
            let totalHeight = 0;
            let distance = opts.distance;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, opts.frequency);
        });
    }, opts);
};
const browseContent = async (browser, urls) => {
    let idx = 0;
    while (true) {
        let focusUrl = urls[idx % urls.length];
        const page = await browser.newPage();
        await page.goto(focusUrl);
        await autoScroll(page, {
            distance: 5,
            frequency: 50
        });
        await page.close();
        idx++;
    }
};
const peruse = async (args) => {
    const fpath = path.resolve(args['<path>']);
    const urls = await readUrls(fpath);
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });
    await browseContent(browser, urls);
};
export default peruse;
