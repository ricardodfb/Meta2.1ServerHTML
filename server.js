const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const queryParams = querystring.parse(parsedUrl.query);
  const method = req.method;
  const headers = req.headers;

  res.setHeader('Content-Type', 'text/html');

  let responseBody = '<html><body>';
  responseBody += `<h1>Request headers:</h1><pre>${JSON.stringify(headers, null, 2)}</pre>`;
  responseBody += `<h1>Metodo: ${method}</h1>`;
  responseBody += `<h1>URL: ${parsedUrl.pathname}</h1>`;

  if (method === 'GET') {
    responseBody += `<h1>Query Parameters:</h1><pre>${JSON.stringify(queryParams, null, 2)}</pre>`;
  } else if (method === 'POST') {
    let postData = '';
    req.on('data', (chunk) => {
      postData += chunk;
    });

    req.on('end', () => {
      const parsedPostData = querystring.parse(postData);
      responseBody += `<h1>Datos enviados:</h1><pre>${JSON.stringify(parsedPostData, null, 2)}</pre>`;
      responseBody += '</body></html>';
      res.end(responseBody);
    });
  } else {
    responseBody += '<p>Método no soportado.</p>';
    responseBody += '</body></html>';
    res.statusCode = 405;
    res.end(responseBody);
  }

  res.end(responseBody);
});

const port = 4000;
server.listen(port, () => {
  console.log(`Servidor HTTP escuchando en el puerto ${port}`);
});
