import React, { useEffect, useState } from 'react';
import { db } from './../../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      // Retrieve the state from session storage
      const storedUser = JSON.parse(sessionStorage.getItem('user'));
      const sessionState = storedUser?.state || null;

      if (!sessionState) {
        console.error('No state found in session storage');
        setLoading(false);
        return;
      }

      // Query Firestore for users with the matching state
      const usersCollection = collection(db, 'registrations');
      const usersQuery = query(usersCollection, where('state', '==', sessionState));
      const userSnapshot = await getDocs(usersQuery);
      const userList = userSnapshot.docs.map(doc => doc.data());

      setUsers(userList);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto relative">
      {loading ? (
        <div className="absolute top-20 inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin h-8 w-8 border-4 border-t-4 border-blue-500 rounded-full"></div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center hidden md:block">Registered Users</h2>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto sm:rounded-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-black text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-black text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-black text-left text-xs font-semibold text-white uppercase tracking-wider">Phone</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-black text-left text-xs font-semibold text-white uppercase tracking-wider">Address</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-black text-left text-xs font-semibold text-white uppercase tracking-wider">State</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-black text-left text-xs font-semibold text-white uppercase tracking-wider">District</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-black text-left text-xs font-semibold text-white uppercase tracking-wider">Mandal</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-black text-left text-xs font-semibold text-white uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{user.name || '__'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{user.email || '__'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{user.phone || '__'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{user.address || '__'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{user.state || '__'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{user.district || '__'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{user.mandal || '__'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{user.userType || '__'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden">
            {users.map((user, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                <p className="text-sm text-gray-900"><strong>Name:</strong> {user.name || '__'}</p>
                <p className="text-sm text-gray-900"><strong>Email:</strong> {user.email || '__'}</p>
                <p className="text-sm text-gray-900"><strong>Phone:</strong> {user.phone || '__'}</p>
                <p className="text-sm text-gray-900"><strong>Address:</strong> {user.address || '__'}</p>
                <p className="text-sm text-gray-900"><strong>State:</strong> {user.state || '__'}</p>
                <p className="text-sm text-gray-900"><strong>District:</strong> {user.district || '__'}</p>
                <p className="text-sm text-gray-900"><strong>Mandal:</strong> {user.mandal || '__'}</p>
                <p className="text-sm text-gray-900"><strong>User Type:</strong> {user.userType || '__'}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Users;
