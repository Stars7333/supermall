module.exports = {
    configureWebpack: {
        resolve: {
          extensions: ['.js','.vue','.json'],
            alias:{
                'views': '@/views',
                'assets': '@/assets',
                'components': '@/components',
                'common': '@/common',
                'network': '@/network',
            }
        }
    }
}
