fbq("track", "ViewContent");

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(".model-card .learn-more")
    .forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        var modelContainer = button.closest(".model-container");
        var modal = modelContainer ? modelContainer.nextElementSibling : null;
        while (modal && !modal.classList.contains("details-modal")) {
          modal = modal.nextElementSibling;
        }
        if (modal) {
          var activeDetailsModalCopy = button.closest(".details-modal-copy");
          var allDetailsModalCopy = document.querySelectorAll(
            ".details-modal-copy"
          );
          Array.from(allDetailsModalCopy).forEach(function (copy) {
            if (copy !== activeDetailsModalCopy) {
              gsap.to(copy, {
                duration: 0.3,
                autoAlpha: 0,
                onComplete: function () {
                  copy.style.display = "none";
                },
              });
            }
          });
          if (modelContainer) {
            gsap.to(modelContainer, {
              duration: 0.3,
              autoAlpha: 0,
              onComplete: function () {
                modelContainer.style.display = "none";
              },
            });
          }
          modal.style.display = "block";
          gsap.to(modal, { duration: 0.3, autoAlpha: 1 });
        } else {
          console.error("Modal not found for the clicked Learn More button.");
        }
      });
    });

  document
    .querySelectorAll(".details-modal .button-circle-x")
    .forEach(function (closeButton) {
      closeButton.addEventListener("click", function (event) {
        var modal = closeButton.closest(".details-modal");

        var checkoutWrapper = modal.closest(".checkout-adds-wrapper");

        if (checkoutWrapper) {
          var camperWrapper = checkoutWrapper.previousElementSibling;

          if (
            camperWrapper &&
            camperWrapper.classList.contains("camper-adds-wrapper")
          ) {
            camperWrapper.style.position = "relative";
          }
        } else {
          console.error("No .checkout-adds-wrapper ancestor found for modal.");
        }

        var allModelContainers = document.querySelectorAll(".model-container");
        var allDetailsModalCopy = document.querySelectorAll(
          ".details-modal-copy"
        );

        if (modal) {
          gsap.to(modal, {
            duration: 0.3,
            autoAlpha: 0,
            onComplete: function () {
              modal.style.display = "none";
              Array.from(allModelContainers).forEach(function (container) {
                container.style.display = "";
                gsap.to(container, { duration: 0.3, autoAlpha: 1 });
              });

              Array.from(allDetailsModalCopy).forEach(function (copy) {
                copy.style.display = "";
                gsap.to(copy, { duration: 0.3, autoAlpha: 1 });
              });
            },
          });
        }
      });
    });
});

$(".starting-price-copy").each(function () {
  // Check if the first child is a div and perform actions
  var $firstChildDiv = $(this).children("div:first");
  if ($firstChildDiv.length > 0) {
    $firstChildDiv.text("$");
  }
});

$(document).ready(function () {
  // Initially hide all categories except 'included'
  $(".interior, .exterior, .electric, .accessories").css("opacity", 0).hide();
  // Show 'included' category elements initially
  $(".included").css("opacity", 1).show();

  $(".checkout-adds-button").on("click", function () {
    // Get the category from the data attribute
    var category = $(this).data("category");

    // Hide and show relevant elements with animation
    $(".interior, .exterior, .electric, .accessories, .included")
      .stop()
      .animate({ opacity: 0 }, 250, "swing", function () {
        $(this).hide();

        $("." + category)
          .stop()
          .css("opacity", 0)
          .show()
          .animate({ opacity: 1 }, 250, "swing");
      });

    // Remove the active class from all buttons and then add it back to buttons with the same data-category
    $(".checkout-adds-button").removeClass("active");
    $(".checkout-adds-button").each(function () {
      if ($(this).data("category") === category) {
        $(this).addClass("active");
      }
    });
  });
});

$(document).ready(function () {
  $(".checkout-adds-wrapper").each(function () {
    var $wrapper = $(this);
    var isSoldOut = $wrapper.find(".sold-out").css("display") === "block";
    var isComingSoon = $wrapper.find(".coming-soon").css("display") === "block";

    if (isSoldOut || isComingSoon) {
      $wrapper.css("pointer-events", "none").addClass("inactive");
      $wrapper.find(".learn-more-btn").hide();
      $wrapper.find(".notify-btn").show();
    } else {
      $wrapper.find(".learn-more-btn").show();
      $wrapper.find(".notify-btn").hide();
    }
  });
});

$(document).ready(function () {
  var activeProducts = [];

  var modelName = "";
  var modelPrice = 0;

  $(".model-card").on("click", function () {
    resetSelectedAddOns();
    // Toggle the active class on the clicked model card
    var isActive = $(this).hasClass("active");
    $(".model-card").removeClass("active");
    if (!isActive) {
      $(this).addClass("active");
    }

    // Update the inactive class on .forward-button.inactive accordingly
    if ($(".model-card.active").length > 0) {
      $(".forward-button.inactive")
        .removeClass("inactive")
        .addClass("send-model");
    } else {
      $(".forward-button").not(".inactive").addClass("inactive");
    }

    // Update model details and form inputs based on the active model card
    var activeModelCard = $(".model-card.active");
    if (activeModelCard.length) {
      // Retrieve model name and price from data attributes
      modelName = activeModelCard.data("model-name");
      modelPrice = parseFloat(activeModelCard.data("model-price"));

      selectModelTypeAddOns(modelName);
      // Log the values for debugging
      console.log("Model Name:", modelName, "Model Price:", modelPrice);

      // Update model selection UI if necessary
      updateModelSelected(modelName, modelPrice);

      // Update the form with model details and active products
      updateCartFormWithProducts(modelName, 0); // commented out so modelPrice doesnt affect total
    } else {
      // Clear inputs if no model is active
      $("#model-name-input").val("");
      $("#model-price-input").val("");
    }

    // Update subtotal or other UI elements if necessary
    // updateSubtotal();
  });

  function updateModelSelected(modelType, modelPrice) {
    // Update the #model-selected div with "HardCamp -" prefix
    $("#model-selected").text("HardCamp - " + modelType);

    // Format modelPrice with commas
    var formattedModelPrice = modelPrice.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    $("#model-selected-price").text(formattedModelPrice);
  }

  function selectModelTypeAddOns(modelType) {
    // Normalize modelType for comparison
    var normalizedModelType = normalizeModelType(modelType);
    var selectedMake1 = localStorage.getItem("selectedMake");
    var selectedModel1 = localStorage.getItem("selectedModel");
    var selectedYear1 = parseInt(localStorage.getItem("selectedYear"), 10);
    console.log("Selected Make:", selectedMake1);
    console.log("Selected Model:", selectedModel1);
    console.log("Selected Year:", selectedYear1);

    console.log("Selected Make:", selectedMake1 === "Ford"); // Should be true
    console.log("Selected Model:", selectedModel1 === "F 150"); // Should be true
    console.log(
      "Selected Year Range:",
      selectedYear1 <= 2024 && selectedYear1 >= 2021
    ); // Should be true for years 2021-2024

    $(".checkout-adds-wrapper").each(function () {
      var includedTypes = $(this).data("included");
      var sku1 = $(this).data("sku");

      if (includedTypes) {
        // Split and normalize included types
        var types = includedTypes
          .split(",")
          .map((type) => type.trim().toLowerCase());
        if (types.includes(normalizedModelType)) {
          $(this).click(); // Trigger click to select and add the add-on
        }
      }

      //Remove the following SKU=33 addon from Ford F150 2021-2024
      if (
        selectedMake1 === "Ford" &&
        selectedModel1 === "F 150" &&
        selectedYear1 <= 2024 &&
        selectedYear1 >= 2021 &&
        sku1 === 33
      ) {
        if (types.includes(normalizedModelType)) {
          $(this).click(); // Trigger click to select and add the add-on
          $(this).hide();
        }
      }
    });
  }

  function normalizeModelType(modelType) {
    // Convert modelType to lowercase for comparison
    modelType = modelType.toLowerCase();

    // Map "Outfitted+" to "plus"
    if (modelType === "outfitted+") {
      return "plus";
    }
    return modelType;
  }

  function resetSelectedAddOns() {
    $(".checkout-adds-wrapper.active").each(function () {
      // Trigger a click event to unselect
      $(this).click();
    });
  }

  $(".checkout-adds-wrapper").on("click", function () {
    $(this).toggleClass("active");

    if ($(this).hasClass("active")) {
      $(this).find(".add-check").fadeIn();
      addOrUpdateProduct($(this));
    } else {
      $(this).find(".add-check").fadeOut();
      removeProductFromArray($(this));
    }

    updateSubtotal();
  });

  function addOrUpdateProduct(productElement) {
    var productSKU = productElement.data("sku");
    var productName = productElement.find(".add-name").text();
    var productPrice = parseFloat(
      productElement
        .find(".add-price")
        .text()
        .replace(/[^0-9.]/g, "")
    );
    productPrice = Number.isFinite(productPrice) ? productPrice : 0;
    var quantity =
      parseInt(productElement.find(".quantity-number").text()) || 1;

    var productImage = productElement.find(".add-image").attr("src");

    var existingProduct = activeProducts.find((p) => p.sku === productSKU);

    if (existingProduct) {
      existingProduct.quantity = quantity;
      existingProduct.totalPrice = productPrice * quantity;
      existingProduct.imageUrl = productImage; // Update the image URL
    } else {
      var newProduct = {
        sku: productSKU,
        name: productName,
        price: productPrice,
        quantity: quantity,
        totalPrice: productPrice * quantity,
        imageUrl: productImage, // Include the image URL
      };
      activeProducts.push(newProduct);
    }

    // console.log("Product added/updated:", newProduct || existingProduct);
    // console.log("Active Products Array after update:", activeProducts);
    updateUI();
  }

  function updateUI() {
    var templateHTML = `
      <div class="add-on-placeholder">
        <div class="margin-right small-custom flex">
          <div class="add-on-name">Placeholder</div>
        </div>
        <div class="quantity-container">
          <div>x</div>
          <div class="quantity-number">1</div>
        </div>
        <div class="counter-box three">
          <div class="counter-button down two">
            <img src="https://assets-global.website-files.com/654922a0e3186570803201c3/658ca44a218eb39c370bf177_-.png" loading="lazy" alt="" class="counter-arrow down two">
          </div>
          <div class="counter-input two">
            <div class="quantity-number">1</div>
          </div>
          <div class="counter-button up two">
            <img src="https://assets-global.website-files.com/654922a0e3186570803201c3/658ca40a8bb1d83760670f38_%2B.png" loading="lazy" alt="" class="counter-arrow down two">
          </div>
        </div>
        <div class="add-on-price">$69.95</div>
      </div>`;

    $(".add-on-placeholder:not(.template)").remove();

    // Iterate over each product in activeProducts and update the UI
    activeProducts.forEach((product) => {
      var newDiv = $(templateHTML).clone();
      //   console.log("Checking product SKU:", product.sku);
      if (product.sku) {
        newDiv.attr("data-sku", product.sku);
      } else {
        // console.error("Product SKU is undefined or empty");
      }
      newDiv.find(".add-on-name").text(product.name); // Update product name
      newDiv.find(".quantity-number").text(product.quantity); // Update quantity
      newDiv.find(".add-on-price").text("$" + product.totalPrice.toFixed(2)); // Update product price

      newDiv.appendTo(".adds").show();
    });

    updateSubtotal();
  }

  $(".counter-button.up, .counter-button.down").click(function (event) {
    event.stopPropagation(); // Prevent event from bubbling up

    var counterBox = $(this).closest(".counter-box");
    var quantityNumber = counterBox.find(".quantity-number");
    var quantity = parseInt(quantityNumber.text());

    if ($(this).hasClass("up")) {
      quantity = quantity < 9999 ? quantity + 1 : quantity; // Increment quantity, limit max
    } else if ($(this).hasClass("down") && quantity > 1) {
      quantity--; // Decrement quantity but not below 1
    }

    quantityNumber.text(quantity); // Update the quantity display

    var productElement = $(this).closest(".checkout-adds-wrapper");
    addOrUpdateProduct(productElement); // Update product with new quantity
  });

  function removeProductFromArray(productElement) {
    var productSKU = productElement.data("sku"); // Get the SKU from data attribute
    // console.log("Removing product with SKU:", productSKU);

    activeProducts = activeProducts.filter(
      (product) => product.sku !== productSKU
    );
    // console.log("Updated activeProducts array after removal:", activeProducts);

    $(".add-on-placeholder")
      .filter(function () {
        return $(this).data("sku") === productSKU;
      })
      .remove();
    // console.log("Removed product element from UI for SKU:", productSKU);

    updateUI();
  }

  function updateSubtotal() {
    var subtotal = 0;

    // Include the original price of the active model card
    var activeModelCard = $(".model-card.active");
    if (activeModelCard.length) {
      var modelPriceText = activeModelCard.find(".model-price").text();
      //   var modelPrice = parseFloat(modelPriceText.replace(/[^0-9.]/g, ""));
      //   subtotal += modelPrice;
      //commented model price out so it doesnt affect total
    }

    // Add prices of active products (using their original prices)
    activeProducts.forEach(function (product) {
      subtotal += product.price * product.quantity;
    });

    // Always include the Downpayment item
    // subtotal += 500; // Fixed price for Downpayment

    // Apply a discount of $3000
    subtotal -= 3000; // Subtract the discount from the subtotal

    var formattedSubtotal = subtotal.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    $("#subtotal").fadeOut(160, function () {
      $(this).text(formattedSubtotal).fadeIn(160);
    });
  }

  let truckInfo = {
    make: "",
    model: "",
    year: "",
  };

  function updateSelections(id, value) {
    truckInfo[id] = value;

    if (id === "make") {
      document.getElementById("make-selected").textContent = value;
    } else if (id === "model") {
      document.getElementById("truck-model-selected").textContent = value;
    } else if (id === "year") {
      document.getElementById("year-selected").textContent = value;
    }

    // console.log(truckInfo);
  }

  document
    .getElementById("make-dropdown")
    .addEventListener("change", function () {
      updateSelections("make", this.value);
    });

  document
    .getElementById("model-dropdown")
    .addEventListener("change", function () {
      updateSelections("model", this.value);
    });

  document
    .getElementById("year-dropdown")
    .addEventListener("change", function () {
      updateSelections("year", this.value);
    });

  // Global variable to control zero pricing
  let zeroPricingEnabled = true; // Set this to false if you want to disable zero pricing

  function updateCartFormWithProducts(modelName, modelPrice) {
    // Clear the fpxy form of previous entries
    $("#foxy-cart-form").find(".dynamic-input").remove();

    // Add the model with zero pricing or actual pricing
    $("#foxy-cart-form").append(
      `<input type='hidden' class='dynamic-input' name='name' value='${modelName}'>`,
      `<input type='hidden' class='dynamic-input' name='price' value='${
        zeroPricingEnabled ? 0 : modelPrice
      }'>`,
      `<input type='hidden' class='dynamic-input' name='quantity' value='1'>`
    );

    // Add each product with zero pricing or actual pricing
    activeProducts.forEach((product, index) => {
      let idx = index + 1;
      $("#foxy-cart-form").append(
        `<input type='hidden' class='dynamic-input' name='${idx}:name' value='${product.name}'>`,
        `<input type='hidden' class='dynamic-input' name='${idx}:price' value='${
          zeroPricingEnabled ? 0 : product.price
        }'>`,
        `<input type='hidden' class='dynamic-input' name='sub_frequency' value='1m'>`,
        `<input type='hidden' class='dynamic-input' name='${idx}:quantity' value='${product.quantity}'>`,
        product.imageUrl
          ? `<input type='hidden' class='dynamic-input' name='${idx}:image' value='${product.imageUrl}'>`
          : ""
      );
    });

    // Always add the Downpayment item with a fixed price of $500
    $("#foxy-cart-form").append(
      `<input type='hidden' class='dynamic-input' name='name' value='Downpayment for HardTent'>`,
      `<input type='hidden' class='dynamic-input' name='price' value='500'>`,
      `<input type='hidden' class='dynamic-input' name='quantity' value='1'>`,
      `<input type='hidden' class='dynamic-input' name='sub_frequency' value='1m'>`
    );
  }

  // toggleZeroPricing()

  // function toggleZeroPricing() {
  //     zeroPricingEnabled = !zeroPricingEnabled;
  //     console.log("Zero Pricing is now", zeroPricingEnabled ? "enabled" : "disabled");
  // }
  // You can call toggleZeroPricing() to switch the zero pricing feature on or off

  $("#submit-to-foxy").on("click", function (event) {
    // event.preventDefault(); // Prevent the default form submission

    updateCartFormWithProducts(modelName, modelPrice);

    $("#foxy-cart-form").submit();
  });

  $(".checkout-cart-btn").on("click", function () {
    $("#submit-to-foxy").trigger("click");
  });

  $("#foxy-cart-form").on("submit", function (event) {
    // console.log("Form data being submitted:", $(this).serializeArray());
    // Keep this line if you want to prevent the actual submission for testing
    // event.preventDefault();
  });

  //   resets the foxy cart on page load
  FC.onLoad = function () {
    FC.client.on("ready.done", function () {
      FC.client.request(
        "https://" + FC.settings.storedomain + "/cart?empty=true"
      );
    });
  };

  function adjustDescriptionText() {
    // Determine word limits for different screen sizes
    let wordLimit = Infinity; // No limit for screens wider than 1390px
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      // Mobile devices
      wordLimit = 8; // Example limit
    } else if (screenWidth <= 1024) {
      // Tablets
      wordLimit = 20; // Example limit
    } else if (screenWidth <= 1390) {
      // Small laptops
      wordLimit = 40; // Example limit
    }

    // Adjust text for each .add-description element
    document.querySelectorAll(".add-description").forEach(function (elem) {
      const originalText =
        elem.getAttribute("data-original-text") || elem.innerText;
      elem.setAttribute("data-original-text", originalText); // Store original text if not already stored
      const words = originalText.split(" ");

      if (words.length > wordLimit) {
        const trimmedText = words.slice(0, wordLimit).join(" ") + "...";
        elem.innerText = trimmedText;
      } else {
        // If the full text doesn't exceed the limit, display it without ellipsis
        elem.innerText = originalText;
      }
    });
  }

  // Initial adjustment
  adjustDescriptionText();

  // Adjust on window resize
  window.addEventListener("resize", adjustDescriptionText);

  $(".learn-more-btn").on("click", function (event) {
    event.stopPropagation();
    $(".hardtent_menu-right").animate({ scrollTop: 0 }, "slow");

    const targetElement = $(this)
      .closest(".checkout-adds-wrapper")
      .next(".details-modal.two");
    const camperWrapper = $(this).closest(".camper-adds-wrapper");

    if (targetElement.length) {
      targetElement.css("display", "block");
      gsap.to(targetElement, { duration: 0.3, autoAlpha: 1 });

      // Adjust the camperWrapper's position
      camperWrapper.css("position", "static");
    }
  });

  $(".model-price").each(function () {
    // Retrieve the price as a float
    var price = parseFloat($(this).text());
    // Format the price with commas and ensure two decimal places
    var formattedPrice = price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    // Update the element's text with the formatted price
    $(this).text(formattedPrice);
  });

  $(".flex-click").click(function () {
    $(this)
      .find(".flex-hide")
      .each(function (index, element) {
        var $el = $(element);
        if ($el.is(":hidden")) {
          $el
            .delay(index * 150)
            .animate({ height: "toggle", opacity: "toggle" }, 250);
        } else {
          $el
            .delay(index * 150)
            .animate({ height: "toggle", opacity: "toggle" }, 250);
        }
      });
  });
});

(function ($) {
  $.fx.prototype.curOriginal = $.fx.prototype.cur;
  $.fx.prototype.cur = function (force) {
    if ($(this.elem).is("body") && this.prop == "scrollTop")
      return $(window).scrollTop();
    return this.curOriginal(force);
  };
})(jQuery);
