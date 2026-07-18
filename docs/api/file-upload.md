# API File Upload

**File:** `docs/api/07-file-upload.md`

---

# Purpose

يوضح هذا المستند آلية رفع الملفات (File Upload) داخل النظام، بما في ذلك أنواع الملفات المدعومة، التحقق من الصحة (Validation)، سياسات الأمان، وتكامل التخزين مع **Supabase Storage**.

---

# Objectives

- Secure Uploads
- Predictable File Structure
- Efficient Storage
- Fast Delivery
- Strict Validation
- Scalable Architecture

---

# Storage Provider

```
Supabase Storage
```

---

# Upload Flow

```
Client

↓

Authentication

↓

Validation

↓

Virus Scan (Future)

↓

Storage Upload

↓

Database Reference

↓

Success Response
```

---

# Supported Upload Types

| Resource | Bucket | Access |
|----------|---------|--------|
| Product Images | products | Public |
| User Avatars | avatars | Public |
| Payment Receipts | receipts | Private |
| Documents | documents | Private |
| Export Files | exports | Private |

---

# Content Type

```
multipart/form-data
```

---

# Upload Endpoints

Product Images

```
POST /v1/products/{id}/images
```

---

Avatar

```
POST /v1/profile/avatar
```

---

Payment Receipt

```
POST /v1/payments/{id}/receipt
```

---

Documents

```
POST /v1/storage/documents
```

---

# Request Example

```http
POST /v1/profile/avatar

Content-Type: multipart/form-data
Authorization: Bearer <JWT>
```

Body

```
file=<binary>
```

---

# Successful Response

```json
{
  "success": true,
  "message": "File uploaded successfully.",
  "data": {
    "url": "https://storage.example/avatar.webp",
    "path": "avatars/user-id/avatar.webp",
    "size": 185623,
    "mime_type": "image/webp"
  }
}
```

---

# Allowed Image Types

```
image/webp

image/png

image/jpeg
```

Preferred

```
WEBP
```

---

# Allowed Document Types

```
application/pdf

application/vnd.openxmlformats-officedocument.wordprocessingml.document

application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

text/csv
```

---

# Blocked Types

```
application/x-msdownload

application/x-sh

application/javascript

application/x-bat

application/vnd.android.package-archive
```

Extensions

```
.exe

.dll

.bat

.cmd

.js

.apk

.ipa
```

---

# Maximum File Sizes

| Resource | Limit |
|-----------|--------|
| Avatar | 2 MB |
| Product Image | 5 MB |
| Receipt | 10 MB |
| Document | 20 MB |
| Export | 50 MB |

---

# File Naming Strategy

Never

```
image.png

photo.jpg
```

Always

```
<entity-id>-<timestamp>.<extension>
```

Examples

```
product-a1b2c3-1721300000.webp

avatar-f91e22-1721301000.webp

receipt-9d84ab-1721302000.webp
```

---

# Directory Structure

```
products/

    category-id/

        product-id/

            image.webp

avatars/

    user-id/

        avatar.webp

receipts/

    order-id/

        receipt.webp

documents/

    invoices/

exports/

    reports/
```

---

# Validation Rules

Before Upload

Validate

- Authentication
- Authorization
- MIME Type
- Extension
- File Size
- Empty File
- Duplicate Upload (Optional)

Reject

- Invalid MIME Types
- Empty Files
- Oversized Files
- Corrupted Files

---

# Image Processing

Before Storage

- Resize
- Compress
- Convert To WEBP
- Strip EXIF Metadata

Maximum Resolution

```
2000 × 2000 px
```

Thumbnail

```
400 × 400 px
```

---

# Access Control

Product Images

```
Public Read

Admin Upload

Owner Delete
```

---

Avatars

```
Public Read

Owner Update
```

---

Receipts

```
Customer Upload Own

Customer Read Own

Admin Read All

Owner Full Access
```

---

Documents

```
Owner Only
```

---

# Storage Policies

Controlled By

```
Supabase Storage RLS
```

Checks

- JWT
- Ownership
- User Role

---

# Signed URLs

Used For

Private Files

Expiration

```
5 Minutes
```

Generated Through

```
POST /v1/storage/signed-url
```

---

# Metadata

Stored

```json
{
  "filename": "receipt.webp",
  "mime_type": "image/webp",
  "size": 186245,
  "uploaded_by": "uuid",
  "uploaded_at": "2026-07-18T14:20:00Z"
}
```

---

# Database Integration

Database Stores

```
File URL

Storage Path

Uploaded By

Created At
```

Never Store

```
Binary File Data
```

---

# Error Responses

Invalid File Type

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Unsupported file type."
  }
}
```

---

File Too Large

```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "The uploaded file exceeds the allowed size."
  }
}
```

---

Upload Failure

```json
{
  "success": false,
  "error": {
    "code": "STORAGE_UPLOAD_FAILED",
    "message": "Unable to upload file."
  }
}
```

---

# Security Controls

- HTTPS Only
- JWT Authentication
- Storage RLS Policies
- MIME Type Validation
- File Size Validation
- Filename Sanitization
- Metadata Removal
- Signed URLs For Private Files
- Audit Logging

---

# Audit Events

Log

- Upload Started
- Upload Completed
- Upload Failed
- File Deleted
- Signed URL Generated

---

# Performance Guidelines

- Compress Images Before Upload
- Use WEBP Format
- Lazy Load Public Images
- Cache Public Assets
- Use CDN For Public Buckets
- Generate Thumbnails
- Avoid Duplicate Uploads
- Limit Concurrent Uploads

---

# Monitoring

Track

- Upload Count
- Upload Failures
- Storage Usage
- Average Upload Time
- Largest Files
- Most Active Buckets

Alerts

- Storage Quota
- Repeated Upload Failures
- Suspicious Upload Activity

---

# Best Practices

- Validate Files Before Upload
- Store References, Not Binary Data
- Use Signed URLs For Sensitive Files
- Restrict Upload Permissions
- Enforce Size Limits
- Sanitize File Names
- Remove Image Metadata
- Monitor Storage Usage
- Log All Upload Operations
- Review Storage Policies Regularly

---

# Future Enhancements

- Drag-and-Drop Uploads
- Chunked Uploads For Large Files
- Resumable Uploads
- AI Image Moderation
- OCR For Payment Receipts
- Automatic Background Removal
- Duplicate File Detection
- Malware Scanning Integration
- Image Watermarking
- Multi-Region Storage Replication