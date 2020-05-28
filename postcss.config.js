module.exports = {
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    },
    plugins: {
        'postcss-pxtorem': {
            rootValue: 10,
            propList: ['*'],
        }
    }
}