$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});

$(document).ready(function () {
  // Check if screen width indicates a mobile device
  if ($(window).width() < 768) {
    // 768px is a common breakpoint for mobile devices
    // Trigger click on 'toggle-open'
    $(".toggle-open").click();

    // Optionally, set a delay before triggering 'toggle-close'
    setTimeout(function () {
      $(".toggle-close").click();
    }, 100); // Delay of 1000 milliseconds (1 second)
  }
});

gsap.registerPlugin(ScrollTrigger);
document.addEventListener("DOMContentLoaded", () => {
  let videoElement = document.getElementById("scroll-video");
  videoElement.muted = true;

  let screenWidth = window.innerWidth;
  let isMobile = screenWidth < 768;

  let windowHeight = window.innerHeight;
  let scrollAreaHeight, endValue;

  if (isMobile) {
    // Adjust these values for mobile
    scrollAreaHeight = windowHeight + 2000; // Example adjustment
    endValue = "+=3000px";
  } else {
    // Desktop values
    scrollAreaHeight = windowHeight + 2760 + windowHeight;
    endValue = "+=3560px";
  }

  let videoContainer = document.querySelector(".scroll-video-container");
  videoContainer.style.height = `${scrollAreaHeight}px`;

  let videoTimeline = gsap
    .timeline()
    .to(videoElement, { currentTime: 6.2, duration: 6.2, ease: "none" })
    .to({}, { duration: 1.3 });
  ScrollTrigger.create({
    trigger: ".scroll-video-container",
    start: "top top",
    end: endValue,
    pin: true,
    pinSpacing: false,
    scrub: true,
    animation: videoTimeline,
  });

  gsap.set(".text-element", { opacity: 0 });

  let multiplier = 1.02; // You can adjust this value as needed

  let textFadeInPositions = [
    { start: 100 * multiplier, end: 1450 },
    { start: 2280 * multiplier, end: 2590 * multiplier },
    { start: 2660 * multiplier, end: 2910 * multiplier },
    { start: 2940 * multiplier, end: 3500 * multiplier },
  ];

  let textElements = gsap.utils.toArray(".text-element");
  textElements.forEach((element, index) => {
    let { start: fadeInStart, end: fadeInEnd } = textFadeInPositions[index];
    let textTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: () => element.offsetTop + fadeInStart + "px bottom",
        end: () => element.offsetTop + fadeInEnd + "px bottom",
        scrub: true,
        markers: false,
      },
    });
    if (index === textElements.length - 1) {
      textTimeline.to(element, { opacity: 1, duration: 0.27 });
    } else {
      textTimeline
        .to(element, { opacity: 1, duration: 0.27 })
        .to(element, { opacity: 0, duration: 0.27 });
    }
  });

  let circleJumpPositions = [100, 2400, 2650, 3000];
  let circleElements = document.querySelectorAll(".scroll-circle");
  circleElements.forEach((circle, index) => {
    circle.addEventListener("click", () => {
      window.scrollTo({
        top: circleJumpPositions[index] - 250,
        behavior: "smooth",
      });
    });
  });

  window.addEventListener("scroll", () => {
    let scrollPosition = window.scrollY + 250;
    circleElements.forEach((circle, index) => {
      if (scrollPosition >= circleJumpPositions[index]) {
        circle.classList.add("active");
      } else {
        circle.classList.remove("active");
      }
    });
  });
});

function fadeElement(element, action) {
  gsap.to(element, { duration: 0.5, autoAlpha: action === "in" ? 1 : 0 });
}

function updateDisplay() {
  const activeSize = document.querySelector(".size-option.active").id;
  const activeState = document.querySelector(
    ".option-two .option-button.active"
  ).id;
  document.querySelectorAll(".bottom-dimension").forEach((element) => {
    fadeElement(element, "out");
    element.classList.remove("active");
  });

  // Determine the element to show based on the active size and state
  let elementToShowId = "";
  if (activeSize === "full-size" && activeState === "rear") {
    elementToShowId = "full-rear";
  } else if (activeSize === "full-size" && activeState === "interior") {
    // Handling for the 'full-interior' case
    elementToShowId = "full-interior";
  } else {
    elementToShowId = `mid-${activeState}`;
  }

  let elementToShow = document.getElementById(elementToShowId);
  if (elementToShow) {
    fadeElement(elementToShow, "in");
    elementToShow.classList.add("active");
  }
}

function syncOptions(activeId) {
  document.querySelectorAll(".option-two .option-button").forEach((button) => {
    if (button.id === activeId) {
      button.classList.add("active");
      button.querySelector(".small-circle").classList.add("active");
    } else {
      button.classList.remove("active");
      button.querySelector(".small-circle").classList.remove("active");
    }
  });
}

document.querySelectorAll(".size-option").forEach((button) => {
  button.addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      document.querySelector(".size-option.active").classList.remove("active");
      this.classList.add("active");
      updateDisplay();
    }
  });
});

document.querySelectorAll(".option-two").forEach((container) => {
  container.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", function () {
      if (!this.classList.contains("active")) {
        syncOptions(this.id);
        updateDisplay();
      }
    });
  });
});

updateDisplay();

document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("myVideo");
  const toggleClose = document.querySelector(".toggle-close");
  const toggleOpen = document.querySelector(".toggle-open");
  const toggleCircles = document.querySelectorAll(".toggle-circle");
  let reverseIntervalId = null;

  function reverseVideo() {
    const reverseInterval = 30;
    const stepBack = 0.05;

    if (video.playbackRate !== 1) {
      video.playbackRate = 1;
    }

    reverseIntervalId = setInterval(function () {
      if (video.currentTime <= 0) {
        clearInterval(reverseIntervalId);
        video.pause();
        video.currentTime = 0;
      } else {
        video.currentTime -= stepBack;
      }
    }, reverseInterval);
  }

  toggleOpen.addEventListener("click", function () {
    if (reverseIntervalId) {
      clearInterval(reverseIntervalId);
    }
    video.play();

    toggleOpen.classList.add("active");
    toggleClose.classList.remove("active");
    toggleCircles[0].classList.remove("active");
    toggleCircles[1].classList.add("active");
  });

  toggleCircles[1].addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      if (reverseIntervalId) {
        clearInterval(reverseIntervalId);
      }
      video.play();

      toggleOpen.classList.add("active");
      toggleClose.classList.remove("active");
      toggleCircles[0].classList.remove("active");
      this.classList.add("active");
    }
  });

  toggleClose.addEventListener("click", function () {
    if (reverseIntervalId) {
      clearInterval(reverseIntervalId);
    }
    reverseVideo();

    toggleClose.classList.add("active");
    toggleOpen.classList.remove("active");
    toggleCircles[0].classList.add("active");
    toggleCircles[1].classList.remove("active");
  });

  toggleCircles[0].addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      if (reverseIntervalId) {
        clearInterval(reverseIntervalId);
      }
      reverseVideo();

      toggleClose.classList.add("active");
      toggleOpen.classList.remove("active");
      this.classList.add("active");
      toggleCircles[1].classList.remove("active");
    }
  });
});

var swiperTimeline = new Swiper(".swipermodels", {
  slidesPerView: "auto",
  spaceBetween: 30,
  loop: true, // Enable looping
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
  // Add the 'active' class to the current navigation button
  on: {
    slideChange: function () {
      // Update active class on the navigation buttons
      let index = this.realIndex; // Use realIndex for loop mode
      document
        .querySelectorAll(".swiper-button")
        .forEach(function (button, idx) {
          if (idx === index) {
            button.classList.add("active");
          } else {
            button.classList.remove("active");
          }
        });
    },
  },
});

// Add click event listeners to navigation buttons
document.querySelectorAll(".swiper-button").forEach(function (button, index) {
  button.addEventListener("click", function () {
    swiperTimeline.slideToLoop(index); // Use slideToLoop for loop mode
  });
});

// Set the first navigation button as active initially
document
  .querySelector('.swiper-button[data-slide="0"]')
  .classList.add("active");

$(document).ready(function () {
  $(".tab-button").click(function () {
    // Remove active class from all buttons and add to the clicked one
    $(".tab-button").removeClass("active");
    $(this).addClass("active");

    // Get the index of the clicked button
    var index = $(this).index();

    // Immediately update the active class for tab-content
    $(".tab-content").removeClass("active");
    $(".tab-content").eq(index).addClass("active");

    // Animate and hide all tab images
    gsap.to(".tab-images", {
      duration: 0.33,
      autoAlpha: 0,
      ease: "power1.out",
      onComplete: function () {
        $(".tab-images").hide();

        // Show and animate the tab image associated with the clicked button
        var activeTabImage = $(".tab-images").eq(index);
        activeTabImage.css("display", "flex"); // Set display to flex for tab-images
        gsap.to(activeTabImage, {
          duration: 0.33,
          autoAlpha: 1,
          ease: "power1.in",
        });
      },
    });
  });
});

var swiperTimeline = new Swiper(".adventure-slider", {
  slidesPerView: "auto",
  spaceBetween: 30,
  loop: true, // Enable looping
  pagination: {
    el: ".swiper-pagination", // Specify the pagination element
    clickable: true, // Make the dots clickable
  },
});

function fadeElement(e, t) {
  gsap.to(e, { duration: 0.5, autoAlpha: "in" === t ? 1 : 0 });
}
function updateDisplay() {
  let e = document.querySelector(".size-option.active").id,
    t = document.querySelector(".option-two .option-button.active").id;
  document.querySelectorAll(".bottom-dimension").forEach((e) => {
    fadeElement(e, "out"), e.classList.remove("active");
  });
  let i = "";
  i =
    "full-size" === e && "rear" === t
      ? "full-rear"
      : "full-size" === e && "interior" === t
      ? "full-interior"
      : `mid-${t}`;
  let a = document.getElementById(i);
  a && (fadeElement(a, "in"), a.classList.add("active"));
}
function syncOptions(e) {
  document.querySelectorAll(".option-two .option-button").forEach((t) => {
    t.id === e
      ? (t.classList.add("active"),
        t.querySelector(".small-circle").classList.add("active"))
      : (t.classList.remove("active"),
        t.querySelector(".small-circle").classList.remove("active"));
  });
}

$(document).ready(function () {
  768 > $(window).width() &&
    ($(".toggle-open").click(),
    setTimeout(function () {
      $(".toggle-close").click();
    }, 100));
}),
  gsap.registerPlugin(ScrollTrigger),
  document.addEventListener("DOMContentLoaded", () => {
    let e = document.getElementById("scroll-video");
    e.muted = !0;
    let t = window.innerWidth < 768,
      i = window.innerHeight,
      a,
      s;
    t
      ? ((a = i + 2e3), (s = "+=3000px"))
      : ((a = i + 2760 + i), (s = "+=3560px"));
    document.querySelector(".scroll-video-container").style.height = `${a}px`;
    let o = gsap
      .timeline()
      .to(e, { currentTime: 6.2, duration: 6.2, ease: "none" })
      .to({}, { duration: 1.3 });
    ScrollTrigger.create({
      trigger: ".scroll-video-container",
      start: "top top",
      end: s,
      pin: !0,
      pinSpacing: !1,
      scrub: !0,
      animation: o,
    }),
      gsap.set(".text-element", { opacity: 0 });
    let l = 1.02,
      c = [
        { start: 100 * l, end: 1450 },
        { start: 2280 * l, end: 2590 * l },
        { start: 2660 * l, end: 2910 * l },
        { start: 2940 * l, end: 3500 * l },
      ],
      n = gsap.utils.toArray(".text-element");
    n.forEach((e, t) => {
      let { start: i, end: a } = c[t],
        s = gsap.timeline({
          scrollTrigger: {
            trigger: e,
            start: () => e.offsetTop + i + "px bottom",
            end: () => e.offsetTop + a + "px bottom",
            scrub: !0,
            markers: !1,
          },
        });
      t === n.length - 1
        ? s.to(e, { opacity: 1, duration: 0.27 })
        : s
            .to(e, { opacity: 1, duration: 0.27 })
            .to(e, { opacity: 0, duration: 0.27 });
    });
    let r = [100, 2400, 2650, 3e3],
      d = document.querySelectorAll(".scroll-circle");
    d.forEach((e, t) => {
      e.addEventListener("click", () => {
        window.scrollTo({ top: r[t] - 250, behavior: "smooth" });
      });
    }),
      window.addEventListener("scroll", () => {
        let e = window.scrollY + 250;
        d.forEach((t, i) => {
          e >= r[i] ? t.classList.add("active") : t.classList.remove("active");
        });
      });
  }),
  document.querySelectorAll(".size-option").forEach((e) => {
    e.addEventListener("click", function () {
      this.classList.contains("active") ||
        (document
          .querySelector(".size-option.active")
          .classList.remove("active"),
        this.classList.add("active"),
        updateDisplay());
    });
  }),
  document.querySelectorAll(".option-two").forEach((e) => {
    e.querySelectorAll(".option-button").forEach((e) => {
      e.addEventListener("click", function () {
        this.classList.contains("active") ||
          (syncOptions(this.id), updateDisplay());
      });
    });
  }),
  updateDisplay(),
  document.addEventListener("DOMContentLoaded", function () {
    let e = document.getElementById("myVideo"),
      t = document.querySelector(".toggle-close"),
      i = document.querySelector(".toggle-open"),
      a = document.querySelectorAll(".toggle-circle"),
      s = null;
    function o() {
      1 !== e.playbackRate && (e.playbackRate = 1),
        (s = setInterval(function () {
          e.currentTime <= 0
            ? (clearInterval(s), e.pause(), (e.currentTime = 0))
            : (e.currentTime -= 0.05);
        }, 30));
    }
    i.addEventListener("click", function () {
      s && clearInterval(s),
        e.play(),
        i.classList.add("active"),
        t.classList.remove("active"),
        a[0].classList.remove("active"),
        a[1].classList.add("active");
    }),
      a[1].addEventListener("click", function () {
        this.classList.contains("active") ||
          (s && clearInterval(s),
          e.play(),
          i.classList.add("active"),
          t.classList.remove("active"),
          a[0].classList.remove("active"),
          this.classList.add("active"));
      }),
      t.addEventListener("click", function () {
        s && clearInterval(s),
          o(),
          t.classList.add("active"),
          i.classList.remove("active"),
          a[0].classList.add("active"),
          a[1].classList.remove("active");
      }),
      a[0].addEventListener("click", function () {
        this.classList.contains("active") ||
          (s && clearInterval(s),
          o(),
          t.classList.add("active"),
          i.classList.remove("active"),
          this.classList.add("active"),
          a[1].classList.remove("active"));
      });
  });
var swiperTimeline = new Swiper(".swipermodels", {
  slidesPerView: "auto",
  spaceBetween: 30,
  loop: !0,
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  scrollbar: { el: ".swiper-scrollbar", draggable: !0 },
  on: {
    slideChange: function () {
      let e = this.realIndex;
      document.querySelectorAll(".swiper-button").forEach(function (t, i) {
        i === e ? t.classList.add("active") : t.classList.remove("active");
      });
    },
  },
});
document.querySelectorAll(".swiper-button").forEach(function (e, t) {
  e.addEventListener("click", function () {
    swiperTimeline.slideToLoop(t);
  });
}),
  document
    .querySelector('.swiper-button[data-slide="0"]')
    .classList.add("active"),
  $(document).ready(function () {
    $(".tab-button").click(function () {
      $(".tab-button").removeClass("active"), $(this).addClass("active");
      var e = $(this).index();
      $(".tab-content").removeClass("active"),
        $(".tab-content").eq(e).addClass("active"),
        gsap.to(".tab-images", {
          duration: 0.33,
          autoAlpha: 0,
          ease: "power1.out",
          onComplete: function () {
            $(".tab-images").hide();
            var t = $(".tab-images").eq(e);
            t.css("display", "flex"),
              gsap.to(t, { duration: 0.33, autoAlpha: 1, ease: "power1.in" });
          },
        });
    });
  });
var swiperTimeline = new Swiper(".adventure-slider", {
  slidesPerView: "auto",
  spaceBetween: 30,
  loop: !0,
  pagination: { el: ".swiper-pagination", clickable: !0 },
});
// const swiper = new Swiper(".swiper.ecoflow", {
//   autoplay: { delay: 1500 },
//   centeredSlides: !0,
//   slidesPerView: 2,
//   spaceBetween: 0,
//   loop: !0,
//   speed: 600,
// });

const swiper = new Swiper(".swiper.ecoflow", {
  autoplay: {
    delay: 1500,
  },
  centeredSlides: true, // Center slides
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  speed: 600,
  // Define breakpoints
  breakpoints: {
    // when window width is <= 568px
    568: {
      slidesPerView: 2,
    },
  },
});
