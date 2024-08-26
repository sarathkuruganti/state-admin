import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './../../../firebase';

export function InvoiceDetails() {
  const { invoiceNumber } = useParams(); // Get the invoice number from the URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const q = query(
          collection(db, 'invoice'),
          where('invoiceNumber', '==', Number(invoiceNumber))
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setInvoice(querySnapshot.docs[0].data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching invoice: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No invoice found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Invoice Details</h1>
        
        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-2 gap-4 mb-4">
          <p className="text-lg"><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>   
          <p className="text-lg"><strong>Issued:</strong> {invoice.dateIssued}</p>
          <p className="text-lg"><strong>Customer:</strong> {invoice.invoiceTo}</p>
          <p className="text-lg"><strong>Sales Person:</strong> {invoice.salesPerson}</p>
          <p className="text-lg"><strong>Customer Address:</strong> {invoice.customerAddress}</p>
          <p className="text-lg"><strong>Factory Phone Number:</strong> {invoice.factoryPhoneNumber}</p> 
          <p className="text-lg"><strong>Total:</strong> ₹{invoice.total}</p>
          <p className="text-lg"><strong>Factory Details:</strong> {invoice.factoryDetails}</p>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex flex-col gap-4 mb-4">
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">Invoice Number:</p>
              <p>{invoice.invoiceNumber}</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">Issued:</p>
              <p>{invoice.dateIssued}</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">Customer:</p>
              <p>{invoice.invoiceTo}</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">Sales Person:</p>
              <p>{invoice.salesPerson}</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">Customer Address:</p>
              <p>{invoice.customerAddress}</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">Factory Phone Number:</p>
              <p>{invoice.factoryPhoneNumber}</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">Total:</p>
              <p>₹{invoice.total}</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">Factory Details:</p>
              <p>{invoice.factoryDetails}</p>
            </div>
          </div>
        </div>

        {/* Items Table (Desktop) */}
        <div className="overflow-x-auto mt-6 hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items && invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{item.cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Items List (Mobile) */}
        <div className="md:hidden mt-6">
          {invoice.items && invoice.items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm mb-4">
              <p className="font-semibold">Item:</p>
              <p>{item.item}</p>
              <p className="font-semibold">Quantity:</p>
              <p>{item.quantity}</p>
              <p className="font-semibold">Cost:</p>
              <p>₹{item.cost}</p>
              <p className="font-semibold">Price:</p>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;