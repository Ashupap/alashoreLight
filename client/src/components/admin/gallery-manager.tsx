import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Trash2, Search, Grid, List, Image as ImageIcon, Tag, Plus, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { MediaFile } from "@shared/schema";

interface GalleryManagerProps {
  onClose: () => void;
}

// Our Gallery categories to match the media page filters
const galleryCategories = [
  { name: "facility", color: "bg-blue-500 text-white", displayName: "Facility" },
  { name: "processing", color: "bg-orange-500 text-white", displayName: "Processing" },
  { name: "operations", color: "bg-teal-500 text-white", displayName: "Operations" },
  { name: "team", color: "bg-pink-500 text-white", displayName: "Team" },
  { name: "quality", color: "bg-green-500 text-white", displayName: "Quality" },
  { name: "sustainability", color: "bg-emerald-500 text-white", displayName: "Sustainability" },
  { name: "awards", color: "bg-amber-500 text-black", displayName: "Awards" },
  { name: "community", color: "bg-purple-500 text-white", displayName: "Community" },
];

export default function GalleryManager({ onClose }: GalleryManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDescription, setUploadDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaFiles, isLoading } = useQuery<MediaFile[]>({
    queryKey: ["/api/media"],
    queryFn: async () => {
      const response = await fetch("/api/media");
      if (!response.ok) throw new Error("Failed to fetch gallery images");
      return response.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Gallery image uploaded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setIsUploading(false);
      setUploadDescription("");
      setSelectedTags([]);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete image");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Gallery image deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setSelectedFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("category", "gallery");
    
    // Add description and tags as alt text
    const altText = [
      uploadDescription,
      ...selectedTags.map(tag => `#${tag}`)
    ].filter(Boolean).join(" ");
    
    if (altText) {
      formData.append("alt", altText);
    }
    
    uploadMutation.mutate(formData);
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleAddCustomTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.toLowerCase().trim())) {
      setSelectedTags(prev => [...prev, newTag.toLowerCase().trim()]);
      setNewTag("");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteSelected = () => {
    if (selectedFiles.length === 0) return;
    
    selectedFiles.forEach((id) => {
      deleteMutation.mutate(id);
    });
  };

  const handleFileClick = (file: MediaFile) => {
    setSelectedFiles(prev => 
      prev.includes(file.id) 
        ? prev.filter(id => id !== file.id)
        : [...prev, file.id]
    );
  };

  const handleDownload = (file: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFullsize = (file: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(file.url, '_blank');
  };

  const filteredFiles = mediaFiles?.filter(file =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.alt && file.alt.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTagsFromAlt = (alt?: string | null) => {
    if (!alt) return [];
    const hashTags = alt.match(/#\w+/g) || [];
    return hashTags.map(tag => tag.substring(1));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Gallery Management</h2>
            <p className="text-gray-600">Upload and manage gallery images with colorful tags</p>
          </div>
          <Button variant="ghost" onClick={onClose} data-testid="button-close-gallery-manager">
            <X size={20} />
          </Button>
        </div>

        {/* Upload Form */}
        <div className="p-4 sm:p-6 border-b bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Description
              </label>
              <Textarea
                placeholder="Describe this image for better organization..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                className="w-full"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-3">
                {galleryCategories.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => handleTagToggle(tag.name)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag.name)
                        ? tag.color + " ring-2 ring-offset-2 ring-gray-400"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    #{tag.displayName}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Custom tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                  className="flex-1"
                />
                <Button onClick={handleAddCustomTag} variant="outline" size="sm">
                  <Plus size={16} />
                </Button>
              </div>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tag) => {
                    const tagConfig = galleryCategories.find(t => t.name === tag);
                    return (
                      <Badge
                        key={tag}
                        className={tagConfig ? tagConfig.color : "bg-gray-500 text-white"}
                      >
                        #{tag}
                        <button
                          onClick={() => handleTagToggle(tag)}
                          className="ml-2 hover:bg-white/20 rounded"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="bg-ocean-blue hover:bg-deep-navy"
              data-testid="button-upload-gallery-image"
            >
              <Upload size={16} className="mr-2" />
              {isUploading ? "Uploading..." : "Upload Gallery Image"}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1 w-full sm:w-auto">
              <div className="relative w-full sm:flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search gallery images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-gallery"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-grid-view"
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-testid="button-list-view"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {selectedFiles.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={deleteMutation.isPending}
                  data-testid="button-delete-selected"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete ({selectedFiles.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No images found" : "No gallery images yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Upload your first gallery image to get started"
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleUploadClick}
                  className="bg-ocean-blue hover:bg-deep-navy"
                  data-testid="button-upload-first-gallery-image"
                >
                  <Upload size={16} className="mr-2" />
                  Upload First Image
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => {
                const fileTags = getFileTagsFromAlt(file.alt);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedFiles.includes(file.id) 
                        ? "border-ocean-blue ring-2 ring-ocean-blue/20" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleFileClick(file)}
                    data-testid={`gallery-image-${file.id}`}
                  >
                    <img
                      src={file.url}
                      alt={file.alt ?? file.originalName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="space-y-1">
                        <p className="truncate font-medium">{file.originalName}</p>
                        <p className="text-gray-300">{formatFileSize(file.size)}</p>
                        {fileTags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {fileTags.slice(0, 3).map((tag) => {
                              const tagConfig = galleryCategories.find(t => t.name === tag);
                              return (
                                <span
                                  key={tag}
                                  className={`px-1 py-0.5 rounded text-[10px] ${
                                    tagConfig ? tagConfig.color : "bg-gray-500"
                                  }`}
                                >
                                  #{tag}
                                </span>
                              );
                            })}
                            {fileTags.length > 3 && (
                              <span className="text-[10px] text-gray-400">+{fileTags.length - 3}</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-end space-x-1 mt-2">
                          <button
                            onClick={(e) => handleViewFullsize(file, e)}
                            className="p-1 hover:bg-white/20 rounded"
                            title="View Fullsize"
                          >
                            <ExternalLink size={12} />
                          </button>
                          <button
                            onClick={(e) => handleDownload(file, e)}
                            className="p-1 hover:bg-white/20 rounded"
                            title="Download"
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {selectedFiles.includes(file.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-ocean-blue rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => {
                const fileTags = getFileTagsFromAlt(file.alt);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedFiles.includes(file.id)
                        ? "bg-ocean-blue/10 border border-ocean-blue"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => handleFileClick(file)}
                    data-testid={`gallery-image-list-${file.id}`}
                  >
                    <img
                      src={file.url}
                      alt={file.alt ?? file.originalName}
                      className="w-16 h-16 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.classList.remove('hidden');
                          fallback.innerHTML = '<div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg></div>';
                        }
                      }}
                    />
                    <div className="hidden"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{file.originalName}</h4>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(file.size)} • {file.mimeType}
                      </p>
                      {fileTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {fileTags.map((tag) => {
                            const tagConfig = galleryCategories.find(t => t.name === tag);
                            return (
                              <span
                                key={tag}
                                className={`px-2 py-0.5 rounded text-xs ${
                                  tagConfig ? tagConfig.color : "bg-gray-500 text-white"
                                }`}
                              >
                                #{tag}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500">
                        {new Date(file.createdAt!).toLocaleDateString()}
                      </div>
                      <button
                        onClick={(e) => handleViewFullsize(file, e)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="View Fullsize"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDownload(file, e)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          data-testid="gallery-file-input"
        />
      </motion.div>
    </div>
  );
}