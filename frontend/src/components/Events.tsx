import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, X } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface EventsProps {
  limit?: number;
}

const Events: React.FC<EventsProps> = ({ limit }) => {
  const { events, loading, error } = useEvents();
  const { user } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<{ [key: string]: 'registering' | 'registered' | 'error' }>({});

  // Format date based on current language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (currentLanguage === 'gu') {
      // Custom formatting for Gujarati
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const weekday = date.getDay();
      
      const gujaratiDays = [
        t('dateTime.daysShort.sun'), 
        t('dateTime.daysShort.mon'), 
        t('dateTime.daysShort.tue'), 
        t('dateTime.daysShort.wed'), 
        t('dateTime.daysShort.thu'), 
        t('dateTime.daysShort.fri'), 
        t('dateTime.daysShort.sat')
      ];
      const gujaratiMonths = [
        t('dateTime.monthsShort.jan'), 
        t('dateTime.monthsShort.feb'), 
        t('dateTime.monthsShort.mar'), 
        t('dateTime.monthsShort.apr'), 
        t('dateTime.monthsShort.may'), 
        t('dateTime.monthsShort.jun'), 
        t('dateTime.monthsShort.jul'), 
        t('dateTime.monthsShort.aug'), 
        t('dateTime.monthsShort.sep'), 
        t('dateTime.monthsShort.oct'), 
        t('dateTime.monthsShort.nov'), 
        t('dateTime.monthsShort.dec')
      ];
      
      const time = date.toLocaleTimeString('gu-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace('AM', t('dateTime.timeUnits.am')).replace('PM', t('dateTime.timeUnits.pm'));
      
      return `${gujaratiDays[weekday]}, ${gujaratiMonths[month]} ${day}, ${year}, ${time}`;
    }
    
    if (currentLanguage === 'hi') {
      // Custom formatting for Hindi
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const weekday = date.getDay();
      
      const hindiDays = [
        t('dateTime.daysShort.sun'), 
        t('dateTime.daysShort.mon'), 
        t('dateTime.daysShort.tue'), 
        t('dateTime.daysShort.wed'), 
        t('dateTime.daysShort.thu'), 
        t('dateTime.daysShort.fri'), 
        t('dateTime.daysShort.sat')
      ];
      const hindiMonths = [
        t('dateTime.monthsShort.jan'), 
        t('dateTime.monthsShort.feb'), 
        t('dateTime.monthsShort.mar'), 
        t('dateTime.monthsShort.apr'), 
        t('dateTime.monthsShort.may'), 
        t('dateTime.monthsShort.jun'), 
        t('dateTime.monthsShort.jul'), 
        t('dateTime.monthsShort.aug'), 
        t('dateTime.monthsShort.sep'), 
        t('dateTime.monthsShort.oct'), 
        t('dateTime.monthsShort.nov'), 
        t('dateTime.monthsShort.dec')
      ];
      
      const time = date.toLocaleTimeString('hi-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(/AM|am/g, t('dateTime.timeUnits.am')).replace(/PM|pm/g, t('dateTime.timeUnits.pm'));
      
      return `${hindiDays[weekday]}, ${hindiMonths[month]} ${day}, ${year}, ${time}`;
    }
    
    // English formatting
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

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
      
      // Show success notification
      alert(`Successfully registered for "${event.title}"! Check your email for confirmation details.`);
      
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationStatus(prev => ({ ...prev, [event.id]: 'error' }));
      
      // Show error notification
      alert('Registration failed. Something went wrong. Please try again later.');
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
        return t('events.statusUpcoming');
      case 'filling-fast':
        return t('events.statusFillingFast');
      case 'open':
        return t('events.statusOpen');
      default:
        return t('events.statusAvailable');
    }
  };

  if (loading) {
    return (
      <section id="events" className="py-16 lg:py-24 rounded-3xl shadow-2xl" style={{backgroundColor: '#B3C893'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">{t('events.loading')}</p>
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
            <p className="text-red-400">{t('events.error')}: {error}</p>
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
            {t('events.title')}
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{color: '#4B5563'}}>
            {t('events.description')}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">{t('events.noEvents')}</p>
            <p className="text-gray-500 mt-2">{t('events.checkBack')}</p>
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
                      <span>{formatDate(event.date)}</span>
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
                      <span>{event.attendees} {t('events.attendees')}</span>
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
                        ? t('events.registered')
                        : registrationStatus[event.id] === 'registering'
                        ? t('events.registering')
                        : t('events.registerNow')
                      }
                    </button>
                    <button 
                      onClick={() => handleLearnMore(event)}
                      className="border border-gray-600 text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
                    >
                      {t('events.learnMore')}
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
            {t('events.viewAllEvents')}
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
                  <span>{formatDate(selectedEvent.date)}</span>
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
                  <span>{selectedEvent.attendees} {t('events.attendees')}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('events.eventDescription')}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedEvent.description || 'Join us for this exciting community event focused on sustainability and environmental impact. This event brings together like-minded individuals passionate about creating positive change in our community.'}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('events.whatToExpect')}</h3>
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
                    ? t('events.registered')
                    : registrationStatus[selectedEvent.id] === 'registering'
                    ? t('events.registering')
                    : t('events.registerNow')
                  }
                </button>
                <button
                  onClick={handleEventDetailsClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  {t('events.close')}
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