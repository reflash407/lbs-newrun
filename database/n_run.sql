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
  #id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) PRIMARY KEY, #수정으로 이메일 추가
  username VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL,
  password VARCHAR(255),
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
  u_email VARCHAR(255),
  FOREIGN KEY (u_email) REFERENCES users(email)
    ON DELETE CASCADE 
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE route_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  start_date DATE,
  total_distance FLOAT,
  route LINESTRING,
  u_email VARCHAR(255),
  FOREIGN KEY (u_email) REFERENCES users(email)
    ON DELETE CASCADE 
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image_url VARCHAR(255),
  u_email VARCHAR(255),
  FOREIGN KEY (u_email) REFERENCES users(email)
    ON DELETE CASCADE 
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

#-------------------------더미 데이터--------------------------------------------------------

INSERT INTO crews (crew_name, crew_leader, crew_members, creation_date, weekly_distance)
VALUES
  ('팀 근범벅', '김근범', 5, '2023-05-01', 100),
  ('팀 근치기', '신근재', 3, '2023-05-01', 75);
  
  
  #10명의 더미 사용자
  INSERT INTO users (email, username, nickname, password, user_picture, goal_distance, crew_id)
VALUES
  ('a@naver.com', '김근범', '내가긴근번', 'password123', 'user1.jpg', 100, 1),
  ('b@naver.com', '아무개', '개무아', 'password456', 'user2.jpg', 150, 1),
  ('c@naver.com', '김철수', '철수파워', 'password789', 'user3.jpg', 200, 2),
  ('d@naver.com', '강나기', '당나귀', 'password123', 'user4.jpg', 120, 2),
  ('e@naver.com', '이용규', '용규놀이', 'password456', 'user5.jpg', 180, 1),
  ('f@naver.com', '이대호', 'fastman', 'password789', 'user6.jpg', 220, 1),
  ('g@naver.com', '김주찬', '멋지다주찬아', 'password123', 'user7.jpg', 90, 2),
  ('h@naver.com', '박찬호', '라이트토커', 'password456', 'user8.jpg', 170, 2),
  ('i@naver.com', '한상훈', '운동좋아', 'password789', 'user9.jpg', 210, 1),
  ('j@naver.com', '나주환', '이거진짜야', 'password123', 'user10.jpg', 130, 2);

#더미 운동 데이터
INSERT INTO run_record (date, distance, speed, run_time, route, u_email)
VALUES
  ('2023-06-01', 5.2, 8.3, '00:35:21', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 'a@naver.com'),
  ('2023-06-02', 6.7, 7.9, '00:45:10', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 'a@naver.com'),
  ('2023-06-03', 8.1, 9.2, '00:55:43', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 'a@naver.com'),
  ('2023-06-04', 4.5, 7.1, '00:30:45', ST_GeomFromText('LINESTRING(2 2, 3 3, 4 4)'), 'a@naver.com'),
  ('2023-06-05', 7.3, 8.5, '00:50:18', ST_GeomFromText('LINESTRING(5 5, 6 6, 7 7)'), 'a@naver.com'),
  ('2023-06-06', 6.9, 9.8, '00:48:27', ST_GeomFromText('LINESTRING(8 8, 9 9, 10 10)'), 'a@naver.com'),
  ('2023-06-01', 3.8, 6.7, '00:25:10', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 'b@naver.com'),
  ('2023-06-01', 5.1, 7.6, '00:35:43', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 'b@naver.com'),
  ('2023-06-02', 8.7, 9.9, '00:58:10', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 'c@naver.com'),
  ('2023-06-02', 3.8, 6.7, '00:25:10', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 'd@naver.com'),
  ('2023-06-02', 5.1, 7.6, '00:35:43', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 'e@naver.com'),
  ('2023-06-03', 8.7, 9.9, '00:58:10', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 'f@naver.com'),
  ('2023-06-03', 3.8, 6.7, '00:25:10', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 'g@naver.com'),
  ('2023-06-04', 5.1, 7.6, '00:35:43', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 'h@naver.com'),
  ('2023-06-04', 8.7, 9.9, '00:58:10', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 'i@naver.com'),
  ('2023-06-04', 4.2, 7.3, '00:28:35', ST_GeomFromText('LINESTRING(2 2, 3 3, 4 4)'), 'j@naver.com');


INSERT INTO route_images (start_date, total_distance, route, u_email)
VALUES
  ('2023-06-01', 5.2, ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 'a@naver.com'),
  ('2023-06-02', 6.7, ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 'b@naver.com'),
  ('2023-06-03', 8.1, ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 'c@naver.com');


INSERT INTO images (image_url, u_email)
VALUES
  (null, 'a@naver.com'),
  (null, 'b@naver.com'),
  (null, 'c@naver.com');

#더미 데이터 id 26
INSERT INTO run_record (date, distance, speed, run_time, route, u_email)
VALUES
  ('2023-06-09', 5.2, 8.3, '00:35:21', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3, 4 4, 5 5, 6 6, 7 7, 8 8, 9 9, 10 10, 11 11, 12 12, 13 13, 14 14, 15 15, 16 16, 17 17, 18 18, 19 19, 20 20, 30 30, 40 40, 50 50)'), 'a@naver.com');



INSERT INTO run_record (date, distance, speed, run_time, route, u_email)
VALUES
  ('2023-06-10', 5.2, 8.3, '00:35:21', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 'c@naver.com'),
  ('2023-06-10', 6.7, 7.9, '00:45:10', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 'd@naver.com'),
  ('2023-06-09', 8.1, 9.2, '00:55:43', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 'd@naver.com'),
  ('2023-06-09', 4.5, 7.1, '00:30:45', ST_GeomFromText('LINESTRING(2 2, 3 3, 4 4)'), 'e@naver.com'),
  ('2023-06-09', 7.3, 8.5, '00:50:18', ST_GeomFromText('LINESTRING(5 5, 6 6, 7 7)'), 'e@naver.com'),
  ('2023-06-09', 6.9, 9.8, '00:48:27', ST_GeomFromText('LINESTRING(8 8, 9 9, 10 10)'), 'f@naver.com'),
  ('2023-06-09', 3.8, 6.7, '00:25:10', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 'g@naver.com'),
  ('2023-06-09', 5.1, 7.6, '00:35:43', ST_GeomFromText('LINESTRING(4 4, 5 5, 6 6)'), 'h@naver.com'),
  ('2023-06-09', 8.7, 9.9, '00:58:10', ST_GeomFromText('LINESTRING(7 7, 8 8, 9 9)'), 'i@naver.com'),
  ('2023-06-09', 3.8, 6.7, '00:25:10', ST_GeomFromText('LINESTRING(1 1, 2 2, 3 3)'), 'j@naver.com');
  
  
  INSERT INTO run_record (date, distance, speed, run_time, route, u_email)
VALUES
  ('2023-06-11', 5.2, 8.3, '00:15:51', ST_GeomFromText('LINESTRING(36.141904 128.394639, 36.143174 128.393631, 36.143560 128.392778, 36.143984 128.392370, 36.145487 128.391882, 36.146618 128.391624, 36.147521 128.391490, 36.147519 128.392698, 36.147276 128.395198, 36.145231 128.394640, 36.143941 128.394211, 36.143438 128.394040)'), 'a@naver.com');