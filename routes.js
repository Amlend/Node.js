const fs = require("fs");

const requestHandler = (req, res) => {
  let url = req.url;
  let method = req.method;
  fs.readFile("message.txt", (err, messages) => {
    if (err) {
      console.error(err);
      messages = "";
    }
    if (url === "/") {
      res.write("<html>");
      res.write("<head><title>Enter Message</title></head>");
      res.write(
        `<body><p>${messages}</p><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>`
      );
      res.write("</html>");
      return res.end();
    }
    if (req.url === "/message" && method === "POST") {
      const body = [];
      req.on("data", (chunk) => {
        body.push(chunk);
      });
      return req.on("end", () => {
        const parsedBody = Buffer.concat(body).toString();
        let message = parsedBody.split("=")[1];
        fs.writeFile("message.txt", message, (err) => {
          res.statusCode = 302;
          res.setHeader("Location", "/");
          return res.end();
        });
      });
    }
  });
};

module.exports = requestHandler;
