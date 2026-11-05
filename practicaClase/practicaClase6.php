<?php
// Calificaciones y datos del estudiante
$estudiante = "Carlos Rodríguez";
$nota1 = 85;
$nota2 = 90;
$nota3 = 75;

// Calcular promedio
$promedio = ($nota1 + $nota2 + $nota3) / 3;

// Determinar el estado académico
if ($promedio >= 70) {
    $estado = "Aprobado!<br>";
} else {
    $estado = "Reprobado :(<br>";
}

echo "<table>";
echo "<tr><th>Evaluacion</th><th>Nota</th></tr>";
echo "<tr><td>Nota 1</td><td>$nota1</td></tr>";
echo "<tr><td>Nota 2</td><td>$nota2</td></tr>";
echo "<tr><td>Nota 3</td><td>$nota3</td></tr>";
echo "</table>";
echo "<p>Promedio: $promedio</p>";
echo "<p>Estado: $estado</p>";
?>
