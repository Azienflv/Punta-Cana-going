// 🔹 CAMBIAR SECCIONES
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// 🔥 GUARDAR EXCURSIÓN
function guardarExcursion() {

  const nombre = document.getElementById("nombreExcursion").value;
  const precioAdulto = document.getElementById("precioAdulto").value;
  const precioNino = document.getElementById("precioNino").value;

  if (!nombre) {
    alert("Pon nombre a la excursión");
    return;
  }

  db.collection("excursiones").add({
    nombre,
    precioAdulto,
    precioNino
  }).then(() => {
    alert("Excursión guardada ✅");
    cargarExcursiones();
  });
}

// 🔥 CARGAR EXCURSIONES
function cargarExcursiones() {

  const lista = document.getElementById("listaExcursiones");
  const select = document.getElementById("tour");

  if (!select) return;

  lista.innerHTML = "";
  select.innerHTML = "";

  db.collection("excursiones").get().then((querySnapshot) => {

    querySnapshot.forEach((doc) => {

      const e = doc.data();

      // Mostrar en lista
      lista.innerHTML += `
        <div class="card">
          ${e.nombre} - 👨 ${e.precioAdulto} / 👶 ${e.precioNino}
        </div>
      `;

      // Agregar al select
      select.innerHTML += `
        <option value="${e.nombre}" 
          data-adulto="${e.precioAdulto}" 
          data-nino="${e.precioNino}">
          ${e.nombre}
        </option>
      `;
    });

  });
}

// 🔥 CALCULAR TOTAL AUTOMÁTICO
function calcularTotal() {

  const select = document.getElementById("tour");
  const option = select.options[select.selectedIndex];

  if (!option) return;

  const precioAdulto = parseFloat(option.getAttribute("data-adulto")) || 0;
  const precioNino = parseFloat(option.getAttribute("data-nino")) || 0;

  const adultos = parseFloat(document.getElementById("adultos").value) || 0;
  const ninos = parseFloat(document.getElementById("ninos").value) || 0;
  const descuento = parseFloat(document.getElementById("descuento").value) || 0;

  let total = (adultos * precioAdulto) + (ninos * precioNino);
  total = total - descuento;

  document.getElementById("total").value = total;
}

// 🔥 EVENTOS AUTOMÁTICOS
document.addEventListener("input", function(e) {
  if (
    e.target.id === "adultos" ||
    e.target.id === "ninos" ||
    e.target.id === "descuento"
  ) {
    calcularTotal();
  }
});

document.addEventListener("change", function(e) {
  if (e.target.id === "tour") {
    calcularTotal();
  }
});

// 🔥 GUARDAR RESERVA COMPLETA
function guardarReserva() {

  const cliente = document.getElementById("cliente").value;
  const hotel = document.getElementById("hotel").value;
  const tour = document.getElementById("tour").value;
  const adultos = document.getElementById("adultos").value;
  const ninos = document.getElementById("ninos").value;
  const fecha = document.getElementById("fecha").value;
  const descuento = document.getElementById("descuento").value;
  const total = document.getElementById("total").value;

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
    fecha,
    descuento,
    total,
    estado: "confirmada"
  };

  db.collection("reservas").add(reserva)
    .then(() => {
      alert("Reserva guardada ✅");
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
          ${r.tour}<br>
          📅 ${r.fecha}<br>
          💰 ${r.total}
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
  document.getElementById("descuento").value = "";
  document.getElementById("total").value = "";
}

// 🔥 CARGA INICIAL
window.onload = () => {
  mostrarReservas();
  cargarExcursiones();
};
