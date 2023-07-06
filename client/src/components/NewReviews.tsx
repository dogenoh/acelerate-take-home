import React from 'react';
import NewReviewItem from './NewReviewItem';

type Review = {
  id: number;
  source: string;
  date: string;
  text: string;
  rating: number;
};

type NewReviewsProps = {
  newReviews: Review[];
};

const NewReviews = ({ newReviews }: NewReviewsProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2">New Reviews</h3>
      <div className="grid gap-4">
        {newReviews.map((review) => (
          <NewReviewItem review={review} key={review.id} />
        ))}
      </div>
    </div>
  );
};

export default NewReviews;
