import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link,useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import{useDispatch, useSelector} from 'react-redux';
import {signInStart, signInFailure, signInSuccess } from "../redux/user/userSlice.js";

export default function LogIn() {
  const [showPassword,setShowPassword]= useState(false);
  const {loading,error}=useSelector((state)=>state.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const[formData,SetFormData] =useState({
    email: "",
    password: "",

  });
  const{email,password} = formData ;
  function onChange(e){
    SetFormData((prevState)=> ({
      ...prevState,
      [e.target.id]: e.target.value.trim(),

    }))
  };
  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password){
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try { 
    dispatch(signInStart());
      const res= await fetch("http://localhost:3000/api/auth/login",{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ 
          email: formData.email,
          password: formData.password,
        }),
       });
       const data=await res.json();
       console.log(data);
       if(data.success===false){
        dispatch(signInFailure(data.message));
        return;
       }
      dispatch(signInSuccess(data));
       navigate('/dashboard?tab=profile');
      }catch (error) {
      dispatch(signInFailure(error.message));
    }
    };
 
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Log In</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="./images/Keys.jpg"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
         <form onSubmit={handleSubmit}> 
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">
                Don't have a account?
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button disabled={loading} className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
              type="submit">{loading ? 'Loading....':'Log In'}</button>
            <div className="flex items-center  my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth />
          </form>
          {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
      </div>
    </section>
  );
}
  

