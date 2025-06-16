// const UrlParser = {
//   parseActiveUrlWithCombiner() {
//     const url = window.location.hash.slice(1).toLowerCase(); // hapus '#'
//     const urlSplits = this._urlSplitter(url);

//     // Hanya ambil segmen yang valid, lalu gabung
//     const pathSegments = urlSplits.filter((segment) => segment); // buang kosong
//     return "/" + pathSegments.join("/"); // join tanpa double slash
//   },

//   _urlSplitter(url) {
//     return url.split("/"); // hasil: ['login'], ['dashboard', '1'], dll.
//   },
// };

// export default UrlParser;
const UrlParser = {
  parseActiveUrlWithCombiner() {
    let url = window.location.hash.slice(1).toLowerCase(); // "/reset-password?token=abc123"

    // Hapus query string dari URL (semua setelah '?')
    if (url.includes("?")) {
      url = url.split("?")[0]; // jadi "/reset-password"
    }

    const urlSplits = this._urlSplitter(url);
    const pathSegments = urlSplits.filter((segment) => segment);
    return "/" + pathSegments.join("/");
  },

  _urlSplitter(url) {
    return url.split("/");
  },
};

export default UrlParser;
