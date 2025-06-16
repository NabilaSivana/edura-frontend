const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase(); // hapus '#'
    const urlSplits = this._urlSplitter(url);

    // Hanya ambil segmen yang valid, lalu gabung
    const pathSegments = urlSplits.filter((segment) => segment); // buang kosong
    return "/" + pathSegments.join("/"); // join tanpa double slash
  },

  _urlSplitter(url) {
    return url.split("/"); // hasil: ['login'], ['dashboard', '1'], dll.
  },
};

export default UrlParser;
