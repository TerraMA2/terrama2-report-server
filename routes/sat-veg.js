const express = require('express');
        router = express.Router();
        SatVeg = require('../controllers/sat-veg');

router.get('/:type?/:coordinates?/:sat?/:preFilter?/:filter?/:filterParam?', SatVeg.get);

module.exports = router;
