chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze_page") {
    const headings = {};
    ['h1','h2','h3','h4','h5','h6'].forEach(tag => {
      headings[tag] = document.querySelectorAll(tag).length;
    });

    const images = Array.from(document.querySelectorAll('img'));
    const imageCount = images.length;
    const imagesWithoutAlt = images.filter(img => !img.hasAttribute('alt') || img.getAttribute('alt') === '');

    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'Yok';
    const pageLang = document.documentElement.lang || "Belirtilmemiş";
    const isMobileFriendly = !!document.querySelector('meta[name="viewport"]');
    const hasFavicon = !!document.querySelector('link[rel~="icon"]') || !!document.querySelector('link[rel="shortcut icon"]');

    const perf = performance.getEntriesByType("navigation")[0];
    const loadTime = perf ? Math.round(perf.loadEventEnd - perf.startTime) : "Hesaplanamadı";

    sendResponse({
      headings,
      imageCount,
      imagesWithoutAlt: imagesWithoutAlt.map(img => img.src),
      title,
      description,
      pageLang,
      isMobileFriendly,
      hasFavicon,
      loadTime
    });

    return true;
  }
});
