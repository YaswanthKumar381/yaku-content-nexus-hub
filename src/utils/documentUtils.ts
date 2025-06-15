
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  console.log(`Extracting text from ${file.name} of type ${fileType}`);

  if (fileType === 'application/pdf') {
    const pdfjsLib = await import('pdfjs-dist/build/pdf');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) return reject(new Error("Failed to read file"));
        try {
          const pdf = await pdfjsLib.getDocument({ data: event.target.result as ArrayBuffer }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(' ');
            text += '\n';
          }
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  } else if (fileType === 'text/csv' || fileType === 'text/plain') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  } else {
    return Promise.resolve(`Content extraction not supported for ${file.type}`);
  }
};
