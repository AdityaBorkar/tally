// // server.js
// const { createServer } = require("https");
// const httpsLocalhost = require("https-localhost")();
// const { parse } = require("url");
// const next = require("next");

// const dev = process.env.NODE_ENV !== "production";
// const hostname = "localhost";
// const port = 3000;
// // when using middleware `hostname` and `port` must be provided below
// const app = next({ dev, hostname, port });
// httpsLocalhost.getCerts().then((certs) => {
//   const handle = app.getRequestHandler();
//   app.prepare().then(() => {
//     createServer(certs, async (req, res) => {
//       try {
//         // Be sure to pass `true` as the second argument to `url.parse`.
//         // This tells it to parse the query portion of the URL.
//         const parsedUrl = parse(req.url, true);
//         const { pathname, query } = parsedUrl;

//         if (pathname === "/a") {
//           await app.render(req, res, "/a", query);
//         } else if (pathname === "/b") {
//           await app.render(req, res, "/b", query);
//         } else {
//           await handle(req, res, parsedUrl);
//         }
//       } catch (err) {
//         console.error("Error occurred handling", req.url, err);
//         res.statusCode = 500;
//         res.end("internal server error");
//       }
//     }).listen(port, (err) => {
//       if (err) throw err;
//       console.log(`> Ready on http://${hostname}:${port}`);
//     });
//   });
// });
const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const httpsOptions = {
  key: fs.readFileSync("./cert/localhost.key"),
  cert: fs.readFileSync("./cert/localhost.crt"),
};
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Server started on https://localhost:3000");
  });
});

// TODO - NEXT13 Compatibility
// app.all('/_next/webpack-hmr', (req, res) => {
//   nextjsRequestHandler(req, res)
// })
