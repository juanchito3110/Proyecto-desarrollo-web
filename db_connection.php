<?php
$servername = "localhost"; // Cambia si tu servidor no está en localhost
$username = "root";        // Tu usuario de MySQL
$password = "";            // Tu contraseña de MySQL
$dbname = "Condefitted";   // El nombre de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
