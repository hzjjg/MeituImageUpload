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
        //for github page
        publicPath:'/MeituImageUpload/dist',
        filename:'[name].[hash:8].js'
    }
});