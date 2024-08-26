import React, { useEffect, useState } from 'react';
import { db } from './../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative">
      {loading ? (
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center hidden md:block">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill().map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex animate-pulse"
              >
                <div className="w-1/2 h-48 bg-gray-200"></div>
                <div className="p-6 flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center hidden md:block">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex"
              >
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-1/2 h-48 object-cover"
                />
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-semibold capitalize mb-2">{product.productName}</h3>
                  <p className="text-gray-800 mb-2"><strong>Price:</strong> ₹{Number(product.price).toFixed(2)}</p>
                  <p className="text-gray-800 mb-4"><strong>Quantity:</strong> {product.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
