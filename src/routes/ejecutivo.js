const express = require('express');
//const controller = require('../controllers/ejecutivoController');
const router = express.Router();
const ejecutivoController = require('../controllers/ejecutivoController');

router.get('/', ejecutivoController.list);
router.post('/add',ejecutivoController.save);

router.get('/update/:id',ejecutivoController.edit);
router.post('/update/:id',ejecutivoController.update);

router.get('/delete/:id',ejecutivoController.delete);

module.exports = router;