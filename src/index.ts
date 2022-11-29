import { RipperClicker } from './RipperClicker'
import { getOptions, quitPrompt, sleep } from './utils'

const run = async () => {
  const accountName = 'vadim'
  const puppeteerOptions = getOptions(accountName)
  const siteUrl = 'https://ripper.store/clientarea?section=credits_watch_ads'

  const rc = new RipperClicker(puppeteerOptions)
  const { page, browser } = await rc.launch(siteUrl)

  await sleep(1000)

  const url = new URL(page.url())

  if (url.pathname == '/login') {
    await quitPrompt('need manial login')
    await rc.close(browser)
    console.log('Open program again')

    return
  }

  await rc.work(page)
}

run()
