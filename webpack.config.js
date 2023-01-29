const path = require('path');
//webpack中的所有配置信息全写在module中
const HTMLWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    //指定入口文件
    entry:"./src/index.ts",
    //指定打包文件的目录
    output:{
        //指定打包文件目录
        path:path.resolve(__dirname, 'dist'),
        //打包后的文件
        filename:"bundle.js"
    },
    module:{
        //指定要加载的规则
        rules:[
            {
                //test下指定的是规则生效的文件，使用正则表达式
                test:/\.ts$/,
                //要使用loader
                use:[
                    {
                        loader:"babel-loader",
                        //设置babel
                        options:{
                            //设置预定义环境
                            presets:[
                                 //指定环境的插件
                                 [                              
                                    "@babel/preset-env",
                                    //配置信息
                                    {
                                        targets:{
                                            chrome:"88"
                                        },
                                        //指定corejs版本
                                        "corejs":"3",
                                        //使用corejs的方式"usage",表示按需加载
                                        "useBuiltIns":"usage"
                                    } 
                                 ]

                            ]
                        }
                    },
                    'ts-loader'
                ],
                //要排除的文件
                exclude:/node-modules/
            },
            //设置less文件处理
            {
                test:/\.less$/,
                use:[
                    "style-loader",
                    "css-loader",
                    {
                        loader:"postcss-loader",
                        options:{
                            postcssOptions:{
                                plugins:[
                                    [
                                        "postcss-preset-env",
                                        {
                                            browser:'last 2 versions'
                                        }
                                    ]
                                ]
                            }
                        }
                    },
                    "less-loader"
                ]
            }
        ]
    },
    //配置webpack插件，自动生成html文件
    plugins:[
        new HTMLWebpackPlugin({
            filename:"index.html",
            template:"./src/index.html",
            title:"snake"
        }),
    ],
    mode:'development'
    
}