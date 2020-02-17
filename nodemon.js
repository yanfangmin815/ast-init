/**
 * author: yfm
 * 自动重启脚本
 * @param
 * @returns {*}
 */
var nodemon = require('nodemon'); //引入nodemon模块
/**
 * script 自动重启脚本
 * ext 检测的文件
 */
nodemon({
    script: 'index.js',
    ext: 'json js'
});
nodemon.on('start', function () {
    console.log('nodeServer has started');
}).on('quit', function () {
    console.log('nodeServer has quit');
    process.exit();
}).on('restart', function (files) {
    console.log('nodeServer restarted due to: ', files);
});
