# Servidor de Jogo da Velha com Suporte a Chat e Multissessões

Este projeto é um servidor para um jogo da velha online, que também oferece suporte a chat em tempo real. Ele permite a criação de várias sessões de comunicação, onde os usuários podem interagir e iniciar partidas de jogo da velha, mantendo várias partidas e convites ativos simultaneamente.

## Visão Geral

O objetivo principal do projeto é criar um ambiente onde os usuários possam:

- Conectar-se a uma sessão usando um ID e senha.
- Participar de um chat para comunicação com outros usuários na sessão.
- Enviar e gerenciar convites para jogar jogo da velha.
- Aceitar ou recusar convites para partidas.
- Gerenciar várias partidas dentro da mesma sessão (um usuário pode ter apenas um jogo ativo por vez).

A arquitetura do projeto foi desenvolvida para simular um ambiente de chat interativo e lúdico, promovendo interação social e diversão.

## Funcionalidades

- **Sessões protegidas por ID e senha:** Acesso seguro a cada sessão de chat e jogo.
- **Chat em tempo real:** Comunicação instantânea entre os usuários conectados.
- **Gerenciamento de convites:** Possibilidade de enviar e aceitar convites para partidas de jogo da velha.
- **Multijogos na mesma sessão:** Suporte para múltiplas partidas de jogo da velha, com gerenciamento de status dos jogos.
- **Uso exclusivo de uma partida ativa por usuário:** Evita conflitos entre jogos simultâneos.

## Tecnologias Utilizadas

- **Express.js:** Framework para desenvolvimento do backend e gerenciamento das rotas.
- **Socket.IO:** Biblioteca para comunicação em tempo real entre os usuários.

## Comandos Disponíveis

Aqui estão os comandos suportados no sistema e seus parâmetros:

- **`challenge <nome_usuario>`**  
  Envia um convite para jogar jogo da velha ao usuário especificado.  
  - **Parâmetro:** `nome_usuario` - Nome do usuário desafiado.  

- **`accept <id_convite>`**  
  Aceita um convite de jogo.  
  - **Parâmetro:** `id_convite` - Identificador do convite recebido.  

- **`reject <id_convite>`**  
  Recusa um convite de jogo.  
  - **Parâmetro:** `id_convite` - Identificador do convite recebido.  

- **`restart`**  
  Reinicia a partida atual.  
  - **Parâmetro:** Nenhum.  

- **`leave`**  
  Sai da partida atual.  
  - **Parâmetro:** Nenhum.  

## Como Executar o Projeto

1. **Pré-requisitos:** Certifique-se de ter o Node.js e o npm instalados.
2. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
3. **Instale as dependências:**
   ```bash
   cd <PASTA_DO_PROJETO>
   npm install
   ```
4. **Inicie o servidor:**
   ```bash
   npm start
   ```
5. **Acesse o servidor:** O servidor estará disponível em `http://localhost:3000`.

