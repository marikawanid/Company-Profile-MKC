/* =========================================================
   Mari Kawan Creative: site script
   Sections: 1 Mobile menu, 2 Scroll reveal, 3 Case filter, 4 Count-up numbers, 5 Hero slider
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* 1. Mobile menu ------------------------------------------ */
  var menuBtn = document.getElementById("menu-btn");
  var menu = document.getElementById("mobile-menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      menu.hidden = !menu.hidden;
      menuBtn.setAttribute("aria-expanded", String(!menu.hidden));
    });
  }

  /* 2. Scroll reveal (.rv elements fade up once) ------------- */
  var revealItems = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* 3. Case study filter (case-studies.html) ---------------- */
  var chips = document.querySelectorAll("[data-f]");
  var items = document.querySelectorAll("[data-t]");
  var filterTimer;

  // Shows the matching cards and plays a staggered entrance animation.
  function applyFilter(name) {
    var shown = 0;
    items.forEach(function (item) {
      var show = name === "All" || item.dataset.t === name;
      item.style.display = show ? "" : "none";
      item.classList.remove("is-hiding", "is-entering");
      if (show) {
        item.classList.add("in");
        item.style.setProperty("--i", shown);
        void item.offsetWidth; // restart the entrance animation
        item.classList.add("is-entering");
        shown += 1;
      }
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      if (chip.classList.contains("is-active")) return;
      chips.forEach(function (c) {
        c.classList.toggle("is-active", c === chip);
      });
      clearTimeout(filterTimer);
      if (reduceMotion) {
        applyFilter(chip.dataset.f);
        return;
      }
      // 1) fade current cards out, 2) swap the set, 3) fade new cards in with a stagger
      items.forEach(function (item) {
        if (item.style.display !== "none") item.classList.add("is-hiding");
      });
      filterTimer = setTimeout(function () {
        applyFilter(chip.dataset.f);
      }, 220);
    });
  });

  /* 4. Count-up numbers (<span data-count="6" data-suffix="%">) */
  var counters = document.querySelectorAll("[data-count]");

  function runCount(el) {
    var end = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    var duration = 1600; // ms
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // With reduced motion (or no IntersectionObserver) the final numbers stay as written in the HTML.
  if (!reduceMotion && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    counters.forEach(function (el) {
      el.textContent = "0" + (el.dataset.suffix || "");
      countObserver.observe(el);
    });
  }

  /* 5. Hero slider ------------------------------------------ */
  var slider = document.querySelector("[data-slider]");
  if (!slider) return;

  var DELAY = 6000; // ms per slide. Also set --slide-ms in CSS if you change it.
  var track = slider.querySelector(".slider-track");
  var slides = Array.prototype.slice.call(track.children);
  var dots = Array.prototype.slice.call(
    slider.querySelectorAll("[data-slider-dot]"),
  );
  var toggleBtn = slider.querySelector("[data-slider-toggle]");
  var index = 0;
  var timer = null;
  var playing = !reduceMotion;

  slider.style.setProperty("--slide-ms", DELAY + "ms");
  slider.classList.toggle("is-paused", !playing);

  function goTo(i, smooth) {
    i = (i + slides.length) % slides.length;
    track.scrollTo({
      left: slides[i].offsetLeft,
      behavior: smooth === false ? "auto" : "smooth",
    });
  }

  function schedule() {
    clearTimeout(timer);
    if (playing)
      timer = setTimeout(function () {
        goTo(index + 1);
      }, DELAY);
  }

  // Marks the current slide and restarts the progress bar on its dot.
  function setActive(i) {
    index = i;
    slides.forEach(function (s, n) {
      s.classList.toggle("is-active", n === i);
    });
    dots.forEach(function (d, n) {
      d.classList.remove("is-active");
      d.setAttribute("aria-current", n === i ? "true" : "false");
    });
    void dots[i].offsetWidth; // force reflow so the CSS animation restarts
    dots[i].classList.add("is-active");
  }

  // Detect which slide is in view (works for swipe, arrows and dots).
  var ticking = false;
  track.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== index) {
        setActive(i);
        schedule();
      }
      ticking = false;
    });
  });

  dots.forEach(function (d, n) {
    d.addEventListener("click", function () {
      goTo(n);
    });
  });
  slider
    .querySelector("[data-slider-prev]")
    .addEventListener("click", function () {
      goTo(index - 1);
    });
  slider
    .querySelector("[data-slider-next]")
    .addEventListener("click", function () {
      goTo(index + 1);
    });

  toggleBtn.addEventListener("click", function () {
    playing = !playing;
    slider.classList.toggle("is-paused", !playing);
    toggleBtn.setAttribute(
      "aria-label",
      playing ? "Pause slideshow" : "Play slideshow",
    );
    setActive(index);
    schedule();
  });

  // Pause while the visitor hovers or focuses inside the slider.
  function hold() {
    slider.classList.add("is-held");
    clearTimeout(timer);
  }
  function release() {
    slider.classList.remove("is-held");
    setActive(index);
    schedule();
  }
  slider.addEventListener("mouseenter", hold);
  slider.addEventListener("mouseleave", release);
  slider.addEventListener("focusin", hold);
  slider.addEventListener("focusout", release);

  slider.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  // Keep the current slide aligned when the window is resized.
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      goTo(index, false);
    }, 150);
  });

  setActive(0);
  schedule();
})();
