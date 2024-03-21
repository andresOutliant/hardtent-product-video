// $(window).on("load", function () {
//   // Delay the scroll to ensure all content has loaded
//   setTimeout(function () {
//     $(window).scrollTop(0);
//   }, 10);
// });

gsap.registerPlugin(ScrollTrigger);

// $(window).on("beforeunload", function () {
//     $(window).scrollTop(0);
// });

document.addEventListener("DOMContentLoaded", function () {
  // Find the link by its class
  const link = document.querySelector(".navbar22_link");

  link.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    const targetUrl = this.getAttribute("href"); // Get the href value

    // Make sure the .fade-hero element is ready for animation
    const fadeHeroElement = document.querySelector(".fade-hero");
    fadeHeroElement.style.display = "block";
    fadeHeroElement.style.opacity = 0; // Ensure it starts from 0 opacity

    // Start the fade-in animation
    gsap.to(".fade-hero", {
      duration: 0.32,
      autoAlpha: 1, // GSAP's autoAlpha handles both CSS opacity and visibility
      ease: "quad.in",
      onComplete: function () {
        // Ensure scroll to top happens here if you want it just after animation
        $(window).scrollTop(0);

        // Delay the navigation to the target URL after the animation completes
        setTimeout(function () {
          window.location.href = targetUrl;
        }, 200); // Corrected delay for navigation
      },
    });
  });
});

$(document).ready(function () {
  // Check if screen width indicates a mobile device
  if ($(window).width() < 768) {
    // 768px is a common breakpoint for mobile devices
    // Trigger click on 'toggle-open'

    setTimeout(function () {
      $(".toggle-open").click();
    }, 50);

    // Optionally, set a delay before triggering 'toggle-close'
    setTimeout(function () {
      $(".toggle-close").click();
    }, 100); // Delay of 1000 milliseconds (1 second)
  } else {
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const videoElementId = $(window).width() >= 768 ? "myVideo" : "mobile-hero";
  const video = document.getElementById(videoElementId);

  function setupVideoInteractions() {
    const toggleClose = document.querySelector(".toggle-close");
    const toggleOpen = document.querySelector(".toggle-open");
    const toggleCircles = document.querySelectorAll(".toggle-circle");
    let reverseIntervalId = null;

    function reverseVideo() {
      const isMobile = window.innerWidth < 768;
      const reverseInterval = isMobile ? 50 : 42;
      const stepBack = isMobile ? 0.02 : 0.04;

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
  }

setTimeout(() => {
  if (video.readyState >= 2) {
    setupVideoInteractions();
  } else {
    video.addEventListener("loadedmetadata", setupVideoInteractions, {
      once: true,
    });
  }
}, 1000); // 1000 milliseconds = 1 second


  // Remove the element that is not being used
  const elementToRemoveId =
    videoElementId === "myVideo" ? "mobile-hero" : "myVideo";
  $("#" + elementToRemoveId).remove();
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {

  //   window.scrollTo(0, 0);
  let videoElement = document.getElementById("scroll-video");
  videoElement.muted = true;

  let screenWidth = window.innerWidth;
  let isMobile = screenWidth < 768;

  let windowHeight = window.innerHeight;
  let scrollAreaHeight, endValue;

  if (isMobile) {
    scrollAreaHeight = windowHeight + 2000;
    endValue = "+=3000px";
  } else {
    scrollAreaHeight = windowHeight * 2 + 2760;
    endValue = "+=3560px";
  }

  let videoContainer = document.querySelector(".scroll-video-container");
  videoContainer.style.height = `${scrollAreaHeight}px`;

  let videoTimeline = gsap.timeline();

  videoTimeline
    .to(videoElement, { currentTime: 4.2, duration: 4.2, ease: "none" }) // Normal playback to 4.2s
    .to(videoElement, { currentTime: 4.3, duration: 1.7, ease: "none" }) // First slow down: Slight progress over a long duration
    // Assuming a brief period of normal playback to transition from the first slow down to the second
    .to(videoElement, { currentTime: 5.5, duration: 1.2, ease: "none" }) // Transition to 5.5s for the next slow down
    .to(videoElement, { currentTime: 5.501, duration: 1, ease: "none" }) // Second slow down: Similar slight progress over a long duration
    .to(videoElement, {
      currentTime: videoElement.duration,
      duration: videoElement.duration - 5.6,
      ease: "none",
    }); // Continue to the end

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

  let multiplier = 1.034; // Assuming this remains constant

  let textFadeInPositions = [
    { start: 100 * multiplier, end: 1240 },
    { start: 1950 * multiplier, end: 2650 * multiplier },
    { start: 2970 * multiplier, end: 3465 * multiplier },
    { start: 3590 * multiplier, end: 4600 * multiplier },
  ];

  let textElements = gsap.utils.toArray(".text-element");
  textElements.forEach((element, index) => {
    let { start, end } = textFadeInPositions[index];
    gsap
      .timeline({
        scrollTrigger: {
          trigger: element,
          start: () => `${element.offsetTop + start}px bottom`,
          end: () => `${element.offsetTop + end}px bottom`,
          scrub: true,
        },
      })
      .fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.27 })
      .to(element, { opacity: 0, duration: 0.27 }, "+=0.5"); // Hide again outside the specified range
  });

  let circleJumpPositions = [100, 1950, 2970, 3590];
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

  ScrollTrigger.refresh();
      }, 1500);
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

document.addEventListener("DOMContentLoaded", function () {
  // Set the first navigation button as active initially
  const firstNavigationButton = document.querySelector(
    '.swiper-button[data-slide="0"]'
  );
  if (firstNavigationButton) {
    firstNavigationButton.classList.add("active");
  }
});

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
  //   document.addEventListener("DOMContentLoaded", function () {
  //     let e = document.getElementById("myVideo"),
  //       t = document.querySelector(".toggle-close"),
  //       i = document.querySelector(".toggle-open"),
  //       a = document.querySelectorAll(".toggle-circle"),
  //       s = null;
  //     function o() {
  //       1 !== e.playbackRate && (e.playbackRate = 1),
  //         (s = setInterval(function () {
  //           e.currentTime <= 0
  //             ? (clearInterval(s), e.pause(), (e.currentTime = 0))
  //             : (e.currentTime -= 0.05);
  //         }, 30));
  //     }
  //     i.addEventListener("click", function () {
  //       s && clearInterval(s),
  //         e.play(),
  //         i.classList.add("active"),
  //         t.classList.remove("active"),
  //         a[0].classList.remove("active"),
  //         a[1].classList.add("active");
  //     }),
  //       a[1].addEventListener("click", function () {
  //         this.classList.contains("active") ||
  //           (s && clearInterval(s),
  //           e.play(),
  //           i.classList.add("active"),
  //           t.classList.remove("active"),
  //           a[0].classList.remove("active"),
  //           this.classList.add("active"));
  //       }),
  //       t.addEventListener("click", function () {
  //         s && clearInterval(s),
  //           o(),
  //           t.classList.add("active"),
  //           i.classList.remove("active"),
  //           a[0].classList.add("active"),
  //           a[1].classList.remove("active");
  //       }),
  //       a[0].addEventListener("click", function () {
  //         this.classList.contains("active") ||
  //           (s && clearInterval(s),
  //           o(),
  //           t.classList.add("active"),
  //           i.classList.remove("active"),
  //           this.classList.add("active"),
  //           a[1].classList.remove("active"));
  //       });
  //   });
  // var swiperTimeline = new Swiper(".swipermodels", {
  //   slidesPerView: "auto",
  //   spaceBetween: 30,
  //   loop: !0,
  //   navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  //   scrollbar: { el: ".swiper-scrollbar", draggable: !0 },
  //   on: {
  //     slideChange: function () {
  //       let e = this.realIndex;
  //       document.querySelectorAll(".swiper-button").forEach(function (t, i) {
  //         i === e ? t.classList.add("active") : t.classList.remove("active");
  //       });
  //     },
  //   },
  // });
  document.querySelectorAll(".swiper-button").forEach(function (e, t) {
    e.addEventListener("click", function () {
      swiperTimeline.slideToLoop(t);
    });
  }),
  document.addEventListener("DOMContentLoaded", function () {
    // Set the first navigation button as active initially
    const firstNavigationButton = document.querySelector(
      '.swiper-button[data-slide="0"]'
    );
    if (firstNavigationButton) {
      firstNavigationButton.classList.add("active");
    }
  });

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
// var swiperTimeline = new Swiper(".adventure-slider", {
//   slidesPerView: "auto",
//   spaceBetween: 30,
//   loop: !0,
//   pagination: { el: ".swiper-pagination", clickable: !0 },
// });

$(document).ready(function () {
  var swiperTimeline = new Swiper(".adventure-slider", {
    slidesPerView: "auto",
    spaceBetween: 30,
    loop: true, // Enable looping
    pagination: {
      el: ".swiper-pagination", // Specify the pagination element
      clickable: true, // Make the dots clickable
    },
  });

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
});



