const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const reviewService = {
  submitReview: async (reviewData) => {
    const response = await fetch(`${API_BASE_URL}/api/reviews/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    return response.text();
  }
};

export default reviewService;