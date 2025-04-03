'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Star, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { submitProductReview, verifyProductPurchase } from '../../services/api';
import { useToast } from '../ui/use-toast';
import { isLoggedIn, getCurrentUser } from '../../services/auth';

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPurchaseVerified, setIsPurchaseVerified] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(false);
  const { toast } = useToast();
  const isUserLoggedIn = isLoggedIn();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (isUserLoggedIn) {
      checkPurchaseVerification();
    }
  }, [isUserLoggedIn, productId]);

  const checkPurchaseVerification = async () => {
    setIsCheckingPurchase(true);
    try {
      const { verified } = await verifyProductPurchase(productId);
      setIsPurchaseVerified(verified);
    } catch (error) {
      console.error('Error checking purchase verification:', error);
    } finally {
      setIsCheckingPurchase(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUserLoggedIn) {
      toast({
        title: 'Login Required',
        description: 'Please log in to submit a review',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your review comment',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitProductReview(productId, {
        rating,
        comment,
      });

      toast({
        title: 'Success',
        description: 'Your review has been submitted successfully',
      });

      // Reset form
      setRating(5);
      setComment('');

      // Notify parent component
      onReviewSubmitted();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to submit your review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isUserLoggedIn) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Login Required</h4>
            <p className="text-amber-700 text-sm mt-1">
              Please log in to submit a review for this product.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h3 className="text-lg font-semibold">Write a Review</h3>

      {isCheckingPurchase ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Verifying purchase...
        </div>
      ) : isPurchaseVerified ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-sm text-green-700 flex items-center gap-2">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
            Verified Purchase
          </span>
          Your review will be marked as a verified purchase.
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          You can still leave a review, but it won't be marked as a verified
          purchase.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  value <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="block text-sm font-medium mb-1"
        >
          Your Review
        </label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product"
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </Button>
    </form>
  );
};
