import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplitText from "../components/helloText";
import GradientText from "../components/gradientText";

function HelloScreen() {
    const navigate = useNavigate();
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const isFirstTime = !localStorage.getItem('hasVisitedBefore');
    const [name, setName] = useState(() => localStorage.getItem('github_name') || '');
    const handleAnimationComplete = () => {
        setIsAnimationComplete(true);
    };

    useEffect(() => {
        if (isAnimationComplete) {
            const timer = setTimeout(() => {
                if (isFirstTime) {
                    navigate("/loginScreen");
                } else {
                    navigate("/mainScreen");
                }
            }, isFirstTime ? 1500 : 800);
            return () => clearTimeout(timer);
        }
    }, [isAnimationComplete, navigate, isFirstTime]);

    return (
        <main className="container bg-black z-10 rounded-3xl min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
            <SplitText
                text="Hello!"
                className="text-[5rem] font-semibold pl-8 tracking-[10px]"
                delay={400}
                animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
                onLetterAnimationComplete={handleAnimationComplete}
            />
            <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="custom-class"
                fadeInDelay={1.5} 
            >
                {name}
            </GradientText>
        </main>
    );
}

export default HelloScreen;