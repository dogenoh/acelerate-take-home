import React, { useState } from 'react';
import axios from 'axios';

type Restaurant = {
  id: number;
  name: string;
  doordashStoreId: number;
  reviews: Review[];
};

type Review = {
  id: number;
  source: string;
  date: string;
  text: string;
  rating: number;
  restaurantId: number;
  restaurant: Restaurant;
};

function App() {
  const [restaurant, setRestaurant] = useState('');
  const [data, setData] = useState<Restaurant | null>(null);
  const [newReviews, setNewReviews] = useState<Review[] | null>(null);

  const scrapeData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/scrape/${restaurant}`
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/scrape/${restaurant}`
      );
      const fetchedReviews = response.data.reviews;

      // Find the new reviews that are not already included in the existing reviews
      const newReviews = fetchedReviews.filter(
        (review: Review) =>
          !data?.reviews.some(
            (existingReview) => existingReview.text === review.text
          )
      );

      console.log('NEW ', newReviews);

      if (newReviews.length > 0) {
        setNewReviews(newReviews);
      } else {
        setNewReviews([]);
      }

      console.log('Review', newReviews);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  console.log(data);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="self-center">
        <h1 className="text-3xl font-bold mb-4">Acelerate Take-Home</h1>
        <input
          type="text"
          value={restaurant}
          placeholder="Search restaurants"
          onChange={(e) => setRestaurant(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md mb-4"
        />
        <button
          onClick={scrapeData}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Get Ratings &amp; Reviews
        </button>
      </div>
      {data && (
        <div>
          <h2 className="text-2xl font-bold mt-6 mb-4">
            {data.name.toUpperCase()}
          </h2>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Refresh Data
          </button>
          <h3 className="text-xl font-bold mt-6 mb-2">Reviews</h3>
          {newReviews && newReviews.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">New Reviews</h3>
              <div className="grid gap-4">
                {newReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-green-100 rounded-md shadow-md p-4"
                  >
                    <p className="text-lg font-bold mb-2">
                      Rating: {review.rating}/5
                    </p>
                    <p className="text-gray-500 mb-2">
                      Reviewer: {review.source}
                    </p>
                    <p>{review.text}</p>
                    <p className="text-gray-500 mt-2">Date: {review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : newReviews === null ? null : (
            <div className="mt-6 text-gray-500">No New Reviews</div>
          )}
          <div className="grid gap-4">
            {data.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-md shadow-md p-4"
              >
                <p className="text-lg font-bold mb-2">
                  Rating: {review.rating}/5
                </p>
                <p className="text-gray-500 mb-2">Reviewer: {review.source}</p>
                <p>{review.text}</p>
                <p className="text-gray-500 mt-2">Date: {review.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
