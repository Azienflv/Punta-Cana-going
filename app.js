// 🔹 MENU
function toggleMenu() {
  const menu = document.getElementById("submenuExcursiones");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
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

    document.getElementById("totalIngresos").innerText = totalIngresos.toFixed(2);
    document.getElementById("totalReservas").innerText = totalReservas;
    document.getElementById("ingresosHoy").innerText = ingresosHoy.toFixed(2);
  });
}

// 🔹 EXCURSIONES
function guardarExcursion() {

  db.collection("excursiones").add({
    nombre: nombreExcursion.value,
    precioAdulto: precioAdulto.value,
    precioNino: precioNino.value
  }).then(() => {

    nombreExcursion.value = "";
    precioAdulto.value = "";
    precioNino.value = "";

    cargarExcursiones();
  });
}

function cargarExcursiones() {

  listaExcursiones.innerHTML = "";
  tour.innerHTML = "";

  db.collection("excursiones").get().then(snapshot => {

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

// 🔹 EVENTOS SOLO EN INPUTS
["adultos", "ninos", "descuento", "tour"].forEach(id => {
  document.getElementById(id).addEventListener("input", calcularTotal);
});

// 🔹 GUARDAR RESERVA
function guardarReserva() {

  const reserva = {
    cliente: cliente.value,
    hotel: hotel.value,
    tour: tour.value,
    adultos: adultos.value,
    ninos: ninos.value,
    fecha: fecha.value,
    descuento: descuento.value || 0,
    total: total.value || 0
  };

  db.collection("reservas").add(reserva).then(() => {

    generarVoucher(reserva);
    limpiarFormulario();
    mostrarReservas();
    cargarDashboard();
  });
}

// 🔹 LIMPIAR
function limpiarFormulario() {
  cliente.value = "";
  hotel.value = "";
  adultos.value = "";
  ninos.value = "";
  descuento.value = "";
  total.value = "";
}

function generarVoucher(r) {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const img = new Image();
  img.src = "logo.png";

  img.onload = function () {

    // 🔹 HEADER GRIS
    doc.setFillColor(230, 230, 230);
    doc.rect(0, 0, 210, 35, "F");

    // 🔹 LOGO
    doc.addImage(img, "PNG", 10, 5, 30, 25);

    // 🔹 TITULO
    doc.setFontSize(18);
    doc.text("Cupón de Excursión", 50, 15);

    doc.setFontSize(12);
    doc.text("Tour Voucher", 50, 23);

    // 🔹 INFO SUPERIOR
    doc.setFontSize(10);

    doc.text("AGENCIA: PCG TOURS", 10, 45);
    doc.text("No. TICKET: PCG-" + Date.now().toString().slice(-6), 140, 45);

    doc.line(10, 48, 200, 48);

    // 🔹 NOMBRE TOUR GRANDE
    doc.setFontSize(16);
    doc.text(r.tour.toUpperCase(), 10, 60);

    doc.setFontSize(11);
    doc.text(r.tour, 10, 67);

    // 🔹 CLIENTE INFO
    doc.setFontSize(11);

    doc.text(`NOMBRE: ${r.cliente}`, 10, 80);
    doc.text(`HOTEL: ${r.hotel}`, 10, 88);
    doc.text(`FECHA: ${r.fecha}`, 10, 96);

    doc.text(`PAX: ${r.adultos} ADL / ${r.ninos} CHD`, 140, 88);

    doc.line(10, 105, 200, 105);

    // 🔹 DETALLE
    doc.setFontSize(11);

    doc.text(`Adultos: ${r.adultos}`, 10, 115);
    doc.text(`Niños: ${r.ninos}`, 10, 123);
    doc.text(`Descuento: $${r.descuento}`, 10, 131);

    doc.setFontSize(14);
    doc.text(`TOTAL: $${r.total}`, 10, 145);

    // 🔹 POLÍTICAS (igual estilo OTIUM)
    doc.setFontSize(9);

    doc.text("POLÍTICAS DE CANCELACIÓN Y/O REEMBOLSO", 10, 160);

    doc.text(
`a) Cancelaciones con 48 hrs antes del servicio.
b) Cancelaciones por enfermedad requieren certificado médico.
c) No hay reembolso por no presentarse.
d) No aplica en tours con descuento.
e) El cliente asume responsabilidad total de la compra.`,
      10,
      168
    );

    // 🔹 INGLES
    doc.text("CANCELLATION & REFUND POLICIES", 10, 190);

    doc.text(
`a) 48 hours cancellation required.
b) Medical certificate required for illness.
c) No refund for no-show.
d) No refunds on discounted tours.`,
      10,
      196
    );

    // 🔹 FOOTER
    doc.setFontSize(10);
    doc.text("Punta Cana Going - PCG Tours", 10, 210);

    // 🔹 GUARDAR
    doc.save(`voucher_${r.cliente}.pdf`);
  };
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
          💰 $${r.total}
        </div>
      `;
    });
  });
}

// 🔹 INIT
window.onload = () => {
  mostrarReservas();
  cargarExcursiones();
  cargarDashboard();
};
