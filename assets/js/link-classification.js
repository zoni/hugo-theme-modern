function markExternalLinks() {
  const links = document.querySelectorAll("a");

  for (let link of links) {
    if (link.hostname === location.hostname) {
      continue;
    }
    //link.target = "_blank";
    link.rel = "external noopener";
    link.classList.add("external");
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', markExternalLinks);
} else {
  markExternalLinks();
}
