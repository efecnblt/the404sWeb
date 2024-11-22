import Newsletter from "../components/Newsletter";
import CoursesSection from "../components/CoursesSection";
import HeroSection from "../components/HeroSection";
import InstructorsSection from "../components/InstructorsSection";
import TopCoursesSection from "../components/TopCoursesSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import {useEffect, useState} from "react";
import ProfileIcon from "../components/ProfileIcon";

function Home() {


    return (
        <div>
            <Header/>
            <HeroSection/>
            <CoursesSection/>
            <InstructorsSection/>
            <TopCoursesSection/>
            <Newsletter/>
            <Footer/>
        </div>
    );
}

export default Home;
