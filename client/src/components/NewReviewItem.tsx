import React from 'react';

type Review = {
  id: number;
  source: string;
  date: string;
  text: string;
  rating: number;
};

type NewReviewItemProps = {
  review: Review;
};

const NewReviewItem = ({ review }: NewReviewItemProps) => {
  return (
    <div key={review.id} className="bg-green-100 rounded-md shadow-md p-4">
      <p className="text-lg font-bold mb-2">Rating: {review.rating}/5</p>
      <p className="text-gray-500 mb-2">Reviewer: {review.source}</p>
      <p>{review.text}</p>
      <p className="text-gray-500 mt-2">Date: {review.date}</p>
    </div>
  );
};

export default NewReviewItem;
