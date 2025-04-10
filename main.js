// A - Initial Setup and MIDI Initialization:

// Add loading state and indicator immediately
document.body.classList.add("loading");
document.getElementById("midi-devices").innerHTML = `
  <div class="loading-indicator">
    Initializing MIDI access...
  </div>
`;

// Then proceed with MIDI initialization
WebMidi.enable()
  .then(onEnabled)
  .catch((err) => {
    const midiDevicesDiv = document.getElementById("midi-devices");
    let errorMessage = "Error accessing MIDI";

    if (err.name === "SecurityError") {
      errorMessage =
        "MIDI access denied. Please allow MIDI access in your browser settings.";
    } else if (err.name === "NotSupportedError") {
      errorMessage =
        "WebMIDI is not supported in this browser. Please use a modern browser like Chrome or Edge.";
    }

    midiDevicesDiv.innerHTML = `
      <div class="error-message">
        ${errorMessage}<br>
        ${err.message}
      </div>
    `;
  });

// B - Device Detection and Parameter Configuration

function onEnabled() {
  document.body.classList.remove("loading");
  const midiDevicesDiv = document.getElementById("midi-devices");

  // Clear the loading indicator
  midiDevicesDiv.innerHTML = "<h2>Pedal connection</h2>";

  // Check for MIDI devices
  if (WebMidi.outputs.length < 1) {
    midiDevicesDiv.innerHTML += `
      <div class="error-message">
        No MIDI devices detected.
      </div>
    `;
  } else {
    let devicesFound = false;
    WebMidi.outputs.forEach((device, index) => {
      if (device.name === "DL4 MkII") {
        devicesFound = true;
        midiDevicesDiv.innerHTML += `
          <div class="success-message">
            ${device.name} detected as MIDI output ${index}.
          </div>
        `;
      }
    });

    if (!devicesFound) {
      midiDevicesDiv.innerHTML += `
        <div class="error-message">
          DL4 MkII not found among connected MIDI devices. Check your connection and refresh the page. If prompted give permission for MIDI access.
        </div>
      `;
    }
  }

  // Parameter update animation function
  function updateParameter(span, newValue) {
    span.classList.add("fade-out");
    setTimeout(() => {
      span.textContent = newValue;
      span.classList.remove("fade-out");
      span.classList.add("fade-in");
      requestAnimationFrame(() => {
        span.classList.remove("fade-in");
      });
    }, 300);
  }

  // Parameters configuration
  const delayParameters = {
    mkii: {
      title: "Mk II delays",
      models: {
        0: {
          name: "Vintage Digital",
          tweak: "Bit/Sample Quality",
          tweez: "Mod Depth",
        },
        1: { name: "Crisscross", tweak: "Delay Time B", tweez: "Cross Amount" },
        2: { name: "Euclidean Delay", tweak: "Step Fill", tweez: "Rotate" },
        3: { name: "Dual Delay", tweak: "R Delay Time", tweez: "R Feedback" },
        4: {
          name: "Pitch Echo",
          tweak: "Pitch Interval",
          tweez: "Pitch Cents",
        },
        5: { name: "ADT", tweak: "Distortion Deck 2", tweez: "Mod Depth" },
        6: {
          name: "Ducked Delay",
          tweak: "Threshold",
          tweez: "Attack/Release",
        },
        7: { name: "Harmony Delay", tweak: "Key (A-G#)", tweez: "Scale" },
        8: {
          name: "Heliosphere",
          tweak: "Reverb Mix + Delay",
          tweez: "Mod Depth",
        },
        9: { name: "Transistor Tape", tweak: "Headroom", tweez: "Wow/Flutter" },
        10: {
          name: "Cosmos Echo",
          tweak: "Heads Select",
          tweez: "Wow/Flutter",
        },
        11: { name: "Multi Pass", tweak: "Tap Pattern", tweez: "Delay Mode" },
        12: { name: "Adriatic Delay", tweak: "Mod Rate", tweez: "Mod Depth" },
        13: {
          name: "Elephant Man",
          tweak: "Mod Depth",
          tweez: "Chorus/Vibrato",
        },
        14: {
          name: "Glitch Delay",
          tweak: "Pitch",
          tweez: "Slice/Drift/Shuffle",
        },
      },
    },
    legacy: {
      title: "Legacy delays",
      models: {
        15: { name: "Digital", tweak: "Bass", tweez: "Treble" },
        16: { name: "Digital w/ Mod", tweak: "Mod Rate", tweez: "Depth" },
        17: { name: "Echo Platter", tweak: "Wow/Flutter", tweez: "Drive" },
        18: { name: "Stereo", tweak: "R Delay Time", tweez: "R Repeats" },
        19: { name: "Ping Pong", tweak: "Time Offset", tweez: "Stereo Spread" },
        20: { name: "Reverse", tweak: "Mod Rate", tweez: "Mod Depth" },
        21: { name: "Dynamic", tweak: "Threshold", tweez: "Ducking" },
        22: {
          name: "Auto-Volume Echo",
          tweak: "Mod Depth",
          tweez: "Swell Time",
        },
        23: { name: "Tube Echo", tweak: "Wow/Flutter", tweez: "Drive" },
        24: { name: "Tape Echo", tweak: "Bass", tweez: "Treble" },
        25: { name: "Multi-Head", tweak: "Heads 1/2", tweez: "Heads 3/4" },
        26: { name: "Sweep Echo", tweak: "Sweep Rate", tweez: "Sweep Depth" },
        27: { name: "Analog Echo", tweak: "Bass", tweez: "Treble" },
        28: { name: "Analog w/ Mod", tweak: "Mod Rate", tweez: "Mod Depth" },
        29: { name: "Lo Res Delay", tweak: "Tone", tweez: "Resolution" },
      },
    },
  };

  const reverbParameters = {
    models: {
      0: { name: "Room", tweak: "Predelay" },
      1: { name: "Searchlights", tweak: "Mod Mix/Depth" },
      2: { name: "Particle Verb", tweak: "Condition" },
      3: { name: "Double Tank", tweak: "Mod Depth" },
      4: { name: "Octo", tweak: "Intensity" },
      5: { name: "Tile", tweak: "Predelay" },
      6: { name: "Ducking", tweak: "Predelay" },
      7: { name: "Plateaux", tweak: "Pitch Modes" },
      8: { name: "Cave", tweak: "Predelay" },
      9: { name: "Plate", tweak: "Predelay" },
      10: { name: "Ganymede", tweak: "Mod Depth" },
      11: { name: "Chamber", tweak: "Predelay" },
      12: { name: "Hot Springs", tweak: "Spring Count" },
      13: { name: "Hall", tweak: "Predelay" },
      14: { name: "Glitz", tweak: "Mod Depth" },
      15: { name: "Reverb Off", tweak: "Tweak" },
    },
  };

  // C - Navigation setup and dropdown generation

  // Navigation setup
  function setupNavigation() {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidenav = document.querySelector(".sidenav");
    const navItems = document.querySelectorAll(".nav-item");
    let backdrop;

    // Create backdrop element
    function createBackdrop() {
      backdrop = document.createElement("div");
      backdrop.className = "backdrop";
      document.body.appendChild(backdrop);

      backdrop.addEventListener("click", () => {
        sidenav.classList.remove("open");
        backdrop.classList.remove("visible");
      });
    }
    createBackdrop();

    // Toggle menu
    menuToggle?.addEventListener("click", () => {
      sidenav.classList.toggle("open");
      backdrop.classList.toggle("visible");
    });

    // Handle navigation
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class from all items
        navItems.forEach((nav) => nav.classList.remove("active"));

        // Add active class to clicked item
        item.classList.add("active");

        // Get the target section ID from the href
        const targetId = item.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        // Scroll to the target section
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }

        // On mobile, close the menu after clicking
        if (window.innerWidth <= 768) {
          sidenav.classList.remove("open");
          backdrop.classList.remove("visible");
        }
      });
    });

    // Set active state based on scroll position
    function updateActiveNavItem() {
      const sections = [
        "midi-devices",
        "presets",
        "delays",
        "reverbs",
        "looper",
      ];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        }
        return false;
      });

      if (currentSection) {
        navItems.forEach((item) => {
          const href = item.getAttribute("href").substring(1);
          item.classList.toggle("active", href === currentSection);
        });
      }
    }

    // Update active nav item on scroll
    window.addEventListener("scroll", updateActiveNavItem);
    // Set initial active state
    updateActiveNavItem();
  }

  // Dropdowns generation
  function generatePresetDropdown() {
    const presetList = document.querySelector("#presets .mdc-list");

    for (let i = 0; i < 128; i++) {
      const displayNumber = (i + 1).toString().padStart(3, "0");
      const li = document.createElement("li");
      li.className = "mdc-list-item";
      li.setAttribute("data-value", i);
      li.setAttribute("role", "option");

      li.innerHTML = `
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">Preset ${displayNumber}</span>
      `;
      presetList.appendChild(li);
    }

    const select = new mdc.select.MDCSelect(
      document.querySelector("#presets .mdc-select")
    );
    select.listen("MDCSelect:change", () => {
      const programNumber = parseInt(select.value);
      const myOutput = WebMidi.getOutputByName("DL4 MkII");
      const myChannel = myOutput.channels[1];
      myChannel.sendProgramChange(programNumber);
      console.log(`Program change ${programNumber} sent`);

      // Reset parameter labels
      const delayTweakSpan = document.querySelector("#delays .tweak");
      const delayTweezSpan = document.querySelector("#delays .tweez");
      const reverbTweakSpan = document.querySelector("#reverbs .tweak");
      delayTweakSpan.textContent = "Tweak";
      delayTweezSpan.textContent = "Tweez";
      reverbTweakSpan.textContent = "Tweak";
    });
  }

  function generateDelayDropdown() {
    const delayList = document.querySelector("#delays .mdc-list");

    // MkII delays
    const mkiiOptgroup = document.createElement("li");
    mkiiOptgroup.className = "mdc-list-group";
    mkiiOptgroup.innerHTML = `<div class="model-group-label">${delayParameters.mkii.title}</div>`;

    Object.entries(delayParameters.mkii.models).forEach(([value, model]) => {
      const li = document.createElement("li");
      li.className = "mdc-list-item";
      li.setAttribute("data-value", value);
      li.setAttribute("role", "option");

      li.innerHTML = `
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">${model.name}</span>
      `;
      mkiiOptgroup.appendChild(li);
    });
    delayList.appendChild(mkiiOptgroup);

    // Legacy delays
    const legacyOptgroup = document.createElement("li");
    legacyOptgroup.className = "mdc-list-group";
    legacyOptgroup.innerHTML = `<div class="model-group-label">${delayParameters.legacy.title}</div>`;

    Object.entries(delayParameters.legacy.models).forEach(([value, model]) => {
      const li = document.createElement("li");
      li.className = "mdc-list-item";
      li.setAttribute("data-value", value);
      li.setAttribute("role", "option");

      li.innerHTML = `
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">${model.name}</span>
      `;
      legacyOptgroup.appendChild(li);
    });
    delayList.appendChild(legacyOptgroup);

    const delaySelect = new mdc.select.MDCSelect(
      document.querySelector("#delays .mdc-select")
    );
    delaySelect.listen("MDCSelect:change", () => {
      const ccValue = parseInt(delaySelect.value);
      const delayTweakSpan = document.querySelector("#delays .tweak");
      const delayTweezSpan = document.querySelector("#delays .tweez");

      let parameters;
      if (ccValue < 15) {
        parameters = delayParameters.mkii.models[ccValue];
      } else {
        parameters = delayParameters.legacy.models[ccValue];
      }

      if (parameters) {
        updateParameter(delayTweakSpan, parameters.tweak);
        updateParameter(delayTweezSpan, parameters.tweez);
      }

      const myOutput = WebMidi.getOutputByName("DL4 MkII");
      const myChannel = myOutput.channels[1];
      myChannel.sendControlChange(1, ccValue);
      console.log(`Sent CC1 value ${ccValue}`);
    });
  }

  function generateReverbDropdown() {
    const reverbList = document.querySelector("#reverbs .mdc-list");

    Object.entries(reverbParameters.models).forEach(([value, model]) => {
      const li = document.createElement("li");
      li.className = "mdc-list-item";
      li.setAttribute("data-value", value);
      li.setAttribute("role", "option");

      li.innerHTML = `
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">${model.name}</span>
      `;
      reverbList.appendChild(li);
    });

    const reverbSelect = new mdc.select.MDCSelect(
      document.querySelector("#reverbs .mdc-select")
    );
    reverbSelect.listen("MDCSelect:change", () => {
      const ccValue = parseInt(reverbSelect.value);
      const reverbTweakSpan = document.querySelector("#reverbs .tweak");
      const parameter = reverbParameters.models[ccValue];

      if (parameter) {
        updateParameter(reverbTweakSpan, parameter.tweak);
      }

      const myOutput = WebMidi.getOutputByName("DL4 MkII");
      const myChannel = myOutput.channels[1];
      myChannel.sendControlChange(2, ccValue);
      console.log(`Sent CC2 value ${ccValue}`);
    });
  }

  // D - Slider setup and looper control functions

  // Slider setup functions
  function setupTimeSubdivisionSlider() {
    const slider = document.querySelector('[data-cc="12"]');
    const subdivisionLabel = document.querySelector(".subdivision-label");
    const subdivisions = [
      "1/8 Triplet",
      "1/8",
      "1/8 Dotted",
      "1/4 Triplet",
      "1/4",
      "1/4 Dotted",
      "1/2 Triplet",
      "1/2",
      "1/2 Dotted",
    ];

    const mdcSlider = slider.mdcSliderInstance;

    mdcSlider.listen("MDCSlider:change", () => {
      const value = mdcSlider.getValue();
      subdivisionLabel.textContent = subdivisions[value];

      const myOutput = WebMidi.getOutputByName("DL4 MkII");
      const myChannel = myOutput.channels[1];
      myChannel.sendControlChange(12, value);
      console.log(`Sent CC12 value ${value}`);
    });

    mdcSlider.listen("MDCSlider:input", () => {
      const value = mdcSlider.getValue();
      subdivisionLabel.textContent = subdivisions[value];
    });

    subdivisionLabel.textContent = subdivisions[mdcSlider.getValue()];
  }

  function setupRoutingButtons() {
    const buttons = document.querySelectorAll(".segment-button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        buttons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        button.classList.add("active");

        // Get the value and send MIDI
        const value = parseInt(button.dataset.value);
        const myOutput = WebMidi.getOutputByName("DL4 MkII");
        const myChannel = myOutput.channels[1];
        myChannel.sendControlChange(19, value);
        console.log(`Sent CC19 value ${value}`);
      });
    });
  }

  function setupSliderListeners() {
    const sliders = document.querySelectorAll(
      ".mdc-slider:not([data-cc='12']):not([data-cc='19'])"
    );
    sliders.forEach((slider) => {
      const mdcSlider = slider.mdcSliderInstance;
      mdcSlider.listen("MDCSlider:change", () => {
        const ccNumber = parseInt(slider.dataset.cc);
        const ccValue = parseInt(mdcSlider.getValue());
        const myOutput = WebMidi.getOutputByName("DL4 MkII");
        const myChannel = myOutput.channels[1];
        myChannel.sendControlChange(ccNumber, ccValue);
        console.log(`Sent CC${ccNumber} value ${ccValue}`);
      });
    });
  }

  function setupLooperButtons() {
    const looperControls = document.querySelector(".looper-controls");

    document
      .querySelectorAll('#looper button[data-command="looper"]')
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          const ccNumber = parseInt(e.currentTarget.dataset.value1);
          const ccValue = parseInt(e.currentTarget.dataset.value2);

          // Handle Classic Looper toggle
          if (ccNumber === 9) {
            // Remove active class from all buttons in this group
            const buttonRow = e.currentTarget.closest(".button-row");
            buttonRow.querySelectorAll("button").forEach((btn) => {
              btn.classList.remove("active");
            });
            // Add active class to clicked button
            e.currentTarget.classList.add("active");

            // Toggle looper controls visibility
            if (ccValue === 127) {
              // Classic Looper On
              looperControls.classList.add("visible");
              // Reinitialize sliders in looper controls
              looperControls
                .querySelectorAll(".mdc-slider")
                .forEach((slider) => {
                  const mdcSlider = mdc.slider.MDCSlider.attachTo(slider);
                  slider.mdcSliderInstance = mdcSlider;
                  // Set initial value to match the input value
                  mdcSlider.setValue(
                    parseInt(slider.querySelector("input").value)
                  );
                });
            } else {
              // Classic Looper Off
              looperControls.classList.remove("visible");
            }
          }

          // Handle Manipulate card toggles
          if (ccNumber === 65 || ccNumber === 66) {
            const buttonRow = e.currentTarget.closest(".button-row");
            buttonRow.querySelectorAll("button").forEach((btn) => {
              btn.classList.remove("active");
            });
            e.currentTarget.classList.add("active");
          }

          const myOutput = WebMidi.getOutputByName("DL4 MkII");
          const myChannel = myOutput.channels[1];
          myChannel.sendControlChange(ccNumber, ccValue);
          console.log(`Sent CC${ccNumber} value ${ccValue}`);
        });
      });
  }

  // E - Summary Feature and Component Initialization

  function setupSummaryFeature() {
    const showSummaryButton = document.getElementById("showSummaryButton");
    const showSummaryNav = document.getElementById("showSummaryNav");
    const summaryDialog = document.getElementById("summaryDialog");
    const closeSummaryButton = document.getElementById("closeSummaryButton");

    function getSummary() {
      const summary = {
        preset: document.querySelector("#presets .mdc-select__selected-text")
          .textContent,
        delay: {
          model: document.querySelector("#delays .mdc-select__selected-text")
            .textContent,
          time: document.querySelector(
            '[data-cc="11"] .mdc-slider__value-indicator-text'
          ).textContent,
          subdivision: document.querySelector(".subdivision-label").textContent,
          repeats: document.querySelector(
            '[data-cc="13"] .mdc-slider__value-indicator-text'
          ).textContent,
          tweak: {
            parameter: document.querySelector("#delays .tweak").textContent,
            value: document.querySelector(
              '[data-cc="14"] .mdc-slider__value-indicator-text'
            ).textContent,
          },
          tweez: {
            parameter: document.querySelector("#delays .tweez").textContent,
            value: document.querySelector(
              '[data-cc="15"] .mdc-slider__value-indicator-text'
            ).textContent,
          },
          mix: document.querySelector(
            '[data-cc="16"] .mdc-slider__value-indicator-text'
          ).textContent,
        },
        reverb: {
          model: document.querySelector("#reverbs .mdc-select__selected-text")
            .textContent,
          decay: document.querySelector(
            '[data-cc="17"] .mdc-slider__value-indicator-text'
          ).textContent,
          tweak: {
            parameter: document.querySelector("#reverbs .tweak").textContent,
            value: document.querySelector(
              '[data-cc="18"] .mdc-slider__value-indicator-text'
            ).textContent,
          },
          mix: document.querySelector(
            '[data-cc="20"] .mdc-slider__value-indicator-text'
          ).textContent,
          routing: document
            .querySelector(".segment-button.active")
            .textContent.trim(),
        },
      };

      return `
          <section>
              <p>These are the current on-screen settings. They may not be identical to the settings on the pedal, eg. if they have not been edited or the preset has been changed. All numbers are MIDI values.</p>
              <h4>Preset</h4>
              <ul>
                  <li>${summary.preset || "None selected"}</li>
              </ul>
          </section>
          
          <section>
              <h4>Delay</h4>
              <ul>
                  <li>Model: ${summary.delay.model || "None selected"}</li>
                  <li>Time: ${summary.delay.time || "63"}</li>
                  <li>Subdivision: ${summary.delay.subdivision || "1/4"}</li>
                  <li>Repeats: ${summary.delay.repeats || "63"}</li>
                  <li>${summary.delay.tweak.parameter}: ${
        summary.delay.tweak.value || "63"
      }</li>
                  <li>${summary.delay.tweez.parameter}: ${
        summary.delay.tweez.value || "63"
      }</li>
                  <li>Mix: ${summary.delay.mix || "63"}</li>
              </ul>
          </section>
          
          <section>
              <h4>Reverb</h4>
              <ul>
                  <li>Model: ${summary.reverb.model || "None selected"}</li>
                  <li>Decay: ${summary.reverb.decay || "63"}</li>
                  <li>${summary.reverb.tweak.parameter}: ${
        summary.reverb.tweak.value || "63"
      }</li>
                  <li>Mix: ${summary.reverb.mix || "63"}</li>
                  <li>Routing: ${summary.reverb.routing}</li>
              </ul>
          </section>
      `;
    }

    function showSummary() {
      document.getElementById("summaryText").innerHTML = getSummary();
      summaryDialog.classList.add("visible");
      document.querySelector(".backdrop").classList.add("visible");

      // If on mobile, close the sidenav
      if (window.innerWidth <= 768) {
        document.querySelector(".sidenav").classList.remove("open");
      }
    }

    function closeSummary() {
      summaryDialog.classList.remove("visible");
      document.querySelector(".backdrop").classList.remove("visible");
    }

    function setupSyncButton() {
      const syncButton = document.getElementById("syncButton");

      syncButton.addEventListener("click", () => {
        const myOutput = WebMidi.getOutputByName("DL4 MkII");
        const myChannel = myOutput.channels[1];

        try {
          // Get current values using MDC slider instances
          const getSliderValue = (cc) => {
            const slider = document.querySelector(`[data-cc="${cc}"]`);
            if (slider && slider.mdcSliderInstance) {
              return Math.min(
                127,
                Math.max(0, Math.round(slider.mdcSliderInstance.getValue()))
              );
            }
            return 63; // Default value
          };

          // Get delay model
          const delaySelect = new mdc.select.MDCSelect(
            document.querySelector("#delays .mdc-select")
          );
          const delayModelIndex =
            delaySelect.value !== "" ? parseInt(delaySelect.value) : null;

          // Get reverb model
          const reverbSelect = new mdc.select.MDCSelect(
            document.querySelector("#reverbs .mdc-select")
          );
          const reverbModelIndex =
            reverbSelect.value !== "" ? parseInt(reverbSelect.value) : null;

          // Get routing value
          const routingValue =
            parseInt(
              document.querySelector(".segment-button.active")?.dataset.value
            ) || 0;

          // Send delay model selection if one is selected
          if (delayModelIndex !== null) {
            myChannel.sendControlChange(1, delayModelIndex);
          }

          // Always send delay parameters
          myChannel.sendControlChange(11, getSliderValue(11)); // Time
          myChannel.sendControlChange(12, getSliderValue(12)); // Subdivision
          myChannel.sendControlChange(13, getSliderValue(13)); // Repeats
          myChannel.sendControlChange(14, getSliderValue(14)); // Tweak
          myChannel.sendControlChange(15, getSliderValue(15)); // Tweez
          myChannel.sendControlChange(16, getSliderValue(16)); // Mix

          // Send reverb model selection if one is selected
          if (reverbModelIndex !== null) {
            myChannel.sendControlChange(2, reverbModelIndex);
          }

          // Always send reverb parameters
          myChannel.sendControlChange(17, getSliderValue(17)); // Decay
          myChannel.sendControlChange(18, getSliderValue(18)); // Tweak
          myChannel.sendControlChange(19, routingValue); // Routing
          myChannel.sendControlChange(20, getSliderValue(20)); // Mix

          console.log("Settings synced:", {
            delay: {
              model: delayModelIndex,
              time: getSliderValue(11),
              subdivision: getSliderValue(12),
              repeats: getSliderValue(13),
              tweak: getSliderValue(14),
              tweez: getSliderValue(15),
              mix: getSliderValue(16),
            },
            reverb: {
              model: reverbModelIndex,
              decay: getSliderValue(17),
              tweak: getSliderValue(18),
              routing: routingValue,
              mix: getSliderValue(20),
            },
          });

          // Show success feedback
          syncButton.disabled = true;
          syncButton.textContent = "Settings Synced!";
          setTimeout(() => {
            syncButton.disabled = false;
            syncButton.innerHTML = `
              <span class="mdc-button__ripple"></span>
              <span class="mdc-button__label">Sync</span>
            `;
          }, 2000);
        } catch (error) {
          console.error("Error syncing settings:", error);
          syncButton.textContent = "Sync Error!";
          setTimeout(() => {
            syncButton.disabled = false;
            syncButton.innerHTML = `
              <span class="mdc-button__ripple"></span>
              <span class="mdc-button__label">Sync</span>
            `;
          }, 2000);
        }
      });
    }

    // Set up event listeners
    setupSyncButton();
    showSummaryButton.addEventListener("click", showSummary);
    showSummaryNav.addEventListener("click", (e) => {
      e.preventDefault();
      showSummary();
    });
    closeSummaryButton.addEventListener("click", closeSummary);

    // Close on backdrop click
    document.querySelector(".backdrop").addEventListener("click", closeSummary);
  }

  // Component initialization
  function initializeMDCComponents() {
    document.querySelectorAll(".mdc-slider").forEach((slider) => {
      const mdcSlider = mdc.slider.MDCSlider.attachTo(slider);
      slider.mdcSliderInstance = mdcSlider;
    });

    setupTimeSubdivisionSlider();
    setupRoutingButtons();
  }

  // Initialize everything
  generatePresetDropdown();
  generateDelayDropdown();
  generateReverbDropdown();
  initializeMDCComponents();
  setupSliderListeners();
  setupLooperButtons();
  setupNavigation();
  setupSummaryFeature();
}
