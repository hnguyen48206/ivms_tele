const { SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const news_scraper = require('./news_scraper.js')


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

    createPriceAlert(jobDetail, cachedScheduler) {
        return new Promise((resolve, reject) => {
            const task = new AsyncTask(
                jobDetail.jobID,
                () => {
                    //Change to checking price on the platform and if it hits the point you need, then call api to send Firebase Notification
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