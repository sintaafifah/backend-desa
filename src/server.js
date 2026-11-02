const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Cek apakah server berjalan
app.get('/', (req, res) => {
  res.send('API Sistem Informasi Desa berjalan');
});

// GET semua warga
app.get('/api/warga', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM warga ORDER BY id_warga');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data warga' });
  }
});

// GET warga berdasarkan ID
app.get('/api/warga/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM warga WHERE id_warga = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Warga tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data warga' });
  }
});

// POST tambah warga
app.post('/api/warga', async (req, res) => {
  try {
    const { nik, nama, alamat, tanggal_lahir } = req.body;

    if (!nik || !nama) {
      return res.status(400).json({ message: 'NIK dan nama wajib diisi' });
    }

    const result = await pool.query(
      `INSERT INTO warga (nik, nama, alamat, tanggal_lahir)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nik, nama, alamat || null, tanggal_lahir || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan warga' });
  }
});

// PUT ubah data warga
app.put('/api/warga/:id', async (req, res) => {
  try {
    const { nik, nama, alamat, tanggal_lahir } = req.body;

    if (!nik || !nama) {
      return res.status(400).json({ message: 'NIK dan nama wajib diisi' });
    }

    const result = await pool.query(
      `UPDATE warga
       SET nik = $1, nama = $2, alamat = $3, tanggal_lahir = $4
       WHERE id_warga = $5
       RETURNING *`,
      [nik, nama, alamat || null, tanggal_lahir || null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Warga tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengubah data warga' });
  }
});

// DELETE hapus warga
app.delete('/api/warga/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM warga WHERE id_warga = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Warga tidak ditemukan' });
    }

    res.json({ message: 'Data warga berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data warga' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});