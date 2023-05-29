const http = require("http");
const app = require("./src/app");

const server = http.createServer(app);
// app.set('port',8080);
server.listen(8080, () => {
  console.log("Server started");
});
