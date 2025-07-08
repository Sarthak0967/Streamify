import React, { useState } from 'react';
import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';
import Image from '/assets/Video call-bro.png';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api.js';

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

const queryClient = useQueryClient();


const { mutate: signupMutation, isPending, error } = useMutation({
  mutationFn : signup,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
});
  const handleSignup = (e) => {
    e.preventDefault();
    // Signup logic here
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="w-full max-w-3xl mx-auto bg-base-100 rounded-xl shadow-lg border border-primary/25 flex flex-col lg:flex-row overflow-hidden ">


        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
          {/* Logo Section */}
          <div className="mb-4 flex items-center gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <span>{error.response.data.message}</span>
            </div>
          )}
          {/* Success Message */}
          {isPending && (
            <div className="alert alert-success">
              <span>Signup successful! Redirecting...</span>
            </div>
          )}
          {/* Form */}
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Create an account</h2>
                <p className="text-sm opacity-70">
                  Join Streamify and start your language learning journey with personalized content and interactive features.
                </p>
              </div>

              <div className="space-y-3">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="input input-bordered w-full"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  <p className="text-xs mt-1 opacity-70">
                    Your password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
                  </p>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" className="checkbox checkbox-sm" required />
                    <span className="text-xs leading-tight">
                      I agree to the <span className="text-primary hover:underline">terms of service</span> and{" "}
                      <span className="text-primary hover:underline">privacy policy</span>.
                    </span>
                  </label>
                </div>
              </div>

              <button className="btn btn-primary w-full" type="submit">
                {isPending ? (
                  <span className="loading loading-spinner loading-sm">Loading......</span>
                ) : (
                  "Sign Up"
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Right Section - Image and Text */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center p-8">
          <div className="max-w-sm">
            <div className="aspect-square relative">
              <img src={Image} alt="Signup Visual" className="w-full h-auto object-contain" />
            </div>
            <div className="text-center space-y-2 mt-6">
              <h2 className="text-lg font-semibold">Connect with language partners worldwide</h2>
              <p className="text-sm opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
