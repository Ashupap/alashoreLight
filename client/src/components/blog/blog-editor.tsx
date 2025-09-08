import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { insertBlogPostSchema, type InsertBlogPostSchema, type BlogPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { marked } from "marked";

interface BlogEditorProps {
  post?: BlogPost | null;
  onClose: () => void;
}

export default function BlogEditor({ post, onClose }: BlogEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const form = useForm<InsertBlogPostSchema>({
    resolver: zodResolver(insertBlogPostSchema),
    mode: "onChange",
    defaultValues: {
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      featuredImage: post?.featuredImage || "",
      category: post?.category || "Industry",
      published: post?.published ?? true,
      slug: post?.slug || "",
    },
  });

  const saveBlogPost = useMutation({
    mutationFn: async (data: InsertBlogPostSchema) => {
      if (post?.id) {
        // Update existing post
        const response = await apiRequest("PUT", `/api/blog/${post.id}`, data);
        return response.json();
      } else {
        // Create new post
        const response = await apiRequest("POST", "/api/blog", data);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: post?.id ? "Blog post updated successfully!" : "Blog post created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/temp-login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: post?.id ? "Failed to update blog post. Please try again." : "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadImage = useMutation({
    mutationFn: async (file: File): Promise<{ url: string; id: number; filename: string }> => {
      console.log("=== CLIENT UPLOAD DEBUG START ===");
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      // Use client-side compression and base64 encoding (same as product upload)
      // This completely bypasses server upload and nginx limits
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          try {
            console.log("Processing image with client-side compression");
            
            // Calculate new dimensions (max 800px width/height)
            const maxSize = 800;
            let { width, height } = img;
            
            if (width > height) {
              if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
              }
            }
            
            // Set canvas size and draw compressed image
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Convert to base64 with compression
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            
            console.log("Image compressed successfully");
            console.log("Original size:", file.size, "bytes");
            console.log("Compressed size:", Math.round(compressedDataUrl.length * 0.75), "bytes (estimated)");
            console.log("=== CLIENT UPLOAD DEBUG SUCCESS (BASE64) ===");
            
            // Return a response that matches the expected format
            resolve({
              url: compressedDataUrl,
              id: Date.now(), // Generate a temporary ID
              filename: file.name
            });
          } catch (error) {
            console.error("Error processing image:", error);
            reject(new Error("Failed to process image"));
          }
        };
        
        img.onerror = () => {
          console.error("Failed to load image for processing");
          reject(new Error("Failed to load image"));
        };
        
        // Load image from file
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            img.src = e.target.result as string;
          }
        };
        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        reader.readAsDataURL(file);
      });
    },
    onSuccess: (data) => {
      console.log("Upload mutation success, setting form value:", data.url);
      form.setValue('featuredImage', data.url);
      setSelectedFileName(""); // Clear the filename after successful upload
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    },
    onError: (error) => {
      console.log("=== CLIENT UPLOAD DEBUG ERROR ===");
      console.error("Upload mutation error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertBlogPostSchema) => {
    console.log("=== FORM SUBMIT DEBUG START ===");
    console.log("Form submitted with data:", data);
    console.log("Form errors:", form.formState.errors);
    console.log("Form isValid:", form.formState.isValid);
    console.log("Form isDirty:", form.formState.isDirty);
    
    // Convert markdown content to HTML
    const htmlContent = await marked(data.content);
    
    // Generate slug from title if not provided
    const slugifiedData = {
      ...data,
      content: htmlContent,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };
    
    console.log("Final data to send:", slugifiedData);
    console.log("=== CALLING MUTATION ===");
    saveBlogPost.mutate(slugifiedData);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Set the selected file name immediately
      setSelectedFileName(file.name);
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        setSelectedFileName("");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        setSelectedFileName("");
        return;
      }

      uploadImage.mutate(file);
    }
  };

  const categories = ["Industry", "Sustainability", "Quality", "Company News", "Technology"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-ocean-blue to-marine-teal text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold">
                {post?.id ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <p className="text-blue-100 mt-1">
                {post?.id ? "Update your blog post content and settings" : "Share insights and stories with your audience"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              data-testid="button-close-editor"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Title Field with modern styling */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-900">Post Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter an engaging title for your blog post..."
                        {...field}
                        className="text-lg p-4 border-2 border-gray-200 focus:border-ocean-blue rounded-xl"
                        data-testid="input-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>
                      <div className="space-y-4">
                        {/* Image Upload Button */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              disabled={uploadImage.isPending}
                              data-testid="button-upload-image"
                            >
                              <Upload size={16} className="mr-2" />
                              {uploadImage.isPending ? "Uploading..." : "Upload Image"}
                            </Button>
                            {field.value && (
                              <div className="flex items-center text-sm text-green-600">
                                <ImageIcon size={16} className="mr-1" />
                                Image uploaded
                              </div>
                            )}
                          </div>
                          
                          {/* Selected File Name */}
                          {selectedFileName && (
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md border">
                              <span className="font-medium">Selected: </span>
                              {selectedFileName}
                              {uploadImage.isPending && (
                                <span className="ml-2 text-blue-600">• Uploading...</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* URL Input (alternative) */}
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Or paste image URL..."
                            {...field}
                            value={field.value || ""}
                            data-testid="input-featured-image"
                          />
                        </FormControl>
                        
                        {/* Image Preview */}
                        {field.value && (
                          <div className="border rounded-lg p-2 bg-gray-50">
                            <img 
                              src={field.value} 
                              alt="Featured image preview" 
                              className="max-h-32 w-auto rounded object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Excerpt Field */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-900">Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Write a compelling summary that will appear in post previews..."
                        {...field}
                        value={field.value || ""}
                        className="border-2 border-gray-200 focus:border-ocean-blue rounded-xl p-4 resize-none"
                        data-testid="textarea-excerpt"
                      />
                    </FormControl>
                    <div className="text-sm text-gray-500 mt-1">
                      Recommended: 150-160 characters for optimal display
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content Field with rich text area */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-900">Content</FormLabel>
                    <FormControl>
                      <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-ocean-blue">
                        {/* Formatting Toolbar */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-700">
                              ✍️ Content Editor
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <span className="bg-white px-2 py-1 rounded border">
                                💡 <strong>Ctrl+B</strong> for bold
                              </span>
                              <span className="bg-white px-2 py-1 rounded border">
                                💡 <strong>Ctrl+I</strong> for italic
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content area with better formatting */}
                        <div className="relative">
                          <Textarea
                            rows={18}
                            placeholder="Write your blog content here! You can use simple formatting:

# Main Heading
## Section Heading
### Subsection

**Bold text** or *italic text*

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered list item
2. Another numbered item

> This is a quote or important note

---

The editor will automatically convert these to proper HTML when you publish!"
                            {...field}
                            className="border-0 focus:ring-0 resize-none rounded-none text-base leading-relaxed font-mono"
                            data-testid="textarea-content"
                            onKeyDown={(e) => {
                              // Simple keyboard shortcuts for formatting
                              if (e.ctrlKey || e.metaKey) {
                                if (e.key === 'b') {
                                  e.preventDefault();
                                  const textarea = e.target as HTMLTextAreaElement;
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const selectedText = textarea.value.substring(start, end);
                                  const beforeText = textarea.value.substring(0, start);
                                  const afterText = textarea.value.substring(end);
                                  const newText = `${beforeText}**${selectedText}**${afterText}`;
                                  field.onChange(newText);
                                  setTimeout(() => {
                                    textarea.setSelectionRange(start + 2, end + 2);
                                  }, 0);
                                } else if (e.key === 'i') {
                                  e.preventDefault();
                                  const textarea = e.target as HTMLTextAreaElement;
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const selectedText = textarea.value.substring(start, end);
                                  const beforeText = textarea.value.substring(0, start);
                                  const afterText = textarea.value.substring(end);
                                  const newText = `${beforeText}*${selectedText}*${afterText}`;
                                  field.onChange(newText);
                                  setTimeout(() => {
                                    textarea.setSelectionRange(start + 1, end + 1);
                                  }, 0);
                                }
                              }
                            }}
                          />
                        </div>
                        
                        {/* Format Helper */}
                        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-600">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong>Headings:</strong> # Main, ## Section, ### Sub
                            </div>
                            <div>
                              <strong>Text:</strong> **bold**, *italic*, `code`
                            </div>
                            <div>
                              <strong>Lists:</strong> - bullet or 1. numbered
                            </div>
                            <div>
                              <strong>Quote:</strong> {"> Important note"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Publishing controls */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-4 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-published"
                          className="w-5 h-5"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-lg font-semibold text-gray-900">
                          Publish immediately
                        </FormLabel>
                        <p className="text-sm text-gray-600">
                          {field.value 
                            ? "This post will be visible to the public immediately" 
                            : "Save as draft - you can publish later from the admin panel"
                          }
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  💡 Don't forget to add a compelling featured image to attract readers
                </div>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="px-8 py-3"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={saveBlogPost.isPending}
                    className="bg-gradient-to-r from-ocean-blue to-marine-teal hover:from-deep-navy hover:to-ocean-blue text-white px-8 py-3 font-semibold"
                    data-testid="button-publish"
                    onClick={() => {
                      console.log("=== PUBLISH BUTTON CLICKED ===");
                      console.log("Form errors:", form.formState.errors);
                      console.log("Form values:", form.getValues());
                      console.log("Is pending:", saveBlogPost.isPending);
                      
                      // Get form values and submit manually
                      const formValues = form.getValues();
                      console.log("Triggering handleSubmit manually");
                      form.handleSubmit(onSubmit)(formValues as any);
                    }}
                  >
                    {saveBlogPost.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {post?.id ? "Updating..." : "Publishing..."}
                      </>
                    ) : (
                      post?.id 
                        ? (form.watch('published') ? "Update & Publish" : "Update Draft")
                        : (form.watch('published') ? "Publish Post" : "Save Draft")
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
