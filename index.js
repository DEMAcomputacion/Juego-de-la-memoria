//Audios
const volteaCarta = new Audio("./sonidos/voltearCarta.mp3");
const consiguePar = new Audio("./sonidos/par.mp3");
const win = new Audio("./sonidos/win.mp3");
//Elementos DOM
const $tablero = document.querySelector("#espacioTableroJuego");
const $reloj = document.querySelector("#reloj");
const $intentos = document.querySelector("#intentos");
const $paresConseguidos = document.querySelector("#paresConseguidos");
const $muestraEstadisticas = document.querySelector("#estadisticas");
const $recargar = document.querySelector("#recargar");
const $pantallaSecundaria = document.querySelector("#secundario");
const $pantallaPrincipal = document.querySelector("#principal");
//Src imagenes
const imagenesSrc = {
    1: "./tarjetas/t1.png",
    2: "./tarjetas/t2.png",
    3: "./tarjetas/t3.png",
    4: "./tarjetas/t4.png",
    5: "./tarjetas/t5.png",
    6: "./tarjetas/t6.png",
    7: "./tarjetas/t7.png",
    8: "./tarjetas/t8.png",
    9: "./tarjetas/t9.png",
    10: "./tarjetas/reves.png",
}
//ID Casilleros
const $tarjetas = {
    1: "#imgGrid1",
    2: "#imgGrid2",
    3: "#imgGrid3",
    4: "#imgGrid4",
    5: "#imgGrid5",
    6: "#imgGrid6",
    7: "#imgGrid7",
    8: "#imgGrid8",
    9: "#imgGrid9",
    10: "#imgGrid10",
    11: "#imgGrid11",
    12: "#imgGrid12",
    13: "#imgGrid13",
    14: "#imgGrid14",
    15: "#imgGrid15",
    16: "#imgGrid16",
    17: "#imgGrid17",
    18: "#imgGrid18",
}

let ordenCartas = {};
let tarjetasTurno = [];
let idElemento;
let paresConseguidos = 0;
let retardoId;
let permitidoJugar = true;
let temporizador;
let minutos = 0;
let segundos = 0;
let intentos = 0;


window.onload = function(){
    $pantallaSecundaria.classList.add = "oculto";
    $pantallaPrincipal.classList.remove = "oculto";
}

asignaTarjetas();

function asignaTarjetas(){
    for(let i = 1; i <= 9; i++){
        let exitos = 0;
            while(exitos < 2){
            let nro = nroRandom();
                if(!ordenCartas[nro]){
                    ordenCartas[nro] = i;
                    exitos ++;
                }
            }
    }    
}

function nroRandom() {
    return Math.floor(Math.random() * 18) + 1;
}

$tablero.onclick = eligeTarjeta;

function eligeTarjeta(e){
    if (e == null) {
        idElemento = e.srcElement.id;
        } else {
        idElemento = e.target.id;
    }
    if(/^tj/.test(idElemento) && permitidoJugar === true){
        if(!temporizador){
            iniciarCronometro();
        }
        validaTurno(idElemento);

    }
}

function validaTurno(idElemento){
    
    const nroElemento = idElemento.slice(2);
    const $idTarjeta = document.querySelector(`#${idElemento}`);
    const $tarjeta = ordenCartas[nroElemento];
    $idTarjeta.style.pointerEvents = "none";
    window.setTimeout(cambiaSrc, 300, $idTarjeta, $tarjeta);
    $idTarjeta.className = "img-fluid rotacion";
    volteaCarta.play();
    tarjetasTurno.push(nroElemento);
    
    if(tarjetasTurno.length === 2){
        permitidoJugar = false;
        retardoId = window.setTimeout(retardarClick, 1600);
        validaPar();
    }
}

function cambiaSrc($idTarjeta, $tarjeta){
    $idTarjeta.src = imagenesSrc[$tarjeta];
}

function retardarClick(){
    $tablero.style.pointerEvents = "auto";
    window.clearTimeout(retardoId);
    permitidoJugar = true;
}

function validaPar(){

    const primeraElegida = tarjetasTurno[0];
    const segundaElegida = tarjetasTurno[1];
    if(ordenCartas[primeraElegida] === ordenCartas[segundaElegida]){
        paresConseguidos ++;
        consiguePar.play();
        tarjetasTurno = [];
        permitidoJugar = true;
        actualizaPanel();
        if(paresConseguidos === 9){
            win.play();
            detieneTemporizador();
            window.setTimeout(muestraEstadisticas, 1500);
        }
    }else{
        window.setTimeout(cambiaSrcReves, 300, primeraElegida, segundaElegida);
        tarjetasTurno = [];
        intentos ++;
        actualizaPanel();
    }
}

function cambiaSrcReves(primeraElegida, segundaElegida){
    const $idTarjeta1 = document.querySelector(`#tj${primeraElegida}`);
    const $idTarjeta2 = document.querySelector(`#tj${segundaElegida}`);
    window.setTimeout(retornaVolteo, 1100, $idTarjeta1, $idTarjeta2);
    $idTarjeta1.classList.add("rotacion");
    $idTarjeta2.classList.add("rotacion");
}

function retornaVolteo($idTarjeta1, $idTarjeta2){
    $idTarjeta1.src = "./tarjetas/reves.png";
    $idTarjeta2.src = "./tarjetas/reves.png";
    $idTarjeta1.style.pointerEvents = "auto";
    $idTarjeta2.style.pointerEvents = "auto";
    $idTarjeta1.className = "img-fluid";
    $idTarjeta2.className = "img-fluid";
}

function iniciarCronometro(){
    $reloj.textContent = "0:00";
    temporizador = window.setInterval(cronometro, 1000);
}

function cronometro(){
    
    if(minutos < 10) { minutos = '0' + minutos; };
    if(segundos < 10) { segundos = '0' + segundos; };
  
    $reloj.innerHTML = +minutos+':'+segundos;

    segundos ++;
    if (segundos >= 60) {
        segundos = 0;
        minutos ++;
    }
}

function actualizaPanel(){
    $intentos.innerText = intentos + paresConseguidos;
    $paresConseguidos.innerText = paresConseguidos;
}

function detieneTemporizador(){
    clearInterval(temporizador);
}

function muestraEstadisticas(){

    $pantallaSecundaria.classList.remove("oculto");
    $pantallaPrincipal.classList.add("oculto");
    if(Number(minutos) === 0){$muestraEstadisticas.innerText = `Te tomo ${segundos} segundos y ${intentos} movimientos lograrlo`}
    if(Number(minutos) === 1){$muestraEstadisticas.innerText = `Te tomo un minuto y ${segundos} segundos terminarlo y necesitaste ${intentos} movimientos para lograrlo`}
    if(Number(minutos) > 1){$muestraEstadisticas.innerText = `Te tomo ${Number(minutos)} minutos y ${segundos} segundos terminarlo y necesitaste ${intentos} movimientos para lograrlo`}
}

$recargar.onclick = recargar;

function recargar(){
    window.location.reload();
}