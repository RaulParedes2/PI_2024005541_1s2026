/*http://localhost:5173/
*/
-- Generado por Oracle SQL Developer Data Modeler 24.3.1.351.0831
--   en:        2026-03-12 10:08:49 CST
--   sitio:      Oracle Database 11g
--   tipo:      Oracle Database 11g



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

-- CREAR TABLAS
CREATE TABLE CATEDRATICO (
    id_catedratico NUMBER NOT NULL,
    nombre         VARCHAR2(100),
    apellido       VARCHAR2(100),
    departamento   VARCHAR2(100)
);

ALTER TABLE CATEDRATICO ADD CONSTRAINT CATEDRATICO_PK PRIMARY KEY (id_catedratico);

CREATE TABLE CURSO (
    id_curso NUMBER NOT NULL,  
    nombre   VARCHAR2(100),
    creditos NUMBER,
    semestre NUMBER
);

ALTER TABLE CURSO ADD CONSTRAINT CURSO_PK PRIMARY KEY (id_curso); 

CREATE TABLE USUARIO (
    id_usuario         NUMBER NOT NULL,
    registro_academico VARCHAR2(100),
    nombres            VARCHAR2(100),
    apellidos          VARCHAR2(100),
    correo             VARCHAR2(100),
    password           VARCHAR2(255),
    fecha_registro     DATE
);

ALTER TABLE USUARIO ADD CONSTRAINT USUARIO_PK PRIMARY KEY (id_usuario);

CREATE TABLE PUBLICACION (
    id_publicacion             NUMBER NOT NULL,
    usuario_id_usuario         NUMBER NOT NULL, 
    catedratico_id_catedratico NUMBER NOT NULL, 
    curso_id_curso             NUMBER NOT NULL, 
    mensaje                    CLOB NOT NULL,
    fecha_publicacion          DATE
);

ALTER TABLE PUBLICACION ADD CONSTRAINT PUBLICACION_PK PRIMARY KEY (id_publicacion);

CREATE TABLE CURSO_APROBADO (
    id_curso_aprobado  NUMBER NOT NULL,
    nota               NUMBER,
    fecha_aprobacion   DATE,
    usuario_id_usuario NUMBER NOT NULL, 
    curso_id_curso     NUMBER NOT NULL  
);

ALTER TABLE CURSO_APROBADO ADD CONSTRAINT CURSO_APROBADO_PK PRIMARY KEY (id_curso_aprobado);

CREATE TABLE COMENTARIO (
    id_comentario              NUMBER NOT NULL,
    publicacion_id_publicacion NUMBER NOT NULL,
    mensaje                    CLOB,
    usuario_id_usuario         NUMBER NOT NULL, 
    fecha                      DATE
);

ALTER TABLE COMENTARIO ADD CONSTRAINT COMENTARIO_PK PRIMARY KEY (id_comentario);


-- AGREGAR LLAVES FORÁNEAS
ALTER TABLE PUBLICACION 
ADD CONSTRAINT PUBLICACION_USUARIO_FK FOREIGN KEY (usuario_id_usuario) 
REFERENCES USUARIO (id_usuario);

ALTER TABLE PUBLICACION 
ADD CONSTRAINT PUBLICACION_CATEDRATICO_FK FOREIGN KEY (catedratico_id_catedratico) 
REFERENCES CATEDRATICO (id_catedratico);

ALTER TABLE PUBLICACION 
ADD CONSTRAINT PUBLICACION_CURSO_FK FOREIGN KEY (curso_id_curso) 
REFERENCES CURSO (id_curso);

ALTER TABLE CURSO_APROBADO 
ADD CONSTRAINT CURSO_APROBADO_USUARIO_FK FOREIGN KEY (usuario_id_usuario) 
REFERENCES USUARIO (id_usuario);

ALTER TABLE CURSO_APROBADO 
ADD CONSTRAINT CURSO_APROBADO_CURSO_FK FOREIGN KEY (curso_id_curso) 
REFERENCES CURSO (id_curso);


ALTER TABLE COMENTARIO 
ADD CONSTRAINT COMENTARIO_PUBLICACION_FK FOREIGN KEY (publicacion_id_publicacion) 
REFERENCES PUBLICACION (id_publicacion);

ALTER TABLE COMENTARIO 
ADD CONSTRAINT COMENTARIO_USUARIO_FK FOREIGN KEY (usuario_id_usuario) 
REFERENCES USUARIO (id_usuario);

-- CREAR SECUENCIAS PARA AUTO-INCREMENTO
CREATE SEQUENCE SEQ_CATEDRATICO START WITH 1 INCREMENT BY 1 NOMAXVALUE;
CREATE SEQUENCE SEQ_CURSO START WITH 1 INCREMENT BY 1 NOMAXVALUE;
CREATE SEQUENCE SEQ_USUARIO START WITH 1 INCREMENT BY 1 NOMAXVALUE;
CREATE SEQUENCE SEQ_PUBLICACION START WITH 1 INCREMENT BY 1 NOMAXVALUE;
CREATE SEQUENCE SEQ_CURSO_APROBADO START WITH 1 INCREMENT BY 1 NOMAXVALUE;
CREATE SEQUENCE SEQ_COMENTARIO START WITH 1 INCREMENT BY 1 NOMAXVALUE;

-- CREAR TRIGGERS PARA AUTO-INCREMENTO
CREATE OR REPLACE TRIGGER TRG_CATEDRATICO_BI
BEFORE INSERT ON CATEDRATICO FOR EACH ROW
BEGIN
    SELECT SEQ_CATEDRATICO.NEXTVAL INTO :NEW.id_catedratico FROM DUAL;
END;
/

CREATE OR REPLACE TRIGGER TRG_CURSO_BI
BEFORE INSERT ON CURSO FOR EACH ROW
BEGIN
    SELECT SEQ_CURSO.NEXTVAL INTO :NEW.id_curso FROM DUAL;
END;
/

CREATE OR REPLACE TRIGGER TRG_USUARIO_BI
BEFORE INSERT ON USUARIO FOR EACH ROW
BEGIN
    SELECT SEQ_USUARIO.NEXTVAL INTO :NEW.id_usuario FROM DUAL;
END;
/

CREATE OR REPLACE TRIGGER TRG_PUBLICACION_BI
BEFORE INSERT ON PUBLICACION FOR EACH ROW
BEGIN
    SELECT SEQ_PUBLICACION.NEXTVAL INTO :NEW.id_publicacion FROM DUAL;
END;
/

CREATE OR REPLACE TRIGGER TRG_CURSO_APROBADO_BI
BEFORE INSERT ON CURSO_APROBADO FOR EACH ROW
BEGIN
    SELECT SEQ_CURSO_APROBADO.NEXTVAL INTO :NEW.id_curso_aprobado FROM DUAL;
END;
/

CREATE OR REPLACE TRIGGER TRG_COMENTARIO_BI
BEFORE INSERT ON COMENTARIO FOR EACH ROW
BEGIN
    SELECT SEQ_COMENTARIO.NEXTVAL INTO :NEW.id_comentario FROM DUAL;
END;
/

COMMIT;
/



-- Informe de Resumen de Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                             6
-- CREATE INDEX                             0
-- ALTER TABLE                             12
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                          0
-- CREATE MATERIALIZED VIEW                 0
-- CREATE MATERIALIZED VIEW LOG             0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   0
-- WARNINGS                                 0
