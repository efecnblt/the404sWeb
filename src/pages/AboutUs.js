import React from "react";
import {Link} from "react-router-dom";

function AboutUs() {
    return (
        <section className="py-12 bg-gray-50">
            {/* Başlık ve Açıklama */}
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold text-purple-700 mb-6">About Us</h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                    Welcome to <span className="text-purple-600 font-bold">404 Academy</span>!
                    We are a passionate team of educators and developers dedicated to creating a world-class platform for learning and growth.
                </p>
            </div>

            {/* Uygulama Hedefleri */}
            <div className="max-w-5xl mx-auto px-4 mt-12">
                <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
                    Our Mission
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed text-center">
                    At 404 Academy, our mission is to make knowledge accessible to everyone, everywhere. We strive to empower learners with high-quality courses,
                    engaging content, and an intuitive platform that bridges the gap between education and real-world skills.
                </p>
            </div>

            {/* Yazarlar */}
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
                    Meet Our Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Yazar Kartları */}
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Efe Canbolat"
                            className="w-24 h-24 mx-auto rounded-full mb-4"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">Efe Canbolat</h3>
                        <p className="text-sm text-gray-500">Founder & Lead Developer</p>
                        <p className="text-gray-600 mt-4">
                            Passionate about building educational platforms and bridging the gap between knowledge and application.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Ali Veli"
                            className="w-24 h-24 mx-auto rounded-full mb-4"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">Ali Veli</h3>
                        <p className="text-sm text-gray-500">Curriculum Designer</p>
                        <p className="text-gray-600 mt-4">
                            Expert in course development and ensuring the highest quality of educational content.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Dicle Ulu"
                            className="w-24 h-24 mx-auto rounded-full mb-4"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">Dicle Ulu</h3>
                        <p className="text-sm text-gray-500">UX Designer</p>
                        <p className="text-gray-600 mt-4">
                            Focused on crafting seamless and user-friendly designs for an optimal learning experience.
                        </p>
                    </div>
                </div>
            </div>

            {/* Değerlerimiz */}
            <div className="max-w-5xl mx-auto px-4 mt-12">
                <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Our Values</h2>
                <ul className="space-y-4 text-gray-600 text-lg leading-relaxed">
                    <li>
                        <span className="font-bold text-purple-600">Innovation:</span> We strive to innovate and create cutting-edge educational tools.
                    </li>
                    <li>
                        <span className="font-bold text-purple-600">Accessibility:</span> We believe in making education accessible to everyone, regardless of location or background.
                    </li>
                    <li>
                        <span className="font-bold text-purple-600">Collaboration:</span> Education is a collective journey, and we work with the best minds to deliver the best content.
                    </li>
                </ul>
            </div>

            {/* Footer Bölümü */}
            <div className="bg-purple-700 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold">Ready to Start Learning?</h3>
                    <p className="text-gray-300 mt-4">
                        Join us and embark on a journey of growth and discovery.
                    </p>
                    <Link
                        to="/signup"
                        className="mt-6 inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition"
                    >
                        Sign Up Now
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;
