# WECh Loader
A loader for porting WebExtensions into Chrome Extensions.
WECh is an abbreviation of the words "WebExtensions" and "Chrome".

## Getting Started
To begin, you'll need to install `wech-loader`:

```console
$ npm install wech-loader --save-dev
```

Then add it to your webpack configuration:

*webpack.config.js*

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'wech-loader'
            }
        ]
    }
}
```