let x = "https://contmoura.com.br/wp-content/uploads/2019/09/x-png-icon-8.png"
let o = "https://static.vecteezy.com/system/resources/previews/001/192/291/original/circle-png.png"
let white = "https://i.pinimg.com/originals/f5/05/24/f50524ee5f161f437400aaf215c9e12f.jpg"
let game = {
  current_turn: 0,
  turn: 1,
  grid: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ended: false
}
let visual_grid = []

let server_url = "https://d4d6bcee-edc1-4760-8615-446d7e8c7519-00-xcseaj1s1nas.global.replit.dev/t/"
let MyInformation
let MyName


window.onload = () => {
  MyInformation = window.location.href.replace('https://d4d6bcee-edc1-4760-8615-446d7e8c7519-00-xcseaj1s1nas.global.replit.dev/game/', '')
  server_url = server_url + MyInformation
  t = Object.values(document.querySelector("#game").childNodes)

  visual_grid = t.filter(i => {
    try {
      if (i.getAttribute("class") == "game_spot")
        return true
      else
        return false
    }
    catch { }
  })

  visual_grid.forEach(e => e.addEventListener('click', click_action))
  visual_grid.forEach(e => e.setAttribute('src', white))
  document.querySelector("#reset").addEventListener('click', () => {
    visual_grid.forEach(e => e.setAttribute('src', white))
    receive()
  })
  setInterval(receive, 500)

}

function click_action() {
  let id = this.getAttribute("id")
  if (game.ended) {
    return
  }
  if (game.turn == 1) {
    if (game.grid[id] == 0) {
      game.grid[id] = 1
      game.ended = check_x(1)
      game.turn = 2
      change_visual()
    }
  }
  else if (game.turn == 2) {
    if (game.grid[id] == 0) {
      game.grid[id] = 2
      game.ended = check_x(2)
      game.turn = 1
      change_visual()
    }
  }
  ///${JSON.stringify(game)}
  att(`https://d4d6bcee-edc1-4760-8615-446d7e8c7519-00-xcseaj1s1nas.global.replit.dev/y/${MyInformation}`)
}


function change_visual() {
  //console.log(game.grid)
  for (i = 0; i < game.grid.length; i++) {
    switch (game.grid[i]) {
      case 0:
        visual_grid[i].setAttribute('src', white)
        break
      case 1:
        visual_grid[i].setAttribute('src', x)
        break
      case 2:
        visual_grid[i].setAttribute('src', o)
        break
    }
  }
}

function check_x(value) {
  // Rows check
  if (check_values(0, 1, 2, value)) {
    change_color(0, 1, 2, "red")
    return true
  }
  if (check_values(3, 4, 5, value)) {
    change_color(3, 4, 5, "red")
    return true
  }
  if (check_values(6, 7, 8, value)) {
    change_color(6, 7, 8, "red")
    return true
  }
  //colums check
  if (check_values(0, 3, 6, value)) {
    change_color(0, 3, 6, "red")
    return true
  }
  if (check_values(1, 4, 7, value)) {
    change_color(1, 4, 7, "red")
    return true
  }
  if (check_values(2, 5, 8, value)) {
    change_color(2, 5, 8, "red")
    return true
  }
  //X check
  if (check_values(0, 4, 8, value)) {
    change_color(0, 4, 8, "red")
    return true
  }
  if (check_values(2, 4, 6, value)) {
    change_color(2, 4, 6, "red")
    return true
  }
  reset_background()
  return false
}

function check_values(v1, v2, v3, value) {
  return game.grid[v1] == value && game.grid[v2] == value && game.grid[v3] == value
}

function change_color(v1, v2, v3, color) {
  visual_grid[v1].style.backgroundColor = color
  visual_grid[v2].style.backgroundColor = color
  visual_grid[v3].style.backgroundColor = color
}

function reset_background() {
  visual_grid.forEach(i => {
    i.style.backgroundColor = "white"
  })
}

function receive(url = server_url) {
  fetch(url, { method: 'GET' })
    .then(response => response.text())
    .then(texto => game = JSON.parse(texto))
    .catch(err => console.log(err.message))
  change_visual()
}

function att(url) {


  cadastraUsuario(url)
}
/*var xhttp = new XMLHttpRequest()
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    change_visual()
  }
};
xhttp.open("GET", url, true);
xhttp.send(game);*/

function cadastraUsuario(url) {
  const options = {
    method: "POST",
    body: JSON.stringify(game),
    headers: {
      "Content-Type": "application/json"
    }
  }
  fetch(url, options)
}