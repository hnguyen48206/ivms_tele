const { SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const news_scraper = require('./news_scraper.js')
const axios = require('axios');
const ema = require('./ema.js')


module.exports = {
    cancelCronJob(jobID, cachedScheduler) {
        //Try Catch is a synchronous task. Therefore do not mix it with Promise.
        let result
        try {
            console.log(cachedScheduler.getById(jobID))
            cachedScheduler.stopById(jobID)
            result = true
        } catch (error) {
            console.log(error)
            result = false
        }
        if (result) {
            this.removeCronJobFromDatabase(jobID).then(res => {
                return true
            })
                .catch(err => { return false })
        }
        else
            return false
    },
    autoNewsScrappingtoDBEvery(jobDetail, cachedScheduler) {
        return new Promise((resolve, reject) => {
            const task = new AsyncTask(
                jobDetail.jobID,
                () => {
                    return news_scraper.getNews('https://tuoitre.vn/tin-moi-nhat.htm').then(res => {
                        console.log('Lấy news tuoitre ok')
                        resolve(res)
                    }).catch(err => {
                        console.log(err);
                        reject(err)
                    })
                },
                (err) => {
                    console.log(err);
                    reject(err)
                })
            const job = new SimpleIntervalJob({ seconds: jobDetail.timeInterval, }, task, jobDetail.jobID)
            cachedScheduler.addSimpleIntervalJob(job)
            this.saveCronJobToDatabase(jobDetail)
        })
    },
    emaWatcher(jobDetail, cachedScheduler) {
        return new Promise((resolve, reject) => {
            let params = {
                'symbol': jobDetail.symbol,
                'limit': jobDetail.limit,
                'interval': ema.tradeEnum.KLINE_INTERVAL_1DAY
              };
              let headers ={
                  'apiKey': 'mIiECMzRBcbblEIqIBb9kFE13h5ITvMFXQw54wIW2h1UyxiC0WdsrYrx8UvEw2Sx'
              };
              let url='https://api.binance.com/api/v3/klines';
            axios.get(url, {params, headers}).then(res => {
                // console.log(res)
                ema.emaCalculator(res.data)
                resolve(res)
            })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            // const task = new AsyncTask(
            //     jobDetail.jobID,
            //     () => {

            //         //symbol is the pair of trade, limit is the maximum of candle sticks returned, interval is the 
            //         let params = {
            //             'symbol': jobDetail.symbol,
            //             'limit': jobDetail.limit,
            //             'interval': ema.tradeEnum.KLINE_INTERVAL_1DAY
            //           };
            //           let headers ={
            //               'apiKey': 'mIiECMzRBcbblEIqIBb9kFE13h5ITvMFXQw54wIW2h1UyxiC0WdsrYrx8UvEw2Sx'
            //           };
            //           let url='https://api.binance.com/api/v3/klines';
            //         axios.get(url, {params, headers}).then(res => {
            //             console.log(res)
            //             resolve(res)
            //         })
            //             .catch(err => {
            //                 reject(err)
            //             })

            //         // return news_scraper.getNews('https://api.binance.com/api/v3/klines').then(res => {
            //         //     console.log('get ema data ok')
            //         //     resolve(res)
            //         // }).catch(err => {
            //         //     console.log(err);
            //         //     reject(err)
            //         // })
            //     },
            //     (err) => {
            //         console.log(err);
            //         reject(err)
            //     })
            // const job = new SimpleIntervalJob({ seconds: jobDetail.timeInterval, }, task, jobDetail.jobID)
            // cachedScheduler.addSimpleIntervalJob(job)
            // this.saveCronJobToDatabase(jobDetail)
        })
    },

    saveCronJobToDatabase(jobDetail) {
        return new Promise((resolve, reject) => {
            let cronJobsCollection = dbClient.db("sample_airbnb").collection("cronjobs");
            cronJobsCollection.insertOne(jobDetail).then(res => {
                console.log(res)
                resolve(res)
            })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    },
    removeCronJobFromDatabase(jobID) {
        return new Promise((resolve, reject) => {
            let cronJobsCollection = dbClient.db("sample_airbnb").collection("cronjobs");
            cronJobsCollection.deleteOne({ "jobID": jobID }).then(res => {
                console.log('Xoá job khỏi dB thành công')
                console.log(res)
                resolve(res)
            }).catch(err => {
                console.log(err)
                reject(err)
            });
        })
    }


}