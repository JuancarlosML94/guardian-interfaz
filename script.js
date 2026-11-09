// SCRIPT DE PERSONALIZACIÓN DE INTERFAZ

// Capturamos los elementos del DOM que vamos a usar
const contenedorBienvenida = document.getElementById("contenedor-bienvenida");
const formPreferencias = document.getElementById("form-preferencias");
const inputNombre = document.getElementById("nombre-usuario");
const inputColor = document.getElementById("color-fondo");
const selectTema = document.getElementById("selector-tema");
const btnRestablecer = document.getElementById("btn-restablecer");

// Generar el saludo dinámico si hay usuario registrado

function mostrarBienvenida(nombre) {

    // Vaciamos el contenedor por si acaso

    contenedorBienvenida.innerHTML = "";

    // Creamos el H2 y le metemos texto con createTextNode

    const h2 = document.createElement("h2");
    const textoH2 = document.createTextNode(`¡Hola otra vez, ${nombre}!`);
    h2.appendChild(textoH2);

    // Creamos el párrafo explicativo

    const parrafo = document.createElement("p");
    parrafo.textContent = "Hemos recuperado tus preferencias guardadas anteriormente.";

   // Inyectamos todo en el contenedor usando appendChild como pide el enunciado

    contenedorBienvenida.appendChild(h2);
    contenedorBienvenida.appendChild(parrafo);
}

// CAMBIOS EN TIEMPO REAL
// Cambiar el color de fondo al instante de mover el input

inputColor.addEventListener("input", () => {
    document.body.style.backgroundColor = inputColor.value;
});

// Cambiar el tema visual añadiendo o quitando la clase del CSS

selectTema.addEventListener("change", () => {
    if (selectTema.value === "oscuro") {
        document.body.classList.add("tema-oscuro");
    } else {
        document.body.classList.remove("tema-oscuro");
    }
});

// PERSISTENCIA CON COOKIES
// Función auxiliar para guardar cookies (las de 7 días y la de sesión)


function guardarCookie(nombre, valor, dias) {
    let textoCookie = `${nombre}=${encodeURIComponent(valor)}; path=/`;
    
    if (dias) {
        const fecha = new Date();
        fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
        textoCookie += `; expires=${fecha.toUTCString()}`;
    }
    
    document.cookie = textoCookie;
}

// Función auxiliar para leer una cookie por su nombre

function obtenerCookie(nombre) {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
        c = c.trim();
        if (c.startsWith(nombre + '=')) {
            return decodeURIComponent(c.substring(nombre.length + 1));
        }
    }
    return null;
}

// Evento al enviar el formulario (Guardar preferencias)

formPreferencias.addEventListener("submit", (e) => {
    e.preventDefault(); // Evitamos que recargue la página por defecto

    const nombre = inputNombre.value;
    const color = inputColor.value;
    const tema = selectTema.value;

    // Guardamos nombre y color por 7 días, y tema como sesión (sin días)

    guardarCookie("usuario", nombre, 7);
    guardarCookie("colorFondo", color, 7);
    guardarCookie("temaVisual", tema, null);

    // Mostramos el saludo dinámico al guardar

    mostrarBienvenida(nombre);
    
    alert("¡Preferencias guardadas correctamente!");
});

// Al cargar la página, leemos las cookies y restauramos el estado

window.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = obtenerCookie("usuario");
    const colorGuardado = obtenerCookie("colorFondo");
    const temaGuardado = obtenerCookie("temaVisual");

    if (nombreGuardado) {
        inputNombre.value = nombreGuardado;
        mostrarBienvenida(nombreGuardado);
    }

    if (colorGuardado) {
        inputColor.value = colorGuardado;
        document.body.style.backgroundColor = colorGuardado;
    }

    if (temaGuardado) {
        selectTema.value = temaGuardado;
        if (temaGuardado === "oscuro") {
            document.body.classList.add("tema-oscuro");
        } else {
            document.body.classList.remove("tema-oscuro");
        }
    }
});


// EXTRA - RESTABLECER INTERFAZ

btnRestablecer.addEventListener("click", () => {
    // 1. Borramos las cookies poniendo su fecha de expiración en el pasado

    document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "colorFondo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "temaVisual=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 2. Devolvemos la página a su aspecto por defecto de forma inmediata
    document.body.style.backgroundColor = ""; // Borra el color en línea
    document.body.classList.remove("tema-oscuro"); // Quita la clase del tema
    formPreferencias.reset(); // Limpia los inputs del formulario

    // 3. Eliminamos el bloque de bienvenida del DOM utilizando replaceChildren (o remove)
    contenedorBienvenida.replaceChildren();
});