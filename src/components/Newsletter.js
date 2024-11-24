import React, { useState } from "react";

// handleSubscribe fonksiyonunu dışa aktarmak için tanımlıyoruz
export const handleNewsletterSubscribe = (email, setMessage, setIsSuccess) => {
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (!validateEmail(email)) {
        setIsSuccess(false);
        setMessage("Please enter a valid email address.");
        return;
    }

    setIsSuccess(true);
    setMessage("Thank you for subscribing to our newsletter!");
    // Backend entegrasyonu burada yapılabilir (opsiyonel)
    // örn: await axios.post('/api/subscribe', { email });
};

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleNewsletterSubscribe(email, setMessage, setIsSuccess);
        setEmail(""); // E-posta alanını temizle
    };

    return (
        <section className="py-12 bg-purple-50 text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">
                Get the latest updates and offers right in your inbox.
            </p>
            {message && (
                <div
                    className={`max-w-md mx-auto p-4 rounded-lg mb-4 ${
                        isSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                    {message}
                </div>
            )}
            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your email"
                />
                <button
                    type="submit"
                    className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    Subscribe
                </button>
            </form>
        </section>
    );
};

export default Newsletter;
