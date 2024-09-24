import app from "./app.js";;


// Iniciar el servidor
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
export { app };

