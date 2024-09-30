// script.js

async function fetchWebsites() {
  try {
    const response = await fetch("http://localhost:5000/website"); // Adjust the URL if needed
    const websites = await response.json();
    document.getElementById("totalWebsites").innerText = websites.length;
    const websiteSelect = document.getElementById("websiteSelect");
    websiteSelect.innerHTML = '<option value="">Select a Website</option>'; // Reset options

    websites.forEach((website) => {
      const option = document.createElement("option");
      option.value = website.id; // Use the `id` property from your MongoDB document
      option.textContent = website.id + ".com"; // Customize the display text if needed
      websiteSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching websites:", error);
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchWebsites);

async function pageInfo() {
  const selectedWebsiteId = document.getElementById("websiteSelect").value;

  if (!selectedWebsiteId) return; // Return if no website is selected

  try {
    const response = await fetch(
      `http://localhost:5000/website/${selectedWebsiteId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    // Populate the form fields with the fetched data
    document.getElementById("commonSecClass").value = data.commonSecClass || "";
    document.getElementById("heading_class").value = data.heading_class || "";
    document.getElementById("ulClass").value = data.ulClass || "";
    document.getElementById("btnClasses").value = data.btnClasses || "";
    document.getElementById("imgBox").value = data.imgBox || "";
    document.getElementById("rowClass").value = data.rowClass || "";
    document.getElementById("imgCol").value = data.imgCol || "";
    document.getElementById("contCol").value = data.contCol || "";

    // Assuming these are part of your form and also stored in the database
    document.getElementById("includePhone").checked =
      data.includePhone || false;
    document.getElementById("includeContact").checked =
      data.includeContact || false;
    document.getElementById("includeReview").checked =
      data.includeReview || false;
    document.getElementById("optimizeImage").checked =
      data.optimizeImage || false;
    document.getElementById("useLazyload").checked = data.useLazyload || false;
    document.getElementById("withoutcontainer").checked =
      data.withoutContainer || false;
    document.getElementById("withoutHeadingClass").checked =
      data.withoutHeadingClass || false;
  } catch (error) {
    console.error("Error fetching website data:", error);
    // Handle error (e.g., show a message to the user)
  }
}

document
  .getElementById("toggleNightMode")
  .addEventListener("change", function () {
    document.body.classList.toggle("night-mode");
    console.log("hi");
    const modeButton = document.getElementById("toggleNightMode");
    if (document.body.classList.contains("night-mode")) {
      modeButton.textContent = "Day Mode";
    } else {
      modeButton.textContent = "Night Mode";
    }
  });

document.getElementById("year").textContent = new Date().getFullYear();

function transformHtml() {
  document.getElementById("copy-output").innerText = "Copy Output";
  const inputHtml = document.getElementById("inputHtml").value;
  const selectedStyle = document.getElementById("styleSelect").value;
  const commonSecClass =
    document.getElementById("commonSecClass").value.trim() || "common-sec";
  const ulClass = document.getElementById("ulClass").value.trim();
  const btnClasses =
    document.getElementById("btnClasses").value.trim() ||
    "common btn bg-danger";
  const heading_class =
    document.getElementById("heading_class").value.trim() || "common-heading";
  const includePhone = document.getElementById("includePhone").checked;
  const includeContact = document.getElementById("includeContact").checked;
  const includeReview = document.getElementById("includeReview").checked;
  const optimizeImage = document.getElementById("optimizeImage").checked;
  const useLazyload = document.getElementById("useLazyload").checked;
  const withoutContainer = document.getElementById("withoutcontainer").checked;
  const withoutHeadingClass = document.getElementById(
    "withoutHeadingClass"
  ).checked;
  const imgBox = document.getElementById("imgBox").value.trim() || "img-box";
  const rowClass =
    document.getElementById("rowClass").value.trim() ||
    "row align-items-center";
  const imgCol = document.getElementById("imgCol").value.trim() || "col-lg-6";
  const contCol = document.getElementById("contCol").value.trim() || "col-lg-6";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = inputHtml;
  const elements = tempDiv.children;
  let content = "";

  for (let element of elements) {
    if (element.tagName === "UL") {
      content += `<ul class="${ulClass}">${sanitizeHtml(
        element.innerHTML
      )}</ul>\n`;
    } else if (element.tagName === "P") {
      content += `<p>${sanitizeHtml(element.innerHTML)}</p>\n`;
    } else if (element.tagName.startsWith("H")) {
      content += `<${element.tagName.toLowerCase()}${
        withoutHeadingClass ? `>` : ` class="${heading_class}">`
      }${sanitizeHtml(element.innerHTML)}</${element.tagName.toLowerCase()}>\n`;
    }
  }

  if (includePhone) {
    content += `<a class="${btnClasses}" rel="nofollow" href="tel:##phone##">
  <i class="fa fa-phone"></i> ##phone##
  </a>\n`;
  }

  if (includeContact) {
    content += `<a class="${btnClasses}" rel="nofollow" href="/about-us/contact-us">
  Contact Us
  </a>\n`;
  }

  if (includeReview) {
    content += `<a class="${btnClasses}" rel="nofollow" href="/about-us/reviews">
  Reviews
  </a>\n`;
  }

  let imageHtml = "";

  if (optimizeImage) {
    if (useLazyload) {
      imageHtml = `
      <picture class="${imgBox}">
          <source media="(max-width:576px)" srcset="/images/optimized-small.jpg" />
          <source media="(max-width:991px)" srcset="/images/optimized-medium.jpg" />
          <img src="#" data-src="/images/optimized-large.jpg" class="lazyload" alt="" />
      </picture>`;
    } else {
      imageHtml = `
      <picture class="${imgBox}">
          <source media="(max-width:576px)" srcset="/images/optimized-small.jpg" />
          <source media="(max-width:991px)" srcset="/images/optimized-medium.jpg" />
          <img src="/images/optimized-large.jpg" alt="" />
      </picture>`;
    }
  } else {
    if (useLazyload) {
      imageHtml = `
      <div class="${imgBox}">
          <img class="lazyload" src="#" data-src="/images/.jpg" alt="" />
      </div>`;
    } else {
      imageHtml = `
      <div class="${imgBox}">
          <img src="/images/.jpg" alt="" />
      </div>`;
    }
  }
  let template = "";

  if (selectedStyle === "right") {
    if (withoutContainer) {
      template = `
      <div class="${commonSecClass}">
          <div class="${rowClass}">
              <div class="${imgCol} order-lg-last">
                  ${imageHtml}
              </div>
              <div class="${contCol}">
                  ${content}
              </div>
          </div>
      </div>`;
    } else {
      template = `
      <div class="${commonSecClass}">
          <div class="container">
              <div class="${rowClass}">
                  <div class="${imgCol} order-lg-last">
                      ${imageHtml}
                  </div>
                  <div class="${contCol}">
                      ${content}
                  </div>
              </div>
          </div>
      </div>`;
    }
  } else if (selectedStyle === "left") {
    if (withoutContainer) {
      template = `
      <div class="${commonSecClass}">
          <div class="${rowClass}">
              <div class="${imgCol}">
                  ${imageHtml}
              </div>
              <div class="${contCol}">
                  ${content}
              </div>
          </div>
      </div>`;
    } else {
      template = `
      <div class="${commonSecClass}">
          <div class="container">
              <div class="${rowClass}">
                  <div class="${imgCol}">
                      ${imageHtml}
                  </div>
                  <div class="${contCol}">
                      ${content}
                  </div>
              </div>
          </div>
      </div>`;
    }
  } else if (selectedStyle === "flot-left") {
    if (withoutContainer) {
      template = `
      <div class="${commonSecClass}">
          <div class="${imgBox} float-lg-left">
              <img src="/images/.jpg" alt="" />
          </div>
          ${content}
      </div>`;
    } else {
      template = `
      <div class="${commonSecClass}">
          <div class="container">
              <div class="${imgBox} float-lg-left">
                  <img src="/images/.jpg" alt="" />
              </div>
              ${content}
          </div>
      </div>`;
    }
  } else if (selectedStyle === "flot-right") {
    if (withoutContainer) {
      template = `
      <div class="${commonSecClass}">
          <div class="${imgBox} float-lg-right">
              <img src="/images/.jpg" alt="" />
          </div>
          ${content}
      </div>`;
    } else {
      template = `
      <div class="${commonSecClass}">
          <div class="container">
              <div class="${imgBox} float-lg-right">
                  <img src="/images/.jpg" alt="" />
              </div>
              ${content}
          </div>
      </div>`;
    }
  } else if (selectedStyle === "basic-sec") {
    if (withoutContainer) {
      template = `
      <div class="${commonSecClass}">
          ${content}
      </div>`;
    } else {
      template = `
      <div class="${commonSecClass}">
          <div class="container">
              ${content}
          </div>
      </div>`;
    }
  }
  document.getElementById("outputHtml").textContent = template;
}

function sanitizeHtml(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  Array.from(tempDiv.querySelectorAll("[style]")).forEach((el) =>
    el.removeAttribute("style")
  );
  Array.from(tempDiv.querySelectorAll("br")).forEach((el) => el.remove());
  Array.from(tempDiv.querySelectorAll("&")).forEach((el) => el.remove());

  tempDiv.innerHTML = tempDiv.innerHTML.replace(/&nbsp;/g, " ");

  return tempDiv.innerHTML;
}

function clearInput() {
  document.getElementById("inputHtml").value = "";
}

function copyOutput() {
  const outputHtml = document.getElementById("outputHtml").textContent;
  navigator.clipboard.writeText(outputHtml).then(() => {
    document.getElementById("copy-output").innerText = "Copied";
  });
}

function togglePageReload(preventReload) {
  window.addEventListener("beforeunload", preventUnload);
}

function preventUnload(event) {
  event.preventDefault();
}
togglePageReload(true);
