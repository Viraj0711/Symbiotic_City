import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const Events = () => {
  const events = [
    {
      id: 1,
      title: 'Urban Sustainability Summit',
      date: 'March 15, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'City Convention Center',
      attendees: 250,
      category: 'Conference',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Community Garden Workshop',
      date: 'March 20, 2025',
      time: '10:00 AM - 2:00 PM',
      location: 'Riverside Community Garden',
      attendees: 45,
      category: 'Workshop',
      image: 'https://images.pexels.com/photos/4505/garden.jpg?auto=compress&cs=tinysrgb&w=400',
      status: 'filling-fast'
    },
    {
      id: 3,
      title: 'Clean Energy Fair',
      date: 'March 25, 2025',
      time: '11:00 AM - 6:00 PM',
      location: 'Central Park Pavilion',
      attendees: 150,
      category: 'Fair',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'open'
    }
  ];

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

  return (
    <section id="events" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join local events that bring our community together around sustainability and innovation.
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
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
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-6 text-gray-600">
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
                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200">
                      Register Now
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default Events;