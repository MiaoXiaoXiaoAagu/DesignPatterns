const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    entry:path.resolve(__dirname,'src/index.js') ,
    output:{
        path:path.resolve(__dirname,'release') ,
        filename:'bundle.js'
    },
    module:{
        rules:[{
            test:/\.js?$/,
            exclude: /(node_modules)/,
            loader:'babel-loader'
        }]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ],
    devServer: {
        contentBase:path.join(__dirname,'./release'),
        open:true,//自动打开浏览器
        port:9000
    }
}
