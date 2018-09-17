var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

// Nasłuchiwanie na porcie 8181
http.listen(8181);

var con = mysql.createConnection({
	host: 'db',
	port: 3306,
	user: 'uzytkownik',
	password: 'uzytkownik',
	database: 'dane'
});

con.connect(function(error){
	if (!!error) console.log("CONNECTION ERROR: " + error);
	else console.log("Polaczenie do bazy!");
});
// Na połączeniu wyświetla w logu, że klient się połączył.
// Po otrzymaniu od klienta rządania na 'dane' oblicza objętość
// i wysyła wynik na 'wynik' do klienta

io.on('connection', function(socket){
	console.log("Klient sie polaczyl!");

	socket.on('dane', function(dane){
		var kwota_pocz = dane.kp;
		var rrso = dane.procent;
		var wynik = kwota_pocz*(rrso/100+1);
		// SQL - zmienna zawierająca zapytanie do bazy
		// con.query - wysłanie zapytania do bazy
		var sql = "INSERT INTO kredyt VALUES(" + kwota_pocz + "," + rrso + "," + wynik +");";
		con.query(sql, function (error, result) {
			if (!!error) console.log("QUERY ERROR: " + error);
			else console.log("Dane zostaly zapisane do bazy!");
		});
				
		console.log("Wynik: " + wynik);
		io.emit('wynik', wynik);
	});

});

//con.end();