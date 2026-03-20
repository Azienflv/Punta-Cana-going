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


  :::writing{variant=“standard” id=“voucher-pro”}
/* 🔥 VOUCHER PROFESIONAL ESTILO AGENCIA */
function generarVoucher(r) {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // 🔹 LOGO
  const img = new Image();
  img.src = "logo.png";

  // 🔹 HEADER
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, 210, 30, "F");

  doc.addImage(img, "PNG", 10, 5, 30, 20);

  doc.setFontSize(18);
  doc.text("PCG TOURS", 50, 15);

  doc.setFontSize(10);
  doc.text("Tour Voucher", 50, 22);

  // 🔹 INFO GENERAL
  doc.setFontSize(12);

  doc.text(`Cliente: ${r.cliente}`, 10, 50);
  doc.text(`Hotel: ${r.hotel}`, 10, 60);
  doc.text(`Excursión: ${r.tour}`, 10, 70);
  doc.text(`Fecha: ${r.fecha}`, 10, 80);

  // 🔹 DETALLE
  doc.line(10, 90, 200, 90);

  doc.text(`Adultos: ${r.adultos}`, 10, 100);
  doc.text(`Niños: ${r.ninos}`, 10, 110);
  doc.text(`Descuento: $${r.descuento}`, 10, 120);

  doc.setFontSize(16);
  doc.text(`TOTAL: $${r.total}`, 10, 140);

  // 🔹 POLÍTICAS (igual estilo OTIUM)
  doc.setFontSize(9);

  doc.text("POLÍTICAS DE CANCELACIÓN Y/O REEMBOLSO", 10, 160);

  doc.text(
`a) Cancelaciones con 48 horas antes del tour.
b) Cancelaciones por enfermedad requieren certificado médico.
c) No hay reembolso por no presentación.
d) No aplica en tours con descuento.`,
  10,
  168
  );

  doc.text("Punta Cana Going - PCG Tours", 10, 190);

  doc.save(`voucher_${r.cliente}.pdf`);
}

900000);
}
:::


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
