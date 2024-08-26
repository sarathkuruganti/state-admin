import React, { useState } from 'react';
import { db, storage } from './../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function AddNewProduct() {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [manufacturedDate, setManufacturedDate] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    let imageUrl = '';

    if (image) {
      const imageRef = ref(storage, `products/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      await addDoc(collection(db, 'products'), {
        productName,
        quantity,
        price,
        manufacturedDate,
        imageUrl
      });
      setSuccessMessage('Product added successfully!');
      setProductName('');
      setQuantity('');
      setPrice('');
      setManufacturedDate('');
      setImage(null);
    } catch (error) {
      setErrorMessage('Error adding product: ' + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      
      {successMessage && (
        <div className="mb-4 text-green-600">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 text-red-600">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="productName" className="mb-1 text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="quantity" className="mb-1 text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="price" className="mb-1 text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="manufacturedDate" className="mb-1 text-sm font-medium text-gray-700">Manufactured Date</label>
          <input
            type="date"
            id="manufacturedDate"
            value={manufacturedDate}
            onChange={(e) => setManufacturedDate(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="image" className="mb-1 text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddNewProduct;
