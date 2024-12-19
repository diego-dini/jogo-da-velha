import { DefaultEventsMap, Socket } from "socket.io";
import { setHeapSnapshotNearHeapLimit } from "v8";

/**
 * Tipo que representa um usuário na aplicação.
 * @typedef {Object} User
 * @property {string} name - Nome do usuário.
 * @property {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket - Socket.IO associado ao usuário.
 * @property {Lobby | null} currentLobby - Lobby atual que o usuário está.
 */
export type User = {
    name: string;
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    currentLobby: Lobby | null;
    currentGame: Game | null;
};

/**
 * Tipo que representa um jogo na aplicação.
 * @typedef {Object} Game
 * @property {User} firstPlayer - Primeiro jogador do jogo.
 * @property {User} secondPlayer - Segundo jogador do jogo.
 * @property {number} gameStatus - Status do jogo (0: não iniciado, 1: em andamento, 2: terminado).
 */
export type Game = {
    id: string;
    firstPlayer: User;
    secondPlayer: User;
    currentTurn: number;
    gameStatus: string;
};

/**
 * Tipo que representa um lobby na aplicação.
 * @typedef {Object} Lobby
 * @property {string} id - Identificador único do lobby.
 * @property {string} password - Senha necessária para entrar no lobby.
 * @property {User[]} [usersConnected] - Usuários conectados ao lobby.
 */
export type Lobby = {
    id: string;
    password: string;
    usersConnected?: User[];
};

export type Challange = {
    id: string;
    challanger: User;
    challanged: User;

}

// Lista de todos os lobbies ativos.
const lobbys: Lobby[] = [];
// Lista de todos os usuários conectados ao servidor.
const connectedUsers: User[] = [];

const challanges: Challange[] = [];

const games: Game[] = [];

/**
 * Interface que define o contrato para o controlador de lobby.
 * @interface ILobbyController
 */
export interface ILobbyController {
    /**
     * Conecta um usuário a um lobby existente ou cria um novo lobby se necessário.
     * @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket - Socket do usuário.
     * @param {Lobby} lobbyData - Dados do lobby a ser conectado.
     * @param {User} userData - Dados do usuário a ser conectado.
     */
    connectUser: (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, lobbyData: Lobby, userData: User) => void;

    /**
     * Desconecta um usuário do servidor.
     * @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket - Socket do usuário.
     */
    disconnectUser: (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => void;

    /**
     * Inicia um jogo entre os jogadores especificados.
     * @param {User[]} players - Lista de jogadores que iniciarão o jogo.
     */
    startGame: (challange: Challange) => void;

    restartGame:(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, gameId: string) => void;

    /**
     * Finaliza um jogo, limpando recursos e atualizando o estado.
     */
    endGame: (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, gameId: string) => void;

    /**
     * Lida com as entradas do jogo (posições e valores).
     * @param {number} position - Posição no tabuleiro do jogo.
     * @param {number} value - Valor da entrada (ex: movimento do jogador).
     */
    gameInput: (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, position: number, value: number,gameId:string) => void;

    createChallangeInvite: (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, challangedName: string) => void;

    acceptChallangeInvite: (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, challangeId: string) => void;

    declineChallangeInvite: (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, challangeId: string) => void;

    /**
     * Lida com mensagens entre os usuários.
     * @param {Message} message - Mensagem a ser processada.
     */
    message: (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, message: string) => void;

    getUserFromName: (username: string) => User | undefined

    getUserFromSocket: (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => User | undefined

    getLobbyFromId: (id: string) => Lobby | undefined



}

/**
 * Função para gerar um identificador único para um novo lobby.
 * @returns {string} - O identificador único do lobby gerado.
 */
function generateLobbyId(): string {
    let id: string;
    let isUnique: boolean = false;

    // Continua gerando um novo id até encontrar um que seja único
    while (!isUnique) {
        // Gera um número inteiro aleatório entre 1 e 1000
        id = (Math.floor(Math.random() * 1000) + 1).toString();

        // Verifica se o id já existe na lista de lobbies
        isUnique = !lobbys.some(lobby => lobby.id === id);
    }

    return id!;
}

/**
 * Função para gerar um identificador único para um novo lobby.
 * @returns {string} - O identificador único do lobby gerado.
 */
function generateChallangeId(): string {
    let id: string;
    let isUnique: boolean = false;

    // Continua gerando um novo id até encontrar um que seja único
    while (!isUnique) {
        // Gera um número inteiro aleatório entre 1 e 1000
        id = (Math.floor(Math.random() * 1000) + 1).toString();

        // Verifica se o id já existe na lista de lobbies
        isUnique = !challanges.some(challange => challange.id === id);
    }

    return id!;
}

/**
 * Função para gerar um identificador único para um novo lobby.
 * @returns {string} - O identificador único do lobby gerado.
 */
function generateGameId(): string {
    let id: string;
    let isUnique: boolean = false;

    // Continua gerando um novo id até encontrar um que seja único
    while (!isUnique) {
        // Gera um número inteiro aleatório entre 1 e 1000
        id = (Math.floor(Math.random() * 1000) + 1).toString();

        // Verifica se o id já existe na lista de lobbies
        isUnique = !games.some(game => game.id === id);
    }

    return id!;
}

function sendLobbyMessage(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, message: string) {
    return socket.emit('message', { sender: "Lobby", message })
}

function checkWinner(board:string) {
   const winningCombinations  = []

   winningCombinations.push("CCC------")
   winningCombinations.push("---CCC---")
   winningCombinations.push("------CCC")

   winningCombinations.push("C--C--C--")
   winningCombinations.push("-C--C--C-")
   winningCombinations.push("--C--C--C")

   winningCombinations.push("C---C---C")
   winningCombinations.push("--C-C-C--")

   return winningCombinations.indexOf(board)
}

/**
 * Implementação do controlador de lobbies.
 * @type {ILobbyController}
 */
const lobbyController: ILobbyController = {
    /**
     * Conecta um usuário a um lobby existente ou cria um novo lobby se necessário.
     * @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket - Socket do usuário.
     * @param {Lobby} lobbyData - Dados do lobby a ser conectado.
     * @param {User} userData - Dados do usuário a ser conectado.
     */
    connectUser(socket, lobbyData, userData) {
        let lobby = this.getLobbyFromId(lobbyData.id)

        if (!lobby) {
            let newLobbyId: string;
            if (lobbyData.id) {
                newLobbyId = lobbyData.id;
            } else {
                newLobbyId = generateLobbyId();
            }
            lobby = { id: newLobbyId, password: lobbyData.password, usersConnected: [] };
            lobbys.push(lobby);
        } else if (lobby.password !== lobbyData.password) return;

        let user = this.getUserFromSocket(socket)

        if (user) {
            this.disconnectUser(socket);
            user.currentLobby = lobby;
        }

        user = { name: userData.name.replaceAll(" ", "_"), currentLobby: lobby, socket: socket, currentGame:null };
        let acc = connectedUsers.reduce((count, cUser) => {
            return cUser.name === user.name ? count + 1 : count;
        }, 0);
        if (acc > 0) {
            user.name += `_${acc}`;
        }
        connectedUsers.push(user);
        lobby.usersConnected?.push(user);
        const data = { lobbyId: lobby.id, onlineUsers: lobby.usersConnected?.length, username: user?.name }
        user.socket.emit("lobbyConnected", data)
        lobby.usersConnected?.forEach(lUser => {
            lUser.socket.emit('message', { sender: "Lobby", message: `${user.name} Entrou no Lobby` })
        })

    },
    /**
     * Desconecta um usuário do servidor e remove-o do lobby atual.
     * @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket - Socket do usuário.
     */
    disconnectUser(socket) {
        const userIndex = connectedUsers.findIndex(user => user.socket.id === socket.id)

        if (userIndex < 0) return;
        const user = connectedUsers[userIndex];



        const game = games.find(game => game.firstPlayer.socket.id === socket.id || game.secondPlayer.socket.id === socket.id)
        if (game)
            this.endGame(socket, game?.id)


        if (user?.currentLobby) {
            const currentLobby = user.currentLobby;
            const userLobbyIndex = currentLobby.usersConnected?.findIndex(user => user.socket.id === socket.id)

            if (userLobbyIndex === undefined) return;

            currentLobby.usersConnected!.splice(userLobbyIndex, 1);
            if (currentLobby.usersConnected!.length <= 0) {
                const lobbyIndex = lobbys.findIndex(lobby => lobby.id === currentLobby.id)
                lobbys.splice(lobbyIndex, 1);
            }
        }

        connectedUsers.splice(userIndex, 1)
    },
    /**
     * Inicia um jogo entre os jogadores especificados.
     * @param {User[]} players - Lista de jogadores   que iniciarão o jogo.
     */
    startGame(challange) {
        const newGame: Game = { id: generateGameId(), currentTurn:0 , firstPlayer: challange.challanger, secondPlayer: challange.challanged, gameStatus: "---------" }
        games.push(newGame)
        sendLobbyMessage(newGame.firstPlayer.socket, "Iniciando Jogo")
        sendLobbyMessage(newGame.secondPlayer.socket, "Iniciando Jogo")
        newGame.firstPlayer.socket.emit("updateBoard", { id: newGame.id, gameStatus: newGame.gameStatus })
        newGame.secondPlayer.socket.emit("updateBoard", { id: newGame.id, gameStatus: newGame.gameStatus })
        newGame.firstPlayer.currentGame = newGame
        newGame.secondPlayer.currentGame = newGame
        // Implementar lógica para iniciar o jogo aqui
    },

    restartGame(socket, gameId) {
        const game = games.find(LGame => LGame.id === gameId)
        if (!game) return
        if(game.currentTurn >= 0) return
        if (socket.id != game.firstPlayer.socket.id && socket.id != game.secondPlayer.socket.id) return
        sendLobbyMessage(game.firstPlayer.socket,"Reiniciando Jogo")
        sendLobbyMessage(game.secondPlayer.socket,"Reiniciando Jogo")
        game.currentTurn = 0
        game.gameStatus = "---------"
        game.firstPlayer.socket.emit("updateBoard", { id: game.id, gameStatus: game.gameStatus })
        game.secondPlayer.socket.emit("updateBoard", { id: game.id, gameStatus: game.gameStatus })
    },
    /**
     * Finaliza um jogo, limpando recursos e atualizando o estado.
     */
    endGame(socket, gameId) {
        const game = games.find(LGame => LGame.id === gameId)
        if (!game) return
        if (socket.id != game.firstPlayer.socket.id && socket.id != game.secondPlayer.socket.id) return
        const quitter = this.getUserFromSocket(socket)
        const gameIndex = games.findIndex(LGame => LGame.id === gameId)
        game.firstPlayer.currentGame = null
        game.secondPlayer.currentGame = null
        sendLobbyMessage(game.firstPlayer.socket, `${quitter?.name} Desistiu da partida.`)
        sendLobbyMessage(game.secondPlayer.socket, `${quitter?.name} Desistiu da partida.`)
        games.splice(gameIndex, 1)
        
        // Implementar lógica para finalizar o jogo aqui
    },
    /**
     * Lida com as entradas do jogo (posições e valores).
     * @param {number} position - Posição no tabuleiro do jogo.
     * @param {number} value - Valor da entrada (ex: movimento do jogador).
     */
    gameInput(socket, position, value,gameId) {
        const game = games.find(LGame => LGame.id === gameId)
        if (!game) return
        if (socket.id != game.firstPlayer.socket.id && socket.id != game.secondPlayer.socket.id) return
        let winnerUser:string|null = null
        if(game.currentTurn < 0) return
        if(game.currentTurn % 2 == 0){
            if(game.firstPlayer.socket.id != socket.id) return
            if(game.gameStatus[position] != "-") return
            let gameStatusArray = game.gameStatus.split("")
            gameStatusArray[position] = "X"
            game.gameStatus = gameStatusArray.join("")
            let winner = checkWinner(game.gameStatus.replaceAll("X","C").replaceAll("O","-"))
            if(winner >= 0) 
                winnerUser = game.firstPlayer.name
        } else {
            if(game.secondPlayer.socket.id != socket.id) return
            if(game.gameStatus[position] != "-") return
            let gameStatusArray = game.gameStatus.split("")
            gameStatusArray[position] = "O"
            game.gameStatus = gameStatusArray.join("")
            let winner = checkWinner(game.gameStatus.replaceAll("X","C").replaceAll("O","-"))
            if(winner >= 0) 
                winnerUser = game.secondPlayer.name
        }

        game.currentTurn += 1
        game.firstPlayer.socket.emit("updateBoard", { id: game.id, gameStatus: game.gameStatus })
        game.secondPlayer.socket.emit("updateBoard", { id: game.id, gameStatus: game.gameStatus })

        if(winnerUser) {
            game.currentTurn = -1
            sendLobbyMessage(game.firstPlayer.socket,"Jogo Finalizado o Ganhor foi " + winnerUser)
            sendLobbyMessage(game.secondPlayer.socket,"Jogo Finalizado o Ganhor foi " + winnerUser)
        }

    },

    createChallangeInvite(socket, challangedName) {
        const challanged = lobbyController.getUserFromName(challangedName)
        if (challanged?.socket.id == socket.id)
            return socket.emit("message", { sender: "Lobby", message: "Você não pode jogar contra si mesmo" })

        const challanger = lobbyController.getUserFromSocket(socket)

        const challangerPlaying = games.find(game => game.firstPlayer.socket.id == challanger?.socket.id || game.secondPlayer.socket.id == challanger?.socket.id)
        if (challangerPlaying) return socket.emit("message", { sender: "Lobby", message: "Você já está em partida" })
        const challangedPlaying = games.find(game => game.firstPlayer.socket.id == challanged?.socket.id || game.secondPlayer.socket.id == challanged?.socket.id)
        if (challangedPlaying) return socket.emit("message", { sender: "Lobby", message: "Usuario já está em partida" })


        if (!challanged)
            return socket.emit("message", { sender: "Lobby", message: "Usuario Invalido" })
        if (!challanger)
            return
        const id = generateChallangeId()
        challanges.push({ id, challanger, challanged })
        sendLobbyMessage(socket, "Desafio enviado para "+challangedName)
        challanged?.socket.emit("message", { sender: "Lobby", message: `Usuario ${challanger?.name} te desafiou para uma partida.` })
        challanged?.socket.emit("message", { sender: "Lobby", message: `Digite /accept ${id} para aceitar ou /decline ${id} para recusar ` })
    },

    acceptChallangeInvite(socket, challangeId) {
        const challange = challanges.find(LChallange => LChallange.id === challangeId)
        if (!challange) return socket.emit("message", { sender: "Lobby", message: "Desafio Invalido" })
        const user = connectedUsers.find(LUser => LUser.socket.id === socket.id)
        if (challange?.challanged.socket.id === user?.socket.id) {
            challange.challanger.socket.emit("message", { sender: "Lobby", message: `Usuario ${challange.challanged?.name} aceitou seu desafio.` })
            this.startGame(challange)
            const challangeIndex = challanges.findIndex(LChallange => LChallange.id === challangeId)
            challanges.splice(challangeIndex, 1)
        }
    },
    declineChallangeInvite(socket, challangeId) {
        const challange = challanges.find(LChallange => LChallange.id === challangeId)
        if (!challange) return socket.emit("message", { sender: "Lobby", message: "Desafio Invalido" })
        const user = connectedUsers.find(LUser => LUser.socket.id === socket.id)
        if (challange?.challanged.socket.id === user?.socket.id) {
            challange.challanger.socket.emit("message", { sender: "Lobby", message: `Usuario ${challange.challanged?.name} recusou seu desafio.` })
            const challangeIndex = challanges.findIndex(LChallange => LChallange.id === challangeId)
            challanges.splice(challangeIndex, 1)
        }
    },
    /**
     * Lida com mensagens entre os usuários.
     * @param {Message} message - Mensagem a ser processada.
     */
    message(socket, message) {
        const senderUser = this.getUserFromSocket(socket)
        if (!senderUser) return
        senderUser.currentLobby!.usersConnected?.forEach(user => {
            user.socket.emit('message', { sender: senderUser.name, message })
        })
    },

    getUserFromName(username) {
        return connectedUsers.find(user => user.name == username)
    },

    getUserFromSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): User | undefined {
        return connectedUsers.find(user => user.socket.id === socket.id)
    },

    getLobbyFromId(id: string): Lobby | undefined {
        return lobbys.find(lobby => lobby.id === id);
    },

};

export default lobbyController;
