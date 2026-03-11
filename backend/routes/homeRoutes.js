const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get("/home", authMiddleware, (req, res) => {

  res.json({
    message: "Welcome to ServiceMate! Your local service booking platform."
  });

});

module.exports = router;