document.addEventListener('DOMContentLoaded', function () {
  const pageName = document.title.split('-')[0];
  const pageNameTrim = pageName.trim();
  
  const truckCompatibilityForm = document.querySelector('form[data-name="Truck Compatibility Form"]');
  if (truckCompatibilityForm) {
    truckCompatibilityForm.addEventListener("submit", (e) => {
      e.preventDefault();
      new FormData(truckCompatibilityForm);
    });
    truckCompatibilityForm.addEventListener("formdata", (e) => {
      let data = e.formData;
      let make = data.get('Make');
      let model = data.get('Model');
      let year = data.get('Year');
      let customer_name = data.get('customer_name');
      let customer_email = data.get('customer_email');
      let phone = data.get('customer_phone');
      console.log('Phone Number:', phone); 
      analytics.track('Compatibility Check Completed', {
        make: make,
        model: model,
        year: year,
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone: phone
      });
    });
  }
const emailForms = document.querySelectorAll('form[data-name="Email Subscribed"], form[data-name="Email Form Nav"]');

emailForms.forEach((form) => {
form.addEventListener("submit", (e) => {
  console.log('test formSubmit');
  e.preventDefault();
  new FormData(form);
});

form.addEventListener("formdata", (e) => {
  let data = e.formData;
  let email = data.get('email');
  if (email) {
    analytics.track('Email Subscribed', {
      email: email,
      object: 'Email',
      action: 'Subscribed',
      category: 'Email Marketing',
      location: form.dataset.name 
    });
  }
});
});
});
