'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

interface Concert {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  reservedSeats: number;
}

interface Reservation {
  id: number;
  status: string;
  createdAt: string;
  concert: Concert;
}

export default function UserPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = 1;
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = 'http://localhost:4000';

  useEffect(() => {
    fetchConcerts();
    fetchUserReservations();
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

  const fetchUserReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations/user/${userId}`);
      const data = await response.json();
      setReservations(data.filter((r: Reservation) => r.status === 'active'));
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleReserveSeat = async (concertId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, concertId })
      });
      
      if (response.ok) {
        fetchConcerts();
        fetchUserReservations();
        showSuccess('Seat reserved successfully!');
      } else {
        const error = await response.json();
        if (error.errors && Array.isArray(error.errors)) {
          const errorMessages = error.errors.map((e: any) => e.errors.join(', ')).join('; ');
          showError(errorMessages);
        } else {
          showError(error.message || 'Failed to reserve seat');
        }
      }
    } catch (error) {
      console.error('Error reserving seat:', error);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        fetchConcerts();
        fetchUserReservations();
        showSuccess('Reservation cancelled successfully');
      } else {
        const error = await response.json();
        showError(error.message || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      showError('An unexpected error occurred. Please try again.');
    }
  };

  const hasUserReserved = (concertId: number) => {
    return reservations.some(r => r.concert.id === concertId);
  };
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar isAdmin={false} />
      
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
            <p className="font-medium mb-1">Error</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
            <p className="text-gray-600">Book tickets for upcoming concerts</p>
          </div>

          {/* Available Events */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Events</h2>
            {concerts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No concerts available at the moment</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {concerts.map((concert) => (
                  <div key={concert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{concert.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{concert.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          <span className="text-sm font-medium">{concert.totalSeats - concert.reservedSeats} available</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleReserveSeat(concert.id)}
                        disabled={loading || hasUserReserved(concert.id) || concert.reservedSeats >= concert.totalSeats}
                        className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#1692EC' }}
                      >
                        {hasUserReserved(concert.id) ? 'Already Reserved' : concert.reservedSeats >= concert.totalSeats ? 'Fully Reserved' : 'Reserve Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Bookings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Bookings</h2>
            {reservations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">You haven't made any bookings yet</p>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900">{reservation.concert.name}</h3>
                      <p className="text-sm text-gray-600">{reservation.concert.description}</p>
                      <span className="text-xs text-green-600 font-medium">Confirmed • {new Date(reservation.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span className="text-sm font-medium">1 seat reserved</span>
                      </div>
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#E84E4E' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
