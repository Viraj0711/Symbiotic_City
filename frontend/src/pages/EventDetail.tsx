import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Notification from '../components/Notification';

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [joiningEvent, setJoiningEvent] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info'
  });

  // Mock event data - replace with API call
  const [event] = useState({
    id: id || '1',
    title: 'Community Garden Workshop',
    description: 'Learn sustainable gardening techniques and help create our community garden. This hands-on workshop will cover composting, organic pest control, water conservation, and seasonal planting. Perfect for beginners and experienced gardeners alike!',
    type: 'workshop',
    date: '2025-11-15T10:00:00',
    location: 'Central Park Pavilion',
    attendees: 45,
    maxAttendees: 60,
    organizer: 'Green Living Initiative',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    agenda: [
      { time: '10:00 AM', activity: 'Welcome & Introduction' },
      { time: '10:30 AM', activity: 'Composting Basics' },
      { time: '11:30 AM', activity: 'Organic Pest Control' },
      { time: '12:30 PM', activity: 'Lunch Break' },
      { time: '1:30 PM', activity: 'Hands-on Planting Session' },
      { time: '3:00 PM', activity: 'Q&A and Closing' }
    ],
    requirements: [
      'Comfortable outdoor clothing',
      'Sun hat and sunscreen',
      'Reusable water bottle',
      'Gardening gloves (optional)'
    ]
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 500);
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'gu' ? 'gu-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type });
  };

  const handleJoinEvent = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    try {
      setJoiningEvent(true);
      
      // TODO: Make API call to join event
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNotification(
        t('eventsPage.notifications.joinSuccess')?.replace('{eventName}', event.title) || 
        `Successfully joined ${event.title}!`,
        'success'
      );
    } catch (error) {
      showNotification(
        t('eventsPage.notifications.joinError') || 'Failed to join event. Please try again.',
        'error'
      );
    } finally {
      setJoiningEvent(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back') || 'Back to Events'}
        </button>

        {/* Event Image */}
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
          />
        )}

        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {event.type}
            </span>
            <span className="text-sm text-gray-500">
              {event.attendees}/{event.maxAttendees} {t('eventsPage.eventDetails.attending') || 'attending'}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="space-y-3 text-gray-600 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m6-6v6M6 15h12" />
              </svg>
              {formatDate(event.date)}
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>

            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {event.organizer}
            </div>
          </div>

          <button
            onClick={handleJoinEvent}
            disabled={joiningEvent}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              joiningEvent
                ? 'bg-green-400 text-white cursor-wait'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {joiningEvent ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('eventsPage.actions.joining') || 'Joining...'}
              </span>
            ) : (
              t('eventsPage.actions.join') || 'Join Event'
            )}
          </button>
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        </div>

        {/* Agenda */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agenda</h2>
          <div className="space-y-4">
            {event.agenda.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-24 font-medium text-green-600">{item.time}</div>
                <div className="flex-1 text-gray-600">{item.activity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Bring</h2>
          <ul className="space-y-2">
            {event.requirements.map((req, index) => (
              <li key={index} className="flex items-start text-gray-600">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
