import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixture, options={}) => {
    const compiler = webpack({
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js',
        },
        stats: "normal",
        module: {
            rules: [{
                test: /\.js$/,
                use: {
                    loader: path.resolve(__dirname, '../src/loader.js'),
                    options: options
                }
            }]
        }
    });

    compiler.outputFileSystem = new memoryfs();

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                if (stats.compilation.errors.length > 0) reject(stats.compilation.errors);
                reject(err);
            }
            resolve(stats);
        });
    });
};