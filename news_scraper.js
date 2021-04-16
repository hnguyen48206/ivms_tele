const axios = require('axios');
const cheerio = require('cheerio');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')

module.exports = {
    postgre: {
        user: 'hn16289_admin',
        host: 'johnny.heliohost.org',
        database: 'hn16289_testDB',
        password: 'hnguyen48206',
        port: 5432
    },
    mysql: {
        host: 'johnny.heliohost.org',
        user: 'hn16289_mysqlAdmin',
        password: 'hnguyen48206',
        database: 'hn16289_mysqlTest'
    },
    autoNewsScrappingtoDBEvery(time) {
        const scheduler = new ToadScheduler()
        const task = new AsyncTask(
            'news scrapping',
            () => {
                return this.getNews('https://tuoitre.vn/tin-moi-nhat.htm').then(res => {
                }).catch(err => { console.log(err) })
            },
            (err) => { console.log(err) })

        const job = new SimpleIntervalJob({ seconds: time, }, task)

        scheduler.addSimpleIntervalJob(job)
    },

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
                image: $(elem).find('a img').attr('src')
            });
        });
        else if (type == 'edu')
        $('article.listNewSmall').each((i, elem) => {
            data.push({
                title: $(elem).find('div.post-item div.left-col figure a').attr('title'),
                url: 'http://thainguyen.edu.vn'+$(elem).find('div.post-item div.left-col figure a').attr('href'),
                pubdate: $(elem).find('div.post-item div.right-col div.post-title span time').text(),
                image: 'http://thainguyen.edu.vn'+$(elem).find('div.post-item div.left-col figure a img').attr('src'),
            });
        });

        
        console.log(data)
        return data;
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
    }
}
