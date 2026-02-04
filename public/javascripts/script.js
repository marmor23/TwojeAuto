function getxmljson(path)
{
	var req = new XMLHttpRequest;
	req.open("GET", path, false);
	req.send(null);
	return JSON.parse(req.responseText);
}

function postxmljson(path, param)
{
	var req = new XMLHttpRequest;
	req.open("POST", path, false);
	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	req.send(param);
	return [JSON.parse(req.responseText), req.status];
}

function getCars()
{
	var cars = getxmljson("/api/cars");
	var content = "";
	var car;
	for (i = 0; i < cars.length; i++)
	{
		car = cars[i];
        content += "<tr>";
		content += `<td><a href="/samochod/${car.cid}">` + car.firma + " " + car.model + "</a></td>";
		content += "<td>" + car.rocznik + "</td>";
		content += "<td>" + car.cena + "</td>";
		content += `<td><img width="320" height="180" src="/images/car${car.cid}.jpg"></img></td></tr>`;
	}
	document.getElementById("tablecontent").innerHTML = content;
}

function getadminCars()
{
	var cars = getxmljson("/api/cars");
	var content = "";
	var car;
	for (i = 0; i < cars.length; i++)
	{
		car = cars[i];
        content += `<tr id="car${car.cid}">`;
		content += "<td>" + car.firma + " " + car.model + "</td>";
		content += "<td>" + car.cena + "</td></tr>";
	}
	document.getElementById("tablecontent").innerHTML = content;
}

function getCar(cid)
{
	var car = getxmljson(`/api/car/${cid}`);
	var carnum = getxmljson(`/api/carnum/${cid}`);
	document.getElementById("modelname").innerHTML = car.firma + " " + car.model;
	document.getElementById("rocznik").innerHTML = "Rocznik " + car.rocznik;
	document.getElementById("cena").innerHTML = "Cena: " + car.cena;
	document.getElementById("opis").innerHTML = car.opis;
	document.getElementById("carnum").innerHTML = carnum.num ? `Liczba dostępnych sztuk: ${carnum.num}` : "<b>Salon aktualnie nie posiada tego modelu!</b>";
	var carimg = document.getElementById("carimg");
	carimg.width="640";
	carimg.height="360";
	carimg.src = `/images/car${cid}.jpg`;
}

function getMyCar()
{
	var content = "";
	var car;
	var obj = getxmljson("/api/mycar");
	var arr = [];
	for (i = 0; i < obj.length; i++)
	{
		if (obj[i].num > 0)
		{
			car = getxmljson(`/api/car/${obj[i].cid}`);
			arr.push([car, obj[i].num]);
		}
	}
	document.getElementById("msg").innerHTML = arr.length ? "Lista twoich samochodów:" : "Nie posiadasz żadnych samochodów. Zapraszamy do zakupów!";
	for (i = 0; i < arr.length; i++)
	{
		car = arr[i][0];
		content += `<tr id="car${car.cid}">`;
		content += "<td>" + car.firma + " " + car.model + "</td>";
		content += "<td>" + car.rocznik + "</td>";
		content += "<td>" + car.cena + "</td>";
		content += "<td>" + arr[i][1] + "</td></tr>";
	}
	if (arr.length)
	{
		document.getElementById("tablecontent").innerHTML = content;
		document.getElementById("tabela").style.visibility = "visible";
	}
}

function buyCar(cid)
{
	var rect = document.getElementById("rect");
	var out = postxmljson("/api/buy", `cid=${cid}`);
	var carnum;
	var num;
	if (out[1] == 200)
	{
		rect.style["background-color"] = "#73ad21";
		rect.innerHTML = out[0].success;
	}
	else
	{
		rect.style["background-color"] = "#ff0000";
		rect.innerHTML = out[0].error;
	}
	rect.style.visibility = "visible";
	carnum = document.getElementById("carnum");
	num = parseInt(carnum.innerHTML.split(" ")[3]);
	carnum.innerHTML = num > 1 ? `Liczba dostępnych sztuk: ${num - 1}` : "<b>Salon aktualnie nie posiada tego modelu!</b>";
}

function sellCar(cid)
{
	var rect = document.getElementById("rect");
	var out = postxmljson("/api/sell", `cid=${cid}`);
	var tabdat;
	var row;
	var cena;
	var tabela;
	var stankonta;
	var usermoney;
	var updmoney;
	rect.style.visibility = "visible";
	if (out[1] == 200)
	{
		rect.style["background-color"] = "#73ad21";
		rect.innerHTML = out[0].success;
	}
	else
	{
		rect.style["background-color"] = "#ff0000";
		rect.innerHTML = out[0].error;
		return;
	}
	row = document.getElementById(`car${cid}`);
	tabdat = row.children[3];
	cena = row.children[2].innerHTML;
	if (tabdat.innerHTML == 1)
	{
		row.parentNode.removeChild(row);
	}
	else
	{
		tabdat.innerHTML -= 1;
	}
	tabela = document.getElementById("tabela");
	if (tabela.rows.length == 1)
	{
		tabela.style.visibility = "hidden";
		document.getElementById("msg").innerHTML = "Nie posiadasz żadnych samochodów. Zapraszamy do zakupów!";
	}
	stankonta = document.getElementById("stankonta")
	usermoney = stankonta.innerHTML.split(" ")[3];
	updmoney = parseFloat(usermoney) + parseFloat(cena);
	stankonta.innerHTML = `Twój stan konta: ${updmoney.toFixed(2)}`;
}

function searchCar()
{
	var searchtext = document.getElementById("searchtext");
	var srch = searchtext.value;
	document.getElementById("tabela").style.visibility = "visible";
	document.getElementById("msg").innerHTML = "";
	if (!srch.length)
	{
		getCars();
		return;
	}
	var out = postxmljson("/api/cars", `srch=${srch}`);
	var data = out[0];
	var content = "";
	var msgelem = document.getElementById("msg");
	if (out[1] != 200)
	{
		msgelem.innerHTML = data.error;
		return;
	}
	if (data.length)
	{
		for (i = 0; i < data.length; i++)
		{
			car = data[i];
		    content += "<tr>";
			content += `<td><a href="/samochod/${car.cid}">` + car.firma + " " + car.model + "</a></td>";
			content += "<td>" + car.rocznik + "</td>";
			content += "<td>" + car.cena + "</td>";
			content += `<td><img width="320" height="180" src="/images/car${car.cid}.jpg"></img></td></tr>`;
		}
		document.getElementById("tablecontent").innerHTML = content;
	}
	else
	{
		document.getElementById("tablecontent").innerHTML = "";
		msgelem.innerHTML = "Żaden z oferowanych samochodów nie odpowiada wyszukiwanej frazie";
		document.getElementById("tabela").style.visibility = "hidden";
	}
}

function changeCena(cid)
{
	var rect = document.getElementById("rect");
	var updcena = document.getElementById(`updcena${cid}`);
	var out = postxmljson("/api/changecena", `cid=${cid}&cena=${updcena.value}`);
	rect.style.visibility = "visible";
	if (out[1] == 200)
	{
		rect.style["background-color"] = "#73ad21";
		rect.innerHTML = out[0].success;
		document.getElementById(`car${cid}`).children[1].innerHTML = updcena.value;
	}
	else
	{
		rect.style["background-color"] = "#ff0000";
		rect.innerHTML = out[0].error;
	}
}

function setbuttons()
{
	var tabrows = Array.from(document.querySelectorAll("table tbody tr"));
	var elem;
	var button, td;
	tabrows.forEach(function(elem) {
		button = document.createElement("button");
		td = document.createElement("td");
		td.style["background-color"] = "white";
		td.style.border = "none";
		button.innerText = "Sprzedaj";
		button.className = "btn";
		button.onclick = function() {sellCar(elem.id.substring(3));}
		td.append(button);
		elem.append(td);
	});
}

function setchange()
{
	var tabrows = Array.from(document.querySelectorAll("table tbody tr"));
	var elem;
	var cid;
	var td;
	tabrows.forEach(function(elem) {
		cid = elem.id.substring(3);
		td = document.createElement("td");
		td.style["background-color"] = "white";
		td.style.border = "none";
		td.innerHTML = `<div class="search-container"><form onsubmit="event.preventDefault(); changeCena(${cid})"><input type="text" placeholder="Nowa cena" id="updcena${cid}"><button type="submit">Zmień cenę</button></form></div>`;
		elem.append(td);
	});
}

function getlogs()
{
	var data = getxmljson("/api/logs");
	var content = "";
	var act;
	document.getElementById("msg2").innerHTML = data.length ? "Historia transakcji:" : "Użytkownicy nie wykonali jeszcze żadnych transakcji";
	for (i = 0; i < data.length; i++)
	{
		act = data[i];
		content += "<tr>";
		content += "<td>" + act.username + "</td>";
		content += "<td>" + act.model + "</td>";
		content += "<td>" + act.cena.toFixed(2) + "</td>";
		content += "<td>" + act.action + "</td>";
		content += "<td>" + act.data + "</td></tr>";
	}
	if (data.length)
	{
		document.getElementById("tablecontent2").innerHTML = content;
		document.getElementById("tabela2").style.visibility = "visible";
	}		
}