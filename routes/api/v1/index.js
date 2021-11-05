const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/users", require("./clientes"));
router.use("/lojas", require("./lojas"));

module.exports = router;