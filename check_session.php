<?php
session_start();
header('Content-Type: application/json');

// Verifica si el usuario está logueado
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode(['logged_in' => true, 'username' => $_SESSION['username']]);
} else {
    echo json_encode(['logged_in' => false]);
}
?>
