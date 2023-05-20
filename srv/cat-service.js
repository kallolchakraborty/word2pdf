const cds = require("@sap/cds");
const { request } = require("hdb/lib/protocol");
const log = require('cf-nodejs-logging-support');

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const PDFDocument = require('pdfkit');

module.exports = cds.service.impl(async (srv) => {

    srv.on("convertDoc", async (req) => {
        log.info('log: entering the action!');

        //.docx file path
        const docxFilePath = '/home/user/projects/word2pdf/docs/sampleDocument.docx';

        //timestamp
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();

        //custom dynamic watermark
        const watermarkText = 'watermark: Kallol Chakraborty:' + date + '-' + month + '-' + year;

        mammoth.extractRawText({ path: docxFilePath })
            .then((result) => {
                const rawText = result.value.trim();

                //.pdf file path(output)
                const pdfFilePath = '/home/user/projects/word2pdf/docs/sampleDocument.pdf';

                //create PDF document and set watermark
                const pdfDoc = new PDFDocument();
                pdfDoc.pipe(fs.createWriteStream(pdfFilePath));
                pdfDoc.fontSize(12).text(rawText, 50, 50);

                //adding watermark
                pdfDoc.fontSize(12).opacity(0.2).fillColor('black').text(watermarkText, {
                    width: pdfDoc.page.width,
                    height: pdfDoc.page.height,
                    align: 'center',
                    valign: 'center',
                    rotate: -45
                });

                pdfDoc.end();

                log.info('log: exiting the function: "convertDoc" without error!');
                return 'File converted successfully!';
            })
            .catch((error) => {
                log.error();
                return req.error(500, 'An error occurred while converting the file.');
            });
    });
});
