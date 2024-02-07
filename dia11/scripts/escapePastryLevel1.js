// seleccionem panell per mostrar les lletres:
let panelLetras = document.querySelector('.panelLetras');
let divAnagramaJugador = document.querySelector('#anagramaCompletado');
// Div on es mostrarà la informació de com funciona el joc:
let mostrarDivInfo = document.querySelector('#explicacionJuego');
// div entero que contenia las letras
let divPrincipal = document.querySelector('#trainingPastry');
let divJugador = document.querySelector('#anagramaCompletado');
let divInformaGanador = document.querySelector('#informaGanador');  
let divPista = document.querySelector('#divPista');
let cronometro = document.querySelector('.cronometro');

// PER SELECCIONAR ELS BOTONS DE LES PARTIDES
let nuevaPartida = document.querySelector('#nuevaPartida');
let cargarPartida = document.querySelector('#cargarPartida');
let divBotonesPartida = document.querySelector('.botonesPartida');
let divGuardarPartida = document.querySelector('#divGuardarPartida');
let quitarLetra = document.querySelector('#quitarLetra');
let guardarPartida = document.querySelector('#guardarPartida');
let pasarLevel2 = document.querySelector('#pasarLevel2');
let pistaBoton = document.querySelector('#pista');

// ARRAYS PARA EL JUEGO:
let arrayAnagramasIngredientes = ['frases','atan','armo','temato','lacena', 'aceleres','calcinaba','ungato','rodaloc','titforupe','fonsi','sotirot'];
let solucionesIngredientes = ['fresas','nata','mora','tomate','canela','cereales','calabacin','nougat','colador','petitfour','sifon','risotto'];

let arrayPistas = ['fruto rojo','aspecto similar a leche','fruto rojo','popular para ensaladas','en rama, en polvo...','alimento básico de la dieta a lo largo de la humanidad',
                    'blanco por dentro, verde por fuera,muy versátil en preparación','postre francés idéntico a nuestra elaboración más típicamente navideña',
                    'que no te la cuelen con esta prueba...','pequeño agasajo del restaurant que acompaña normalmente a los cafés','utiliza cargas de gas','paella a la italiana(que no se ofendan puristas...)'];

// variables per emmagatzemar valors del localStorage que ens venen:
let idUsuario;
let nomJugador;
let arrayPartidas = [];
let juegoNoSuperado = false;
// per anar comprovant la paraula:
let adivinada = false;
// anirem ficant les lletres que escolleixin:
let letrasEscogidas = [];
// para salvar obstaculo de impresion en la ultima letra de la funcin comprobarAnagrama:
let ultimaLetra = 0;
// contador per mesurar paraules encertades i trencar el bucle:
let palabrasAcertadas = 0;
let index = 0;
// per crear dades a l'objecte nou de la partida que es guarda:
let nuevoGuardado;
// AGAFEM ELS JUGADORS AMB LA FUNCIÓ QUE ENS PASA L'ALTRE SCRIPT
let jugadorConectado = cargarJugadores();
// booleano para cargar el sitio por donde iba el jugador:
let cargarPartidaGuardada = false;
// para guardar la ultima palabra por la que se ha jugado donde se ha ganado y seguir a partir den ahi cuando se carga la partida
let ultimaPalabraJugada = "";
// para activar el guardado de la nueva partida
let nuevoRegistroPartida = false;
//para registrar la puntacion, y darle el visto bueno que pase
// a siguiente nivel del escape:
let puntuacionFinal = 0;
// contador para ver cuantas pistas se utilizan:
let pistasUtilizadas = 0;
// para sobreescribir la partida si un jugador que ya tiene una guardada le da de nuevo a nueva partida:
let sobreescribirPartida = false;
let numAComparar;
// per controlar si superen el nivell:
let nivel1Superado = false;

// funcio del temps, cronometre i variables necessaries
let tiempo = new Date();
tiempo.setHours('0,10,0,0');
let cronoHTML = document.querySelector('#cronometro');
cronoHTML.innerHTML = '00:10:00';

// Aquí se podría cargar ya la partida en caso de haberla,
// para no hacer una doble lectura, y si decide empezar una nueva partida
// simplemente sobreescbirla:
function infoJugadorActual() {

    jugadorConectado.forEach((jugador) => {

        if (parseInt(jugador.conectado) === 1) {

            idUsuario = jugador.id;
            nomJugador = jugador.nomJugador;
            arrayPartidas = jugador.partidaGuardada;

            divBotonesPartida.style.display = 'block';

            if (nuevoRegistroPartida === true || sobreescribirPartida === true) {

                // si s'han emprat pistes en penalitzem l'ús restant a la puntuació:
                // només entrarà si la puntuació es positiva, per no anar a puntuacions negatives:
                if(pistasUtilizadas > 0 && palabrasAcertadas > 0){

                    palabrasAcertadas = palabrasAcertadas - pistasUtilizadas;
                    pistasUtilizadas = 0;
                }
                // per posar el booleà de que han superat el nivell a true
                // i donar accés al següent
                if(palabrasAcertadas === solucionesIngredientes.length){

                    nivel1Superado = true;
                }else{
                    nivel1Superado = false;
                }

                // Creem nou registre de la partida que es vol guardar
                nuevoGuardado = {
                    juego: 'Escape Cocina',
                    pantalla: 1,
                    puntuacion: palabrasAcertadas,
                    idJuego: 1,
                    ultimaPalabraPuntuada: ultimaPalabraJugada,
                    nivel1Superado : nivel1Superado
                };

            //    cerquem si hi ha un registre 0, que es com ens ve per primer cop l'objecte del Registro, quan encara
            // el jugador no ha iniciat cap Escape
                const registroCero = arrayPartidas.find(partida => parseInt(partida.idJuego) === 0);

                // per evitar que s'hem quedés el primer objecte del array sense dades, quan ens venia buit del registre
                if (registroCero) {

                    if(pistasUtilizadas > 0 && palabrasAcertadas > 0){

                        palabrasAcertadas = palabrasAcertadas - pistasUtilizadas;
                        pistasUtilizadas = 0;
                    }

                    // Si existe, sobrescribe directamente
                    registroCero.juego = 'Escape Cocina';
                    registroCero.pantalla = 1;
                    registroCero.puntuacion = palabrasAcertadas;
                    registroCero.idJuego = 1;
                    registroCero.ultimaPalabraPuntuada = ultimaPalabraJugada;
                    registroCero.nivel1Superado = nivel1Superado;

                }else {


                    if(pistasUtilizadas > 0 && palabrasAcertadas > 0){

                        palabrasAcertadas = palabrasAcertadas - pistasUtilizadas;
                        pistasUtilizadas = 0;
                    }

                    // La partida ya existe, actualizamos sus datos
                    arrayPartidas = arrayPartidas.map(partida => {

                        // si trobem una coincidencia al iterar, sobreescribim amb Object.assign l'objecte partida existent amb les dades que li
                        // hem possat a nuevoGuardado, que es la partida que està guardant el jugador:
                        if (parseInt(partida.idJuego) === nuevoGuardado.idJuego && parseInt(partida.pantalla) === nuevoGuardado.pantalla) {
                            return Object.assign({}, partida, nuevoGuardado);
                        }
                        // si no hi ha coincidencias retornem la partida sense canvos
                        return partida;
                    });
                }
                // guardem objecte actualitzat:
                jugador.partidaGuardada = arrayPartidas;
                localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
            }

            sobreescribirPartida = false;
        }
    });
}

infoJugadorActual();

// ********EVENTS*******//
// Event Listeners para accionar carga de la partida o nueva partida:
cargarPartida.addEventListener('click', function(){

    // Loopeamos el array de las `partidas del objeto jugador que tenemos
    arrayPartidas.forEach((partida =>{

        // miramos datos de carga:
        if(partida.juego !== 'Escape Cocina' && parseInt(partida.pantalla) !== 1){

            divGuardarPartida.style.display = 'block';
            cargarPartidaGuardada = false;
            cargarEntrenamiento();

        }else if(partida.juego === 'Escape Cocina' && parseInt(partida.pantalla) === 1){

            divGuardarPartida.style.display = 'block';

            // rescatamos la puntuacion que ya tenemos en el localStorage para actualizar nuestra variable de palabrasAcertadas
            // que será después la puntuación que vuelva a guardarse y la premisa para finalizar el juego:
            palabrasAcertadas = partida.puntuacion;

             // sacamos valor de la ultima palabra guardada para saber por donde continuar:
             ultimaPalabraJugada = partida.ultimaPalabraPuntuada;

                    // ver el indice que ocupa la palabra:
                // el index vendrá a partir del indice del array de las soluciones, para poder continuar donde lo dejamos:
                if (arrayAnagramasIngredientes.includes(ultimaPalabraJugada)) {
                    // Establecer el índice como la posición de la última palabra jugada
                    index = arrayAnagramasIngredientes.indexOf(ultimaPalabraJugada);
                }
            cargarPartidaGuardada = true;
            cargarEntrenamiento();
        }
    }));

});

// Empezar nueva partida:
nuevaPartida.addEventListener('click',function(){

    arrayPartidas = arrayPartidas.map(partida => {

        // si trobem una coincidencia al iterar, sobreescribim amb Object.assign l'objecte partida existent amb les dades que li
        // hem possat a nuevoGuardado, que es la partida que està guardant el jugador:
        if (parseInt(partida.idJuego) !== 0 && parseInt(partida.pantalla) !== 0) {
            
            sobreescribirPartida = true;
        }
    });
        cargarEntrenamiento(idUsuario,nomJugador);
        divGuardarPartida.style.display = 'block';
        nuevaPartida.style.display = 'none';
});

// Para quitar la ultima letra añadida, por si se equivocan:
quitarLetra.addEventListener('click', function(){

        if(letrasEscogidas.length > 0){

            ultimaLetra = 0;

            // eliminamos la última letra del array:
            letrasEscogidas.pop();

            // eliminem tb la darrera lletra que haviem afegit al div:
            const ultimaLetraVisual = divAnagramaJugador.lastChild;

            if (ultimaLetraVisual) {

                divAnagramaJugador.removeChild(ultimaLetraVisual);
            }
    }
});

// Botó per guardar la partid i després poder retomarla:
guardarPartida.addEventListener('click', function(){

        // cridem a la fubnció per llegir les dades que ja teniem de l'objecte jugador i actualizar-ne les de la partida:
        nuevoRegistroPartida = true;
        infoJugadorActual();    
});

// Botó per passar al segón nivell al moment desde el primer quan es guanya:
pasarLevel2.addEventListener('click', function(){

    window.location.href= 'escapePastryLevel2.html';
});

// per demanar pistes pel joc
pistaBoton.addEventListener('click', function(){

    // sumamos el contador de pistas que luego descontaremos cuando vayamos a guardar la partida en el local
    // y tb porque si usan mas de 3 en una ronda pierden esa ronda:
    pistasUtilizadas++;

    // el jugador no podría pasar de nivel, acabamos con el juego:
    if(pistasUtilizadas > 3){

        gameOver();
    }

            // llegim per quina paraula del array va el joc i treiem la pista amb el mateix index:
            let indexPista = index;
            // treiem paraula
            let stringPista = arrayPistas[indexPista];

            // console.log(stringPista);
            // per on sortirà la pista associada a la paraula que juguem:
            divPista.style.display = 'block';
            divPista.innerHTML = stringPista;

            // ocultamos la pista después de 3 segundos:
            setTimeout(function(){

                divPista.style.display = 'none';  
            },3000);
});

function cargarEntrenamiento(idUsuario,nomJugador) {

    // ocultar el div que mostra la info referent al joc una vegada es comença
    // la partida
    mostrarDivInfo.style.display = 'none';
 
    let paraElBucle = false;
    // i tb netejem l'auxiliar que fem servir per agafar l'ultima lletra i pdoer crearla:
    ultimaLetra = 0;

            // mientras no acabemos el array, vamos recorriendo y sacando palabras
    if (!paraElBucle && palabrasAcertadas < solucionesIngredientes.length) {

        arrayAnagramasIngredientes.forEach((palabra, indiceArray) => {

            // equiparem index perque vagin a la par
            if (indiceArray === index) {

                for(let i=0;i<palabra.length;i++){

                    // creem el div que contindrà les letres que generem
                    const letraDiv = document.createElement('div');
                    letraDiv.classList.add('letra');
                    // omplim el div amb les lletres
                    letraDiv.innerHTML = palabra[i];

                    // event per comprovar si es fa click a les lletres
                    letraDiv.addEventListener('click', () => comprobarAnagrama(palabra[i], palabra));
                    // aquí meter contador de un minuto para que 

                    // agreguem el div al div principal que conté les lletres
                    panelLetras.appendChild(letraDiv);
                    // per guardar la darrera parauka per la que es juga, per si volguessin guardar:
                    ultimaPalabraJugada = palabra;
                    console.log("ultima palabra por la que se jugó", ultimaPalabraJugada);
                }
                paraElBucle = true;
            }
        });
    }
// S'HA DE MODIFICAR PERQUE S'HAN AGREGAT PISTES, LLAVORS EL LENGTH NO CORRESPÓN EN AGREGAR PISTES
// LA CONDICIÓ HAURÀ DE SER DIFERENT
    if(palabrasAcertadas === solucionesIngredientes.length){

                //informar a jugador de que ha superado el nivel y que guarde
                // pasar a nivel 2:
                divInformaGanador.style.display = 'flex';
                divInformaGanador.style.display = 'block';
                pasarLevel2.style.display = 'block';
                cargarPartida.style.display = 'none';
                nuevaPartida.style.display = 'none';
                divAnagramaJugador.style.display = 'none';
                divPrincipal.style.display = 'none';
                
            }
}

//imprimir lletres per pantalla, les escollides pel jugador:
function comprobarAnagrama(letra, palabra) {

    // per poder fer les comparacions, perque al ser string i array, l'array sempre tindrà
    // una posició menys
    let numLetras = palabra.length;
    numAComparar = numLetras - 1;

    // mentre que al array d'escollides hi hagi menys lletres que llargaria de paraula:
    if(letrasEscogidas.length < numAComparar){

         //mostrem les lletres per ordre de selecció, creant els elements:
        const letraAnagrama = document.createElement('div');
        letraAnagrama.classList.add('letraSeleccionada');
        // establim contingut de les lletres
        letraAnagrama.textContent = letra; 

        //agreguem el div creat que conté les lletres al principoal
        anagramaCompletado.appendChild(letraAnagrama);

        letrasEscogidas.push(letra);
        console.log('letras escogidas',letrasEscogidas);

        // quan ja tenim l'array complet, comprovem si s'ha encertat la paraula o no:
    }else if(letrasEscogidas.length === numAComparar){

        if(ultimaLetra === 0){
            //mostrem les lletres per ordre de selecció, creant els elements:
        const letraAnagrama = document.createElement('div');
        letraAnagrama.classList.add('letraSeleccionada');
        // establim contingut de les lletres
        letraAnagrama.textContent = letra; 

        //agreguem el div creat que conté les lletres al principoal
        anagramaCompletado.appendChild(letraAnagrama);
            // per ficar yltima lletra, sino no no m'he la pillaba
        letrasEscogidas.push(letra);

        let stringPalabraJugador = letrasEscogidas.join('');

        // mirem si la paraula està dins de l'array de les solucions:
        if(solucionesIngredientes.includes(stringPalabraJugador)){

            setTimeout(function(){

                disparaGanador();
            },700);
        }
        ultimaLetra++;
        
        }    
    }
}


function disparaGanador(){

    // sumem paraules encertades per després la puntuació:
    palabrasAcertadas++;
    // resetejem contador per la propera lletra que ens vingui:
    ultimaLetra = 0;
    // per equiparar contadors a funcio d'entrenament
    index++;
    // netejar el body de la paraula ja encertada i de la paraula que ja havia sortit:
    panelLetras.innerHTML = '';
    divAnagramaJugador.innerHTML = '';
    // netejem l'array on haviem emmagatzemat les lletres escollides anterioment:
    letrasEscogidas = [];
    
    // iniciem el bucle una altra vegada a la funció d'entrenament
    setTimeout(function(){

        cargarEntrenamiento();
    },1000);    
}

// aqui irá la imagen de gameOver, si pierde no se guardará la partida, proque para que?
// y tendría que volver a jugar:
function gameOver(){


}

