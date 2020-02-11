module.exports = {
    devServer: {
        host: '0.0.0.0',
        proxy: {
            '^/api': {
                target: 'http://localhost:8081',
                ws: true,
                changeOrigin: true
            },
        },
    }
}