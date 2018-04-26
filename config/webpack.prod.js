const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common');
const helper = require('./helper');

module.exports = merge(common, {
    mode:'production',    
    plugins: [
        new UglifyJsPlugin(),
    ],
    output:{
        path:helper.root('dist'),
        publicPath:'/',
        filename:'[name].js'
    },
});