import { getDocument } from "pdfjs-dist";

export async function getChunkedDocsFromPDF(pdfFile: File): Promise<string[]> {
  try {
    const fileReader = new FileReader();
    const pdfData = await new Promise<ArrayBuffer>((resolve, reject) => {
      fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(pdfFile);
    });
    const pdf = await getDocument({ data: pdfData }).promise;

    const chunkedDocs: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      // Process text content of the page and chunk it as needed
      // Add chunked text content to chunkedDocs array
      console.log(textContent);
      chunkedDocs.push();
    }
    console.log(chunkedDocs);
    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("Error while splitting the PDF into chunks. Please check the PDF file and try again.");
  }
}
