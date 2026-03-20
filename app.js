let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function guardarReserva() {

  const reserva = {
    cliente: document.getElementById("cliente").value,
    hotel: document.getElementById("hotel").value,
    tour: document.getElementById("tour").value,
    adultos: document.getElementById("adultos").value,
    ninos: document.getElementById("ninos").value,
    fecha: new Date()
  };

  db.collection("reservas").add(reserva)
    .then(() => {
      alert("Guardado en Firebase ✅");
      mostrarReservas();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

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
