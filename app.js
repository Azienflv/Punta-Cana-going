document.getElementById("form").addEventListener("submit", function(e){

e.preventDefault()

let client = document.getElementById("client").value
let hotel = document.getElementById("hotel").value
let excursion = document.getElementById("excursion").value
let adults = document.getElementById("adults").value
let kids = document.getElementById("kids").value
let price = document.getElementById("price").value

let reservation = {
client,
hotel,
excursion,
adults,
kids,
price
}

let data = JSON.parse(localStorage.getItem("reservations")) || []

data.push(reservation)

localStorage.setItem("reservations", JSON.stringify(data))

alert("Reservation Saved!")

})
