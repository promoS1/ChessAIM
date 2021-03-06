// =============================================================================
// Traitement de req_commencer_passif
// Bennaceur / Fumey-Humbert / Mercier-Handisyde / Vasseur
// Version : 20.11.2017
// =============================================================================

"use strict";

var fs = require("fs");
require("remedial");

var trait = function(req, res, query) {
	var page; 
	var pawn;
	var contenu_fichier;
	var contenu_init_board;
	var contenu_image;
	var liste_membre;
	var liste_init_board;
	var liste_image;
	var i;
	var marqueurs;
	var marqueurs_board;
	var init_board;
	var contenu_echiquier;
	var board;
   //==== Récupérations des fichiers permettant de créer la partie ====\\
	contenu_fichier = fs.readFileSync("salon.json", "UTF-8");
	liste_membre = JSON.parse(contenu_fichier);
	
	contenu_init_board = fs.readFileSync("init_board.json", 'utf-8');
	liste_init_board = JSON.parse(contenu_init_board);

	contenu_image = fs.readFileSync("pieces.json", 'utf-8');
	liste_image = JSON.parse(contenu_image);

	    //====== Création du fichier de jeu dynamique ==========\\
	board = query.pseudo;
	fs.writeFileSync(board + ".json", contenu_init_board, "UTF-8")

	   //======== Modification des statuts de jeu =============\\
	for (i = 0; i < liste_membre.length; i++) {
		if (liste_membre[i].pseudo === query.pseudo) {
			liste_membre[i].adv = query.adv;
			liste_membre[i].etat = "indisponible";
			liste_membre[i].statut = "passif";
			liste_membre[i].color = "noir";
			contenu_fichier = JSON.stringify(liste_membre);
			fs.writeFileSync("salon.json", contenu_fichier, "UTF-8");
			marqueurs = {};
			marqueurs.pseudo = query.pseudo;
		}
	}
	page = fs.readFileSync('res_passif.html', 'UTF-8');

	var l = 7;

	marqueurs_board = {};
	for(var ligne = 0; ligne < 8; ligne++) {
		
		var c = 7;

		for(var colonne = 0; colonne < 8; colonne++) {

			pawn = liste_init_board[l][c];
			marqueurs_board["sqr_" + ligne + ":" + colonne] = "<img src="+liste_image[pawn]+">";
			c--;
		}
		l--;
	}
	
	var horiz_coord = "ABCDEFGH"
	for(i = 0; i < 8; i++) {
		marqueurs_board[i + 1] = String(8 - i);
		marqueurs_board[horiz_coord[i]] = horiz_coord[7 - i];
	}

			
	
	page = page.supplant(marqueurs_board);

	page = page.supplant(marqueurs);

	res.writeHead(200, {'Content-type': 'text/html'});
	res.write(page);
	res.end();
};

// =============================================================================

module.exports = trait;


