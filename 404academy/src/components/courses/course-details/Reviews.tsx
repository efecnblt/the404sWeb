const Reviews = ({ authorData, courseData }: { authorData: any; courseData: any }) => {
   // `courseData` veya `ratingCount` undefined olabilir, bu yüzden kontrol ediyoruz
   const review_data =
       courseData && courseData.ratingCount
           ? calculateReviewDistribution(courseData.rating, courseData.ratingCount)
           : [];

   return (
       <div className="courses__rating-wrap">
          <h2 className="title">Reviews</h2>
          {authorData && courseData && (
              <div className="course-rate">
                 {/* Özet Bilgi */}
                 <div className="course-rate__summary">
                    <div className="course-rate__summary-value">
                       {isNaN(courseData.rating) ? "No Rating" : courseData.rating.toFixed(1)}
                    </div>
                    <div className="course-rate__summary-stars">
                       {/* Yıldızları rating'e göre doldur */}
                       {[...Array(5)].map((_, index) => (
                           <i
                               key={index}
                               className={`fas fa-star ${
                                   index < Math.round(courseData.rating) ? "filled" : ""
                               }`}
                           ></i>
                       ))}
                    </div>
                    <div className="course-rate__summary-text">
                       {courseData.ratingCount || 0} Reviews
                    </div>
                 </div>

                 {/* İnceleme Detayları */}
                 <div className="course-rate__details">
                    {review_data.length > 0 ? (
                        review_data.map((item) => (
                            <div key={item.id} className="course-rate__details-row">
                               <div className="course-rate__details-row-star">
                                  {item.rating}
                                  <i className="fas fa-star"></i>
                               </div>
                               <div className="course-rate__details-row-value">
                                  <div className="rating-gray"></div>
                                  <div
                                      className="rating"
                                      style={{ width: `${item.width}%` }}
                                      title={`${item.width.toFixed(1)}%`}
                                  ></div>
                                  <span className="rating-count">{item.review}</span>
                               </div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews available.</p>
                    )}
                 </div>
              </div>
          )}
       </div>
   );
};

/**
 * Distributes totalReviews across star ratings [5..1] based on a normal distribution
 * centered at averageRating. This usually generates a more realistic spread of reviews.
 *
 * @param averageRating - The average rating (e.g. 4.3).
 * @param totalReviews  - The total number of reviews (e.g. 120).
 * @returns Array of objects, each with { id, rating, review, width }.
 */
const calculateReviewDistribution = (averageRating: number, totalReviews: number) => {
   // Return an empty array if data is invalid
   if (!averageRating || !totalReviews || totalReviews <= 0) {
      return [];
   }

   // We’ll define star ratings from 5 down to 1
   // so index=0 corresponds to rating=5, index=4 corresponds to rating=1
   const starRatings = [5, 4, 3, 2, 1];

   // A helper function to compute the normal PDF
   // For a rating r, mean `averageRating`, and standard deviation `stdDev`
   function normalPDF(x: number, mean: number, stdDev: number) {
      const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
      return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
   }

   // You can adjust stdDev to make the distribution narrower or wider
   const stdDev = 0.8;

   // 1) Compute the PDF for each star rating
   const pdfArray = starRatings.map((r) => normalPDF(r, averageRating, stdDev));

   // 2) Normalize so that the sum of probabilities = 1
   const sum = pdfArray.reduce((acc, val) => acc + val, 0);
   const distribution = pdfArray.map((val) => val / sum);

   // 3) Multiply by totalReviews and round to an integer
   const counts = distribution.map((prob) => Math.round(prob * totalReviews));

   // 4) Fix rounding discrepancies so total matches exactly totalReviews
   const currentSum = counts.reduce((acc, val) => acc + val, 0);
   const diff = totalReviews - currentSum;
   if (diff !== 0) {
      // We'll add or subtract the difference from the star bucket with the highest PDF
      // (since that's presumably where the biggest chunk should go).
      let maxIdx = 0;
      for (let i = 1; i < pdfArray.length; i++) {
         if (pdfArray[i] > pdfArray[maxIdx]) {
            maxIdx = i;
         }
      }
      counts[maxIdx] += diff;
   }

   // 5) Construct the final array matching your desired shape
   // starRatings[0] = 5, starRatings[4] = 1
   return counts.map((count, index) => ({
      id: index + 1,
      rating: starRatings[index],                // e.g. 5,4,3,2,1
      review: count,                             // how many reviews at this star level
      width: (count / totalReviews) * 100 || 0,  // percentage for display
   }));
};


export default Reviews;
