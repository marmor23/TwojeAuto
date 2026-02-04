const jwt = require('jsonwebtoken');
const crypto = require("crypto");

var secret = crypto.randomBytes(32);
var cookiename = "token";

function simpleproxy(req, res, next)
{
	try
	{
        let obj = jwt.verify(req.cookies.token, secret)
        req.user = obj;
    }
    catch (e) {}
    next();
}

function loginRequired(req, res, next)
{
    if (!req.user)
    {
    	return res.status(403).render("error", {errcode: 403, error: "Dostep do tej strony wymaga logowania!"});
    }
    next();
}

function adminRequired(req, res, next)
{
	if (!req.user.admin)
	{
		return res.status(403).render("error", {errcode: 403, error: "Dostep do tej strony wymaga uprawnien administratora!"});
	}
	next();
}

function signjwt(data)
{
    let token = jwt.sign(data, secret, {algorithm: "HS256"});
    return token;
}

module.exports = {signjwt, simpleproxy, loginRequired, adminRequired, cookiename};