import HeaderOne from "../../../layouts/headers/HeaderOne";
import BreadcrumbTwo from "../../common/breadcrumb/BreadcrumbTwo";
import CourseDetailsArea from "./CourseDetailsArea";
import FooterThree from "../../../layouts/footers/FooterThree.tsx";
import {useEffect, useState} from "react";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {useParams} from "react-router-dom";

const CourseDetails  = () =>  {

    const { authorId, courseId } = useParams<{ authorId: string; courseId: string }>();
    const [courseData, setCourseData] = useState<any>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();

                const courseRef = doc(db, `authors/${authorId}/courses/${courseId}`);

                // Author ve Course verilerini paralel olarak çek
                const [courseSnapshot] = await Promise.all([
                    getDoc(courseRef),
                ]);

                // Course verisi kontrolü
                if (courseSnapshot.exists()) {
                    setCourseData({ id: courseSnapshot.id, ...courseSnapshot.data() });
                } else {
                    console.error("Course document not found!");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (courseId) {
            fetchData();
        }
    }, [courseId]);

   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbTwo title={courseData?.name} sub_title="Courses" />
            <CourseDetailsArea />
         </main>
         <FooterThree />

      </>
   );
};

export default CourseDetails;
