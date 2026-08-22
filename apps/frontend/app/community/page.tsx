"use client";

import { useState } from "react";
import { communityPosts, CommunityPost } from "@/data/data";
import { Toolbar } from "@/components/shared/Toolbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { CommunityPostCard } from "@/components/ui/CommunityPostCard";

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("none");
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState("all"); // required by Toolbar, but not used

  const handleLike = (id: string) => {
    if (likedPosts.has(id)) return;
    
    // Track local liked post
    setLikedPosts(prev => new Set(prev).add(id));
    
    // Immutably increment like count
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, likeCount: post.likeCount + 1 } : post
    ));
  };

  // 1. Filter
  const filtered = posts.filter(post => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (
      post.destination.toLowerCase().includes(lowerSearch) ||
      post.content.toLowerCase().includes(lowerSearch)
    );
  });

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likeCount - a.likeCount;
    }
    // "recent" by default
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });

  // 3. Group
  let content;
  if (sorted.length === 0) {
    content = (
      <EmptyState 
        message="No community posts match your search." 
        actionLabel="Clear Search"
        onAction={() => setSearch("")}
      />
    );
  } else if (groupBy === "none") {
    content = (
      <div className="list">
        {sorted.map(post => (
          <CommunityPostCard 
            key={post.id} 
            post={post} 
            onLike={handleLike} 
            isLiked={likedPosts.has(post.id)}
          />
        ))}
      </div>
    );
  } else {
    // Grouping
    const grouped = sorted.reduce((acc, post) => {
      const key = groupBy === "destination" ? post.destination : post.activityType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(post);
      return acc;
    }, {} as Record<string, CommunityPost[]>);

    content = Object.entries(grouped).map(([groupName, groupPosts]) => (
      <div key={groupName} style={{ marginBottom: "2rem" }}>
        <h3 style={{ paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-border)", marginBottom: "1rem" }}>
          {groupName}
        </h3>
        <div className="list">
          {groupPosts.map(post => (
            <CommunityPostCard 
              key={post.id} 
              post={post} 
              onLike={handleLike} 
              isLiked={likedPosts.has(post.id)}
            />
          ))}
        </div>
      </div>
    ));
  }

  return (
    <main className="page-main" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Community</h1>
      </div>

      <Toolbar 
        searchValue={search}
        onSearchChange={setSearch}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        groupByOptions={[
          { label: "None", value: "none" },
          { label: "Destination", value: "destination" },
          { label: "Activity Type", value: "activityType" }
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={[
          { label: "Most recent", value: "recent" },
          { label: "Most popular", value: "popular" }
        ]}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        // Omit filterOptions to hide the dropdown, since we aren't filtering by status
      />

      {content}
    </main>
  );
}
