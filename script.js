function toggleMenu() {
  const header = document.querySelector('.header');
  const toggleBtn = header.querySelector('.toggle');
  // Expand or collapse
  header.classList.toggle('expanded');
  toggleBtn.classList.toggle('rotated');
}

function showSection(sectionId) {
  const allSections = document.querySelectorAll('section[id]');
  const header = document.querySelector('.header');
  const toggleBtn = header.querySelector('.toggle');
  const landingIframe = document.querySelector('.landing-iframe');

  // Hide ALL sections first
  allSections.forEach(sec => sec.classList.add('hidden'));

  // Then show only the relevant sections
  if (sectionId === 'pricing') {
    document.getElementById('pricing-header').classList.remove('hidden');
    document.getElementById('pricing').classList.remove('hidden');
  } else if (sectionId === 'about') {
    document.getElementById('about').classList.remove('hidden');
    document.getElementById('about-mission').classList.remove('hidden');
    document.getElementById('about-innovation').classList.remove('hidden');
  } else if (sectionId === 'create') {
    document.getElementById('create').classList.remove('hidden');
    document.getElementById('create-steps1').classList.remove('hidden');
    document.getElementById('create-steps2').classList.remove('hidden');
    document.getElementById('create-steps3').classList.remove('hidden');
  } else if (sectionId === 'landing') {  // Make this explicit
    document.getElementById('landing').classList.remove('hidden');
    document.getElementById('landing-carousel').classList.remove('hidden');
    document.getElementById('landing-additional').classList.remove('hidden');
    document.getElementById('landing-stats').classList.remove('hidden');
    document.getElementById('landing-stats2').classList.remove('hidden');
    document.getElementById('landing-more').classList.remove('hidden');
    document.getElementById('landing-more2').classList.remove('hidden');
  }

  // If the landing page is not active, remove the iframe src (to unload it)
  if (sectionId !== 'landing') {
    landingIframe.src = "";
  } else {
    landingIframe.src = "https://hansenhomeai.github.io/WebbyDeerKnoll/";
  }

  // Scroll to the top of the page when switching sections
  window.scrollTo(0, 0);

  // If the header is expanded, close it
  if (header.classList.contains('expanded')) {
    header.classList.remove('expanded');
    toggleBtn.classList.remove('rotated');
  }
}

function sendFeedback(e) {
  e.preventDefault();
  const feedbackInput = document.querySelector('input[name="feedback"]');
  const feedback = feedbackInput.value.trim();
  if (!feedback) {
    alert('Please enter your feedback before sending.');
    return;
  }

  const button = document.querySelector('.feedback-button');
  const originalText = button.textContent;
  button.textContent = ''; // Clear text

  // Create a check icon
  const checkSpan = document.createElement('span');
  checkSpan.textContent = '✓';
  checkSpan.style.fontSize = '1.2rem';
  checkSpan.style.display = 'inline-block';
  checkSpan.style.textAlign = 'center';
  button.appendChild(checkSpan);

  // Open user's email client
  window.location.href = `mailto:hello@hansenhome.ai?subject=Feedback&body=${encodeURIComponent(feedback)}`;

  // Clear input
  feedbackInput.value = '';

  // After 2 seconds, revert the button
  setTimeout(() => {
    button.removeChild(checkSpan);
    button.textContent = originalText;
  }, 2000);
}

function updateIframeOverlay() {
  const textBox = document.querySelector('.landing-content');
  const overlay = document.getElementById('iframe-overlay');

  if (textBox && overlay) {
    const textBoxHeight = textBox.offsetHeight;
    const textBoxTop = textBox.offsetTop;
    overlay.style.height = `calc(100vh - ${textBoxTop + textBoxHeight}px)`;
    overlay.style.top = `${textBoxTop + textBoxHeight}px`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let hoverElements = document.querySelectorAll(".logo, .toggle, .nav-links a, .nav-links-desktop a, .cta-button, .cta-button2, .cta-button2-fixed");

  hoverElements.forEach(element => {
    element.addEventListener("touchstart", function () {
      element.classList.add("disable-hover");
      setTimeout(() => {
        element.classList.remove("disable-hover");
      }, 500); // Adjust timeout as needed
    });
  });
});

// Update overlay on load and resize
window.addEventListener('load', updateIframeOverlay);
window.addEventListener('resize', updateIframeOverlay);

document.addEventListener('DOMContentLoaded', () => {
  showSection('landing');

  // Close the header if clicked outside while expanded
  document.addEventListener('click', (e) => {
    const header = document.querySelector('.header');
    const toggleBtn = header.querySelector('.toggle');
    if (header.classList.contains('expanded') && !header.contains(e.target)) {
      header.classList.remove('expanded');
      toggleBtn.classList.remove('rotated');
    }
  });
});

// FILE: dronePathGenerator.js
(function() {
  let poiCount = 0;
  let hoverTimer = null;

  const modeToggle = document.getElementById('modeToggle');
  const standardModeUI = document.getElementById('standardModeUI');
  const advancedModeUI = document.getElementById('advancedModeUI');
  const ranchModeUI = document.getElementById('ranchModeUI');
  const poiSection = document.getElementById('poiSection');
  const addPoiButton = document.getElementById('addPoiButton');

  // 1) Setup the text-field hover logic (0.45s delay).
  document.querySelectorAll('#dfpg-container .input-wrapper').forEach((wrapper) => {
    const inputElem = wrapper.querySelector('input');
    const overlay = wrapper.querySelector('.hover-overlay');
    const labelText = wrapper.getAttribute('data-label') || '';
    overlay.innerHTML = labelText;

    inputElem.addEventListener('mouseenter', () => {
      if (inputElem.value.trim() !== '') {
        hoverTimer = setTimeout(() => {
          wrapper.classList.add('hover-active');
        }, 450);
      }
    });
    inputElem.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      wrapper.classList.remove('hover-active');
    });
    // If user clicks/focuses, hide the overlay:
    inputElem.addEventListener('focus', () => {
      clearTimeout(hoverTimer);
      wrapper.classList.remove('hover-active');
    });
  });

  // 2) Slider fraction => default Advanced values
  function getAdvancedValuesFromSliderFraction(fraction) {
    const loops = Math.round(3 + (17 - 3) * fraction);
    const initRadius = Math.round(100 + (300 - 100) * fraction);

    // For radiusIncrement and aglIncrement, do an exponential approach:
    const radIncExpMin = 20;
    const radIncExpMax = 80;
    const radInc = Math.round(radIncExpMin * Math.pow(radIncExpMax / radIncExpMin, fraction));

    const incAGLExpMin = 10;
    const incAGLExpMax = 50;
    const incAGL = Math.round(incAGLExpMin * Math.pow(incAGLExpMax / incAGLExpMin, fraction));

    const startAGL = Math.round(100 + (300 - 100) * fraction);
    const startAlt = Math.round(50 + (150 - 50) * fraction);

    return {
      loops,
      initRadius,
      radInc,
      incAGL,
      startAGL,
      startAlt
    };
  }

  function getSliderFraction() {
    const sliderVal = parseFloat(document.getElementById("pathSizeSlider").value);
    return sliderVal / 100.0;
  }

  // 3) Handle mode switching
  window.setGeneratorMode = function(mode) {
    if (mode === 'standard') {
      modeToggle.setAttribute('data-mode', 'standard');
      standardModeUI.style.display = 'block';
      ranchModeUI.style.display = 'none';
      advancedModeUI.style.display = 'none';
      poiSection.style.display = 'none';
      addPoiButton.style.display = 'none';
    } else if (mode === 'ranch') {
      modeToggle.setAttribute('data-mode', 'ranch');
      standardModeUI.style.display = 'none';
      ranchModeUI.style.display = 'block';
      advancedModeUI.style.display = 'none';
      poiSection.style.display = 'none';
      addPoiButton.style.display = 'none';
    } else {
      // advanced
      modeToggle.setAttribute('data-mode', 'advanced');
      standardModeUI.style.display = 'none';
      ranchModeUI.style.display = 'none';
      advancedModeUI.style.display = 'block';
      poiSection.style.display = 'block';
      addPoiButton.style.display = 'inline-block';

      // If switching to advanced, dynamically set fields based on slider fraction
      const fraction = getSliderFraction();
      const advVals = getAdvancedValuesFromSliderFraction(fraction);
      document.getElementById("numLoops").value = advVals.loops;
      document.getElementById("initialRadius").value = advVals.initRadius;
      document.getElementById("radiusIncrement").value = advVals.radInc;
      document.getElementById("aglIncrement").value = advVals.incAGL;
      document.getElementById("initialAGL").value = advVals.startAGL;
      document.getElementById("startPointAltitude").value = advVals.startAlt;
    }
  };

  addPoiButton.addEventListener("click", addPoiRow);
  function addPoiRow() {
    poiCount++;
    const row = document.createElement('div');
    row.classList.add('poi-row');

    const poiLabel = document.createElement('span');
    poiLabel.classList.add('poi-row-title');
    poiLabel.textContent = `POI ${poiCount}`;
    row.appendChild(poiLabel);

    // POI gimbal tilt
    const poiAltitudeWrap = document.createElement('div');
    poiAltitudeWrap.classList.add('input-wrapper');
    poiAltitudeWrap.setAttribute('data-label', 'POI Gimbal Tilt (degrees)');
    const poiAltitudeInput = document.createElement('input');
    poiAltitudeInput.type = 'number';
    poiAltitudeInput.name = `poiAltitude${poiCount}`;
    poiAltitudeInput.placeholder = 'POI Gimbal Tilt (°)';
    poiAltitudeInput.step = 'any';
    const overlayAlt = document.createElement('div');
    overlayAlt.classList.add('hover-overlay');
    poiAltitudeWrap.appendChild(poiAltitudeInput);
    poiAltitudeWrap.appendChild(overlayAlt);
    row.appendChild(poiAltitudeWrap);

    // "From" and "To" fields in one row
    const loopRangeContainer = document.createElement('div');
    loopRangeContainer.classList.add('input-row');

    const loopFromWrap = document.createElement('div');
    loopFromWrap.classList.add('input-wrapper');
    loopFromWrap.setAttribute('data-label', 'From Loop');
    const loopFromInput = document.createElement('input');
    loopFromInput.type = 'number';
    loopFromInput.name = `poiLoopFrom${poiCount}`;
    loopFromInput.placeholder = 'From Loop';
    loopFromInput.min = '1';
    loopFromInput.step = '1';
    const overlayFrom = document.createElement('div');
    overlayFrom.classList.add('hover-overlay');
    loopFromWrap.appendChild(loopFromInput);
    loopFromWrap.appendChild(overlayFrom);

    const toLabel = document.createElement('span');
    toLabel.style.display = 'flex';
    toLabel.style.alignItems = 'center';
    toLabel.style.color = '#fff';
    toLabel.textContent = 'to';

    const loopToWrap = document.createElement('div');
    loopToWrap.classList.add('input-wrapper');
    loopToWrap.setAttribute('data-label', 'To Loop');
    const loopToInput = document.createElement('input');
    loopToInput.type = 'number';
    loopToInput.name = `poiLoopTo${poiCount}`;
    loopToInput.placeholder = 'To Loop';
    loopToInput.min = '1';
    loopToInput.step = '1';
    const overlayTo = document.createElement('div');
    overlayTo.classList.add('hover-overlay');
    loopToWrap.appendChild(loopToInput);
    loopToWrap.appendChild(overlayTo);

    loopRangeContainer.appendChild(loopFromWrap);
    loopRangeContainer.appendChild(toLabel);
    loopRangeContainer.appendChild(loopToWrap);
    row.appendChild(loopRangeContainer);

    const actions = document.createElement('div');
    actions.classList.add('poi-row-actions');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete POI';
    deleteBtn.classList.add('delete-poi-button');
    deleteBtn.addEventListener('click', () => {
      row.remove();
    });
    actions.appendChild(deleteBtn);
    row.appendChild(actions);

    document.getElementById("poiSection").appendChild(row);

    // Re-bind the hover logic for these new inputs
    const newInputs = row.querySelectorAll('.input-wrapper');
    newInputs.forEach((wrapper) => {
      const inputElem = wrapper.querySelector('input');
      const overlay = wrapper.querySelector('.hover-overlay');
      const labelText = wrapper.getAttribute('data-label') || '';
      overlay.innerHTML = labelText;

      inputElem.addEventListener('mouseenter', () => {
        if (inputElem.value.trim() !== '') {
          hoverTimer = setTimeout(() => {
            wrapper.classList.add('hover-active');
          }, 450);
        }
      });
      inputElem.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        wrapper.classList.remove('hover-active');
      });
      inputElem.addEventListener('focus', () => {
        clearTimeout(hoverTimer);
        wrapper.classList.remove('hover-active');
      });
    });
  }

  document.getElementById("coordinateForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const generateBtn = document.getElementById("generateButton");
    const originalBtnText = generateBtn.textContent;

    // Show spinner
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<div class="spinner"></div>`;

    const resultDiv = document.getElementById("result");
    const downloadMasterBtn = document.getElementById("downloadMasterBtn");
    const flightTimeDiv = document.getElementById("flightTime");
    const segmentDownloadsDiv = document.getElementById("segmentDownloads");
    const logDiv = document.getElementById("log");
    logDiv.innerHTML = '';
    resultDiv.innerHTML = '';

    // Decide which battery field to read from for standard/ranch/advanced:
    let batteryVal = document.getElementById("batteryCapacity").value.trim();
    if (modeToggle.getAttribute('data-mode') === 'advanced') {
      batteryVal = document.getElementById("batteryCapacityAdvanced").value.trim();
    }

    // Build the payload
    const payload = {
      title: document.getElementById("title").value.trim() || 'untitled',
      coordinates: document.getElementById("coordinates").value.trim(),
      takeoffCoordinates: document.getElementById("takeoffCoordinates").value.trim(),
      mode: modeToggle.getAttribute('data-mode'),
      sliderFraction: getSliderFraction(),
      minHeight: document.getElementById("minHeight").value.trim(),
      maxHeight: document.getElementById("maxHeight").value.trim(),
      batteryCapacity: batteryVal,
      numLoops: document.getElementById("numLoops").value.trim(),
      initialRadius: document.getElementById("initialRadius").value.trim(),
      radiusIncrement: document.getElementById("radiusIncrement").value.trim(),
      exponentialRadius: document.getElementById("exponentialRadius").checked,
      aglIncrement: document.getElementById("aglIncrement").value.trim(),
      exponentialAGL: document.getElementById("exponentialAGL").checked,
      initialAGL: document.getElementById("initialAGL").value.trim(),
      startPointAltitude: document.getElementById("startPointAltitude").value.trim(),

      // POI
      useGimbalTiltMode: !document.getElementById("poiModeToggle").checked,
      poiRows: []
    };

    // Ranch-specific
    if (modeToggle.getAttribute('data-mode') === 'ranch') {
      payload.minHeightRanch = document.getElementById("minHeightRanch").value.trim();
      payload.maxHeightRanch = document.getElementById("maxHeightRanch").value.trim();
      payload.batteryCapacityRanch = document.getElementById("batteryCapacityRanch").value.trim();
      payload.numBatteriesRanch = document.getElementById("numBatteriesRanch").value.trim();
      payload.initialRadiusRanch = document.getElementById("initialRadiusRanch").value.trim();
    }

    // Gather POI data
    const rows = document.getElementsByClassName('poi-row');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const altVal = row.querySelector(`input[name="poiAltitude${i+1}"]`).value.trim();
      const loopFrom = row.querySelector(`input[name="poiLoopFrom${i+1}"]`).value.trim();
      const loopTo = row.querySelector(`input[name="poiLoopTo${i+1}"]`).value.trim();
      payload.poiRows.push({
        altitude: altVal,
        loopFrom: loopFrom,
        loopTo: loopTo
      });
    }

    try {
      // *** CALL YOUR AWS LAMBDA ENDPOINT HERE ***
      const lambdaUrl = "https://2sgk99b5pg.execute-api.us-west-2.amazonaws.com/dev/DronePathREST";
      const response = await fetch(lambdaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Lambda request failed: ${response.status}`);
      }

      const rawData = await response.json();
      const data = typeof rawData.body === "string" ? JSON.parse(rawData.body) : rawData.body;

      if (data && data.logs) {
        data.logs.forEach(entry => {
          log(entry.title, entry.msg);
        });
      }
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.elevationMsg) {
        resultDiv.innerHTML = data.elevationMsg;
      }
      if (typeof data.totalFlightTimeMinutes !== "undefined") {
        flightTimeDiv.style.display = "block";
        flightTimeDiv.innerHTML = `Estimated Total Flight Time: ${data.totalFlightTimeMinutes.toFixed(2)} minutes`;
      }
      if (data.masterWaypoints && data.masterWaypoints.length) {
        downloadMasterBtn.style.display = "inline-block";
        const titleSafe = sanitizeTitle(data.title || 'untitled');
        downloadMasterBtn.onclick = function() {
          downloadCSV(data.masterWaypoints, `${titleSafe}-master.csv`);
          log('Download:', `${titleSafe}-master.csv has been downloaded.`);
        };
      } else {
        downloadMasterBtn.style.display = "none";
      }
      if (data.segments && data.segments.length) {
        segmentDownloadsDiv.style.display = "block";
        segmentDownloadsDiv.innerHTML = `<p>Flight Segments (${data.segments.length}):</p>`;
        data.segments.forEach((segment, idx) => {
          const btn = document.createElement('button');
          btn.textContent = `Download Segment ${idx + 1}`;
          btn.style.marginRight = "5px";
          const titleSafe = sanitizeTitle(data.title || 'untitled');
          btn.onclick = () => {
            downloadCSV(segment, `${titleSafe}-segment-${idx + 1}.csv`);
            log('Download:', `${titleSafe}-segment-${idx + 1}.csv has been downloaded.`);
          };
          segmentDownloadsDiv.appendChild(btn);
        });
      } else {
        segmentDownloadsDiv.style.display = "none";
      }

    } catch (error) {
      resultDiv.innerHTML = `Error: ${error.message}`;
      log('Error:', error.message);
      downloadMasterBtn.style.display = "none";
      flightTimeDiv.style.display = "none";
      segmentDownloadsDiv.style.display = "none";
    } finally {
      generateBtn.innerHTML = originalBtnText;
      generateBtn.disabled = false;
    }
  });

  function log(title, msg) {
    const logDiv = document.getElementById("log");
    logDiv.innerHTML += `<strong>${title}</strong> ${msg}\n`;
  }

  function downloadCSV(waypoints, filename) {
    let csv = "latitude,longitude,altitude(ft),heading(deg),curvesize(ft),rotationdir,gimbalmode,gimbalpitchangle,altitudemode,speed(m/s),poi_latitude,poi_longitude,poi_altitude(ft),poi_altitudemode,photo_timeinterval,photo_distinterval\n";
    waypoints.forEach((wp) => {
      csv += [
        wp.latitude,
        wp.longitude,
        parseFloat(wp.altitude || 0).toFixed(2),
        wp.heading,
        wp.curvesize,
        wp.rotationdir,
        wp.gimbalmode,
        wp.gimbalpitchangle,
        wp.altitudemode,
        wp.speed,
        wp.poi_latitude,
        wp.poi_longitude,
        wp.poi_altitude,
        wp.poi_altitudemode,
        wp.photo_timeinterval,
        wp.photo_distinterval
      ].join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function sanitizeTitle(t) {
    return t.replace(/[^a-z0-9_\-]/gi, '_');
  }

  // ===== JS FOR TOOLTIP POSITIONING =====
  document.addEventListener('click', function(e) {
    const isIcon = e.target.matches('.info-pill-icon');
    const isTooltip = e.target.closest('.info-tooltip');
    const openTooltips = document.querySelectorAll('#dfpg-container .info-tooltip.active');

    // Close all tooltips if clicking outside
    if (!isIcon && !isTooltip) {
      openTooltips.forEach(tip => {
        tip.classList.remove('active');
        tip.style.display = 'none';
      });
    }

    // Handle tooltip click
    if (isIcon) {
      e.preventDefault();
      const icon = e.target;
      const tooltipId = icon.getAttribute('data-tooltip-target');
      const tooltip = document.getElementById(tooltipId);

      if (tooltip.classList.contains('active')) {
        tooltip.classList.remove('active');
        tooltip.style.display = 'none';
      } else {
        openTooltips.forEach(tip => {
          tip.classList.remove('active');
          tip.style.display = 'none';
        });
        tooltip.classList.add('active');
        tooltip.style.display = 'block';

        // Positioning logic
        const containerRect = document.querySelector('#dfpg-container .dfpg-container-inner').getBoundingClientRect();
        const iconRect = icon.getBoundingClientRect();
        const top = (iconRect.bottom - containerRect.top) + 10;
        tooltip.style.top = top + 'px';

        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';

        // Adjust arrow positioning
        const tooltipRect = tooltip.getBoundingClientRect();
        const iconCenterX = iconRect.left + (iconRect.width / 2);
        const arrowX = iconCenterX - tooltipRect.left;
        tooltip.style.setProperty('--arrowOffset', arrowX + 'px');
      }
    }
  });
})();

// CHUNK #3: dronePhotoUploader.js
(function() {
  const propertyTitle   = document.getElementById('propertyTitle');
  const addressOfProp   = document.getElementById('addressOfProperty');
  const listingDesc     = document.getElementById('listingDescription');
  const uploadArea      = document.getElementById('uploadArea');
  const uploadPrompt    = document.getElementById('uploadPrompt');
  const fileInput       = document.getElementById('fileInput');
  const selectedFileDisplay = document.getElementById('selectedFileDisplay');
  const selectedFileName = document.getElementById('selectedFileName');
  const removeFileBtn   = document.getElementById('removeFileBtn');
  const emailField      = document.getElementById('emailField');
  const optionalNotes   = document.getElementById('optionalNotes');
  const uploadBtn       = document.getElementById('uploadBtn');
  const progressBar     = document.getElementById('progressBar');
  const progressBarFill = document.getElementById('progressBarFill');

  let selectedFile = null;  
  const MAX_FILE_SIZE = 7 * 1024 * 1024 * 1024; // 7GB
  const CHUNK_SIZE    = 24 * 1024 * 1024;       // 24MB

  // Required text fields
  const requiredFields = [propertyTitle, addressOfProp, listingDesc, emailField];
  requiredFields.forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim()) {
        field.classList.remove('missing-field');
      }
    });
  });

  // Close icon => remove selected file
  removeFileBtn.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = "";
    selectedFileDisplay.style.display = "none";
    uploadPrompt.style.display = "block";
    uploadArea.classList.remove('missing-field');
  });

  // Drag & drop
  uploadArea.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  });

  function validateAndSetFile(file) {
    if (
      file.type !== "application/x-zip-compressed" && 
      !file.name.toLowerCase().endsWith(".zip")
    ) {
      alert("Please upload a .zip file only.");
      fileInput.value = "";
      selectedFile = null;
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 5GB. Please upload a smaller .zip file.");
      fileInput.value = "";
      selectedFile = null;
      return;
    }
    selectedFile = file;

    // Hide the prompt
    uploadPrompt.style.display = "none";
    // Show file name + close icon
    selectedFileDisplay.style.display = "block";
    selectedFileName.textContent = file.name;
    // Remove highlight
    uploadArea.classList.remove('missing-field');
  }

  /************************************************
   * Endpoints for multipart in your backend
   ************************************************/
  const START_MULTIPART_ENDPOINT   = "https://mismmjgpm3.execute-api.us-west-2.amazonaws.com/prod/start-multipart-upload";
  const GET_PRESIGNED_PART_ENDPOINT= "https://mismmjgpm3.execute-api.us-west-2.amazonaws.com/prod/get-presigned-url";
  const COMPLETE_MULTIPART_ENDPOINT= "https://mismmjgpm3.execute-api.us-west-2.amazonaws.com/prod/complete-multipart-upload";
  const SAVE_SUBMISSION_ENDPOINT   = "https://mismmjgpm3.execute-api.us-west-2.amazonaws.com/prod/save-submission";

  async function saveSubmissionMetadata(objectKey) {
    const payload = {
      email: emailField.value.trim(),
      propertyTitle: propertyTitle.value.trim(),
      listingDescription: listingDesc.value.trim(),
      addressOfProperty: addressOfProp.value.trim(),
      optionalNotes: optionalNotes.value.trim(),
      objectKey: objectKey
    };

    const res = await fetch(SAVE_SUBMISSION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to save submission metadata");
    }
    return await res.json();
  }

  async function startMultipartUpload(fileName, fileType) {
    const payload = {
      propertyTitle: propertyTitle.value.trim(),
      addressOfProperty: addressOfProp.value.trim(),
      listingDescription: listingDesc.value.trim(),
      email: emailField.value.trim(),
      optionalNotes: optionalNotes.value.trim(),
      fileName: fileName,
      fileType: fileType
    };

    const res = await fetch(START_MULTIPART_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to start multipart upload");
    }
    return await res.json();
  }

  async function getPresignedUrlForPart(uploadId, bucketName, objectKey, partNumber) {
    const payload = { uploadId, bucketName, objectKey, partNumber };
    const res = await fetch(GET_PRESIGNED_PART_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to get presigned URL for part " + partNumber);
    }
    return await res.json();
  }

  async function completeMultipartUpload(uploadId, bucketName, objectKey, parts) {
    const payload = { uploadId, bucketName, objectKey, parts };
    const res = await fetch(COMPLETE_MULTIPART_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to complete multipart upload");
    }
    return await res.json();
  }

  async function uploadFileInChunks(file) {
    const { uploadId, bucketName, objectKey } = await startMultipartUpload(file.name, file.type);
    console.log("Multipart upload started:", { uploadId, bucketName, objectKey });

    const totalSize   = file.size;
    let uploadedBytes = 0;
    let partNumber    = 1;
    const partsETags  = [];

    let offset = 0;
    while (offset < totalSize) {
      const chunk = file.slice(offset, offset + CHUNK_SIZE);
      const chunkSize = chunk.size;

      const { url } = await getPresignedUrlForPart(uploadId, bucketName, objectKey, partNumber);
      const eTag = await uploadPart(url, chunk, partNumber);

      partsETags.push({ ETag: eTag, PartNumber: partNumber });

      uploadedBytes += chunkSize;
      const percent = (uploadedBytes / totalSize) * 100;
      progressBarFill.style.width = percent + "%";
      console.log(`Uploaded part #${partNumber}: ${percent.toFixed(2)}% done`);

      offset += CHUNK_SIZE;
      partNumber++;
    }

    await completeMultipartUpload(uploadId, bucketName, objectKey, partsETags);
    console.log("Multipart upload completed!");
    return { objectKey };
  }

  function uploadPart(url, chunk, partNumber) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      xhr.upload.addEventListener("error", () => {
        reject(new Error("Network error uploading part #" + partNumber));
      });
      xhr.onload = () => {
        if (xhr.status === 200) {
          const eTag = xhr.getResponseHeader("ETag");
          if (!eTag) {
            return reject(new Error("No ETag found in upload response for part #" + partNumber));
          }
          resolve(eTag);
        } else {
          reject(new Error("Failed to upload part #" + partNumber + "; status: " + xhr.status));
        }
      };

      xhr.send(chunk);
    });
  }

  // Handle upload
  uploadBtn.addEventListener('click', async () => {
    let missing = false;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('missing-field');
        missing = true;
      }
    });
    if (!selectedFile) {
      uploadArea.classList.add('missing-field');
      missing = true;
    }
    if (missing) {
      return;
    }

    const originalBtnHTML = uploadBtn.innerHTML;
    uploadBtn.innerHTML = '<div class="spinner"></div>';
    uploadBtn.disabled = true;

    try {
      progressBar.style.display = 'block';
      progressBarFill.style.width = '0%';

      // Start chunked upload
      const result = await uploadFileInChunks(selectedFile);

      // Save to DynamoDB
      await saveSubmissionMetadata(result.objectKey);
      console.log("Submission metadata saved!");

      uploadBtn.innerHTML = 'Upload Complete!';
      alert("Upload completed!");
    } catch (err) {
      console.error("Multipart Upload error:", err.message);
      alert("Error uploading file (multipart): " + err.message);
    } finally {
      setTimeout(() => {
        uploadBtn.innerHTML = originalBtnHTML;
        uploadBtn.disabled = false;
        progressBar.style.display = 'none';
        progressBarFill.style.width = '0%';
      }, 1500);
    }
  });
})();