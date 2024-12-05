

const Reviews = ({ authorData, courseData }: { authorData: any; courseData: any }) =>{
   const review_data = calculateReviewDistribution(courseData.rating, courseData.ratingCount);

   return (
      <div className="courses__rating-wrap">

         <h2 className="title">Reviews</h2>
         {authorData && courseData &&(

         <div className="course-rate">
            <div className="course-rate__summary">
               <div className="course-rate__summary-value">{courseData.rating}</div>
               <div className="course-rate__summary-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
               </div>
               <div className="course-rate__summary-text">
                  {courseData.ratingCount}
               </div>
            </div>
            <div className="course-rate__details">

               {review_data.map((item) => (
                  <div key={item.id} className="course-rate__details-row">
                     <div className="course-rate__details-row-star">
                        {item.rating}
                        <i className="fas fa-star"></i>
                     </div>
                     <div className="course-rate__details-row-value">
                        <div className="rating-gray"></div>
                        <div className="rating" style={{ width: `${item.width}%` }} title="80%"></div>
                        <span className="rating-count">{item.review}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         )}
      </div>
   )
}


const calculateReviewDistribution = (averageRating: number, totalReviews: number) => {
   const distribution = [0, 0, 0, 0, 0]; // 1-5 yıldız için yer tutucu

   // Ortalama puana yakın değerlere ağırlık ver
   const weights = [1, 2, 3, 4, 5].map((rating) => {
      return Math.max(1 - Math.abs(averageRating - rating) / 5, 0.1); // Yakın değerlere daha yüksek ağırlık
   });

   // Ağırlıkları normalize et
   const totalWeight = weights.reduce((a, b) => a + b, 0);
   const normalizedWeights = weights.map((w) => w / totalWeight);

   // Her yıldızın değerlendirme sayısını hesapla
   normalizedWeights.forEach((weight, index) => {
      distribution[index] = Math.round(weight * totalReviews);
   });

   // Toplam değerlendirmeyi doğru hale getir
   const totalCalculated = distribution.reduce((a, b) => a + b, 0);
   if (totalCalculated !== totalReviews) {
      distribution[0] += totalReviews - totalCalculated; // Eksik ya da fazla farkı 1 yıldız değerlendirmeye ekle
   }

   // Her yıldız için detaylı veri döndür
   return distribution.map((count, index) => ({
      id: index + 1,
      rating: 5 - index, // Yıldız sıralaması 5'ten 1'e
      review: count,
      width: (count / totalReviews) * 100 || 0, // Yüzde hesaplama
   }));
};




export default Reviews
