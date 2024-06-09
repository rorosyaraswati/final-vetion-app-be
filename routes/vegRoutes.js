const express = require('express');
const router = express.Router();
const { getvegetableByName, addvegetable,  deleteVegetable, updateVegetable} = require('../controllers/vegetableController');

// Rute untuk mendapatkan sayur berdasarkan nama
router.get('/vegetables/:name', getvegetableByName);

// Rute untuk menambahkan sayur
router.post('/vegetables', addvegetable);

// Rute untuk menghapus sayur berdasarkan nama
router.delete('/vegetables/:name', deleteVegetable);

// Rute untuk memperbarui sayur berdasarkan nama
router.put('/vegetables/:name', updateVegetable);

module.exports = router;