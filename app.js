// 🔹 MENÚ DESPLEGABLE
function toggleMenu() {
  const menu = document.getElementById("submenuExcursiones");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

// 🔹 CAMBIO DE SECCIÓN
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  if (id === "dashboard") cargarDashboard();
}

// 🔹 DASHBOARD
function cargarDashboard() {

  let totalIngresos = 0;
  let totalReservas = 0;
  let ingresosHoy = 0;

  const hoy = new Date().toISOString().split("T")[0];

  db.collection("reservas").get().then(snapshot => {

    snapshot.forEach(doc => {
      const r = doc.data();
      const total = parseFloat(r.total) || 0;

      totalIngresos += total;
      totalReservas++;

      if (r.fecha === hoy) ingresosHoy += total;
    });

    totalIngresos = totalIngresos.toFixed(2);

    totalIngresos && (totalIngresos = totalIngresos);

    document.getElementById("totalIngresos").innerText = totalIngresos;
    document.getElementById("totalReservas").innerText = totalReservas;
    document.getElementById("ingresosHoy").innerText = ingresosHoy;
  });
}

// 🔹 EXCURSIONES
function guardarExcursion() {
  db.collection("excursiones").add({
    nombre: nombreExcursion.value,
    precioAdulto: precioAdulto.value,
    precioNino: precioNino.value
  }).then(() => cargarExcursiones());
}

function cargarExcursiones() {

  listaExcursiones.innerHTML = "";
  tour.innerHTML = "";

  db.collection("excursiones").get().then(snapshot => {

    snapshot.forEach(doc => {

      const e = doc.data();

      listaExcursiones.innerHTML += `
        <div class="card">
          ${e.nombre}<br>
          👨 ${e.precioAdulto} | 👶 ${e.precioNino}
        </div>
      `;

      tour.innerHTML += `
        <option value="${e.nombre}" 
          data-adulto="${e.precioAdulto}" 
          data-nino="${e.precioNino}">
          ${e.nombre}
        </option>
      `;
    });
  });
}

// 🔹 CALCULAR TOTAL
function calcularTotal() {

  const option = tour.options[tour.selectedIndex];

  const precioA = parseFloat(option?.dataset.adulto || 0);
  const precioN = parseFloat(option?.dataset.nino || 0);

  const totalCalc =
    (adultos.value * precioA || 0) +
    (ninos.value * precioN || 0) -
    (descuento.value || 0);

  total.value = totalCalc;
}

document.addEventListener("input", calcularTotal);
document.addEventListener("change", calcularTotal);

// 🔹 GUARDAR RESERVA
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

  db.collection("reservas").add(reserva).then(() => {
    generarVoucher(reserva);
    mostrarReservas();
    cargarDashboard();
  });
}

// 🔹 VOUCHER PDF
function generarVoucher(r) {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text(`Cliente: ${r.cliente}`, 10, 20);
  doc.text(`Tour: ${r.tour}`, 10, 30);
  doc.text(`Total: ${r.total}`, 10, 40);

  doc.save(`voucher_${r.cliente}.pdf`);
}

// 🔹 MOSTRAR RESERVAS
function mostrarReservas() {

  lista.innerHTML = "";

  db.collection("reservas").get().then(snapshot => {

    snapshot.forEach(doc => {

      const r = doc.data();

      lista.innerHTML += `
        <div class="card">
          ${r.cliente}<br>
          ${r.tour}<br>
          💰 ${r.total}
        </div>
      `;
    });
  });
}

// 🔹 INICIO
window.onload = () => {
  mostrarReservas();
  cargarExcursiones();
  cargarDashboard();
};
