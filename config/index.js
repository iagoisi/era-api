module.exports = {
  secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "LKJAHSDFLKJHASD0978304982LNSDFLKJSDA09102983LNASO9AUJPOSA8HAS",
  api: process.env.NODE_ENV === "production" ? "https://api.loja-teste.ampliee.com" : "htpp://localhost: 3000",
  loja: process.env.NODE_ENV === "production" ? "https://loja-teste.ampliee.com" : "htpp://localhost: 8000",
}