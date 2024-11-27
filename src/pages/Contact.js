import React, { useState } from "react";
import instagramLogo from "../assets/instagram.png";
import gmailLogo from "../assets/gmail.png";
import whatsappLogo from "../assets/whatsapp.png";


const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setStatus("Please fill out all fields.");
            return;
        }

        setStatus("Thank you for contacting us! We'll get back to you shortly.");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-100">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
                <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">
                    Contact Us
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Have any questions? We'd love to hear from you!
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Your name"
                            required
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Your email address"
                            required
                        />
                    </div>
                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Your message"
                            required
                        ></textarea>
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                        Send Message
                    </button>
                </form>
                {/* Status Message */}
                {status && (
                    <p className="text-center text-sm mt-4 text-green-600">{status}</p>
                )}
                {/* Social Media Links */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">Follow us on:</p>
                    <div className="flex justify-center space-x-6 mt-4">
                        <a
                            href="https://instagram.com/efecnblt"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={instagramLogo}
                                alt="Facebook"
                                className="w-8 h-8 hover:opacity-80 transition"
                            />
                    </a>
                    <a
                        href="https://instagram.com/efecnblt"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        <img
                            src={whatsappLogo}
                            alt="WhatsApp"
                            className="w-8 h-8 hover:opacity-80 transition"
                        />
                    </a>
                        <a
                            href="https://instagram.com/efecnblt"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={gmailLogo}
                                alt="GMail"
                                className="w-8 h-8 hover:opacity-80 transition"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
