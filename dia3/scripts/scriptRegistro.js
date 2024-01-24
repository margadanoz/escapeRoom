// Usaremos el nombre del jugador como key, de manera que no podrá
// haber dos jugadores en la página con el mismo nombfre:
const clavesLocalStorage = "";

// botons de radio
const botonAdmin = document.querySelector('#admin');
const botonUsuario = document.querySelector('#usuario');
const menorDeEdad = document.querySelector('#menor');
const mayorDeEdad = document.querySelector('#mayor');

// etiwuetas para mostrar errores en form
const smallError = document.querySelector('#errorPwds');
const smallCamposVacios = document.querySelector('#camposVacios');
const smallRolesVacios = document.querySelector('#rolesVacios');
const smallConfirmMayoriEdad = document.querySelector('#confirmMayoriaEdad');
const smallNombreUnico = document.querySelector('#nombreUnico');

// envio de formulario, boton
const botonSubmit = document.querySelector('#submitButton');
// boton logout, lo haremos visible una vez registrado, proque lo logeamos automáticamente:
const botonLogout = document.querySelector('#botonLogout');

// variables per emmagatzemar valors de usuari,rol i confirmar majoria d'edat
let esMayorDeEdad = false;
let contraseñaValida = false;
let datosIncorrectos = false;
let rolJugador;
let nombresExistentes = [];

// array de objetos para almacenar todas las características del usuario
let jugadores = [];

// event per comprovar validessa de camps i guardar posteriorment la ifno
botonSubmit.addEventListener('click',function(e){

    console.log(nombresExistentes);
    // evitar envio de form fins que no es confirmin que tots els camps
    // són correctes:
    e.preventDefault();

    // verificació de que esta triat un rol:
    if(!botonAdmin.checked && !botonUsuario.checked){

        smallRolesVacios.style.display = 'block';
        datosIncorrectos = true;
    }else{

        // comprovem quin tipus d'usuari és
        if(botonAdmin.checked){
                
            rolJugador = 'administrador';

        }else if(botonUsuario.checked){
            
            rolJugador = 'usuario';
        } 
    }
    
    // verificació de que s'ha informat de l'edat
    if(!menorDeEdad.checked && !mayorDeEdad.checked){

            smallConfirmMayoriEdad.style.display = 'block';
            datosIncorrectos = true;
    }else{
        // comprovem si és o no major d'edat
        if(menorDeEdad.checked){

            esMayorDeEdad = false;
        }else if(mayorDeEdad.checked){

            esMayorDeEdad = true;
        }
    }

    // agafem valors del dom, dels inputs per comprovar
    const nomUsuario = document.querySelector('#nomUsuario').value;
    const pwd1 = document.querySelector('#pwd1').value;
    const pwd2 = document.querySelector('#pwd2').value;

    if(nombresExistentes){

        for(let i = 0; i < nombresExistentes.length;i++){

            if(nomUsuario === nombresExistentes[i]){
                console.log("Tambien entra aqui");
                console.log(nomUsuario);
                console.log(nombresExistentes);
                smallNombreUnico.style.display = 'block';
                // location.reload();
                datosIncorrectos = true;

                // per resetejar i que conti el nou nom, sino s'hem quedaba atrapat en el vell
                // i donaba error en considerarlo diferent tot i ser el mateix
                setTimeout(function(){

                    location.reload();
                },1200);
            }
        }
    }

    // comprovem que no es deixi camps buits als inputs:
    if(nomUsuario.length === 0 || pwd1.length === 0 || pwd2.length === 0){

        smallCamposVacios.style.display = 'block';
        datosIncorrectos = true;
    }

    // si las contraseñas no coinciden lanzamos mensaje de error:
    if(pwd1.trim() !== pwd2.trim()){
        
        smallError.style.display = 'block';
        contraseñaValida = false;
        datosIncorrectos = true;

    }else{

        contraseñaValida = true;
    }

    // si todo está correcto procedemos a guardar la información.
    // creamos objeto para guardar en localStorage y recuperar cuando logee:
    if(!datosIncorrectos){

        let nuevoJugador = {

                    nomJugador : nomUsuario,
                    password : pwd1,
                    rol : rolJugador,
                    adulto : esMayorDeEdad,
                    // será 1 para conectado, 0 para desconectado
                    // al registrarse lo conectamos automáticamente:
                    conectado : 1,
                    // será un array de objetos,donde se almacenará nombre dele scape y todo lo relativo para retomar la partida:
                    partidaGuardada : [{
                        juego : ' ',
                        pantalla : 0,
                        puntuacion : 0,
                        // por si quieren jugar varias veces el mismo
                        // para mejorar puntuación o etc, que no se le machaque el anterior
                        idJuego : 0
                    }]
                }

        // Limpiamos valores de los campos:
        document.querySelector('#nomUsuario').value = " ";
        document.querySelector('#pwd1').value = " ";
        document.querySelector('#pwd2').value = " ";
        document.querySelector('#admin').checked = false;
        document.querySelector('#usuario').checked = false;
        document.querySelector('#mayor').checked = false;
        document.querySelector('#menor').checked = false;

        // Llamamos a la función que guarda la info en el localStorage:
        guardarInfoLocalStorage(nuevoJugador);

        console.log(jugadores);

        // Para redigirigir a página de usuario, 
        // donde podrá editar el perfil:
        if(rolJugador === 'administrador'){

            window.location.href = "pagina_admin.html";

            // fem visible ja perque s'ha logejat automàticament amb el registre
            // el botó de logout
            botonLogout.style.display = 'block';
        }else if(rolJugador === 'usuario'){
            
            window.location.href = "pagina_usuario.html";
            botonLogout.style.display = 'block';
        }
    }
});


// para guardar la informacion de los nuevos jugadores registrados
// en el localStorage:
function guardarInfoLocalStorage(nuevoJugador){

        // cargamos info del localStorage:
        const jugadoresGuardados = localStorage.getItem("jugadores");
    
        // Si hay jugadores existentes, los cargamos y agregamos el nuevo jugador
        if(jugadoresGuardados){

            jugadores = JSON.parse(jugadoresGuardados);
        }
        
        // metemos el nuevo jugador registrado:
        jugadores.push(nuevoJugador);
    
        //guardamos la info ya actualizada
        localStorage.setItem("jugadores", JSON.stringify(jugadores));

}

// En cuanto cargue la página, para que no puedasn logear
// con el mismo nombre
window.onload = function() {

    leerInfoLocalStorage();
};


function leerInfoLocalStorage() {

    // Obtener todas las claves almacenadas en el Local Storage,nuestra clave será el nombre
    // solo podrá haber un jugador con el mismo nombre, para luego poder indentificarlos bien al buscarlos:
    const clavesLocalStorage = localStorage.getItem("jugadores");

    console.log(clavesLocalStorage);

    // si tenim info al localStorage fem JSON.parse
    // per agafar els noms:
    if(clavesLocalStorage){

        let jugadoresNombres = JSON.parse(clavesLocalStorage);

        jugadoresNombres.forEach(jugador => {

            nombresExistentes.push(jugador.nomJugador);
        });

    }
    console.log("nombres existentes",nombresExistentes);
}










