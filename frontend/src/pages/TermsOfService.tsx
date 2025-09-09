import { FileText, Scale, Users, AlertCircle, Shield, Gavel } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <FileText className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: September 4, 2025</p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              Welcome to Symbiotic City. These Terms of Service ("Terms") govern your use of our platform 
              and services. By accessing or using our service, you agree to be bound by these Terms. 
              If you disagree with any part of these terms, then you may not access the service.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Scale className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            
            <p className="text-gray-700">
              By creating an account or using our services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and our Privacy Policy. These Terms 
              apply to all users of the service, including without limitation users who are browsers, 
              vendors, customers, merchants, and contributors of content.
            </p>
          </section>

          {/* User Accounts */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">User Accounts</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Creation</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>You must be at least 13 years old to create an account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>One person or entity may not maintain multiple accounts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>You are liable for all activities under your account</li>
                  <li>We reserve the right to suspend or terminate accounts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Acceptable Use</h2>
            </div>
            
            <p className="text-gray-700 mb-4">You agree not to use the service to:</p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Violate any applicable local, state, national, or international law</li>
              <li>Transmit any harassing, libelous, abusive, or threatening content</li>
              <li>Spam, solicit, or harm other users</li>
              <li>Distribute malware or engage in any malicious activities</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>
          </section>

          {/* Platform Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Services</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Features</h3>
                <p className="text-gray-700">
                  Our platform provides community building tools, project management, event organization, 
                  and marketplace functionality. We strive to maintain these services but cannot guarantee 
                  uninterrupted availability.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Content</h3>
                <p className="text-gray-700">
                  Users are responsible for all content they post. We reserve the right to remove content 
                  that violates these Terms or our community guidelines. We do not endorse or guarantee 
                  the accuracy of user-generated content.
                </p>
              </div>
            </div>
          </section>

          {/* Payment and Transactions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment and Transactions</h2>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>All transactions are subject to our payment processing terms</li>
              <li>Prices and availability are subject to change without notice</li>
              <li>Refunds are handled according to our refund policy</li>
              <li>You are responsible for all applicable taxes</li>
              <li>We may charge fees for certain services</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            
            <p className="text-gray-700 mb-4">
              The service and its original content, features, and functionality are owned by Symbiotic City 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
            
            <p className="text-gray-700">
              Users retain rights to content they create, but grant us a license to use, display, and 
              distribute such content on our platform.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            
            <p className="text-gray-700">
              In no event shall Symbiotic City, its directors, employees, or agents be liable for any 
              indirect, incidental, special, consequential, or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
              from your use of the service.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Gavel className="h-6 w-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Termination</h2>
            </div>
            
            <p className="text-gray-700">
              We may terminate or suspend your account and bar access to the service immediately, 
              without prior notice or liability, under our sole discretion, for any reason whatsoever 
              and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify or replace these Terms at any time. If a revision is 
              material, we will provide at least 30 days notice prior to any new terms taking effect. 
              What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Email: legal@symbioticCity.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 123 Green Street, City, State 12345
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;