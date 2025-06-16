const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase(); // hapus '#'
    const urlSplits = this._urlSplitter(url);
    return `/${urlSplits[1] || ""}${urlSplits[2] ? `/${urlSplits[2]}` : ""}`;
  },

  _urlSplitter(url) {
    const urls = url.split("/");
    return ["", ...urls]; // padding supaya bisa akses index 1 dan 2
  }
};

export default UrlParser;