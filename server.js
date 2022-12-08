const mongoose = require("mongoose");
const app = require("./app");
const config = require("./src/configs/index");

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URL);
    console.log("Database has been connected successfully");

    app.on("error", (err) => {
      console.log("Error", err);
      throw err;
    });

    const onListening = () => {
      console.log(`Server is listening on ${config.PORT}`);
    };

    app.listen(config.PORT, onListening);
  } catch (err) {
    console.log("Error", err);
  }
})();
