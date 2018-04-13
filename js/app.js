// Games Array
let games = [{
        'publisher': 'Virgin Interactive Entertainment, Inc.',
        'avatar': 'https://archive.org/services/img/msdos_Disneys_Aladdin_1994',
        'subject': 'Disney\'s Aladdin',
        'body': 'The player controls Aladdin, who must make his way through several levels based on locations from the movie.',
        'date': '1994',
        'ifrmSrc': 'https://archive.org/embed/msdos_Disneys_Aladdin_1994'
    },

    {
        'publisher': 'Bro/derbund Software, Inc.',
        'avatar': 'https://archive.org/services/img/msdos_SimCity_1989',
        'subject': 'SimCity',
        'body': 'SimCity sets you as the mayor of a new municipality, with the responsibility of building and maintaining a place where citizens can move to and work and be happy.',
        'date': '1989',
        'ifrmSrc': 'https://archive.org/embed/msdos_SimCity_1989'
    },

    {
        'publisher': 'Bro/derbund Software, Inc.',
        'avatar': 'https://archive.org/services/img/msdos_Prince_of_Persia_1990',
        'subject': 'Prince of Persia',
        'body': 'While the Sultan of Persia is fighting a war in a foreign country, his Grand Vizier Jaffar orchestrates a coup d\'etat. His way to the throne lies through the Sultan\'s lovely daughter.',
        'date': '1990',
        'ifrmSrc': 'https://archive.org/embed/msdos_Prince_of_Persia_1990'
    },
];


let linkTrash = document.getElementById('linkTrash');
let linkInbox = document.getElementById('linkInbox');
let composeButton = document.getElementById('compose');
let inboxCounter = document.getElementById('inboxCounter');


/* ADDING A NEW GAME */

// Compose Button Clicked -> runs composeForm
composeButton.addEventListener('click', composeForm);

// Compose Form Function
function composeForm(e) {
    e.preventDefault();

    let composeFormHTML = `
    <div class="add-new-game-header">
        <h1>Add a New Game</h1>
    </div>    
    <form class="pure-form pure-form-aligned" name="newgame" id="newgame">
        <fieldset>
            <div class="pure-control-group">
                <label for="game">Game Title</label>
                <input id="game" type="text" placeholder="Game Title">
            </div>
            
            <div class="pure-control-group">
                <label for="description">Game Description</label>
                <textarea id="description" placeholder="Game Description"></textarea>
            </div>
                    
            <div class="pure-control-group">
                <label for="year">Year Released</label>
                <input id="year" type="text" placeholder="Year Released">
            </div>

            <div class="pure-control-group">
                <label for="publisher">Publisher</label>
                <input id="publisher" type="text" placeholder="Publisher">
            </div>

            <div class="pure-control-group">
                <label for="avatar">Avatar URL</label>
                <input id="avatar" type="text" placeholder="Avatar URL">
            </div>


            <div class="pure-control-group">
                <label for="playonline">URL to Play Online</label>
                <input id="playonline" type="text" placeholder="URL to Play Online">
            </div>

            <div class="pure-controls">
                <button id="saveButton" type="submit" class="pure-button pure-button-primary">Save</button>
            </div>
        </fieldset>
    </form>
    `;

    // Update the main with the form
    let main = document.getElementById('main');
    main.innerHTML = composeFormHTML;

    // When Form Submitted
    let form = document.getElementById('newgame');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Create new game object
        let newGameObj = {
            publisher: document.forms.newgame.publisher.value,
            avatar: document.forms.newgame.avatar.value,
            subject: document.forms.newgame.game.value,
            body: document.forms.newgame.description.value,
            date: document.forms.newgame.year.value,
            ifrmSrc: document.forms.newgame.playonline.value
        }

        // Push new game to games array (to the top of the list)
        games.unshift(newGameObj);

        // Set localStorage
        setLocalStorage();

        // Update Inbox view
        linkInbox.click();
    });

}; //end of function composeForm()



/* RENDERING GAMES LIST - MIDDLE COLUMN */

// renderGamesList Function
function renderGamesList(games) {

    // Create Snippet with Games List
    const snippetGamesList = games.map((game, index) => `
        <div class="email-item pure-g" data-id="${index}">
            <div class="pure-u">
                <img width="64" height="64" alt="${game.subject}&#x27;s avatar" class="email-avatar" src="${game.avatar}">
            </div>

            <div class="pure-u-3-4">
                <h5 class="email-name">${game.publisher}</h5>
                <h4 class="email-subject">${game.subject}</h4>
                <p class="email-desc">${game.body}</p>
            </div>
        </div>
    `).join('');

    // Grab Games Column
    const gamesList = document.getElementById('list');

    // Inject Snippet into Column
    gamesList.innerHTML = snippetGamesList;

    initializeGames(games);
};



/* SET THE SELECTED GAME */

// If there are games on the list, select the first one
let selectedGame = 0;

function initializeGames(games) {

    let gameItemList = [...(document.querySelectorAll(".email-item"))];

    // When a game on the list is clicked, add class .email-item-selected
    gameItemList.map((game, index) => game.addEventListener('click', function (e) {

        // Remove class from previous item selected
        gameItemList[selectedGame].classList.remove('email-item-selected');

        // Add class to item clicked
        this.classList.add('email-item-selected');

        // Update selectedGame value
        selectedGame = index;

        // Show Game Information
        showGameInfo(games, selectedGame);

    }));

    // Select the first game by default if there is one
    if (games.length) {
        gameItemList[selectedGame].classList.add('email-item-selected');
        showGameInfo(games, selectedGame);
    } else {
        let main = document.getElementById('main');
        main.innerHTML = '<h1>No Games</h1>'
    }

}


/* DISPLAY GAME INFORMATION ON MAIN */

function showGameInfo(games, index) {

    let gameInfoMain = `
    <div class="email-content">
        <div class="email-content-header pure-g">
            <div class="pure-u-1-2">
                <h1 class="email-content-title">${games[index].subject}</h1>
                <p class="email-content-subtitle">
                    Published by <a>${games[index].publisher}</a> in <span>${games[index].date}</span>
                </p>
            </div>
        
            <div class="email-content-controls pure-u-1-2">
                <button id="delete" class="secondary-button pure-button ${games[index].deleted == true ? 'btn-pressed' : ''}" data-id="${index}">${games[index].deleted == true ? 'Deleted' : 'Delete'}</button>
                <button class="secondary-button pure-button">Forward</button>
                <button class="secondary-button pure-button">Move to</button>
            </div>
        </div>
        
        <div class="email-content-body" id="iframeContainer">
            <iframe id="game-iframe" src="${games[index].ifrmSrc}" frameborder="0">
            </iframe>
        </div>
    </div>
    `;
    
    // Inject snippet into main
    const main = document.getElementById('main');
    main.innerHTML = gameInfoMain;

    // Delete link clicked
    let linkDelete = document.getElementById('delete');
    linkDelete.addEventListener('click', function () {
        deleteGame(this.dataset.id, games);
    });
}


/* DELETE GAME */

function deleteGame(index, games) {

    // if the current game does NOT have the key/value deleted:true

    if (!games[index].deleted) {
        // add deleted:true to object
        games[index].deleted = true;

        // Update localStorage
        setLocalStorage();

        // Update view of inbox
        let inbox = games.filter(game => !game.deleted);
        selectedGame = 0;
        renderGamesList(inbox);

    } else {

        // If the current game has the key/value deleted:true

        delete games[index].deleted;
        let filtered = games.filter(game => game.deleted);
        selectedGame = 0;
        renderGamesList(filtered);
    }
}


/* SET LOCALSTORAGE */

// set localStorage function
function setLocalStorage() {
    localStorage.setItem('items', JSON.stringify(games));
}


/* DISPLAY TRASH LIST */

// Trash link clicked
linkTrash.addEventListener('click', function (e) {
    e.preventDefault();

    // Filter only the deleted games
    let filtered = games.filter(game => game.deleted);
    selectedGame = 0;
    renderGamesList(filtered);
});


/* DISPLAY INBOX LIST */

// Inbox link clicked
linkInbox.addEventListener('click', function (e) {
    e.preventDefault();

    // Filter only the NOT deleted games
    let inbox = games.filter(game => !game.deleted);
    selectedGame = 0;
    renderGamesList(inbox);
});



/* INITIAL RENDER GAMES */

// If 'items' exists on localStorage, renderGamesList(filtered) - Inbox without the deleted items 
if (localStorage.getItem('items')) {
    games = JSON.parse(localStorage.getItem('items'));
    let filtered = games.filter(game => !game.deleted);
    renderGamesList(filtered);

} else {
    // Else, call renderGamesList and use the global games 
    renderGamesList(games);
}