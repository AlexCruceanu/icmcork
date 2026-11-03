// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  const isOpen = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen);
  toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Past Events carousel: moves to the next photo every 5 seconds
const carousel = document.querySelector(".carousel");

if (carousel) {
  const track = carousel.querySelector(".carousel-track");
  const slides = carousel.querySelectorAll(".slide");
  let current = 0;

  function goTo(index) {
    current = index % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, i) => slide.setAttribute("aria-hidden", i !== current));
    // start loading the next photo now so it's ready when it slides in
    slides[(current + 1) % slides.length].querySelector("img").loading = "eager";
  }

  goTo(0);
  setInterval(() => goTo(current + 1), 5000);
}

// Past Events gallery: click a photo to see it bigger, then move left or right
const lightbox = document.querySelector(".lightbox");

if (lightbox) {
  const photos = [...document.querySelectorAll(".gallery-item")];
  const image = lightbox.querySelector(".lightbox-image");
  let current = 0;
  let swipeStart = null;

  function show(index) {
    current = (index + photos.length) % photos.length;
    image.src = photos[current].href;
    image.alt = photos[current].querySelector("img").alt;
    // start loading the next photo now so it's ready when it's clicked
    new Image().src = photos[(current + 1) % photos.length].href;
  }

  photos.forEach((photo, i) => {
    photo.addEventListener("click", (event) => {
      event.preventDefault();
      show(i);
      lightbox.showModal();
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));

  // click the dark area around the photo to close
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  // swipe left or right on phones
  lightbox.addEventListener("touchstart", (event) => {
    swipeStart = event.touches[0].clientX;
  });

  lightbox.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - swipeStart;
    if (distance > 50) show(current - 1);
    if (distance < -50) show(current + 1);
  });
}
