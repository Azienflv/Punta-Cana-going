let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function guardarReserva() {
  const cliente = document.getElementById("cliente").value;
  const hotel = document.getElementById("hotel").value;
  const tour = document.getElementById("tour").value;
  const adultos = document.getElementById("adultos").value;
  const ninos = document.getElementById("ninos").value;

  const reserva = { cliente, hotel, tour, adultos, ninos };

  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  alert("Reserva guardada ✅");

  mostrarReservas();
}

function mostrarReservas() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  reservas.forEach(r => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <strong>${r.cliente}</strong><br>
      Hotel: ${r.hotel}<br>
      Tour: ${r.tour}<br>
      Adultos: ${r.adultos} | Niños: ${r.ninos}
    `;

    lista.appendChild(div);
  });
}

// Cargar al inicio
mostrarReservas();
