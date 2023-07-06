import React, { useState } from 'react';
import axios from 'axios';
import RestaurantForm from './components/RestaurantForm';
import NewReviews from './components/NewReviews';
import Reviews from './components/Reviews';
import Loading from './components/Loading';

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
  const [loading, setLoading] = useState(false);

  const scrapeData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/scrape/${restaurant}`
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <RestaurantForm
        restaurant={restaurant}
        setRestaurant={setRestaurant}
        onScrapeData={scrapeData}
      />
      {loading ? (
        <Loading message="Loading..." />
      ) : (
        data && (
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
              <NewReviews newReviews={newReviews} />
            ) : newReviews === null ? null : (
              <div className="mt-6 text-gray-500">No New Reviews</div>
            )}
            <Reviews reviews={data.reviews} />
          </div>
        )
      )}
    </div>
  );
}

export default App;
