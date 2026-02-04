var express = require('express');
var db = require("../models/database");
var {signjwt, loginRequired, adminRequired, cookiename} = require("../middleware/middleware");

var router = express.Router();

router.get("/", function(req, res, next) {
	res.render("index", {user: req.user});
});

router.get("/login", function(req, res, next) {
	res.render("login");
});

router.post("/login", function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	if (!username || !password) {
		return res.status(400).render("login", {error: "Nalezy podac nazwe uzytkownika oraz haslo!"});
	}
	if (!/^[a-zA-Z0-9]*$/.test(username)) {
		return res.status(400).render("login", {error: "Nazwa uzytkownika moze skladac sie jedynie ze znakow alfanumerycznych!"});
	}
	var user = db.loginUser(username, password);
	if (!user) {
		return res.status(400).render("login", {error: "Nieprawidlowy login lub haslo!"});
	}
	var token = signjwt({uid: user.uid, username: user.username, admin: user.bisadmin});
	res.cookie(cookiename, token);
	return res.redirect("/panel");
});

router.get("/register", function(req, res, next) {
	res.render("register");
});

router.post("/register", function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	if (!username || !password) {
		return res.status(400).render("register", {error: "Nalezy podac nazwe uzytkownika oraz haslo!"});
	}
	if (!/^[a-zA-Z0-9]*$/.test(username)) {
		return res.status(400).render("register", {error: "Nazwa uzytkownika moze skladac sie jedynie ze znakow alfanumerycznych!"});
	}
	if (db.getUser(username)) {
		return res.status(400).render("register", {error: "Podany uzytkownik juz istnieje!"});
	}
	// Symulacja stanu konta uzytkownika - kazdy uzytkownik dostaje losowa sume pieniedzy od 100000 do 1000000
	var money = Math.random() * 900001 + 100000;
	var uid = db.registerUser(username, password, money.toFixed(2));
	var token = signjwt({uid: uid, username: username, admin: false});
	res.cookie(cookiename, token);
	return res.redirect("/panel");
});

router.get("/samochody", function (req, res, next) {
	res.render("samochody", {user: req.user});
});

router.get("/samochod/:carid", function (req, res, next) {
	res.render("samochod", {cid: req.params.carid, user: req.user});
});

router.get("/logout", function (req, res, next) {
	res.clearCookie(cookiename);
	return res.redirect("/");
});

router.get("/panel", loginRequired, function(req, res, next) {
	var user = db.getUser(req.user.username);
	res.render("panel", {"username": user.username, "money": user.money.toFixed(2), "admin": user.bisadmin});
});

router.get("/admin", [loginRequired, adminRequired], function(req, res, next) {
	res.render("admin");
});

module.exports = router;