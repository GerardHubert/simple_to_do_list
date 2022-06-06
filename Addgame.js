class AddGame {

    constructor() {
        this.textField = document.getElementById('game_name_input');
        this.addButton = document.getElementById('add_button');
        this.textField.addEventListener('input', (e) => {
            e.preventDefault();
            this.queryValidation(e)
        });
        this.addButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.addGame();
        });
        this.gamesListElement = document.getElementById('games_list');
        this.boxes = document.getElementsByClassName('checkbox');
        this.deleteButtons = document.getElementsByClassName('delete');
        this.listener();
        this.displayList();
    }

    getStorage() {
        return JSON.parse(localStorage.getItem('list'));
    }

    setStorage(list) {
        localStorage.setItem('list', JSON.stringify(list));
    }

    clearStorage() {
        localStorage.removeItem('list');
    }

    displayList() {
        const list = this.getStorage();
        if (list !== null) {

            //on crée une ligne pour chaque élément du tableau localStorage
            for (const game of list) {
                const slug = game.game.replace(/\s/g, "-").toLowerCase();
                const newLine = document.createElement('div');
                newLine.setAttribute('id', slug);

                const newGame = document.createElement('input');
                newGame.className = 'checkbox';
                newGame.setAttribute('type', 'checkbox');
                newGame.setAttribute('id', slug);
                newGame.setAttribute('name', slug);
                game.isChecked ? newGame.checked = true : newGame.checked = false;

                const newGameLabel = document.createElement('label');
                newGameLabel.className = 'game_label';
                newGameLabel.setAttribute('for', slug);
                newGameLabel.textContent = game.game;

                const deleteButton = document.createElement('i');
                deleteButton.className = "fa-solid fa-trash-can delete " + slug;

                newLine.append(newGame);
                newLine.append(newGameLabel);
                newLine.append(deleteButton);
                this.gamesListElement.append(newLine);
            }
        }
        this.listener();
    }

    queryValidation(e) {
        if (this.textField.value !== "") {
            this.addButton.removeAttribute('disabled');
        }
        if (this.textField.value === "") {
            this.addButton.setAttribute('disabled', 'disabled');
        }
    }

    addGame() {
        const slug = this.textField.value.replace(/\s/g, "-").toLowerCase();

        const newLine = document.createElement('div');
        newLine.setAttribute('id', slug);

        const newGame = document.createElement('input');
        newGame.className = 'checkbox';
        newGame.setAttribute('type', 'checkbox');
        newGame.setAttribute('id', slug);
        newGame.setAttribute('name', slug);

        const newGameLabel = document.createElement('label');
        newGameLabel.className = 'game_label';
        newGameLabel.setAttribute('for', slug);
        newGameLabel.textContent = this.textField.value;

        const deleteButton = document.createElement('i');
        deleteButton.className = "fa-solid fa-trash-can delete " + slug;

        newLine.append(newGame);
        newLine.append(newGameLabel);
        newLine.append(deleteButton);
        this.gamesListElement.append(newLine);

        this.saveGame(this.textField.value, newGame.checked);

        this.textField.value = "";

    }

    listener() {
        for (const deleteButton of this.deleteButtons) {
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation;
                e.preventDefault();
                this.deleteHandler(e.target)
            })
        }

        for (const box of this.boxes) {
            box.addEventListener('click', (e) => {
                this.gameDone(e.target.nextSibling.textContent, e.target.checked);
                //this.saveGame(e.target.nextSibling.textContent, e.target.checked);
            })
        }
    }

    gameDone(game, isChecked) {
        const list = this.getStorage();

        const gameToUpdate = list.find(element => element.game === game);
        const index = list.indexOf(gameToUpdate);

        list[index].game = game;
        list[index].isChecked = isChecked;

        this.setStorage(list);
        this.listener();
    }

    deleteHandler(trash) {
        // on récupère le local storage
        const list = this.getStorage();

        // on trouve le jeu à supprimer en cherchant le nom dans la liste puis son index
        const gameToDelete = list.find(element => element.game === trash.previousSibling.innerText);
        const index = list.indexOf(gameToDelete);

        list.splice(index, 1);
        this.setStorage(list);
        trash.parentElement.remove();
    }


    saveGame(gameName, isChecked) {
        // on crée un nouvel objet jeu avec le nom + si c'est coché
        const newGame = {
            'game': gameName,
            'isChecked': isChecked
        }

        // on récupère le tableau de jeux du local storage
        const list = this.getStorage();

        // on ajoute le jeu au tableau et on enregistre le tableau en localStorage
        if (list === null) {
            const list = [newGame];
            this.setStorage(list);
        } else {
            list.push(newGame);
            this.setStorage(list);
        }

        this.listener();

    }

}

const addGame = new AddGame();