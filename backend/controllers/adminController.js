const Doctor = require("../models/Doctor");
const crypto = require("crypto");
const { sendDoctorApprovedEmail, sendDoctorRejectedEmail } = require("../services/emailService");

exports.doctorActionHandler = async (req, res) => {
  try {
    const { token, action } = req.query;

    if (!token || !action) {
      return res.status(400).send("Invalid request");
    }

    // Find doctor with valid token
    const doctor = await Doctor.findOne({
      approvalToken: token,
      approvalTokenExpires: { $gt: Date.now() }
    });

    if (!doctor) {
      return res.status(400).send("Invalid or expired token");
    }

    // Prevent double action
    if (doctor.approvalStatus !== "Pending") {
      return res.send(`
        <h2>This doctor has already been ${doctor.approvalStatus}.</h2>
      `);
    }

    // Approve
    if (action === "approve") {
      const temporaryPassword = crypto.randomBytes(4).toString("hex");

      doctor.approvalStatus = "Approved";
      doctor.isActive = true;
      doctor.approvedAt = Date.now();
      doctor.password = temporaryPassword; // hashed by pre-save hook

      await doctor.save();

      await sendDoctorApprovedEmail({
        email: doctor.email,
        doctorName: doctor.doctorName,
        temporaryPassword
      });

      // Remove token
      doctor.approvalToken = undefined;
      doctor.approvalTokenExpires = undefined;
      await doctor.save();

      return res.send(`
        <h2>✅ Doctor Approved Successfully</h2>
        <p>The doctor has been notified via email.</p>
      `);
    }

    // Reject
    if (action === "reject") {
      doctor.approvalStatus = "Rejected";
      doctor.isActive = false;

      await doctor.save();

      await sendDoctorRejectedEmail({
        email: doctor.email,
        doctorName: doctor.doctorName
      });

      // Remove token
      doctor.approvalToken = undefined;
      doctor.approvalTokenExpires = undefined;
      await doctor.save();

      return res.send(`
        <h2>❌ Doctor Rejected</h2>
        <p>The doctor has been notified via email.</p>
      `);
    }

    return res.status(400).send("Invalid action");

  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
