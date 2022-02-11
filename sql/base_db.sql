-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 04, 2021 at 10:16 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flowmeter_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `groupId` int(11) NOT NULL,
  `groupName` varchar(64) DEFAULT NULL,
  `groupLevel` tinyint(3) UNSIGNED NOT NULL DEFAULT 255
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `auth_group`
--

INSERT INTO `auth_group` (`groupId`, `groupName`, `groupLevel`) VALUES
(0, 'superadmin', 0),
(1, 'admin', 1),
(2, 'customer', 10),
(3, 'sales', 10),
(4, 'driver', 255),
(5, 'flowmeter-device', 10);

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_access`
--

CREATE TABLE `auth_group_access` (
  `gracGroupId` int(11) NOT NULL,
  `gracAllowedPath` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `auth_group_access`
--

INSERT INTO `auth_group_access` (`gracGroupId`, `gracAllowedPath`) VALUES
(1, '/api'),
(5, '/api/device'),
(5, '/api/ticket');

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_menu`
--

CREATE TABLE `auth_group_menu` (
  `menuId` smallint(6) UNSIGNED NOT NULL,
  `menuName` varchar(64) CHARACTER SET latin1 DEFAULT NULL,
  `menuIcon` varchar(64) DEFAULT NULL,
  `menuLink` varchar(72) DEFAULT NULL,
  `menuGroup` int(11) DEFAULT NULL,
  `menuOrder` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `menuParentMenuId` smallint(6) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `auth_group_menu`
--

INSERT INTO `auth_group_menu` (`menuId`, `menuName`, `menuIcon`, `menuLink`, `menuGroup`, `menuOrder`, `menuParentMenuId`) VALUES
(1, 'Tickets', 'far fa-file text-success', NULL, NULL, 1, NULL),
(5, 'Create New', 'far fa-file text-success', '/ticket/create', 1, 0, 1),
(8, 'List', 'far fa-file text-success', '/ticket/list', 1, 1, 1),
(9, 'Customers', 'far fa-user text-success', NULL, NULL, 2, NULL),
(10, 'List', 'far fa-user text-success', '/customer/list', 1, 1, 9),
(11, 'Create New', 'far fa-user text-success', '/customer/create', 1, 0, 9);

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `userId` int(11) NOT NULL,
  `userName` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL,
  `password` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL,
  `userTimestampCreates` timestamp NOT NULL DEFAULT current_timestamp(),
  `userLastAccess` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`userId`, `userName`, `password`, `userTimestampCreates`, `userLastAccess`) VALUES
(1, 'contoh', 'e84d7d98513858e1179014c83d1ee3ae46955a22ada7f324a37ea41a6ff5e298', '2020-10-13 03:51:05', '2021-02-26 06:48:35'),
(7, 'FM_7a180b7579944544b9c46a61fac27452', 'f9bbc9bfd0cc13aa5e61c0fee318021a9bcbc80d79b50d493234c78d1865e27b', '2021-02-22 03:45:54', '2021-02-23 08:54:15'),
(8, 'cust01', 'e84d7d98513858e1179014c83d1ee3ae46955a22ada7f324a37ea41a6ff5e298', '2021-02-23 04:13:48', NULL),
(9, 'drv01', 'e84d7d98513858e1179014c83d1ee3ae46955a22ada7f324a37ea41a6ff5e298', '2021-02-23 04:14:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_group`
--

CREATE TABLE `auth_user_group` (
  `userName` varchar(64) NOT NULL,
  `groupId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `auth_user_group`
--

INSERT INTO `auth_user_group` (`userName`, `groupId`) VALUES
('contoh', 1),
('cust01', 2),
('drv01', 4),
('FM_7a180b7579944544b9c46a61fac27452', 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`groupId`),
  ADD UNIQUE KEY `groupName` (`groupName`),
  ADD KEY `groupLevel` (`groupLevel`);

--
-- Indexes for table `auth_group_access`
--
ALTER TABLE `auth_group_access`
  ADD PRIMARY KEY (`gracGroupId`,`gracAllowedPath`),
  ADD KEY `gracGroupId` (`gracGroupId`);

--
-- Indexes for table `auth_group_menu`
--
ALTER TABLE `auth_group_menu`
  ADD PRIMARY KEY (`menuId`),
  ADD UNIQUE KEY `menuLink` (`menuLink`,`menuGroup`),
  ADD KEY `menuParentMenuId` (`menuParentMenuId`),
  ADD KEY `menuName` (`menuName`) USING BTREE,
  ADD KEY `menuGroup` (`menuGroup`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `userName` (`userName`),
  ADD KEY `userName_2` (`userName`,`password`);

--
-- Indexes for table `auth_user_group`
--
ALTER TABLE `auth_user_group`
  ADD PRIMARY KEY (`userName`,`groupId`),
  ADD KEY `userName` (`userName`),
  ADD KEY `groupId` (`groupId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `groupId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `auth_group_menu`
--
ALTER TABLE `auth_group_menu`
  MODIFY `menuId` smallint(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_access`
--
ALTER TABLE `auth_group_access`
  ADD CONSTRAINT `gracGroupId` FOREIGN KEY (`gracGroupId`) REFERENCES `auth_group` (`groupId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `auth_group_menu`
--
ALTER TABLE `auth_group_menu`
  ADD CONSTRAINT `menuGroupId` FOREIGN KEY (`menuGroup`) REFERENCES `auth_group` (`groupId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `menuParentMenuId` FOREIGN KEY (`menuParentMenuId`) REFERENCES `auth_group_menu` (`menuId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `auth_user_group`
--
ALTER TABLE `auth_user_group`
  ADD CONSTRAINT `usgrGroupId` FOREIGN KEY (`groupId`) REFERENCES `auth_group` (`groupId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usgrUserName` FOREIGN KEY (`userName`) REFERENCES `auth_user` (`userName`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
