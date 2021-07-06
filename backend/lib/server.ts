import app from "./config/app";
const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});
