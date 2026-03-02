const nodemailer = require('nodemailer');


// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send patient registration email
const sendPatientRegistrationEmail = async (patientData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CureLex Healthcare" <${process.env.EMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL,
      subject: '🏥 New Patient Registration - CureLex',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #3b82f6; }
            .label { font-weight: bold; color: #1e40af; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🏥 New Patient Registration</h2>
              <p>A new patient has registered on the CureLex platform</p>
            </div>
            <div class="content">
              <h3>Patient Details:</h3>
              
              <div class="info-row">
                <span class="label">Patient ID:</span> ${patientData.patientId}
              </div>
              
              <div class="info-row">
                <span class="label">Full Name:</span> ${patientData.fullName}
              </div>
              
              <div class="info-row">
                <span class="label">Age:</span> ${patientData.age} years
              </div>
              
              <div class="info-row">
                <span class="label">Gender:</span> ${patientData.gender}
              </div>
              
              <div class="info-row">
                <span class="label">Mobile Number:</span> ${patientData.mobileNumber}
              </div>
              
              <div class="info-row">
                <span class="label">Email:</span> ${patientData.email}
              </div>
              
              <div class="info-row">
                <span class="label">Address:</span> ${patientData.address}
              </div>
              
              <div class="info-row">
                <span class="label">Emergency Contact:</span> ${patientData.emergencyContact}
              </div>
              
              <div class="info-row">
                <span class="label">Aadhaar Number:</span> ${patientData.maskedAadhaar}
              </div>
              
              <div class="info-row">
                <span class="label">Registration Date:</span> ${new Date(patientData.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </div>
              
              <div class="footer">
                <p>This is an automated notification from CureLex Healthcare System</p>
                <p><strong>CONNECT. CONSULT. CARE</strong></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Patient registration email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending patient registration email:', error);
    return { success: false, error: error.message };
  }
};

// Send doctor registration email
const sendDoctorRegistrationEmail = async (doctorData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CureLex Healthcare" <${process.env.EMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL,
      subject: '👨‍⚕️ New Doctor Registration - Approval Required',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #fef2f2; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #ef4444; }
            .label { font-weight: bold; color: #991b1b; }
            .alert { background: #fee2e2; border: 2px solid #ef4444; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .documents { background: #fff7ed; border: 2px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #fecaca; text-align: center; color: #6b7280; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>👨‍⚕️ New Doctor Registration</h2>
              <p>A new doctor has registered and requires approval</p>
            </div>
            <div class="content">
              <div class="alert">
                <strong>⚠️ Action Required:</strong> Please review and approve this doctor registration.
              </div>
              
              <h3>Doctor Details:</h3>
              
              <div class="info-row">
                <span class="label">Doctor ID:</span> ${doctorData.doctorId}
              </div>
              
              <div class="info-row">
                <span class="label">Name:</span> Dr. ${doctorData.doctorName}
              </div>
              
              <div class="info-row">
                <span class="label">Age:</span> ${doctorData.age} years
              </div>
              
              <div class="info-row">
                <span class="label">Gender:</span> ${doctorData.gender}
              </div>
              
              <div class="info-row">
                <span class="label">Specialization:</span> ${doctorData.specialization}
              </div>
              
              <div class="info-row">
                <span class="label">Medical Registration Number:</span> ${doctorData.medicalRegistrationNumber}
              </div>
              
              <div class="info-row">
                <span class="label">Registration State:</span> ${doctorData.registrationState}
              </div>
              
              <div class="info-row">
                <span class="label">Current Practice Hospital:</span> ${doctorData.currentPracticeHospital}
              </div>
              
              <div class="info-row">
                <span class="label">Years of Experience:</span> ${doctorData.yearsOfExperience} years
              </div>
              
              <div class="info-row">
                <span class="label">Total Patients Treated:</span> ${doctorData.totalPatientsTreated}
              </div>
              
              <div class="info-row">
                <span class="label">Email:</span> ${doctorData.email}
              </div>
              
              <div class="info-row">
                <span class="label">Mobile Number:</span> ${doctorData.mobileNumber}
              </div>
              
              <div class="documents">
                <h4>📎 Attached Documents:</h4>
                <p><strong>Professional Photo:</strong> ${doctorData.professionalPhoto}</p>
                <p><strong>Registration Certificate:</strong> ${doctorData.registrationCertificate}</p>
              </div>
              
              <div class="info-row">
                <span class="label">Registration Date:</span> ${new Date(doctorData.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </div>
              
              <div class="info-row">
                 <span class="label">Approval Status:</span> 

<a href="${process.env.BASE_URL}/api/admin/doctor-action?token=${doctorData.approvalToken}&action=approve"
   style="background: #dcfce7; padding: 4px 12px; border-radius: 12px; color: #166534; text-decoration: none; display: inline-block;">
   Approve
</a>


<a href="${process.env.BASE_URL}/api/admin/doctor-action?token=${doctorData.approvalToken}&action=reject"
   style="background: #fee2e2; padding: 4px 12px; border-radius: 12px; color: #991b1b; text-decoration: none; display: inline-block;">
   Reject
</a>

              </div>
              
              <div class="footer">
                <p>This is an automated notification from CureLex Healthcare System</p>
                <p><strong>CONNECT. CONSULT. CARE</strong></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Doctor registration email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending doctor registration email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"CureLex Healthcare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Password Reset Request - CureLex',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #faf5ff; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #8b5cf6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #e9d5ff; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔐 Password Reset Request</h2>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You have requested to reset your password for your CureLex account.</p>
              <p>Please click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #8b5cf6;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this, please ignore this email.</p>
              <div class="footer">
                <p>This is an automated email from CureLex Healthcare System</p>
                <p><strong>CONNECT. CONSULT. CARE</strong></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

const sendDoctorApprovedEmail = async ({ email, doctorName, temporaryPassword }) => {
  try {
    const transporter = createTransporter();
  const mailOptions={
    from: `"CureLex Healthcare" <${process.env.COMPANY_EMAIL}>`,
    to: email,
    subject: "🎉 Your CureLex Account Has Been Approved",
    html: `
      <h2>Congratulations Dr. ${doctorName} 👨‍⚕️</h2>
      <p>Your account has been approved.</p>
      <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
      <p>Please login and change your password immediately.</p>
    `
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Approval sent:', info.messageId);
  return { success: true, messageId: info.messageId };
} catch (error) {
  console.error('❌ Error sending password reset email:', error);
  return { success: false, error: error.message };
}
};

const sendDoctorRejectedEmail = async (doctor) => {
  try {
    const transporter = createTransporter();
  const mailOptions={
    from: `"CureLex Healthcare" <${process.env.COMPANY_EMAIL}>`,
    to:doctor.email,
    subject: "Regarding Your CureLex Registration",
    html: `
            <h2>Hello Dr. ${doctor.doctorName}</h2>
      <p>We regret to inform you that your registration was not approved.</p>
      <p>If you believe this was a mistake, please contact support.</p>
    `
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Approval rejected:', info.messageId);
  return { success: true, messageId: info.messageId };
} catch (error) {
  console.error('❌ Error sending password reset email:', error);
  return { success: false, error: error.message };
}
};

module.exports = {
  sendPatientRegistrationEmail,
  sendDoctorRegistrationEmail,
  sendPasswordResetEmail,
  sendDoctorApprovedEmail,
  sendDoctorRejectedEmail
};
