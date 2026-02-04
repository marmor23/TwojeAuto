CREATE TABLE users (uid INTEGER UNIQUE PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), money FLOAT, bisadmin BOOL);
INSERT INTO users (username,password,money,bisadmin) VALUES ('admin', '713bfda78870bf9d1b261f565286f85e97ee614efe5f0faf7c34e7ca4f65baca', 99999999999.99, 1);
INSERT INTO users (username,password,money,bisadmin) VALUES ('user', '05d49692b755f99c4504b510418efeeeebfd466892540f27acf9a31a326d6504', 300000, 0);

CREATE TABLE cars (cid INTEGER UNIQUE PRIMARY KEY, firma VARCHAR(255), model VARCHAR(255), rocznik INTEGER, cena FLOAT, opis VARCHAR(255));
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Fiat', '126', 1976, 2699.99, 'Fiat 126 to kultowy samochód popularny w Polsce w latach 70. oraz 80.');
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Peugeot', '206', 2005, 6899.99, 'Samochód osobowy klasy miejskiej produkowany przez francuską firmę Peugeot w latach 1998 - 2009');
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Ford', 'Mustang', 2007, 73999.99, 'Ford Mustang V generacji to sportowy samochód o mocy 210 koni mechanicznych');
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Citroen', 'C5X', 2021, 159999.99, 'Citroen C5X III generacji posiada miękkie fotele oraz 12-calowy ekran dotykowy. Wystepuje w wersji benzynowej oraz hybrydowej.');
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Polonez', 'MR87 1.5 SLE', 1987, 5999.99, 'Model po raz pierwszy zaprezentowano na międzynarodowych targach w Poznaniu. Silnik ma moc 87 koni mechanicznych.');
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Mercedes-Benz', 'W126', 1990, 12999.99, 'Samochód II generacji został gruntownie zmodernizowany. Posiada aerodynamiczny kształt i zawieszenie hydropneumatyczne.');
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Renault', 'Boreal', 2025, 259999.99, 'Renault Boreal to 5-cio drzwiowy SUV z wydajnym silnikiem oraz eleganckim wnętrzem.');
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Peugeot', '508', 2012, 129999.99, 'Peugeot 508 to wysokiej klasy samochód pozwalający osiągnąc prędkość do 250km/h Jest najlepiej sprzedającym się modelem firmy Peugeot');
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Fiat', '124', 1970, 1899.99, 'Fiat 124 to niewielki samochód osobowy produkowany przez włoską firmę Fiat od 1966 do 1974 roku');
INSERT INTO cars (firma,model,rocznik,cena,opis) VALUES ('Porsche', '911', 2019, 799999.99, 'Porsche 911 to elegancki, luksusowy i niezwykle szybki samochód sportowy z pojemnością silnika wynoszącą nawet 550 koni mechanicznych.');

CREATE TABLE usercars (uid INTEGER, cid INTEGER, num INTEGER);

CREATE TABLE carnum (cid INTEGER, num INTEGER);
INSERT INTO carnum (cid,num) VALUES (1, 24);
INSERT INTO carnum (cid,num) VALUES (2, 35);
INSERT INTO carnum (cid,num) VALUES (3, 11);
INSERT INTO carnum (cid,num) VALUES (4, 21);
INSERT INTO carnum (cid,num) VALUES (5, 9);
INSERT INTO carnum (cid,num) VALUES (6, 13);
INSERT INTO carnum (cid,num) VALUES (7, 17);
INSERT INTO carnum (cid,num) VALUES (8, 40);
INSERT INTO carnum (cid,num) VALUES (9, 51);
INSERT INTO carnum (cid,num) VALUES (10, 8);

CREATE TABLE logs (username VARCHAR(255), model VARCHAR(255), cena FLOAT, action VARCHAR(255), data VARCHAR(255));