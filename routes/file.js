const expressPromise = require("express-promise-router");
const router = expressPromise();
const {
  getPdf,
  getPdfTwo,
  getExcel,
  getCSV,
  htmlToPdf,
} = require("../controllers/file");

router.route("/").get(getPdf);
router.route("/2").get(getPdfTwo);
router.route("/excel").get(getExcel);
router.route("/csv").get(getCSV);
router.route("/htmltopdf").get(htmlToPdf);

module.exports = router;
