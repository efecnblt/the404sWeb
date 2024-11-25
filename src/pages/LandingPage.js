import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from "../components/SearchBar";

const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const onClear = () => {
        setSearchQuery(""); // Arama terimini sıfırla
    };

    return (
        <div className="bg-gradient-to-b from-blue-500 to-blue-800 text-white min-h-screen flex flex-col">
            {/* Navbar */}
            <header className="bg-blue-500 py-6 shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        <Link to="/">404 Academy</Link>
                    </h1>
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center flex-1 mx-6"
                    >
                        <SearchBar
                            searchTerm={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)} // Arama terimini güncelle
                            onClear={onClear} // Arama çubuğunu sıfırla
                        />
                    </form>
                    <nav className="flex space-x-6">
                        <Link
                            to="/login"
                            className="bg-blue-600 px-6 py-1 rounded-lg shadow-lg text-lg font-semibold hover:bg-blue-700"
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

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="text-center max-w-4xl">
                    <h1 className="text-5xl font-extrabold leading-tight">
                        Welcome to <span className="text-yellow-400">404 Academy</span>
                    </h1>
                    <p className="mt-4 text-lg text-blue-200">
                        Empower your future with modern learning tools.
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                        <Link
                            to="/signup"
                            className="bg-yellow-400 px-6 py-3 rounded-lg shadow-lg text-lg font-semibold hover:bg-yellow-500 text-black"
                        >
                            Get Started
                        </Link>
                        <a
                            href="#learn-more"
                            className="bg-transparent border-2 border-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-500 hover:border-yellow-500"
                        >
                            Learn More
                        </a>
                    </div>
                    {/* Responsive and Cropped Image */}
                    <div className="mt-20">
                        <img
                            src="/images/resim1.png"
                            alt="Learning Illustration"
                            className="w-full h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="bg-gray-100 text-gray-800 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <img
                                src="https://via.placeholder.com/100"
                                alt="Feature Icon"
                                className="mx-auto mb-4"
                            />
                            <h3 className="text-xl font-bold">Interactive Learning</h3>
                            <p className="mt-2 text-gray-600">
                                Experience hands-on learning with real-world projects.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <img
                                src="https://via.placeholder.com/100"
                                alt="Feature Icon"
                                className="mx-auto mb-4"
                            />
                            <h3 className="text-xl font-bold">Expert Instructors</h3>
                            <p className="mt-2 text-gray-600">
                                Learn from industry leaders with years of experience.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <img
                                src="https://via.placeholder.com/100"
                                alt="Feature Icon"
                                className="mx-auto mb-4"
                            />
                            <h3 className="text-xl font-bold">Flexible Courses</h3>
                            <p className="mt-2 text-gray-600">
                                Study at your own pace with lifetime course access.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">What Our Students Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <p className="italic text-gray-600">
                                "404 Academy changed my life. The courses are amazing!"
                            </p>
                            <h4 className="text-lg font-bold mt-4">- Jane Doe</h4>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <p className="italic text-gray-600">
                                "A truly unique learning experience. Highly recommended!"
                            </p>
                            <h4 className="text-lg font-bold mt-4">- John Smith</h4>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <p className="italic text-gray-600">
                                "I landed my dream job thanks to 404 Academy!"
                            </p>
                            <h4 className="text-lg font-bold mt-4">- Sarah Lee</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-blue-500 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">FAQs</h2>
                    <div className="space-y-6 max-w-4xl mx-auto">
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="font-bold text-blue-600">How do I sign up?</h3>
                            <p className="text-gray-600">
                                Simply click on the "Sign Up" button and fill out the form.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="font-bold text-blue-600">Are the courses free?</h3>
                            <p className="text-gray-600">
                                We offer both free and premium courses to suit your needs.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="font-bold text-blue-600">Can I access courses offline?</h3>
                            <p className="text-gray-600">
                                Yes, our mobile app allows offline access to courses.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 404 Academy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
