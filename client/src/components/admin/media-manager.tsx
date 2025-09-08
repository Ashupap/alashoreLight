import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Trash2, Edit, Search, Grid, List, Image as ImageIcon, Folder, FolderPlus, Plus, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { MediaFile } from "@shared/schema";

interface MediaManagerProps {
  onClose: () => void;
  onSelect?: (file: MediaFile) => void;
  selectMode?: boolean;
}

export default function MediaManager({ onClose, onSelect, selectMode = false }: MediaManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("general");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaFiles, isLoading } = useQuery<MediaFile[]>({
    queryKey: ["/api/media"],
  });

  // Get unique categories from media files
  const categories = mediaFiles ? 
    Array.from(new Set(mediaFiles.map(file => file.category || 'general'))).sort() : 
    [];

  // Get category statistics
  const getCategoryStats = (category: string) => {
    if (!mediaFiles) return 0;
    return mediaFiles.filter(file => (file.category || 'general') === category).length;
  };

  const getTotalSize = (category: string) => {
    if (!mediaFiles) return 0;
    return mediaFiles
      .filter(file => (file.category || 'general') === category)
      .reduce((total, file) => total + file.size, 0);
  };

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
        description: "File uploaded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
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
      if (!response.ok) throw new Error("Failed to delete file");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setSelectedFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete file",
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
    formData.append("category", uploadCategory);
    
    uploadMutation.mutate(formData);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Invalid folder name",
        description: "Please enter a valid folder name",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(newFolderName.toLowerCase())) {
      toast({
        title: "Folder exists",
        description: "A folder with this name already exists",
        variant: "destructive",
      });
      return;
    }

    // Create a placeholder file in the new category to establish it
    setUploadCategory(newFolderName.toLowerCase());
    setSelectedCategory(newFolderName.toLowerCase());
    setNewFolderName("");
    setShowNewFolderDialog(false);
    
    toast({
      title: "Folder created",
      description: `Created folder "${newFolderName}". Upload files to populate it.`,
    });
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
    if (selectMode && onSelect) {
      onSelect(file);
      onClose();
    } else {
      // Toggle selection for bulk operations
      setSelectedFiles(prev => 
        prev.includes(file.id) 
          ? prev.filter(id => id !== file.id)
          : [...prev, file.id]
      );
    }
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

  const filteredFiles = mediaFiles?.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.alt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      (file.category || 'general') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex"
      >
        {/* Folder Sidebar */}
        <div className="w-48 sm:w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Folders</h3>
              <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <FolderPlus size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateFolder}>
                        Create Folder
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {/* All Files */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === "all" 
                    ? "bg-ocean-blue text-white" 
                    : "hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <Folder size={16} className="mr-2" />
                  <span className="font-medium">All Files</span>
                </div>
                <span className="text-xs opacity-75">
                  {mediaFiles?.length || 0}
                </span>
              </button>

              {/* Category Folders */}
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === category 
                      ? "bg-ocean-blue text-white" 
                      : "hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <Folder size={16} className="mr-2" />
                    <span className="font-medium capitalize">{category}</span>
                  </div>
                  <div className="text-xs opacity-75">
                    <div>{getCategoryStats(category)}</div>
                    <div className="text-[10px]">{formatFileSize(getTotalSize(category))}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900">
                {selectMode ? "Select Media" : "Media Library"}
              </h2>
              <p className="text-gray-600">
                {selectedCategory === "all" 
                  ? `${mediaFiles?.length || 0} files total`
                  : `${filteredFiles.length} files in ${selectedCategory}`
                }
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              data-testid="button-close-media-manager"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="p-6 border-b">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-media"
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
                {selectedFiles.length > 0 && !selectMode && (
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
                
                {!selectMode && categories.length > 0 && (
                  <Select value={uploadCategory} onValueChange={setUploadCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      {categories.filter(cat => cat !== 'general').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {!selectMode && (
                  <Button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="bg-ocean-blue hover:bg-deep-navy"
                    data-testid="button-upload-file"
                  >
                    <Upload size={16} className="mr-2" />
                    {isUploading ? "Uploading..." : "Upload File"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[60vh] p-4 sm:p-6">
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
                {searchTerm ? "No files found" : "No media files yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Upload images and files to get started"
                }
              </p>
              {!searchTerm && !selectMode && (
                <Button
                  onClick={handleUploadClick}
                  className="bg-ocean-blue hover:bg-deep-navy"
                  data-testid="button-upload-first-file"
                >
                  <Upload size={16} className="mr-2" />
                  Upload First File
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
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
                  data-testid={`media-file-${file.id}`}
                >
                  <img
                    src={file.url}
                    alt={file.alt || file.originalName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{file.originalName}</p>
                        <p className="text-gray-300">{formatFileSize(file.size)}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
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
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
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
                  data-testid={`media-file-list-${file.id}`}
                >
                  <img
                    src={file.url}
                    alt={file.alt || file.originalName}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{file.originalName}</h4>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(file.size)} • {file.mimeType}
                    </p>
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
              ))}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="file-input"
          />
        </div>
      </motion.div>
    </div>
  );
}