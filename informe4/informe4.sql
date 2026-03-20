-- Crear base de datos
CREATE DATABASE IF NOT EXISTS pi_proyecto;
USE pi_proyecto;

-- ELIMINAR TABLAS EXISTENTES (en orden correcto)
DROP TABLE IF EXISTS comentario;
DROP TABLE IF EXISTS publicacion;
DROP TABLE IF EXISTS curso_aprobado;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS curso;
DROP TABLE IF EXISTS catedratico;



-- Continuar creando tablas
DROP TABLE IF EXISTS curso;
DROP TABLE IF EXISTS catedratico;

-- Tabla CATEDRATICO
CREATE TABLE catedratico (
    id_catedratico INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(25),
    apellido VARCHAR(25),
    departamento VARCHAR(50),
    PRIMARY KEY (id_catedratico)
);

-- Tabla CURSO
CREATE TABLE curso (
    id_curso INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100),
    creditos INT,
    semestre INT,
    PRIMARY KEY (id_curso)
);

-- Tabla USUARIO
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT NOT NULL,
    registro_academico VARCHAR(75),
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATE,
    PRIMARY KEY (id_usuario),
    UNIQUE (correo)
);

-- Tabla PUBLICACION
CREATE TABLE publicacion (
    id_publicacion INT AUTO_INCREMENT NOT NULL,
    mensaje TEXT,
    fecha_publicacion DATE,
    curso_id_curso INT,
    catedratico_id_catedratico INT,
    usuario_id_usuario INT NOT NULL,
    PRIMARY KEY (id_publicacion),
    FOREIGN KEY (curso_id_curso) REFERENCES curso(id_curso),
    FOREIGN KEY (catedratico_id_catedratico) REFERENCES catedratico(id_catedratico),
    FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla COMENTARIO
CREATE TABLE comentario (
    id_comentario INT AUTO_INCREMENT NOT NULL,
    mensaje TEXT,
    fecha DATE,
    usuario_id_usuario INT NOT NULL,
    publicacion_id_publicacion INT NOT NULL,
    PRIMARY KEY (id_comentario),
    FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (publicacion_id_publicacion) REFERENCES publicacion(id_publicacion)
);

-- Tabla CURSO_APROBADO
CREATE TABLE curso_aprobado (
    id_curso_aprobado INT AUTO_INCREMENT NOT NULL,
    nota FLOAT,
    fecha_aprobacion DATE,
    usuario_id_usuario INT NOT NULL,
    curso_id_curso INT NOT NULL,
    PRIMARY KEY (id_curso_aprobado),
    FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (curso_id_curso) REFERENCES curso(id_curso)
);

-- Insertar datos de prueba
INSERT INTO curso (nombre, creditos, semestre) VALUES 
('Introducción a la Programación', 4, 1),
('Estructuras de Datos', 4, 3),
('Bases de Datos 1', 4, 4),
('Redes de Computadoras', 4, 5),
('Ingeniería de Software', 4, 6);

INSERT INTO catedratico (nombre, apellido, departamento) VALUES 
('Inga. Floriza', 'Avila', 'Computación'),
('Ing. Edgar', 'Sic', 'Computación'),
('Inga. Dora', 'Castañeda', 'Computación');

-- Verificar datos insertados
SELECT * FROM curso;
SELECT * FROM catedratico;
SELECT * FROM usuario;

-- Ver todos los comentarios
SELECT * FROM comentario;

SELECT id_usuario, registro_academico, correo, password 
FROM usuario 
WHERE registro_academico = '20240605541';

-- Ver cursos aprobados con detalles
SELECT u.nombres, u.apellidos, c.nombre as curso, ca.nota, ca.fecha_aprobacion
FROM curso_aprobado ca
JOIN usuario u ON ca.usuario_id_usuario = u.id_usuario
JOIN curso c ON ca.curso_id_curso = c.id_curso;

-- Ver publicaciones con sus comentarios
SELECT p.id_publicacion, p.mensaje as publicacion, 
       COUNT(c.id_comentario) as total_comentarios
FROM publicacion p
LEFT JOIN comentario c ON p.id_publicacion = c.publicacion_id_publicacion
GROUP BY p.id_publicacion;

