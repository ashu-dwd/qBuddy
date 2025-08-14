import { PORT } from "./config/config.js";
import { app } from "./src/app.js";

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
