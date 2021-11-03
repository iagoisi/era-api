const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/lojas", require("./lojas"));

module.exports = router;