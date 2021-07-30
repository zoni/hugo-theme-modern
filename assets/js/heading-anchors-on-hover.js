function addHeadingAnchors() {
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  for (let heading of headings) {
    if (heading.id == "") {
      continue;
    }
    let link = document.createElement('a');
    link.appendChild(document.createTextNode(""));
    link.title = "Permanent link to this heading"
    link.href = "#" + heading.id;
    link.classList.add("header-link");
    heading.appendChild(link);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addHeadingAnchors);
} else {
  addHeadingAnchors();
}
