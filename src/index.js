let pdfjsLib = window['pdfjs-dist/build/pdf'];

window.extractText = async (json) => {
  let blob = dataURItoBlob("data:application/pdf;base64, " + json);
  let objectURL = URL.createObjectURL(blob);
  const result = await getItems(objectURL);
  FileMaker.PerformScriptWithOption("GetResult", result, 5);
}

async function getContent(src) {
  const doc = await pdfjsLib.getDocument(src).promise;
  const page = await doc.getPage(1);
  return await page.getTextContent();
}

async function getItems(src) {
  // Perform checks
  const content = await getContent(src);
  /**
   * Expect content.items to have the following structure
   * [{
   *  str: '1',
   *  dir: 'ltr',
   *  width: 4.7715440000000005,
   *  height: 9.106,
   *  transform: [ 9.106, 0, 0, 9.106, 53.396, 663.101 ],
   *  fontName: 'g_d0_f2'
   * }, ...]
   */

  // you can do the following on content.items
  return content.items.map((item) => item.str);
  // This is a new array of strings from the str property
  // Expected output: ['1', '06/02/2013', '$1,500.00', 'job 1, check 1', 'yes', 'deposit',...]
}

function dataURItoBlob(dataURI)
{
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;

    if(dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for(let i = 0; i < byteString.length; i++)
    {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
}
