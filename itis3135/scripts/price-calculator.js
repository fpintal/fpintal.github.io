function calculatePrice(service, addons = [], artTier) {
  const servicePrices = {
    "Acrylics Full Set": 45,
    "Acrylics Fill in": 35,
    "Acrylic Toe Full Set": 40,
    "Manicure/Overlay": 30,
    "Builder Gel": 50,
    "Gel-X": 55,
  };

  const addonPrices = {
    "XL Length (Acrylic)": 15,
    "XL Length (Gel-X)": 10,
    "Medium Length": 5,
    "Long Length": 10,
    "Cut Down": 5,
    "Stiletto": 8,
    "Almond": 8,
    "Duck": 8,
    "Lipstick": 8,
  };

  const tierPrices = {
    "Tier 1": 10,
    "Tier 2": 20,
    "Tier 3": 40,
    "Tier 4": 60,
  };

  let total = servicePrices[service] || 0;

  for (const addon of addons) {
    if (addonPrices[addon]) {
      total += addonPrices[addon];
    }
  }

  if (tierPrices[artTier]) {
    total += tierPrices[artTier];
  }

  return total;
}

// Auto-wire to form if present
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('price-calculator-form');
  if (!form) return;

  const serviceSelect = form.querySelector('[name="service"]');
  const addonCheckboxes = form.querySelectorAll('[name="addons"]');
  const tierSelect = form.querySelector('[name="artTier"]');
  const resultDisplay = document.getElementById('price-result');

  function update() {
    const service = serviceSelect?.value || '';
    const addons = Array.from(addonCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    const artTier = tierSelect?.value || '';

    const price = calculatePrice(service, addons, artTier);
    if (resultDisplay) {
      resultDisplay.textContent = `Estimated Price: $${price}`;
    }
  }

  serviceSelect?.addEventListener('change', update);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', update));
  tierSelect?.addEventListener('change', update);

  update(); // initial calculation
});
