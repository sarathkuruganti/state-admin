import React, { useState } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent successfully!');
    } catch (err) {
      setError('Failed to send password reset email. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h3" className="font-bold mb-4">Forgot Password</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2 bg-white p-6 rounded-lg ">
          <div className="mb-6 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              type="email"
              size="lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${error ? 'border-red-500' : ''}`}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {error && <Typography variant="small" color="red" className="mb-4">{error}</Typography>}
            {success && <Typography variant="small" color="green" className="mb-4">{success}</Typography>}
          </div>
          <Button
            type="submit"
            className="mt-6"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Pattern"
        />
      </div>
    </section>
  );
}

export default ForgotPassword;