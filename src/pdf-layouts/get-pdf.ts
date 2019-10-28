import { getHead } from './get-head';

interface GetPdfOptions {
  headData?: string;
  bodyData?: string;
}

export const getPdf = (options?: GetPdfOptions) => {
  const { headData = '', bodyData = 'hi' } = options;
  return `<!doctype html>
    <html lang="en">
      <head>${getHead(headData)}</head>
      <body>
        ${bodyData}
      </body>
    </html>`;
};
