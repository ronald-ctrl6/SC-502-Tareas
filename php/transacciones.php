<?php
session_start();

// Variables globales
$transacciones = $_SESSION['transacciones'] ?? []; // Restaurar transacciones anteriores

// Funcion de registro de transacciones
function registrarTransaccion(string $descripcion, float $monto) : string 
{
    global $transacciones;
    $id = count($transacciones) + 1;
    array_push($transacciones, [$id, $descripcion, $monto]);
    $_SESSION['transacciones'] = $transacciones;

    return "Registrada la transaccion #" . $id;
}

// Funcion de generar estado de cuenta: guarda el .txt y devuelve el texto
function generarEstadoDeCuenta() : string
{
    global $transacciones;
    
    $montoContado = 0;

    // Para dar formato al documento
    $ancho = 93; 
    $igual = str_repeat("=", $ancho) . "\n";
    $guion = str_repeat("-", $ancho) . "\n";
    // ----------------------------

    // Se crea una sola variable con todo el texto para abrir, escribir y cerrar una sola vez el archivo txt
    $reporte  = $igual;
    $reporte .= str_pad("ESTADO DE CUENTA", $ancho, " ", STR_PAD_BOTH) . "\n";
    $reporte .= $igual . "\n";
    $reporte .= "Transacciones realizadas durante el periodo establecido para su tarjeta de credito\n";
    $reporte .= $guion;
    $reporte .= "| " . str_pad("ID", 3) . "| " . str_pad("Descripcion", 70) . "| " . str_pad("Monto", 12, " ", STR_PAD_LEFT) . " |\n";
    $reporte .= $guion;
    

    foreach ($transacciones as $transaccion) {
        $montoContado += $transaccion[2];
        $reporte .= "| " . str_pad($transaccion[0], 3)
                  . "| " . str_pad($transaccion[1], 70)
                  . "| " . str_pad(number_format($transaccion[2], 2), 12, " ", STR_PAD_LEFT) . " |\n";
    }

    $montoConInteres = $montoContado * 1.026;   // interés 2.6%
    $cashback        = $montoContado * 0.001;   // 0.1% sobre el contado
    $totalAPagar     = $montoConInteres - $cashback;

    $reporte .= $guion;
    $reporte .= " - Total de contado:         " . number_format($montoContado, 2) . "\n";
    $reporte .= " - Total con interes (2.6%): " . number_format($montoConInteres, 2) . "\n";
    $reporte .= " - Cashback (0.1%):          " . number_format($cashback, 2) . "\n";
    $reporte .= " - TOTAL A PAGAR:            " . number_format($totalAPagar, 2) . "\n";
    $reporte .= $guion;

    // Guardar en archivo (carpeta reportes/ de la raiz del proyecto)
    $carpeta = dirname(__DIR__) . "/reportes";
    if (!is_dir($carpeta)) {
        mkdir($carpeta, 0777, true);
    }
    if (file_put_contents($carpeta . "/estado_cuenta.txt", $reporte) === false) {
        throw new RuntimeException("No se pudo escribir el archivo");
    }

    // Devolver texto
    return $reporte;
}

// ---------------------------------------------------------------
// Adicional: Peticiones de practica3.html para recibir datos
// ---------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=UTF-8');

    $accion = $_POST['accion'] ?? '';
    $respuesta = ['ok' => false, 'mensaje' => 'Accion no valida'];

    if ($accion === 'registrar') {
        $descripcion = trim($_POST['descripcion'] ?? '');
        $monto = filter_var($_POST['monto'] ?? '', FILTER_VALIDATE_FLOAT);

        if ($descripcion === '' || $monto === false || $monto <= 0) {
            $respuesta = ['ok' => false, 'mensaje' => 'Ingrese una descripcion y un monto mayor a 0.'];
        } else {
            $respuesta = ['ok' => true, 'mensaje' => registrarTransaccion(mb_substr($descripcion, 0, 70), $monto)];
        }

    } elseif ($accion === 'generar') {
        if (count($transacciones) === 0) {
            $respuesta = ['ok' => false, 'mensaje' => 'Registre al menos una transaccion primero.'];
        } else {
            try {
                $reporte = generarEstadoDeCuenta();
                $respuesta = [
                    'ok' => true,
                    'mensaje' => 'Estado de cuenta generado y guardado en reportes/estado_cuenta.txt',
                    'reporte' => $reporte
                ];
            } catch (RuntimeException $e) {
                $respuesta = ['ok' => false, 'mensaje' => $e->getMessage()];
            }
        }

    } elseif ($accion === 'limpiar') {
        $transacciones = [];
        $_SESSION['transacciones'] = [];
        $respuesta = ['ok' => true, 'mensaje' => 'Transacciones eliminadas.'];

    } elseif ($accion === 'listar') {
        $respuesta = ['ok' => true, 'mensaje' => '...'];
    }

    $respuesta['transacciones'] = $transacciones;
    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
    exit;
}
?>