# User Manual
## Accounting & Advisory Platform

Complete guide for using the recruitment and employee onboarding system.

---

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Public Features](#public-features)
3. [Admin Features](#admin-features)
4. [Employee Features](#employee-features)
5. [Workflow Guide](#workflow-guide)
6. [Best Practices](#best-practices)
7. [FAQ](#faq)

---

## Introduction

The Accounting & Advisory Platform is a comprehensive recruitment and employee onboarding system designed to streamline the hiring process from initial interest to active employment.

### Key Features

- **Public Forms:** Interest and Exited forms accessible without login
- **Auto-fetch:** Automatic data population for returning candidates
- **Role-based Access:** Admin, Advisor, and Employee portals
- **Progress Tracking:** Visual profile completion percentage
- **Document Management:** Secure upload and storage of candidate documents
- **Status Workflow:** Clear progression from interested to active employee

### User Roles

| Role | Access Level | Capabilities |
|------|--------------|--------------|
| **Public** | No login required | Submit interest and exited forms |
| **Admin** | Full access | Manage all candidates, approve applications, generate credentials |
| **Advisor** | Read/Update | View and manage candidate details |
| **Employee** | Personal access | Complete profile, final confirmation |

---

## Public Features

### Landing Page

**URL:** `/`

The landing page showcases your accounting and advisory services.

**Features:**
- Professional service showcase
- Company information
- Call-to-action buttons
- Direct access to forms

**Actions:**
- Click **"Get Started"** to choose between Interest or Exited form
- Click **"Login"** to access admin/employee portal

### Get Started Page

**URL:** `/get-started`

Choose how you'd like to connect with the company.

**Options:**

#### 1. I'm Interested (Quick Interest Form)
- **Purpose:** Express interest without commitment
- **Time:** 5-10 minutes
- **Profile Completion:** 20%
- **Best For:** Exploring opportunities

#### 2. Excited to Work (Comprehensive Application)
- **Purpose:** Apply for a position
- **Time:** 20-30 minutes
- **Profile Completion:** 50%
- **Best For:** Ready to join

---

### Interest Form

**URL:** `/interest-form`

**Purpose:** Quick form to express interest in joining the team.

**Sections:**

#### 1. Personal Information
- First Name *(required)*
- Last Name *(required)*
- Date of Birth *(required)*
- Gender *(required)*
- Primary Contact Number *(required)*
- Current Address (Address, City, State, PIN) *(required)*

#### 2. Educational Background
- Highest Qualification *(required)*
- Year of Passing *(required)*
- Relevant Certifications *(optional)*

#### 3. Work Experience (Optional)
- Current/Most Recent Job Title
- Company Name
- Years of Experience
- Roles & Key Responsibilities

#### 4. Interest & Availability
- Why do you want to join our team? *(required)*
- Long-term career goals *(required)*
- Availability to join *(required)*
- Source of awareness *(required)*

#### 5. Document Upload (Optional)
- Resume/CV (PDF/DOCX)

#### 6. Consent & Declaration
- ✓ Information accuracy declaration *(required)*
- ✓ Data processing consent *(required)*

**After Submission:**
- Status set to **INTERESTED**
- Profile completion: **20%**
- Record saved in database
- Admin can review and allow you to fill Exited form

**Pro Tip:** Keep your contact number handy - you'll need it if you decide to fill the Exited form later!

---

### Exited Form

**URL:** `/exited-form`

**Purpose:** Comprehensive application form for candidates excited to work.

**Two Ways to Fill:**

#### Option 1: Direct Submission
Fill the complete form from scratch.

#### Option 2: Auto-fetch (Recommended)
If you previously filled the Interest Form:
1. Enter your Email OR Mobile Number
2. Click "Check Existing Data"
3. System automatically fetches your Interest Form data
4. Pre-filled fields are locked (read-only)
5. Fill only the additional fields

**Complete Form Structure:**

#### Tab 1: Personal Information
- Full Name
- Gender
- Date of Birth
- Marital Status *(new)*
- Nationality *(new)*
- Languages Known *(new)*

#### Tab 2: Contact Information
- Mobile Number
- Alternate Mobile Number *(new)*
- Email Address *(new)*
- Residential Address
- Permanent Address *(new)*
- ☐ Same as current address checkbox

#### Tab 3: Family Background *(new)*
- Father/Spouse Name
- Occupation
- Number of Children
- Number of Siblings
- Family Income (optional)

#### Tab 4: Educational Qualifications
- Basic education (from Interest Form)
- **Detailed qualifications** (Add multiple):
  - Level (10th/12th/Graduation/PG/Other)
  - Degree/Certification
  - Institution
  - Year of Passing
  - Percentage/CGPA
  - Achievements

#### Tab 5: Work Experience
- Basic experience (from Interest Form)
- **Detailed work history** (Add multiple):
  - Employer Name
  - Job Title
  - Duration (Start/End Date)
  - Responsibilities
  - Reason for Leaving
  - Skills & Expertise

#### Tab 6: Professional Interests & Goals
- Why join our accounting team?
- Long-term career goals
- Preferred work areas
- Availability to join

#### Tab 7: References
- **Reference 1** (required):
  - Name
  - Relationship
  - Contact Number
  - Email Address
- Reference 2 (optional)

#### Tab 8: Documents Upload *(new)*
- Resume/CV
- Passport Size Photo
- Address Proof (Aadhar/Voter ID/Passport)
- Identity Proof

#### Tab 9: Consent & Declaration
- ✓ Data collection consent *(required)*
- ✓ Information accuracy *(required)*
- ✓ Terms and conditions agreement *(required)*
- ✓ Digital signature *(required)*

**After Submission:**
- Status set to **EXITED**
- Profile completion: **50%**
- Admin receives notification
- Application moves to review queue

**Important Notes:**
- Save your progress regularly
- All documents should be clear and legible
- Ensure contact information is correct
- Double-check all entered information

---

## Admin Features

### Admin Login

**URL:** `/login`

**Default Credentials:**
- Email: admin@accounting.com
- Password: admin123

⚠️ **Change these credentials immediately after first login!**

**After Login:**
- Redirected to Admin Dashboard
- Access to all candidate management features

---

### Admin Dashboard

**URL:** `/admin/dashboard`

**Overview Cards:**

1. **Total Candidates**
   - Shows total number of applicants
   - Click to view all candidates

2. **Interested**
   - Candidates who submitted interest forms
   - Status: INTERESTED
   - Action: Review and allow exited form

3. **Exited Applications**
   - Comprehensive applications received
   - Status: EXITED
   - Action: Review and approve

4. **Approved**
   - Candidates approved by admin
   - Status: APPROVED
   - Credentials generated

5. **Active Employees**
   - Fully onboarded employees
   - Status: ACTIVE
   - Completed final confirmation

**Quick Actions:**
- Review Interested → Process interest forms
- Process Applications → Review exited forms
- Approved Candidates → Manage onboarding
- All Candidates → View complete list

---

### Candidates List

**URL:** `/admin/candidates`

**Features:**

#### Search & Filter
- **Search:** Search by name, email, or phone
- **Status Filter:** Filter by workflow status
- **Sort:** Sort by date, name, or status

#### Candidate Cards
Each card shows:
- Profile photo or initials
- Full name
- Contact information
- Current status badge
- Profile completion percentage
- Action buttons

#### Available Actions

**For INTERESTED candidates:**
- **View Details** → See full interest form
- **Allow Exited Form** → Grant permission to fill exited form
- **Delete** → Remove candidate (permanent)

**For ALLOWED_EXITED candidates:**
- **View Details** → See submitted information
- **Remind** → Send reminder to fill exited form

**For EXITED candidates:**
- **View Details** → Review complete application
- **Approve & Generate Credentials** → Move to next stage
- **Reject** → Decline application

**For APPROVED candidates:**
- **View Details** → See all information
- **Edit Admin Fields** → Update admin-specific data
- **View Credentials** → Check employee ID and password

**For ACTIVE candidates:**
- **View Details** → Complete employee profile
- **Generate Reports** → Export employee data

---

### Candidate Detail Page

**URL:** `/admin/candidates/:id`

**Navigation Tabs:**

#### 1. Overview
- Quick summary of candidate
- Contact information
- Current status
- Profile completion
- Timeline of status changes

#### 2. Personal Information
All personal details from forms:
- Basic information
- Contact details
- Family background

#### 3. Education
- Highest qualification summary
- Detailed educational history
- Certifications and achievements

#### 4. Experience
- Work history summary
- Detailed employment records
- Skills and expertise

#### 5. Documents
- View uploaded documents
- Download individual files
- Verify document authenticity

#### 6. Admin Actions

**For INTERESTED Status:**
```
Action: Allow Exited Form
Effect: Changes status to ALLOWED_EXITED
Result: Candidate can now fill exited form
```

**For EXITED Status:**
```
Action: Approve & Generate Credentials
Requirements:
  - Review all submitted information
  - Verify documents
  - Confirm candidate suitability

Process:
  1. Click "Approve & Generate Credentials"
  2. Fill admin-specific fields:
     - Designation
     - Date of Joining
     - Other employment details
  3. System generates:
     - Employee ID (format: EMP2024XXXX)
     - Temporary password
  4. Status changes to APPROVED (80% profile)
  5. Send credentials to candidate
```

**For APPROVED Status:**
```
Action: Edit Admin Fields
Editable:
  - Designation
  - Date of joining
  - Department
  - Reporting manager
  - Contract details
  - Deposit information
```

---

### Managing Admin Fields

**URL:** `/admin/candidates/:id/admin-update`

**Section 1: Basic Information**
- Employee ID *(auto-generated)*
- Password *(auto-generated, can reset)*
- Designation
- Date of Joining
- Full Name *(fetched)*
- Date of Birth *(fetched)*
- Gender *(fetched)*

**Section 2: Contract & Deposit**
- Contract Terms Display (Hindi & English)
- Contract Acceptance Tracking
- Deposit Amount (typically 10 days salary)
- Deposit Confirmation Status
- Upload Deposit Proof

**Section 3: Legal Compliance**
*Admin fills:*
- Aadhar Number
- PAN Number
- Bank Account Details:
  - Account Number
  - IFSC Code
  - Bank Name
  - Branch Name

*Employee fills after approval:*
- Emergency Contact Information
- Criminal Record Declaration

**Save Changes:**
- Click "Save Admin Updates"
- Changes reflected immediately
- Employee receives notification

---

## Employee Features

### Employee Login

**URL:** `/login`

**Toggle to:** Employee Login

**Credentials:**
- Employee ID (format: EMP2024XXXX)
- Password (provided by admin)

**First Time Login:**
1. Log in with provided credentials
2. You'll see a notification to complete your profile
3. Change your password (recommended)

---

### Employee Dashboard

**URL:** `/employee/dashboard`

**Welcome Section:**
- Personalized greeting
- Current profile status
- Profile completion percentage

**Profile Sections:**

#### 1. Review Basic Information
All information fetched from previous forms:
- Personal details
- Education
- Experience
- Documents

**Status:** Read-only (cannot edit)

#### 2. Complete Employee Details

**Contact Information:**
- Primary Email *(confirm)*
- Contact Numbers *(update if changed)*
- Current Residential Address:
  - Full address
  - GPS Coordinates (optional)
  - Upload address proof photos

#### 3. Contract Acceptance
- Read contract terms (Hindi version)
- Read contract terms (English version)
- ☐ Accept contract terms *(required)*
- Digital signature *(draw or upload)*

#### 4. Deposit Confirmation
- Review deposit amount
- Upload deposit payment proof
- Confirm deposit payment

#### 5. Legal Compliance
**Review admin-filled data:**
- Aadhar Number
- PAN Number
- Bank Details

**Fill your information:**
- Emergency Contact:
  - Name
  - Relationship
  - Contact Number
- ☐ Criminal Record Declaration *(required)*

#### 6. Final Confirmation
- Review complete profile
- Verify all information is correct
- ☐ Confirm information accuracy *(required)*
- ☐ Final digital confirmation *(required)*

**Submit Button:**
- Click "Complete Profile & Activate"
- Status changes to ACTIVE (100% profile)
- You become an official employee!

---

## Workflow Guide

### Complete Candidate Journey

```
┌─────────────────────┐
│  1. INTERESTED      │  Public fills Interest Form
│  Profile: 20%       │  → Quick expression of interest
└──────────┬──────────┘
           │
           ↓ Admin Action: Allow Exited Form
           │
┌──────────┴──────────┐
│  2. ALLOWED_EXITED  │  Candidate can now fill Exited Form
│  Profile: 20%       │  → Permission granted
└──────────┬──────────┘
           │
           ↓ Candidate fills Exited Form
           │
┌──────────┴──────────┐
│  3. EXITED          │  Comprehensive application submitted
│  Profile: 50%       │  → Under admin review
└──────────┬──────────┘
           │
           ↓ Admin Action: Approve & Generate Credentials
           │
┌──────────┴──────────┐
│  4. APPROVED        │  Admin completes employment details
│  Profile: 80%       │  → Credentials generated
└──────────┬──────────┘
           │
           ↓ Employee completes final profile
           │
┌──────────┴──────────┐
│  5. ACTIVE          │  Employee fully onboarded
│  Profile: 100%      │  → Active team member
└─────────────────────┘
```

### Timeline Estimates

| Stage | Typical Duration | Action Holder |
|-------|------------------|---------------|
| INTERESTED → ALLOWED_EXITED | 1-3 days | Admin |
| ALLOWED_EXITED → EXITED | 3-7 days | Candidate |
| EXITED → APPROVED | 3-10 days | Admin |
| APPROVED → ACTIVE | 1-5 days | Employee |

**Total Process:** Typically 2-4 weeks from interest to active employment

---

## Best Practices

### For Candidates

1. **Fill Forms Carefully**
   - Double-check all information
   - Use correct contact details
   - Upload clear document scans

2. **Keep Information Updated**
   - If contact info changes, notify admin
   - Update resume before uploading
   - Ensure references are reachable

3. **Document Quality**
   - Scan documents clearly
   - Use supported formats (PDF, JPG, PNG)
   - Keep file sizes reasonable (<5MB)

4. **Professional Communication**
   - Use professional email addresses
   - Respond promptly to admin requests
   - Be honest in all declarations

### For Admins

1. **Regular Reviews**
   - Check new applications daily
   - Respond to interested candidates within 48 hours
   - Keep candidates informed of status

2. **Thorough Verification**
   - Verify all documents carefully
   - Cross-check references
   - Confirm educational qualifications
   - Validate work experience claims

3. **Clear Communication**
   - Send credentials promptly
   - Provide clear instructions
   - Set expectations for each stage

4. **Data Security**
   - Use strong passwords
   - Log out when not in use
   - Don't share admin credentials
   - Regular password changes

5. **Record Keeping**
   - Document approval reasons
   - Keep notes on candidates
   - Track communication history

### For Employees

1. **First Day Checklist**
   - [ ] Login with provided credentials
   - [ ] Change password
   - [ ] Review pre-filled information
   - [ ] Complete required fields
   - [ ] Upload all documents
   - [ ] Read and accept contract
   - [ ] Confirm deposit payment
   - [ ] Final confirmation

2. **Document Preparation**
   - Have all documents ready before starting
   - Ensure digital signatures are clear
   - Keep physical copies for records

---

## FAQ

### General Questions

**Q: How long does the application process take?**
A: Typically 2-4 weeks from initial interest to active employment.

**Q: Can I edit my information after submission?**
A: Interest form: No. Exited form: Contact admin for changes. Employee details: Some fields editable during final confirmation.

**Q: What if I forget my employee password?**
A: Contact your admin to reset it.

**Q: What document formats are accepted?**
A: PDF, DOCX, JPG, PNG (max 5MB per file)

### For Candidates

**Q: I submitted an interest form. What's next?**
A: Admin will review and may allow you to fill the exited form. Check your email for updates.

**Q: Can I fill the exited form directly without interest form?**
A: Yes! You can fill the exited form directly from the Get Started page.

**Q: How does auto-fetch work?**
A: Enter your email or phone from the interest form. System will automatically populate those fields and lock them.

**Q: I made a mistake in the interest form. Can I fix it?**
A: Contact admin at support@accountech.com to request corrections.

**Q: What if I don't have all documents ready?**
A: Some documents are optional. Upload what you have and contact admin about missing items.

### For Admins

**Q: How do I create additional admin accounts?**
A: Currently, contact the system administrator to create new admin users.

**Q: Can I bulk approve candidates?**
A: No, each candidate requires individual review and approval for quality control.

**Q: How do I export candidate data?**
A: Use the export function on the candidates list page (CSV/PDF options).

**Q: What if a candidate's status needs to be reverted?**
A: Contact technical support - status changes should generally move forward only.

**Q: How are employee IDs generated?**
A: Auto-generated format: EMP{YEAR}{4-digit-sequential-number}

### For Employees

**Q: I can't log in with my employee ID.**
A: Ensure you're using the "Employee Login" option (not admin login). Contact admin if issue persists.

**Q: Do I need to fill contract details?**
A: No, admin fills most contract details. You only accept terms and confirm deposit.

**Q: What happens after I click final confirmation?**
A: Your status changes to ACTIVE (100% profile), and you officially become an employee.

**Q: Can I update my information later?**
A: Some fields can be updated through admin. Request changes via proper channels.

---

## Troubleshooting

### Common Issues

#### Form Submission Failed
- **Cause:** Network error or server timeout
- **Solution:** Check internet connection, refresh page, try again

#### Auto-fetch Not Working
- **Cause:** Email/phone doesn't match records
- **Solution:** Verify you're entering the exact same email/phone from interest form

#### File Upload Failed
- **Cause:** File too large or unsupported format
- **Solution:** Compress file, convert to supported format (PDF/JPG/PNG)

#### Cannot Login
- **Cause:** Wrong credentials or account not created
- **Solution:** Double-check credentials, ensure admin has generated your account

---

## Support

### Getting Help

**Technical Support:**
- Email: support@accountech.com
- Response time: 24-48 hours

**Admin Contact:**
- Email: admin@accountech.com
- For urgent matters

**System Issues:**
- Check logs if you have access
- Screenshot error messages
- Note the time of issue
- Describe steps that led to problem

---

## Appendix

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save form (where applicable) |
| `Esc` | Close modal |
| `Tab` | Navigate form fields |

### Status Badge Colors

- 🟡 **INTERESTED** - Yellow
- 🟠 **ALLOWED_EXITED** - Orange
- 🟣 **EXITED** - Purple
- 🟢 **APPROVED** - Green
- 🔵 **ACTIVE** - Blue

### Profile Completion

- 20% - Interest Form Submitted
- 50% - Exited Form Submitted
- 80% - Admin Approval Complete
- 100% - Final Employee Confirmation

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Platform:** Accounting & Advisory Web Application  
**Contact:** support@accountech.com
