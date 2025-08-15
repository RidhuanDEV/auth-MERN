import React from 'react'
import {motion} from 'framer-motion';
import Input from '../components/input.jsx';
import {Mail, User, Lock, Loader} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter.jsx';
import { useAuthStore } from '../store/authStore.js';


const SignUpPages = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { signup,error,isLoading } = useAuthStore();
    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            await signup(email, password, name);
            navigate("/verify-email");
        } catch (error) {
            console.error("Error signing up:", error);
        }
    }
  return (
    <motion.div
      initial={{ opacity: 0, y:20 }}
      animate={{ opacity: 1, y:0 }}
      transition = {{ duration : 0.5}}
    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
>
      <div className='p-8'>
        <h2 className='text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
            Create An Account
        </h2>
        <form onSubmit={handleSignUp}>
            <Input icon={User} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" autoComplete="username"/>
            <Input icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email"/>
            <Input icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password"/>
            {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

            {/* Password Strength meter below! */}
            <PasswordStrengthMeter password={password} />
            <motion.button 
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold
            rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500
            focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
            whileHover={{ scale: 1.05 }}
            whileTap={{scale : 0.96}}
            disabled={isLoading || !name || !email || !password}
            type='submit'>
              {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Sign Up"}
            </motion.button>
        </form>
      </div>
      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <div className='text-sm text-gray-400'>
            Already have an account?{" "}
            <Link to="/login" className='text-green-400 hover:underline'>
              Log in
            </Link>

        </div>

      </div>
    </motion.div>
  )
}

export default SignUpPages