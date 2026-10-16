
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function BlogDetails() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`${API_URL}/posts/${slug}/`);

        if (!response.ok) {
          throw new Error("Blog post not found.");
        }

        const data = await response.json();
        setPost(data);
      } catch {
        setError("Could not load this blog post.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return <main className="blog-details"><p>Loading blog post...</p></main>;
  }

  if (error) {
    return (
      <main className="blog-details">
        <p>{error}</p>
        <Link to="/">← Back to Home</Link>
      </main>
    );
  }

  return (
    <main className="blog-details">
      <Link to="/">← Back to Home</Link>

      <article>
        <p className="blog-category">{post.category_name}</p>

        <h1>{post.title}</h1>

        <p className="blog-excerpt">{post.excerpt}</p>

        <div className="blog-meta">
          <span>Views: {post.views}</span>

          {post.published_at && (
            <span>
              Published:{" "}
              {new Date(post.published_at).toLocaleDateString()}
            </span>
          )}
        </div>

        {post.tags?.length > 0 && (
          <div className="blog-tags">
            {post.tags.map((tag) => (
              <span key={tag.id ?? tag.slug}>
                {tag.name ?? tag}
              </span>
            ))}
          </div>
        )}

        <div className="blog-content">
          {post.content}
        </div>
      </article>
    </main>
  );
}

export default BlogDetails;
