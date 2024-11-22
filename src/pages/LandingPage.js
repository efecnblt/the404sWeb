import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="bg-gradient-to-b from-blue-500 to-blue-800 text-white min-h-screen flex flex-col">
            {/* Navbar */}
            <header className="bg-transparent py-6">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        <Link to="/">404 Academy</Link>
                    </h1>
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
                <div className="text-center max-w-2xl">
                    <h1 className="text-5xl font-extrabold leading-tight">
                        Welcome to 404 Academy
                    </h1>
                    <p className="mt-4 text-lg text-blue-200">
                        Experience modern solutions for your needs.
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                        <Link
                            to="/signup"
                            className="bg-blue-600 px-6 py-3 rounded-lg shadow-lg text-lg font-semibold hover:bg-blue-700"
                        >
                            Get Started
                        </Link>
                        <a
                            href="#learn-more"
                            className="bg-transparent border-2 border-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 hover:border-blue-700"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="bg-white text-gray-800 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold">Feature 1</h3>
                            <p className="mt-2">Description of feature 1.</p>
                        </div>
                        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold">Feature 2</h3>
                            <p className="mt-2">Description of feature 2.</p>
                        </div>
                        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold">Feature 3</h3>
                            <p className="mt-2">Description of feature 3.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="container mx-auto text-center">
                    &copy; 2024 YourApp. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
