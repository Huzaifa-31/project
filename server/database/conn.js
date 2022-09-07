const mongoose = require("mongoose");
const DataBase = process.env.DATABASE;
mongoose
  .connect(DataBase, {})
  .then(() => {
    console.log("connection successfuly");
  })
  .catch((err) => console.log(`no connection`));
