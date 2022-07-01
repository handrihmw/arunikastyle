const path = require('path')
const Dotenv = require('dotenv-webpack')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

let appConf = env => {
  return {
    mode: env.NODE_ENV,
    entry: {
      'app': './resources/scss/app.scss',
      'pages': './resources/scss/pages.scss',
      'bs': './resources/scss/arunika/vendor/bootstrap/index.scss',
      'layout': './resources/scss/arunika/layouts/index.scss',
      'main.lp': './resources/js/main.lp.js'
    },
    output: {
      path: path.resolve(__dirname, 'public/assets'),
      filename: 'js/bundle/main.lp.[contenthash:4].js',
      chunkFilename: 'js/bundle/main.lp.[chunkhash:4].js'
    },
    performance: {
      hints: false
    },
    devtool: process.env.NODE_ENV
      ? 'eval-cheap-module-source-map'
      : 'nosources-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(sc|c)ss$/,
          use: [
            process.env.NODE_ENV ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            {
              loader: 'sass-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          type: 'asset/resource'
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp)$/i,
          type: 'asset/resource',
          use: 'file-loader'
        }
      ]
    },
    optimization: {
      moduleIds: process.env.NODE_ENV ? 'named' : 'deterministic',
      sideEffects: true,
      minimize: process.env.NODE_ENV ? false : true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            format: {
              comments: false
            }
          },
          extractComments: true
        }),
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true }
              }
            ]
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        minChunks: 4,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor.lp',
            chunks: 'all',
          }
        }
      }
    },
    plugins: [
      new Dotenv(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      })
    ]
  }
}

let pagesConf = env => {
  return {
    mode: env.NODE_ENV,
    entry: {
      'about-us': './resources/scss/arunika/pages/_about-us.scss',
      'about-us-arunika': './resources/scss/arunika/pages/_about-us.scss',
      'afiliasi': './resources/scss/pages/_afiliasi.scss',
      'cart': './resources/scss/pages/_cart.scss',
      'cloud-hosting': './resources/scss/pages/_cloud-hosting.scss',
      'cloud-vps': './resources/scss/pages/_cloud-vps.scss',
      'cloud-vps-v2': './resources/scss/pages/_cloud-vps-v2.scss',
      'cyberpanel-vps': './resources/scss/pages/_cyberpanel-vps.scss',
      'kvm-vps-hosting': './resources/scss/pages/_kvm-vps-hosting.scss',
      'csa-referral': './resources/scss/pages/_csa-referral.scss',
      'domain-gratis': './resources/scss/pages/_domain-gratis.scss',
      'domain-id': './resources/scss/pages/_domain-id.scss',
      'domain-murah': './resources/scss/pages/_domain-murah.scss',
      'domain-online': './resources/scss/pages/_domain-online.scss',
      'ebook': './resources/scss/pages/_ebook.scss',
      'email-hosting': './resources/scss/pages/_email-hosting.scss',
      'event': './resources/scss/pages/_event.scss',
      'home': './resources/scss/pages/_home.scss',
      'hosting-gratis': './resources/scss/pages/_hosting-gratis.scss',
      'hosting-indonesia': './resources/scss/pages/_hosting-indonesia.scss',
      'hosting-murah': './resources/scss/pages/_hosting-murah.scss',
      'karir': './resources/scss/pages/_karir.scss',
      'kupon': './resources/scss/pages/_kupon.scss',
      'nipa': './resources/scss/pages/_nipa.scss',
      'pembayaran': './resources/scss/pages/_pembayaran.scss',
      'plugin-box-footer': './resources/scss/pages/_plugin-box-footer.scss',
      'plugin-niagahoster-partner': './resources/scss/pages/_plugin-niagahoster-partner.scss',
      'poin': './resources/scss/pages/_poin.scss',
      'promo-domain-com': './resources/scss/pages/_promo-domain-com.scss',
      'promosi-transfer': './resources/scss/pages/_promosi-transfer.scss',
      'promosi': './resources/scss/pages/_promosi.scss',
      'virtual-summit': './resources/scss/pages/_virtual-summit.scss',
      'wall-of-fame': './resources/scss/pages/_wall-of-fame.scss',
      'whois': './resources/scss/pages/_whois.scss',
      'wordpress-hosting': './resources/scss/pages/_wordpress-hosting.scss',
      'unlimited-hosting': './resources/scss/pages/_unlimited-hosting.scss',
      'membuat-website': ['./resources/scss/pages/_membuat-website.scss', './resources/scss/pages/_detail-theme-website.scss'],
      'membuat-website-v4': './resources/scss/pages/_membuat-website-v4.scss',
      'forgot-password': './resources/scss/pages/_forgot-password.scss',
      'partner-am-wa': './resources/scss/layouts/partials/_partner-am-wa.scss',
      'managed-wordpress-v2': './resources/scss/pages/_managed-wordpress-v2.scss',
  
      'homepage-arunika': './resources/scss/arunika/pages/_homepage.scss',
      'cloud-hosting-arunika': './resources/scss/arunika/pages/_cloud-hosting.scss',
      'cloud-hosting-arunika-v2': './resources/scss/arunika/pages/_cloud-hosting-v2.scss',
      'domain-murah-arunika': './resources/scss/arunika/pages/_domain-murah.scss',
      'event-arunika': './resources/scss/arunika/pages/_event.scss',
      'kemerdekaan' : './resources/scss/arunika/campaign/_kemerdekaan.scss',
      'hosting-indonesia-arunika': './resources/scss/arunika/pages/_hosting-indonesia.scss',
      'hosting-indonesia-arunika-v2': './resources/scss/arunika/pages/_hosting-indonesia-v2.scss',
      'poin-arunika': './resources/scss/arunika/pages/_poin.scss',
      'niaga-partner-arunika': './resources/scss/arunika/pages/_niaga-partner.scss',
      'hosting-terbaik-arunika': './resources/scss/arunika/pages/_hosting-terbaik.scss',
      'hosting-terbaik-arunika-v2': './resources/scss/arunika/pages/_hosting-terbaik-v2.scss',
      'hosting-murah-arunika': './resources/scss/arunika/pages/_hosting-murah.scss',
      'hosting-murah-arunika-v2': './resources/scss/arunika/pages/_hosting-murah-v2.scss',
      'vps-kvm-indonesia-arunika': './resources/scss/arunika/pages/_vps-kvm-indonesia.scss',
      'vps-kvm-indonesia-arunika-v2': './resources/scss/arunika/pages/_vps-kvm-indonesia-v2.scss',
      'anniversary' : './resources/scss/arunika/campaign/_anniversary.scss',
      'anniversary-belt' : './resources/scss/arunika/campaign/_anniversary-belt.scss',
      'anniversary-adapter' : './resources/scss/arunika/campaign/_anniversary-adapter.scss',
      'anniversary-belt-adapter' : './resources/scss/arunika/campaign/_anniversary-belt-adapter.scss',
      'vps-cpanel' : './resources/scss/arunika/pages/_vps-cpanel.scss',
      'datacenter-hosting' : './resources/scss/arunika/pages/_datacenter-hosting.scss',
      'free-vps' : './resources/scss/arunika/pages/_free-vps.scss',
      'ssl-murah': './resources/scss/arunika/pages/_ssl-murah.scss',
      'theme-partner': './resources/scss/arunika/pages/_theme-partner.scss',
      'jasa-pembuatan-website': './resources/scss/arunika/pages/_jasa-pembuatan-website.scss',
      'arunika-website-instant': './resources/scss/arunika/pages/_website-instant.scss',
      'membuat-website-explore': './resources/scss/arunika/pages/_membuat-website-explore.scss',
      'promocode-copyable-belt' : './resources/scss/arunika/campaign/_promocode-copyable-belt.scss',
      'promo-code-hosting-copyable' : './resources/scss/arunika/campaign/_promo-code-hosting-copyable.scss',
      'custom-ribbon' : './resources/scss/arunika/campaign/custom-ribbon.scss',
      'eazy-link': './resources/scss/arunika/pages/_eazy-link.scss',
      '404-arunika': './resources/scss/arunika/pages/_404.scss',
      'detail-website': './resources/scss/arunika/pages/_detail-website.scss',
      'promo-tiga-tiga-belt': './resources/scss/arunika/campaign/_tigatiga-belt.scss',
      'domain-id-arunika': './resources/scss/arunika/pages/_domain-id.scss',
      'partner-website': './resources/scss/arunika/pages/_partner-website.scss',
      'email-hosting-arunika': './resources/scss/arunika/pages/_email-hosting.scss',
      'transfer-hosting-arunika': './resources/scss/arunika/pages/_transfer-hosting.scss',
      'transfer-hosting-arunika-v2': './resources/scss/arunika/pages/_transfer-hosting-v2.scss',
      'transfer-domain-arunika': './resources/scss/arunika/pages/_transfer-domain.scss',
      'syarat-ketentuan-arunika': './resources/scss/arunika/pages/_syarat-ketentuan.scss',
      'service-level-agreement-arunika': './resources/scss/arunika/pages/_service-level-agreement.scss',
      'promosi-transfer-arunika': './resources/scss/arunika/pages/_promosi-transfer.scss',
      'domain-com-flashsale': './resources/scss/arunika/campaign/_domain-com-flashsale.scss',
      'ramadhan' : './resources/scss/arunika/campaign/_ramadhan.scss',
      'promo-unlimited-hosting' : './resources/scss/arunika/campaign/_promo-unlimited-hosting.scss',
      'ramadhan-belt' : './resources/scss/arunika/campaign/_ramadhan-belt.scss',
      'ramadhan-belt-adapter' : './resources/scss/arunika/campaign/_ramadhan-belt-adapter.scss',
      'ramadhan-belt-adapter-old' : './resources/scss/arunika/campaign/_ramadhan-belt-adapter-old-page.scss',
      'simple-wordpress': './resources/scss/arunika/pages/_simple-wordpress.scss',
      'order-hosting': './resources/scss/arunika/pages/_order-hosting.scss',
      'one-month-belt': './resources/scss/arunika/campaign/_one-month-belt.scss',
      'checkout': './resources/scss/arunika/pages/_checkout.scss',
      'promo-diskon-koinworks-neo': './resources/scss/arunika/campaign/_promo-diskon-koinworks-neo.scss',
    },
    output: {
      path: path.resolve(__dirname, 'public/assets'),
      filename: 'js/pages/[name].js'
    },
    performance: {
      hints: false
    },
    devtool: process.env.NODE_ENV
      ? 'eval-cheap-module-source-map'
      : 'nosources-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(sc|c)ss$/,
          use: [
            process.env.NODE_ENV ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            {
              loader: 'sass-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          type: 'asset/resource'
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp)$/i,
          type: 'asset/resource',
          use: 'file-loader'
        }
      ]
    },
    optimization: {
      moduleIds: process.env.NODE_ENV ? 'named' : 'deterministic',
      sideEffects: true,
      minimize: process.env.NODE_ENV ? false : true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            format: {
              comments: false
            }
          },
          extractComments: true
        }),
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true }
              }
            ]
          }
        })
      ],
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    plugins: [
      new Dotenv(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      })
    ]
  }
}

let orderConf = env => {
  return {
    mode: env.NODE_ENV,
    entry: {
      'orderflow': './resources/scss/orderflow.scss',
      'main': './resources/js/main.js'
    },
    output: {
      path: path.resolve(__dirname, 'public/assets'),
      filename: 'js/bundle/main.[contenthash:4].js',
      chunkFilename: 'js/bundle/main.[chunkhash:4].js'
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm.js'
      },
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    performance: {
      hints: false
    },
    devtool: process.env.NODE_ENV
      ? 'eval-cheap-module-source-map'
      : 'nosources-source-map',
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm.js'
      },
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                loaders: {
                  scss: [
                    'vue-style-loader',
                    process.env.NODE_ENV
                      ? 'style-loader'
                      : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                  ],
                  css: [
                    'vue-style-loader',
                    process.env.NODE_ENV
                      ? 'style-loader'
                      : MiniCssExtractPlugin.loader,
                    'css-loader'
                  ]
                }
              }
            }
          ]
        },
        {
          test: /\.(sc|c)ss$/,
          use: [
            process.env.NODE_ENV ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            {
              loader: 'sass-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          type: 'asset/resource'
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp)$/i,
          type: 'asset/resource',
          use: 'file-loader'
        }
      ]
    },
    optimization: {
      moduleIds: process.env.NODE_ENV ? 'named' : 'deterministic',
      sideEffects: true,
      minimize: process.env.NODE_ENV ? false : true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            format: {
              comments: false
            }
          },
          extractComments: true
        }),
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true }
              }
            ]
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        minChunks: 4,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          }
        }
      }
    },
    plugins: [
      new Dotenv(),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      })
    ]
  }
}

module.exports = env => {
  return [appConf(env), pagesConf(env), orderConf(env)]
}