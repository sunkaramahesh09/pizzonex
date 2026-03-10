const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { getAll, create, update, remove } = require("../controllers/pizzaController");

router.get("/", getAll);
router.post("/", auth, admin, create);
router.put("/:id", auth, admin, update);
router.delete("/:id", auth, admin, remove);

module.exports = router;
