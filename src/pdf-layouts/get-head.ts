export const getHead = (data?: string) => `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400" rel="stylesheet">
<style>
  html,body {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    font-weight: 400;
    font-family: 'Open Sans', sans-serif;
    color: #9E9E9E;
  }
  body {
    padding: 20px;
  }
</style>${data}`;
