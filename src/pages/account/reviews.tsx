import { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { fetchUserReviews, deleteProductReview } from '../../services/api';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Button } from '../../components/ui/button';
import { Pagination } from '../../components/ui/pagination';
import { Star, Loader2, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { EditReviewForm } from '../../components/ProductPage/EditReviewForm';
import { Link } from 'react-router-dom';
import { isLoggedIn } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

interface UserReview {
  id: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
  product: {
    id: number;
    name: string;
    image: string | null;
  };
}

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: '/account/reviews' } });
      return;
    }

    loadReviews(currentPage);
  }, [currentPage, navigate]);

  const loadReviews = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserReviews(page);
      setReviews(data.reviews);
      setTotalPages(data.pages);
    } catch (err) {
      setError('Failed to load your reviews. Please try again later.');
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditReview = (review: UserReview) => {
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
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Account', href: '/account' },
            { label: 'My Reviews', href: '/account/reviews' },
          ]}
        />

        <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

        {loading && reviews.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => loadReviews(currentPage)}>Try Again</Button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <p className="text-gray-500 mb-4">
              You haven't written any reviews yet.
            </p>
            <Button asChild>
              <Link to="/categories">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/4 p-4 bg-gray-50 flex flex-col items-center sm:items-start">
                    <Link
                      to={`/product/${review.product.id}`}
                      className="block text-center sm:text-left"
                    >
                      <img
                        src={review.product.image || '/placeholder.svg'}
                        alt={review.product.name}
                        className="w-24 h-24 object-cover mx-auto sm:mx-0 mb-2"
                      />
                      <h3 className="font-medium line-clamp-2">
                        {review.product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="sm:w-3/4 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            {formatDate(review.date)}
                          </span>
                        </div>

                        {review.status === 'pending' && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full mt-1 inline-block">
                            Pending Approval
                          </span>
                        )}
                      </div>

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
                    </div>

                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
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
                Are you sure you want to delete this review? This action cannot
                be undone.
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
    </MainLayout>
  );
}
