# Mind History Extension

Browser extension for organise pages.

Main goal of extensions allow easily search and learn new information in WEB.
Extension saves all pages which you open, organise them based on what information you was try to find\learn and close old pages.
Extension allow for people, like I, which allways have thouthands open pages, organaise and not lose information, and of course not lose time to search this information again.

## Project stage

Project currently in POC stage,
which mean I only trying understand is it possible to receive all requirement data and control opened pages thought browser API.

## Development

### Requirements

* Docker - for in-Docker development enviroment. For not support and fix bugs on different OS and NodeJs use docker for development inside container.
* NodeJS >= 14 - if you not want use Docker
* Make - autmation tool

### First start guide

1. Run `make` for setup Docker enviroment.
2. Run `yarn` to install the dependencies.
3. Run `yarn start`
4. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `dist` folder.
5. Happy hacking.

#### Without Docker

If you not want use Docker, just make sure you have NodeJS on required version and start guide from second step.

### Content Scripts

Although this boilerplate uses the webpack dev server, it's also prepared to write all your bundles files on the disk at every code change, so you can point, on your extension manifest, to your bundles that you want to use as [content scripts](https://developer.chrome.com/extensions/content_scripts), but you need to exclude these entry points from hot reloading [(why?)](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate/issues/4#issuecomment-261788690). To do so you need to expose which entry points are content scripts on the `webpack.config.js` using the `chromeExtensionBoilerplate -> notHotReload` config. Look the example below.

Let's say that you want use the `myContentScript` entry point as content script, so on your `webpack.config.js` you will configure the entry point and exclude it from hot reloading, like this:

```js
{
  …
  entry: {
    myContentScript: "./src/js/myContentScript.js"
  },
  chromeExtensionBoilerplate: {
    notHotReload: ["myContentScript"]
  }
  …
}
```

and on your `src/manifest.json`:

```json
{
  "content_scripts": [
    {
      "matches": ["https://www.google.com/*"],
      "js": ["myContentScript.bundle.js"]
    }
  ]
}
```

### Commits

Project using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
If you not know how to commit run

```bash
yarn commit
```

## Production build

For build and pack production verions just run

```bash
npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

## Thanks

This project based on [boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
