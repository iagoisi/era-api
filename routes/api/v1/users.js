const router = require("express").Router();
const auth = require("../../auth");
const UserController = require("../../../controllers/UserController");

const userController = new UserController();

router.post("/login", userController.login); // testado
router.post("/register", userController.store); // testado
router.put("/", auth.required, userController.update); // testado
router.delete("/", auth.required, userController.remove); // testado


router.get("/recuperar-senha", userController.showRecovery); // nao testado
router.post("/recuperar-senha", userController.createRecovery); // nao testado
router.get("/senha-recuperada", userController.showCompleteRecovery); // nao testado
router.post("/senha-recuperada", userController.showCompleteRecovery); // nao testado

router.get("/", auth.required, userController.index); //testado
router.get("/:id", auth.required, userController.show); // testado

module.exports = router;