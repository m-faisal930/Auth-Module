"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText, Plus, Eye, Clock, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalReadingTime: number;
}

interface RecentBlog {
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0,
    totalReadingTime: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);


        const response = await fetch("/api/blogs?limit=5&sortBy=newest");
        const data = await response.json();

        if (data.success) {
          const blogs = data.data.blogs;
          setRecentBlogs(blogs);


          const totalBlogs = data.data.totalBlogs || 0;
          const publishedBlogs = blogs.filter((blog: RecentBlog) => blog.status === "published").length;
          const draftBlogs = blogs.filter((blog: RecentBlog) => blog.status === "draft").length;
          const totalViews = blogs.reduce((sum: number, blog: RecentBlog) => sum + blog.viewCount, 0);
          const totalReadingTime = blogs.reduce((sum: number, blog: RecentBlog) => sum + blog.readingTime, 0);

          setStats({
            totalBlogs,
            publishedBlogs,
            draftBlogs,
            totalViews,
            totalReadingTime,
          });
        } else {
          setError(data.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An error occurred while fetching dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 font-sans">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your blog activity.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Link>
        </Button>
      </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedBlogs} published, {stats.draftBlogs} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all published posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReadingTime} min</div>
            <p className="text-xs text-muted-foreground">
              Total content created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.publishedBlogs > 0 ? Math.round(stats.totalViews / stats.publishedBlogs) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per published post
            </p>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="justify-start h-auto p-4">
              <Link href="/admin/blogs/new" className="flex flex-col items-start gap-2">
                <Plus className="h-5 w-5" />
                <div>
                  <div className="font-medium">Create New Blog</div>
                  <div className="text-sm text-muted-foreground">Write a new blog post</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="justify-start h-auto p-4">
              <Link href="/admin/blogs" className="flex flex-col items-start gap-2">
                <FileText className="h-5 w-5" />
                <div>
                  <div className="font-medium">Manage Blogs</div>
                  <div className="text-sm text-muted-foreground">Edit existing posts</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="justify-start h-auto p-4">
              <Link href="/" className="flex flex-col items-start gap-2">
                <Eye className="h-5 w-5" />
                <div>
                  <div className="font-medium">View Public Site</div>
                  <div className="text-sm text-muted-foreground">See how visitors see your blog</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Blog Posts</CardTitle>
          <Button asChild variant="outline">
            <Link href="/admin/blogs">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="skeleton h-12 w-12 rounded"></div>
                  <div className="space-y-2 flex-1">
                    <div className="skeleton h-4 w-3/4"></div>
                    <div className="skeleton h-3 w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-muted-foreground text-center py-8">{error}</p>
          ) : recentBlogs.length > 0 ? (
            <div className="space-y-4">
              {recentBlogs.slice(0, 5).map((blog) => (
                <div key={blog._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium line-clamp-1">{blog.title}</h3>
                      <Badge variant={blog.status === "published" ? "default" : "secondary"}>
                        {blog.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{blog.readingTime} min read</span>
                      <span>{blog.viewCount} views</span>
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/blogs/${blog._id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/${blog.slug}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No blog posts yet.</p>
              <Button asChild className="mt-4">
                <Link href="/admin/blogs/new">Create your first blog post</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}