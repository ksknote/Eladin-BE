const { Router } = require('express');
const router = Router();


router.get('/', (req, res) => {
    // 프로덕트 등록한거 전부다 조회해서 뿌려주기!!
    res.send('This is the root page');
});

module.exports = router;
