-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 07-05-2024 a las 18:09:36
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `myaward`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `awards`
--

CREATE TABLE `awards` (
  `id` int NOT NULL,
  `award_name` varchar(250) COLLATE utf8mb4_spanish2_ci DEFAULT 'My award',
  `owner` binary(16) NOT NULL,
  `hash` text CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  `closed` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `awards`
--

INSERT INTO `awards` (`id`, `award_name`, `owner`, `hash`, `public`, `closed`) VALUES
(27, 'test', 0xbf220d94d42811eeb1fca8a15957a2c4, 'LixhHZDSisOphfRS1WzmtN3Kd2bzmGUFSDxc', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions`
--

CREATE TABLE `questions` (
  `id` binary(16) NOT NULL,
  `id_award` int NOT NULL,
  `question` text COLLATE utf8mb4_spanish2_ci NOT NULL,
  `question_type` int NOT NULL,
  `order_id` int NOT NULL,
  `url` text COLLATE utf8mb4_spanish2_ci,
  `mandatory` tinyint(1) NOT NULL DEFAULT '1',
  `question_choices` text COLLATE utf8mb4_spanish2_ci,
  `description` text COLLATE utf8mb4_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `questions`
--

INSERT INTO `questions` (`id`, `id_award`, `question`, `question_type`, `order_id`, `url`, `mandatory`, `question_choices`, `description`) VALUES
(0x00f8d82bee0a11ee9b27a8a15957a2c4, 27, 'PREGUNTA 1', 1, 1, 'https://i.ibb.co/3dm759X/434583602-1522624535133632-8474963987508253649-n.jpg', 1, 'chickblo12;fuka;edu;pipe', 'Por favor elija una sola respuesta.'),
(0x00fc974bee0a11ee9b27a8a15957a2c4, 27, 'que opina usted del sexo', 2, 2, 'https://i.ibb.co/kBzc7wz/Handdrawn-Circle-Logo.png', 0, 'fukacity;pablo loncon;pipe;edu;sus;another person;juliosteta', 'Por favor seleccione una o más de una alternativa.'),
(0x00ffe2fbee0a11ee9b27a8a15957a2c4, 27, 'PREGUNTA 3', 2, 3, NULL, 1, NULL, ''),
(0x0801fd33ef9011eea132a8a15957a2c4, 27, 'PREGUNTA 4', 2, 4, 'https://i.ibb.co/DK8Vf6Y/album-2024-04-08-22-33-16.gif', 1, NULL, '');

--
-- Disparadores `questions`
--
DELIMITER $$
CREATE TRIGGER `set_default_id` BEFORE INSERT ON `questions` FOR EACH ROW BEGIN
    SET NEW.id = UUID_TO_BIN(UUID());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions_types`
--

CREATE TABLE `questions_types` (
  `question_type_id` int NOT NULL,
  `question_type_name` varchar(250) COLLATE utf8mb4_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `questions_types`
--

INSERT INTO `questions_types` (`question_type_id`, `question_type_name`) VALUES
(1, 'radio'),
(2, 'checkbox'),
(3, 'color'),
(4, 'date'),
(5, 'rate'),
(6, 'input');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `responses`
--

CREATE TABLE `responses` (
  `id` int NOT NULL,
  `email` varchar(250) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `question_type` int NOT NULL,
  `user_response` text COLLATE utf8mb4_spanish2_ci,
  `question_id` binary(16) DEFAULT (uuid_to_bin(uuid())),
  `id_award` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` binary(16) NOT NULL,
  `email` varchar(250) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `user_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `email`, `user_id`) VALUES
(0x209df976af024847b58beb4957d1533d, 'pbolrebo@gmail.com', 0xac0072ddf9e311eeb86fa8a15957a2c4),
(0xd7df18674e93488aa8fb9b395c790c51, 'maatiaasbkn4@gmail.com', 0xbf220d94d42811eeb1fca8a15957a2c4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `username` varchar(250) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `email` varchar(250) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `pass` varchar(250) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `user_type` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `pass`, `user_type`) VALUES
(0x84dd774bf9e111eeb86fa8a15957a2c4, '1111', 'maatiaasbkn2@gmail.com2', '$2b$10$x8.NYDHo/Z8r84t5MpvbGOFIzliZPC5vWxWGwx7RWyS7Ap9apLASm', 1),
(0x8744ef6cf9dd11eeb86fa8a15957a2c4, 'test1', 'correoprueba@gmail.com', '$2b$10$7qkoxeB0gpz.TDgHNbAU5ehIthhqbqJ95XfUvKU6HnSdytC.FAdJu', 1),
(0x8a324d55d0ee11eead62a8a15957a2c4, 'fukashigi', 'maatiaasbkn3@gmail.com', '$2b$10$/dlCuBNKRMFh4T13oRxkCu7WUnJDUHUN2Cj6M7zQLtvR4Xs3/emNu', 1),
(0xac0072ddf9e311eeb86fa8a15957a2c4, 'Chickblo12', 'pbolrebo@gmail.com', '$2b$10$tINAhmmWn1a5oQrCt2nSC.tVL3PrhtIXrFdFNOxHZCYjJrzZowgWe', 1),
(0xbb621235f9e111eeb86fa8a15957a2c4, 'Shit', 'caca@gmqil.com', '$2b$10$cpJUELJg39gK0JMaxqlOy.QnLQQF49cunELhnCMkVuKX23CwYnpH.', 1),
(0xbf220d94d42811eeb1fca8a15957a2c4, 'fukashigi2', 'maatiaasbkn4@gmail.com', '$2b$10$zBE9gRygUVvMhB3tOh4Tx.RMI7g.b2i0K/kUnKjG4ZmO2IWLYVWDW', 1),
(0xd1096d02f9e011eeb86fa8a15957a2c4, '1', '1@gmail.com', '$2b$10$XGlLcgSMuVUzs8hZlROJ4.JfHp8dVUjF6spmAUkQMD9C5A2qjY1Li', 1),
(0xe8979cdcf9e011eeb86fa8a15957a2c4, '12', '1@gmail.com2', '$2b$10$ORT3MDjilCZo0.cyTcY.ZuTDyoMBElMF0QWZ15Gg8DrRvIjXeNoBS', 1),
(0xf3146ca1f9e011eeb86fa8a15957a2c4, '123', '1@gmail.com3', '$2b$10$jEqLd.WnrQOSpUtDN4zgsO5faRUSEiDSy2vNczVuTmVDnQRzYflLm', 1),
(0xfe1fe9decd0011eeb2f0a8a15957a2c4, 'asd123', 'maatiaasbkn2@gmail.comasd123', '$2b$10$wAK3dxWyyMQvz8ESEDl74.wANShIonm58kLdqL8VaE6YoG1z4welO', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_types`
--

CREATE TABLE `user_types` (
  `user_type_id` int NOT NULL,
  `user_type_name` varchar(250) COLLATE utf8mb4_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `user_types`
--

INSERT INTO `user_types` (`user_type_id`, `user_type_name`) VALUES
(1, 'Free account');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `awards`
--
ALTER TABLE `awards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner` (`owner`);

--
-- Indices de la tabla `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_award` (`id_award`),
  ADD KEY `question_type` (`question_type`);

--
-- Indices de la tabla `questions_types`
--
ALTER TABLE `questions_types`
  ADD PRIMARY KEY (`question_type_id`);

--
-- Indices de la tabla `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_type` (`question_type`),
  ADD KEY `id_award` (`id_award`),
  ADD KEY `question_id` (`question_id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `email` (`email`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD UNIQUE KEY `unique_username` (`username`),
  ADD KEY `fk_user_types` (`user_type`);

--
-- Indices de la tabla `user_types`
--
ALTER TABLE `user_types`
  ADD PRIMARY KEY (`user_type_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `awards`
--
ALTER TABLE `awards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `questions_types`
--
ALTER TABLE `questions_types`
  MODIFY `question_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `responses`
--
ALTER TABLE `responses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `user_types`
--
ALTER TABLE `user_types`
  MODIFY `user_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `awards`
--
ALTER TABLE `awards`
  ADD CONSTRAINT `awards_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`id_award`) REFERENCES `awards` (`id`),
  ADD CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`question_type`) REFERENCES `questions_types` (`question_type_id`);

--
-- Filtros para la tabla `responses`
--
ALTER TABLE `responses`
  ADD CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`question_type`) REFERENCES `questions_types` (`question_type_id`),
  ADD CONSTRAINT `responses_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  ADD CONSTRAINT `responses_ibfk_3` FOREIGN KEY (`id_award`) REFERENCES `awards` (`id`),
  ADD CONSTRAINT `responses_ibfk_4` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

--
-- Filtros para la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_types` FOREIGN KEY (`user_type`) REFERENCES `user_types` (`user_type_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
