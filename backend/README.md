# CureLex Healthcare - Backend API

Backend server for the CureLex Healthcare platform with patient and doctor authentication system.

## 🚀 Features

- **Patient Authentication**: Complete signup, signin, and dashboard functionality
- **Doctor Registration**: Doctor signup with document uploads (pending approval system)
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Email Notifications**: Automated emails on every registration
- **File Uploads**: Secure handling of doctor photos and certificates
- **Data Encryption**: Aadhaar numbers are encrypted in the database
- **Password Security**: Bcrypt hashing for all passwords
- **Rate Limiting**: API rate limiting for security
- **Error Handling**: Comprehensive error handling middleware

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update all the values in `.env` file

   ```bash
   cp .env.example .env
   ```

4. **Important Configuration**:

   **MongoDB**: Make sure MongoDB is running locally or update `MONGODB_URI` with your MongoDB connection string.

   **Email Setup** (for Gmail):
   - Enable 2-Step Verification in your Google Account
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the generated password in `EMAIL_PASSWORD`

   **Security Keys**:
   - Generate a strong JWT secret (at least 32 characters)
   - Generate a 32-character encryption key for Aadhaar encryption

## 📂 Project Structure

```
backend/
├── config/
│   ├── database.js           # MongoDB connection
│   └── fileUpload.js         # Multer configuration
├── controllers/
│   ├── patientController.js  # Patient authentication & dashboard
│   └── doctorController.js   # Doctor authentication & approval
├── middleware/
│   ├── auth.js               # JWT authentication middleware
│   └── errorHandler.js       # Error handling middleware
├── models/
│   ├── Patient.js            # Patient schema
│   └── Doctor.js             # Doctor schema
├── routes/
│   ├── patientRoutes.js      # Patient routes
│   └── doctorRoutes.js       # Doctor routes
├── services/
│   └── emailService.js       # Email notification service
├── utils/
│   └── jwtUtils.js           # JWT token utilities
├── uploads/                  # File upload directory
│   ├── photos/
│   └── certificates/
├── .env.example              # Environment variables template
├── package.json
└── server.js                 # Main server file
```

## 🔌 API Endpoints

### Patient Endpoints

#### Register Patient
```http
POST /api/auth/patient/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "age": 30,
  "gender": "Male",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St, City",
  "emergencyContact": "9876543211",
  "aadhaarNumber": "123456789012",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

#### Login Patient
```http
POST /api/auth/patient/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Patient Dashboard (Protected)
```http
GET /api/patient/dashboard
Authorization: Bearer <token>
```

#### Get Patient Profile (Protected)
```http
GET /api/patient/profile
Authorization: Bearer <token>
```

### Doctor Endpoints

#### Register Doctor (with file uploads)
```http
POST /api/auth/doctor/signup
Content-Type: multipart/form-data

Form Data:
- doctorName: Dr. Jane Smith
- age: 35
- gender: Female
- specialization: Cardiologist
- medicalRegistrationNumber: MH12345
- registrationState: Maharashtra
- currentPracticeHospital: City Hospital
- yearsOfExperience: 10
- totalPatientsTreated: 5000
- email: jane@example.com
- mobileNumber: 9876543210
- professionalPhoto: [file]
- registrationCertificate: [file]
```

#### Login Doctor (only if approved)
```http
POST /api/auth/doctor/signin
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

#### Get Doctor Profile (Protected)
```http
GET /api/doctor/profile
Authorization: Bearer <token>
```

## 🔐 Authentication Flow

### Patient Flow:
1. Patient signs up → Account created immediately
2. Automated email sent to company with patient details
3. Patient can login immediately
4. JWT token provided for authenticated requests

### Doctor Flow:
1. Doctor signs up with documents → Account created with "Pending" status
2. Automated email sent to company with doctor details and document links
3. Doctor cannot login until approved by admin
4. Admin approves doctor and sets temporary password
5. Doctor receives email with credentials
6. Doctor can now login with approved account

## 📧 Email Notifications

The system automatically sends HTML-formatted emails for:
- **Patient Registration**: Details sent to company email
- **Doctor Registration**: Details with document links sent for approval
- **Password Reset**: Reset instructions sent to user (future feature)

## 🔒 Security Features

1. **Password Hashing**: Bcrypt with salt rounds
2. **Aadhaar Encryption**: AES encryption for Aadhaar numbers
3. **JWT Authentication**: Secure token-based auth
4. **Role-Based Access**: Separate access for patients and doctors
5. **Rate Limiting**: Prevents API abuse
6. **Helmet**: Security headers
7. **CORS**: Configured for frontend origin
8. **Input Validation**: Mongoose validators and custom checks

## 🚀 Running the Server

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on port 5000 (or the port specified in .env)

## 🧪 Testing the API

You can test the API using:
- **Postman**: Import the endpoints and test
- **cURL**: Command line testing
- **Thunder Client**: VS Code extension

### Example cURL command:
```bash
curl -X POST http://localhost:5000/api/auth/patient/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Patient",
    "age": 25,
    "gender": "Male",
    "mobileNumber": "9876543210",
    "email": "test@example.com",
    "address": "Test Address",
    "emergencyContact": "9876543211",
    "aadhaarNumber": "123456789012",
    "password": "Test@123",
    "confirmPassword": "Test@123"
  }'
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/curelex-healthcare |
| JWT_SECRET | Secret key for JWT | your-secret-key-min-32-chars |
| JWT_EXPIRE | Token expiration time | 7d |
| ENCRYPTION_KEY | 32-char key for Aadhaar encryption | your-32-character-key-here |
| EMAIL_HOST | SMTP host | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Email address | your-email@gmail.com |
| EMAIL_PASSWORD | Email app password | your-app-password |
| COMPANY_EMAIL | Company notification email | admin@curelex.com |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## 🐛 Troubleshooting

### MongoDB Connection Error:
- Ensure MongoDB is running: `mongod`
- Check connection string in .env

### Email Not Sending:
- Verify Gmail App Password is correct
- Check 2-Step Verification is enabled
- Ensure EMAIL_HOST and EMAIL_PORT are correct

### File Upload Error:
- Check file size limits (default 5MB)
- Verify uploads directory has write permissions
- Ensure correct field names in form data

## 📊 Database Schema

### Patient Collection:
- Patient ID (auto-generated)
- Personal Information
- Contact Details
- Encrypted Aadhaar
- Hashed Password
- Medical Records Array

### Doctor Collection:
- Doctor ID (auto-generated)
- Professional Information
- Registration Details
- File Paths (photo & certificate)
- Approval Status
- Hashed Password (after approval)

## 🔄 Future Enhancements

- [ ] Admin dashboard for doctor approval
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Doctor dashboard
- [ ] Appointment scheduling
- [ ] Prescription management
- [ ] Video consultation integration
- [ ] Payment gateway integration
- [ ] Analytics and reporting

## 📄 License

This project is part of the CureLex Healthcare platform.

## 👥 Support

For issues or questions, contact the development team.

---

**CONNECT. CONSULT. CARE** 🏥
