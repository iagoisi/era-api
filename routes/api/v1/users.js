const router = require("express").Router();
const auth = require("../../auth");
const UserController = require("../../../controllers/UserController");

const Validation = require("express-validation");
const { UserValidation } = require("../../../controllers/validacoes/userValidation");

const userController = new UserController();

router.post("/login", Validation(UserValidation.login), userController.login); // testado
router.post("/register", Validation(UserValidation.store), userController.store); // testado
router.put("/", auth.required, Validation(UserValidation.update), userController.update); // testado
router.delete("/", auth.required, userController.remove); // testado


router.get("/recuperar-senha", userController.showRecovery); // nao testado
router.post("/recuperar-senha", userController.createRecovery); // nao testado
router.get("/senha-recuperada", userController.showCompleteRecovery); // nao testado
router.post("/senha-recuperada", userController.showCompleteRecovery); // nao testado

router.get("/", auth.required, userController.index); //testado
router.get("/:id", auth.required, Validation(UserValidation.show), userController.show); // testado

module.exports = router;