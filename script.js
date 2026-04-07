document.addEventListener('DOMContentLoaded', () => {
    
    // 1. REVELADO DE ELEMENTOS AL HACER SCROLL (Efecto Framer)
    const observerOptions = {
        threshold: 0.1, // Se activa cuando el 10% del elemento es visible
        rootMargin: "0px 0px -50px 0px" // Margen inferior para anticipar la carga
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: dejar de observar una vez que ya es visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleccionamos todos los elementos que queremos animar
    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => observer.observe(el));

    // 2. SCROLL SUAVE PARA EL BOTÓN 'GET IN TOUCH'
    document.querySelector('.btn-get-touch').addEventListener('click', function(e) {
        // Verifica si el enlace es interno (empieza con #)
        if(this.hash !== "") {
            e.preventDefault();
            const targetId = this.hash;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Esperar a que las fuentes se carguen antes de mostrar el contenido
document.fonts.ready.then(function() {
  document.documentElement.classList.add('fonts-loaded');
});

// FX. PARALLAX SCROLL PARA LA HERO

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const bgImage = document.querySelector('.hero-bg-image img');
    
    // Solo actuamos si estamos en la hero (para optimizar)
    if (scrolled < window.innerHeight) {
        // Calculamos el movimiento (0.3 es la velocidad, ajústalo si quieres)
        const yPos = -(scrolled * 0.3);
        
        // Aplicamos el movimiento Y conservando el zoom inicial (scale)
        bgImage.style.transform = `translateY(${yPos}px) scale(1.1)`;
    }
});



// // FX. CRAZY SLIDER
// const track = document.querySelector('.slider-track');

// // 1. Clonamos el contenido 5 veces para que sea una tira larguísima
// const originalHTML = track.innerHTML;
// track.innerHTML = originalHTML + originalHTML;

// let targetSpeed = 0.3; 
// let currentSpeed = 0.3;

// // 2. Iniciamos el scroll en la mitad del track para que NUNCA haya huecos al cargar
// let scrollPos = -(track.scrollWidth / 3); 

// function animate() {
//     currentSpeed += (targetSpeed - currentSpeed) * 0.05;
//     scrollPos -= currentSpeed;

//     // 3. Reset invisible
//     const setWidth = track.scrollWidth / 3;
//     if (Math.abs(scrollPos) >= setWidth * 2) {
//         scrollPos = -setWidth;
//     }

//     // Aplicamos la rotación + el movimiento
//     // Usamos variables para no perder la inclinación 3D
//     const rotateY = track.matches(':hover') ? -6 : -8; 
//     const rotateX = track.matches(':hover') ? 1 : 2;  
    
//     track.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateX(${scrollPos}px)`;
    
//     requestAnimationFrame(animate);
// }

// // 4. Interacción suave
// track.addEventListener('mouseenter', () => { targetSpeed = 0.1; }); // Velocidad casi parado al poner el mouse
// track.addEventListener('mouseleave', () => { targetSpeed = 0.9; }); // Velocidad normal lenta (antes era 1.5)

// animate();


/* --- EFECTO LOGOS SCROLL --- */

document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class when scrolling DOWN into view
                entry.target.classList.add('is-visible');
            } else {
                // Remove the class when scrolling UP/OUT of view (for the zoom out)
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Target the specific container
    const target = document.querySelector('.logos-container');
    if (target) {
        observer.observe(target);
    }
});


/* --- EFECTO ABOUT PARALLAX --- */
window.addEventListener('scroll', function() {
    const section = document.querySelector('.about');
    const image = document.querySelector('.about-background img');
    
    if (section && image) {
        // Obtenemos la posición de la sección respecto a la pantalla
        const rect = section.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        // Solo se ejecuta si la sección es visible
        if (rect.top <= viewHeight && rect.bottom >= 0) {
            // El valor 0.15 controla la intensidad del efecto
            const speed = 0.15; 
            const yPos = -(rect.top * speed);
            
            // Aplicamos el movimiento
            image.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
    }
});

/* --- FORMULARIO CONTACTO SEND --- */
    const form = document.getElementById('folio-form');
    const status = document.getElementById('form-status');
    const btn = document.getElementById('submit-btn');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que cambie de página
        
        btn.innerText = "SENDING...";
        btn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        fetch("https://formsubmit.co/ajax/hi@sebastianfranconieri.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // Éxito: Ocultamos el formulario y mostramos tu "THANK YOU!"
            form.reset();
            btn.style.display = "none"; 
            status.style.display = "block";
        })
        .catch(error => {
            alert("Error! Please try again.");
            btn.disabled = false;
            btn.innerText = "Send Message";
        });
    });

/* --- VIDEO RESPONSIVE HERO LANDING --- */
    function loadCorrectVideo() {
        const video = document.getElementById('hero-video');
        if (!video) return;

        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute('webkit-playsinline', 'true');

        const isMobile = window.innerWidth < 768; 
        const videoSrc = isMobile ? 'videos/web-banner2-reel.mp4' : 'videos/web-banner2.mp4';

        // Si la fuente ya es la correcta, no hacemos nada
        if (video.src.includes(videoSrc)) return;

        // Forzamos la carga del video
        video.src = videoSrc;
        video.load();

        // Promesa para forzar el Play en móviles
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("Video iniciado correctamente");
            }).catch(error => {
                console.log("Esperando interacción o carga completa...");
                // Reintento automático si falla por carga lenta
                setTimeout(() => { video.play(); }, 1000);
            });
        }
    }

    // Ejecutar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', loadCorrectVideo);

    // Si el usuario gira el teléfono
    window.addEventListener('orientationchange', () => {
        setTimeout(loadCorrectVideo, 300);
    });

    // Evento de seguridad por si Safari se queda "congelado"
    window.addEventListener('load', loadCorrectVideo);

    
    // SMOOTH SCROLL CON LENIS
    // Inicializamos Lenis
    const lenis = new Lenis({
        duration: 1.2,   // Qué tan "largo" es el deslizamiento
        lerp: 0.1,       // Suavizado (0.1 es el estándar equilibrado)
        smoothWheel: true,
        wheelMultiplier: 1, 
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        touchMultiplier: 2, // Mejora la sensación en iPhone/iPad
    });

    // Función técnica para que el navegador actualice el scroll en cada frame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // OPCIONAL: Si usas botones con anclas (ej: #contact), 
    // esto hace que el salto también sea suave:
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            lenis.scrollTo(this.getAttribute('href'));
        });
    });

    document.querySelector('.nav-logo').addEventListener('click', (e) => {
    e.preventDefault(); // Evita el salto brusco
    lenis.scrollTo(0, { lerp: 0.05 }); // Sube al píxel 0 con suavidad extrema
});