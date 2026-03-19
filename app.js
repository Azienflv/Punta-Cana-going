function getReservations() {
    return JSON.parse(localStorage.getItem("reservations")) || []
}

function saveReservations(data) {
    localStorage.setItem("reservations", JSON.stringify(data))
}

function renderReservations() {
    let list = document.getElementById("reservationsList")
    list.innerHTML = ""

    let data = getReservations()

    data.forEach((res, index) => {
        let div = document.createElement("div")

        div.innerHTML = `
        <p><b>${res.client}</b> - ${res.excursion}</p>
        <p>Hotel: ${res.hotel}</p>
        <p>Total: $${res.price}</p>
        <button onclick="deleteReservation(${index})">Delete</button>
        <hr>
        `

        list.appendChild(div)
    })
}

function deleteReservation(index) {
    let data = getReservations()
    data.splice(index, 1)
    saveReservations(data)
    renderReservations()
}

document.getElementById("form").addEventListener("submit", function(e){

    e.preventDefault()

    let reservation = {
        client: document.getElementById("client").value,
        hotel: document.getElementById("hotel").value,
        excursion: document.getElementById("excursion").value,
        adults: document.getElementById("adults").value,
        kids: document.getElementById("kids").value,
        price: document.getElementById("price").value
    }

    let data = getReservations()
    data.push(reservation)

    saveReservations(data)

    alert("Reservation Saved!")

    renderReservations()
})

renderReservations()
