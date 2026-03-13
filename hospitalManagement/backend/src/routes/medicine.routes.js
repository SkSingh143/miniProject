const express = require('express');
const { compareMedicines } = require('../controllers/medicine.controller');
const router = express.Router();

router.get('/compare', compareMedicines);

module.exports = router;