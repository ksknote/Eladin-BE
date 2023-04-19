const { Router } = require('express');
const router = Router();



router.get('/', (req, res) => {
    // 여기서 오픈 api 데이터 받아와서 보내줘야 할듯!!
    res.send('This is the root page');
});

module.exports = router;
