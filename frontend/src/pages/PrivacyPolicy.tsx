import { Shield, Eye, Lock, Users, Database, AlertTriangle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: September 4, 2025</p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              At Symbiotic City, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform. Please read this privacy 
              policy carefully. By using our service, you consent to the data practices described in this statement.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name, email address, and contact information</li>
                  <li>Profile information including bio, interests, and location</li>
                  <li>Account credentials and security information</li>
                  <li>Payment information for marketplace transactions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>How you interact with our platform and services</li>
                  <li>Pages visited, features used, and time spent on the platform</li>
                  <li>Device information, IP address, and browser type</li>
                  <li>Location data when you choose to share it</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>To provide, operate, and maintain our platform</li>
              <li>To improve and personalize your experience</li>
              <li>To process transactions and send related information</li>
              <li>To send administrative information and updates</li>
              <li>To respond to comments, questions, and requests</li>
              <li>To prevent fraud and enhance security</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your 
              information in the following situations:
            </p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>With your consent or at your direction</li>
              <li>With service providers who assist us in operating our platform</li>
              <li>To comply with legal requirements or protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
              <li>To protect the safety and security of our users</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            
            <p className="text-gray-700">
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction. 
              However, no method of transmission over the internet is 100% secure, and we cannot 
              guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            
            <p className="text-gray-700 mb-4">You have the right to:</p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and personal information</li>
              <li>Opt-out of certain communications</li>
              <li>Data portability and export</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            </div>
            
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Email: privacy@symbioticCity.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 123 Green Street, City, State 12345
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;