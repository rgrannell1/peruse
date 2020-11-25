
import * as fs from 'fs'
import * as path from 'path'
import puppeteer from 'puppeteer'

interface PeruseArgs {
  '<path>': string
}

const readUrls = async (fpath:string):Promise<string[]> => {
  const content = await fs.promises.readFile(fpath)

  return content.toString().split('\n')
}

interface AutoScollOpts {
  distance: number,
  frequency: number
}

const autoScroll = async (page:puppeteer.Page, opts:AutoScollOpts) => {
  await page.evaluate(async (opts:AutoScollOpts) => {
    await new Promise(resolve => {
      let totalHeight = 0
      let distance = opts.distance

      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance
        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, opts.frequency)
    })
  }, opts as any)
}

const browseContent = async (browser:puppeteer.Browser, urls:string[]) => {
  let idx = 0
  while (true) {
    let focusUrl = urls[idx % urls.length]
    const page = await browser.newPage()
    await page.goto(focusUrl)

    await autoScroll(page, {
      distance: 2,
      frequency: 25
    })

    await page.close()
    idx++
  }
}

const peruse = async (args: PeruseArgs) => {
  const fpath = path.resolve(args['<path>'])

  const urls = await readUrls(fpath)

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  })

  await browseContent(browser, urls)
}

export default peruse
