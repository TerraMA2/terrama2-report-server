const express = require('express');
        router = express.Router();
        carController = require('../controllers/car.controller');

router.get('/getAllSimplified', carController.getAllSimplified);
router.get('/getAll', carController.getAll);
router.get('/getByCpf?:cpfCnpj*', carController.getByCpf);

module.exports = router;
