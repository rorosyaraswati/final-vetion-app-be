const express = require('express');
const app = express();
const { Firestore } = require('@google-cloud/firestore');

// Middleware untuk parsing JSON
app.use(express.json());

// Inisialisasi Firestore
const db = new Firestore({
  projectId: 'vetion-app-424904',
  databaseId: 'facts',
});

// Membuat instance BulkWriter
const bulkWriter = db.bulkWriter();

// Fungsi untuk mendapatkan data berdasarkan judul
const getFact = async (req, res) => {
  const { judul_fakta } = req.params;

  if (!judul_fakta) {
    return res.status(400).json({
      status: 'fail',
      message: 'judul is required'
    });
  }

  try {
    const docRef = db.collection('fact').doc(judul_fakta);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Fact not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: doc.data()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};
  
// Fungsi untuk menambahkan data
const addFact = async (req, res) => {
    const { judul_fakta, fakta_unix } = req.body;
  
    if (!judul_fakta || !fakta_unix) {
      return res.status(400).json({
        status: 'fail',
        message: 'judul_fakta dan fakta_unix diperlukan'
      });
    }
  
    try {
      const docRef = db.collection('fact').doc(judul_fakta);
      await docRef.set({ judul_fakta, fakta_unix });
  
      return res.status(200).json({
        status: 'success',
        message: 'Fakta berhasil ditambahkan'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  };

// Fungsi untuk memperbarui data berdasarkan judul
const updateFact = async (req, res) => {
  const { judul_fakta } = req.params;
  const updateData = req.body;

  if (!judul_fakta) {
    return res.status(400).json({
      status: 'fail',
      message: 'judul is required'
    });
  }

  try {
    const docRef = db.collection('fact').doc(judul_fakta);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Fact not found'
      });
    }

    bulkWriter.update(docRef, updateData);

    await bulkWriter.close();

    return res.status(200).json({
      status: 'success',
      message: 'Fact updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};

// Fungsi untuk menghapus data berdasarkan judul
const deleteFact = async (req, res) => {
  const { judul_fakta } = req.params;

  if (!judul_fakta) {
    return res.status(400).json({
      status: 'fail',
      message: 'judul is required'
    });
  }

  try {
    const docRef = db.collection('fact').doc(judul_fakta);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Fact not found'
      });
    }

    bulkWriter.delete(docRef);

    await bulkWriter.close();

    return res.status(200).json({
      status: 'success',
      message: 'Fact deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};

module.exports = {
  getFact,
  addFact,
  deleteFact,
  updateFact
};
