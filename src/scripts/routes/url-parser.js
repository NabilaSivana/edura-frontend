// const UrlParser = {
//   parseActiveUrlWithCombiner() {
//     let url = window.location.hash.slice(1).toLowerCase(); // "/reset-password?token=abc123"

//     // Hapus query string dari URL (semua setelah '?')
//     if (url.includes("?")) {
//       url = url.split("?")[0]; // jadi "/reset-password"
//     }

//     const urlSplits = this._urlSplitter(url);
//     const pathSegments = urlSplits.filter((segment) => segment);
//     return "/" + pathSegments.join("/");
//   },

//   _urlSplitter(url) {
//     return url.split("/");
//   },
// };

// export default UrlParser;
const UrlParser = {
  parseActiveUrlWithCombiner() {
    let url = window.location.hash.slice(1).toLowerCase(); // "/reset-password?token=abc123"

    // Handle empty hash - default to root
    if (!url || url === '') {
      return "/";
    }

    // Hapus query string dari URL (semua setelah '?')
    if (url.includes("?")) {
      url = url.split("?")[0]; // jadi "/reset-password"
    }

    const urlSplits = this._urlSplitter(url);
    const pathSegments = urlSplits.filter((segment) => segment);

    // Jika tidak ada segments, return root
    if (pathSegments.length === 0) {
      return "/";
    }

    return "/" + pathSegments.join("/");
  },

  _urlSplitter(url) {
    return url.split("/");
  },

  // Helper method to get query parameters from hash
  getQueryParams() {
    const hash = window.location.hash;
    if (!hash.includes("?")) {
      return {};
    }

    const queryString = hash.split("?")[1];
    const params = new URLSearchParams(queryString);
    const result = {};

    for (const [key, value] of params.entries()) {
      result[key] = value;
    }

    return result;
  },

  // Helper method to get specific query parameter
  getQueryParam(paramName) {
    const params = this.getQueryParams();
    return params[paramName] || null;
  }
};

export default UrlParser;