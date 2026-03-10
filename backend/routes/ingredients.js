const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { getAll, create, update } = require("../controllers/ingredientController");

router.get("/", auth, admin, getAll);
router.post("/", auth, admin, create);
router.patch("/:id", auth, admin, update);

module.exports = router;
