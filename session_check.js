document.addEventListener('DOMContentLoaded', () => {
    const accountIcon = document.querySelector('.account-icon');

    fetch('check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                accountIcon.title = 'Cerrar Sesión';
                accountIcon.href = 'logout.php'; // Redirige al cerrar sesión
                accountIcon.innerHTML = '<span>🔓</span>'; // Cambia el ícono
            } else {
                accountIcon.title = 'Iniciar Sesión';
                accountIcon.href = 'login.html'; // Redirige al iniciar sesión
                accountIcon.innerHTML = '<span>👤</span>'; // Ícono predeterminado
            }
        })
        .catch(error => console.error('Error al verificar la sesión:', error));
});
