using {word2pdf.db as db} from '../db/data-model';

service CatalogService @(path: '/api') {
    // function to convert .docx to .pdf file with dynamic watermark
    function convertDoc() returns String;
};
