-- CREATE DATABASE IF NOT EXISTS companydb;

-- USE companydb;

CREATE TABLE employee (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) DEFAULT NULL,
  salary INT(11) DEFAULT NULL, 
  PRIMARY KEY(id)
);

CREATE TABLE alumno (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) DEFAULT NULL,
  name VARCHAR(45) DEFAULT NULL,
  lastname VARCHAR(45) DEFAULT NULL,
  birthdate DATE DEFAULT NULL,
  age INT(11) DEFAULT NULL, 
  PRIMARY KEY(id)
);

CREATE TABLE teacher (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) DEFAULT NULL,
  name VARCHAR(45) DEFAULT NULL,
  lastname VARCHAR(45) DEFAULT NULL,
  birthdate DATE DEFAULT NULL,
  age INT(11) DEFAULT NULL, 
  avatar INT(11) DEFAULT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE tutor (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) DEFAULT NULL,
  name VARCHAR(45) DEFAULT NULL,
  lastname VARCHAR(45) DEFAULT NULL,
  birthdate DATE DEFAULT NULL,
  age INT(11) DEFAULT NULL, 
  avatar INT(11) DEFAULT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE course (
  id INT(11) NOT NULL AUTO_INCREMENT,
  teacher_id INT(11) DEFAULT NULL,
  name VARCHAR(45) DEFAULT NULL,
  schoolName VARCHAR(45) DEFAULT NULL,
  courseAge INT(11) DEFAULT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (teacher_id) REFERENCES teacher(id)
);

CREATE TABLE password_reset_code (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) DEFAULT NULL,
    code VARCHAR(10),
    expires_at DATETIME,
    used BOOLEAN DEFAULT FALSE
);

CREATE TABLE user (
  id INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(45) DEFAULT NULL,
  password VARCHAR(128) DEFAULT NULL,
  email VARCHAR(45) DEFAULT NULL,
  tutorEmail VARCHAR(45) DEFAULT NULL,
  rol VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY(id)
);

INSERT INTO user values 
  (1, 'ryanray', '123456', 'hijo@hijo.com', 'ramirich001@gmail.com', 'alumno'),
  (2, 'joemcmillan', '123456', '', 'ramirich001@gmail.com', 'alumno');

DESCRIBE employee;

INSERT INTO employee values 
  (1, 'Ryan Ray', 20000),
  (2, 'Joe McMillan', 40000),
  (3, 'John Carter', 50000);

SELECT * FROM employee;
