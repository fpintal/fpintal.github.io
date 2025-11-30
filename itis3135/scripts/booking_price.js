// Booking price updater — keeps UI logic separate from HTML
document.addEventListener('DOMContentLoaded', function () {
    var serviceSelect = document.getElementById('service');
    var addonCheckboxes = document.querySelectorAll('#addon-buttons input[type="checkbox"]');
    var tierSelect = document.getElementById('artTier');
    var priceDisplay = document.getElementById('booking-price-value');

    var prices = {
        services: {
            'Acrylics Full Set': 50,
            'Acrylics Fill in': 45,
            'Acrylic Toe Full Set': 55,
            'Manicure/Overlay': 50,
            'Builder Gel': 60,
            'Gel-X': 55
        },
        addons: {
            'Special Shapes': 5,
            'Cut Down': 5,
            'Medium Length': 5,
            'Long Length': 10,
            'XL Length': 15,
            'Gel-X Long/XL': 5
        },
        tiers: {
            'Tier 1 — $15': 15,
            'Tier 2 — $25': 25,
            'Tier 3 — $30': 30,
            'Tier 4 — $40': 40
        }
    };

    function getServiceValue() {
        return (serviceSelect && serviceSelect.value) ? serviceSelect.value : '';
    }

    function getSelectedAddons() {
        var selected = [];
        if (!addonCheckboxes) return selected;
        addonCheckboxes.forEach(function (cb) {
            if (cb.checked) selected.push(cb.value);
        });
        return selected;
    }

    function getTierValue() {
        return (tierSelect && tierSelect.value) ? tierSelect.value : '';
    }

    function calculateTotal() {
        var total = 0;
        var svc = getServiceValue();
        if (svc && prices.services[svc]) total += prices.services[svc];

        var addons = getSelectedAddons();
        addons.forEach(function (a) {
            if (prices.addons[a]) total += prices.addons[a];
        });

        var tier = getTierValue();
        if (tier && prices.tiers[tier]) total += prices.tiers[tier];

        return total;
    }

    function updateUI() {
        var total = calculateTotal();
        if (priceDisplay) priceDisplay.textContent = '$' + total;
    }

    if (serviceSelect) serviceSelect.addEventListener('change', updateUI);
    if (tierSelect) tierSelect.addEventListener('change', updateUI);
    if (addonCheckboxes) addonCheckboxes.forEach(function (cb) { cb.addEventListener('change', updateUI); });

    // Initial render
    updateUI();
});
