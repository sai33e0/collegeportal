# CSV Bulk Import Guide

## Overview
Admins can now bulk import students using CSV files. This feature allows importing hundreds of students at once with proper validation and error handling.

## How to Use

### Step 1: Access CSV Import
1. Login as Admin
2. Go to Admin Dashboard (`/admin`)
3. Scroll down to **"📥 Bulk Import Students via CSV"** section

### Step 2: Download Template
Click **"📥 Download Template"** to get a CSV template with the correct format.

### Step 3: Prepare Your CSV File

The CSV file must have these exact columns:
```
email,password,full_name,roll_no,dept_id,semester,year_of_admission
```

#### Column Descriptions:

| Column | Type | Example | Required | Notes |
|--------|------|---------|----------|-------|
| **email** | Text | student01@srit.ac.in | Yes | Must be unique, valid email format |
| **password** | Text | srit1234 | Yes | Student login password |
| **full_name** | Text | John Doe | Yes | Student's full name |
| **roll_no** | Text | 234G1A3301 | Yes | Must be unique |
| **dept_id** | Number | 1 | Yes | 1=CSE, 2=ECE, 3=AI/ML |
| **semester** | Number | 6 | Yes | 1-8 (current semester) |
| **year_of_admission** | Number | 2023 | Yes | 4-digit year |

### Step 4: Example CSV Content

```csv
email,password,full_name,roll_no,dept_id,semester,year_of_admission
student01@srit.ac.in,srit1234,Rahul Kumar,234G1A3301,1,6,2023
student02@srit.ac.in,srit1234,Priya Singh,234G1A3302,1,6,2023
student03@srit.ac.in,srit1234,Amit Desai,234G1A3303,1,6,2023
ml_student01@srit.ac.in,srit1234,ML Student One,234G5A0401,3,6,2023
ml_student02@srit.ac.in,srit1234,ML Student Two,234G5A0402,3,6,2023
```

### Step 5: Upload and Import

1. **Select File**: Click on the upload area or drag & drop your CSV file
2. **Verify**: Ensure all required columns are present
3. **Click Import**: Click **"🚀 Import Students"** button
4. **Monitor Progress**: Wait for the import to complete

### Step 6: Review Results

The import summary shows:
- ✅ **Created**: Number of successfully created students
- ⊘ **Skipped**: Students already in the system
- ✗ **Failed**: Students that failed to import

**Error Details**: Failed imports show which rows had errors and why.

---

## CSV Validation Rules

The system validates each row:

### Email Validation
- ✓ Must be in valid email format (user@domain.com)
- ✓ Must be unique (no duplicates in system)
- ✓ Used to create authentication account

### Roll Number Validation
- ✓ Must be unique
- ✓ Format suggestion: 234G1A3301 (year + code)

### Department ID
- ✓ Must be a valid department ID
- **Valid dept_id values:**
  - 1 = Computer Science & Engineering (CSE)
  - 2 = Electronics & Communication (ECE)
  - 3 = Artificial Intelligence & ML (AI/ML)

### Semester
- ✓ Must be number between 1 and 8
- ✓ Represents current semester

### Year of Admission
- ✓ Must be 4-digit number
- ✓ Example: 2023, 2022, 2021

---

## Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Missing required columns | CSV header incomplete | Download template and use exact column names |
| Invalid email format | Wrong email format | Use format: name@srit.ac.in |
| Email already exists | Student already registered | Skip or use different email |
| Invalid semester | Semester not 1-8 | Use number between 1-8 |
| Invalid dept_id | Department doesn't exist | Use: 1=CSE, 2=ECE, 3=AI/ML |

---

## Import Summary Example

**Successful Import:**
```
📊 Import Summary
✅ Created: 95
⊘ Skipped: 3
✗ Failed: 2

Errors:
- john@gmail.com: Invalid email format
- student50@srit.ac.in: Email already exists
```

---

## Best Practices

1. **Validate Before Uploading**
   - Check all emails are unique
   - Verify roll numbers don't duplicate
   - Ensure semester is 1-8

2. **Use Standard Format**
   - Always download and use the template
   - Don't change column order
   - No extra columns needed

3. **Small Batches**
   - For very large imports (1000+), split into batches
   - This prevents timeout issues

4. **Verify After Import**
   - Check the import summary
   - Note any failed rows
   - Manually add failed students if needed

5. **Backup**
   - Keep CSV files for audit trail
   - Record import date and number of students

---

## API Details

### Endpoint
```
POST /csv-import/import-students
```

### Request
```json
{
  "csvData": [
    {
      "email": "student01@srit.ac.in",
      "password": "srit1234",
      "full_name": "Student Name",
      "roll_no": "234G1A3301",
      "dept_id": 1,
      "semester": 6,
      "year_of_admission": 2023
    }
  ]
}
```

### Response
```json
{
  "message": "Import completed: 95 created, 3 skipped, 2 failed",
  "results": {
    "created": 95,
    "skipped": 3,
    "failed": 2,
    "errors": [
      {
        "email": "john@gmail.com",
        "error": "Invalid email format"
      }
    ]
  }
}
```

---

## Troubleshooting

### Import Not Starting?
- Ensure you're logged in as Admin
- Check browser console for errors
- Verify CSV file is not corrupted

### All Students Showing as Skipped?
- Students might already exist in system
- Check existing student emails
- Use different email addresses for new imports

### Timeout Error on Large Files?
- Split CSV into smaller batches
- Maximum recommended: 500 students per file
- Try again with smaller file

### Can't Download Template?
- Check internet connection
- Ensure you're logged in
- Try from different browser

---

## Security Notes

✅ **Secure Features:**
- All data encrypted in transit (HTTPS)
- Admin role required for import
- Passwords are hashed before storage
- Email verification enabled
- Rate limiting on API

⚠️ **Admin Responsibilities:**
- Protect CSV files with sensitive data
- Use strong passwords in CSV
- Delete CSV after successful import
- Audit import logs regularly

---

## FAQ

**Q: Can I update existing students via CSV?**
A: Current version skips existing emails. For updates, use the individual edit feature on the Students page.

**Q: What's the maximum file size?**
A: 10 MB recommended, which allows ~10,000 students.

**Q: Can I import from Excel?**
A: Yes! Export Excel as CSV format first.

**Q: Are passwords sent via email?**
A: No, passwords are only in the CSV you upload. Share login credentials separately if needed.

**Q: How long does import take?**
A: ~2-3 seconds per 100 students on average.

**Q: Can I undo an import?**
A: No, but you can delete students from the Students management page.

---

## Support

For issues or questions:
1. Check error messages for specific details
2. Review this guide for solutions
3. Contact Admin support with CSV and error details
