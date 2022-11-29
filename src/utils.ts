import { resolve } from 'path'
import {
  BrowserLaunchArgumentOptions,
  LaunchOptions,
  BrowserConnectOptions,
} from 'puppeteer'
import { platform } from 'os'
import { createInterface } from 'readline'

const rootPath = resolve(__dirname, '..')

const accountsPath = resolve(rootPath, 'accounts')

const getOptions = (accountName: string) => {
  const headlessMode = process.env.NODE_ENV === 'production'

  console.log(accountName)
  console.log('headlessMode', headlessMode)

  const puppeteerOptions: BrowserLaunchArgumentOptions &
    LaunchOptions &
    BrowserConnectOptions = {
    defaultViewport: null,
    headless: headlessMode,
    slowMo: 100,
    userDataDir: resolve(accountsPath, accountName, 'UserData'),
    executablePath:
      platform() === 'win32'
        ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
        : '/usr/bin/google-chrome',

    get args() {
      const puppeteerArgs = [
        '--window-size=1280,1024',
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--mute-audio',
      ]

      return puppeteerArgs
    },
  }

  return puppeteerOptions
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

const quitPrompt = (text: string = 'Wanna quit?', func?: Function) =>
  new Promise<string>((res) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question(text, async (answer) => {
      if (func) await func()

      res(answer)

      rl.close()
    })
  })

export { getOptions, sleep, quitPrompt }
