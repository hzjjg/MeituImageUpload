const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const helper = require('./helper');
module.exports = merge(common, {
    mode:'development',
    devtool: 'inline-source-map',
    output:{
        path:helper.root('dist'),
        publicPath:'/',
        filename:'[name].js'
    },
    devServer: {
        port:8099,
        hot:true,
        contentBase: './dist'
    },
})