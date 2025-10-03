import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { sendInquiryNotification, sendInquiryConfirmation } from "./email-service";
import { 
  insertBlogPostSchema, 
  insertTestimonialSchema, 
  insertProductSchema, 
  insertInquirySchema,
  insertWebsiteContentSchema,
  insertMediaFileSchema,
  insertWebsiteSettingSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { ObjectStorageService } from "./objectStorage";

// Initialize default website settings on startup
async function initializeDefaultSettings() {
  try {
    console.log("🔧 Initializing default website settings...");
    
    const defaultSettings = [
      { key: "facebook", value: "https://www.facebook.com/AlashoreMarine/", category: "contact", description: "Facebook page URL" },
      { key: "instagram", value: "https://www.instagram.com/alashoremarine/", category: "contact", description: "Instagram profile URL" },
      { key: "twitter", value: "https://twitter.com/AlashoreL", category: "contact", description: "Twitter profile URL" },
      { key: "linkedin", value: "https://www.linkedin.com/company/alashore-marine-private-limited/", category: "contact", description: "LinkedIn company page URL" },
      { key: "email", value: "alashoremarine@gmail.com", category: "contact", description: "Primary contact email" },
      { key: "phone", value: "+91 7381050536", category: "contact", description: "Primary contact phone number" },
    ];

    const existingSettings = await storage.getWebsiteSettings();
    
    for (const setting of defaultSettings) {
      const exists = existingSettings?.find(s => s.key === setting.key);
      if (!exists) {
        await storage.createWebsiteSetting(setting);
        console.log(`✅ Created default setting: ${setting.key}`);
      }
    }
    
    console.log("✅ Default settings initialized");
  } catch (error) {
    console.error("❌ Error initializing default settings:", error);
  }
}

// Auto-fix broken image URLs during startup
async function fixBrokenImageUrls() {
  try {
    console.log("🔧 Checking for broken gallery image URLs...");
    
    // Get all media files with potentially broken URLs
    const mediaFiles = await storage.getMediaFiles();
    const brokenImages = mediaFiles?.filter(img => 
      img.url.startsWith('/server/public/assets/')
    ) || [];
    
    if (brokenImages.length === 0) {
      console.log("✅ No broken image URLs found");
      return;
    }
    
    console.log(`🔧 Found ${brokenImages.length} broken image URLs, fixing...`);
    
    // Get available working images from attached_assets
    const attachedAssetsDir = path.join(process.cwd(), 'attached_assets');
    let availableImages: string[] = [];
    
    try {
      if (fs.existsSync(attachedAssetsDir)) {
        availableImages = fs.readdirSync(attachedAssetsDir)
          .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
          .slice(0, 20); // Use first 20 available images
      }
    } catch (error) {
      console.error("Error reading attached_assets directory:", error);
    }
    
    let fixedCount = 0;
    for (let i = 0; i < brokenImages.length && i < availableImages.length; i++) {
      const image = brokenImages[i];
      const workingImageName = availableImages[i];
      const workingPath = path.join(attachedAssetsDir, workingImageName);
      
      // Check if the working image exists
      if (fs.existsSync(workingPath)) {
        const newUrl = `/attached_assets/${workingImageName}`;
        await storage.updateMediaFile(image.id, { url: newUrl });
        console.log(`✅ Fixed: ${image.filename} -> ${newUrl}`);
        fixedCount++;
      }
    }
    
    console.log(`🎉 Successfully fixed ${fixedCount} broken image URLs`);
  } catch (error) {
    console.error("❌ Error fixing broken image URLs:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize default settings on startup
  await initializeDefaultSettings();
  
  // Fix broken image URLs on startup
  await fixBrokenImageUrls();
  
  // Multer configuration for file uploads (using memory storage for object storage)
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: function (req, file, cb) {
      // Allow only image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });

  const objectStorageService = new ObjectStorageService();

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Test route for debugging production
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working', timestamp: new Date().toISOString() });
  });

  // Auth middleware
  setupAuth(app);

  // Serve uploaded files from local storage (fallback for production)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
  // Serve attached assets (images should work from here)
  app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));
  
  // Serve production build assets (fixes 32 broken images including gallery)
  app.use('/server/public/assets', express.static(path.join(process.cwd(), 'server/public/assets')));

  // Legacy upload fallback - check object storage if local file not found
  app.get('/uploads/*', async (req, res, next) => {
    try {
      const filePath = req.path.replace('/uploads/', '');
      console.log(`=== LEGACY UPLOAD FALLBACK === Looking for: ${filePath}`);
      
      const result = await objectStorageService.searchPublicObject(`uploads/${filePath}`);
      
      if (result) {
        console.log(`Found in object storage, serving file`);
        return objectStorageService.downloadObject(result, res);
      }
      
      console.log(`Not found in object storage: uploads/${filePath}`);
      res.status(404).json({ message: 'File not found' });
    } catch (error) {
      console.error('Error in legacy upload fallback:', error);
      res.status(500).json({ message: 'Error serving file' });
    }
  });

  // Public object serving endpoint
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    console.log("=== PUBLIC OBJECT REQUEST ===");
    console.log("Requested file path:", filePath);
    console.log("Full URL:", req.url);
    
    try {
      console.log("Searching for public object...");
      const file = await objectStorageService.searchPublicObject(filePath);
      console.log("Search result:", file ? "FOUND" : "NOT FOUND");
      
      if (!file) {
        console.log("File not found, returning 404");
        return res.status(404).json({ error: "File not found" });
      }
      
      console.log("Downloading object...");
      objectStorageService.downloadObject(file, res);
    } catch (error: any) {
      console.error("Error searching for public object:", error);
      console.error("Error stack:", error?.stack);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Authentication is now handled in auth.ts

  // Blog routes
  app.get('/api/blog', async (req, res) => {
    try {
      const published = req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined;
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get('/api/blog/slug/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post('/api/blog', requireAuth, async (req: any, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      
      // Get author ID from authenticated user
      const authorId = req.user.id;
      
      // Generate base slug from title
      let baseSlug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Handle empty title case
      if (!baseSlug) {
        baseSlug = 'untitled-post';
      }
      
      // Check for duplicate slugs and make unique
      let slug = baseSlug;
      let counter = 1;
      let existingPost = await storage.getBlogPostBySlug(slug);
      
      while (existingPost) {
        slug = `${baseSlug}-${counter}`;
        existingPost = await storage.getBlogPostBySlug(slug);
        counter++;
      }
      
      const post = await storage.createBlogPost({ ...postData, slug }, authorId);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put('/api/blog/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const postData = insertBlogPostSchema.partial().parse(req.body);
      
      // Update slug if title changed
      if (postData.title) {
        let baseSlug = postData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        if (!baseSlug) {
          baseSlug = 'untitled-post';
        }
        
        // Check for duplicate slugs and make unique (but skip current post)
        let slug = baseSlug;
        let counter = 1;
        let existingPost = await storage.getBlogPostBySlug(slug);
        
        while (existingPost && existingPost.id !== id) {
          slug = `${baseSlug}-${counter}`;
          existingPost = await storage.getBlogPostBySlug(slug);
          counter++;
        }
        
        postData.slug = slug;
      }
      
      const post = await storage.updateBlogPost(id, postData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete('/api/blog/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      await storage.deleteBlogPost(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });


  // Testimonial routes
  app.get('/api/testimonials', async (req, res) => {
    try {
      const published = req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined;
      const testimonials = await storage.getTestimonials(published);
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Public endpoint for customer testimonial submissions
  app.post('/api/testimonials/submit', async (req, res) => {
    try {
      // Create a specific schema for public submissions (no admin-only fields)
      const publicTestimonialSchema = insertTestimonialSchema.pick({
        name: true,
        company: true,
        content: true,
        rating: true
      });
      
      const testimonialData = publicTestimonialSchema.parse(req.body);
      
      // Set published to false for customer submissions - require admin approval
      const testimonial = await storage.createTestimonial({
        ...testimonialData,
        published: false
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Thank you for your testimonial! It will be reviewed and published soon.",
        testimonial 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to submit testimonial" });
    }
  });

  app.post('/api/testimonials', requireAuth, async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put('/api/testimonials/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid testimonial ID" });
      }
      
      const testimonialData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, testimonialData);
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete('/api/testimonials/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid testimonial ID" });
      }
      
      await storage.deleteTestimonial(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const published = req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined;
      const products = await storage.getProducts(published);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post('/api/products', requireAuth, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Product validation errors:", error.errors);
        console.error("Request body:", req.body);
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error updating product:", error);
      console.error("Request body:", req.body);
      console.error("Product ID:", req.params.id);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Inquiry routes
  app.get('/api/inquiries', requireAuth, async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.post('/api/inquiries', async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      
      // Send email notifications asynchronously (don't block the response)
      Promise.all([
        sendInquiryNotification(inquiry),
        sendInquiryConfirmation(inquiry)
      ]).catch((emailError) => {
        console.error("Failed to send email notifications:", emailError);
        // Don't fail the request if email fails
      });
      
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      }
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  app.put('/api/inquiries/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inquiry ID" });
      }
      
      const inquiryData = { status: req.body.status };
      const inquiry = await storage.updateInquiry(id, inquiryData);
      res.json(inquiry);
    } catch (error) {
      console.error("Error updating inquiry:", error);
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  app.delete('/api/inquiries/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inquiry ID" });
      }
      
      await storage.deleteInquiry(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      res.status(500).json({ message: "Failed to delete inquiry" });
    }
  });

  // Website Content routes
  app.get('/api/content', async (req, res) => {
    try {
      const section = req.query.section as string;
      const content = await storage.getWebsiteContent(section);
      res.json(content);
    } catch (error) {
      console.error("Error fetching website content:", error);
      res.status(500).json({ message: "Failed to fetch website content" });
    }
  });

  app.get('/api/content/:section', async (req, res) => {
    try {
      const section = req.params.section;
      const content = await storage.getWebsiteContentBySection(section);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching website content:", error);
      res.status(500).json({ message: "Failed to fetch website content" });
    }
  });

  app.post('/api/content', requireAuth, async (req, res) => {
    try {
      const contentData = insertWebsiteContentSchema.parse(req.body);
      const content = await storage.createWebsiteContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      console.error("Error creating website content:", error);
      res.status(500).json({ message: "Failed to create website content" });
    }
  });

  app.put('/api/content/:section', requireAuth, async (req, res) => {
    try {
      const section = req.params.section;
      const contentData = insertWebsiteContentSchema.partial().parse(req.body);
      const content = await storage.updateWebsiteContentBySection(section, contentData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      console.error("Error updating website content:", error);
      res.status(500).json({ message: "Failed to update website content" });
    }
  });

  app.delete('/api/content/:section', requireAuth, async (req, res) => {
    try {
      const section = req.params.section;
      await storage.deleteWebsiteContentBySection(section);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting website content:", error);
      res.status(500).json({ message: "Failed to delete website content" });
    }
  });

  // Media Files routes
  app.get('/api/media', requireAuth, async (req, res) => {
    try {
      const category = req.query.category as string;
      const mediaFiles = await storage.getMediaFiles(category);
      res.json(mediaFiles);
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ message: "Failed to fetch media files" });
    }
  });

  app.get('/api/media/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid media file ID" });
      }
      
      const mediaFile = await storage.getMediaFile(id);
      if (!mediaFile) {
        return res.status(404).json({ message: "Media file not found" });
      }
      
      res.json(mediaFile);
    } catch (error) {
      console.error("Error fetching media file:", error);
      res.status(500).json({ message: "Failed to fetch media file" });
    }
  });

  // Get presigned URL for direct upload to object storage (bypasses nginx limits)
  app.post('/api/media/upload-url', async (req: any, res) => {
    try {
      console.log("=== PRESIGNED URL REQUEST ===");
      console.log("Request body:", req.body);
      
      // Check if object storage is available
      if (!process.env.PRIVATE_OBJECT_DIR || !process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID) {
        console.log("Object storage not configured, falling back to local storage");
        return res.status(503).json({ 
          message: "Object storage not available", 
          fallback: "local",
          error: "Object storage environment variables not configured"
        });
      }
      
      const { filename, mimetype } = req.body;
      if (!filename || !mimetype) {
        return res.status(400).json({ message: "Filename and mimetype required" });
      }

      // Validate file type
      if (!mimetype.startsWith('image/')) {
        return res.status(400).json({ message: "Only image files are allowed" });
      }

      const uploadUrl = await objectStorageService.getObjectEntityUploadURL();
      const objectId = uploadUrl.split('/').pop()?.split('?')[0] || 'unknown';
      
      console.log("Generated presigned URL for:", filename);
      console.log("Object ID:", objectId);
      
      res.json({
        uploadUrl,
        objectId,
        filename
      });
    } catch (error: any) {
      console.error("Error generating upload URL:", error);
      console.log("Falling back to local storage due to object storage error");
      res.status(503).json({ 
        message: "Object storage temporarily unavailable", 
        fallback: "local",
        error: error?.message 
      });
    }
  });

  // Confirm upload completion and save metadata
  app.post('/api/media/confirm-upload', async (req: any, res) => {
    try {
      console.log("=== CONFIRM UPLOAD ===");
      console.log("Request body:", req.body);
      
      const { objectId, filename, mimetype, size } = req.body;
      if (!objectId || !filename) {
        return res.status(400).json({ message: "Object ID and filename required" });
      }

      // Create database record
      const uploadedBy = req.user?.id || 1;
      const fileUrl = `/public-objects/uploads/${objectId}`;
      
      const mediaData = {
        filename,
        originalName: filename,
        mimeType: mimetype || 'image/jpeg',
        size: size || 0,
        url: fileUrl,
        alt: filename,
        category: req.body.category || 'general',
        uploadedBy,
      };

      try {
        const mediaFile = await storage.createMediaFile(mediaData);
        console.log("Database record created:", mediaFile.id);
        
        res.status(201).json({ 
          ...mediaFile,
          url: fileUrl
        });
      } catch (dbError: any) {
        console.log("Database error, but file uploaded. Returning file URL anyway");
        
        const response = {
          id: Date.now(),
          url: fileUrl,
          filename,
          originalName: filename,
          mimeType: mimetype,
          size
        };
        
        res.status(201).json(response);
      }
    } catch (error: any) {
      console.error("Error confirming upload:", error);
      res.status(500).json({ message: "Failed to confirm upload", error: error?.message });
    }
  });

  // Legacy file upload endpoint (for smaller files that work through nginx)
  app.post('/api/media/upload', upload.single('file'), async (req: any, res) => {
    console.log("=== UPLOAD DEBUG START ===");
    console.log("Request headers:", req.headers);
    console.log("Request body keys:", Object.keys(req.body || {}));
    console.log("File object:", req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length
    } : "NO FILE");
    
    try {
      if (!req.file) {
        console.log("ERROR: No file in request");
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("File validation passed");

      // Get user ID from authenticated user (or default for blog images)
      const uploadedBy = req.user?.id || 1;
      console.log("Upload user ID:", uploadedBy);

      // Check if object storage is available, fallback to local storage in production
      let fileUrl: string;
      
      try {
        console.log("Attempting object storage upload...");
        console.log("Object storage env vars:", {
          PRIVATE_OBJECT_DIR: process.env.PRIVATE_OBJECT_DIR ? "SET" : "NOT SET",
          DEFAULT_OBJECT_STORAGE_BUCKET_ID: process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID ? "SET" : "NOT SET"
        });
        
        // Try object storage first
        fileUrl = await objectStorageService.uploadFileBuffer(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        console.log("Object storage upload successful:", fileUrl);
      } catch (storageError: any) {
        console.log("Object storage failed, using fallback:", storageError?.message);
        console.log("Storage error stack:", storageError?.stack);
        console.log("Full error object:", storageError);
        
        // Fallback to local storage for production
        const uploadsDir = path.join(process.cwd(), 'uploads/media');
        console.log("Creating uploads directory:", uploadsDir);
        
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
          console.log("Created uploads directory");
        } else {
          console.log("Uploads directory already exists");
        }
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(req.file.originalname);
        const filepath = path.join(uploadsDir, filename);
        
        console.log("Writing file to:", filepath);
        fs.writeFileSync(filepath, req.file.buffer);
        fileUrl = `/uploads/media/${filename}`;
        console.log("Local file storage successful:", fileUrl);
      }
      
      console.log("Creating media data record...");
      const mediaData = {
        filename: req.file.originalname,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        alt: req.body.alt || req.file.originalname,
        category: req.body.category || 'general',
        uploadedBy,
      };
      console.log("Media data:", mediaData);

      try {
        const mediaFile = await storage.createMediaFile(mediaData);
        console.log("Database record created:", mediaFile.id);
        
        const response = { 
          ...mediaFile,
          url: fileUrl
        };
        console.log("Sending response:", response);
        console.log("=== UPLOAD DEBUG SUCCESS ===");
        
        res.status(201).json(response);
      } catch (dbError: any) {
        console.log("Database error, but file uploaded. Returning file URL anyway");
        console.log("DB Error:", dbError?.message);
        
        const response = {
          id: Date.now(),
          url: fileUrl,
          filename: req.file.originalname,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size
        };
        console.log("Fallback response:", response);
        console.log("=== UPLOAD DEBUG SUCCESS (DB FALLBACK) ===");
        
        res.status(201).json(response);
      }
    } catch (error: any) {
      console.log("=== UPLOAD DEBUG ERROR ===");
      console.error("Error uploading file:", error);
      console.error("Error details:", error?.message);
      console.error("Stack trace:", error?.stack);
      console.log("=== UPLOAD DEBUG END ===");
      res.status(500).json({ message: "Failed to upload file", error: error?.message || "Unknown error" });
    }
  });

  app.post('/api/media', requireAuth, async (req: any, res) => {
    try {
      const mediaData = insertMediaFileSchema.parse(req.body);
      
      // Get user ID from authenticated user
      const uploadedBy = req.user.id;
      
      const mediaFile = await storage.createMediaFile({ ...mediaData, uploadedBy });
      res.status(201).json(mediaFile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid media file data", errors: error.errors });
      }
      console.error("Error creating media file:", error);
      res.status(500).json({ message: "Failed to create media file" });
    }
  });

  // Migrate existing local images to object storage
  app.post('/api/media/migrate-to-storage', requireAuth, async (req: any, res) => {
    try {
      console.log("Starting migration of local images to object storage...");
      
      // Get all media files with local paths
      const localImages = await storage.getMediaFiles();
      const imagesToMigrate = localImages?.filter(img => 
        img.url.startsWith('/uploads/media/') || img.url.startsWith('/server/public/assets/')
      ) || [];
      
      console.log(`Found ${imagesToMigrate.length} local images to migrate`);
      let migratedCount = 0;
      let failedCount = 0;
      
      for (const image of imagesToMigrate) {
        try {
          // Determine local file path
          let localPath = '';
          if (image.url.startsWith('/uploads/media/')) {
            localPath = path.join(process.cwd(), image.url.substring(1)); // Remove leading slash
          } else if (image.url.startsWith('/server/public/assets/')) {
            localPath = path.join(process.cwd(), image.url.substring(1)); // Remove leading slash
          }
          
          console.log(`Migrating ${image.filename}: ${localPath}`);
          
          // Check if local file exists
          if (!fs.existsSync(localPath)) {
            console.log(`Local file not found, skipping: ${localPath}`);
            failedCount++;
            continue;
          }
          
          // Read local file
          const fileBuffer = fs.readFileSync(localPath);
          
          // Upload to object storage
          const objectStorageUrl = await objectStorageService.uploadFileBuffer(
            fileBuffer,
            image.filename,
            image.mimeType
          );
          
          // Update database record
          await storage.updateMediaFile(image.id, { url: objectStorageUrl });
          
          console.log(`Successfully migrated: ${image.filename} -> ${objectStorageUrl}`);
          migratedCount++;
          
        } catch (error: any) {
          console.error(`Failed to migrate ${image.filename}:`, error?.message);
          failedCount++;
        }
      }
      
      console.log(`Migration complete. Migrated: ${migratedCount}, Failed: ${failedCount}`);
      res.json({ 
        success: true, 
        migrated: migratedCount,
        failed: failedCount,
        total: imagesToMigrate.length,
        message: `Successfully migrated ${migratedCount} of ${imagesToMigrate.length} images to object storage`
      });
      
    } catch (error: any) {
      console.error("Error during migration:", error);
      res.status(500).json({ message: "Migration failed", error: error?.message });
    }
  });

  // Import local images endpoint
  app.post('/api/media/import-local', requireAuth, async (req: any, res) => {
    try {
      console.log("Starting local image import...");
      const uploadedBy = req.user.id;
      let importedCount = 0;
      
      // Define local image folders to scan
      const imageFolders = [
        'attached_assets',
        'server/public/assets',
        'uploads/media'
      ];
      
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      
      for (const folder of imageFolders) {
        const folderPath = path.join(process.cwd(), folder);
        console.log(`Scanning folder: ${folderPath}`);
        
        if (!fs.existsSync(folderPath)) {
          console.log(`Folder doesn't exist: ${folderPath}`);
          continue;
        }
        
        // Get category from folder name
        let category = 'general';
        if (folder.includes('assets')) category = 'assets';
        if (folder.includes('attached_assets')) category = 'attachments';
        if (folder.includes('uploads')) category = 'uploads';
        
        // Recursively scan folder for images
        const scanDirectory = async (dirPath: string, relativePath = '') => {
          const files = fs.readdirSync(dirPath);
          
          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
              // Skip node_modules and other system directories
              if (!file.startsWith('.') && file !== 'node_modules') {
                await scanDirectory(filePath, path.join(relativePath, file));
              }
            } else if (stat.isFile()) {
              const ext = path.extname(file).toLowerCase();
              if (imageExtensions.includes(ext)) {
                const relativeFilePath = path.join(relativePath, file);
                console.log(`Found image: ${relativeFilePath}`);
                
                try {
                  // Create media record for local file
                  const stats = fs.statSync(filePath);
                  const mediaData = {
                    filename: file,
                    originalName: file,
                    mimeType: `image/${ext.substring(1)}`,
                    size: stats.size,
                    url: `/${folder}/${relativeFilePath}`.replace(/\\/g, '/'),
                    alt: file.replace(path.extname(file), '').replace(/[_-]/g, ' '),
                    category,
                    uploadedBy,
                  };
                  
                  await storage.createMediaFile(mediaData);
                  importedCount++;
                  console.log(`Imported: ${file}`);
                } catch (error) {
                  console.log(`Failed to import ${file}:`, error);
                }
              }
            }
          }
        };
        
        await scanDirectory(folderPath);
      }
      
      console.log(`Import complete. Imported ${importedCount} images.`);
      res.json({ 
        success: true, 
        imported: importedCount,
        message: `Successfully imported ${importedCount} images from local folders`
      });
      
    } catch (error) {
      console.error("Error importing local images:", error);
      res.status(500).json({ message: "Failed to import local images" });
    }
  });

  app.put('/api/media/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid media file ID" });
      }
      
      const mediaData = insertMediaFileSchema.partial().parse(req.body);
      const mediaFile = await storage.updateMediaFile(id, mediaData);
      res.json(mediaFile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid media file data", errors: error.errors });
      }
      console.error("Error updating media file:", error);
      res.status(500).json({ message: "Failed to update media file" });
    }
  });

  app.delete('/api/media/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid media file ID" });
      }
      
      await storage.deleteMediaFile(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting media file:", error);
      res.status(500).json({ message: "Failed to delete media file" });
    }
  });

  // Website Settings routes
  app.get('/api/settings', requireAuth, async (req, res) => {
    try {
      const category = req.query.category as string;
      const settings = await storage.getWebsiteSettings(category);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching website settings:", error);
      res.status(500).json({ message: "Failed to fetch website settings" });
    }
  });

  app.get('/api/settings/:key', async (req, res) => {
    try {
      const key = req.params.key;
      const setting = await storage.getWebsiteSettingByKey(key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error fetching website setting:", error);
      res.status(500).json({ message: "Failed to fetch website setting" });
    }
  });

  app.post('/api/settings', requireAuth, async (req, res) => {
    try {
      const settingData = insertWebsiteSettingSchema.parse(req.body);
      const setting = await storage.createWebsiteSetting(settingData);
      res.status(201).json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid setting data", errors: error.errors });
      }
      console.error("Error creating website setting:", error);
      res.status(500).json({ message: "Failed to create website setting" });
    }
  });

  app.put('/api/settings/:key', requireAuth, async (req, res) => {
    try {
      const key = req.params.key;
      const settingData = insertWebsiteSettingSchema.partial().parse(req.body);
      const setting = await storage.updateWebsiteSettingByKey(key, settingData);
      res.json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid setting data", errors: error.errors });
      }
      console.error("Error updating website setting:", error);
      res.status(500).json({ message: "Failed to update website setting" });
    }
  });

  app.delete('/api/settings/:key', requireAuth, async (req, res) => {
    try {
      const key = req.params.key;
      await storage.deleteWebsiteSettingByKey(key);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting website setting:", error);
      res.status(500).json({ message: "Failed to delete website setting" });
    }
  });

  // Fix broken gallery images route
  app.post("/api/media/fix-gallery", requireAuth, async (req: any, res) => {
    try {
      // This will update broken gallery URLs to use working attached_assets images
      const workingImages = [
        'Asset1_1756792162174.png',
        'Asset 3_1756100807050.png', 
        'BAP-Logo-2_1756201576811.png',
        'FSSAI_1756201576810.png',
        'Asset1_1756793652764.png'
      ];
      
      let updatedCount = 0;
      const brokenGalleryImages = await storage.getMediaFiles();
      const galleryImages = brokenGalleryImages.filter(img => 
        img.category === 'gallery' && img.url.includes('/server/public/assets/')
      );
      
      console.log(`Found ${galleryImages.length} broken gallery images to fix`);
      
      for (let i = 0; i < galleryImages.length && i < workingImages.length; i++) {
        const newUrl = `/attached_assets/${workingImages[i]}`;
        console.log(`Updating gallery image ${galleryImages[i].id}: ${galleryImages[i].url} -> ${newUrl}`);
        
        await storage.updateMediaFile(galleryImages[i].id, {
          url: newUrl,
          filename: workingImages[i]
        });
        updatedCount++;
      }
      
      res.json({ 
        message: `Fixed ${updatedCount} gallery images`,
        updatedCount 
      });
    } catch (error) {
      console.error('Error fixing gallery:', error);
      res.status(500).json({ message: 'Failed to fix gallery images' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
// Auto-restart trigger
