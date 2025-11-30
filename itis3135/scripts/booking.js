document.addEventListener("DOMContentLoaded", () => {
    
    // Initialize flatpickr for date selection
    const dateInput = document.getElementById("date");
    if (dateInput && typeof flatpickr !== 'undefined') {
      flatpickr(dateInput, {
        minDate: "today",
        dateFormat: "Y-m-d",
        disableMobile: true
      });
    }

    const form = document.getElementById("form");
    if (!form) return;
  
    // New behaviour: show confirmation overview when user clicks submit,
    // then send only if user confirms in the modal.
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showConfirmationOverview();
    });

    // Confirmation modal controls
    var confirmOverlay = document.getElementById('confirm-overlay');
    var confirmDetails = document.getElementById('confirm-details');
    var confirmSendBtn = document.getElementById('confirm-send');
    var confirmCancelBtn = document.getElementById('confirm-cancel');

    function gatherFormData() {
      var fd = new FormData(form);
      var obj = {};
      fd.forEach(function(value, key){
        if (obj[key]) {
          // convert to array
          if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      });
      return obj;
    }

    function formatDetails(data) {
      var html = '<dl>';
      function row(label, value){
        html += '<dt>' + label + '</dt><dd>' + (value || '<em>—</em>') + '</dd>';
      }
      row('Name', data.name);
      row('Phone', data.phone);
      row('Email', data.email);
      row('Service', data.service);
      row('Add-ons', Array.isArray(data.addons) ? data.addons.join(', ') : (data.addons || 'None'));
      row('Art tier', data.tier || 'None');
      row('Date', data.date);
      row('Time', data.time);
      row('Notes', data.notes || '');
      html += '</dl>';
      return html;
    }

    function showConfirmationOverview(){
      var data = gatherFormData();
      if (!confirmDetails) return;
      confirmDetails.innerHTML = formatDetails(data);
      if (confirmOverlay) {
        confirmOverlay.setAttribute('aria-hidden','false');
        confirmOverlay.style.display = 'flex';
        // focus the confirm button for accessibility
        if (confirmSendBtn) confirmSendBtn.focus();
      }
    }

    function hideConfirmationOverview(){
      if (confirmOverlay) {
        confirmOverlay.setAttribute('aria-hidden','true');
        confirmOverlay.style.display = 'none';
      }
    }

    async function doSubmit(){
      var data = new FormData(form);
      try {
        confirmSendBtn.disabled = true;
        var res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          window.location.href = 'confirmation.html';
        } else {
          alert('Sorry—something went wrong sending your request. Please try again.');
        }
      } catch (err) {
        alert('Network error. Please check your connection and try again.');
      } finally {
        confirmSendBtn.disabled = false;
      }
    }

    if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', function(){ hideConfirmationOverview(); });
    if (confirmSendBtn) confirmSendBtn.addEventListener('click', function(){ hideConfirmationOverview(); doSubmit(); });
  });
  