const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/users", require("./clientes"));
router.use("/lojas", require("./lojas"));
router.use("/categorias", require("./categorias"));
router.use("/produtos", require("./produtos"));
router.use("/avaliacoes", require("./avaliacoes"));
router.use("/variacoes", require("./variacoes"));

module.exports = router;