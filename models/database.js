const sqlite = require("node:sqlite");
const crypto = require("crypto");
const fs = require("fs");

const dbname = "database.db";
const initfnam = "initdb.sql";
var firstrun = 1;
const ratio = 0.7;

function sha256(data) {
	const h = crypto.createHash("sha256");
	h.update(data);
	return h.digest("hex");
}

if (firstrun)
{
	var db;
	if (fs.existsSync(dbname))
	{
		db = new sqlite.DatabaseSync(dbname);
	}
	else
	{
		console.log("Plik z baza danych nie istnieje, tworze nowy!");
		var initsql = fs.readFileSync(initfnam, "utf8");
		db = new sqlite.DatabaseSync(dbname);
		db.exec(initsql);
	}
	firstrun = 0;
}

function getUser(username)
{
	const stmt = db.prepare("SELECT * FROM users WHERE username=?");
    return stmt.get(username);
}

function getUserID(uid)
{
	const stmt = db.prepare("SELECT * FROM users WHERE uid=?");
    return stmt.get(uid);
}

function registerUser(username,password,money)
{
	const stmt = db.prepare("INSERT INTO users (username,password,money,bisadmin) VALUES (?,?,?,0)");
	return stmt.run(username, sha256(password), money).lastInsertRowid;
}

function loginUser(username, password)
{
	const stmt = db.prepare("SELECT * FROM users WHERE username=? AND password=?");
    return stmt.get(username, sha256(password));
}

function getCars()
{
	const stmt = db.prepare("SELECT * FROM cars");
	return stmt.all();
}

function searchCar(desc)
{
	const stmt = db.prepare("SELECT * FROM cars WHERE firma LIKE concat('%', ?, '%') OR model LIKE concat('%', ?, '%')");
	return stmt.all(desc, desc);
}

function getnumCars(cid)
{
	const stmt = db.prepare("SELECT num FROM carnum where cid = ?");
	var obj = stmt.get(cid);
	return obj.num;
}

function getCar(cid)
{
	const stmt = db.prepare("SELECT * FROM cars WHERE cid=?");
    return stmt.get(cid);
}

function getUserCar(uid, cid)
{
	const stmt = db.prepare("SELECT * FROM usercars WHERE uid = ? AND cid=?");
    return stmt.get(uid, cid);
}

function getallUserCars(uid)
{
	const stmt = db.prepare("SELECT cid,num FROM usercars WHERE uid = ?");
    return stmt.all(uid);
}

function addUserCar(uid, cid)
{
	var stmt;
	var cnum;
	var usc = getUserCar(uid, cid);
	if (usc)
	{
		cnum = usc.num + 1;
		stmt = db.prepare("UPDATE usercars SET num = ? WHERE uid = ? AND cid = ?");
		stmt.run(cnum, uid, cid);
	}
	else
	{
		stmt = db.prepare("INSERT INTO usercars (uid, cid, num) VALUES (?,?,?)");
		stmt.run(uid, cid, 1);
	}
}

function removeUserCar(uid, cid)
{
	var stmt;
	var cnum;
	var usc = getUserCar(uid, cid);
	cnum = usc.num - 1;
	stmt = db.prepare("UPDATE usercars SET num = ? WHERE uid = ? AND cid = ?");
	stmt.run(cnum, uid, cid);
}

function changenumCar(cid, val)
{
	var num = getnumCars(cid);
	var updnum = num + val;
	const stmt = db.prepare("UPDATE carnum SET num = ? WHERE cid = ?");
	stmt.run(updnum, cid);
}

function buyCar(uid, cid)
{
	var user = getUserID(uid);
	var car = getCar(cid);
	var updmoney = user.money - car.cena;
	const stmt = db.prepare("UPDATE users SET money = ? WHERE uid = ?");
	stmt.run(updmoney, uid);
	addUserCar(uid, cid);
	changenumCar(cid, -1);
}

function sellCar(uid, cid)
{
	var user = getUserID(uid);
	var car = getCar(cid);
	var updmoney = user.money + car.cena * ratio;
	const stmt = db.prepare("UPDATE users SET money = ? WHERE uid = ?");
	stmt.run(updmoney, uid);
	removeUserCar(uid, cid);
	changenumCar(cid, 1);
}

function changecena(cid, updcena)
{
	const stmt = db.prepare("UPDATE cars SET cena = ? WHERE cid = ?");
	stmt.run(updcena, cid);
}

function getlogs()
{
	const stmt = db.prepare("SELECT * FROM logs");
    return stmt.all();
}

function insertlog(username, model, cena, action)
{
	const stmt = db.prepare("INSERT INTO logs (username,model,cena,action,data) VALUES (?,?,?,?,datetime('now'))");
	if (action == "Sprzedaz")
	{
		cena = cena * ratio;
	}
	stmt.run(username, model, cena, action);
}

module.exports = {registerUser, loginUser, getUser, getUserCar, getCars, getCar, searchCar, getallUserCars, getnumCars, buyCar, sellCar, changecena, getlogs, insertlog};