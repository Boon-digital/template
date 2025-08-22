# Scripts

This directory contains utility scripts for managing your Sanity content.

## Upload Placeholder Image

The `upload-placeholder-image.js` script uploads a placeholder image to your Sanity project and adds it to the MediaText section on your homepage.

### Prerequisites

Make sure you have the following environment variables set in your `.env.local` file:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
SANITY_API_WRITE_TOKEN=your_write_token
```

### How to Run

```bash
npm run upload-placeholder
```

### What it does

1. **Uploads a placeholder image**: Creates a professional SVG placeholder image and uploads it to your Sanity assets
2. **Updates your homepage**: Either:
   - Updates an existing MediaText section with the placeholder image
   - Creates a new MediaText section with the placeholder image if none exists
   - Creates a new homepage if it doesn't exist

### Features

- **Professional design**: The placeholder image has a clean, modern design
- **Proper alt text**: Includes descriptive alt text for accessibility
- **Safe updates**: Uses Sanity's patch API to safely update existing content
- **Error handling**: Comprehensive error handling with helpful messages

### Customization

You can modify the `placeholder-image.svg` file to change the design of the placeholder image. The script will automatically use the updated design when you run it again.

### Troubleshooting

If you encounter errors:

1. **Check environment variables**: Ensure `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_WRITE_TOKEN` are set correctly
2. **Verify permissions**: Make sure your write token has the necessary permissions
3. **Check network**: Ensure you have internet connectivity to reach Sanity's API
4. **Review logs**: The script provides detailed logging to help identify issues
