import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig'; // Adjust the import based on your project structure

const SearchPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('query') || ''; // Get initial query from URL
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [courses, setCourses] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    // Fetch courses from Firebase
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const coursesRef = collection(db, "courses");
                let q;

                // Apply search filter if searchQuery exists
                if (searchQuery) {
                    q = query(
                        coursesRef,
                        where("title", ">=", searchQuery),
                        where("title", "<=", searchQuery + "\uf8ff")
                    );
                } else {
                    q = coursesRef; // Get all courses if no search query
                }

                const querySnapshot = await getDocs(q);
                const fetchedCourses = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCourses(fetchedCourses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [searchQuery]);

    // Handle new search
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Filter logic
    const filteredCourses = courses.filter(course =>
        filter === "All" || course.category === filter
    );

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar Section */}
            <div className="bg-blue-600 text-white">
                <header className="py-6">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <h1 className="text-3xl font-bold">
                            <Link to="/">404 Academy</Link>
                        </h1>
                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center flex-1 mx-6"
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Search for courses..."
                                required
                            />
                        </form>
                        <nav className="flex space-x-6">
                            <Link
                                to="/login"
                                className="bg-blue-800 px-6 py-1 rounded-lg shadow-lg text-lg font-semibold hover:bg-blue-700"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-transparent border-2 border-white px-6 py-1 rounded-lg text-lg font-semibold hover:bg-blue-700 hover:border-blue-700"
                            >
                                Sign up
                            </Link>
                        </nav>
                    </div>
                </header>
            </div>

            {/* Main Content Section */}
            <main className="bg-white flex-1">
                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">Search Results</h2>
                    <div className="flex space-x-6">
                        {/* Filters Section */}
                        <aside className="w-1/4 bg-gray-100 text-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Filter by Category</h3>
                            <ul className="space-y-2">
                                {["All", "Development", "Design", "Marketing"].map((cat) => (
                                    <li key={cat}>
                                        <button
                                            className={`w-full text-left px-4 py-2 rounded-lg ${filter === cat ? "bg-blue-600 text-white" : "hover:bg-blue-100"}`}
                                            onClick={() => setFilter(cat)}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* Courses Section */}
                        <section className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <p>Loading courses...</p>
                            ) : filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="p-6 bg-gray-100 text-gray-800 rounded-lg shadow-md"
                                    >
                                        <h3 className="text-xl font-bold">{course.title}</h3>
                                        <p className="mt-2">{course.description}</p>
                                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                            View Course
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No courses found.</p>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="container mx-auto text-center">
                    &copy; 2024 YourApp. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default SearchPage;
