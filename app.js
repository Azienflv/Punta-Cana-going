let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

async function guardarReserva() {

  const reserva = {
    cliente: cliente.value,
    hotel: hotel.value,
    tour: tour.value,
    adultos: adultos.value,
    ninos: ninos.value,
    fecha: new Date()
  };

  try {
    await db.collection("reservas").add(reserva);
    alert("Guardado en la nube ☁️");

    mostrarReservas();

  } catch (error) {
    console.error("Error:", error);
  }
}

  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  mostrarReservas();
  alert("Guardado ✔");
}

async function mostrarReservas() {

  lista.innerHTML = "";

  const querySnapshot = await db.collection("reservas").get();

  querySnapshot.forEach((doc) => {
    const r = doc.data();

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
