import { BookOpen, Users, Lightbulb, AlertTriangle, Heart, MessageCircle } from 'lucide-react';

const Guidelines = () => {
  const guidelines = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Be Respectful",
      description: "Treat all community members with kindness and respect",
      details: [
        "Use inclusive and welcoming language",
        "Respect different perspectives and experiences",
        "Avoid discriminatory or offensive content",
        "Be patient with newcomers to the community"
      ]
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Communicate Constructively",
      description: "Foster positive and meaningful discussions",
      details: [
        "Stay on topic in discussions",
        "Provide constructive feedback",
        "Ask questions to clarify rather than assume",
        "Share knowledge and help others learn"
      ]
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Collaborate Effectively",
      description: "Work together to build amazing projects",
      details: [
        "Be reliable and follow through on commitments",
        "Communicate clearly about project goals and timelines",
        "Share resources and knowledge openly",
        "Give credit where credit is due"
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Build Community",
      description: "Help create a thriving, supportive environment",
      details: [
        "Welcome new members and help them get started",
        "Participate actively in community events",
        "Share your successes and learn from failures",
        "Support local and sustainable initiatives"
      ]
    }
  ];

  const violations = [
    {
      type: "Harassment and Bullying",
      description: "Any form of harassment, bullying, or intimidation",
      examples: ["Personal attacks", "Threats", "Stalking", "Doxxing"]
    },
    {
      type: "Hate Speech",
      description: "Content that promotes hatred based on identity",
      examples: ["Discriminatory language", "Slurs", "Extremist content", "Incitement to violence"]
    },
    {
      type: "Spam and Abuse",
      description: "Disruptive or irrelevant content",
      examples: ["Excessive self-promotion", "Repetitive posting", "Off-topic content", "Fake accounts"]
    },
    {
      type: "Illegal Content",
      description: "Content that violates laws or regulations",
      examples: ["Copyright infringement", "Illegal goods/services", "Fraud", "Privacy violations"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
          <p className="text-xl text-gray-600">
            Building a positive and inclusive community together
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Community Values</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Symbiotic City is built on the foundation of collaboration, sustainability, and mutual support. 
            Our community guidelines ensure that everyone can participate in a safe, welcoming, and 
            productive environment. These guidelines apply to all interactions on our platform, including 
            projects, events, marketplace transactions, and general discussions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By participating in our community, you agree to follow these guidelines and help us maintain 
            a positive space for everyone.
          </p>
        </div>

        {/* Core Guidelines */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Core Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guidelines.map((guideline, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="text-emerald-500 mr-3">{guideline.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{guideline.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{guideline.description}</p>
                <ul className="space-y-2">
                  {guideline.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-sm text-gray-700 flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Prohibited Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Prohibited Content</h2>
          </div>
          
          <p className="text-gray-700 mb-6">
            The following types of content and behavior are not allowed on our platform:
          </p>
          
          <div className="space-y-6">
            {violations.map((violation, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{violation.type}</h3>
                <p className="text-gray-700 mb-3">{violation.description}</p>
                <div className="flex flex-wrap gap-2">
                  {violation.examples.map((example, exampleIndex) => (
                    <span key={exampleIndex} className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enforcement */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Enforcement</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reporting Violations</h3>
              <p className="text-gray-700">
                If you see content or behavior that violates these guidelines, please report it using 
                the report button or contact our moderation team. All reports are reviewed promptly 
                and confidentially.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consequences</h3>
              <p className="text-gray-700 mb-2">
                Violations of these guidelines may result in:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Warning and content removal</li>
                <li>Temporary suspension of account privileges</li>
                <li>Permanent account termination</li>
                <li>Removal from specific projects or events</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Appeals Process</h3>
              <p className="text-gray-700">
                If you believe your content was removed or your account was suspended in error, 
                you can appeal the decision by contacting our support team with relevant information.
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">For Project Leaders</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Clearly communicate project goals and expectations</li>
                <li>• Set realistic timelines and milestones</li>
                <li>• Provide regular updates to team members</li>
                <li>• Be open to feedback and suggestions</li>
                <li>• Recognize and appreciate contributions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">For Community Members</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Read project descriptions carefully before joining</li>
                <li>• Ask questions if something is unclear</li>
                <li>• Communicate your availability and constraints</li>
                <li>• Share resources and knowledge generously</li>
                <li>• Celebrate others' successes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about these guidelines or need to report a violation, 
            please don't hesitate to contact us.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors">
              Contact Support
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Report Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;