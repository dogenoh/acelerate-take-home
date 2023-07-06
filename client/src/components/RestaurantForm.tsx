import React from 'react';

type RestaurantFormProps = {
  restaurant: string;
  setRestaurant: (value: string) => void;
  onScrapeData: () => void;
};

const RestaurantForm = ({ restaurant, setRestaurant, onScrapeData }: RestaurantFormProps) => {
  return (
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
        onClick={onScrapeData}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Get Ratings &amp; Reviews
      </button>
    </div>
  );
};

export default RestaurantForm;
