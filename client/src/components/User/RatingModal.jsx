import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';

const RatingModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ratingOptions = [1, 2, 3, 4, 5];

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, feedback });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setFeedback('');
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">LEAVE A RATING</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Thank you!</h4>
              <p className="mt-1 text-sm text-gray-500">Your review has been published.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {ratingOptions.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleStarClick(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none hover:cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          (hoverRating || rating) >= value ? 'text-yellow-400' : 'text-gray-300'
                        }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea
                  id="feedback"
                  name="feedback"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write down your feedback about our product & services"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={rating === 0}
                className={`w-full inline-flex justify-center px-4 py-2 text-white font-medium rounded-md hover:cursor-pointer
                  ${rating > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-200 cursor-not-allowed'}`}
              >
                Publish Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
