import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/input.jsx";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore.js";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const navigate = useNavigate();

  const { verifyEmail, isLoading, error } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    // handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      //FOCUS ON THE LAST NON-EMPTY INPUT OR THE FIRST EMPTY ONE
      const lastfilledindex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastfilledindex < 5 ? lastfilledindex + 1 : 5;
      inputRef.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const verificationCode = code.join("");
        await verifyEmail(verificationCode);
        navigate("/login");
        toast.success("Email verified successfully!");
    } catch (error) {
        toast.error("Error submitting code: " + error.message);
    }
  };

  //Auto Submit when all field are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div
      className="max-w-md w -full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl
     shadow-xl overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blue-xl rounded-2xl shadow-2xl p-8 w-full
        max-w-md"
      >
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRef.current[index] = el)}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600
              rounded-lg focus:border-green-500 focus:outline-none"
                name=""
                id=""
              />
            ))}
          </div>
          {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold
                      rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500
                      focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.05 }}
            disabled={isLoading || code.some((digit) => !digit)}
            whileTap={{ scale: 0.96 }}
            type="submit"
          >
            {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
