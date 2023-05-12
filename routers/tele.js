var express = require('express');
var router = express.Router();
const { celebrate } = require('celebrate');
const Joi = require('joi')
    .extend(require('@joi/date'));
//Telegram
var teleBot = require('../telegram.js');
router.use((req, res, next) => {
    next()
})

router.post('/create-server',
    celebrate({
        body: Joi.object({
            serverName: Joi.string().required().min(3).max(50),
            ip: Joi.string().min(3).max(50)
        })
    }),
    async (req, res, next) => {
        const postData = req.body;
        let data = await teleBot.createServer(postData.serverName, postData.ip || null);
        if (data)
            res.send(`Create Server Success`);
        else
            res.status(500).send('Error Or ServerName is existing.')
    });

router.post('/write-log',
    celebrate({
        body: Joi.object({
            serverName: Joi.string().required().min(3).max(50),
            type: Joi.string().required().min(3).max(50),
            logs: Joi.string().required().min(0),
        })
    }),
    async (req, res, next) => {
        const postData = req.body;
        teleBot.writeLogs(postData.serverName, postData.type, postData.logs);
        res.send(`Write Logs Success`);
    });

router.get('/clear-log/:serverName',
    celebrate({
        params: Joi.object({
            serverName: Joi.string().required().min(3).max(50)
        })
    }),
    async (req, res, next) => {
        teleBot.clearLogs(req.params.serverName)
        res.send('Clear Logs Success');
    });

router.delete('/del-server/:serverName',
    celebrate({
        params: Joi.object({
            serverName: Joi.string().required().min(3).max(50)
        })
    }),
    async (req, res, next) => {
        teleBot.deleteServer(req.params.serverName)
        res.send('Delete Server Success');
    });

router.post('/get-log',
    celebrate({
        body: Joi.object({
            serverName: Joi.string().required().min(3).max(50),
            fromDate: Joi.date().format("YYYY-MM-DD").raw(),
            toDate: Joi.date().format("YYYY-MM-DD").raw(),
        })
    }),
    async (req, res, next) => {
        const postData = req.body;
        let data = await teleBot.getLogs(postData.serverName, postData.fromDate || null, postData.toDate || null);
        if (data)
            res.send(data);
        else
            res.status(500).send('Server Error')
    });
module.exports = router