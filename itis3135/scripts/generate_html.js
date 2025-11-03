(function () {
    const form = document.getElementById('introForm');
    const generateBtn = document.getElementById('generateHtmlBtn');
    const titleH2 = document.querySelector('main h2');
    const resultSection = document.getElementById('result');
    const resultResetWrap = document.getElementById('resultResetWrap');
    const resultResetLink = document.getElementById('resultResetLink');
  
    // Simple HTML escaper so we can safely display the code literal
    const escapeHtml = (str) =>
      String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
  
    // Build the final HTML snippet from form values
    function buildIntroductionHtml(fd) {
      const name = fd.get('name') || '';
      const mascot = fd.get('mascot') || '';
      const imageCaption = fd.get('imageCaption') || '';
  
      // If a file was chosen, use its file name in an images/ path (your class example does this).
      // This won't display here, it's just the *code* we output.
      let imageSrc = 'images/headshot.jpeg';
      const imageInput = document.getElementById('image');
      const file = imageInput && imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;

      if (file && file.name) {
        imageSrc = `images/${file.name}`;
      }
  
      const personalBackground = fd.get('personalBackground') || '';
      const professionalBackground = fd.get('professionalBackground') || '';
      const academicBackground = fd.get('academicBackground') || '';
      const webDevBackground = fd.get('webDevBackground') || '';
      const primaryPlatform = fd.get('primaryPlatform') || '';
  
      const quote = fd.get('quote') || '';
      const quoteAuthor = fd.get('quoteAuthor') || '';
      const interestingFact = fd.get('interestingFact') || '';
      const anythingElse = fd.get('anythingElse') || '';
  
      // Repeater arrays (with [] names recommended)
      const courseDept = fd.getAll('courseDept[]').length ? fd.getAll('courseDept[]') : fd.getAll('courseDept');
      const courseNumber = fd.getAll('courseNumber[]').length ? fd.getAll('courseNumber[]') : fd.getAll('courseNumber');
      const courseName = fd.getAll('courseName[]').length ? fd.getAll('courseName[]') : fd.getAll('courseName');
      const courseReason = fd.getAll('courseReason[]').length ? fd.getAll('courseReason[]') : fd.getAll('courseReason');
  
      let coursesHtml = '';
      if (courseDept.length) {
        const items = courseDept.map((dept, i) => {
          const num = courseNumber[i] || '';
          const cname = courseName[i] || '';
          const reason = courseReason[i] || '';
          return `        <li>${escapeHtml(dept)} ${escapeHtml(num)} — ${escapeHtml(cname)} <em>(${escapeHtml(reason)})</em></li>`;
        }).join('\n');
        coursesHtml = `
      <li>
          <strong>Courses Currently Taking:</strong>
          <ul>
  ${items}
          </ul>
      </li>`;
      }
  
      // Final HTML to display as code (this is your “Introduction HTML”)
      const html =
  `<h2>Introduction HTML</h2>
  <h3>${escapeHtml(name)} ★ ${escapeHtml(mascot)}</h3>
  <figure>
      <img
          src="${escapeHtml(imageSrc)}"
          alt="Headshot of ${escapeHtml(name)} — Mascot: ${escapeHtml(mascot)}"
      />
      <figcaption>${escapeHtml(imageCaption)}</figcaption>
  </figure>
  <ul>
      <li><strong>Personal Background:</strong> ${escapeHtml(personalBackground)}</li>
      <li><strong>Professional Background:</strong> ${escapeHtml(professionalBackground)}</li>
      <li><strong>Academic Background:</strong> ${escapeHtml(academicBackground)}</li>
      <li><strong>Background in Web Development:</strong> ${escapeHtml(webDevBackground)}</li>
      <li><strong>Primary Computer Platform:</strong> ${escapeHtml(primaryPlatform)}</li>${coursesHtml}
      <li><strong>Interesting Fact:</strong> ${escapeHtml(interestingFact)}</li>
      <li><strong>Anything Else?</strong> ${escapeHtml(anythingElse)}</li>
  </ul>
  <blockquote>${escapeHtml(quote)}</blockquote>
  <p>&mdash; ${escapeHtml(quoteAuthor)}</p>`;
  
      return html;
    }
  
    function showCodeBlock(htmlString) {
      // Replace the form with a PRE/CODE block that shows the HTML literal
      const codeWrap = document.createElement('section');
      codeWrap.setAttribute('aria-live', 'polite');
  
      codeWrap.innerHTML = `
  <pre><code class="language-html">${escapeHtml(htmlString)}</code></pre>
  <p><small>Tip: drag to select all and copy, or press ⌘/Ctrl+A inside the code block.</small></p>`;
  
      // Replace the form node with the code section
      form.replaceWith(codeWrap);
  
      // Update H2
      if (titleH2) titleH2.textContent = 'Introduction HTML';
  
      // Make sure result reset link is visible so user can start over if they want
      if (resultResetWrap) resultResetWrap.hidden = false;
  
      // Run highlight.js on the new code block
      // Give it a moment until highlight.js (defer) is available
      const ensureHighlight = () => {
        if (window.hljs) {
            codeWrap.querySelectorAll('pre code').forEach((block) => window.hljs.highlightElement(block));
        } else {
          setTimeout(ensureHighlight, 50);
        }
      };
      ensureHighlight();
    }
  
    // Reset link (reload the page to get the form back)
    if (resultResetLink) {
      resultResetLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.reload();
      });
    }
  
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        // Use built-in validation first
        if (!form.reportValidity()) return;
  
        const fd = new FormData(form);
        const introHtml = buildIntroductionHtml(fd);
        showCodeBlock(introHtml);
      });
    }
  })();
  