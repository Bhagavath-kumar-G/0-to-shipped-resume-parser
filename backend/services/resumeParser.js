
const { PDFParse } = require("pdf-parse");

async function extractResumeText(fileBuffer) {
  const parser = new PDFParse({
    data: fileBuffer
  });

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

module.exports = { extractResumeText };
