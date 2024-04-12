export async function extractText(url) {
  let alltext;
  try {
    let pdf = await pdfjsLib.getDocument(url).promise; //  Get the PDF document without password
    let pages = pdf.numPages; // Get the total number of pages in the PDF

    for (let i = 1; i <= pages; i++) {
      let page = await pdf.getPage(i); // Get the page object for each page
      let txt = await page.getTextContent(); // Get the text content of the page
      let text = txt.items.map((s) => s.str).join(""); // Concatenate the text items into a single string
      alltext.push(text); // Add the extracted text to the array
    }
    alltext.map((e, i) => {
      select.innerHTML += `<option value="${i + 1}">${i + 1}</option>`; // Add options for each page in the page selection dropdown
    });
    afterProcess(); // Display the result section
  } catch (err) {
    console.log("bruh");
    alert(err.message);
    alltext;
  }
}

function afterProcess() {
  pdftext.value = alltext[select.value - 1]; // Display the extracted text for the selected page
  download.href =
    "data:text/plain;charset=utf-8," +
    encodeURIComponent(alltext[select.value - 1]); // Set the download link URL for the extracted text
  afterupload.style.display = "flex"; // Display the result section
  document.querySelector(".another").style.display = "unset"; // Display the "Extract Another PDF" button
}
