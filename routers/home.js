var express = require('express');
var router = express.Router()
router.use((req, res, next) => {
    next()
})
router.get('/', async (req, res, next) => {
    res.send('Hello');
});
module.exports = router
