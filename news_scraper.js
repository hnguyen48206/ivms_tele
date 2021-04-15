const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    postgre: {
        user: 'hn16289_admin',
        host: 'johnny.heliohost.org',
        database: 'hn16289_testDB',
        password: 'hnguyen48206',
        port: 5432
    },
    mysql: {
        host     : 'johnny.heliohost.org',
        user     : 'hn16289_mysqlAdmin',
        password : 'hnguyen48206',
        database : 'hn16289_mysqlTest'
    },
    getNews: function (url) {
        return new Promise((resolve, reject) => {
            axios.get(url).then(res=>{
                resolve(this.extractData(res.data))           
            })
            .catch(err=>{
                reject(err)
            })
        })             
    },
    extractData: function (html){        
        data = [];
        const $ = cheerio.load(html);
        $('ul.list-news-content li').each((i, elem) => {
          data.push({
            title : $(elem).find('a').attr('title'),
            link : $(elem).find('a').attr('href'),
            date: $(elem).find('div span.second-label').text()
          });
        });
        console.log(data)
        return data;
    }
}
