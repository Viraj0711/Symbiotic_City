import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, X } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

interface EventsProps {
  limit?: number;
}

const Events: React.FC<EventsProps> = ({ limit }) => {
  const { events, loading, error } = useEvents();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<{ [key: string]: 'registering' | 'registered' | 'error' }>({});

  // Handle event registration
  const handleRegisterNow = async (event: any) => {
    if (!user) {
      // Store the intended action and redirect to login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      localStorage.setItem('pendingAction', JSON.stringify({ type: 'registerEvent', eventId: event.id, eventTitle: event.title }));
      window.location.href = '/login';
      return;
    }

    try {
      setRegistrationStatus(prev => ({ ...prev, [event.id]: 'registering' }));
      
      // Simulate API call for event registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRegistrationStatus(prev => ({ ...prev, [event.id]: 'registered' }));
      
      // Show success notification with website theme
      showNotification({
        type: 'success',
        title: 'Successfully registered!',
        message: `You're registered for "${event.title}". Check your email for confirmation details.`,
        duration: 6000
      });
      
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationStatus(prev => ({ ...prev, [event.id]: 'error' }));
      
      // Show error notification
      showNotification({
        type: 'error',
        title: 'Registration failed',
        message: 'Something went wrong. Please try again later.',
        duration: 5000
      });
    }
  };

  // Handle learn more button
  const handleLearnMore = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Handle view all events
  const handleViewAllEvents = () => {
    // Navigate to events page or show all events
    window.location.href = '/events';
  };

  // Handle event details modal close
  const handleEventDetailsClose = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'filling-fast':
        return 'bg-orange-100 text-orange-800';
      case 'open':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'filling-fast':
        return 'Filling Fast';
      case 'open':
        return 'Open Registration';
      default:
        return 'Available';
    }
  };

  if (loading) {
    return (
      <section id="events" className="py-16 lg:py-24 rounded-3xl shadow-2xl" style={{backgroundColor: '#B3C893'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="events" className="py-16 lg:py-24 rounded-3xl shadow-2xl" style={{backgroundColor: '#B3C893'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">Error loading events: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 lg:py-24 rounded-3xl shadow-2xl" style={{backgroundColor: '#B3C893'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{color: '#1F2937'}}>
            Upcoming Events
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{color: '#4B5563'}}>
            Join local events that bring our community together around sustainability and innovation.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No events scheduled yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for upcoming community events!</p>
          </div>
        ) : (
          <div className="space-y-8 mb-12">
          {(limit ? events.slice(0, limit) : events).map((event) => (
            <div
              key={event.id}
              className="bg-gray-700 rounded-xl border border-gray-600 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{event.title}</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-6 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-emerald-600" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleRegisterNow(event)}
                      disabled={registrationStatus[event.id] === 'registering'}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        registrationStatus[event.id] === 'registered'
                          ? 'bg-green-600 text-white cursor-default'
                          : registrationStatus[event.id] === 'registering'
                          ? 'bg-emerald-400 text-white cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {registrationStatus[event.id] === 'registered' 
                        ? 'Registered ✓' 
                        : registrationStatus[event.id] === 'registering'
                        ? 'Registering...'
                        : 'Register Now'
                      }
                    </button>
                    <button 
                      onClick={() => handleLearnMore(event)}
                      className="border border-gray-600 text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        <div className="text-center">
          <button 
            onClick={handleViewAllEvents}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
          >
            View All Events
          </button>
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <button
                onClick={handleEventDetailsClose}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedEvent.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                  {getStatusText(selectedEvent.status)}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h2>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span>{selectedEvent.attendees} attendees</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedEvent.description || 'Join us for this exciting community event focused on sustainability and environmental impact. This event brings together like-minded individuals passionate about creating positive change in our community.'}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What to Expect</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Interactive workshops and activities</li>
                  <li>• Networking opportunities with community members</li>
                  <li>• Expert speakers and presentations</li>
                  <li>• Refreshments and light meals provided</li>
                </ul>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => {
                    handleEventDetailsClose();
                    handleRegisterNow(selectedEvent);
                  }}
                  disabled={registrationStatus[selectedEvent.id] === 'registering'}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    registrationStatus[selectedEvent.id] === 'registered'
                      ? 'bg-green-600 text-white cursor-default'
                      : registrationStatus[selectedEvent.id] === 'registering'
                      ? 'bg-emerald-400 text-white cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {registrationStatus[selectedEvent.id] === 'registered' 
                    ? 'Registered ✓' 
                    : registrationStatus[selectedEvent.id] === 'registering'
                    ? 'Registering...'
                    : 'Register Now'
                  }
                </button>
                <button
                  onClick={handleEventDetailsClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Events;