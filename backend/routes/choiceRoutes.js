const express = require("express")
const router = express.Router()

const choiceController = require("../controllers/choiceController")
const verifyAuthentication = require("../middleware/auth")

router.get("/", choiceController.getAllChoices)
router.post("/", verifyAuthentication, choiceController.addChoice)
router.put("/", choiceController.makeChoice)
router.put("/:id", verifyAuthentication, choiceController.updateChoice)
router.delete("/:id", verifyAuthentication, choiceController.deleteChoice)
router.get("/search", verifyAuthentication, choiceController.searchChoice)

module.exports = router