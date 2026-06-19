"use client";

import { Star, MessageSquare } from "lucide-react";
import { useState } from "react";

interface Review {
  rating: number;
  review_text?: string;
  created_at: string;
  user_id: string;
}

export default function ProductReviews({ productId, reviews = [], isLoggedIn }: { productId: string, reviews?: Review[], isLoggedIn?: boolean }) {
  const [showReviews, setShowReviews] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    
    setIsSubmitting(true);
    try {
      const { submitProductReview } = await import("../../app/shop/actions");
      const result = await submitProductReview(productId, rating, reviewText);
      
      if (result.success) {
        setSubmitSuccess(true);
        setReviewText("");
        // Optimistically add to local UI as "pending"
        setLocalReviews([{
          rating,
          review_text: reviewText,
          created_at: new Date().toISOString(),
          user_id: "me", // Placeholder
          is_approved: false
        } as any, ...localReviews]);
      } else {
        alert(result.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there are no reviews, fallback to a mock "4.8" or "0.0" based on requirements.
  // The prompt asks to "replace the hardcoded 4.8/124 with real aggregates".
  const approvedReviews = localReviews.filter((r: any) => r.is_approved !== false);
  const totalReviews = approvedReviews.length;
  const averageRating = totalReviews > 0
    ? (approvedReviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
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
              {localReviews.map((review: any, i) => (
                <div key={i} className={`pb-3 border-b border-border/30 last:border-0 last:pb-0 ${review.is_approved === false ? 'opacity-60' : ''}`}>
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
                    {review.is_approved === false && (
                      <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Pending Approval</span>
                    )}
                  </div>
                  {review.review_text && (
                    <p className="text-xs text-foreground/80 mt-1">{review.review_text}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Write a Review Form */}
          {isLoggedIn ? (
            <div className="mt-5 pt-5 border-t border-border/50">
              <h4 className="font-bold text-sm mb-3">Write a Review</h4>
              {submitSuccess ? (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                  Thank you! Your review has been submitted and is waiting for admin approval.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground/30 fill-muted-foreground/30 hover:fill-yellow-500/50 hover:text-yellow-500/50"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="What did you think about this product?"
                    className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="mt-5 pt-5 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">Please log in to write a review.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
