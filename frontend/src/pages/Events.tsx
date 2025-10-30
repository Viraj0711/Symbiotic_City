import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/supabase';
import Notification from '../components/Notification';

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Events: React.FC = () => {
  const { events, loading, error, refetch } = useEvents();
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info'
  });
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: t('eventsPage.filters.allTypes') },
    { key: 'workshop', label: t('eventsPage.filters.workshop') },
    { key: 'cleanup', label: t('eventsPage.filters.cleanup') },
    { key: 'meeting', label: t('eventsPage.filters.meeting') },
    { key: 'conference', label: t('eventsPage.filters.conference') },
    { key: 'volunteer', label: t('eventsPage.filters.volunteer') }
  ];

  const filteredEvents = events.filter(event => {
    const matchesCategory = filter === 'all' || event.type === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type });
  };

  const handleJoinEvent = async (eventId: string, eventTitle: string) => {
    if (!user) {
      navigate('/login', { state: { from: '/events', eventId } });
      return;
    }

    try {
      setJoiningEventId(eventId);
      
      // Make API call to join event
      await api.joinEvent(eventId);
      
      // Refetch events to update the UI
      await refetch();
      
      showNotification(
        t('eventsPage.notifications.joinSuccess')?.replace('{eventName}', eventTitle) || 
        `Successfully joined ${eventTitle}!`,
        'success'
      );
    } catch (error: any) {
      const errorMessage = error?.message || t('eventsPage.notifications.joinError') || 'Failed to join event. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setJoiningEventId(null);
    }
  };

  const handleViewDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('eventsPage.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('eventsPage.description')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('eventsPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Create Event Button */}
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              {t('eventsPage.createEvent')}
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('eventsPage.error.title')}</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m6-6v6M6 15h12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('eventsPage.empty.title')}</h3>
            <p className="text-gray-600">{t('eventsPage.empty.description')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isUpcoming(event.date) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isUpcoming(event.date) ? t('eventsPage.status.upcoming') : t('eventsPage.status.past')}
                    </span>
                    <span className="text-sm text-gray-500">{event.type}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                  
                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m6-6v6M6 15h12" />
                      </svg>
                      {formatDate(event.date)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {event.attendees} {t('eventsPage.eventDetails.attending')}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isUpcoming(event.date) ? (
                      <button 
                        onClick={() => handleJoinEvent(event.id, event.title)}
                        disabled={joiningEventId === event.id}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-medium ${
                          joiningEventId === event.id
                            ? 'bg-green-400 text-white cursor-wait'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {joiningEventId === event.id ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('eventsPage.actions.joining')}
                          </span>
                        ) : (
                          t('eventsPage.actions.join')
                        )}
                      </button>
                    ) : (
                      <button className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed text-sm" disabled>
                        {t('eventsPage.actions.eventEnded')}
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewDetails(event.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      {t('eventsPage.actions.details')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
