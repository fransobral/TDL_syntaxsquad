# Listar todas las bases de datos: \l
# Limpiar consola: \! cls
# Conectarse a la BD: \c tdl2023_db
# Listar tablas: \dt
# Datalle de una tabla: \d users

create database tdl2023_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL,
    password VARCHAR(16) NOT NULL,
    created TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status INT DEFAULT 1 CHECK (status IN (0, 1)),
    admin INT NOT NULL DEFAULT 0 CHECK (admin IN (0, 1))
);

-- Dato importante: Insertar usuario administrador con id 1 manualmente por base de datos, por endpoints se podra agregar solo usuarios no con rol admin nuestro proyecto soporta SOLO un admin
INSERT INTO 
    users (id, email, password, admin) 
VALUES (1,'oura@gmail.com', '123456', 1);
VALUES (2,'testbrian@gmail.com', '123456',0),
VALUES (3,'testbrian2023@gmail.com', 'AASDF',0);

DROP TABLE IF EXISTS user_movie;
CREATE TABLE user_movie (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    movie_id INTEGER NOT NULL,
    created TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status INT DEFAULT 1 CHECK (status IN (0, 1))
);

DROP TABLE IF EXISTS rated_movie;
CREATE TABLE rated_movie (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    movie_id INTEGER NOT NULL,
    liked INT CHECK (liked IN (0, 1)) NOT NULL,
    created TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status INT DEFAULT 1 CHECK (status IN (0, 1))  NOT NULL
);

-- insert into
--     users (email, password)
-- values
--     ('testbrian@gmail.com', 123456),
--     ('testbrian2023@gmail.com', 123456);