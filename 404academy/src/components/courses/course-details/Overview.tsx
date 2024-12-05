
const Overview = ({ authorData, courseData }: { authorData: any; courseData: any }) =>{
   return (

      <div className="courses__overview-wrap">
          {authorData && courseData && (
              <><h3 className="title">Course Description</h3><p>{courseData.description[0]}</p><h3
                  className="title">What you&apos;ll learn in this course?</h3><p>{courseData.description[1]}</p>
                  <ul className="about__info-list list-wrap">
                      {courseData.learning_outcomes.map((outcome: string, index: number) => (
                          <li className="about__info-list-item" key={index}>
                              <i className="flaticon-angle-right"></i>
                              <p className="content">{outcome}</p>
                          </li>
                      ))}
                  </ul>
                  <p className="last-info">{courseData.description[2]}</p></>
              )}
          </div>
   );
};

export default Overview
