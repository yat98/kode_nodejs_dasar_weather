import web from "../src/app/web.js";
import 'dotenv/config';

const port = process.env.PORT;

web.listen(port, () => {
  console.info(`App start with port ${port}`);
});