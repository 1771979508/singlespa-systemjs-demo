const { merge } = require('webpack-merge')
const singleSpaDefaults = require('webpack-config-single-spa');

module.exports = () => {
    const defaultConfig = singleSpaDefaults({
        orgName: 'study',
        projectName: 'app1'
    })
    return merge(defaultConfig, {
        devServer: {
            port: 9001
        }
    })
}