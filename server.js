const express = require("express");
const path = require("path");
const app = express();

app.listen(3000, () => console.log("listening at 3000..."));

app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

app.use("/cart.html", express.static(path.resolve(__dirname, "public", "cart.html")));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
