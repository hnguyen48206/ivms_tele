const axios = require('axios');
const cheerio = require('cheerio');
const {SimpleIntervalJob, AsyncTask } = require('toad-scheduler')

module.exports = {     

    getSongCongNews(type) {
        if (type == 'general') {
            return new Promise((resolve, reject) => {
                axios.get('http://songcong.thainguyen.gov.vn/tin-hoat-dong-cua-thanh-pho').then(res => {
                    resolve(this.extractSongcongData(res.data, type))
                })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
        else if (type == 'edu') {
            return new Promise((resolve, reject) => {
                axios.get('http://thainguyen.edu.vn/tin-tuc-su-kien').then(res => {
                    resolve(this.extractSongcongData(res.data, type))
                })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
        else if (type == 'medic') {
            return new Promise((resolve, reject) => {
                axios.get('http://soytethainguyen.gov.vn/tin-tuc-su-kien').then(res => {
                    resolve(this.extractSongcongData(res.data, type))
                })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
    },
    extractSongcongData: function (html, type) {
        data = [];
        const $ = cheerio.load(html);
        if (type == 'general')
            $('div.box-news-xx').each((i, elem) => {
                data.push({
                    title: $(elem).find('h2 a').text(),
                    url: $(elem).find('h2 a').attr('href'),
                    pubdate: $(elem).find('div.hot-news-tol p').text(),
                    image: 'http://songcong.thainguyen.gov.vn' + $(elem).find('a img').attr('src')
                });
            });
        else if (type == 'medic')
            $('div.box-news-xx').each((i, elem) => {
                data.push({
                    title: $(elem).find('h2 a').text(),
                    url: $(elem).find('h2 a').attr('href'),
                    pubdate: $(elem).find('div.hot-news-tol p').text(),
                    image: 'http://soytethainguyen.gov.vn' + $(elem).find('a img').attr('src')
                });
            });
        else if (type == 'edu')
            $('article.listNewSmall').each((i, elem) => {
                data.push({
                    title: $(elem).find('div.post-item div.left-col figure a').attr('title'),
                    url: 'http://thainguyen.edu.vn' + $(elem).find('div.post-item div.left-col figure a').attr('href'),
                    pubdate: $(elem).find('div.post-item div.right-col div.post-title span time').text(),
                    image: 'http://thainguyen.edu.vn' + $(elem).find('div.post-item div.left-col figure a img').attr('src'),
                });
            });

        console.log(data)
        return data;
    },
    getCaoBangNews(type) {
        if (type == 'general') {
            return new Promise((resolve, reject) => {
                axios.get('https://appstore.hcmtelecom.vn/it2/externalscript.html').then(res => {
                    resolve(this.extractCaoBangData(res.data, type))
                })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
    },
    extractCaoBangData: function (html, type) {
        let currentDate = new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear()
        data = [];
        const $ = cheerio.load(html);
        if (type == 'general')
            $('div.HotnewsItem').each((i, elem) => {
                data.push({
                    title: $(elem).find('a').attr('type'),
                    url: 'https://caobang.gov.vn' + $(elem).find('a').attr('href'),
                    pubdate: currentDate,
                    image: 'https://caobang.gov.vn' + $(elem).find('a img').attr('src')
                });
            });
        return data.slice(0, 15);
    },
    getMoreNews(apiURL) {
        console.log(apiURL)
        return new Promise((resolve, reject) => {
            axios.get(apiURL).then(res => {
                resolve(this.extractData(res.data, 'more'))
            })
                .catch(err => {
                    reject(err)
                })
        })
    },
    getNews: function (url) {
        return new Promise((resolve, reject) => {
            axios.get(url).then(res => {
                resolve(this.extractData(res.data, 'first'))
            })
                .catch(err => {
                    reject(err)
                })
        })
    },
    extractData: function (html, type) {
        data = [];
        const $ = cheerio.load(html);
        if (type == 'first')
            $('ul.list-news-content li').each((i, elem) => {
                data.push({
                    title: $(elem).find('a').attr('title'),
                    link: $(elem).find('a').attr('href'),
                    date: $(elem).find('div span.second-label').text()
                });
            });
        else (type == 'more')
        $('li.news-item').each((i, elem) => {
            data.push({
                title: $(elem).find('a').attr('title'),
                link: $(elem).find('a').attr('href'),
                date: $(elem).find('div.published-date span.second-label').text()
            });
        });
        console.log(data)
        return data;
    },
    getThaibinhNews(type) {
        if (type == 'general') {
            return new Promise((resolve, reject) => {
                axios.get('https://thaibinh.gov.vn/tin-tuc/tin-tong-hop?isFeatured=1').then(res => {
                    resolve(this.extractThaibinhData(res.data, type))
                })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
        else if (type == 'edu') {
            return new Promise((resolve, reject) => {
                axios.get('http://thaibinh.edu.vn/tin-tuc-su-kien').then(res => {
                    resolve(this.extractThaibinhData(res.data, type))
                })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
        else if (type == 'medic') {
            return new Promise((resolve, reject) => {
                axios.get('https://soyte.thaibinh.gov.vn/tin-tuc').then(res => {
                    resolve(this.extractThaibinhData(res.data, type))
                })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
    },
    extractThaibinhData: function (html, type) {
        console.log(html)
        let currentDate = new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear()

        data = [];
        const $ = cheerio.load(html);
        if (type == 'general')
            $('article.Article-News').each((i, elem) => {
                data.push({
                    title: $(elem).find('div div.left-new figure a').attr('title'),
                    url: 'https://thaibinh.gov.vn' + $(elem).find('div div.left-new figure a').attr('href'),
                    pubdate: currentDate,
                    image: 'https://thaibinh.gov.vn' + $(elem).find('div div.left-new figure a img').attr('src')
                });
            });
        else if (type == 'medic')
            $('div.news-item').each((i, elem) => {
                data.push({
                    title: $(elem).find('a').attr('title'),
                    url: 'https://soyte.thaibinh.gov.vn' + $(elem).find('a').attr('href'),
                    pubdate: currentDate,
                    image: 'https://soyte.thaibinh.gov.vn' + $(elem).find('a img').attr('src')
                });
            });
        else if (type == 'edu')
            $('article.Article-News').each((i, elem) => {
                data.push({
                    title: $(elem).find('div div.left-listType4 figure a').attr('title'),
                    url: 'http://thaibinh.edu.vn' + $(elem).find('div div.left-listType4 figure a').attr('href'),
                    pubdate: currentDate,
                    image: 'http://thaibinh.edu.vn' + $(elem).find('div div.left-listType4 figure a img').attr('src'),
                });
            });

        console.log(data)
        return data;
    },
}
