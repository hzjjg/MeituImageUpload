const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helper = require('./helper');

module.export = {
    entry: {
        app:helper.root('src/index.ts')
    },
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve:{
        extensions:['.tsx','.ts','.js']
    },
    output:{
        filename:'[name].bundle.js',
        path:path.resolve(__dirname,'dist')
    }
};