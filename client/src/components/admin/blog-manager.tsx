import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Calendar,
  User,
  FileText,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { BlogPost } from "@shared/schema";
import BlogEditor from "@/components/blog/blog-editor";

export default function BlogManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete blog post");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      if (!response.ok) throw new Error("Failed to update blog post");
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: `Blog post ${variables.published ? "published" : "unpublished"} successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleTogglePublish = (post: BlogPost) => {
    togglePublishMutation.mutate({
      id: post.id,
      published: !post.published,
    });
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  const filteredPosts = blogPosts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const publishedCount = blogPosts?.filter(post => post.published).length || 0;
  const draftCount = blogPosts?.filter(post => !post.published).length || 0;

  if (showEditor) {
    return (
      <BlogEditor 
        post={editingPost}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Blog Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create, edit, and manage your blog posts
          </p>
        </div>
        <Button
          onClick={() => setShowEditor(true)}
          className="bg-ocean-blue hover:bg-deep-navy"
          data-testid="button-create-blog-post"
        >
          <Plus size={20} className="mr-2" />
          Create New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published Posts</p>
              <p className="text-3xl font-bold text-gray-900">{publishedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <EyeOff className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Draft Posts</p>
              <p className="text-3xl font-bold text-gray-900">{draftCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{blogPosts?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-blog-posts"
            />
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No posts found" : "No blog posts yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms"
                : "Create your first blog post to get started"
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowEditor(true)}
                className="bg-ocean-blue hover:bg-deep-navy"
                data-testid="button-create-first-blog-post"
              >
                <Plus size={16} className="mr-2" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                data-testid={`blog-post-card-${post.id}`}
              >
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.featuredImage.includes('unsplash') ? `${post.featuredImage}&q=85&w=400&h=300` : post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge 
                      variant={post.published ? "default" : "secondary"}
                      className={post.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-blog-post-menu-${post.id}`}
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEdit(post)}
                          data-testid={`button-edit-blog-post-${post.id}`}
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTogglePublish(post)}
                          data-testid={`button-toggle-publish-${post.id}`}
                        >
                          {post.published ? (
                            <>
                              <EyeOff size={16} className="mr-2" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye size={16} className="mr-2" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 focus:text-red-600"
                          data-testid={`button-delete-blog-post-${post.id}`}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-ocean-blue transition-colors">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block bg-ocean-blue/10 text-ocean-blue px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  
                  {/* Footer with dates and actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center mb-1">
                        <Calendar size={12} className="mr-1" />
                        {formatDistanceToNow(new Date(post.createdAt!), { addSuffix: true })}
                      </div>
                      {post.updatedAt && post.updatedAt !== post.createdAt && (
                        <div className="flex items-center text-gray-400">
                          <Edit size={12} className="mr-1" />
                          Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post)}
                      className="text-ocean-blue hover:text-deep-navy hover:bg-ocean-blue/10"
                      data-testid={`button-edit-blog-post-${post.id}`}
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}