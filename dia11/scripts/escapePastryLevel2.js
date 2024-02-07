// coger las imagenes, tanto buenas como malas:
let imagenesHeroes = document.querySelectorAll('.imagenesBuenas');
let divImagesBuenas = document.querySelector('#divImagesBuenas');
let divImagenesEnemigos = document.querySelector('#imagenesMalas');
let tiramisu = document.querySelector('#tiramisu');
let huevon = document.querySelector('#huevon');
let cuchilloBueno = document.querySelector('#cuchilloBueno');
let fuegoBueno = document.querySelector('#fuegoBueno');
let tirita = document.querySelector('#tirita');
let numeroTiritas = document.querySelector('#numeroTiritas');
let golpesRecibidosHTML = document.querySelector('#golpesRecibidos');
let panelGameOver = document.querySelector('#imagenGameOver');
// cuando sale un enemigo con el rango de tiempo más alto
// informamos al jugador para que aproveche en pegarle
let comboNecesario = document.querySelector('#comboNecesario');
let botoniniciarJuego = document.querySelector('#iniciarJuego');
// per quan perden una partida:
let botonReintentar = document.querySelector('#reintentar');
// nodeList con todas las imagenes de enemigos del html
let imagenesEnemigos = document.querySelectorAll('.imagenesMalas');
let datosFinales = document.querySelector('#datosFinales');
let puntuacionFinalHTML = document.querySelector('#puntuacionHTML');
let botonGuardar = document.querySelector('#guardarPartida');
// convertimos en array, porque la obtencion original de .imagenesMalas
// es un nodeList, y no nos permitiría splice para ir sacando de la lista
// a los enemigos derrotados:
let arrayEnemigos = Array.from(imagenesEnemigos);
let numeroRandom;
let juegoPerdido = false;

// variables para juego, para eventos, contar golpes del heroe al enemigo
let clicksNecesarios;
let golpesAlEnemigo = 0;
let clickTiramisu = 0;
let clickHuevon = 0;
let clickcuchilloBueno = 0;
let clickFuegoBueno = 0;
// variable perque no surti dos vegades el mateix enemic, tot seguit
let ultimoIndiceMostrado = -1;
// contador para tiritas, si solicitan se les resta puntuacion
let numTiritas = 3;
// para contabilizar golpoes recibidos:
let golpesRecibidos = 0;

// para cronometro
let tiempo = new Date();
// establecemos en un minuto:
tiempo.setHours(0,1,0,0);
let cronometroHTML = document.querySelector('#cronometro');
// establecemos el contenido del html del cronometro:
cronometroHTML.innerHTML = '00:01:00';
// emmagatzemem valors a les variables que emprarem per fer compte enrere
let minutos = tiempo.getMinutes();
let segundos = tiempo.getSeconds();
let tiempoFinal;
// AGAFEM ELS JUGADORS AMB LA FUNCIÓ QUE ENS PASA L'ALTRE SCRIPT
let jugadorConectado = cargarJugadores();
// para sobreescribir la partida si un jugador que ya tiene una guardada le da de nuevo a nueva partida:
let guardaJuego = false;
// per la puntuació final que guardarem:
let puntuacionFinal = 0;
// per guardar les partides
let arrayPartidas = [];


function infoJugadorActual() {

    jugadorConectado.forEach((jugador) => {

        if (parseInt(jugador.conectado) === 1 && guardaJuego === true) {

            idUsuario = jugador.id;
            nomJugador = jugador.nomJugador;
            arrayPartidas = jugador.partidaGuardada;

            // Creem nou registre de la partida que es vol guardar
            let nuevoGuardado = {
                juego: 'Escape Cocina',
                pantalla: 2,
                puntuacion: puntuacionFinal,
                idJuego: 2,
                nivel2Superado: true
            };

            //si la partida ja existeix actualitzem les seves dades,
            // per si el jugador vol millorar la puntuació
            let partidaEncontrada = false; 
            for (let i = 0; i < arrayPartidas.length; i++) {
                let partida = arrayPartidas[i];
                if (parseInt(partida.idJuego) === nuevoGuardado.idJuego && parseInt(partida.pantalla) === nuevoGuardado.pantalla) {
                    partidaEncontrada = true;
                    arrayPartidas[i] = Object.assign({}, partida, nuevoGuardado);
                    // sortim del bucle una vegada s'ha sobreescrit la partida
                    break; 
                }
            }

            // Si no se encontró la partida, la añadimos al array
            if (!partidaEncontrada) {
                jugador.partidaGuardada.push(nuevoGuardado);
            }
            localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
            guardaJuego = false;
        }
    });
}

// portar la informació del jugador conectat per poder guardar després:
infoJugadorActual();

function compruebaGolpes(){

    golpesRecibidos++;
    // actualitzem valor al HTML:
    golpesRecibidosHTML.innerHTML = golpesRecibidos;

    if(golpesRecibidos === 3){
           
            // damos visibilidad al cartel de gameOver y paramos el juego:
            gameOver();
    }
}

function eliminarEnemigo(enemigoActualAEliminar) {

    // li passem l'index de l'enemic al array, que anirà canviant conforme eliminem:
    const indexAEliminar = arrayEnemigos.indexOf(enemigoActualAEliminar);

        arrayEnemigos.splice(indexAEliminar, 1);
    
    // Oculta la imagen del enemigo actual
    enemigoActualAEliminar.style.display = 'none';
    enemigoActualAEliminar = ' ';
}

// // EVENTOS CLICK PARA LOS HEROES:
tiramisu.addEventListener('click', function(){

    // si se equivocan en el click se acumularán fallos, lo que suple
    // las pistas:
        if(enemigoActual.getAttribute('id') === 'chefCantando'){

            clickTiramisu++;
            
            if(clickTiramisu === 10){

                    // Sacamos del array al segundo enemigo, el chefCantando
                    // y ocultamos ya el tiramisú, que no es necesario
                    eliminarEnemigo(enemigoActualAEliminar);
                    document.querySelector('#chefCantando').style.display = 'none';
                    document.querySelector('#enemigoEliminado').style.display = 'block';

                    setTimeout(function(){
                        document.querySelector('#enemigoEliminado').style.display = 'none';
                    },2000);
                    tiramisu.style.display = 'none';
            }

        }else{

           compruebaGolpes();
        }      
});

huevon.addEventListener('click', function(){

    // si se equivocan en el click se acumularán fallos, lo que suple
    // las pistas:
        if(enemigoActual.getAttribute('id') === 'chefCabreado2'){

            clickHuevon++;

            if(clickHuevon === 10){
                     // Sacamos del array al ultimo enemigo, el chefCabreado2
                    // arrayEnemigos.pop();
                    eliminarEnemigo(enemigoActualAEliminar);
                    document.querySelector('#chefCabreado2').style.display = 'none';
                    document.querySelector('#enemigoEliminado').style.display = 'block';

                    setTimeout(function(){
                        document.querySelector('#enemigoEliminado').style.display = 'none';
                    },2000);
                    huevon.style.display = 'none';
            }
        }else{

            compruebaGolpes();
        }      
});

cuchilloBueno.addEventListener('click', function(){

    // si se equivocan en el click se acumularán fallos, lo que suple
    // las pistas:
        if(enemigoActual.getAttribute('id') === 'chefCabreado'){

            clickcuchilloBueno++;

            if(clickcuchilloBueno === 10){
                // Sacamos del array al segundo enemigo, el chefCabreado2
               // y ocultamos ya el tiramisú, que no es necesario
               eliminarEnemigo(enemigoActualAEliminar);
            //    arrayEnemigos.splice(1,1);
               document.querySelector('#chefCabreado').style.display = 'none';
               document.querySelector('#enemigoEliminado').style.display = 'block';

               setTimeout(function(){
                   document.querySelector('#enemigoEliminado').style.display = 'none';
               },2000);
               cuchilloBueno.style.display = 'none';
       }

        }else{

            compruebaGolpes();
        }  
});

fuegoBueno.addEventListener('click', function(){
    
    if(enemigoActual.getAttribute('id') === 'fuegoMalo'){

        clickFuegoBueno++;

        if(clickFuegoBueno === 10){

           eliminarEnemigo(enemigoActualAEliminar);
           document.querySelector('#fuegoMalo').style.display = 'none';
           document.querySelector('#enemigoEliminado').style.display = 'block';

           setTimeout(function(){
               document.querySelector('#enemigoEliminado').style.display = 'none';
           },2000);
           fuegoBueno.style.display = 'none';
   }
 
    }else{

        compruebaGolpes();

    }  
});

tirita.addEventListener('click', function(){

    // restamos tiritas, golpesrecibidos i actualitzem els valors al html:
    numTiritas--;

    if(golpesRecibidos >= 1){

        golpesRecibidos--;
        golpesRecibidosHTML.innerHTML = golpesRecibidos;
    }

        if(numTiritas === 0){

            tirita.style.display = 'none';
        }
            numeroTiritas.innerHTML = numTiritas;
});

guardarPartida.addEventListener('click', function(){

        guardaJuego = true;
        infoJugadorActual();
});


function mostrarEnemigoAleatorio() {

    // ocultar totes les imatges dels enemics menys el que surt triat:
    arrayEnemigos.forEach(enemigo => {
        enemigo.style.display = 'none';
    });

    // loopeamos mientras se repita el nuevo numero genereado, para que no salga dos veces el mismo enemigo de seguido
    do {
            numeroRandom = Math.floor(Math.random() * arrayEnemigos.length);

    } while (numeroRandom === ultimoIndiceMostrado && arrayEnemigos.length > 1);

    // quan arribem a 1 de length pasarem al jugador al següent nivell:
    if(arrayEnemigos.length === 1){
        pasarSiguienteNivel();
    }

    ultimoIndiceMostrado = numeroRandom;

    // Actualizamos el último índice mostrado
    ultimoIndiceMostrado = numeroRandom;

    //mostra enemic
    arrayEnemigos[numeroRandom].style.display = 'block';

    // Guardar el enemigo actual para usarlo si es necesario
    enemigoActual = arrayEnemigos[numeroRandom];  

    enemigoActualAEliminar = enemigoActual;
}

//funció per cridar temps aleatori que vagi surtint cada enemic
function llamarFuncionPeriodica() {

    // ocultamos boton de start y de momento el del combo
    // hasta que sea necesario:
    iniciarJuego.style.display = 'none';
    comboNecesario.style.display = 'none';

    let max = 3;
    let min = 1;

    // llamada a funcion que va sacando random los enemigos:
    mostrarEnemigoAleatorio();
    
    tiempoAleatorio = Math.floor(Math.random() * (min, max)+1);
    
    if(tiempoAleatorio === 3){

        // damos indicativo de que durará más para que golpeen
        comboNecesario.style.display = 'block';
    }

    // mentre el length de l'array d'enemics sigui més gran que un continuem
    // cridant a la funció:
    if(arrayEnemigos.length > 1 && juegoPerdido === false){
            // cridades a la funció després de passat el temps aleatori
            setTimeout(llamarFuncionPeriodica, tiempoAleatorio * 600);
    }
}

function cuentaAtras() {
     
    if (minutos > 0 || segundos > 0) {

        if (minutos > 0 && segundos === 0) {
            minutos -= 1;
            segundos = 59;
        } else if(minutos === 0 && segundos > 0){

            segundos -= 1;
        }
        // condicionals per mostrar format correcte la info per l'html
        let minutosStr = minutos < 10 ? '0' + minutos : minutos;
        let segundosStr = segundos < 10 ? '0' + segundos : segundos;

        cronometroHTML.innerHTML = '00:' + minutosStr + ':' + segundosStr;

        // condició perque es pari quan només ens quedi un enemic:
        if(arrayEnemigos.length > 1 && juegoPerdido === false){
        // Llamada recursiva después de 1000 ms (1 segundo)
        setTimeout(cuentaAtras, 1000);
        }

        // si el temps arriba a cero llavors perden:
    } else {
         // damos visibilidad al cartel de gameOver
         gameOver();
    }
    
    // obtenir temps final:
    tiempoFinal = cronometroHTML.innerHTML;
}

function gameOver(){

    juegoPerdido = true;

     // ocultem totes les imatges bones, dolentes, etc
     divImagenesEnemigos.style.display = 'none';
     divImagesBuenas.style.display = 'none';
     // damos visibilidad al boton de reintentar la partida:
     botonReintentar.style.display = 'block';
    panelGameOver.style.display = 'block';
}

// al pulsar el boton de start se llama a la función que inicia el juego
iniciarJuego.addEventListener('click', function(){

    llamarFuncionPeriodica();
    cuentaAtras();
});

botonReintentar.addEventListener('click', function(){
        // reiniciem pàgina per tornar a jugar
        location.reload();
});

function pasarSiguienteNivel(){

    // ocultem tots els divs i mostrem la info per guardar i pasar al següent nivell:
     // ocultem totes les imatges bones, dolentes, etc
     divImagenesEnemigos.style.display = 'none';
     divImagesBuenas.style.display = 'none';
     comboNecesario.style.display = 'none';
     datosFinales.style.display = 'block';
    
    //  visibilitzem els botons de guardar la partida i pasar al següent nivell
     document.querySelector('#guardarPartida').style.display = 'block';
     document.querySelector('#pasarSiguienteNivel').style.display = 'block';
    //  per si no estàn conformes amb la puntuació i ho volen tornar a intentar:
     botonReintentar.style.display = 'block';    

    //  llamamos a la funcion que calcula la puntuacion
    puntuacionFinal = calculoPuntuacion();

    //  es mostra l'actualització de puntuació final perque
    // el jugador decideixi si vol guardar i passar o millorar
    // la seva puntuació jugant una altra partida:
    puntuacionFinalHTML.textContent = puntuacionFinal;
}

//  coger puntuacion final que irá en función del tiempo, las tiritas gastadas y los golpes que tenga
// el jugador al final del juego:
    function calculoPuntuacion(){
        
        // sortirà d'eliminar els tres enemics que ens permet el joc:
        let puntuacionBase = 3 * 100;
        // si hem utilitzat tiritas fem el calcul per restar puntuació
        // sino donem un bonus:
        if(numTiritas === 0){

            puntuacionBase = puntuacionBase - 150;

                
        }else if(numTiritas === 1){

            puntuacionBase = puntuacionBase - 100;

        }else if(numTiritas === 2){

            puntuacionBase = puntuacionBase - 50;
        } else{
            // donem bonificació de 250 punts per no haber utilitzat tirites:
            puntuacionBase = puntuacionBase + 250;
        } 

        // mirem si el jugador en acabar té golpesRecibidos o no:
        if(golpesRecibidos > 0){

            if(golpesRecibidos === 1){
                
                puntuacionBase = puntuacionBase - 25;
            }else if(golpesRecibidos === 2){

                puntuacionBase = puntuacionBase - 50;
            }

        }else{

             // donem bonificació de 250 punts per no tenir daño en finlitzar el joc:
             puntuacionBase = puntuacionBase + 250;
        }

        // per últim mirarem si el jugador ha aconseguit superar el repte
        // sobrantli més de la meitat del temps, perque llavors li donem
        // un alter bonus:
        if(segundos > 30){
            puntuacionBase = puntuacionBase + 100;
        }
        
        return puntuacionBase;
    }




