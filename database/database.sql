CREATE TABLE warga (
    id_warga SERIAL PRIMARY KEY,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    alamat TEXT,
    tanggal_lahir DATE
);

CREATE TABLE perangkat_desa (
    id_perangkat SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jabatan VARCHAR(50) NOT NULL,
    no_telepon VARCHAR(20)
);

CREATE TABLE akun_warga (
    id_akun SERIAL PRIMARY KEY,
    id_warga INT UNIQUE NOT NULL REFERENCES warga(id_warga),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE kegiatan (
    id_kegiatan SERIAL PRIMARY KEY,
    nama_kegiatan VARCHAR(100) NOT NULL,
    tanggal DATE NOT NULL,
    lokasi TEXT,
    deskripsi TEXT
);

CREATE TABLE pendaftaran_kegiatan (
    id_pendaftaran SERIAL PRIMARY KEY,
    id_warga INT NOT NULL REFERENCES warga(id_warga),
    id_kegiatan INT NOT NULL REFERENCES kegiatan(id_kegiatan),
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_warga, id_kegiatan)
);

CREATE TABLE pengumuman (
    id_pengumuman SERIAL PRIMARY KEY,
    id_perangkat INT NOT NULL REFERENCES perangkat_desa(id_perangkat),
    judul VARCHAR(150) NOT NULL,
    isi TEXT NOT NULL,
    tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE laporan_warga (
    id_laporan SERIAL PRIMARY KEY,
    id_warga INT NOT NULL REFERENCES warga(id_warga),
    judul VARCHAR(150) NOT NULL,
    isi TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Menunggu',
    tanggal_laporan TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);