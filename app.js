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

// 🔹 HEADER
doc.setFillColor(230, 230, 230);
doc.rect(0, 0, 210, 30, “F”);

doc.setFontSize(18);
doc.setTextColor(40);
doc.text(“Cupón de Excursión”, 20, 15);

doc.setFontSize(12);
doc.text(“Tour Voucher”, 20, 22);

doc.setFontSize(14);
doc.text(“PCG TOURS”, 150, 18);

// 🔹 INFO GENERAL
doc.setFontSize(11);
doc.text(“AGENCIA: PCG TOURS”, 20, 40);
doc.text(“NO. TICKET: “ + generarTicket(), 140, 40);

doc.line(20, 45, 190, 45);

// 🔹 TITULO TOUR
doc.setFontSize(16);
doc.text(r.tour.toUpperCase(), 20, 60);

doc.setFontSize(12);
doc.text(r.tour, 20, 68);

// 🔹 CLIENTE
doc.setFontSize(11);
doc.text(“NOMBRE / NAME: “ + r.cliente, 20, 85);
doc.text(“HOTEL: “ + r.hotel, 20, 95);

doc.text(“PICK UP: RECEPCIÓN (PENDIENTE)”, 20, 105);

doc.text(“NO. RESERVA: “ + generarReservaID(), 130, 85);
doc.text(“FECHA / DATE: “ + r.fecha, 130, 95);
doc.text(PAXS: ${r.adultos} ADL / ${r.ninos} CHD, 130, 105);

doc.line(20, 115, 190, 115);

// 🔹 POLÍTICAS (MISMAS QUE TU IMAGEN)
doc.setFontSize(9);

doc.text(“POLÍTICAS DE CANCELACIÓN Y/O REEMBOLSO”, 20, 125);

doc.text(
“a) Las cancelaciones son aceptadas con 48 hrs antes del inicio del servicio y para recibir reembolso es necesario presentar el cupón original de la compra.”,
20, 132,
{ maxWidth: 170 }
);

doc.text(
“b) Para cancelaciones por enfermedad, el cliente deberá presentar Certificado Médico expedido por el médico del hotel o clínica privada.”,
20, 140,
{ maxWidth: 170 }
);

doc.text(
“c) No se aceptan cancelaciones el mismo día de la actividad.”,
20, 148,
{ maxWidth: 170 }
);

doc.text(
“d) No habrá reembolsos en caso de no presentarse.”,
20, 156,
{ maxWidth: 170 }
);

doc.text(
“e) No aplican reembolsos en paquetes o tours con descuento.”,
20, 164,
{ maxWidth: 170 }
);

// 🔹 TOTAL
doc.setFontSize(14);
doc.text(TOTAL: $${r.total}, 20, 180);

// 🔹 FOOTER
doc.setFontSize(10);
doc.text(“Gracias por reservar con PCG TOURS”, 20, 200);

// 🔹 EXPORTAR
doc.save(Voucher_${r.cliente}.pdf);
}

/* 🔥 GENERAR ID RESERVA */
function generarReservaID() {
return “PCG-” + Math.random().toString(36).substring(2, 8).toUpperCase();
}

/* 🔥 GENERAR TICKET */
function generarTicket() {
return Math.floor(100000 + Math.random() * 900000);
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
