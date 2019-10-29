interface GetPdfOptions {
  bodyData?: string;
}

export const getPdf = (options?: GetPdfOptions) => {
  return `<!doctype html>
    <html lang="en">
      <body>
        ${(options && options.bodyData) || 'no data sent'}
      </body>
    </html>`;
};
