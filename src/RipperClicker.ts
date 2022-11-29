import {
  BrowserLaunchArgumentOptions,
  LaunchOptions,
  BrowserConnectOptions,
  Page,
  Browser,
} from 'puppeteer'

import puppeteer from 'puppeteer-extra'
import { userAgent } from './config'
import { sleep } from './utils'

const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const sp = StealthPlugin()

sp.enabledEvasions.delete('user-agent')
puppeteer.use(sp)

class RipperClicker {
  private puppeteerOptions: BrowserLaunchArgumentOptions &
    LaunchOptions &
    BrowserConnectOptions

  constructor(
    puppeteerOptions: BrowserLaunchArgumentOptions &
      LaunchOptions &
      BrowserConnectOptions
  ) {
    this.puppeteerOptions = puppeteerOptions
  }

  public launch = async (url: string) => {
    const browser = await puppeteer.launch(this.puppeteerOptions)
    const page = (await browser.pages())[0]

    await page.setUserAgent(userAgent)

    await page.goto(url)

    return { page, browser }
  }

  public close = async (browser: Browser) => {
    const pages = await browser.pages()

    await browser.newPage()

    for (const page of pages) {
      await page.close()
    }

    await sleep(1000)

    await browser.close()
  }

  public work = async (page: Page) => {
    while (true) {
      await sleep(5000)

      const showRewardAdButton = await page.$('button[id="showRewardAdButton"]')

      if (!showRewardAdButton) throw new Error('No showRewardAdButton')

      await showRewardAdButton.click()

      await sleep(3000)
      while (true) {
        const showRewardAdButtonTemp = await page.$(
          'button[id="showRewardAdButton"]'
        )

        if (!showRewardAdButtonTemp)
          throw new Error('No showRewardAdButtonTemp')

        const text = await page.evaluate(
          (el) => el.textContent,
          showRewardAdButtonTemp
        )

        if (text === 'Start Video') break

        await sleep(1000)
      }
    }
  }
}

export { RipperClicker }
