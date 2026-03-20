function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// 🔥 GUARDAR EN FIREBASE
function guardarReserva() {

  const cliente = document.getElementById("cliente").value;
  const hotel = document.getElementById("hotel").value;
  const tour = document.getElementById("tour").value;
  const adultos = document.getElementById("adultos").value;
  const ninos = document.getElementById("ninos").value;

  if (!cliente || !hotel) {
    alert("Completa los campos");
    return;
  }

  const reserva = {
    cliente,
    hotel,
    tour,
    adultos,
    ninos,
    fecha: new Date()
  };

  db.collection("reservas").add(reserva)
    .then(() => {
      alert("Guardado en Firebase ✅");
      limpiarFormulario();
      mostrarReservas();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al guardar");
    });
}

// 🔥 MOSTRAR RESERVAS
function mostrarReservas() {

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  db.collection("reservas").get().then((querySnapshot) => {

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

  });
}

// 🔥 LIMPIAR FORMULARIO
function limpiarFormulario() {
  document.getElementById("cliente").value = "";
  document.getElementById("hotel").value = "";
  document.getElementById("adultos").value = "";
  document.getElementById("ninos").value = "";
}

// 🔥 CARGAR AL INICIO
window.onload = mostrarReservas;
