'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';

interface Concert {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  reservedSeats: number;
  createdAt: string;
}

interface Stats {
  totalSeats: number;
  ticketsSold: number;
  cancelledReservations: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSeats: 0, ticketsSold: 0, cancelledReservations: 0 });
  const [formData, setFormData] = useState({ name: '', description: '', totalSeats: '' });
  const [loading, setLoading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [concertToDelete, setConcertToDelete] = useState<Concert | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  const API_URL = 'http://localhost:4000';

  useEffect(() => {
    fetchConcerts();
    fetchStats();
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorNotification(true);
    setTimeout(() => setShowErrorNotification(false), 5000);
  };

  const fetchConcerts = async () => {
    try {
      const response = await fetch(`${API_URL}/concerts`);
      const data = await response.json();
      setConcerts(data);
    } catch (error) {
      console.error('Error fetching concerts:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [concertsRes, reservationsRes] = await Promise.all([
        fetch(`${API_URL}/concerts`),
        fetch(`${API_URL}/reservations`)
      ]);
      
      const concerts = await concertsRes.json();
      const reservations = await reservationsRes.json();
      
      const totalSeats = concerts.reduce((sum: number, c: Concert) => sum + c.totalSeats, 0);
      const ticketsSold = reservations.filter((r: any) => r.status === 'active').length;
      const cancelledReservations = reservations.filter((r: any) => r.status === 'cancelled').length;
      
      setStats({ totalSeats, ticketsSold, cancelledReservations });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateConcert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`${API_URL}/concerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          totalSeats: parseInt(formData.totalSeats)
        })
      });
      
      if (response.ok) {
        setFormData({ name: '', description: '', totalSeats: '' });
        fetchConcerts();
        fetchStats();
        setActiveTab('overview');
        showSuccess('Concert created successfully');
      } else {
        const error = await response.json();
        if (error.errors && Array.isArray(error.errors)) {
          const errorMessages = error.errors.map((e: any) => e.errors.join(', ')).join('; ');
          showError(errorMessages);
        } else {
          showError(error.message || 'Failed to create concert');
        }
      }
    } catch (error) {
      console.error('Error creating concert:', error);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConcert = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/concerts/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchConcerts();
        fetchStats();
        showSuccess('Concert deleted successfully');
        setShowDeleteConfirm(false);
        setConcertToDelete(null);
      } else {
        const error = await response.json();
        showError(error.message || 'Cannot delete concert with existing reservations');
        setShowDeleteConfirm(false);
        setConcertToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting concert:', error);
      showError('An unexpected error occurred. Please try again.');
      setShowDeleteConfirm(false);
      setConcertToDelete(null);
    }
  };

  const confirmDelete = (concert: Concert) => {
    setConcertToDelete(concert);
    setShowDeleteConfirm(true);
  };
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar isAdmin={true} />
      
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {showErrorNotification && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <div className="flex-1">
            <p className="font-medium mb-1">Validation Error</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && concertToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{concertToDelete.name}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConcertToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConcert(concertToDelete.id)}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#E84E4E' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#0070A4' }}>
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <p className="text-sm text-white mb-1">Total of seats</p>
                <p className="text-2xl font-bold text-white">{stats.totalSeats}</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#00A58B' }}>
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                </svg>
                <p className="text-sm text-white mb-1">Tickets Sold</p>
                <p className="text-2xl font-bold text-white">{stats.ticketsSold}</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#E84E4E' }}>
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="text-sm text-white mb-1">Cancel</p>
                <p className="text-2xl font-bold text-white">{stats.cancelledReservations}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex gap-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-[#1692EC] text-[#1692EC]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'create'
                      ? 'border-[#1692EC] text-[#1692EC]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Create
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              {concerts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No concerts available. Create one to get started!</p>
              ) : (
                <div className="space-y-4">
                  {concerts.map((concert) => (
                    <div key={concert.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{concert.name}</h3>
                          <p className="text-sm text-gray-600">{concert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span className="text-sm font-medium">{concert.totalSeats} total seats</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                            </svg>
                            <span className="text-sm font-medium">{concert.reservedSeats} reserved</span>
                          </div>
                        </div>
                        <button
                          onClick={() => confirmDelete(concert)}
                          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#E84E4E' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6" style={{ color: '#1692EC' }}>Create Event</h2>
              <form onSubmit={handleCreateConcert} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="concertName" className="block text-sm font-medium text-gray-700 mb-2">
                      Concert Name
                    </label>
                    <input
                      type="text"
                      id="concertName"
                      name="concertName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter concert name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700 mb-2">
                      Total of Seats
                    </label>
                    <input
                      type="number"
                      id="totalSeats"
                      name="totalSeats"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter total number of seats"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter concert description"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: '#1692EC' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
