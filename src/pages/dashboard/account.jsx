import React, { useEffect, useState, useRef } from 'react';
import { auth } from './../../../firebase'; // Adjust the path as necessary
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

export function Account() {
  const [userData, setUserData] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const addressInputRef = useRef(null);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setTempAddress(parsedUserData.address);
    }
  }, []);

  const handleEditAddress = () => {
    setIsEditingAddress(true);
    setTimeout(() => {
      if (addressInputRef.current) {
        addressInputRef.current.focus();
      }
    }, 0);
  };

  const handleSaveAddress = () => {
    const updatedUserData = { ...userData, address: tempAddress };
    setUserData(updatedUserData);
    setIsEditingAddress(false);
    sessionStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const handleChangeAddress = (e) => {
    setTempAddress(e.target.value);
  };

  const handleBlurAddress = () => {
    if (tempAddress !== userData.address) {
      handleSaveAddress();
    } else {
      setIsEditingAddress(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUppercase &&
      hasLowercase &&
      hasDigit &&
      hasSpecialChar
    );
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      setPasswordSuccess('');
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.');
      setPasswordSuccess('');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user is signed in.');

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        prompt('Enter your current password') // Prompt for current password
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setPasswordSuccess('Password successfully updated!');
      setPasswordError('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
        if (error.code === 'auth/invalid-credential') {
          setPasswordError('Current password is incorrect. Please try again.');
        } else {
          setPasswordError(error.message);
        }
        setPasswordSuccess('');
      }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-black to-black p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Account Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* User Info */}
            <div className="flex items-start">
              <div className="text-blue-500">
                <i className="fas fa-user fa-2x"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">Name</p>
                <p className="font-semibold">{userData.name}</p>
              </div>
            </div>
            {/* Email */}
            <div className="flex items-start">
              <div className="text-orange-500">
                <i className="fas fa-envelope fa-2x"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{userData.email}</p>
              </div>
            </div>
            {/* Phone */}
            <div className="flex items-start">
              <div className="text-green-500">
                <i className="fas fa-phone fa-2x"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">Phone</p>
                <p className="font-semibold">{userData.phone}</p>
              </div>
            </div>
            {/* Role */}
            <div className="flex items-start">
              <div className="text-red-500">
                <i className="fas fa-user-tag fa-2x"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">Role</p>
                <p className="font-semibold">{userData.userType}</p>
              </div>
            </div>
            {/* Address */}
            <div className="flex items-start">
              <div className="text-purple-500">
                <i className="fas fa-map-marker-alt fa-2x"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">Address</p>
                {isEditingAddress ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={tempAddress}
                      onChange={handleChangeAddress}
                      onBlur={handleBlurAddress}
                      ref={addressInputRef}
                      className="border p-2 rounded-md"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <p className="font-semibold">{userData.address}</p>
                    <button
                      onClick={handleEditAddress}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Factory */}
            <div className="flex items-start">
              <div className="text-indigo-500">
                <i className="fas fa-industry fa-2x"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">Factory</p>
                <p className="font-semibold">{userData.factory}</p>
              </div>
            </div>
            {/* State */}
            <div className="flex items-start sm:col-span-2">
              <div className="text-pink-500">
                <i className="fas fa-map-signs fa-2x"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">State</p>
                <p className="font-semibold">{userData.state}</p>
              </div>
            </div>
          </div>
          <hr className="my-6" />
          {/* Reset Password Section */}
          <div className="mt-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reset Password</h3>
            <div className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 rounded-md w-full placeholder-gray-600"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 rounded-md w-full placeholder-gray-600"
              />
              {passwordError && (
                <p className="text-red-500">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-green-500">{passwordSuccess}</p>
              )}
              <div className="flex justify-end">
                <button
                  onClick={handleSavePassword}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
