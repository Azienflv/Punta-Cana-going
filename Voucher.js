function generarVoucher(){

let cliente=document.getElementById("cliente").value;
let hotel=document.getElementById("hotel").value;
let excursion=document.getElementById("excursion").value;
let fecha=document.getElementById("fecha").value;

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(18);
doc.text("PCG TOURS",20,20);

doc.setFontSize(12);

doc.text("Client: "+cliente,20,40);
doc.text("Hotel: "+hotel,20,50);
doc.text("Excursion: "+excursion,20,60);
doc.text("Date: "+fecha,20,70);

doc.text("Thank you for booking with us!",20,90);

doc.save("voucher.pdf");

}

