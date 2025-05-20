document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");

  // Send analysis request to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "analyze_page" }, async function (data) {
      if (!data) {
        output.innerText = "Page analysis failed.";
        return;
      }

      output.innerHTML = `
        <p><strong>Title:</strong> ${data.title}</p>
        <p><strong>Description:</strong> ${data.description}</p>

        <p><strong>Language Tag:</strong> ${data.pageLang}</p>
        <p><strong>Mobile Friendly:</strong> ${data.isMobileFriendly ? "✅ Yes" : "❌ No"}</p>
        <p><strong>Favicon:</strong> ${data.hasFavicon ? "✅ Present" : "❌ Missing"}</p>
        <p><strong>Page Load Time:</strong> ${data.loadTime} ms</p>

        <p><strong>Headings:</strong></p>
        <ul>
          ${Object.entries(data.headings).map(([tag, count]) => `<li>${tag}: ${count}</li>`).join("")}
        </ul>

        <p><strong>Total Images:</strong> ${data.imageCount}</p>
        <p><strong>Images Without Alt Attribute:</strong></p>
        ${
          data.imagesWithoutAlt.length
            ? `<ul>${data.imagesWithoutAlt.map(src => `<li>${src}</li>`).join("")}</ul>`
            : "<p>All images have alt attributes ✅</p>"
        }
      `;

      // Check robots.txt and sitemap.xml availability
      const checkFile = async (path) => {
        try {
          const res = await fetch(new URL(path, tabs[0].url));
          return res.status === 200 ? "✅ Available" : `❌ Not Found (${res.status})`;
        } catch (e) {
          return "❌ Error";
        }
      };

      const robotsStatus = await checkFile("/robots.txt");
      const sitemapStatus = await checkFile("/sitemap.xml");

      output.innerHTML += `
        <p><strong>robots.txt:</strong> ${robotsStatus}</p>
        <p><strong>sitemap.xml:</strong> ${sitemapStatus}</p>
      `;
    });
  });
});
