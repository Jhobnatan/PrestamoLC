const express = require('express');
const cron = require('node-cron');
//const controller = require('../controllers/customerController');
const router = express.Router();
const uploadFile = require('../middleware/multer');
const organigramaController = require('../controllers/organigramaController');
const { notificiaciones_list, send_mail } = require('../services/emailService');
var moment = require('moment');


router.get('/', organigramaController.list);
router.post('/add',organigramaController.save);

router.get('/update/:id',organigramaController.edit);
router.post('/update/:id/:li/:index',uploadFile,organigramaController.update);

router.get('/delete/:id',organigramaController.delete);

module.exports = router;
