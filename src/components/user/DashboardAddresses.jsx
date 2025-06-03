import { useState } from 'react';

const DashboardAddresses = () => {
  // In a real app, these addresses would come from a service
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'home',
      name: 'Home Address',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      isDefault: true,
      phone: '(555) 123-4567'
    },
    {
      id: '2',
      type: 'work',
      name: 'Office Address',
      address: '456 Park Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10022',
      country: 'United States',
      isDefault: false,
      phone: '(555) 987-6543'
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
    isDefault: false
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Initialize edit form
  const handleEdit = (address) => {
    setFormData(address);
    setEditingAddress(address.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAddress) {
      // Update existing address
      const updatedAddresses = addresses.map(address => 
        address.id === editingAddress ? { ...formData, id: editingAddress } : address
      );
      
      setAddresses(updatedAddresses);
      setEditingAddress(null);
    } else {
      // Add new address
      const newAddress = {
        ...formData,
        id: Date.now().toString()
      };
      
      setAddresses([...addresses, newAddress]);
    }
    
    // Reset form and hide it
    setFormData({
      type: 'home',
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      phone: '',
      isDefault: false
    });
    setShowAddForm(false);
  };
  
  // Delete address
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(address => address.id !== id));
    }
  };
  
  // Set address as default
  const handleSetDefault = (id) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">My Addresses</h2>
          <p className="text-gray-400 text-sm">Manage your shipping and billing addresses</p>
        </div>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Address
          </button>
        )}
      </div>
      
      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-750 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="name">
                  Address Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Home, Office, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="type">
                  Address Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1" htmlFor="address">
                Street Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="123 Main St"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="state">
                  State/Province
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="State"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="postalCode">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Postal Code"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="country">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Country"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="rounded text-red-500 focus:ring-2 focus:ring-red-500 bg-gray-700 border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-300">Set as default address</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAddress(null);
                  setFormData({
                    type: 'home',
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'United States',
                    phone: '',
                    isDefault: false
                  });
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300">No addresses found</h3>
            <p className="text-gray-400 mt-2">
              Add an address to make checkout faster.
            </p>
          </div>
        ) : (
          addresses.map(address => (
            <div 
              key={address.id} 
              className={`bg-gray-750 rounded-xl p-6 border ${address.isDefault ? 'border-red-500' : 'border-gray-700'}`}
            >
              {address.isDefault && (
                <div className="flex items-center text-red-500 text-sm mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Default Address
                </div>
              )}
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium">{address.name}</h3>
                <span className="capitalize px-3 py-1 rounded-full bg-gray-700 text-xs">
                  {address.type}
                </span>
              </div>
              
              <div className="text-gray-300 space-y-1 mb-4">
                <p>{address.address}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="mt-2">{address.phone}</p>
              </div>
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
                
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="px-3 py-1 bg-transparent text-red-500 border border-red-500 rounded hover:bg-red-900/20 transition text-sm"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardAddresses; 