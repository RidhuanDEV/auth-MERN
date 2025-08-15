import React from 'react'
import { useState} from 'react';
import { motion } from 'framer-motion';
import Input from '../components/input.jsx';
import { Mail, Loader, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {error, login, isLoading} = useAuthStore()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            
        } catch (error) {
            res.status(400).json({ message: error.message });
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
            Log In
        </h2>
        <form onSubmit={handleLogin}>
            <Input icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email"/>
            <Input icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password"/>
            {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
            <Link to="/forgot-password" className='text-green-400 text-sm hover:underline'>
              Forgot Password?
            </Link>
            <motion.button 
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold
            rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500
            focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
            whileHover={{ scale: 1.05 }}
            whileTap={{scale : 0.96}}
            type='submit'>
              {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Log In"}
            </motion.button>
        </form>
      </div>
      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <div className='flex flex-col text-sm text-gray-400'>
            <div>
                Do Not Have An Account?{" "}
                <Link to="/signup" className='text-green-400 hover:underline'>
                  Sign Up
                </Link>
            </div>

        </div>

      </div>
    </motion.div>
  )
}

export default LoginPage