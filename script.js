

// ---------- Données ----------
// Ajoute une propriété "url" à un jeu pour le rendre jouable.
const jeux = [
    { nom: "Super Mario", console: "NES",        image: "./images/mario.jpg",   url: "jeux/test/index.html" },
    { nom: "Pokémon",     console: "Game Boy",   image: "./images/pokemon.jpg" },
    { nom: "Sonic",       console: "Mega Drive", image: "./images/sonic.jpg" },
    { nom: "Tetris",      console: "Game Boy",   image: "./images/tetris.jpg" },
    { nom: "Pac-Man",     console: "Arcade",     image: "./images/pacman.jpg" },
    { nom: "Zelda",       console: "SNES",       image: "./images/zelda.jpg" }
];

const titres = {
    home: "Ma bibliothèque",
    favorites: "Mes favoris",
    profile: "Mon profil"
};

// ---------- État ----------
let favoris;
try {
    favoris = JSON.parse(localStorage.getItem("chosis_favoris")) || [];
} catch {
    favoris = [];
}

let pageCourante = "home";
let jeuOuvert = null;

// ---------- Éléments du DOM ----------
const welcome = document.getElementById("welcome");
const library = document.getElementById("library");
const sectionTitle = document.getElementById("section-title");
const games = document.getElementById("games");
const search = document.getElementById("search");

const detailView = document.getElementById("detail-view");
const detailImage = document.getElementById("detail-image");
const detailName = document.getElementById("detail-name");
const detailConsole = document.getElementById("detail-console");
const playButton = document.getElementById("play-button");
const backButton = document.getElementById("back-button");

const zoneJeu = document.getElementById("zone-jeu");
const jeuFrame = document.getElementById("jeu-frame");

const navButtons = document.querySelectorAll(".nav-button");

// ---------- Jeu (iframe) ----------
function fermerJeu() {
    zoneJeu.hidden = true;
    jeuFrame.removeAttribute("src"); // arrête le jeu et le son
    jeuOuvert = null;
}

playButton.addEventListener("click", () => {
    if (jeuOuvert && jeuOuvert.url) {
        zoneJeu.hidden = false;
        jeuFrame.src = jeuOuvert.url;
    } else {
        alert("Ce jeu n'est pas encore disponible.");
    }
});

// ---------- Fiche d'un jeu ----------
function ouvrirJeu(jeu) {
    fermerJeu();
    jeuOuvert = jeu;

    welcome.hidden = true;
    library.hidden = true;
    detailView.hidden = false;

    detailImage.src = new URL(jeu.image, document.baseURI).href;
    detailImage.alt = "Pochette de " + jeu.nom;
    detailName.textContent = jeu.nom;
    detailConsole.textContent = "Console : " + jeu.console;
}

backButton.addEventListener("click", () => {
    fermerJeu();
    detailView.hidden = true;
    welcome.hidden = false;
    library.hidden = false;
});

// ---------- Liste des jeux ----------
// Liste selon la page courante (accueil / favoris) et la recherche.
function jeuxAffiches() {
    const recherche = search.value.trim().toLowerCase();

    const base = pageCourante === "favorites"
        ? jeux.filter(jeu => favoris.includes(jeu.nom))
        : jeux;

    return base.filter(jeu =>
        jeu.nom.toLowerCase().includes(recherche) ||
        jeu.console.toLowerCase().includes(recherche)
    );
}

function afficherJeux(liste) {
    games.innerHTML = "";

    if (liste.length === 0) {
        const vide = document.createElement("p");
        vide.className = "vide";
        vide.textContent = pageCourante === "favorites" && !search.value.trim()
            ? "Aucun favori pour le moment."
            : "Aucun jeu trouvé.";
        games.appendChild(vide);
        return;
    }

    liste.forEach(jeu => {
        const carte = document.createElement("div");
        carte.className = "game-card";

        const image = document.createElement("img");
        image.src = new URL(jeu.image, document.baseURI).href;
        image.alt = "Pochette de " + jeu.nom;
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.onerror = () => {
            image.alt = "Image indisponible : " + jeu.nom;
            console.error("Image introuvable :", image.src);
        };
        image.addEventListener("click", () => ouvrirJeu(jeu));
        image.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                ouvrirJeu(jeu);
            }
        });

        const titre = document.createElement("h3");
        titre.textContent = jeu.nom;

        const consoleJeu = document.createElement("p");
        consoleJeu.textContent = jeu.console;

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.textContent = favoris.includes(jeu.nom)
            ? "❤️ Favori"
            : "🤍 Ajouter aux favoris";

        bouton.addEventListener("click", () => {
            if (favoris.includes(jeu.nom)) {
                favoris = favoris.filter(n => n !== jeu.nom);
            } else {
                favoris.push(jeu.nom);
            }
            localStorage.setItem("chosis_favoris", JSON.stringify(favoris));
            afficherJeux(jeuxAffiches()); // recalcule selon la page courante
        });

        carte.append(image, titre, consoleJeu, bouton);
        games.appendChild(carte);
    });
}

search.addEventListener("input", () => {
    afficherJeux(jeuxAffiches());
});

// ---------- Profil ----------
function afficherProfil() {
    games.innerHTML = `
        <div class="game-card profile-card">
            <h2>👤 Mon profil</h2>
            <p>Choisis ton pseudo :</p>
            <input id="pseudo" type="text" placeholder="Ton pseudo" maxlength="30">

            <p>Choisis ton avatar :</p>
            <select id="avatar">
                <option value="😎">😎</option>
                <option value="🎮">🎮</option>
                <option value="🐱">🐱</option>
                <option value="👾">👾</option>
                <option value="🦊">🦊</option>
            </select>

            <button id="save-profile" type="button">Enregistrer</button>
            <h2 id="profile-result">😎</h2>
            <p id="profile-name">Ton profil apparaîtra ici</p>
        </div>
    `;

    const pseudoInput = document.getElementById("pseudo");
    const avatarSelect = document.getElementById("avatar");
    const resultat = document.getElementById("profile-result");
    const nomAffiche = document.getElementById("profile-name");

    const pseudoSauvegarde = localStorage.getItem("chosis_pseudo");
    const avatarSauvegarde = localStorage.getItem("chosis_avatar");

    if (pseudoSauvegarde) {
        pseudoInput.value = pseudoSauvegarde;
        nomAffiche.textContent = pseudoSauvegarde;
    }
    if (avatarSauvegarde) {
        avatarSelect.value = avatarSauvegarde;
        resultat.textContent = avatarSauvegarde;
    }

    document.getElementById("save-profile").addEventListener("click", () => {
        const pseudo = pseudoInput.value.trim();
        const avatar = avatarSelect.value;

        if (!pseudo) {
            alert("Choisis un pseudo !");
            return;
        }

        localStorage.setItem("chosis_pseudo", pseudo);
        localStorage.setItem("chosis_avatar", avatar);

        resultat.textContent = avatar;
        nomAffiche.textContent = pseudo;
    });
}

// ---------- Navigation ----------
function afficherPage() {
    sectionTitle.textContent = titres[pageCourante];

    if (pageCourante === "profile") {
        search.hidden = true;
        afficherProfil();
    } else {
        search.hidden = false;
        afficherJeux(jeuxAffiches());
    }
}

navButtons.forEach(bouton => {
    bouton.addEventListener("click", () => {
        navButtons.forEach(b => b.classList.remove("active"));
        bouton.classList.add("active");

        fermerJeu();
        detailView.hidden = true;
        welcome.hidden = false;
        library.hidden = false;

        pageCourante = bouton.dataset.page;
        search.value = "";
        afficherPage();
    });
});

// ---------- Démarrage ----------
afficherPage();
console.log("Chosis Toi fonctionne !");
