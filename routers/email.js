var express = require('express');
var router = express.Router()
const validator = require('validator');
router.use((req, res, next) => {
    next()
})
router.post('/emailValidate', async (req, res, next) => {
    const postData = req.body;
    if (postData.email) {
        console.info('/emailValidate call success ');
        //Validator only takes string as an input param, so remember to convert everything to string first
        res.json({ 'status': validator.isEmail(postData.email + '') });
    } else {
        console.warn('/emailValidate wrong input ');
        res.status(500).json({ 'status': 'wrong input' });
    }
});
module.exports = router
