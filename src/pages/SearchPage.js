import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SearchPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('query') || ''; // Get initial query from URL
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState(initialQuery);

    // Example courses
    const [courses, setCourses] = useState([
        { id: 1, title: "Course 1", category: "Development", description: "Learn the basics of web development." },
        { id: 2, title: "Course 2", category: "Design", description: "Introduction to graphic design." },
        { id: 3, title: "Course 3", category: "Marketing", description: "Digital marketing essentials." },
        { id: 4, title: "Course 4", category: "Development", description: "Advanced JavaScript techniques." },
        { id: 5, title: "Course 5", category: "Design", description: "Mastering UI/UX design." },
        { id: 6, title: "Course 6", category: "Marketing", description: "SEO optimization strategies." },
    ]);

    const [filter, setFilter] = useState("All");

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
                                <li>
                                    <button
                                        className={`w-full text-left px-4 py-2 rounded-lg ${filter === "All" ? "bg-blue-600 text-white" : "hover:bg-blue-100"}`}
                                        onClick={() => setFilter("All")}
                                    >
                                        All
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full text-left px-4 py-2 rounded-lg ${filter === "Development" ? "bg-blue-600 text-white" : "hover:bg-blue-100"}`}
                                        onClick={() => setFilter("Development")}
                                    >
                                        Development
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full text-left px-4 py-2 rounded-lg ${filter === "Design" ? "bg-blue-600 text-white" : "hover:bg-blue-100"}`}
                                        onClick={() => setFilter("Design")}
                                    >
                                        Design
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full text-left px-4 py-2 rounded-lg ${filter === "Marketing" ? "bg-blue-600 text-white" : "hover:bg-blue-100"}`}
                                        onClick={() => setFilter("Marketing")}
                                    >
                                        Marketing
                                    </button>
                                </li>
                            </ul>
                        </aside>

                        {/* Courses Section */}
                        <section className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.length > 0 ? (
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
