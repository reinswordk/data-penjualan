-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 12, 2022 at 06:04 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tokokomputer1`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `getSoldProductsByDate` (IN `selectedDate` DATE)  BEGIN
  SELECT s_produk.name `PRODUK`, 
    s_produk.price `HARGA PERSATUAN`,
    SUM(d_sale.qty) `QUANTITY`, 
    SUM(d_sale.qty) * s_produk.price `HARGA TOTAL`, 
    s_customer.full_name `CUSTOMER`
  FROM d_sale
  JOIN s_produk
  ON d_sale.product_id = s_produk.id
  JOIN s_customer
  ON s_customer.id = d_sale.customer_id
  WHERE d_sale.date = selectedDate
  GROUP BY s_produk.id;
END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `calculateDiscountedPrice` (`price` INT, `discountPercentage` INT) RETURNS INT(11) BEGIN
    DECLARE discountedPrice INT;
    
    SET discountedPrice = price * (100-discountPercentage)/100;

    RETURN discountedPrice;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `data_penjualan`
-- (See below for the actual view)
--
CREATE TABLE `data_penjualan` (
`PRODUK` varchar(60)
,`HARGA_SATUAN` int(11)
,`STOCK_TERJUAL` decimal(32,0)
,`TOTAL_PENDAPATAN` decimal(42,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `d_sale`
--

CREATE TABLE `d_sale` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `d_sale`
--

INSERT INTO `d_sale` (`id`, `product_id`, `customer_id`, `qty`, `date`) VALUES
(1, 1, 1, 10, '2022-01-23'),
(2, 2, 2, 10, '2022-01-23'),
(3, 3, 3, 10, '2022-01-25'),
(4, 4, 4, 10, '2022-01-26'),
(5, 5, 5, 10, '2022-01-27'),
(6, 1, 1, 3, '2022-01-23'),
(7, 5, 1, 3, '2022-02-10'),
(8, 3, 2, 7, '2022-02-10');

--
-- Triggers `d_sale`
--
DELIMITER $$
CREATE TRIGGER `after_d_sale_insert_then_insert_d_stock_out` AFTER INSERT ON `d_sale` FOR EACH ROW BEGIN
    INSERT INTO `d_stock_out`(`date_out`, `qty`, `product_id`) 
      VALUES (NEW.date,NEW.qty,NEW.product_id);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `d_stock`
--

CREATE TABLE `d_stock` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `total_qty` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `d_stock`
--

INSERT INTO `d_stock` (`id`, `product_id`, `total_qty`) VALUES
(1, 1, 10),
(2, 2, 10),
(3, 3, 3),
(4, 4, 10),
(5, 5, 7),
(6, 10, 0);

-- --------------------------------------------------------

--
-- Table structure for table `d_stock_in`
--

CREATE TABLE `d_stock_in` (
  `id` int(11) NOT NULL,
  `date_in` date NOT NULL,
  `qty` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `d_stock_in`
--

INSERT INTO `d_stock_in` (`id`, `date_in`, `qty`, `product_id`) VALUES
(1, '2022-01-22', 10, 1),
(2, '2022-01-10', 10, 2),
(3, '2022-01-13', 10, 3),
(4, '2022-01-15', 10, 4),
(5, '2022-01-17', 10, 5),
(6, '2022-01-15', 3, 1);

--
-- Triggers `d_stock_in`
--
DELIMITER $$
CREATE TRIGGER `after_d_stock_in_insert_then_add_product_stock_qty` AFTER INSERT ON `d_stock_in` FOR EACH ROW BEGIN

    DECLARE currentStockQty int;
    SELECT total_qty
    INTO currentStockQty
    FROM d_stock
    WHERE d_stock.product_id = NEW.product_id;

    IF (currentStockQty <> NEW.qty)
        THEN UPDATE d_stock SET total_qty = (currentStockQty + NEW.qty)
                WHERE NEW.product_id = d_stock.product_id;
    END IF;    
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `d_stock_out`
--

CREATE TABLE `d_stock_out` (
  `id` int(11) NOT NULL,
  `date_out` date NOT NULL,
  `qty` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `d_stock_out`
--

INSERT INTO `d_stock_out` (`id`, `date_out`, `qty`, `product_id`) VALUES
(1, '2022-01-23', 10, 1),
(2, '2022-01-23', 10, 2),
(3, '2022-01-23', 10, 3),
(4, '2022-01-23', 10, 4),
(5, '2022-01-23', 10, 5),
(6, '2022-01-17', 3, 1),
(7, '2022-02-10', 3, 5),
(8, '2022-02-10', 7, 3);

--
-- Triggers `d_stock_out`
--
DELIMITER $$
CREATE TRIGGER `after_stock_out_insert_then_subtract_product_stock_qty` AFTER INSERT ON `d_stock_out` FOR EACH ROW BEGIN

    DECLARE currentStockQty int;
    SELECT total_qty
    INTO currentStockQty
    FROM d_stock
    WHERE d_stock.product_id = NEW.product_id;

    IF (currentStockQty <> NEW.qty)
        THEN UPDATE d_stock SET total_qty = (currentStockQty - NEW.qty)
                WHERE NEW.product_id = d_stock.product_id;
    END IF;    
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `s_customer`
--

CREATE TABLE `s_customer` (
  `id` int(11) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `full_name` varchar(120) GENERATED ALWAYS AS (concat(`first_name`,' ',`last_name`)) VIRTUAL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `s_customer`
--

INSERT INTO `s_customer` (`id`, `first_name`, `last_name`) VALUES
(1, 'Adi', 'Alvadi'),
(2, 'Bayu', 'Sakti'),
(3, 'Cahya', 'Santoso'),
(4, 'Santi', 'Sulaswati'),
(5, 'Wahyu', 'Muhammad'),
(6, 'depan', 'belakang');

-- --------------------------------------------------------

--
-- Table structure for table `s_produk`
--

CREATE TABLE `s_produk` (
  `id` int(11) NOT NULL,
  `name` varchar(60) CHARACTER SET latin1 NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `s_produk`
--

INSERT INTO `s_produk` (`id`, `name`, `price`) VALUES
(1, 'SNSV', 15000),
(2, 'CER', 10000),
(3, 'Ephone', 10000),
(4, 'MZI', 20000),
(5, 'Zoomer', 25000),
(10, 'produk6', 20000);

--
-- Triggers `s_produk`
--
DELIMITER $$
CREATE TRIGGER `after_s_produk_insert_then_set_init_stock_to_zero` AFTER INSERT ON `s_produk` FOR EACH ROW BEGIN
    INSERT INTO `d_stock`(`product_id`,`total_qty`) 
      VALUES (NEW.id, 0);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure for view `data_penjualan`
--
DROP TABLE IF EXISTS `data_penjualan`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `data_penjualan`  AS SELECT `prdk`.`name` AS `PRODUK`, `prdk`.`price` AS `HARGA_SATUAN`, sum(`prdk_out`.`qty`) AS `STOCK_TERJUAL`, `prdk`.`price`* sum(`prdk_out`.`qty`) AS `TOTAL_PENDAPATAN` FROM (`s_produk` `prdk` join `d_stock_out` `prdk_out` on(`prdk`.`id` = `prdk_out`.`product_id`)) GROUP BY `prdk`.`id` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `d_sale`
--
ALTER TABLE `d_sale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `d_stock`
--
ALTER TABLE `d_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `d_stock_in`
--
ALTER TABLE `d_stock_in`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `d_stock_out`
--
ALTER TABLE `d_stock_out`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `s_customer`
--
ALTER TABLE `s_customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `s_produk`
--
ALTER TABLE `s_produk`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `d_sale`
--
ALTER TABLE `d_sale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `d_stock`
--
ALTER TABLE `d_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `d_stock_in`
--
ALTER TABLE `d_stock_in`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `d_stock_out`
--
ALTER TABLE `d_stock_out`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `s_customer`
--
ALTER TABLE `s_customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `s_produk`
--
ALTER TABLE `s_produk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `d_sale`
--
ALTER TABLE `d_sale`
  ADD CONSTRAINT `d_sale_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `s_customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `d_sale_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `s_produk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `d_stock`
--
ALTER TABLE `d_stock`
  ADD CONSTRAINT `d_stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `s_produk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `d_stock_in`
--
ALTER TABLE `d_stock_in`
  ADD CONSTRAINT `d_stock_in_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `s_produk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `d_stock_out`
--
ALTER TABLE `d_stock_out`
  ADD CONSTRAINT `d_stock_out_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `s_produk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
