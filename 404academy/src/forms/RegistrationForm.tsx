import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import BtnArrow from '../svg/BtnArrow';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';


import { useNavigate } from 'react-router-dom';
import {useState} from "react";
import {doc, getFirestore, setDoc, serverTimestamp } from "firebase/firestore";
import {Mosaic} from "react-loading-indicators";

interface FormData {
    fname: string;
    lname: string;
    email: string;
    password: string;
    cpassword: string;
}

// Form validation schema
const schema = yup.object({
    fname: yup.string().required("First name is required"),
    lname: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    cpassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required("Confirm password is required"),
}).required();


const RegistrationForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Loading durumu
    const [showLoadingPage, setShowLoadingPage] = useState(false); // Show loading page


    const onSubmit = async (data: FormData) => {
        setLoading(true); // Loading durumu başlar
        const auth = getAuth();
        const db = getFirestore();

        const { fname, lname, email, password } = data;

        try {
            // Firebase Authentication işlemi
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUID = userCredential.user.uid;

            // Firestore kullanıcı kaydı
            await setDoc(doc(db, "users", firebaseUID), {
                bio: "",
                createdAt: serverTimestamp(),
                email,
                favorites: [], // Başlangıçta boş bir dizi
                image_url: "https://firebasestorage.googleapis.com/v0/b/cyberguard-87d6e.appspot.com/o/users_photo%2Fperson.png?alt=media&token=19d50ea1-cc2e-46d2-8e76-75eb419e8050",
                name: fname,
                surname: lname,
                occupation: "Student",
                username: `${fname.toLowerCase()}${lname.toLowerCase()}`,
            });

            // Backend API kaydı
            const response = await fetch('http://165.232.76.61:5001/api/Auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    firstName: fname,
                    lastName: lname,
                    username: `${fname}${lname}`,
                    biography: "Hello, I'm using 404Academy",
                    firebaseUID: firebaseUID,
                    imageUrl:
                        "https://firebasestorage.googleapis.com/v0/b/cyberguard-87d6e.appspot.com/o/users_photo%2Fperson.png?alt=media&token=19d50ea1-cc2e-46d2-8e76-75eb419e8050",
                }),
            });

            if (response.ok) {
                const userResponse = await response.json(); // Backend'den dönen kullanıcı bilgisi
                const userId = userResponse.userId; // Backend'den dönen kullanıcı ID'si

                // Kullanıcı ID'sini OperationClaims tablosuna ekleme (Student)
                const claimsResponse = await fetch('http://165.232.76.61:5001/api/UserOperationClaims/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId, // Backend'den gelen User ID
                        operationClaimId: 4, // Student Role
                    }),
                });

                if (claimsResponse.ok) {
                    toast.success('Registration successful! You are now registered as a Student.', { position: 'top-center' });
                    reset();

                    // Gösterilecek loading sayfasını aktif et
                    setShowLoadingPage(true);
                    setTimeout(() => {
                        setShowLoadingPage(false);
                        navigate("/"); // Kullanıcı anasayfaya yönlendirilir
                    }, 4000); // 2 saniye gecikme
                } else {
                    const errorText = await claimsResponse.text();
                    toast.error(`Failed to assign role: ${errorText}`, { position: 'top-center' });
                }
            } else {
                const errorText = await response.text();
                toast.error(`API Error: ${errorText || 'Registration failed'}`, { position: 'top-center' });
            }
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Email already in use', { position: 'top-center' });
            } else {
                toast.error(`Registration failed: ${error.message}`, { position: 'top-center' });
            }
        } finally {
            setLoading(false); // Loading durumu sona erer
        }
    };


// Show loading page
    if (showLoadingPage) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
            </div>
        );
    }



    return (
        <>
        {loading && (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
            </div>
        )}
            {!loading && (
        <form onSubmit={handleSubmit(onSubmit)} className="account__form">
            <div className="row gutter-20">
                <div className="col-md-6">
                    <div className="form-grp">
                        <label htmlFor="fast-name">First Name</label>
                        <input type="text" {...register("fname")} id="fast-name" placeholder="First Name" />
                        <p className="form_error">{errors.fname?.message}</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-grp">
                        <label htmlFor="last-name">Last name</label>
                        <input type="text" {...register("lname")} id="last-name" placeholder="Last name" />
                        <p className="form_error">{errors.lname?.message}</p>
                    </div>
                </div>
            </div>
            <div className="form-grp">
                <label htmlFor="email">Email</label>
                <input type="email" {...register("email")} id="email" placeholder="email" />
                <p className="form_error">{errors.email?.message}</p>
            </div>
            <div className="form-grp">
                <label htmlFor="password">Password</label>
                <input type="password" {...register("password")} id="password" placeholder="password" />
                <p className="form_error">{errors.password?.message}</p>
            </div>
            <div className="form-grp">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" {...register("cpassword")} id="confirm-password" placeholder="Confirm Password" />
                <p className="form_error">{errors.cpassword?.message}</p>
            </div>
            <button type="submit" className="btn btn-two arrow-btn">Sign Up<BtnArrow /></button>
        </form>
                )}
        </>
    );
}

export default RegistrationForm;
