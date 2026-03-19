let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function guardarReserva() {
  const reserva = {
    cliente: cliente.value,
    hotel: hotel.value,
    tour: tour.value,
    adultos: adultos.value,
    ninos: ninos.value
  };

  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  mostrarReservas();
  alert("Guardado ✔");
}

function mostrarReservas() {
  lista.innerHTML = "";

  reservas.forEach(r => {
    lista.innerHTML += `
      <div class="card">
        <b>${r.cliente}</b><br>
        ${r.hotel}<br>
        ${r.tour}<br>
        👨 ${r.adultos} | 👶 ${r.ninos}
      </div>
    `;
  });
}

mostrarReservas();
