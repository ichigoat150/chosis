
const jeux = [
    { nom: "Super Mario", console: "NES", image: "./images/mario.jpg" },
    { nom: "Pokémon", console: "Game Boy", image: "./images/pokemon.jpg" },
    { nom: "Sonic", console: "Mega Drive", image: "./images/sonic.jpg" },
    { nom: "Tetris", console: "Game Boy", image: "./images/tetris.jpg" },
    { nom: "Pac-Man", console: "Arcade", image: "./images/pacman.jpg" },
    { nom: "Zelda", console: "SNES", image: "./images/zelda.jpg" }
];



let favoris = JSON.parse(localStorage.getItem("chosis_favoris")) || [];

const games = document.getElementById("games");
const search = document.getElementById("search");
const details = document.getElementById("game-details");
const detailImage = document.getElementById("detail-image");
const detailName = document.getElementById("detail-name");
const detailConsole = document.getElementById("detail-console");
const playButton = document.getElementById("play-button");
const backButton = document.getElementById("back-button");

const zoneJeu = document.getElementById("zone-jeu");
const jeuFrame = document.getElementById("jeu-frame");

playButton.addEventListener("click", () => {
    if (jeuOuvert && jeuOuvert.nom === "Super Mario") {
        zoneJeu.hidden = false;
        jeuFrame.src = "jeux/test/index.html";
    } else {
        alert("Ce jeu n'est pas encore disponible.");
    }
});


function ouvrirJeu(jeu) {
    games.hidden = true;
    search.hidden = true;
    details.hidden = false;

    detailImage.src = new URL(jeu.image, document.baseURI).href;
    detailImage.alt = "Pochette de " + jeu.nom;
    detailName.textContent = jeu.nom;
    detailConsole.textContent = "Console : " + jeu.console;
}

backButton.addEventListener("click", () => {
    details.hidden = true;
    games.hidden = false;
    search.hidden = false;
});

function afficherJeux(liste) {
    games.innerHTML = "";

    liste.forEach(jeu => {
        const carte = document.createElement("div");
        carte.className = "game-card";

        const image = document.createElement("img");
        image.src = new URL(jeu.image, document.baseURI).href;

image.onerror = () => {
    image.alt = "Image indisponible : " + jeu.nom;
    console.error("Image introuvable :", image.src);
};
        image.alt = "Pochette de " + jeu.nom;
        image.addEventListener("click", () => ouvrirJeu(jeu));

        const titre = document.createElement("h3");
        titre.textContent = jeu.nom;

        const consoleJeu = document.createElement("p");
        consoleJeu.textContent = jeu.console;

        const bouton = document.createElement("button");
        bouton.textContent = favoris.includes(jeu.nom)
            ? "❤️ Favori"
            : "🤍 Ajouter aux favoris";

        bouton.addEventListener("click", () => {
            if (favoris.includes(jeu.nom)) {
                favoris = favoris.filter(n => n !== jeu.nom);
            } else {
                favoris.push(jeu.nom);
            }localStorage.setItem("chosis_favoris", JSON.stringify(favoris));
            afficherJeux(liste);
        });

        carte.append(image, titre, consoleJeu, bouton);
        games.appendChild(carte);
    });
}

search.addEventListener("input", () => {
    const recherche = search.value.toLowerCase();

    afficherJeux(jeux.filter(jeu =>
        jeu.nom.toLowerCase().includes(recherche) ||
        jeu.console.toLowerCase().includes(recherche)
    ));
});

afficherJeux(jeux);


const navButtons = document.querySelectorAll(".nav-button");

navButtons.forEach(bouton => {
    bouton.addEventListener("click", () => {
        navButtons.forEach(b => b.classList.remove("active"));
        bouton.classList.add("active");

        const page = bouton.dataset.page;

        details.hidden = true;
        search.hidden = false;
        games.hidden = false;

        if (page === "home") {
            afficherJeux(jeux);
        }

        if (page === "favorites") {
            afficherJeux(jeux.filter(jeu =>
                favoris.includes(jeu.nom)
            ));
        }

        if (page === "profile") {
            games.innerHTML = `
                <div class="game-card profile-card">
                    <h2>👤 Mon profil</h2>
                    <p>Choisis ton pseudo :</p>
                    <input id="pseudo" type="text" placeholder="Ton pseudo">

                    <p>Choisis ton avatar :</p>
                    <select id="avatar">
                        <option value="😎">😎</option>
                        <option value="🎮">🎮</option>
                        <option value="🐱">🐱</option>
                        <option value="👾">👾</option>
                        <option value="🦊">🦊</option>
                    </select>

                    <button id="save-profile">Enregistrer</button>
                    <h2 id="profile-result">😎</h2>
                    <p id="profile-name">Ton profil apparaîtra ici</p>
                </div>
            `;

            search.hidden = true;
            const pseudoSauvegarde = localStorage.getItem("chosis_pseudo");
const avatarSauvegarde = localStorage.getItem("chosis_avatar");

if (pseudoSauvegarde) {
    document.getElementById("pseudo").value = pseudoSauvegarde;
}

if (avatarSauvegarde) {
    document.getElementById("avatar").value = avatarSauvegarde;
}

            document.getElementById("save-profile")
                .addEventListener("click", () => {
                    const pseudo = document.getElementById("pseudo").value.trim();
                    const avatar = document.getElementById("avatar").value;
                    localStorage.setItem("chosis_pseudo", pseudo);
localStorage.setItem("chosis_avatar", avatar);

                    if (!pseudo) {
                        alert("Choisis un pseudo !");
                        return;
                    }

                    document.getElementById("profile-result").textContent = avatar;
                    document.getElementById("profile-name").textContent = pseudo;
                });
        }
    });
});
