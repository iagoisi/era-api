const { Mongoose } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const lojaSchema = mongoose.Schema({
  nome: { type: String, required: true },
  cnpj: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  telefones: {
    type: [{ type: String }]
  },
  endereco: {
    type: {
      local: { type: String, required: true },
      numero: { type: String, required: true },
      complemento: { type: String },
      cidade: { type: String, required: true },
      CEP: { type: String, required: true },
    },
    required: true
    }
  },{ timestamps: true });

  LojaSchema.plugin(uniqueValidator), { message: "já está sendo utilizado" }

  module.exports = monsoose.model("loja", LojaSchema);