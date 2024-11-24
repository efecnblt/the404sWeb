import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const Login = () => {
    const [email, setEmail] = useState('efecanbolat34@gmail.com'); // Varsayılan değerler test amaçlı
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Yükleniyor durumu
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Yükleniyor durumunu aktif et
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false); // Yükleniyor durumunu kapat
            navigate("/app/home"); // Ana sayfaya yönlendir
        } catch (err) {
            setLoading(false); // Yükleniyor durumunu kapat
            if (err.code === "auth/user-not-found") {
                setError('No user found with this email.');
            } else if (err.code === "auth/wrong-password") {
                setError('Incorrect password. Please try again.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            {/* Heading */}
            <h1 className="text-3xl font-bold text-blue-600 mt-8 mb-4">404 Academy</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                {/* Hata Mesajı */}
                {error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        disabled={loading} // Yükleniyorken butonu devre dışı bırak
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {/* Sign Up Link */}
                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
