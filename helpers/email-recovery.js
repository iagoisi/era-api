const transporter = require("nodemailer").createTransport(require("../config/email"));
const  { api: link } = require("../config/index");

module.exports = ({ user, recovery }, cb) => {
  const message = `
    <h1 style="text-align: center">Recuperação de Senha</h1>
    <br />
    <p>
        Aqui está o link para redefinir sua senha. Clique no botão abaixo e crie sua nova senha.
    </p>
    <a href="${link}/v1/api/users/senha-recuperada?token=${recovery.token}">
        ${link}/v1/api/users/senha-recuperada?token=${recovery.token}
    </a>
    <br /> <br /> <hr /> 
    <p>
        Obs: Se você não solicitou a redefinição, apenas ignore este e-mail.
    </p>
    <br />
    <p>
        Atenciosamente, Era Digital
    </p>
  `;

  const opcoesEmail = {
    from: "naoresponder@eradigital.com",
    to: user.email,
    subject: "Redefinição de Senha - Era Digital",
    html: message
  };
if( process.env.NODE_ENV === "production" ) {
  transporter.sendMail(opcoesEmail, (error, info) => {
    if(error) {
      console.log(error);
      return cb("Aconteceu um erro no envio do e-mail, tente novamente.")
    } else {
      return cb(null, "Link de redefinição de senha enviado para seu e-mail com sucesso!")
    }
  });
} else {
  console.log(opcoesEmail);
  return cb(null, "Link de redefinição de senha enviado para seu e-mail com sucesso!")
}

}