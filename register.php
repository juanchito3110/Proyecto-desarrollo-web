<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "condefitted";

// Crear conexión
$conexion = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conexion->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => "Error de conexión: " . $conexion->connect_error
    ]);
    exit;
}

// Establecer el charset
$conexion->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validar y sanitizar entradas
    $usuario = trim($conexion->real_escape_string($_POST['usuario']));
    $password = $_POST['password'];

    // Validaciones del lado del servidor
    if (strlen($usuario) < 3) {
        echo json_encode([
            'success' => false,
            'message' => "El usuario debe tener al menos 3 caracteres"
        ]);
        exit;
    }

    if (strlen($password) < 6) {
        echo json_encode([
            'success' => false,
            'message' => "La contraseña debe tener al menos 6 caracteres"
        ]);
        exit;
    }

    // Verificar si el usuario ya existe
    $stmt = $conexion->prepare("SELECT id FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => "Este nombre de usuario ya está registrado"
        ]);
        exit;
    }
    $stmt->close();

    // Hash de la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insertar nuevo usuario
    $stmt = $conexion->prepare("INSERT INTO usuarios (usuario, password, fecha_registro) VALUES (?, ?, NOW())");
    $stmt->bind_param("ss", $usuario, $passwordHash);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => "¡Registro exitoso! Ya puedes iniciar sesión."
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => "Error al registrar el usuario: " . $stmt->error
        ]);
    }

    $stmt->close();
}

$conexion->close();
?>