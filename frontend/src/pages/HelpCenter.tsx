import { Search, Book, MessageCircle, Video, FileText, Phone } from 'lucide-react';

const HelpCenter = () => {
  const categories = [
    {
      icon: <Book className="h-6 w-6" />,
      title: "Getting Started",
      description: "Learn the basics of using Symbiotic City",
      articles: 12
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Community Guidelines",
      description: "Rules and best practices for community interaction",
      articles: 8
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Project Management",
      description: "How to create and manage projects effectively",
      articles: 15
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Marketplace",
      description: "Buying, selling, and trading on the platform",
      articles: 10
    }
  ];

  const faqs = [
    {
      question: "How do I create my first project?",
      answer: "Navigate to the Projects page and click 'Create Project'. Fill in the required details including title, description, and goals."
    },
    {
      question: "How do I join a community event?",
      answer: "Visit the Events page, find an event you're interested in, and click 'Join Event'. Some events may require approval from organizers."
    },
    {
      question: "What payment methods are accepted in the marketplace?",
      answer: "We accept major credit cards, PayPal, and bank transfers. All transactions are secured and encrypted."
    },
    {
      question: "How can I report inappropriate content?",
      answer: "Click the report button on any content, or contact our support team directly. We review all reports within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to your questions and get the help you need</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-emerald-500 mb-4">{category.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{category.description}</p>
              <p className="text-emerald-600 text-sm font-medium">{category.articles} articles</p>
            </div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="#" className="block p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="font-medium text-gray-900 mb-1">How to set up your profile</h3>
              <p className="text-sm text-gray-600">Complete guide to creating an engaging profile</p>
            </a>
            <a href="#" className="block p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="font-medium text-gray-900 mb-1">Community safety guidelines</h3>
              <p className="text-sm text-gray-600">Stay safe while connecting with others</p>
            </a>
            <a href="#" className="block p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="font-medium text-gray-900 mb-1">Project funding basics</h3>
              <p className="text-sm text-gray-600">Learn how to fund your community projects</p>
            </a>
            <a href="#" className="block p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="font-medium text-gray-900 mb-1">Marketplace seller tips</h3>
              <p className="text-sm text-gray-600">Maximize your success as a seller</p>
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">Our support team is here to help you</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Start Chat</span>
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Call Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;