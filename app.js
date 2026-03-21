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

function generarVoucher(reserva, idReserva) {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  const cliente = reserva.cliente;
  const hotel = reserva.hotel;
  const tour = reserva.tour;
  const fecha = reserva.fecha;
  const adultos = reserva.adultos;
  const ninos = reserva.ninos;

  const html = `
  <div style="font-family: Arial; width: 800px; margin: auto; color:#333;">

    <div style="background:#e5e5e5; padding:20px; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center;">
        <img src="https://i.imgur.com/yourlogo.png" style="width:70px; margin-right:15px;">
        <div>
          <h2 style="margin:0;">Cupón de Excursión</h2>
          <span>Tour Voucher</span>
        </div>
      </div>

      <div style="text-align:right;">
        <b>PCG TOURS</b>
      </div>
    </div>

    <div style="padding:15px;">
      <div style="display:flex; justify-content:space-between;">
        <div>
          <b>AGENCIA:</b> PCG TOURS<br>
          <b>#REFER.:</b> __________
        </div>

        <div>
          <b>No. TICKET:</b> ${idReserva}
        </div>
      </div>
    </div>

    <hr>

    <div style="padding:15px;">
      <h2 style="margin:0;">${tour.toUpperCase()}</h2>
      <span>${tour}</span>
    </div>

    <div style="padding:15px; display:flex; justify-content:space-between;">
      <div>
        <p><b>NOMBRE / NAME:</b> ${cliente}</p>
        <p><b>HOTEL:</b> ${hotel}</p>
        <p><b>PICK UP:</b> RECEPCIÓN NIVEL 1 (07:40)</p>
      </div>

      <div>
        <p><b>No. RESERVA:</b> ${idReserva}</p>
        <p><b>FECHA / DATE:</b> ${fecha}</p>
        <p><b>PAXS:</b> ${adultos}ADL ${ninos ? `/${ninos}CHD` : ""}</p>
      </div>
    </div>

    <hr>

    <div style="padding:15px; font-size:12px; line-height:1.4;">

          <b>POLÍTICAS DE CANCELACIÓN Y/O REEMBOLSO</b><br><br>

    a) Las cancelaciones son aceptadas con 48 hrs. antes del inicio del servicio y para recibir reembolso es necesario presentar el cupón original de la compra, de otra manera no habrá ningún tipo de reembolso.<br>
    b) Para cancelaciones por enfermedad, el cliente deberá presentar un Certificado Médico expedido por el médico del hotel o por una clínica privada, a fin de confirmar la incapacidad de realizar el tour (No aceptamos recetas de farmacias).<br>
    c) No se aceptan cancelaciones ni cambios el mismo día de la actividad.<br>
    d) No habrá reembolsos en caso de no presentarse a tiempo el día/horario establecidos de la actividad o servicio.<br>
    e) No aplican reembolsos en Paquetes o cuando exista un descuento en el Tour.<br>
    f) No se aceptan cancelaciones para reservas especiales.<br><br>

    El cliente asume la responsabilidad de la compra y no habrá ningún tipo de reembolso.<br><br>

    <b>CANCELLATION & REFUND POLICIES</b><br><br>

    a) Cancellation/refund proceeds with more than 48 hrs. prior to tour commencement and it is mandatory to return the original coupon of the purchase, otherwise, these are non-refundable.<br>
    b) Cancellation due to illness, client(s) must present a Medical Certificate from the hotel’s doctor or a private hospital, in order to confirm that you were unable to take your tour (Prescriptions from pharmacies are NOT accepted).<br>
    c) Cancellations or changes are not accepted the same day of the activity.<br>
    d) NO refunds will be issued if you don’t show up on the established Date/Time of your tour or service.<br>
    e) No refunds will apply on Packages or Tours with any kind of discount.<br>
    f) There’s no right to cancel special reservations.<br><br>
      <b>PCG TOURS</b>

    </div>

  </div>
  `;

  doc.html(html, {
    callback: function (doc) {
      doc.save(`Voucher_${cliente}.pdf`);
    },
    x: 10,
    y: 10
  });
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
