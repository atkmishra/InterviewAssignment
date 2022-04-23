create database if not exists LoginApp;
create table if not exists users(
    'user_id' INT,
    'name' VARCHAR(255),
    'email_id' VARCHAR(255),
    'password' VARCHAR(255),
    'error_count' integer,
    'isLocked' boolean,
    PRIMARY KEY (user_id)
    );
insert into user values ('admin','admin@test.com','admin','0',false);