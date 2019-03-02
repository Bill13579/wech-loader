const path = require('path');

module.exports = {
    entry: './src/loader.js',
    mode: 'production',
    target: 'node',
    output: {
        filename: 'loader.js',
        path: path.resolve(__dirname, 'dist')
    }
};
