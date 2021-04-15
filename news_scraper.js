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
