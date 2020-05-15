var board = {
    content: document.querySelector('#board-content'),
    wrapper: document.querySelector('#board-wrapper'),
    sort: {
        conteneur: document.querySelector('#board-alphabetic'),
        caracters: [],
        lastCaracter: undefined,
        init: function() {
            this.caracters.forEach(caracter => {
                caract = document.createElement('li');
                caract.classList.add('sort-alphabetic-list__caracter');
                caract.textContent = caracter.caracter;
                this.conteneur.appendChild(caract);

                var caracterSectionTitle = document.createElement('label');
                caracterSectionTitle.classList.add('board__section-title');
                caracterSectionTitle.textContent = caracter.caracter;
                board.content.appendChild(caracterSectionTitle);

                board.content.appendChild(caracter.cardsContent);

                caract.addEventListener('click', () => {
                    board.wrapper.scrollTop = 0;
                    board.wrapper.scrollTo({
                        top: caracter.cardsContent.getBoundingClientRect().y -180,
                        behavior: 'smooth'
                    });
                });
            });
        }
    },
    init: function() {
        if (!network.isLoaded) { return; }

        this.content.innerHTML = '';
        board.sort.caracters = [];
        board.sort.conteneur.innerHTML = '';
        
        network.data.nodes.forEach(createCard, { order: 'label' });
        board.sort.init();
    }
}

function sortByCaracter(sortCaracter) {
    network.data.nodes.forEach(function(data) {
        var firstCaracterFromLabel = data.label.charAt(0);
        if (firstCaracterFromLabel != sortCaracter && data.hidden != true) {
            // caché s'il n'a pas la première lettre et qu'il n'est pas déjà caché
            network.data.nodes.update({id: data.id, hidden: true});
        }
    },);
}


function createCard(entite) {

    if (entite.hidden == true) { return; }

    var firstCaracterFromLabel = entite.label.charAt(0);
    if (firstCaracterFromLabel != board.sort.lastCaracter) {
        // si l'on change de caractère : enregistrement d'une nouvelle section de cartes
        board.sort.lastCaracter = firstCaracterFromLabel;

        var caracterSection = document.createElement('div');
        caracterSection.classList.add('board__section');

        board.sort.caracters.push({
            caracter: firstCaracterFromLabel,
            cardsContent: caracterSection
        });
    }

    var photo = '<img class="card__img" src="' + entite.image + '" alt="' + entite.label + '" />';
    var label = '<h3 class="card__label">' + entite.label + '</h3>';
    var dates = null;
    if (entite.metas.annee_naissance !== null) {
        if (entite.metas.annee_mort !== null) {
            var dateAjoutMort = ' - ' + entite.metas.annee_mort; }

        dates = ['<span class="card__date">(', entite.metas.annee_naissance,
            dateAjoutMort, ')</span>'].join('');
    }
    var identite = ['<div class="card__identite">', label, dates, '</div>'].join('');
    var presentation = ['<div class="card__presentation">', photo, identite, '</div>'].join('');

    var titre = null;
    if (entite.title !== null) {
        titre = '<h4 class="card__titre">' + entite.title + '</h4>'; }

    // dernier contenant de cartes créé où mettre les cartes pour un même caractère
    var cardContent = board.sort.caracters[board.sort.caracters.length - 1].cardsContent;

    const cardBox = document.createElement('div');
    cardBox.classList.add('card');
    cardBox.innerHTML = [presentation, titre].join('');
    cardContent.appendChild(cardBox);

    cardBox.addEventListener('click', () => {
        switchNode(entite.id, false)
        historique.actualiser(entite.id);
    });
}