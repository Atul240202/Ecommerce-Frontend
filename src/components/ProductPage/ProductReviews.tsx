import { Star } from 'lucide-react';

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

interface ProductReviewsProps {
  reviews: Review[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-500'>
          Be the first one to share your review & rating.
        </p>
      </div>
    );
  }

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className='space-y-6'>
      {/* Overall Rating */}
      <div className='flex items-center gap-4'>
        <div className='text-4xl font-bold'>{averageRating.toFixed(1)}</div>
        <div>
          <div className='flex gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className='text-sm text-gray-500'>
            Based on {reviews.length} reviews
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className='space-y-4'>
        {reviews.map((review, index) => (
          <div key={index} className='border-b border-gray-200 pb-4'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='flex gap-1'>
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
              </div>
              <span className='text-sm text-gray-500'>
                by {review.reviewerName}
              </span>
            </div>
            <p className='text-gray-700'>{review.comment}</p>
            <p className='text-sm text-gray-500 mt-1'>
              {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
