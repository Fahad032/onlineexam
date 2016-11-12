-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2016 at 04:55 PM
-- Server version: 5.7.11
-- PHP Version: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_exam`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer_options`
--

CREATE TABLE `answer_options` (
  `id` int(15) NOT NULL,
  `question_id` int(15) NOT NULL,
  `details` varchar(100) NOT NULL,
  `correct` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `answer_options`
--

INSERT INTO `answer_options` (`id`, `question_id`, `details`, `correct`, `created_at`, `updated_at`) VALUES
(1, 1, 'Software Development Life Cycle', 1, '2016-11-05 00:00:00', '2016-11-06 10:05:08'),
(2, 1, 'System Development Life Cycle', 0, '2016-11-06 00:00:00', '2016-11-06 10:18:03'),
(3, 1, 'System Design Life Cycle', 0, '2016-11-06 04:43:53', '2016-11-06 10:43:53'),
(14, 1, 'Software Design Life Cycledfasdfas', 0, '2016-11-12 14:45:44', '2016-11-12 15:59:22'),
(23, 1, 'Software Design Life Cycle', 1, '2016-11-12 15:33:38', '2016-11-12 16:01:19'),
(24, 18, 'Artificial Intellegence', 1, '2016-11-12 16:46:05', '2016-11-12 22:46:05'),
(25, 18, 'Architectural Intellegence', 0, '2016-11-12 16:48:56', '2016-11-12 22:48:56'),
(26, 18, 'Aircraft Integration', 0, '2016-11-12 16:49:55', '2016-11-12 22:49:55');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(15) NOT NULL,
  `subject_id` int(15) NOT NULL,
  `title` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `subject_id`, `title`, `created_at`, `updated_at`) VALUES
(1, 30, 'What does SDLC mean ?', '2016-10-21 18:19:37', '2016-10-22 00:19:37'),
(2, 30, 'What does SDLC mean ?', '2016-10-21 18:21:27', '2016-10-22 00:21:27'),
(3, 30, 'What does SDLC mean ?', '2016-10-21 18:21:59', '2016-10-22 00:21:59'),
(6, 30, 'What does SDLC mean', '2016-10-21 18:30:13', '2016-10-22 00:30:13'),
(7, 30, 'What does SDLC mean', '2016-10-24 16:20:34', '2016-10-24 22:20:34'),
(8, 2, 'What is Nural Network', '2016-10-25 16:00:10', '2016-10-25 22:00:10'),
(9, 31, 'What does SDLC mean', '2016-10-31 15:31:12', '2016-10-31 15:58:03'),
(12, 31, 'Another question on Software Engineering', '2016-10-31 16:17:35', '2016-10-31 16:50:54'),
(16, 31, 'What does SDLC mean ?', '2016-10-31 17:59:07', '2016-10-31 23:59:07'),
(18, 34, 'What does AI mean', '2016-11-12 16:41:20', '2016-11-12 16:41:48');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(15) NOT NULL,
  `role` varchar(15) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Admin', '2016-10-18 00:00:00', '2016-10-18 23:01:29'),
(2, 'User', '2016-10-18 00:00:00', '2016-10-18 23:01:51');

-- --------------------------------------------------------

--
-- Table structure for table `role_user`
--

CREATE TABLE `role_user` (
  `id` int(15) NOT NULL,
  `user_id` int(15) NOT NULL,
  `role_id` int(15) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role_user`
--

INSERT INTO `role_user` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 2, 2, '2016-11-11 00:00:00', '2016-11-01 15:38:13'),
(2, 1, 1, '2016-11-03 00:00:00', '2016-11-03 05:23:27');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(15) NOT NULL,
  `title` varchar(50) NOT NULL,
  `scale` float NOT NULL,
  `total_question` int(15) NOT NULL,
  `test_duration` varchar(25) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `title`, `scale`, `total_question`, `test_duration`, `created_at`, `updated_at`) VALUES
(2, 'Neural Network', 4, 20, '40min Max', '2016-10-19 16:42:49', '2016-10-19 22:42:49'),
(26, 'System Analysis & Design', 4, 40, '40 min Max', '2016-10-21 05:34:15', '2016-10-21 11:34:15'),
(27, 'Data Structure & Algorithm', 4, 40, '40 min Max', '2016-10-21 05:36:01', '2016-10-21 11:36:01'),
(28, 'Java Programing', 4, 40, '40 min Max', '2016-10-21 05:38:26', '2016-10-21 11:38:26'),
(34, 'Artificial Intellegence', 4, 40, '40 min Max', '2016-11-12 16:40:13', '2016-11-12 22:40:13'),
(30, 'Multimedia & Image Processing', 4, 40, '40 min Max', '2016-10-21 14:28:12', '2016-10-21 19:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(15) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(32) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `created_at`, `updated_at`) VALUES
(1, 'Jhon Doe', 'jhondoe@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', '01675230320', '2016-10-18 00:00:00', '2016-10-18 23:04:55'),
(2, 'Fahad', 'fhdplsh032@gmail.com', '5f4dcc3b5aa765d61d8327deb882cf99', '01675230320', '2016-10-18 00:00:00', '2016-10-18 23:08:25');

-- --------------------------------------------------------

--
-- Table structure for table `user_test`
--

CREATE TABLE `user_test` (
  `id` int(15) NOT NULL,
  `user_id` int(15) NOT NULL,
  `subject_id` int(15) NOT NULL,
  `score` float NOT NULL,
  `total_correct_answer` int(15) NOT NULL,
  `total_wrong_answer` int(15) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer_options`
--
ALTER TABLE `answer_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_test`
--
ALTER TABLE `user_test`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answer_options`
--
ALTER TABLE `answer_options`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `role_user`
--
ALTER TABLE `role_user`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `user_test`
--
ALTER TABLE `user_test`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
