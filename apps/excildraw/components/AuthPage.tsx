'use client'
import {Input} from '@repo/ui/Input'
import {Button} from '@repo/ui/ Button'
import { buttonStyles, inputStyle } from '@/lib/constants/style';
import { useState } from 'react';
import axios from 'axios';
import { HTTP_BACKEND_URL } from '@/config';
import { useRouter } from 'next/navigation';

const AuthPage = ({ isSignedIn }: { isSignedIn :boolean}) => {
  const [userData,setUserData] = useState({})
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({...userData,[e.target.name]:e.target.value})
  }
  console.log(userData);
  
  const handleSubmit = async() => {
    if(isSignedIn){
      //Login
      try {
        const res = await axios.post(HTTP_BACKEND_URL + '/signin', userData);
        console.log("login res ",res)
        if (res.data.message === "success") {
          const token = res.data.token;
          console.log(token);
          localStorage.setItem('token', token);
          // router.push('/canvas/');
        }
      } catch (error) {
        console.log(error);
      }

    }else{
      //Sign Up
      try {
        const res = await axios.post(HTTP_BACKEND_URL + '/signup', userData);
        console.log('signup response', res);

        if(res.data.message ==="success"){
          router.push('/signin')
        }
      } catch (error) {
        console.log('signup response', error);
      }
    }
  }

  return (
    <div className=" w-screen h-screen flex justify-center items-center bg-[#4b6584]">
      <div >
        <div className="flex flex-col justify-center items-center gap-4 bg-white shadow-2xl p-8 rounded-md">
            <h1 className="text-2xl font-semibold text-slate-800"> {isSignedIn ? 'Login' : 'Sign Up'} </h1>
        <div className="w-full max-w-sm min-w-[200px]">
          <input className={inputStyle} name='email' placeholder={"Enter Email"} onChange={(e)=>handleInputChange(e)} />
        </div>
          {!isSignedIn && (
            <div className="w-full max-w-sm min-w-[200px]">
              <input className={inputStyle} name='username' disabled={isSignedIn} placeholder={"Enter Username"} onChange={(e) => handleInputChange(e)} />
            </div>
          )}
          <div className="w-full max-w-sm min-w-[200px]">
            <input className={inputStyle} name='password' placeholder={"Enter Password"} onChange={(e) => handleInputChange(e)} />
          </div>
          <div className='flex w-full px-1 text-left justify-start items-start'>
            <p className='text-gray-600 text-sm'>{isSignedIn ? "Don't have an account ?" : "Already have an account ?"}</p>
            <button onClick={() => { isSignedIn ? (router.push('/signup')) : (router.push('/signin'))}} className="text-blue-500 cursor-pointer text-sm ml-1" >{isSignedIn ? " Sign Up" : " Login"}</button>
          </div>
          {isSignedIn ? <Button name='Login' style={buttonStyles.filled} onclick={handleSubmit} /> : <Button name='Sign Up' style={buttonStyles.gradient} onclick={handleSubmit} />}
        </div>
      </div>
    </div>
  )
}

export default AuthPage