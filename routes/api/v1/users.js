const router = require("express").Router();
const auth = require("../../auth");
const UserController = require("../../../controllers/UserController");

const userController = new UserController();

router.post("/login", userController.login);
router.post("/register", userController.store); // testado
router.put("/", auth.requered, userController.update); 
router.delete("/", auth.requered, userController.remove);


router.get("/recuperar-senha", userController.showRecovery);
router.post("/recuperar-senha", userController.createRecovery);
router.get("/senha-recuperada", userController.showCompleteRecovery);
router.post("/senha-recuperada", userController.showCompleteRecovery);

router.get("/", auth.requered, userController.index);
router.get("/:id", auth.requered, userController.show);

module.exports = router;