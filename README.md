# Mind History Extension

Browser extension for organise pages.

## Idea

I (and hope many others) allways have dozens open pages while searching some info or learnign something new in Web.

And most of time all of this pages need, but not now.
But when I remember, some page which I was found have info which need right now I cannot find it, because I already closed it.

For easier search in already opened pages or pages which I was opened in past I created this extension.

## Development

### Requirements

* Docker - for in-Docker development enviroment. For not support and fix bugs on different OS and NodeJs use docker for development inside container.
* NodeJS >= 14 - if you not want use Docker
* Make - autmation tool

### First start guide

1. Run `make` for setup Docker enviroment.
2. Run `npm install` to install the dependencies.
3. Run `npm start`
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

## Production build

For build and pack production verions just run

```bash
npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

## Thanks

This project based on [boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
