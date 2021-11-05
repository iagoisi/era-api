const mongoose = require("mongoose");
const cliente = require("../models/cliente");

const Cliente = mongoose.model("Cliente");
const User = mongoose.model("User");

class ClienteController {



/**
 * 
 * 
 * ADMIN
 * 
 * 
 */


  // GET / index
  async index(req, res, next){
    try {
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 30;
      const clientes = await Cliente.paginate(
        { loja: req.query.loja },
        { offset, limit, populate: "user" }
      );
      return res.send({ clientes });
    } catch(e){
      next(e);
    }
  }

  // GET /search/:pedidos
  searchPedidos(req, res, next) {
    return res.status(400).send({ error: "Em desenvolvimento." });
  }

  // GET /search
  async search(req, res, next) {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 30;
    const search = new RegExp(req.params.search, "i");
    try {
      const clientes = await Cliente.paginate(
        { loja: req.query.loja, nome: { $regex: search } },
        { offset, limit, populate: "user" }
      );
      return res.send({ clientes });
    } catch(e){
      next(e);
    }
  }

  // GET /admin/:id
  async showAdmin(req, res, next) {
    try {
      const cliente = await Cliente.findOne({ _id: req.params.id, loja: req.query.loja }).populate("user");
      return res.send({ cliente });
    } catch(e) {
      next(e);
    }
  }


  // GET /admin/:id/pedidos
  showPedidosCliente(req, res, next) {
    return res.status(400).send({ error: "Em desenvolvimento." });
  }


  // PUT /admin/:id
  async updateAdmin(req, res, next) {
    const { nome, cpf, email, telefones,endereco, dataDeNascimento  } = req.body;
    try {
      const Cliente = await Cliente.findById(req.params.id).populate("user");
      if(nome) {
        cliente.user.nome = nome;
        cliente.nome = nome;
      }
      if(email) cliente.user.email = email;
      if(cpf) cliente.user.cpf = cpf;
      if(telefones) cliente.user.telefones = telefones;
      if(endereco) cliente.user.endereco = endereco;
      if(dataDeNascimento) cliente.user.dataDeNascimento = dataDeNascimento;
      await cliente.user.save();
      await cliente.save()
      return res.send({ cliente });
    } catch(e) {
      next(e);
    }
  }


/**
 * 
 * 
 * CLIENTE
 * 
 * 
 */

  // GET
  async show(req, res, next) {
    try{
      const cliente = await Cliente.findOne({ user: req.payload.id, loja: req.query.loja }).populate("user");
      return res.send({ cliente })
    } catch(e) {
      next(e);
    }
  }

  // POST CRIACAO DE UM CLIENTE
  async store(req, res, next) {
    const { nome, email, cpf, telefones, endereco,dataDeNascimento, password } =  req.body;
    const { loja } = req.query;

    const user = new User({ nome, email, loja });
    user.setSenha(password);
    const cliente = new Cliente({ nome, cpf, telefones, loja, dataDeNascimento, user: user._id });

    try {
      await user.save();
      await cliente.save();

      return res.send({ cliente: Object.assingn({}, cliente._doc, {email: user.email }) });
    } catch(e) {
      next(e);
    }
  }

  // PUT ATUALIZACAO DE DADOS
  async update(req, res, next) {
    const { nome, email, cpf, telefones, endereco, dataDeNascimento, password } =  req.body;
    
    try {
      const cliente = await (await Cliente.findById(req.payload.id)).populate("user");
      if(nome) {
        cliente.user.nome = nome;
        cliente.nome = nome;
    }
      if(email) cliente.user.email = email;
      if(password) cliente.user.setSenha(password);
      if(cpf) cliente.cpf = cpf;
      if(telefones) cliente.telefones = telefones;
      if(endereco) cliente.endereco = endereco;
      if(dataDeNascimento) cliente.dataDeNascimento = dataDeNascimento;
      await cliente.user.save();
      await cliente.save();
      return res.send({ cliente });
    } catch(e) {
      next(e);
    }
    
  }

  // DELETE CLIENTE EXCLUINDO SUA PRÓPRIA CONTA
  async remove(req, res, next) {
    try {
      const cliente = await (await Cliente.findOne({ user: req.payload.id })).populated("user");
      await cliente.user.remove();
      cliente.deletado = true;
      await cliente.save();
      return res.send({ deletado: true });
    } catch(e) {
      next(e);
    }
  }
  





}


module.exports = ClienteController;