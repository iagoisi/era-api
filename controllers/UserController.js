const mongoose = require("mongoose");
const User = mongoose.model("User");
const sendEmailRecovery = require("../helpers/email-recovery");

class UserController {

  //GET
  index(req, res, next) {
    User.findById(req.payload.id).then(user => {
      if(!user) return res.status(401).json({ errors: "Usuário não resgistrado" });
      return res.json({ user: user.sendAuthJSON() });
    }).catch(next);
  }

  

  // GET /:id
  show(req, res, next) {
    User.findById(req.params.id)
    .populate({ path: "loja" })
    .then(user => {
      if(!user) return res.status(401).json({ errors: "Usuário não resgistrado" });
      return res.json({
        user: {
          nome: user.nome,
          email: user.email,
          permission: user.permission,
          loja: user.loja
        }
      });
    }).catch(next);
  }

  // POST /registrar

  store(req, res, next) {
    const { nome, email, password, loja } = req.body;

    const user = new User({ nome, email, loja });
    user.setSenha(password)

    user.save()
    .then(() => res.json({ user: user.sendAuthJSON() }))
    .catch(next);
  }


  // PUT /
  update(req, res, next) {
    const { nome, email, password } = req.body;
    User.findById(req.payload.id).then((user) => {
      if(!user) return res.status(401).json({ errors: "Usuário não registrado" });
      if(typeof nome !== "undefined") user.nome = nome;
      if(typeof email !== "undefined") user.email = email;
      if(typeof password !== "undefined") user.setSenha(password);

      return user.save().then(() => {
        return res.json({ user: user.sendAuthJSON() });
      }).catch(next);
    }).catch(next);
  }

  // DELETE /
  remove(req, res, next) {
    User.findById(req.payload.id).then(user => {
      if(!user) return res.status(401).json({ errors: "Usuário não registrado" });
      return user.remove().then(() => {
        return res.json({ deleted: true });
      }).catch(next);
    }).catch(next);
  }


  // POST /login
  login(req, res, next) {
    const { email, password } = req.body;
    User.findOne({ email }).then((user) => {
      if(!user) return res.status(401).json({ errors: "Usuário não registrado" });
      if(!user.validarSenha(password)) return res.status(401).json({ errors: "Senha invalida" });
      return res.json({ user: user.sendAuthJSON() });
    }).catch(next);

  }


  // RECOVERY

  // GET /recuperar-senha
  showRecovery(req, res, next) {
    return res.render("recovery", { error: null, success: null });
  }

  // POST /recuperar-senha
  createRecovery(req, res, next) {
    const { email } = req.body;
    if(!email) return res.render("recovery", { errors: "Preencha com seu e-mail", success: null });

    User.findOne({ email }).then((user) => {
      if(!user) return res.render("recovery", { error: "Não existe usuário com esse e-mail", success: null });
      const recoveryData = user.criarTokenRecuperacaoSenha();
      return user.save().then(() => {
        sendEmailRecovery({ user, recovery: recoveryData }, (error = null, success = null) => {
            return res.render("recovery", { error, success });
          });
      }).catch(next);
    }).catch(next);

  }

  // GET /senha-recuperada
  showCompleteRecovery(req, res, next) {
    if(!req.query.token) return res.render("recovery", { error: "Token não identificado", success: null });
    User.findOne({ "recovery.token": req.query.token }).then(user => {
      if(!user) return res.render("recovery", { error: "Não existe usuário com este token", success: null });
      if( new Date(user.recovery.date) < new Date() ) return res.render("recovery", { error: "Token expirado, tente novamente", success: null });
      return res.render("recovery/store", { error: null, success: null, token: req.query.token });
    }).catch(next);
  }


  // POST /senha-recuperada
  showCompleteRocovery(req, res, next) {
    const { token, password } = req.body;
    if(!token || !password) return res.render("recovery/store", { error: "Preencha novamente com sua nova senha", sucess: null, token: token })
    User.findOne({ "recovery.token": token }).then(user => {
      if(!user) return res.render("recovery", { error: "Usuário não identificado", sucess: null });

      user.finalizarTokenRecuperacaoSenha();
      user.setSenha(password);
      return user.save().then(() => {
        return res.render("recovery/store", {
          error: null,
          sucess: "Senha alterada com sucesso. Tenha fazer novamente login.",
          token: null,
        })
      }).catch(next);
    });
  }
}


module.exports = UserController;
