import React from 'react';
import ReviewItem from './ReviewItem';

type Review = {
  id: number;
  source: string;
  date: string;
  text: string;
  rating: number;
};

type ReviewsProps = {
  reviews: Review[];
};

const Reviews = ({ reviews }: ReviewsProps) => {
  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <ReviewItem review={review} key={review.id} />
      ))}
    </div>
  );
};

export default Reviews;
