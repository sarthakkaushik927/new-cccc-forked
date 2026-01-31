import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flickerStyles } from './AnimationStyles'; 

const localStyles = `
  @keyframes sword-shine-fixed {
    0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
    5% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
  }
  
  .animate-shine-fixed {
    animation: sword-shine-fixed 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
`;


const baseClasses = `
  w-full 
  px-5 md:px-6 
  
  /* HEIGHT: Fill the Grid Row completely */
  h-full
  min-h-[55px] /* Safety: Never smaller than 50px */
  max-h-[900px] /* Safety: Never larger than 80px (prevents looking weird on 4k) */
  
  /* TEXT: Responsive text size */
  text-sm md:text-base lg:text-lg
  
  font-medium tracking-wide placeholder-gray-500
  bg-black/20 backdrop-blur-sm
  border border-[#00aaff]/40 rounded-[12px] text-white
  animate-flicker-card
  
  focus:animate-none 
  focus:outline-none 
  focus:bg-[#00aaff]/30 
  focus:border-[#00aaff] 
  focus:shadow-[0_0_65px_rgba(45,170,255,0.9)] /* Bigger Glow for Bigger Inputs */
  
  transition-all duration-200 ease-out relative z-20 
`;

const ShineOverlay = ({ isActive }) => (
  <div className={`absolute inset-0 rounded-[12px] pointer-events-none z-20 overflow-hidden transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
    <div className="absolute top-0 bottom-0 left-0 w-full h-full">
         <div className="w-[150%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine-fixed blur-md" />
    </div>
  </div>
);

export const FormInput = ({ name, type, register, error, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    
    <div className="relative group w-full h-full flex flex-col justify-center"> 
      <style>{localStyles}</style>
      <style>{flickerStyles}</style> 
      <div className="relative h-full">
        <input
          type={type} id={name} placeholder={placeholder} {...register(name)}
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          className={`${baseClasses} ${error ? 'border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.5)] animate-none' : ''}`}
        />
        <ShineOverlay isActive={isFocused} />
      </div>
      <div className="absolute -bottom-5 left-0 z-30 pointer-events-none">
        <AnimatePresence>
          {error && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 text-xs font-semibold pl-1 whitespace-nowrap">{error.message}</motion.p>}
        </AnimatePresence>
      </div>
    </div>
  );
};

export  const FormSelect = ({ name, setValue, watch, error, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedValue = watch(name);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setValue(name, value, { shouldValidate: true });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center" ref={dropdownRef}>
      <style>{localStyles}</style>
      <style>{flickerStyles}</style>
      <div className="relative h-full">
        <div onClick={() => setIsOpen(!isOpen)} className={`${baseClasses} flex items-center justify-between cursor-pointer ${!selectedValue ? 'text-gray-400' : 'text-white'} ${error ? 'border-red-500 animate-none' : ''} ${isOpen ? 'border-[#00aaff] bg-[#00aaff]/10 shadow-[0_0_35px_rgba(0,170,255,0.6)] animate-none' : ''}`}>
          <span className="truncate">{selectedValue || placeholder}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.1 }} className="flex-shrink-0 ml-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "#00aaff" : "currentColor"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </motion.div>
        </div>
        <ShineOverlay isActive={isOpen} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.98 }} transition={{ duration: 0.1 }} className="absolute top-full left-0 right-0 mt-2 p-1 bg-black/90 backdrop-blur-xl border border-[#00aaff]/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <div key={option} onClick={() => handleSelect(option)} className={`px-6 py-3 rounded-lg cursor-pointer text-sm lg:text-base font-medium transition-all duration-100 border border-transparent hover:bg-[#00aaff]/20 hover:text-[#00aaff] hover:border-[#00aaff]/30 ${selectedValue === option ? 'text-[#00aaff] bg-[#00aaff]/20' : 'text-gray-200'}`}>
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute -bottom-5 left-0 z-30 pointer-events-none">
        <AnimatePresence>
          {error && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 text-xs font-semibold pl-1 whitespace-nowrap">{error.message}</motion.p>}
        </AnimatePresence>
      </div>
    </div>
  );
};

// const baseClasses = `
//   peer
//   w-full px-4 py-3
//   bg-transparent 
  
//   border 
//   rounded-[10px]
//   text-white text-sm font-medium tracking-wide
//   border-[#0aaaff] shadow-[0_0_2000px_rgba(41,150,255,0.4)]
  
//   focus:outline-none 
//   focus:bg-[#0aaaff]/10 
//   focus:border-[#00aaff] 
//   focus:shadow-[0_0_20px_rgba(0,170,255,0.6)]
  
//   transition-all duration-300 ease-out
//   relative z-10
// `;