import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize GitHub API
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Upload file to GitHub
app.post('/api/upload-to-github', async (req, res) => {
  try {
    const { content, filename, message } = req.body;

    if (!content || !filename) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content dan filename diperlukan' 
      });
    }

    // Convert content to base64
    const contentBase64 = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');

    // Check if file exists to get SHA (required for updates)
    let sha = null;
    try {
      const { data: existingFile } = await octokit.rest.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: filename,
        ref: process.env.GITHUB_BRANCH,
      });
      sha = existingFile.sha;
    } catch (error) {
      // File doesn't exist, that's okay for new files
      console.log('File tidak ditemukan, akan membuat file baru');
    }

    // Create or update file
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: filename,
      message: message || `Update ${filename} via web app`,
      content: contentBase64,
      branch: process.env.GITHUB_BRANCH,
      ...(sha && { sha }), // Include SHA if updating existing file
    });

    res.json({
      success: true,
      message: 'File berhasil diupload ke GitHub',
      data: {
        commit: response.data.commit,
        content: response.data.content,
      }
    });

  } catch (error) {
    console.error('GitHub upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal mengupload ke GitHub'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GitHub Upload Server berjalan',
    config: {
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      branch: process.env.GITHUB_BRANCH,
      hasToken: !!process.env.GITHUB_TOKEN
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📁 GitHub: ${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`);
});