"use client";

import React, { useState } from "react";
import styles from "./SocialMediaFeed.module.css";

interface SocialPost {
  id: string;
  platform: "twitter" | "instagram" | "facebook";
  author: string;
  handle?: string;
  profileImage?: string;
  content: string;
  image?: string;
  timestamp: string;
  likes?: number;
  comments?: number;
  shares?: number;
  followers?: number;
  isVerified?: boolean;
}

interface SocialMediaFeedProps {
  posts?: SocialPost[];
}

const DEFAULT_POSTS: SocialPost[] = [
  {
    id: "1",
    platform: "twitter",
    author: "SRIT - Anantapur",
    handle: "@sritatp",
    content: "🎉 PLACEMENTS 2026 | TCS | WE ACHIEVED BIG! 🚀\n\nWe are proud to announce a remarkable placement milestone at Srinivasa Ramanujan Institute of Technology (Autonomous).\n\n⭐ 103 Students Selected in Tata Consultancy Services (TCS)\n\n💼 Placement Highlights:\n◆ TCS Digital – 24",
    timestamp: "24 Jan",
    likes: 245,
    comments: 32,
    shares: 58,
    isVerified: true,
  },
  {
    id: "2",
    platform: "twitter",
    author: "SRIT - Anantapur",
    handle: "@sritatp",
    content: "Congratulations to our students on their amazing achievements! Keep pushing boundaries and reaching for the stars. Your success is our pride! 🌟",
    timestamp: "23 Jan",
    likes: 189,
    comments: 28,
    shares: 42,
    isVerified: true,
  },
  {
    id: "3",
    platform: "instagram",
    author: "sritatp",
    handle: "sritatp",
    content: "Campus life at SRIT - Creating memories, building futures! 📸",
    image: "/placeholder-instagram.jpg",
    timestamp: "22 Jan",
    likes: 523,
    comments: 47,
  },
  {
    id: "4",
    platform: "facebook",
    author: "Srinivasa Ramanujan Institute of Technology",
    content: "Join us for an exciting seminar on emerging technologies and career opportunities! Register now! 🎓",
    timestamp: "21 Jan",
    likes: 342,
    comments: 56,
    shares: 78,
    followers: 20860,
  },
  {
    id: "5",
    platform: "twitter",
    author: "SRIT - Anantapur",
    handle: "@sritatp",
    content: "Welcome to the New Year! Let's make 2026 a year of achievements, innovation, and growth. Together, we rise! 💪",
    timestamp: "1 Jan",
    likes: 412,
    comments: 65,
    shares: 93,
    isVerified: true,
  },
];

export default function SocialMediaFeed({ posts = DEFAULT_POSTS }: SocialMediaFeedProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "twitter" | "instagram" | "facebook">("all");

  const filteredPosts = activeFilter === "all" ? posts : posts.filter(post => post.platform === activeFilter);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "#1DA1F2";
      case "instagram":
        return "#E4405F";
      case "facebook":
        return "#1877F2";
      default:
        return "#ff6b35";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "𝕏";
      case "instagram":
        return "📷";
      case "facebook":
        return "f";
      default:
        return "📱";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Social Media Feed</h2>
        <p>Stay connected with our latest updates</p>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterBtn} ${activeFilter === "all" ? styles.active : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All Posts
        </button>
        <button
          className={`${styles.filterBtn} ${activeFilter === "twitter" ? styles.active : ""}`}
          onClick={() => setActiveFilter("twitter")}
        >
          𝕏 Twitter
        </button>
        <button
          className={`${styles.filterBtn} ${activeFilter === "instagram" ? styles.active : ""}`}
          onClick={() => setActiveFilter("instagram")}
        >
          📷 Instagram
        </button>
        <button
          className={`${styles.filterBtn} ${activeFilter === "facebook" ? styles.active : ""}`}
          onClick={() => setActiveFilter("facebook")}
        >
          Facebook
        </button>
      </div>

      {/* Posts Grid */}
      <div className={styles.postsGrid}>
        {filteredPosts.map((post, index) => (
          <div
            key={post.id}
            className={styles.postCard}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Platform Badge */}
            <div
              className={styles.platformBadge}
              style={{ backgroundColor: getPlatformColor(post.platform) }}
            >
              {getPlatformIcon(post.platform)}
            </div>

            {/* Post Header */}
            <div className={styles.postHeader}>
              <div className={styles.authorInfo}>
                <h3>
                  {post.author}
                  {post.isVerified && <span className={styles.verified}>✓</span>}
                </h3>
                {post.handle && <p className={styles.handle}>@{post.handle}</p>}
              </div>
              <span className={styles.timestamp}>{post.timestamp}</span>
            </div>

            {/* Post Content */}
            <div className={styles.postContent}>
              <p>{post.content}</p>
              {post.image && (
                <div className={styles.postImage}>
                  <img src={post.image} alt="Post" />
                </div>
              )}
            </div>

            {/* Post Stats */}
            <div className={styles.postStats}>
              {post.likes && (
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>❤️</span>
                  <span>{post.likes.toLocaleString()}</span>
                </div>
              )}
              {post.comments && (
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>💬</span>
                  <span>{post.comments.toLocaleString()}</span>
                </div>
              )}
              {post.shares && (
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>🔄</span>
                  <span>{post.shares.toLocaleString()}</span>
                </div>
              )}
              {post.followers && (
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>👥</span>
                  <span>{post.followers.toLocaleString()} followers</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.actionBtn}>❤️ Like</button>
              <button className={styles.actionBtn}>💬 Comment</button>
              <button className={styles.actionBtn}>🔄 Share</button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className={styles.emptyState}>
          <p>No posts found for this platform</p>
        </div>
      )}
    </div>
  );
}
