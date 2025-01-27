import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerificationForm = ({ email }: { email: string }) => {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
            const response = await fetch('http://165.232.76.61:5001/api/Auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            if (response.ok) {
                toast.success("Verification successful! Redirecting to dashboard...", { position: 'top-center' });
                navigate(`/student-dashboard`);
            } else {
                const errorText = await response.text();
                toast.error(`Verification failed: ${errorText}`, { position: 'top-center' });
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message}`, { position: 'top-center' });
        }
    };

    const handleResendCode = async () => {
        try {
            const response = await fetch('http://165.232.76.61:5001/api/Auth/resend-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                toast.success("Verification code resent! Please check your email.", { position: 'top-center' });
            } else {
                const errorText = await response.text();
                toast.error(`Failed to resend code: ${errorText}`, { position: 'top-center' });
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message}`, { position: 'top-center' });
        }
    };


    return (
        <div className="verification-form">
            <h2>Email Verification</h2>
            <p>Please enter the verification code sent to your email.</p>
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                className="form-input"
            />
            <button onClick={handleVerify} className="btn btn-primary">Verify</button>
            <button onClick={handleResendCode} className="btn btn-secondary">Resend Code</button>

        </div>
    );
};

export default VerificationForm;
