# File Upload Playbook

## Best Practices
- Validate file type client-side before upload
- Validate file size client-side before upload
- Show upload progress indicator
- Allow drag-and-drop with visual drop zone
- Show file preview after upload (image thumbnails)
- Handle upload failure with retry option
- Allow cancel during upload
- Limit concurrent uploads (3-5 max)
- Sanitize file names before storage
- Use Supabase Storage with RLS policies
- Generate thumbnails server-side for images
- Show file list with remove option
- Compress images before upload (client-side)

## Anti-Patterns
- No file type validation
- No file size limit
- No upload progress
- Blocking UI during upload
- Not cleaning up failed uploads
- No RLS on storage buckets
