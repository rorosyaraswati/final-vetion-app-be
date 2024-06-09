const express = require('express');
const router = express.Router();
const { getFact, addFact,  deleteFact, updateFact} = require('../controllers/factController');

// Rute untuk mendapatkan fun fact
router.get('/getfunfact/:judul_fakta', getFact);

// Rute untuk menambahkan fun fact
router.post('/addfunfact', addFact);

// Rute untuk menghapus fun fact berdasarkan nama
router.delete('/deletefunfact/:judul_fakta', deleteFact);

// Rute untuk memperbarui fun fact berdasarkan nama
router.put('/updatefunfact/:judul_fakta', updateFact);

module.exports = router;