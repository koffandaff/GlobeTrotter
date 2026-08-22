import { CommunityPost } from "@/data/data";

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike: (id: string) => void;
  isLiked: boolean;
}

export function CommunityPostCard({ post, onLike, isLiked }: CommunityPostCardProps) {
  const dateStr = new Date(post.postedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="card list-row" style={{ alignItems: "flex-start" }}>
      <div className="avatar-btn" style={{ cursor: "default" }}>
        {post.authorInitials}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
          <div>
            <h4 style={{ margin: 0 }}>{post.authorName}</h4>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
              {dateStr}
            </div>
          </div>
          <div className="badge badge-accent">
            {post.destination}
          </div>
        </div>
        
        <h5 style={{ margin: "0.5rem 0 0.25rem 0", color: "var(--color-text-main)" }}>
          {post.tripOrActivityName}
        </h5>
        
        <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.5" }}>
          {post.content}
        </p>
        
        <div style={{ marginTop: "1rem" }}>
          <button 
            className={`btn ${isLiked ? "btn-accent" : "btn-outline"}`} 
            style={{ padding: "0.3rem 0.75rem", fontSize: "0.9rem" }}
            onClick={() => onLike(post.id)}
            disabled={isLiked}
          >
            {isLiked ? "♥ Liked" : "♡ Like"} ({post.likeCount})
          </button>
        </div>
      </div>
    </div>
  );
}
