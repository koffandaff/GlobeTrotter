"use client";

import { useState, useEffect } from "react";
import { Toolbar } from "@/components/shared/Toolbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { CommunityPostCard } from "@/components/ui/CommunityPostCard";
import { getCommunityTrips, likeCommunityTrip, unlikeCommunityTrip, ApiCommunityTrip } from "@/features/community/api/communityApi";
import { CommunityPost } from "@/data/data";

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("none");
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getCommunityTrips(1, 50, sortBy);
      
      const transformed: CommunityPost[] = data.trips.map((trip: ApiCommunityTrip) => ({
        id: trip.id,
        authorName: trip.user.username || `${trip.user.firstName} ${trip.user.lastName}`,
        authorInitials: (trip.user.firstName?.[0] || "") + (trip.user.lastName?.[0] || ""),
        destination: trip.name, // using trip name as destination here
        postedDate: trip.createdAt,
        content: trip.description || `Check out my new trip: ${trip.name}`,
        likeCount: trip._count.likes,
        tripOrActivityName: trip.name,
        activityType: "Trip",
      }));

      setPosts(transformed);
      setLoading(false);
    }

    loadData();
  }, [sortBy]);

  const handleLike = async (id: string) => {
    const isLiked = likedPosts.has(id);
    
    // Optimistic UI update
    if (isLiked) {
      setLikedPosts(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setPosts(prev => prev.map(post => 
        post.id === id ? { ...post, likeCount: Math.max(0, post.likeCount - 1) } : post
      ));
      
      try {
        await unlikeCommunityTrip(id);
      } catch (err) {
        // Revert on failure
        setLikedPosts(prev => new Set(prev).add(id));
        setPosts(prev => prev.map(post => 
          post.id === id ? { ...post, likeCount: post.likeCount + 1 } : post
        ));
      }
    } else {
      setLikedPosts(prev => new Set(prev).add(id));
      setPosts(prev => prev.map(post => 
        post.id === id ? { ...post, likeCount: post.likeCount + 1 } : post
      ));
      
      try {
        await likeCommunityTrip(id);
      } catch (err) {
        // Revert on failure
        setLikedPosts(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setPosts(prev => prev.map(post => 
          post.id === id ? { ...post, likeCount: Math.max(0, post.likeCount - 1) } : post
        ));
      }
    }
  };

  // 1. Filter
  const filtered = posts.filter(post => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (
      post.destination.toLowerCase().includes(lowerSearch) ||
      post.content.toLowerCase().includes(lowerSearch) ||
      post.authorName.toLowerCase().includes(lowerSearch)
    );
  });

  // 2. Sort (client-side sorting on top of backend)
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likeCount - a.likeCount;
    }
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });

  // 3. Group
  let content;
  if (loading) {
    content = <div className="spinner" style={{ margin: "40px auto" }} />;
  } else if (sorted.length === 0) {
    content = (
      <EmptyState 
        title="No results found"
        message="No community posts match your search."
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
      const key = groupBy === "destination" ? post.destination : (post.activityType || "General");
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
      />

      {content}
    </main>
  );
}
