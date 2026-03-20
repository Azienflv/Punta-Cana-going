
:::writing{variant=“standard” id=“app-final”}
/* 🔹 VARIABLES DOM (IMPORTANTE) */
const cliente = document.getElementById(“cliente”);
const hotel = document.getElementById(“hotel”);
const tour = document.getElementById(“tour”);
const adultos = document.getElementById(“adultos”);
const ninos = document.getElementById(“ninos”);
const descuento = document.getElementById(“descuento”);
const total = document.getElementById(“total”);
const fecha = document.getElementById(“fecha”);

const lista = document.getElementById(“lista”);
const listaExcursiones = document.getElementById(“listaExcursiones”);

const nombreExcursion = document.getElementById(“nombreExcursion”);
const precioAdulto = document.getElementById(“precioAdulto”);
const precioNino = document.getElementById(“precioNino”);

/* 🔹 MENU */
function toggleMenu() {
const menu = document.getElementById(“submenuExcursiones”);
menu.style.display = menu.style.display === “none” ? “block” : “none”;
}

/* 🔹 CAMBIO DE SECCIÓN */
function showSection(id) {
document.querySelectorAll(”.section”).forEach(sec => {
sec.classList.remove(“active”);
});

document.getElementById(id).classList.add(“active”);

if (id === “dashboard”) cargarDashboard();
}

/* 🔹 DASHBOARD */
function cargarDashboard() {
let totalIngresos = 0;
let totalReservas = 0;
let ingresosHoy = 0;

const hoy = new Date().toISOString().split(“T”)[0];

db.collection(“reservas”).get().then(snapshot => {
snapshot.forEach(doc => {
const r = doc.data();
const precio = parseFloat(r.total) || 0;

  totalIngresos += precio;
  totalReservas++;

  if (r.fecha === hoy) ingresosHoy += precio;
});

document.getElementById("totalIngresos").innerText = totalIngresos.toFixed(2);
document.getElementById("totalReservas").innerText = totalReservas;
document.getElementById("ingresosHoy").innerText = ingresosHoy.toFixed(2);
});
}

/* 🔹 EXCURSIONES */
function guardarExcursion() {
db.collection(“excursiones”).add({
nombre: nombreExcursion.value,
precioAdulto: precioAdulto.value,
precioNino: precioNino.value
}).then(() => {
nombreExcursion.value = “”;
precioAdulto.value = “”;
precioNino.value = “”;
cargarExcursiones();
});
}

function cargarExcursiones() {
listaExcursiones.innerHTML = “”;
tour.innerHTML = “”;

db.collection(“excursiones”).get().then(snapshot => {
snapshot.forEach(doc => {
const e = doc.data();
    listaExcursiones.innerHTML += `
    <div class="card">
      <b>${e.nombre}</b><br>
      👨 $${e.precioAdulto} | 👶 $${e.precioNino}
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

/* 🔹 CALCULAR TOTAL */
function calcularTotal() {
const option = tour.options[tour.selectedIndex];

const precioA = parseFloat(option?.dataset.adulto || 0);
const precioN = parseFloat(option?.dataset.nino || 0);

const totalCalc =
(parseFloat(adultos.value) || 0) * precioA +
(parseFloat(ninos.value) || 0) * precioN -
(parseFloat(descuento.value) || 0);

total.value = totalCalc.toFixed(2);
}

document.addEventListener(“input”, calcularTotal);
document.addEventListener(“change”, calcularTotal);

/* 🔹 GUARDAR RESERVA */
function guardarReserva() {

const reserva = {
cliente: cliente.value,
hotel: hotel.value,
tour: tour.value,
adultos: adultos.value,
ninos: ninos.value,
fecha: fecha.value,
descuento: parseFloat(descuento.value) || 0,
total: parseFloat(total.value) || 0
};

db.collection(“reservas”).add(reserva).then(() => {
generarVoucher(reserva);
limpiarFormulario();
mostrarReservas();
cargarDashboard();
});
}

/* 🔹 LIMPIAR FORM */
function limpiarFormulario() {
cliente.value = “”;
hotel.value = “”;
adultos.value = “”;
ninos.value = “”;
descuento.value = “”;
total.value = “”;
}

/* 🔹 VOUCHER */
function generarVoucher(r) {

const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.setFontSize(18);
doc.text(“PCG TOURS VOUCHER”, 50, 15);

doc.line(10, 20, 200, 20);

doc.setFontSize(12);

doc.text(Cliente: ${r.cliente}, 10, 30);
doc.text(Hotel: ${r.hotel}, 10, 40);
doc.text(Excursión: ${r.tour}, 10, 50);
doc.text(Fecha: ${r.fecha}, 10, 60);

doc.line(10, 70, 200, 70);

doc.text(Adultos: ${r.adultos}, 10, 80);
doc.text(Niños: ${r.ninos}, 10, 90);
doc.text(Descuento: $${r.descuento}, 10, 100);

doc.setFontSize(16);
doc.text(TOTAL: $${r.total}, 10, 120);

doc.setFontSize(10);
doc.text(“Punta Cana Going”, 10, 150);

doc.save(voucher_${r.cliente}.pdf);
}

/* 🔹 WHATSAPP */
function enviarWhatsApp(cliente, tour, total) {
const mensaje = Hola ${cliente}, tu reserva para ${tour} está confirmada. Total: $${total};
const url = https://wa.me/?text=${encodeURIComponent(mensaje)};
window.open(url, “_blank”);
}

/* 🔹 ELIMINAR */
function eliminarReserva(id) {
db.collection(“reservas”).doc(id).delete().then(() => {
mostrarReservas();
cargarDashboard();
});
}

/* 🔹 MOSTRAR RESERVAS */
function mostrarReservas() {

lista.innerHTML = “”;

db.collection(“reservas”).get().then(snapshot => {
  snapshot.forEach(doc => {

  const r = doc.data();
  const id = doc.id;

  const dataSafe = JSON.stringify(r).replace(/'/g, "&apos;");

  lista.innerHTML += `
    <div class="card reserva-card">
      <b>${r.cliente}</b><br>
      🏨 ${r.hotel}<br>
      🏝 ${r.tour}<br>
      👨 ${r.adultos} | 👶 ${r.ninos}<br>
      💰 $${r.total}<br><br>

      <button class="btn-voucher" onclick='generarVoucher(${dataSafe})'>🧾 Voucher</button>
      <button class="btn-whatsapp" onclick="enviarWhatsApp('${r.cliente}','${r.tour}','${r.total}')">📲 WhatsApp</button>
      <button class="btn-delete" onclick="eliminarReserva('${id}')">❌ Eliminar</button>
    </div>
  `;
});
  snapshot.forEach(doc => {

  const r = doc.data();
  const id = doc.id;

  const dataSafe = JSON.stringify(r).replace(/'/g, "&apos;");

  lista.innerHTML += `
    <div class="card reserva-card">
      <b>${r.cliente}</b><br>
      🏨 ${r.hotel}<br>
      🏝 ${r.tour}<br>
      👨 ${r.adultos} | 👶 ${r.ninos}<br>
      💰 $${r.total}<br><br>

      <button class="btn-voucher" onclick='generarVoucher(${dataSafe})'>🧾 Voucher</button>
      <button class="btn-whatsapp" onclick="enviarWhatsApp('${r.cliente}','${r.tour}','${r.total}')">📲 WhatsApp</button>
      <button class="btn-delete" onclick="eliminarReserva('${id}')">❌ Eliminar</button>
    </div>
  `;
});
  });
}

/* 🔹 INIT */
window.onload = () => {
mostrarReservas();
cargarExcursiones();
cargarDashboard();
};
:::

  

  
