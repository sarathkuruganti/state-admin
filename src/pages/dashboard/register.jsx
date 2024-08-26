import React, { useState, useEffect } from 'react';
import { db } from './../../../firebase'; // Adjust the import path as necessary
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { apDistricts, tgDistricts, odDistricts } from './district'; // Import districts

const SEND_PASSWORD_EMAIL_URL = 'https://sendemail-j4m3al2vxa-el.a.run.app';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    district: '',
    mandal: '',
    userType: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);

  useEffect(() => {
    if (formData.state && formData.userType !== 'Factory') {
      switch (formData.state) {
        case 'Andhra Pradesh':
          setDistricts(Object.keys(apDistricts));
          break;
        case 'Telangana':
          setDistricts(Object.keys(tgDistricts));
          break;
        case 'Odisha':
          setDistricts(Object.keys(odDistricts));
          break;
        default:
          setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.district) {
      const districtData = {
        'Andhra Pradesh': apDistricts,
        'Telangana': tgDistricts,
        'Odisha': odDistricts,
      };
      const districtKey = formData.state;
      const mandalData = districtData[districtKey]?.[formData.district] || [];
      setMandals(mandalData);
    } else {
      setMandals([]);
    }
  }, [formData.district, formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value ? 'Name is required' : '';
      case 'email':
        return !value ? 'Email is required' : '';
      case 'phone':
        if (!value) return 'Phone number is required';
        if (value.length !== 10) return 'Phone number must be exactly 10 digits';
        if (!/^\d{10}$/.test(value)) return 'Phone number must contain only digits';
        return '';
      case 'address':
        return !value ? 'Address is required' : '';
      case 'state':
        return !value ? 'State is required' : '';
      case 'district':
        return !value ? 'District is required' : '';
      case 'mandal':
        return formData.userType === 'Mandal' && !value ? 'Mandal is required' : '';
      case 'userType':
        return !value ? 'User Type is required' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const sendPasswordEmail = async (email, name, password) => {
    try {
      const response = await fetch(SEND_PASSWORD_EMAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'FlavoursOcean - Your New Password',
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Information</title>
              <style>
                  body {
                      background-color: #f4f4f7;
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      margin: 0;
                      padding: 20px;
                  }
                  .card {
                      max-width: 600px;
                      margin: auto;
                      padding: 25px;
                      border-radius: 10px;
                      background-color: #ffffff;
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                      color: #333333;
                  }
                  .card h1 {
                      font-size: 22px;
                      color: #333333;
                      margin-bottom: 20px;
                  }
                  .card p {
                      margin: 10px 0;
                      line-height: 1.6;
                  }
                  .card a {
                      color: #1a73e8;
                      text-decoration: none;
                  }
                  .card a:hover {
                      text-decoration: underline;
                  }
                  .card strong {
                      color: #d9534f;
                  }
                  .footer {
                      text-align: center;
                      margin-top: 20px;
                      font-size: 12px;
                      color: #999999;
                  }
              </style>
          </head>
          <body>
              <div class="card">
                  <h1>Hello ${name},</h1>
          
                  <p>Your temporary FlavoursOcean system password: <strong>${password}</strong></p>
          
                  <p>Login at <a href="https://flavoursocean.com">flavoursocean.com</a> and change this password immediately.</p>
          
                  <p>Please delete this email after use.</p>
          
                  <p>Need help? Contact IT: <a href="mailto:naveenkolagani@flavoursocean.com">naveenkolagani@flavoursocean.com</a></p>
          
                  <p>Best regards,<br>
                  FlavoursOcean</p>
              </div>
          
              <div class="footer">
                  &copy; 2024 FlavoursOcean. All rights reserved.
              </div>
          </body>
          </html>`,
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');
      console.log('Password email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const password = generateRandomPassword();
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
      const user = userCredential.user;

      await sendPasswordEmail(formData.email, formData.name, password);

      await addDoc(collection(db, 'registrations'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        state: formData.state,
        district: formData.district,
        mandal: formData.userType === 'Mandal' ? formData.mandal : '',
        userType: formData.userType,
        uid: user.uid,
      });

      alert('User registered successfully! A password has been sent to the provided email.');

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        district: '',
        mandal: '',
        userType: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error registering user:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Register User</h2>

        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded placeholder-gray-600`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded placeholder-gray-600`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="10"
            pattern="\d{10}"
            title="Phone number must be exactly 10 digits"
            className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded placeholder-gray-600`}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div className="mb-4">
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded placeholder-gray-600`}
          ></textarea>
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        <div className="mb-6">
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${errors.userType ? 'border-red-500' : 'border-gray-300'} rounded`}
          >
            <option value="">Select User Type</option>
            <option value="District">District</option>
            <option value="Mandal">Mandal</option>
          </select>
          {errors.userType && <p className="text-red-500 text-sm">{errors.userType}</p>}
        </div>

        <div className="mb-6">
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded`}
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Telangana">Telangana</option>
            <option value="Odisha">Odisha</option>
          </select>
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        </div>

        {formData.state && (
          <div className="mb-6">
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded`}
            >
              <option value="">Select District</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
          </div>
        )}

        {formData.userType === 'Mandal' && (
          <div className="mb-6">
            <select
              name="mandal"
              value={formData.mandal}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border ${errors.mandal ? 'border-red-500' : 'border-gray-300'} rounded`}
            >
              <option value="">Select Mandal</option>
              {mandals.map((mandal, index) => (
                <option key={index} value={mandal}>
                  {mandal}
                </option>
              ))}
            </select>
            {errors.mandal && <p className="text-red-500 text-sm">{errors.mandal}</p>}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gray-900 text-white p-2 rounded font-bold hover:bg-black"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
