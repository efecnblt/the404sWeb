import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";

interface ICourseSidebarProps {
   // Ana bileşenden gelen state ve set fonksiyonları
   selectedCategoryId: number;
   setSelectedCategoryId: (val: number) => void;
   priceSelected: string;
   setPriceSelected: (val: string) => void;
   skillSelected: number;
   setSkillSelected: (val: number) => void;
   instructorSelected: string;
   setInstructorSelected: (val: string) => void;
   ratingSelected: number | null;
   setRatingSelected: (val: number | null) => void;

   // Ana bileşenden gelen veri: tüm kurslar ve kategoriler
   courses: any[];
   // Eğer kategorileri CourseArea’dan çekiyorsanız orada da tutabilir,
   // buraya doğrudan props olarak verebilirsiniz:
   categories: { categoryId: number; name: string }[]; // Updated to include type
}

const CourseSidebar: React.FC<ICourseSidebarProps> = ({
                                                         selectedCategoryId,
                                                         setSelectedCategoryId,

                                                         priceSelected,
                                                         setPriceSelected,
                                                         skillSelected,
                                                         setSkillSelected,
                                                         instructorSelected,
                                                         setInstructorSelected,
                                                         ratingSelected,
                                                         setRatingSelected,
                                                         courses,
                                                         categories,
                                                      }) => {
   // "Show More" mantığı için gereken local state’ler
   const [showMoreCategory, setShowMoreCategory] = useState(false);
   const [showMoreInstructor, setShowMoreInstructor] = useState(false);

   // Kategoriler listesi (API’den çekilmiş) + "All Category"
   const allCategory = [{ categoryId: 0, name: "All Category" }, ...categories];
   const categoriesToShow = showMoreCategory ? allCategory : allCategory.slice(0, 5);


   // Eğitmen listesi (courses’tan unique authorName) + "All Instructors"
   const uniqueInstructors = Array.from(new Set(courses.map((c) => c.authorName))).filter(Boolean);
   const allInstructor = ["All Instructors", ...uniqueInstructors];
   const instructorToShow = showMoreInstructor ? allInstructor : allInstructor.slice(0, 4);

   const handleCategory = (categoryId: number) => {
      setSelectedCategoryId((prev) => (prev === categoryId ? 0 : categoryId));
   };


    // Price ranges
    const priceOptions = [
        { label: "Under $10", min: 0, max: 10 },
        { label: "$10 - $20", min: 10, max: 20 },
        { label: "$20 - $40", min: 20, max: 40 },
        { label: "Above $40", min: 40, max: Infinity },
    ];

    const skillLevelOptions = [
        { label: "Beginner", levelId: 1 },
        { label: "Intermediate", levelId: 2 },
        { label: "Advanced", levelId: 3 },
    ];



// Handle price selection
    const handlePriceChange = (priceLabel: string) => {
        if (priceLabel === "All Price") {
            setPriceSelected("");
        } else {
            setPriceSelected((prev) => (prev === priceLabel ? "" : priceLabel));
        }
    };


    const handleSkillChange = (selectedLevelId: number) => {
        setSkillSelected((prev) => (prev === selectedLevelId ? null : selectedLevelId));
    };


    // Instructor seçimi
   const handleInstructorChange = (inst: string) => {
      if (inst === "All Instructors") {
         setInstructorSelected("");
      } else {
         setInstructorSelected((prev) => (prev === inst ? "" : inst));
      }
   };

   // Rating seçimi (örnek: aynı rating'e tekrar basınca sıfırla)
   const handleRatingChange = (rating: number) => {
      setRatingSelected((prev) => (prev === rating ? null : rating));
   };

   return (
       <div className="col-xl-3 col-lg-4">
          <aside className="courses__sidebar">
                   <div className="courses-widget">
                      <h4 className="widget-title">Categories</h4>
                      <div className="courses-cat-list">
                         <ul className="list-wrap">
                            {categoriesToShow.map((category) => (
                                <li key={category.categoryId}>
                                   <div className="form-check">
                                      <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`cat_${category.categoryId}`}
                                          checked={selectedCategoryId === category.categoryId}
                                          onChange={() => handleCategory(category.categoryId)}
                                      />
                                      <label
                                          className="form-check-label"
                                          htmlFor={`cat_${category.categoryId}`}
                                          style={{cursor: "pointer"}}
                                      >
                                         {category.name}
                                      </label>
                                   </div>
                                </li>
                            ))}
                         </ul>
                         <div className="show-more">
                            <button
                                type="button"
                                className={`show-more-btn ${showMoreCategory ? "active" : ""}`}
                                style={{cursor: "pointer"}}
                                onClick={() => setShowMoreCategory(!showMoreCategory)}
                            >
                               {showMoreCategory ? "Show Less -" : "Show More +"}
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Price */}
                   <div className="courses-widget">
                      <h4 className="widget-title">Price</h4>
                      <div className="courses-cat-list">
                         <ul className="list-wrap">
                            {priceOptions.map((priceOption, i) => (
                                <li key={i}>
                                   <div className="form-check">
                                      <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`price_${i}`}
                                          checked={priceSelected === priceOption.label}
                                          onChange={() => handlePriceChange(priceOption.label)}
                                      />
                                      <label
                                          className="form-check-label"
                                          htmlFor={`price_${i}`}
                                          style={{cursor: "pointer"}}
                                      >
                                          {priceOption.label}
                                      </label>
                                   </div>
                                </li>
                            ))}
                         </ul>
                      </div>
                   </div>

                   {/* Skill */}
                   <div className="courses-widget">
                      <h4 className="widget-title">Skill level</h4>
                      <div className="courses-cat-list">
                         <ul className="list-wrap">
                            {skillLevelOptions.map((option) => (
                                <li  key={option.levelId}>
                                   <div className="form-check">
                                      <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`skill_${option.levelId}`}
                                          checked={skillSelected === option.levelId}
                                          onChange={() => handleSkillChange(option.levelId)}
                                      />
                                      <label
                                          className="form-check-label"
                                          htmlFor={`skill_${option.levelId}`}
                                          style={{cursor: "pointer"}}
                                      >
                                          {option.label}
                                      </label>
                                   </div>
                                </li>
                            ))}
                         </ul>
                      </div>
                   </div>

                   {/* Instructors */}
                   <div className="courses-widget">
                      <h4 className="widget-title">Instructors</h4>
                      <div className="courses-cat-list">
                         <ul className="list-wrap">
                            {instructorToShow.map((inst, i) => (
                                <li key={i}>
                                   <div className="form-check">
                                      <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`instructor_${i}`}
                                          checked={instructorSelected === inst}
                                          onChange={() => handleInstructorChange(inst)}
                                      />
                                      <label
                                          className="form-check-label"
                                          htmlFor={`instructor_${i}`}
                                          style={{cursor: "pointer"}}
                                      >
                                         {inst}
                                      </label>
                                   </div>
                                </li>
                            ))}
                         </ul>
                         <div className="show-more">
                            <button
                                type="button"
                                className={`show-more-btn ${showMoreInstructor ? "active" : ""}`}
                                style={{cursor: "pointer"}}
                                onClick={() => setShowMoreInstructor(!showMoreInstructor)}
                            >
                               {showMoreInstructor ? "Show Less -" : "Show More +"}
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Ratings */}
                   <div className="courses-widget">
                      <h4 className="widget-title">Ratings</h4>
                      <div className="courses-rating-list">
                         <ul className="list-wrap">
                            {[5, 4, 3, 2, 1].map((rating, i) => (
                                <li key={i}>
                                   <div className="form-check">
                                      <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`rating_${i}`}
                                          checked={ratingSelected === rating}
                                          onChange={() => handleRatingChange(rating)}
                                      />
                                      <label
                                          className="form-check-label"
                                          htmlFor={`rating_${i}`}
                                          style={{cursor: "pointer"}}
                                      >
                                         <div className="rating">
                                            <Rating initialValue={rating} size={20} readonly/>
                                         </div>
                                      </label>
                                   </div>
                                </li>
                            ))}
                         </ul>
                      </div>
                   </div>
                </aside>
             </div>
             );
             };

             export default CourseSidebar;
