-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: notestable
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `manageruser`
--

DROP TABLE IF EXISTS `manageruser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manageruser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `loginame` varchar(50) NOT NULL,
  `loginnum` varchar(50) NOT NULL,
  `loginpwd` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manageruser`
--

LOCK TABLES `manageruser` WRITE;
/*!40000 ALTER TABLE `manageruser` DISABLE KEYS */;
INSERT INTO `manageruser` VALUES (5,'John','zhangboheng','$2a$10$NM24Vg2wqsGdWrOD.CGTTuCmkVIadh6gS2qpAPEFmIhRsKNHO4O2i',NULL);
/*!40000 ALTER TABLE `manageruser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `note_history`
--

DROP TABLE IF EXISTS `note_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note_history` (
  `history_id` bigint NOT NULL AUTO_INCREMENT,
  `note_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` tinytext NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `note_id` (`note_id`),
  CONSTRAINT `note_history_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`note_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `note_history`
--

LOCK TABLES `note_history` WRITE;
/*!40000 ALTER TABLE `note_history` DISABLE KEYS */;
INSERT INTO `note_history` VALUES (37,10,'测试发达的身上','12213123','2024-10-09 05:12:33'),(38,10,'测试发达的身上','12213123','2024-10-09 05:12:33'),(39,10,'测试发达的身上','12213123','2024-10-09 05:12:33'),(40,10,'测试发达的身上','12213123','2024-10-09 05:12:33'),(41,10,'测试发达的身上','12213123','2024-10-09 05:12:33'),(44,10,'测试发达的身上','12213123','2024-10-09 05:12:34'),(45,10,'测试发达的身上','12213123','2024-10-09 05:12:49'),(46,10,'测试发达的adsf','12213123','2024-10-09 05:41:22'),(47,10,'测试发达的adsf','12213123sdfdsaf','2024-10-09 05:57:50'),(48,10,'New Note For You','12213123sdfdsaf','2024-10-09 06:20:25');
/*!40000 ALTER TABLE `note_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `note_id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`note_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `manageruser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (10,5,'New Note For You','12213123sdfdsaf','2024-10-06 19:20:17','2024-10-09 06:20:25'),(12,5,'New Note','','2024-10-08 08:01:47','2024-10-08 08:01:47'),(13,5,'New Note','57h','2024-10-08 08:09:54','2024-10-09 03:34:30'),(14,5,'New Note','','2024-10-09 05:45:46','2024-10-09 05:45:46'),(15,5,'New Note','','2024-10-09 05:45:46','2024-10-09 05:45:46'),(16,5,'New Note','','2024-10-09 05:45:47','2024-10-09 05:45:47'),(17,5,'New Note','','2024-10-09 05:45:47','2024-10-09 05:45:47'),(18,5,'New Note','','2024-10-09 05:45:47','2024-10-09 05:45:47'),(19,5,'New Note','','2024-10-09 05:45:48','2024-10-09 05:45:48');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'notestable'
--

--
-- Dumping routines for database 'notestable'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-09 22:27:56
