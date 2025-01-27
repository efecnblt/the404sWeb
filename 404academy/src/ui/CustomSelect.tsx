import { useState, useEffect } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const CustomSelect = () => {
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);

    useEffect(() => {
        // Fetch courses and authors
        const fetchData = async () => {
            try {
                const [coursesRes, authorsRes] = await Promise.all([
                    axios.get("http://165.232.76.61:5001/api/Courses/getall"),
                    axios.get("http://165.232.76.61:5001/api/Authors/getall")
                ]);

                // Extract 'data' from the response
                setCourses(coursesRes.data.data); // 'data' içindeki 'data'ya erişiyoruz
                setAuthors(authorsRes.data); // Authors için doğrudan setAuthors
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setSearchValue(input);

        if (input.trim() === "") {
            setSuggestions([]);
            return;
        }

        const lowerInput = input.toLowerCase();

        // Filter courses by name or author name
        const filteredSuggestions = courses.filter(
            (course) =>
                course.name.toLowerCase().includes(lowerInput) ||
                authors.some(
                    (author) =>
                        author.authorID === course.authorId &&
                        author.name.toLowerCase().includes(lowerInput)
                )
        );

        setSuggestions(filteredSuggestions);
    };


    return (
        <div className="tgmenu__search-form" style={{ position: "relative", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            <div className="input-grp">
                <input
                    type="text"
                    placeholder="Search for Course or Author..."
                    value={searchValue}
                    onChange={handleSearchChange}
                />
                <button type="submit"><i className="flaticon-search"></i></button>
            </div>
            {suggestions.length > 0 && (
                <div style={{
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    left: "0",
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "10px", // Yuvarlak köşeler
                    maxHeight: "300px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                >
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {suggestions.map((course) => (
                            <li key={course.courseID}  style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px",
                                borderBottom: "1px solid #f0f0f0",
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                            }}>
                                <div className="suggestion-item">
                                 <>
                                     <Link to={`course-details/${course.authorId}/${course.courseID}`}>
                                         <img src={course.image} alt={course.name} style={{
                                             width: "40px",
                                             height: "40px",
                                             objectFit: "cover",
                                             borderRadius: "4px",
                                             marginRight: "10px",
                                         }}/>
                                         <div>
                                             <h4 style={{margin: 0, fontSize: "14px", color: "#333"}}>{course.name}</h4>
                                             <p style={{
                                                 margin: 0,
                                                 fontSize: "12px",
                                                 color: "#777"
                                             }}>{authors.find((author) => author.authorID === course.authorId)?.name}</p>
                                         </div>
                                     </Link>


                                 </>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );


};

export default CustomSelect;
