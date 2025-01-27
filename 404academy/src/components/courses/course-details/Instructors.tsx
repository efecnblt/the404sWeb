import { Link } from "react-router-dom"

const Instructors = ({ authorData }: { authorData: any }) =>{


   return (

      <div className="courses__instructors-wrap">
          {authorData && (
         <div className="courses__instructors-thumb">
            <img src={authorData.imageURL} alt="img" />
         </div>
              )}
          {authorData && (
         <div className="courses__instructors-content">
            <h2 className="title">{authorData.name}</h2>
            <span className="designation">{authorData.departmentName}</span>
            <p className="avg-rating"><i className="fas fa-star"></i>{authorData.rating} Ratings</p>
            <p>{authorData.biography}</p>
            <div className="instructor__social">
               <ul className="list-wrap justify-content-start">
                  <li><Link to="#"><i className="fab fa-facebook-f"></i></Link></li>
                  <li><Link to="#"><i className="fab fa-twitter"></i></Link></li>
                  <li><Link to="#"><i className="fab fa-whatsapp"></i></Link></li>
                  <li><Link to="#"><i className="fab fa-instagram"></i></Link></li>
               </ul>
            </div>
         </div>
              )}
      </div>
   )
}

export default Instructors
