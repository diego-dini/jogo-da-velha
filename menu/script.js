function teste(event) {
	if (document.querySelector("#password").value.length != 0) {
		let login = {
			player_name: document.querySelector("#player_name").value,
			password: document.querySelector("#password").value
		}
		const options = {
			method: "POST",
			body: JSON.stringify(login),
			headers: {
				"Content-Type": "application/json"
			}
		}
		fetch('https://d4d6bcee-edc1-4760-8615-446d7e8c7519-00-xcseaj1s1nas.global.replit.dev/login', options).then(e => window.location.href = "https://d4d6bcee-edc1-4760-8615-446d7e8c7519-00-xcseaj1s1nas.global.replit.dev/game/" + JSON.stringify(login))
	} else {
		document.querySelector("#password").style.backgroundColor = "red"
	}


}