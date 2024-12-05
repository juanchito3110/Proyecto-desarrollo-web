document.addEventListener('DOMContentLoaded', () => {
    // Efecto hover para los iconos
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
        icon.addEventListener('mouseover', () => {
            icon.style.transform = 'scale(1.1)';
        });
        
        icon.addEventListener('mouseout', () => {
            icon.style.transform = 'scale(1)';
        });
    });

    // Animación del header al hacer scroll
    let lastScroll = 0;
    let headerTimeout;
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScroll = window.pageYOffset;
        
        clearTimeout(headerTimeout);
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        
        headerTimeout = setTimeout(() => {
            header.style.transform = 'translateY(0)';
        }, 1000);
    });

    // Manejo del formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const messageDiv = document.getElementById('message');
        const submitBtn = registerForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const loader = submitBtn.querySelector('.loader');

        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Validar el formulario
            if (!validateForm(this)) {
                return;
            }

            // Deshabilitar el botón y mostrar loader
            submitBtn.disabled = true;
            loader.style.display = 'inline-block';
            btnText.textContent = 'Procesando...';
            
            try {
                const formData = new FormData(this);
                const response = await fetch('register.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                // Mostrar mensaje
                messageDiv.style.display = 'block';
                messageDiv.className = `message ${data.success ? 'success-message' : 'error-message'}`;
                messageDiv.textContent = data.message;
                messageDiv.classList.add('show');

                if (data.success) {
                    // Limpiar formulario
                    registerForm.reset();
                    
                    // Redirigir después de 2 segundos
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                }
                
                // Scroll al mensaje
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
            } catch (error) {
                console.error('Error:', error);
                messageDiv.style.display = 'block';
                messageDiv.className = 'message error-message show';
                messageDiv.textContent = 'Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo.';
            } finally {
                // Restaurar el botón
                submitBtn.disabled = false;
                loader.style.display = 'none';
                btnText.textContent = 'Registrarse';
            }
        });

        // Limpiar mensajes al escribir
        registerForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                messageDiv.style.display = 'none';
                messageDiv.className = 'message';
                
                const errorMessage = this.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            });
        });
    }
});

// Función para mostrar errores en los campos
function showInputError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

// Función para validar el formulario
function validateForm(form) {
    let isValid = true;
    const usuario = form.querySelector('#usuario');
    const password = form.querySelector('#password');

    // Limpiar mensajes de error previos
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    if (!usuario.value.trim()) {
        showInputError(usuario, 'El usuario es requerido');
        isValid = false;
    } else if (usuario.value.length < 3) {
        showInputError(usuario, 'El usuario debe tener al menos 3 caracteres');
        isValid = false;
    }

    if (!password.value) {
        showInputError(password, 'La contraseña es requerida');
        isValid = false;
    } else if (password.value.length < 6) {
        showInputError(password, 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }

    return isValid;
}

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const formData = new FormData(this);
            const messageDiv = document.getElementById('message');
            
            try {
                const response = await fetch('login.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                messageDiv.style.display = 'block';
                messageDiv.className = `message ${data.success ? 'success-message' : 'error-message'}`;
                messageDiv.textContent = data.message;
                messageDiv.classList.add('show');

                if (data.success) {
                    // Redirect to the specified page (in this case, index.html)
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    }
                }
                
            } catch (error) {
                console.error('Login Error:', error);
            }
        });
    }
    function login(user, pass) {
        fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario: user, password: pass }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect; // Redirige a la página de inicio
            } else {
                alert(data.message); // Muestra el error específico
            }
        })
        .catch(error => console.error('Error:', error));
    }
    // Función para buscar productos
    function searchProducts() {
        console.log("La función de búsqueda fue ejecutada."); // Mensaje de prueba
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = ''; // Limpiar resultados anteriores
    
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchInput)
        );
    
        if (filteredProducts.length > 0) {
            filteredProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product-item';
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price} MXN</p>
                `;
                resultsContainer.appendChild(productDiv);
            });
        } else {
            resultsContainer.innerHTML = '<p>No se encontraron productos.</p>';
        }
    }
    
