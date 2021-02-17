const pdfDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
// const ejs = require('ejs');
const xlsxFile = require("read-excel-file/node");
const csv = require("csv-parser");
const { jsPDF } = require("jspdf");
// const htmlPdf = require('html-pdf');

module.exports = {
  getPdf: async (req, res, next) => {
    const doc = new pdfDocument();

    doc.pipe(
      fs.createWriteStream(
        path.join(__dirname, "../pdfs/output") + Math.random() * 1000 + ".pdf"
      )
    );

    // Embed a font, set the font size, and render some text
    doc
      .fontSize(25)
      .text(
        `thanks for purchasing this item, your ref id is 0504056049604`,
        100,
        100
      )
      .fillColor("red");

    // Add an image, constrain it to a given size, and center it vertically and horizontally
    doc.image("download.jpg", {
      fit: [250, 300],
      align: "center",
      valign: "center",
    });

    // Finalize PDF file
    doc.end();
    res.json({ message: "pdf" });
  },

  getPdfTwo: async (req, res, next) => {
    // const doc = new jsPDF();
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [4, 2],
    });
    doc.text("Hello world!", 1, 1);
    doc.save("f4.pdf");

    res.json({ messgae: "pdf" });
  },

  getExcel: async (req, res, next) => {
    const schema = {
      name: {
        prop: "names",
        type: String,
      },
      age: {
        prop: "allAge",
        type: Number,
      },
    };

    const { rows, errors } = await xlsxFile("./excel/Book1.xlsx", { schema });
    if (errors.length > 0)
      return res.status(400).json({ message: "error reading file" });

    let data = {};
    rows.forEach((arr) => {
      data = { ...data, [arr.names]: arr.allAge };
    });

    res.json({ message: "excel", data });
  },

  getCSV: async (req, res, next) => {
    const data = [];

    fs.createReadStream("file.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        res.json({ message: "CSV file successfully processed", data });
      });
  },
  htmlToPdf: (req, res, next) => {
    // const html = fs.readFileSync('./index.html', 'utf8');
    // var options = { format: 'Letter' };

    // htmlPdf.create(html, options).toFile(path.join(__dirname, `../pdfs/businesscard-${Math.random() * 999}.pdf`), function (err, data) {
    //     if (err) return console.log(err);
    //     console.log(data); // { filename: '/app/businesscard.pdf' }
    //     res.setHeader('Content-Type', 'application/pdf')
    //     res.send(data)

    // });

    res.json({ message: "html to pdf" });
  },
};
