// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { doctorActionHandler } = require("../controllers/adminController");

router.get("/doctor-action", doctorActionHandler);

module.exports = router;
