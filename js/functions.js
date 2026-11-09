// =================================
// Funcion del ejercicio 1
// =================================

document.getElementById("btnCalcularEjercicio1")?.addEventListener("click", function () {

    let salarioBruto = Number(document.getElementById("salarioBruto").value);
    let cargasSociales = 0.1083 * salarioBruto;
    let impuestoRenta = 0;

    if (salarioBruto <= 918000) {
        impuestoRenta = 0;
    } else if (salarioBruto <= 1347000) {
        impuestoRenta = 0.1 * (salarioBruto - 918000);
    } else if (salarioBruto <= 2364000) {
        impuestoRenta = 0.15 * (salarioBruto - 1347000);
    } else if (salarioBruto <= 4727000) {
        impuestoRenta = 0.2 * (salarioBruto - 2364000);
    } else {
        impuestoRenta = 0.25 * (salarioBruto - 4727000);
    }

    let salarioNeto = salarioBruto - (cargasSociales + impuestoRenta);

    // Objeto de formato de moneda adaptado para Costa Rica (CRC)
    let formatoMoneda = new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    document.getElementById("cargasSociales").textContent = formatoMoneda.format(cargasSociales);
    document.getElementById("impuestoRenta").textContent = formatoMoneda.format(impuestoRenta);
    document.getElementById("salarioNeto").textContent = formatoMoneda.format(salarioNeto);
}
);


// =================================
// Funcion del ejercicio 2
// =================================
document.getElementById("btnCambiarTexto")?.addEventListener("click", function () {
    document.getElementById("textoCambiante").textContent = "Escribo estas palabras en acero, pues todo lo que no esté grabado en metal es indigno de confianza.";
    document.getElementById("autorCambiante").textContent = "- Kwaan";
});

// ==========================================
// Funcion del ejercicio 3
// ==========================================
document.getElementById("btnVerificarEdad")?.addEventListener("click", function () {
    let edadInput = document.getElementById("edadInput").value;

    if (edadInput.trim() === "" || isNaN(edadInput)) {
        alert("Por favor, ingresa una edad válida.");
        return;
    }

    let edad = Number(edadInput);

    if (edad >= 18) {
        document.getElementById("resultadoEdad").textContent = "Eres mayor de edad.";
    } else {
        document.getElementById("resultadoEdad").textContent = "Eres menor de edad.";
    }
});

// ==========================================
// Funcion del ejercicio 4
// ==========================================
document.getElementById("btnCargarEstudiantes")?.addEventListener("click", function () {
    
    // Arreglo de objetos con la información de los estudiantes
    let estudiantes = [
        { nombre: "Lucía", apellido: "Vargas", nota: 85 },
        { nombre: "Carlos", apellido: "Jiménez", nota: 92 },
        { nombre: "Sofía", apellido: "Mora", nota: 78 },
        { nombre: "Mateo", apellido: "Rojas", nota: 95 },
        { nombre: "Valeria", apellido: "Arias", nota: 88 }
    ];

    let textoEstudiantes = "";
    let sumaNotas = 0;

    // Recorrer el arreglo usando forEach
    estudiantes.forEach(function (estudiante, index) {
        sumaNotas += estudiante.nota;
        textoEstudiantes += `${index + 1}. ${estudiante.nombre} ${estudiante.apellido} - Nota: ${estudiante.nota}\n`;
    });

    let promedio = sumaNotas / estudiantes.length;

    // Inyectar información
    document.getElementById("contenedorEstudiantes").textContent = textoEstudiantes;
    document.getElementById("promedioNotas").textContent = promedio.toFixed(2);
});


// ==========================================
// Practica 3: Sistema de transacciones (PHP)
// Solo se activa en practica3.html (si existe el formulario)
// ==========================================
const formTransaccion = document.getElementById("formTransaccion");

if (formTransaccion) {
    const API = "php/transacciones.php";
    const estado = document.getElementById("estadoEjecucion");
    const lista = document.getElementById("listaTransacciones");
    const cuenta = document.getElementById("estadoCuenta");

    // Envia una accion (registrar, generar, limpiar, listar) a PHP por POST
    async function llamarApi(datos) {
        let texto = "";
        try {
            const resp = await fetch(API, { method: "POST", body: new URLSearchParams(datos) });
            texto = await resp.text();
            return JSON.parse(texto);
        } catch (error) {
            // Si PHP devolvio un error en vez de JSON, se muestra lo que respondio el servidor
            const detalle = texto
                ? "Respuesta inesperada del servidor: " + texto.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 400)
                : "No se pudo conectar con el servidor (" + error.message + ").";
            return { ok: false, mensaje: detalle, transacciones: null };
        }
    }

    function mostrarTransacciones(transacciones) {
        if (transacciones === null) return;
        if (transacciones.length === 0) {
            lista.textContent = "Aún no hay transacciones.";
            return;
        }
        lista.textContent = transacciones
            .map(t => `#${t[0]}  ${t[1]}  -  ${Number(t[2]).toFixed(2)}`)
            .join("\n");
    }

    // Registrar transaccion
    formTransaccion.addEventListener("submit", async function (e) {
        e.preventDefault();
        const r = await llamarApi({
            accion: "registrar",
            descripcion: document.getElementById("descripcion").value,
            monto: document.getElementById("monto").value
        });
        estado.textContent = r.mensaje;
        mostrarTransacciones(r.transacciones);
        if (r.ok) formTransaccion.reset();
    });

    // Generar estado de cuenta
    document.getElementById("btnGenerar").addEventListener("click", async function () {
        const r = await llamarApi({ accion: "generar" });
        estado.textContent = r.mensaje;
        if (r.ok) cuenta.textContent = r.reporte;
    });

    // Limpiar transacciones
    document.getElementById("btnLimpiar").addEventListener("click", async function () {
        const r = await llamarApi({ accion: "limpiar" });
        estado.textContent = r.mensaje;
        mostrarTransacciones(r.transacciones);
        cuenta.textContent = "...";
    });

    // Al cargar la pagina se recuperan las transacciones guardadas en la sesion
    llamarApi({ accion: "listar" }).then(r => mostrarTransacciones(r.transacciones));
}
