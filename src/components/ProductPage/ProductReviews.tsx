import type React from 'react';
import { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Pagination } from '../ui/pagination';
import { fetchProductReviews, deleteProductReview } from '../../services/api';
import { useToast } from '../ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { EditReviewForm } from './EditReviewForm';
import { isLoggedIn, getCurrentUserId } from '../../services/auth';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  purchaseVerified?: boolean;
}

interface ProductReviewsProps {
  productId: number;
  onReviewsUpdate?: () => void;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  onReviewsUpdate,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    loadReviews(currentPage);
  }, [productId, currentPage]);

  const loadReviews = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductReviews(productId, page);
      setReviews(data.reviews);
      setTotalPages(data.pages);
    } catch (err) {
      setError('Failed to load reviews. Please try again later.');
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    try {
      await deleteProductReview(reviewToDelete);
      toast({
        title: 'Review deleted',
        description: 'Your review has been successfully deleted.',
      });
      loadReviews(currentPage);
      if (onReviewsUpdate) onReviewsUpdate();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingReview(null);
    loadReviews(currentPage);
    if (onReviewsUpdate) onReviewsUpdate();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => loadReviews(currentPage)}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No reviews yet. Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.userName}</span>
                {review.purchaseVerified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    Verified Purchase
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-2">
                  {formatDate(review.date)}
                </span>
              </div>
            </div>

            {isLoggedIn() && currentUserId === review.userId && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleEditReview(review)}
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteClick(review.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            )}
          </div>

          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Edit Review Dialog */}
      {editingReview && (
        <Dialog
          open={!!editingReview}
          onOpenChange={() => setEditingReview(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Your Review</DialogTitle>
            </DialogHeader>
            <EditReviewForm
              reviewId={editingReview.id}
              initialRating={editingReview.rating}
              initialComment={editingReview.comment}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingReview(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
