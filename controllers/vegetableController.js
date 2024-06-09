const express = require('express');
const app = express();
const { Firestore } = require('@google-cloud/firestore');

// Inisialisasi Firestore
const db = new Firestore({
  projectId: 'vetion-app-424904',
  databaseId: 'vegetables',
});

// Membuat instance BulkWriter
const bulkWriter = db.bulkWriter();

// Fungsi untuk mendapatkan data sayur berdasarkan nama
const getvegetableByName = async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name is required'
    });
  }

  const vegetSnapshot = await db.collection('vegetable').where('name', '==', name).get();

  if (vegetSnapshot.empty) {
    return res.status(404).json({
      status: 'fail',
      message: 'Vegetable not found'
    });
  }

  const vege = vegetSnapshot.docs[0].data();
  return res.status(200).json({
    status: 'success',
    data: vege
  });
};

// Fungsi untuk menambahkan data sayur
const addvegetable = async (req, res) => {
  const { name, 
      nama_latin, 
      deskripsi, 
      kalori, 
      karbohidrat, 
      protein, 
      lemak, 
      serat, 
      vitamin, 
      mineral, 
      manfaat,
      pemilihan,
      penyimpanan_jangka_pendek,
      penyimpanan_jangka_panjang,
      menus
   } = req.body;

  if (!name || !nama_latin || !deskripsi || !kalori ||
      !karbohidrat || 
      !protein ||  
      !lemak || 
      !serat || 
      !vitamin || 
      !mineral ||  
      !manfaat || 
      !pemilihan || 
      !penyimpanan_jangka_pendek || 
      !penyimpanan_jangka_panjang || 
      !menus) {
    return res.status(400).json({
      status: 'fail',
      message: 'All fields are required'
    });
  }

  const newVegetable = {
      name,
      nama_latin, 
      deskripsi, 
      kalori, 
      karbohidrat, 
      protein, 
      lemak, 
      serat, 
      vitamin, 
      mineral, 
      manfaat,
      pemilihan,
      penyimpanan_jangka_pendek,
      penyimpanan_jangka_panjang, 
      menus,
    createdAt: new Date().toISOString()
  };

  try {
    // Memeriksa apakah data sudah ada berdasarkan nama
    const vegetSnapshot = await db.collection('vegetable').where('name', '==', name).get();

    if (!vegetSnapshot.empty) {
      return res.status(409).json({
        status: 'fail',
        message: 'Vegetable already exists'
      });
    }

    const docRef = db.collection('vegetable').doc();
    bulkWriter.create(docRef, newVegetable);

    await bulkWriter.close();

    return res.status(201).json({
      status: 'success',
      message: 'Vegetable added successfully',
      data: newVegetable
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};


  // Fungsi untuk memperbarui data sayur berdasarkan nama
const updateVegetable = async (req, res) => {
    const { name } = req.params;
    const updateData = req.body;
  
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name is required'
      });
    }
  
    const vegetSnapshot = await db.collection('vegetable').where('name', '==', name).get();
  
    if (vegetSnapshot.empty) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vegetable not found'
      });
    }
  
    const docId = vegetSnapshot.docs[0].id;
    try {
        bulkWriter.update(db.collection('vegetable').doc(docId), updateData);
    
        await bulkWriter.close();
    
        return res.status(200).json({
          status: 'success',
          message: 'Vegetable updated successfully'
        });
      } catch (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Internal Server Error'
        });
      }
  };

  // Fungsi untuk menghapus data sayur berdasarkan nama
const deleteVegetable = async (req, res) => {
    const { name } = req.params;
  
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name is required'
      });
    }
  
    const vegetSnapshot = await db.collection('vegetable').where('name', '==', name).get();
  
    if (vegetSnapshot.empty) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vegetable not found'
      });
    }
  
    const docId = vegetSnapshot.docs[0].id;
    try {
        bulkWriter.delete(db.collection('vegetable').doc(docId));

        await bulkWriter.close();
    
        return res.status(200).json({
          status: 'success',
          message: 'Vegetable deleted successfully'
        });
      } catch (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Internal Server Error'
        });
      }
  };

module.exports = {
    getvegetableByName,
    addvegetable,
    deleteVegetable,
    updateVegetable
  };
