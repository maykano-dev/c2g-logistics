"use client";

import { Star, MessageSquare } from "lucide-react";
import { useState } from "react";

interface Review {
  rating: number;
  review_text?: string;
  created_at: string;
  user_id: string;
}

export default function ProductReviews({ reviews = [], isLoggedIn }: { reviews?: Review[], isLoggedIn?: boolean }) {
  const [showReviews, setShowReviews] = useState(false);

  // If there are no reviews, fallback to a mock "4.8" or "0.0" based on requirements.
  // The prompt asks to "replace the hardcoded 4.8/124 with real aggregates".
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <div className="w-full">
      <div 
        className="flex items-center gap-1 text-yellow-500 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setShowReviews(!showReviews)}
      >
        <span className="font-medium text-foreground mr-1 text-sm">
          {averageRating}
        </span>
        {"★★★★★".split("").map((star, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.round(Number(averageRating))
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground/30 fill-muted-foreground/30"
            }`}
          />
        ))}
        <span className="text-muted-foreground ml-2 text-xs hover:underline">
          ({totalReviews} reviews)
        </span>
      </div>

      {showReviews && (
        <div className="mt-4 p-4 rounded-xl bg-secondary/20 border border-border/50">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Customer Reviews
          </h3>
          {totalReviews === 0 ? (
            <p className="text-xs text-muted-foreground">No reviews yet. Buy this item to be the first to review!</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {reviews.map((review, i) => (
                <div key={i} className="pb-3 border-b border-border/30 last:border-0 last:pb-0">
                  <div className="flex items-center gap-1 mb-1">
                    {"★★★★★".split("").map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3 h-3 ${
                          starIdx < review.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground/30 fill-muted-foreground/30"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.review_text && (
                    <p className="text-xs text-foreground/80 mt-1">{review.review_text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
