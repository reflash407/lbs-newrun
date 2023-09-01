DROP DATABASE IF EXISTS rundb;

CREATE DATABASE IF NOT EXISTS rundb 
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

USE rundb;


CREATE TABLE crews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  crew_name VARCHAR(255),
  crew_leader VARCHAR(255),
  crew_members INT,
  creation_date DATE,
  weekly_distance FLOAT
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_picture VARCHAR(255),
  goal_distance FLOAT,
  crew_id INT,
  FOREIGN KEY (crew_id) REFERENCES crews(id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE run_record (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE NOT NULL,
  distance FLOAT NOT NULL,
  speed FLOAT,
  run_time TIME,
  route LINESTRING,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE 
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE route_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  start_date DATE,
  total_distance FLOAT,
  route LINESTRING,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE 
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image_url VARCHAR(255),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE 
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

#-------------------------더미 데이터--------------------------------------------------------

INSERT INTO crews (crew_name, crew_leader, crew_members, creation_date, weekly_distance)
VALUES
  ('Team A', 'John Doe', 5, '2023-05-01', 100),
  ('Team B', 'Jane Smith', 3, '2023-05-01', 75);
  
  
  #10명의 더미 사용자
  INSERT INTO users (username, nickname, password, user_picture, goal_distance, crew_id)
VALUES
  ('user1', 'User 1', 'password123', 'user1.jpg', 100, 1),
  ('user2', 'User 2', 'password456', 'user2.jpg', 150, 1),
  ('user3', 'User 3', 'password789', 'user3.jpg', 200, 2),
  ('user4', 'User 4', 'password123', 'user4.jpg', 120, 2),
  ('user5', 'User 5', 'password456', 'user5.jpg', 180, 1),
  ('user6', 'User 6', 'password789', 'user6.jpg', 220, 1),
  ('user7', 'User 7', 'password123', 'user7.jpg', 90, 2),
  ('user8', 'User 8', 'password456', 'user8.jpg', 170, 2),
  ('user9', 'User 9', 'password789', 'user9.jpg', 210, 1),
  ('user10', 'User 10', 'password123', 'user10.jpg', 130, 2);

#더미 운동 데이터
INSERT INTO run_record (date, distance, speed, run_time, route, user_id)
VALUES
  ('2023-06-01', 5.2, 8.3, '00:35:21', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 1),
  ('2023-06-02', 6.7, 7.9, '00:45:10', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 1),
  ('2023-06-03', 8.1, 9.2, '00:55:43', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 1),
  ('2023-06-04', 4.5, 7.1, '00:30:45', ST_GeomFromText('LINESTRING(2 2, 3 3, 4 4)'), 1),
  ('2023-06-05', 7.3, 8.5, '00:50:18', ST_GeomFromText('LINESTRING(5 5, 6 6, 7 7)'), 1),
  ('2023-06-06', 6.9, 9.8, '00:48:27', ST_GeomFromText('LINESTRING(8 8, 9 9, 10 10)'), 1),
  ('2023-06-01', 3.8, 6.7, '00:25:10', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 2),
  ('2023-06-01', 5.1, 7.6, '00:35:43', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 2),
  ('2023-06-02', 8.7, 9.9, '00:58:10', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 3),
  ('2023-06-02', 3.8, 6.7, '00:25:10', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 4),
  ('2023-06-02', 5.1, 7.6, '00:35:43', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 5),
  ('2023-06-03', 8.7, 9.9, '00:58:10', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 6),
  ('2023-06-03', 3.8, 6.7, '00:25:10', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 7),
  ('2023-06-04', 5.1, 7.6, '00:35:43', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 8),
  ('2023-06-04', 8.7, 9.9, '00:58:10', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 9),
  ('2023-06-04', 4.2, 7.3, '00:28:35', ST_GeomFromText('LINESTRING(2 2, 3 3, 4 4)'), 10);


INSERT INTO route_images (start_date, total_distance, route, user_id)
VALUES
  ('2023-06-01', 5.2, ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 1),
  ('2023-06-02', 6.7, ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 2),
  ('2023-06-03', 8.1, ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 3);


INSERT INTO images (image_url, user_id)
VALUES
  (null, 1),
  (null, 2),
  (null, 3);

#더미 데이터 id 26
INSERT INTO run_record (date, distance, speed, run_time, route, user_id)
VALUES
  ('2023-06-01', 5.2, 8.3, '00:35:21', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3, 4 4, 5 5, 6 6, 7 7, 8 8, 9 9, 10 10, 11 11, 12 12, 13 13, 14 14, 15 15, 16 16, 17 17, 18 18, 19 19, 20 20, 30 30, 40 40, 50 50)'), 1);



