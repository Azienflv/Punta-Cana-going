// 🔹 CAMBIAR SECCIONES
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// 🔥 GENERAR VOUCHER PDF
function generarVoucher(reserva) {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("PCG TOURS", 20, 20);

  doc.setFontSize(12);
  doc.text("Voucher de Reserva", 20, 30);

  doc.line(20, 35, 190, 35);

  doc.text(`Cliente: ${reserva.cliente}`, 20, 50);
  doc.text(`Hotel: ${reserva.hotel}`, 20, 60);
  doc.text(`Excursión: ${reserva.tour}`, 20, 70);
  doc.text(`Fecha: ${reserva.fecha}`, 20, 80);

  doc.text(`Adultos: ${reserva.adultos}`, 20, 95);
  doc.text(`Niños: ${reserva.ninos}`, 20, 105);

  doc.text(`Descuento: ${reserva.descuento}`, 20, 120);
  doc.text(`Total: ${reserva.total}`, 20, 130);

  doc.line(20, 140, 190, 140);
  doc.text("Gracias por elegir PCG Tours", 20, 155);

  doc.save(`voucher_${reserva.cliente}.pdf`);
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

// 🔥 ELIMINAR EXCURSIÓN
function eliminarExcursion(id) {
  if (!confirm("¿Eliminar excursión?")) return;

  db.collection("excursiones").doc(id).delete()
    .then(() => {
      alert("Eliminado ✅");
      cargarExcursiones();
    });
}

// 🔥 EDITAR EXCURSIÓN
function editarExcursion(id) {

  const precioAdulto = document.getElementById(`adulto-${id}`).value;
  const precioNino = document.getElementById(`nino-${id}`).value;

  db.collection("excursiones").doc(id).update({
    precioAdulto,
    precioNino
  }).then(() => {
    alert("Actualizado ✅");
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

      lista.innerHTML += `
        <div class="card">
          <b>${e.nombre}</b><br>

          👨 <input id="adulto-${doc.id}" value="${e.precioAdulto}">
          👶 <input id="nino-${doc.id}" value="${e.precioNino}"><br><br>

          <button onclick="editarExcursion('${doc.id}')">💾</button>
          <button onclick="eliminarExcursion('${doc.id}')">🗑️</button>
        </div>
      `;

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

// 🔥 CALCULAR TOTAL
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

// 🔥 EVENTOS
document.addEventListener("input", function(e) {
  if (["adultos", "ninos", "descuento"].includes(e.target.id)) {
    calcularTotal();
  }
});

document.addEventListener("change", function(e) {
  if (e.target.id === "tour") {
    calcularTotal();
  }
});

// 🔥 GUARDAR RESERVA
function guardarReserva() {

  const reserva = {
    cliente: cliente.value,
    hotel: hotel.value,
    tour: tour.value,
    adultos: adultos.value,
    ninos: ninos.value,
    fecha: fecha.value,
    descuento: descuento.value,
    total: total.value
  };

  db.collection("reservas").add(reserva)
    .then(() => {
      alert("Reserva guardada ✅");

      generarVoucher(reserva); // 🔥 genera PDF

      limpiarFormulario();
      mostrarReservas();
    });
}

// 🔥 ELIMINAR RESERVA
function eliminarReserva(id) {

  if (!confirm("¿Eliminar reserva?")) return;

  db.collection("reservas").doc(id).delete()
    .then(() => {
      alert("Eliminada ✅");
      mostrarReservas();
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
          💰 ${r.total}<br><br>

          <button onclick='generarVoucher(${JSON.stringify(r)})'>🧾</button>
          <button onclick="eliminarReserva('${doc.id}')">🗑️</button>
        </div>
      `;
    });

  });
}

// 🔥 LIMPIAR
function limpiarFormulario() {
  cliente.value = "";
  hotel.value = "";
  adultos.value = "";
  ninos.value = "";
  descuento.value = "";
  total.value = "";
}

// 🔥 INICIO
window.onload = () => {
  mostrarReservas();
  cargarExcursiones();
};
