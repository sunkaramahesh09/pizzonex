const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { create, getMyOrders, getAll, updateStatus } = require("../controllers/orderController");

router.post("/", auth, create);
router.get("/my", auth, getMyOrders);
router.get("/", auth, admin, getAll);
router.patch("/:id/status", auth, admin, updateStatus);

module.exports = router;
