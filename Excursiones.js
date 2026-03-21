const excursiones = [

"Buggies",
"Saona",
"Party Boat",
"Santo Domingo",
"Dolphins",
"Safari",
"Island Catalina",
"Domitai",
"Scape Park",
"El Dorado Park",
"Jet Ski" 

];


window.onload = function(){

let select = document.getElementById("excursion");

excursiones.forEach(e =>{

let option = document.createElement("option");
option.text = e;
select.add(option);

});

mostrarSeccion("dashboard");
cargarReservas();
};
