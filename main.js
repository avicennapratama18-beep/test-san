document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Dynamic Navbar blur on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- VIDEO SOUND CONTROL ---
    const video = document.getElementById("mainVideo");
    const soundBtn = document.getElementById("soundToggle");
    
    if (soundBtn && video) {
        // Coba autoplay video dengan suara (Terkadang berhasil jika pengguna pernah berinteraksi dengan website sebelumnya)
        video.muted = false;
        soundBtn.innerHTML = "<span class='icon'>🔊</span> Sound: ON";
        
        let playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
               // Apabila browser memblokir (fitur keamanan standar Chrome/Firefox), matikan suara agar video tetap bisa putar
               video.muted = true;
               video.play(); 
               soundBtn.innerHTML = "<span class='icon'>🔇</span> Sound: OFF";
               
               // Nyalakan suara otomatis seketika layar disentuh / diklik pertama kali
               document.body.addEventListener('click', function unlockSound() {
                   video.muted = false;
                   soundBtn.innerHTML = "<span class='icon'>🔊</span> Sound: ON";
                   document.body.removeEventListener('click', unlockSound);
               });
            });
        }

        soundBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Mencegah klik tombol ini terhitung sebagai klik body yg double trigger
            if (video.muted) {
                video.muted = false;
                soundBtn.innerHTML = "<span class='icon'>🔊</span> Sound: ON";
            } else {
                video.muted = true;
                soundBtn.innerHTML = "<span class='icon'>🔇</span> Sound: OFF";
            }
        });
    }

    // --- HERO STAGGERED REVEAL ("Perlahan Muncul Satu per Satu") ---
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // Navbar Logo and items drop in
    heroTimeline.fromTo(".stagger-nav .logo, .stagger-nav .nav-links li", 
        { y: -30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.15 }
    );

    // Hero Main Text - Very slow slide up reveal, large stagger gap per line 
    // agar terlihat muncul satu persatu secara dramatis.
    heroTimeline.to(".hero-text-anim", 
        { y: "0%", duration: 2.5, stagger: 0.4 }, 
        "-=1.0"
    );

    // Fade in ui tools (Sound btn, Scroll indicator)
    heroTimeline.to(".staggered-ui", 
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2 },
        "-=1.5"
    );


    // --- SCROLL REVEALS FOR CARDS ---
    const sections = document.querySelectorAll('.full-screen-img');
    
    // Parallax on background 
    sections.forEach(section => {
        gsap.to(section, {
            backgroundPosition: `50% 100%`,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card) => {
        
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 80%", 
                toggleActions: "play reverse play reverse"
            }
        });

        tl.to(card, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" });

        // Teks dalam kartu muncul lebih pelan juga
        let texts = card.querySelectorAll(".scroll-anim");
        tl.to(texts, { y: "0%", duration: 1.5, stagger: 0.25, ease: "power4.out" }, "-=0.6");
        
        let separator = card.querySelector(".separator");
        if(separator) tl.to(separator, { width: "80px", duration: 0.8, ease: "power2.out" }, "-=1.0");
    });

    // --- FINAL FOOTER SECTION ---
    gsap.to(".final-anim", {
        y: "0%",
        duration: 2.0,
        stagger: 0.4, 
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".footer-cinematic",
            start: "top 75%",
            toggleActions: "play reverse play reverse"
        }
    });
});
