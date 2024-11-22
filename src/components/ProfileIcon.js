import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfileIcon = ({ name, imageUrl }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <img
                src={imageUrl || 'https://via.placeholder.com/40'}
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 px-4 w-48">
                    <p className="font-bold">{name}</p>
                    <Link
                        to="/profile"
                        className="text-blue-500 hover:underline mt-2 block"
                    >
                        View Profile
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProfileIcon;
