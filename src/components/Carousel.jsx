import React, { useState, useEffect } from 'react';
import pic from '../assets/mouse.jpg';
import pic1 from '../assets/mouse3.jpg';
import pic2 from '../assets/amd.jpg';

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Slides data
    const slides = [
        { id: 1, image: pic},
        { id: 2, image: pic1},
        { id: 3, image: pic2},
    ];

    // Function to go to the next slide
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    // Function to go to the previous slide
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    // Automatic scrolling using useEffect
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval); // Clean up the interval on unmount
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <div className="relative pt-1">
            {/* Carousel Container */}
            <div className="overflow-hidden relative w-full h-[300px]">
                {/* Slides */}
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {slides.map((slide) => (
                        <div key={slide.id} className="w-full flex-shrink-0">
                            <img
                                src={slide.image}
                                alt={slide.caption}
                                className="w-full h-[250px] object-contain rounded-lg shadow-lg"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent text-white p-4 text-center font-bold">
                                {slide.caption}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none"
                    onClick={prevSlide}
                    aria-label="Previous"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none"
                    onClick={nextSlide}
                    aria-label="Next"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
