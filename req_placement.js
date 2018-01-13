//========================================================
// Traitement de "req_placement"
// Auteur : Bennaceur / Fumey-humbert / Mercier-Handisyde / Vasseur
// Version : 20.11.2017
//========================================================

"use strict";

var fs = require("fs");
require('remedial');

var trait = function(req, res, query) {

	var page;
	var color;
	var board;
	var adv;
	var pawn;
	var marqueurs;
	var marqueurs_board;
	var liste_membre;
	var liste_board;
	var liste_image;
	var contenu_fichier;
	var contenu_board;
	var contenu_image;
	var i;
	var tmp;
	var liste;
	var colonne;
	var l;
	var c;

	contenu_fichier = fs.readFileSync("salon.json", 'utf-8');
	liste_membre = JSON.parse(contenu_fichier);

	contenu_image = fs.readFileSync("pieces.json", 'utf-8');
	liste_image = JSON.parse(contenu_image);

	marqueurs = {};
	marqueurs.pseudo = query.pseudo;
	for(i = 0; i < liste_membre.length; i++){
		if(liste_membre[i].pseudo === query.pseudo){
			adv = liste_membre[i].adv;
			if(liste_membre[i].color === "noir") {
				color = "noir";
				board = query.pseudo;
				contenu_board = fs.readFileSync(board + ".json", 'utf-8');
				liste_board = JSON.parse(contenu_board);
			} else if(liste_membre[i].color === "blanc") {
				color = "blanc";
				board = adv;
				contenu_board = fs.readFileSync(board + ".json", 'utf-8');
				liste_board = JSON.parse(contenu_board);

			}
		}
	}

	i = Number(query.x_new);
	l = Number(query.x_new);
	c = Number(query.y_new);
	if(liste_board[query.x][query.y] === "r" && liste_board[query.x_new][query.y_new] === "k") {

		tmp = liste_board[query.x_new][query.y_new];
		liste_board[query.x_new][query.y_new] = liste_board[query.x][query.y];
		liste_board[query.x][query.y] = tmp;
		contenu_board = JSON.stringify(liste_board);
		fs.writeFileSync(board+".json", contenu_board);

	} else if(liste_board[query.x][query.y] === "R" && liste_board[query.x_new][query.y_new] === "K") {

		tmp = liste_board[query.x_new][query.y_new];
		liste_board[query.x_new][query.y_new] = liste_board[query.x][query.y];
		liste_board[query.x][query.y] = tmp;
		contenu_board = JSON.stringify(liste_board);
		fs.writeFileSync(board+ ".json", contenu_board, "utf-8");

	} else if(liste_board[query.x][query.y] === "p" && i === 0) {
		tmp = liste_board[query.x_new][query.y_new];
		liste_board[query.x_new][query.y_new] = liste_board[query.x][query.y];
		liste_board[query.x][query.y] = " ";
		contenu_board = JSON.stringify(liste_board);
		fs.writeFileSync(board+ ".json", contenu_board,"UTF-8");


		contenu_fichier = JSON.stringify(liste_membre);
		fs.writeFileSync("salon.json", contenu_fichier, "UTF-8");

		page = fs.readFileSync("res_promotion.html","UTF-8");
		liste = "";
		
		for(colonne = 0; colonne < 4; colonne++) {
			i = 7;
			pawn = liste_board[i][colonne];
			console.log(pawn);
			liste += "<a href=./req_promotion?pseudo="+ query.pseudo +"&x_new="+ l +"&y_new="+ c +"&new_pawn="+ pawn +"><img src="+ liste_image[pawn] +"></a>";
			liste += "<br>";
		}
			marqueurs = {};
			marqueurs.promotion = liste;
			page = page.supplant(marqueurs);
		
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(page);
		res.end();

	}else if (liste_board[query.x][query.y] === "P" && i === 7) {
		tmp = liste_board[query.x][query.y];
		liste_board[query.x][query.y] = " ";
		liste_board[query.x_new][query.y_new] = tmp;
		contenu_board = JSON.stringify(liste_board);
		fs.writeFileSync(board+ ".json", contenu_board, "UTF-8");
		for(i = 0; i < liste_membre.length; i++){
			if(liste_membre[i].pseudo === query.pseudo){
				adv = liste_membre[i].adv;
				liste_membre[i].statut = "passif"
			}
		}

		for(i = 0; i < liste_membre.length; i++){
			if(liste_membre[i].pseudo === adv){
				liste_membre[i].statut = "actif";
			}
		}

		contenu_fichier = JSON.stringify(liste_membre);
		fs.writeFileSync("salon.json", contenu_fichier, "UTF-8");

		page = fs.readFileSync("res_promotion.html","UTF-8");
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(page);
		res.end();

	} else { 
		tmp = liste_board[query.x][query.y];
		liste_board[query.x][query.y] = " ";
		liste_board[query.x_new][query.y_new] = tmp;
		contenu_board = JSON.stringify(liste_board);
		fs.writeFileSync(board+ ".json", contenu_board, "UTF-8");
		contenu_board = fs.readFileSync(board+".json","UTF-8");
		liste_board = JSON.parse(contenu_board);
	

		for(i = 0; i < liste_membre.length; i++){
			if(liste_membre[i].pseudo === query.pseudo){
				adv = liste_membre[i].adv;	
				liste_membre[i].statut = "passif"
			}
		}

		for(i = 0; i < liste_membre.length; i++){
			if(liste_membre[i].pseudo === adv){
				liste_membre[i].statut = "actif";
			}
		}

		contenu_fichier = JSON.stringify(liste_membre);
		fs.writeFileSync("salon.json", contenu_fichier, "UTF-8");


		page = fs.readFileSync("res_passif.html","UTF-8");

		marqueurs_board = {};
		var l = 7;
		for(var ligne = 0; ligne < 8; ligne++) {
			var c = 7;
			for(var colonne = 0; colonne < 8; colonne++) {

				pawn = liste_board[ligne][colonne];	

				var horiz_coord = "ABCDEFGH"
					if(color === "blanc"){

						marqueurs_board["sqr_" + ligne + ":" + colonne] = "<img src="+liste_image[pawn]+">";
						marqueurs_board[colonne + 1] = String(colonne + 1);
						marqueurs_board[horiz_coord[colonne]] = horiz_coord[colonne];

					} else if(color === "noir"){
						marqueurs_board[colonne + 1] = String(8 - colonne);
						marqueurs_board[horiz_coord[colonne]] = horiz_coord[7 - colonne];
						marqueurs_board["sqr_" + l + ":" + c] = "<img src="+liste_image[pawn]+">";
					}
				c--;
			}
			l--;
		}
		page = page.supplant(marqueurs_board);

		page = page.supplant(marqueurs);

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(page);
		res.end();
	}
};

module.exports = trait;
