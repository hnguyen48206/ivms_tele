const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath("C:/FFmpeg/bin/ffmpeg.exe");

ffmpeg.setFfprobePath("C:/FFmpeg/bin");

ffmpeg.setFlvtoolPath("C:/FFmpeg/flvtool2.exe");

console.log(ffmpeg);

module.exports = ffmpeg