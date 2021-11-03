const mongoose = require("mongoose");

const User = mongoose.model("User");
const Loja = mongoose.model("Loja");

module.exports = (req, res, next) => {
    if(!req.payload.id) return res.sendStatus(401);
    const { loja } = req.query;
    if(!loja) return res.sendStatus(401);
    User.findById(req.payload.id).then(user => {
      if(!user) return res.sendStatus(401);
      if(!user.loja) return res.sendStatus(401);
      if(!user.permission.includes("admin")) return res.sendStatus(401);
      if(!user.loja.toString() !== loja) return res.sendStatus(401);
      next();
  }).catch(next);
}