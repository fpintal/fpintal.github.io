(function () {
    // Grab references to key DOM elements
    var form = document.getElementById('introForm');
    var generateBtn = document.getElementById('generateJsonBtn');
    var titleH2 = document.querySelector('main h2');
  
    // If form or button isn't found (wrong page), stop
    if (!form || !generateBtn) return;
  
    // The assignment text says to change the <h2> title.
    // We’ll call it "Introduction JSON" for clarity.
    var HEADING_TEXT = 'Introduction JSON';
  
    // Escapes special characters so JSON displays as HTML safely
    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  
    // Breaks full name into parts: first, middle initial, last
    function parseName(full) {
      full = (full || '').trim();
      if (!full) return { firstName: '', preferredName: '', middleInitial: '', lastName: '' };
      var parts = full.split(/\s+/);
      var first = parts[0] || '';
      var last = parts.length > 1 ? parts[parts.length - 1] : '';
      var middle = parts.slice(1, -1).join(' ');
      var middleInitial = middle ? middle.trim()[0] || '' : '';
      return { firstName: first, preferredName: first, middleInitial: middleInitial, lastName: last };
    }
  
    // Splits mascot string into adjective + animal
    function splitMascot(mascot) {
      mascot = (mascot || '').trim();
      if (!mascot) return { mascotAdjective: '', mascotAnimal: '' };
      var parts = mascot.split(/\s+/);
      var adjective = parts[0] || '';
      var animal = parts.slice(1).join(' ');
      return { mascotAdjective: adjective, mascotAnimal: animal || '' };
    }
  
    // Gathers all course rows from the repeater and returns them as objects
    function getCourses() {
      var rows = Array.prototype.slice.call(document.querySelectorAll('#coursesRepeater .course'));
      return rows.map(function (row) {
        var deptEl = row.querySelector("[name='courseDept']") || row.querySelector("[name^='courseDept']");
        var numEl = row.querySelector("[name='courseNumber']") || row.querySelector("[name^='courseNumber']");
        var nameEl = row.querySelector("[name='courseName']") || row.querySelector("[name^='courseName']");
        var reasonEl = row.querySelector("[name='courseReason']") || row.querySelector("[name^='courseReason']");
        return {
          department: (deptEl && deptEl.value.trim()) || '',
          number: (numEl && numEl.value.trim()) || '',
          name: (nameEl && nameEl.value.trim()) || '',
          reason: (reasonEl && reasonEl.value.trim()) || ''
        };
      });
    }
  
    // Builds the JSON object using the data from the form fields
    function buildJsonFromForm(fd) {
      // Parse name and mascot
      var fullName = fd.get('name') || '';
      var nameParts = parseName(fullName);
      var mascot = fd.get('mascot') || '';
      var mParts = splitMascot(mascot);
  
      // Use uploaded image file name if available, otherwise fallback
      var imageInput = document.getElementById('image');
      var file = imageInput && imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;
      var imagePath = file && file.name ? ('images/' + file.name) : 'images/headshot.jpeg';
  
      // Pull form values for backgrounds
      var personalBackground = fd.get('personalBackground') || '';
      var professionalBackground = fd.get('professionalBackground') || '';
      var academicBackground = fd.get('academicBackground') || '';
      var subjectBackground = fd.get('webDevBackground') || ''; // maps to "subjectBackground"
      var primaryComputer = fd.get('primaryPlatform') || '';
  
      // Quote, author, and extras
      var quote = fd.get('quote') || '';
      var quoteAuthor = fd.get('quoteAuthor') || '';
      var interestingFact = fd.get('interestingFact') || '';
      var anythingElse = fd.get('anythingElse') || '';
  
      // Collect courses
      var coursesArr = getCourses();
  
      // Default divider from example
      var divider = '~';
  
      // Example link structure from TA template
      var links = [
        { name: 'GitHub', href: '' },
        { name: 'GitHub Page', href: '' },
        { name: 'freeCodeCamp', href: '' },
        { name: 'Codecademy', href: '' },
        { name: 'LinkedIn', href: '' }
      ];
  
      // Assemble the final JSON object exactly as the assignment example shows
      var json = {
        firstName: nameParts.firstName,
        preferredName: nameParts.preferredName,
        middleInitial: nameParts.middleInitial,
        lastName: nameParts.lastName,
        divider: divider,
        mascotAdjective: mParts.mascotAdjective,
        mascotAnimal: mParts.mascotAnimal,
        image: imagePath,
        imageCaption: fd.get('imageCaption') || '',
        personalStatement: quote ? quote : anythingElse,
        personalBackground: personalBackground,
        professionalBackground: professionalBackground,
        academicBackground: academicBackground,
        subjectBackground: subjectBackground,
        primaryComputer: primaryComputer,
        courses: coursesArr,
        links: links
      };
  
      return json;
    }
  
    // Displays the JSON as formatted, highlighted code
    function showCodeBlock(jsonObj) {
      var codeWrap = document.createElement('section');
      codeWrap.setAttribute('aria-live', 'polite');
  
      // Turn the object into a nicely spaced JSON string
      var jsonString = JSON.stringify(jsonObj, null, 2);
  
      // Insert JSON as HTML-safe text inside <pre><code>
      codeWrap.innerHTML =
        '<pre><code class="language-json">' + escapeHtml(jsonString) + '</code></pre>' +
        '<p><small>Tip: drag to select all and copy, or press ⌘/Ctrl+A inside the code block.</small></p>';
  
      // Replace the form with the JSON block
      form.replaceWith(codeWrap);
  
      // Update <h2> text
      if (titleH2) titleH2.textContent = HEADING_TEXT;
  
      // Highlight.js runs once loaded (it’s deferred)
      function ensureHighlight() {
        if (window.hljs) {
          var blocks = codeWrap.querySelectorAll('pre code');
          blocks.forEach(function (block) {
            window.hljs.highlightElement(block);
          });
        } else {
          setTimeout(ensureHighlight, 50);
        }
      }
      ensureHighlight();
    }
  
    // Event listener for the “Generate JSON” button
    generateBtn.addEventListener('click', function () {
      // Run form validation
      if (!form.reportValidity()) return;
  
      // Gather form data into FormData object
      var fd = new FormData(form);
  
      // Build the JSON object
      var obj = buildJsonFromForm(fd);
  
      // Display JSON on the page
      showCodeBlock(obj);
    });
  })();
  