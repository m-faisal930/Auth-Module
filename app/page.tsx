"use client";

import { useAuth } from "@/context/AuthContext";
import { BlogList } from "@/components/blog/BlogList";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PenSquare } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
    email: string;
  };
  status: "draft" | "published";
  publishedAt?: string;
  createdAt: string;
  readingTime: number;
  viewCount: number;
}

interface BlogsResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    totalBlogs: number;
    totalPages: number;
    currentPage: number;
    availableTags: string[];
  };
  message: string;
}

export default function Home() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      const page = searchParams.get("page") || "1";
      const search = searchParams.get("search");
      const tag = searchParams.get("tag");
      const sortBy = searchParams.get("sortBy") || "newest";

      params.append("page", page);
      params.append("limit", "9");
      params.append("status", "published");

      if (search) params.append("search", search);
      if (tag) params.append("tag", tag);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(`/api/blogs?${params.toString()}`);
      const data: BlogsResponse = await response.json();

      if (data.success) {
        setBlogs(data.data.blogs);
        setTotalBlogs(data.data.totalBlogs);
        setTotalPages(data.data.totalPages);
        setCurrentPage(data.data.currentPage);
        setAvailableTags(data.data.availableTags);
      } else {
        setError(data.message || "Failed to fetch blogs");
      }
    } catch (err) {
      setError("An error occurred while fetching blogs");
      console.error("Error fetching blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchParams]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 4000,
      theme: "light",
      transition: Bounce,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 font-sans">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Amazing Stories
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore insightful articles, tutorials, and stories from our
            community of writers
          </p>
          {!user && (
            <Button asChild size="lg">
              <Link href="/signup">
                <PenSquare className="h-5 w-5 mr-2" />
                Start Writing Today
              </Link>
            </Button>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBlogs}</div>
              <p className="text-xs text-muted-foreground">
                Published articles
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableTags.length}</div>
              <p className="text-xs text-muted-foreground">Different topics</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Reading Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  blogs.reduce((acc, blog) => acc + blog.readingTime, 0) /
                    blogs.length
                ) || 0}{" "}
                min
              </div>
              <p className="text-xs text-muted-foreground">
                Average per article
              </p>
            </CardContent>
          </Card>
        </div>

        <BlogFilters availableTags={availableTags} />

        <BlogList
          blogs={blogs}
          isLoading={isLoading}
          error={error}
          showAuthor={true}
          showActions={false}
          emptyMessage="No published blogs found. Be the first to write something!"
        />

        {totalPages > 1 && (
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalBlogs={totalBlogs}
            blogsPerPage={9}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
