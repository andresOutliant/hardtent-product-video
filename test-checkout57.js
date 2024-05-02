// fbq("track", "ViewContent");

// Initialize variables with values from localStorage
storedMake = localStorage.getItem("selectedMake");
storedModel = localStorage.getItem("selectedModel");
storedYear = localStorage.getItem("selectedYear");

storedName = localStorage.getItem("customer_name");
storedEmail = localStorage.getItem("customer_email");
storedPhone = localStorage.getItem("customer_phone");
var isSupporting =
  localStorage.getItem("isSupporting") === "true" ? true : false;

function populateDropdown(dropdownId, options, selectedValue, placeholderText) {
  var dropdown = $(dropdownId);
  dropdown.empty(); // Clears existing options

  // Add a customized placeholder based on the dropdown
  dropdown.append(
    $("<option>", {
      text: placeholderText, // Use the passed placeholder text
      value: "",
    })
  );

  // Add new options
  options.forEach((option) => {
    dropdown.append(
      $("<option>", {
        text: option,
        value: option,
        selected: option === selectedValue,
      })
    );
  });

  // Enable or disable the dropdown based on the options available
  dropdown.prop("disabled", options.length === 0);
}

console.log("Make: " + storedMake);
console.log("Model: " + storedModel);
console.log("Year: " + storedYear);

console.log("Customer Name: " + storedName);
console.log("Customer Email: " + storedEmail);
console.log("Customer Phone: " + storedPhone);
console.log("isSupporting " + isSupporting);

var zeroPricingEnabled = true; // Set this to false if you want to disable zero pricing

var truckInfo = {
  make: "",
  model: "",
  year: "",
};

var modelName = "";
var modelPrice = 0;

var activeModelCard = $(".model-card.active");
var activeProducts = [];

function updateSelections(id, value) {
  truckInfo[id] = value;

  if (id === "make") {
    document.getElementById("make-selected").textContent = value;
  } else if (id === "model") {
    document.getElementById("truck-model-selected").textContent = value;
  } else if (id === "year") {
    document.getElementById("year-selected").textContent = value;
  }
}

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
  var quantity = parseInt(productElement.find(".quantity-number").text()) || 1;

  var productImage = productElement.find(".add-image").attr("src");

  var existingProduct = activeProducts.find((p) => p.sku === productSKU);

  if (existingProduct) {
    existingProduct.quantity = quantity;
    existingProduct.totalPrice = productPrice * quantity;
    existingProduct.imageUrl = productImage; // Update the image URL
    updateUI();
    return existingProduct;
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
    updateUI();
    return newProduct;
  }
}

function selectModelTypeAddOns(modelType) {
  // Normalize modelType for comparison
  var normalizedModelType = normalizeModelType(modelType);

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
      storedMake !== "Ford" &&
      storedModel !== "F 150" &&
      storedYear <= 2024 &&
      storedYear >= 2021 &&
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
    //newDiv.find(".add-on-price").text("$" + product.totalPrice.toFixed(2)); // Update product price
    newDiv.find(".add-on-price").text(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(product.totalPrice)
    );

    newDiv.appendTo(".adds").show();
  });

  updateSubtotal();
}

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
      `<input type='hidden' class='dynamic-input' name='${idx}:quantity' value='${product.quantity}'>`,
      product.imageUrl
        ? `<input type='hidden' class='dynamic-input' name='${idx}:image' value='${product.imageUrl}'>`
        : ""
    );
  });

  // Always add the Downpayment item with a fixed price of $500
  $("#foxy-cart-form").append(
    `<input type='hidden' class='dynamic-input' name='name' value='Reserve for HardCamp'>`,
    `<input type='hidden' class='dynamic-input' name='price' value='500'>`,
    `<input type='hidden' class='dynamic-input' name='quantity' value='1'>`
  );
}

function updateSubtotal() {
  var subtotal = 0;

  // Include the original price of the active model card
  var activeModelCard = $(".model-card.active");
  if (activeModelCard.length) {
    var modelPriceText = activeModelCard.find(".model-price").text();
    // var modelPrice = parseFloat(modelPriceText.replace(/[^0-9.]/g, ""));
    // subtotal += modelPrice;
    // commented model price out so it doesnt affect total
  }

  // Log active products details
  console.log("Active products:", activeProducts);

  // Add prices of active products (using their original prices)
  activeProducts.forEach(function (product) {
    console.log(
      "Adding product price:",
      product.price,
      "Quantity:",
      product.quantity
    );
    subtotal += product.price * product.quantity;
  });

  // Always include the Downpayment item
  // subtotal += 500; // Fixed price for Downpayment

  // Apply a discount of $3000
  subtotal -= 3000; // Subtract the discount from the subtotal

  // Add $100 to the subtotal if the price is higher than $15000
  if (subtotal > 15000) {
    subtotal += 100;
  }

  var formattedSubtotal = subtotal.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  console.log("Subtotal calculated:", subtotal);

  $("#subtotal").fadeOut(160, function () {
    $(this).text(formattedSubtotal).fadeIn(160);
  });
}

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

$(document).ready(function () {
  //   resets the foxy cart on page load
  FC.onLoad = function () {
    FC.client.on("ready.done", function () {
      FC.client.request(
        "https://" + FC.settings.storedomain + "/cart?empty=true"
      );
    });
  };

  $("#model-dropdown").change(function () {
    console.log("Model selected: ", $(this).val());
    // Other code...
  });

  if (storedMake) {
    $("#make-dropdown").val(storedMake).prop("disabled", false);
  } else {
    $("#make-dropdown").prepend(
      "<option selected disabled>Please select</option>"
    );
  }

  if (storedModel) {
    $("#model-dropdown").val(storedModel).prop("disabled", false);
  } else {
    $("#model-dropdown").prepend(
      "<option selected disabled>Please select</option>"
    );
  }

  if (storedYear) {
    $("#year-dropdown").val(storedYear).prop("disabled", false);
  } else {
    $("#year-dropdown").prepend(
      "<option selected disabled>Please select</option>"
    );
  }

  //   $("#customer_name").val(storedName);
  //   $("#customer_email").val(storedEmail);
  //   $("#customer_phone").val(storedPhone);

  $(".back-to-step-one").click(function () {
    $(".truck-matched").fadeOut(245, "swing");
    $("#truck-compatible").fadeOut(245, "swing");
    $("#truck-incompatible").fadeOut(245, "swing");

    $(".specialist-form").fadeIn(245, "swing");
    $(".truck-check-container").fadeIn(245, "swing");
    $("#truck-form").fadeIn(245, "swing");
  });

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
    // Format the price with commas and ensure no decimal places
    var formattedPrice = price.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    // Update the element's text with the formatted price
    $(this).text(formattedPrice);
  });

  $(".checkout-adds-wrapper").on("click", function () {
    $(this).toggleClass("active");

    if ($(this).hasClass("active")) {
      $(this).find(".add-check").fadeIn();
      var product = addOrUpdateProduct($(this)); // Capture the returned product
      analytics.track("Add-On Selected", {
        add_on_id: "",
        add_on_name: product.name, // Use the captured product details
        customer_email: storedEmail ?? "",
        make: storedMake ?? "",
        model: storedModel ?? "",
        year: storedYear ?? "",
      });
    } else {
      $(this).find(".add-check").fadeOut();
      removeProductFromArray($(this));
      updateUI(); // Update UI after product removal
    }
  });

  $("#submit-to-foxy").on("click", function (event) {
    event.preventDefault(); // Prevent the default form submission.

    var webflowForm = $("#wf-form-Build-Info-Pre-Deposit");
    webflowForm.find(".dynamic-input").remove(); // Clear existing dynamic inputs.

    // Create and append each hidden input for the stored variables.
    webflowForm.append(
      `<input type='hidden' name='make' id='build-form-make' value='${storedMake}' class='dynamic-input'>`
    );
    webflowForm.append(
      `<input type='hidden' name='model' id='build-form-model' value='${storedModel}' class='dynamic-input'>`
    );
    webflowForm.append(
      `<input type='hidden' name='year' id='build-form-year' value='${storedYear}' class='dynamic-input'>`
    );
    webflowForm.append(
      `<input type='hidden' name='name' id='build-form-name' value='${storedName}' class='dynamic-input'>`
    );
    webflowForm.append(
      `<input type='hidden' name='email' id='build-form-email' value='${storedEmail}' class='dynamic-input'>`
    );
    webflowForm.append(
      `<input type='hidden' name='phone' id='build-form-phone' value='${storedPhone}' class='dynamic-input'>`
    );

    // Iterate over the FoxyCart form's dynamic inputs and clone them to the Webflow form.
    $("#foxy-cart-form .dynamic-input").each(function () {
      var clonedInput = $(this).clone();
      webflowForm.append(clonedInput);
    });

    // Submit the Webflow form.
    webflowForm.submit();

    // Optional additional actions.
    setTimeout(function () {
      updateCartFormWithProducts(modelName, modelPrice);
      $("#foxy-cart-form").submit();
    }, 250); // Delay can be adjusted as needed.
  });

  //   $("#submit-to-foxy").on("click", function (event) {
  //     // Optionally prevent the default submission to ensure data is copied first.
  //     event.preventDefault();

  //     // Reference to the hidden Webflow form.
  //     var webflowForm = $("#wf-form-Build-Info-Pre-Deposit");

  //     // Clear any previously added dynamic inputs in the Webflow form.
  //     webflowForm.find(".dynamic-input").remove();

  //     // Iterate over the FoxyCart form's inputs, focusing on product details.
  //     $("#foxy-cart-form .dynamic-input").each(function () {
  //       // Clone the current element
  //       var clonedInput = $(this).clone();

  //       // Append the cloned input directly to the Webflow form
  //       webflowForm.append(clonedInput);
  //     });

  //     $("#wf-form-Build-Info-Pre-Deposit").submit();
  //     // Optional: Submit the FoxyCart form or perform other actions as needed, potentially after a delay
  //     // to ensure the Webflow form submission process initiates or completes.
  //     setTimeout(function () {
  //       updateCartFormWithProducts(modelName, modelPrice);

  //       $("#foxy-cart-form").submit();
  //     }, 250); // Adjust delay as needed based on your application's behavior.
  //   });

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

  // Update subtotal or other UI elements if necessary
  // updateSubtotal();

  //   function updateSubtotal() {
  //     var subtotal = 0;

  //     // Include the original price of the active model card
  //     var activeModelCard = $(".model-card.active");
  //     if (activeModelCard.length) {
  //       var modelPriceText = activeModelCard.find(".model-price").text();
  //       //   var modelPrice = parseFloat(modelPriceText.replace(/[^0-9.]/g, ""));
  //       //   subtotal += modelPrice;
  //       //commented model price out so it doesnt affect total
  //     }

  //     // Add prices of active products (using their original prices)
  //     activeProducts.forEach(function (product) {
  //       subtotal += product.price * product.quantity;
  //     });

  //     // Always include the Downpayment item
  //     // subtotal += 500; // Fixed price for Downpayment

  //     // Apply a discount of $3000
  //     subtotal -= 3000; // Subtract the discount from the subtotal

  //     // Add $100 to the subtotal if the price is higher than $15000
  //     if (subtotal > 15000) {
  //       subtotal += 100;
  //     }

  //     var formattedSubtotal = subtotal.toLocaleString("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     });

  //     $("#subtotal").fadeOut(160, function () {
  //       $(this).text(formattedSubtotal).fadeIn(160);
  //     });
  //   }

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

$(document).ready(function () {
  // Declare a global variable to store the selected model name
  var selectedModelName = "Base"; // Default to 'Base' initially

  // Initially show the base slider
  showRelevantSlider(selectedModelName);

  $(document).on("click", ".model-card", function () {
    resetSelectedAddOns();
    var isActive = $(this).hasClass("active");
    $(".model-card").removeClass("active");

    if (!isActive) {
      $(this).addClass("active");
    }

    // Update the button state based on active model cards
    if ($(".model-card.active").length > 0) {
      $(".forward-button.inactive")
        .removeClass("inactive")
        .addClass("send-model");
      $(this).find(".add-check").fadeIn();
    } else {
      $(".forward-button").not(".inactive").addClass("inactive");
      $(this).find(".add-check").fadeOut();
    }

    var activeModelCard = $(".model-card.active");
    if (activeModelCard.length) {
      var modelName = activeModelCard.data("model-name");
      var modelPrice = parseFloat(activeModelCard.data("model-price"));
      var startingAtPrice = parseFloat(
        activeModelCard.find(".starting-at-price").text().replace(/,/g, "") ||
          modelPrice
      );

      selectedModelName = modelName; // Store the selected model name globally
      localStorage.setItem("selectedModelName", modelName);

      showRelevantSlider(modelName); // Show the relevant slider

      $("#model-selected").text("HardCamp - " + modelName);

      var originalPriceText = activeModelCard.find(".starting-at-price").text();
      var originalPrice = originalPriceText
        ? parseFloat(originalPriceText.replace(/,/g, ""))
        : modelPrice;

      $("#original-price").text("$" + formatPrice(originalPrice));

      selectModelTypeAddOns(modelName);
      console.log(
        "Model Name:",
        modelName,
        "Model Price:",
        modelPrice,
        "Original Price:",
        originalPrice
      );
      updateCartFormWithProducts(modelName, 0);

      var formattedPrice = formatPrice(modelPrice);

      $("#subtotal").fadeOut(160, function () {
        $(this)
          .text("$" + formattedPrice)
          .fadeIn(160);
      });

      $(".original-price").each(function () {
        var formattedStartingPrice = formatPrice(startingAtPrice);
        $(this).text(
          formattedStartingPrice ? "$" + formattedStartingPrice : "N/A"
        );
      });
    } else {
      $("#model-name-input").val("");
      $("#model-price-input").val("");
      $("#original-price").text("N/A"); // Ensure original price is reset if no model card is active
      showRelevantSlider("Base"); // Default to base slider when no model is active
    }
  });

  function showRelevantSlider(modelName) {
    $("div[data-slider-name]").hide(); // Hide all sliders first
    $("div[data-slider-name='" + modelName + "']").show(); // Show the slider matching the model name
  }

  function formatPrice(price) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
});

// $(document).on("click", ".model-card", function () {
//   resetSelectedAddOns();
//   var isActive = $(this).hasClass("active");
//   $(".model-card").removeClass("active");

//   if (!isActive) {
//     $(this).addClass("active");
//   }

//   // Update the button state based on active model cards
//   if ($(".model-card.active").length > 0) {
//     $(".forward-button.inactive")
//       .removeClass("inactive")
//       .addClass("send-model");
//     $(this).find(".add-check").fadeIn();
//   } else {
//     $(".forward-button").not(".inactive").addClass("inactive");
//     $(this).find(".add-check").fadeOut();
//   }

//   var activeModelCard = $(".model-card.active");
//   if (activeModelCard.length) {
//     var modelName = activeModelCard.data("model-name");
//     var modelPrice = parseFloat(activeModelCard.data("model-price"));
//     var startingAtPrice = parseFloat(
//       activeModelCard.find(".starting-at-price").text().replace(/,/g, "") ||
//         modelPrice
//     );

//     $("#model-selected").text("HardCamp - " + modelName);

//     // Capture the original price from the active model card, fallback to modelPrice if not available
//     var originalPriceText = activeModelCard.find(".starting-at-price").text();
//     var originalPrice = originalPriceText
//       ? parseFloat(originalPriceText.replace(/,/g, ""))
//       : modelPrice;

//     // Update the original price on the webpage
//     $("#original-price").text("$" + formatPrice(originalPrice));

//     selectModelTypeAddOns(modelName);
//     console.log(
//       "Model Name:",
//       modelName,
//       "Model Price:",
//       modelPrice,
//       "Original Price:",
//       originalPrice
//     );
//     updateCartFormWithProducts(modelName, 0);

//     // Format the price with commas
//     var formattedPrice = formatPrice(modelPrice);

//     // Update Subtotal and original prices in UI
//     $("#subtotal").fadeOut(160, function () {
//       $(this)
//         .text("$" + formattedPrice)
//         .fadeIn(160);
//     });
//     $(".original-price").each(function () {
//       var formattedStartingPrice = formatPrice(startingAtPrice);
//       $(this).text(
//         formattedStartingPrice ? "$" + formattedStartingPrice : "N/A"
//       );
//     });
//   } else {
//     $("#model-name-input").val("");
//     $("#model-price-input").val("");
//     $("#original-price").text("N/A"); // Ensure original price is reset if no model card is active
//   }
// });

function formatPrice(price) {
  if (!isNaN(price)) {
    // Round the price to the nearest whole number and format with commas
    return Math.round(price).toLocaleString();
  } else {
    console.error("Invalid price input:", price);
    return null; // handle cases where price is not a number
  }
}

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

(function ($) {
  $.fx.prototype.curOriginal = $.fx.prototype.cur;
  $.fx.prototype.cur = function (force) {
    if ($(this.elem).is("body") && this.prop == "scrollTop")
      return $(window).scrollTop();
    return this.curOriginal(force);
  };
})(jQuery);

//truck form and checkout code
$(document).ready(function () {
  function waitForJQuery() {
    if (window.jQuery) {
      $(document).ready(function () {
        $(".check-btn-wrapper").click(function () {
          if ($(".truck-check").prop("disabled")) {
            $("#required-message").fadeIn("slow");
          }
        });

        if (
          storedMake &&
          storedModel &&
          storedYear &&
          storedName &&
          storedEmail &&
          storedPhone &&
          isSupporting
        ) {
          // Populate dropdowns for truck selection
          populateDropdown(
            "#make-dropdown",
            getUniqueMakes(truckData),
            storedMake,
            "Select Make"
          );
          populateDropdown(
            "#model-dropdown",
            getUniqueModels(storedMake),
            storedModel,
            "Select Model"
          );
          populateDropdown(
            "#year-dropdown",
            getUniqueYears(storedMake, storedModel),
            storedYear,
            "Select Year"
          );
          $("#model-dropdown, #year-dropdown, #bed-size-dropdown").prop(
            "disabled",
            false
          );

          // Populate input fields for customer details
          $("#customer_name").val(storedName);
          $("#customer_email").val(storedEmail);
          $("#customer_phone").val(storedPhone);

          // if user has used compatability form then take them to step two
          var stepOne =
            document.getElementById("step-one") ||
            document.body.appendChild(document.createElement("div"));
          stepOne.id = "step-one";

          var stepTwo =
            document.getElementById("step-two") ||
            document.body.appendChild(document.createElement("div"));
          stepTwo.id = "step-two";

          switchSection(stepOne, stepTwo);
          $(".step-two-form").fadeIn(200);

          $(".truck-matched").fadeOut(245, "swing");
          $("#truck-compatible").fadeOut(245, "swing");
          $("#truck-incompatible").fadeOut(245, "swing");

          $("#make-dropdown, #model-dropdown, #year-dropdown").trigger(
            "change"
          );

          $("#make-selected").text(storedMake || "Placeholder");
          $("#truck-model-selected").text(storedModel || "Placeholder");
          $("#year-selected").text(storedYear || "Placeholder");
        } else {
          // Initialize empty dropdowns if no data is stored
          populateDropdown("#make-dropdown", [], "Make");
          populateDropdown("#model-dropdown", [], "Model");
          populateDropdown("#year-dropdown", [], "Year");
          populateDropdown("#bed-size-dropdown", [], "Bed Size");
          $(".truck-check").css("opacity", "0.5").prop("disabled", true);
          $("#model-dropdown, #year-dropdown, #bed-size-dropdown").prop(
            "disabled",
            true
          );

          var makes = getUniqueMakes(truckData);
          populateDropdown("#make-dropdown", makes, "Make");
        }

        $("#make-dropdown").change(function () {
          var selectedMake = $(this).val();
          localStorage.setItem("selectedMake", selectedMake);
          updateModelAndYearDropdowns(selectedMake); // Update model and year based on selected make
        });

        $("#model-dropdown").change(function () {
          var selectedMake = $("#make-dropdown").val();
          var selectedModel = $(this).val();
          localStorage.setItem("selectedModel", selectedModel);
          updateYearDropdown(selectedMake, selectedModel); // Update year based on selected make and model
        });

        $("#year-dropdown").change(function () {
          var selectedYear = $(this).val();
          localStorage.setItem("selectedYear", selectedYear);
        });

        // Function to update model dropdown based on selected make
        $("#make-dropdown").change(function () {
          var selectedMake = $(this).val();
          localStorage.setItem("selectedMake", selectedMake);
          updateModelAndYearDropdowns(selectedMake); // Update model and year based on selected make
        });

        function updateModelAndYearDropdowns(make) {
          if (!make) {
            // Check if the make is not selected
            $("#model-dropdown").prop("disabled", true).empty();
            $("#year-dropdown").prop("disabled", true).empty();
            return;
          }

          var models = getUniqueModels(make);
          populateDropdown("#model-dropdown", models, models[0]);

          // Check if there are any models to enable the dropdown
          if (models.length > 0) {
            $("#model-dropdown").prop("disabled", false);
            $("#model-dropdown").change(); // Trigger change to update year dropdown
          } else {
            $("#model-dropdown").prop("disabled", true);
            $("#year-dropdown").prop("disabled", true);
          }
        }

        // Function to update year dropdown based on selected make and model
        function updateYearDropdown(make, model) {
          if (!model) {
            // Check if a model is actually selected
            $("#year-dropdown").prop("disabled", true).empty();
            return;
          }

          var years = getUniqueYears(make, model);
          populateDropdown("#year-dropdown", years, years[0]);

          // Enable or disable the year dropdown based on available years
          $("#year-dropdown").prop("disabled", years.length === 0);
          if (years.length > 0) {
            $("#year-dropdown").change(); // Optionally trigger change if needed for further updates
          }
        }

        $(
          "#year-dropdown, #customer_name, #customer_email, #customer_phone, #email-check"
        ).on("change input", function () {
          var selectedMake = $("#make-dropdown").val();
          var selectedModel = $("#model-dropdown").val();
          var selectedYear = $("#year-dropdown").val();
          var customerName = $("#customer_name").val().trim();
          var customerEmail = $("#customer_email").val().trim();
          var customerPhone = $("#customer_phone").val().trim();
          var isEmailChecked = $("#email-check").is(":checked");

          var isValidYear = selectedYear !== "";
          var isValidName = isValidCustomerName(customerName);
          var isValidEmail = isValidCustomerEmail(customerEmail);
          var isValidPhone = isValidCustomerPhone(customerPhone);
          var isValidEmailCheck = isEmailChecked;

          if (
            isValidYear &&
            isValidName &&
            isValidEmail &&
            isValidPhone &&
            isValidEmailCheck
          ) {
            localStorage.setItem("selectedYear", selectedYear);

            var bedSizes = getBedSizes(
              selectedMake,
              selectedModel,
              selectedYear
            );

            $("#bed-size-dropdown").prop("disabled", bedSizes.length === 0);

            resetDropdowns(["#bed-size-dropdown"]);
            populateDropdown("#bed-size-dropdown", bedSizes, "Bed Size");

            $(".truck-check").css("opacity", "1").prop("disabled", false);
          } else {
            $(".truck-check").css("opacity", "0.5").prop("disabled", true);
          }
        });

        function isValidCustomerName(name) {
          return name !== "";
        }

        function isValidCustomerEmail(email) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        }

        function isValidCustomerPhone(phone) {
          return phone.trim() !== "";
        }

        $(".truck-check").click(function () {
          handleTruckCheck();
        });

        $(".button-circle").click(function () {
          resetDropdowns(["#model-dropdown", "#year-dropdown"]);
        });
      });
      clearInterval(jQueryCheckInterval);
    }
  }

  var jQueryCheckInterval = setInterval(waitForJQuery, 100);

  function getUniqueMakes(data) {
    var makes = [...new Set(data.map((item) => item.manufacturer))];
    return makes;
  }

  function getUniqueModels(make) {
    var models = [
      ...new Set(
        truckData
          .filter((item) => item.manufacturer === make)
          .map((item) => item.model)
      ),
    ];
    return models;
  }

  function getUniqueYears(make, model) {
    var filteredData = truckData.filter(
      (item) => item.manufacturer === make && item.model === model
    );
    var years = [];
    filteredData.forEach((item) => {
      for (
        let year = item.yearStart;
        year <=
        (item.yearEnd === "current" ? new Date().getFullYear() : item.yearEnd);
        year++
      ) {
        if (!years.includes(year)) years.push(year);
      }
    });

    years.sort(function (a, b) {
      return b - a;
    });

    return years;
  }

  function getBedSizes(make, model, year) {
    var sizes = truckData
      .filter(
        (item) =>
          item.manufacturer === make &&
          item.model === model &&
          year >= item.yearStart &&
          year <=
            (item.yearEnd === "current"
              ? new Date().getFullYear()
              : item.yearEnd)
      )
      .map((item) => item.bedSize);
    return [...new Set(sizes)];
  }

  function resetDropdowns(dropdownIds) {
    dropdownIds.forEach(function (dropdownId) {
      var placeholder = "";
      if (dropdownId === "#model-dropdown") placeholder = "Model";
      else if (dropdownId === "#year-dropdown") placeholder = "Year";
      else if (dropdownId === "#bed-size-dropdown") placeholder = "Bed Size";

      populateDropdown(dropdownId, [], placeholder);
    });

    $("#truck-compatible").fadeOut(245, "swing");
    $("#truck-incompatible").fadeOut(245, "swing");
    $("#truck-matched").fadeOut(245, "swing");

    // $(".compatible-form").fadeOut(245, "swing");
    $(".incompatible-form").fadeOut(245, "swing");

    $(".specialist-form").fadeIn(245, "swing");

    $(".truck-check-container").fadeIn(245, "swing");
    $(".truck-check").css("opacity", "0.5").prop("disabled", true);
  }

  function checkSupporting(make, model, year, bedSize) {
    var result = truckData.find(function (truck) {
      return (
        truck.manufacturer === make &&
        truck.model === model &&
        parseInt(year) >= truck.yearStart &&
        parseInt(year) <=
          (truck.yearEnd === "current" ? 2024 : truck.yearEnd) &&
        (bedSize === undefined || bedSize === null || truck.bedSize == bedSize)
      );
    });
    console.log("Matching truck data:", result); // Log the result to the console

    return result ? result.supporting : false;
  }

  function handleTruckCheck() {
    // Fetch the current selections from the dropdowns
    var currentMake = $("#make-dropdown").val();
    var currentModel = $("#model-dropdown").val();
    var currentYear = $("#year-dropdown").val();

    // Update the text fields to display the current selections
    $("#make-selected").text(currentMake || "Placeholder");
    $("#truck-model-selected").text(currentModel || "Placeholder");
    $(".year-selected").text(currentYear || "Placeholder");

    // Check support status using the current selections
    isSupporting = checkSupporting(currentMake, currentModel, currentYear);

    // Store the new 'isSupporting' status
    localStorage.setItem("isSupporting", isSupporting);
    console.log("new isSupporting: " + isSupporting);

    // Hide the truck check container and update the form display based on support status
    $(".truck-check-container").fadeOut(245, "swing");

    if (isSupporting) {
      $("#truck-form").hide();
      $("#truck-compatible").fadeIn(245, "swing", function () {
        $(this).css("display", "flex");
      });
      $(".specialist-form").hide();
    } else {
      $("#truck-form").hide();
      $("#truck-incompatible").fadeIn(245, "swing", function () {
        $(this).css("display", "flex");
      });
      $(".incompatible-form").fadeIn(245, "swing");
      $(".specialist-form").hide();

      $(".make-incompatable-text").text(currentMake);
      $(".model-incompatable-text").text(currentModel);
      $(".year-incompatable-text").text(currentYear);
      $(".make-incompatable").val(currentMake);
      $(".model-incompatable").val(currentModel);
      $(".year-incompatable").val(currentYear);
      $(".email-incompatable").val(storedEmail);
      $(".phone-incompatable").val(storedPhone);
      $(".name-incompatable").val(storedName);
    }
  }
});
