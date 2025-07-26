-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 08, 2025 at 06:28 PM
-- Server version: 8.0.30
-- PHP Version: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `koperasi`
--

-- --------------------------------------------------------

--
-- Table structure for table `anggota`
--

CREATE TABLE `anggota` (
  `anggota_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `nomor_anggota` varchar(20) DEFAULT NULL,
  `tanggal_masuk` date DEFAULT NULL,
  `pekerjaan` varchar(100) DEFAULT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `status_pernikahan` enum('menikah','belum menikah') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `anggota`
--

INSERT INTO `anggota` (`anggota_id`, `user_id`, `nomor_anggota`, `tanggal_masuk`, `pekerjaan`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `status_pernikahan`) VALUES
(1, 4, 'AGT001', '2024-07-08', 'Karyawan Swasta', 'Bandung', '1995-06-15', 'L', 'menikah');

-- --------------------------------------------------------

--
-- Table structure for table `angsuran_pinjaman`
--

CREATE TABLE `angsuran_pinjaman` (
  `angsuran_id` int NOT NULL,
  `pinjaman_id` int DEFAULT NULL,
  `tanggal_bayar` date DEFAULT NULL,
  `jumlah_bayar` decimal(12,2) DEFAULT NULL,
  `denda` decimal(12,2) DEFAULT '0.00',
  `keterangan` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `angsuran_pinjaman`
--

INSERT INTO `angsuran_pinjaman` (`angsuran_id`, `pinjaman_id`, `tanggal_bayar`, `jumlah_bayar`, `denda`, `keterangan`) VALUES
(1, 1, '2025-07-08', 100000.00, 0.00, 'Pembayaran Angsuran 1');

--
-- Triggers `angsuran_pinjaman`
--
DELIMITER $$
CREATE TRIGGER `after_insert_angsuran` AFTER INSERT ON `angsuran_pinjaman` FOR EACH ROW BEGIN
  UPDATE pinjaman 
  SET total_terbayar = total_terbayar + NEW.jumlah_bayar + NEW.denda
  WHERE pinjaman_id = NEW.pinjaman_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `penarikan_simpanan`
--

CREATE TABLE `penarikan_simpanan` (
  `penarikan_id` int NOT NULL,
  `anggota_id` int DEFAULT NULL,
  `jumlah` decimal(12,2) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `keterangan` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `penarikan_simpanan`
--

INSERT INTO `penarikan_simpanan` (`penarikan_id`, `anggota_id`, `jumlah`, `tanggal`, `keterangan`) VALUES
(1, 1, 50000.00, '2025-07-08', 'Penarikan Sebagian Simpanan Sukarela');

--
-- Triggers `penarikan_simpanan`
--
DELIMITER $$
CREATE TRIGGER `before_insert_penarikan` BEFORE INSERT ON `penarikan_simpanan` FOR EACH ROW BEGIN
  DECLARE total_simpan DECIMAL(12,2);
  DECLARE total_tarik DECIMAL(12,2);

  SELECT COALESCE(SUM(jumlah),0) INTO total_simpan 
  FROM simpanan 
  WHERE anggota_id = NEW.anggota_id;

  SELECT COALESCE(SUM(jumlah),0) INTO total_tarik 
  FROM penarikan_simpanan 
  WHERE anggota_id = NEW.anggota_id;

  IF (total_tarik + NEW.jumlah) > total_simpan THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Penarikan melebihi jumlah simpanan!';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan_koperasi`
--

CREATE TABLE `pengaturan_koperasi` (
  `id` int NOT NULL,
  `nama_koperasi` varchar(255) DEFAULT NULL,
  `alamat` text,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `simpanan_wajib_bulanan` decimal(12,2) DEFAULT NULL,
  `bunga_default` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengaturan_koperasi`
--

INSERT INTO `pengaturan_koperasi` (`id`, `nama_koperasi`, `alamat`, `telepon`, `email`, `simpanan_wajib_bulanan`, `bunga_default`) VALUES
(1, 'Koperasi Maju Jaya', 'Jl. Raya No.88', '081234567899', 'info@koperasi.com', 100000.00, 1.50);

-- --------------------------------------------------------

--
-- Table structure for table `persetujuan_pinjaman`
--

CREATE TABLE `persetujuan_pinjaman` (
  `persetujuan_id` int NOT NULL,
  `pinjaman_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `status` enum('disetujui','ditolak') DEFAULT NULL,
  `tanggal` datetime DEFAULT CURRENT_TIMESTAMP,
  `catatan` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `persetujuan_pinjaman`
--

INSERT INTO `persetujuan_pinjaman` (`persetujuan_id`, `pinjaman_id`, `user_id`, `status`, `tanggal`, `catatan`) VALUES
(1, 1, 2, 'disetujui', '2025-07-09 01:17:40', 'Pinjaman disetujui sesuai prosedur');

-- --------------------------------------------------------

--
-- Table structure for table `pinjaman`
--

CREATE TABLE `pinjaman` (
  `pinjaman_id` int NOT NULL,
  `anggota_id` int DEFAULT NULL,
  `jumlah` decimal(12,2) DEFAULT NULL,
  `tenor` int DEFAULT NULL,
  `bunga_persen` decimal(5,2) DEFAULT NULL,
  `status` enum('diajukan','disetujui','ditolak','lunas') DEFAULT 'diajukan',
  `tanggal_pengajuan` date DEFAULT NULL,
  `tanggal_persetujuan` date DEFAULT NULL,
  `disetujui_oleh` int DEFAULT NULL,
  `total_terbayar` decimal(12,2) DEFAULT '0.00',
  `tanggal_lunas` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pinjaman`
--

INSERT INTO `pinjaman` (`pinjaman_id`, `anggota_id`, `jumlah`, `tenor`, `bunga_persen`, `status`, `tanggal_pengajuan`, `tanggal_persetujuan`, `disetujui_oleh`, `total_terbayar`, `tanggal_lunas`) VALUES
(1, 1, 1000000.00, 10, 1.50, 'disetujui', '2025-07-08', '2025-07-08', 2, 100000.00, NULL);

--
-- Triggers `pinjaman`
--
DELIMITER $$
CREATE TRIGGER `after_update_status_pinjaman` AFTER UPDATE ON `pinjaman` FOR EACH ROW BEGIN
  IF (NEW.status IN ('disetujui', 'ditolak')) AND (OLD.status != NEW.status) THEN
    INSERT INTO persetujuan_pinjaman (pinjaman_id, user_id, status, catatan)
    VALUES (NEW.pinjaman_id, NEW.disetujui_oleh, NEW.status, 'Auto log by trigger');
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_total_terbayar` AFTER UPDATE ON `pinjaman` FOR EACH ROW BEGIN
  IF NEW.total_terbayar >= NEW.jumlah AND NEW.status != 'lunas' THEN
    UPDATE pinjaman
    SET status = 'lunas',
        tanggal_lunas = CURRENT_DATE
    WHERE pinjaman_id = NEW.pinjaman_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `simpanan`
--

CREATE TABLE `simpanan` (
  `simpanan_id` int NOT NULL,
  `anggota_id` int DEFAULT NULL,
  `jenis_simpanan` enum('wajib','sukarela') NOT NULL,
  `jumlah` decimal(12,2) DEFAULT NULL,
  `tanggal_simpan` date DEFAULT NULL,
  `keterangan` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `simpanan`
--

INSERT INTO `simpanan` (`simpanan_id`, `anggota_id`, `jenis_simpanan`, `jumlah`, `tanggal_simpan`, `keterangan`) VALUES
(1, 1, 'wajib', 100000.00, '2025-07-08', 'Simpanan Wajib Bulan Ini'),
(2, 1, 'sukarela', 50000.00, '2025-07-08', 'Simpanan Sukarela');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_kas`
--

CREATE TABLE `transaksi_kas` (
  `transaksi_id` int NOT NULL,
  `tanggal` date DEFAULT NULL,
  `jenis_transaksi` enum('masuk','keluar') DEFAULT NULL,
  `sumber` enum('simpanan','angsuran','pinjaman','operasional','lainnya') DEFAULT NULL,
  `jumlah` decimal(12,2) DEFAULT NULL,
  `keterangan` text,
  `dibuat_oleh` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transaksi_kas`
--

INSERT INTO `transaksi_kas` (`transaksi_id`, `tanggal`, `jenis_transaksi`, `sumber`, `jumlah`, `keterangan`, `dibuat_oleh`) VALUES
(1, '2025-07-08', 'masuk', 'simpanan', 150000.00, 'Penerimaan Simpanan', 3),
(2, '2025-07-08', 'masuk', 'angsuran', 100000.00, 'Pembayaran Angsuran', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','ketua','bendahara','anggota') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `role`, `phone`, `address`, `status`, `created_at`) VALUES
(1, 'Ramdan', 'ramdan@gmail.com', '12345678', 'admin', '08129292911', 'jl. Raya Kalimulya', 'aktif', '2025-07-08 12:19:40'),
(2, 'Ali', 'ali@gmail.com', '12345678', 'ketua', '08122334345', 'jl. Raya Cikaret', 'aktif', '2025-07-09 00:58:35'),
(3, 'Andini', 'andini@gmail.com', '12345678', 'bendahara', '081294345352', 'Jl. Jatijajar', 'aktif', '2025-07-09 00:59:55'),
(4, 'iqbal', 'iqbal@gmail.com', '12345678', 'anggota', '08124234995', 'Jl. Merdeka Raya', 'aktif', '2025-07-09 01:04:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anggota`
--
ALTER TABLE `anggota`
  ADD PRIMARY KEY (`anggota_id`),
  ADD UNIQUE KEY `nomor_anggota` (`nomor_anggota`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `angsuran_pinjaman`
--
ALTER TABLE `angsuran_pinjaman`
  ADD PRIMARY KEY (`angsuran_id`),
  ADD KEY `pinjaman_id` (`pinjaman_id`);

--
-- Indexes for table `penarikan_simpanan`
--
ALTER TABLE `penarikan_simpanan`
  ADD PRIMARY KEY (`penarikan_id`),
  ADD KEY `anggota_id` (`anggota_id`);

--
-- Indexes for table `pengaturan_koperasi`
--
ALTER TABLE `pengaturan_koperasi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `persetujuan_pinjaman`
--
ALTER TABLE `persetujuan_pinjaman`
  ADD PRIMARY KEY (`persetujuan_id`),
  ADD KEY `pinjaman_id` (`pinjaman_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pinjaman`
--
ALTER TABLE `pinjaman`
  ADD PRIMARY KEY (`pinjaman_id`),
  ADD KEY `anggota_id` (`anggota_id`),
  ADD KEY `disetujui_oleh` (`disetujui_oleh`);

--
-- Indexes for table `simpanan`
--
ALTER TABLE `simpanan`
  ADD PRIMARY KEY (`simpanan_id`),
  ADD KEY `anggota_id` (`anggota_id`);

--
-- Indexes for table `transaksi_kas`
--
ALTER TABLE `transaksi_kas`
  ADD PRIMARY KEY (`transaksi_id`),
  ADD KEY `dibuat_oleh` (`dibuat_oleh`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anggota`
--
ALTER TABLE `anggota`
  MODIFY `anggota_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `angsuran_pinjaman`
--
ALTER TABLE `angsuran_pinjaman`
  MODIFY `angsuran_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `penarikan_simpanan`
--
ALTER TABLE `penarikan_simpanan`
  MODIFY `penarikan_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pengaturan_koperasi`
--
ALTER TABLE `pengaturan_koperasi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `persetujuan_pinjaman`
--
ALTER TABLE `persetujuan_pinjaman`
  MODIFY `persetujuan_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pinjaman`
--
ALTER TABLE `pinjaman`
  MODIFY `pinjaman_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `simpanan`
--
ALTER TABLE `simpanan`
  MODIFY `simpanan_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaksi_kas`
--
ALTER TABLE `transaksi_kas`
  MODIFY `transaksi_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anggota`
--
ALTER TABLE `anggota`
  ADD CONSTRAINT `anggota_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `angsuran_pinjaman`
--
ALTER TABLE `angsuran_pinjaman`
  ADD CONSTRAINT `angsuran_pinjaman_ibfk_1` FOREIGN KEY (`pinjaman_id`) REFERENCES `pinjaman` (`pinjaman_id`);

--
-- Constraints for table `penarikan_simpanan`
--
ALTER TABLE `penarikan_simpanan`
  ADD CONSTRAINT `penarikan_simpanan_ibfk_1` FOREIGN KEY (`anggota_id`) REFERENCES `anggota` (`anggota_id`);

--
-- Constraints for table `persetujuan_pinjaman`
--
ALTER TABLE `persetujuan_pinjaman`
  ADD CONSTRAINT `persetujuan_pinjaman_ibfk_1` FOREIGN KEY (`pinjaman_id`) REFERENCES `pinjaman` (`pinjaman_id`),
  ADD CONSTRAINT `persetujuan_pinjaman_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `pinjaman`
--
ALTER TABLE `pinjaman`
  ADD CONSTRAINT `pinjaman_ibfk_1` FOREIGN KEY (`anggota_id`) REFERENCES `anggota` (`anggota_id`),
  ADD CONSTRAINT `pinjaman_ibfk_2` FOREIGN KEY (`disetujui_oleh`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `simpanan`
--
ALTER TABLE `simpanan`
  ADD CONSTRAINT `simpanan_ibfk_1` FOREIGN KEY (`anggota_id`) REFERENCES `anggota` (`anggota_id`);

--
-- Constraints for table `transaksi_kas`
--
ALTER TABLE `transaksi_kas`
  ADD CONSTRAINT `transaksi_kas_ibfk_1` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
