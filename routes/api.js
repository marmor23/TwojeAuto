var express = require('express');
var db = require("../models/database");
var {signjwt, loginRequired, adminRequired, cookiename} = require("../middleware/middleware");

var router = express.Router();

router.get("/api/cars", function(req, res, next) {
	var data = db.getCars();
	return res.json(data);
});

router.post("/api/cars", function(req, res, next) {
	var srch = req.body.srch;
	if (!srch) {
		return res.status(400).json({"error": "Podaj firme lub model samochodu"});
	}
	var found = db.searchCar(srch);
	return res.json(found ? found : []);
});

router.get("/api/car/:carid", function(req, res, next) {
	var cid = req.params.carid;
	if (cid != parseInt(cid, 10)) {
		return res.status(400).json({"error": "Nalezy podac liczbe!"});
	}
	var car = db.getCar(cid);
	if (!car) {
		return res.status(400).json({"error": "Samochod o podanym ID nie istnieje"});
	}
	return res.json(car);
});

router.get("/api/carnum/:carid", function(req, res, next) {
	var cid = req.params.carid;
	if (cid != parseInt(cid, 10)) {
		return res.status(400).json({"error": "Nalezy podac liczbe!"});
	}
	var car = db.getCar(cid);
	if (!car) {
		return res.status(400).json({"error": "Samochod o podanym ID nie istnieje"});
	}
	return res.json({num: db.getnumCars(cid)});
});

router.get("/api/mycar", loginRequired, function(req, res, next) {
	var usercar = db.getallUserCars(req.user.uid);
	return res.json(usercar ? usercar : []);
});

router.post("/api/buy", loginRequired, function(req, res, next) {
	var cid = req.body.cid;
	if (cid != parseInt(cid, 10)) {
		return res.status(400).json({"error": "Nalezy podac liczbe!"});
	}
	var user = db.getUser(req.user.username);
	var car = db.getCar(cid);
	if (!car) {
		return res.status(400).json({"error": "Samochod o podanym ID nie istnieje"});
	}
	if (db.getnumCars(cid) == 0) {
		return res.status(400).json({"error": "Salon aktualnie nie posiada tego samochodu"});
	}	
	if (user.money < car.cena) {
		return res.status(403).json({"error": "Nie masz wystarczajacych srodkow na koncie!"});
	}
	db.buyCar(user.uid, cid);
	db.insertlog(user.username, car.firma + " " + car.model, car.cena, "Kupno");
	return res.json({"success": "Zakupiono samochod"});
});

router.post("/api/sell", loginRequired, function(req, res, next) {
	var cid = req.body.cid;
	if (cid != parseInt(cid, 10)) {
		return res.status(400).json({"error": "Nalezy podac liczbe!"});
	}
	var user = db.getUser(req.user.username);
	var car = db.getCar(cid);
	if (!car) {
		return res.status(400).json({"error": "Samochod o podanym ID nie istnieje"});
	}
	var usc = db.getUserCar(user.uid, cid);
	if (!usc || usc.num == 0) {
		return res.status(400).json({"error": "Nie mozesz sprzedac samochodu ktorego nie posiadasz"});
	}
	db.sellCar(user.uid, cid);
	db.insertlog(user.username, car.firma + " " + car.model, car.cena, "Sprzedaz");
	return res.json({"success": "Sprzedano samochod"});
});

router.post("/api/changecena", [loginRequired, adminRequired], function (req, res, next) {
	var cid = req.body.cid;
	var updcena = req.body.cena;
	if (cid != parseInt(cid, 10)) {
		return res.status(400).json({"error": "Nalezy podac liczbe!"});
	}
	var car = db.getCar(cid);
	if (!car) {
		return res.status(400).json({"error": "Samochod o podanym ID nie istnieje"});
	}
	if (updcena != parseFloat(updcena)) {
		return res.status(400).json({"error": "Nalezy podac poprawna cene!"});
	}
	db.changecena(cid, updcena);
	return res.json({"success": "Zmieniono cene samochodu"});
});

router.get("/api/logs", [loginRequired, adminRequired], function (req, res, next) {
	var logs = db.getlogs();
	return res.json(logs ? logs : []);
});

module.exports = router;