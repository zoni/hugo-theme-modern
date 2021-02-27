// Code adapted from https://palant.info/2020/06/04/the-easier-way-to-use-lunr-search-with-hugo/

function getSearchTermFromLocation() {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == 'q') {
      return decodeURIComponent(sParameterName[1].replace(/\+/g, '%20'));
    }
  }
}

function joinUrl (base, path) {
  if (path.substring(0, 1) === "/") {
    // path starts with `/`. Thus it is absolute.
    return path;
  }
  if (base.substring(base.length-1) === "/") {
    // base ends with `/`
    return base + path;
  }
  return base + "/" + path;
}

// This matches Hugo's own summary logic:
// https://github.com/gohugoio/hugo/blob/b5f39d23b8/helpers/content.go#L543
function truncate(text, minWords) {
  var match;
  var result = "";
  var wordCount = 0;
  var regexp = /(\S+)(\s*)/g;
  while (match = regexp.exec(text))
  {
    wordCount++;
    if (wordCount <= minWords)
      result += match[0];
    else
    {
      var char1 = match[1][match[1].length - 1];
      var char2 = match[2][0];
      if (/[.?!"]/.test(char1) || char2 == "\n")
      {
        result += match[1];
        break;
      }
      else
        result += match[0];
    }
  }
  return result;
}

function debounce(cb, interval, immediate) {
  var timeout;

  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) cb.apply(context, args);
    }

    var callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, interval);

    if (callNow) cb.apply(context, args);
  }
}

window.addEventListener("DOMContentLoaded", function(event) {
  var index = null;
  var lookup = null;
  var queuedTerm = null;

  var form = document.getElementById("search-form");
  var input = document.getElementById("search-input");
  var results_container = document.getElementById("search-results-container");

  form.addEventListener("keyup", debounce(function(event) {
    event.preventDefault();

    var term = input.value.trim();
    if (!term) {
      clearResults();
      return;
    }

    startSearch(term);
  }, 350), false);

  var term = getSearchTermFromLocation();
  if (term) {
    input.value = term;
    startSearch(term);
  }

  function startSearch(term) {
    // Start icon animation.
    form.setAttribute("data-running", "true");

    if (index) {
      // Index already present, search directly.
      search(term);
    } else if (queuedTerm) {
      // Index is being loaded, replace the term we want to search for.
      queuedTerm = term;
    } else {
      // Start loading index, perform the search when done.
      queuedTerm = term;
      initIndex();
    }
  }

  function searchDone() {
    // Stop icon animation.
    form.removeAttribute("data-running");

    queuedTerm = null;
  }

  function initIndex() {
    var request = new XMLHttpRequest();
    request.open("GET", "/index.json");
    request.responseType = "json";
    request.addEventListener("load", function(event) {
      lookup = {};
      index = lunr(function() {
        // Uncomment the following line and replace de by the right language
        // code to use a lunr language pack.

        // this.use(lunr.de);

        this.ref("uri");

        // If you added more searchable fields to the search index, list them here.
        this.field("title");
        this.field("content");
        this.field("description");
        this.field("categories");

        for (var doc of request.response)
        {
          this.add(doc);
          lookup[doc.uri] = doc;
        }
      });

      // Search index is ready, perform the search now
      search(queuedTerm);
    }, false);
    request.addEventListener("error", searchDone, false);
    request.send(null);
  }

  function search(term) {
    var results = index.search(term);
    clearResults();

    var title = document.createElement("h2");
    title.id = "search-results";
    title.className = "list-title";

    if (results.length == 0)
      title.textContent = `No results found for “${term}”`;
    else if (results.length == 1)
      title.textContent = `Found one result for “${term}”`;
    else
      title.textContent = `Found ${results.length} results for “${term}”`;
    results_container.appendChild(title);
    document.title = title.textContent;

    var template = document.getElementById("search-result");
    for (var result of results) {
      var doc = lookup[result.ref];

      // Fill out search result template, adjust as needed.
      var element = template.content.cloneNode(true);
      element.querySelector(".search-result-title-ref").href = doc.uri;
      element.querySelector(".search-result-title-ref").textContent = doc.title;
      element.querySelector(".search-result-summary").textContent = doc.description;
      results_container.appendChild(element);
    }
    //title.scrollIntoView(true);

    searchDone();
  }

  function clearResults() {
    while (results_container.firstChild)
      results_container.removeChild(results_container.firstChild);
  }


}, false);
