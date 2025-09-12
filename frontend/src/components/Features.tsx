import { ShoppingCart, Users, Calendar, Lightbulb, Shield, Smartphone } from 'lucide-react';
import { AnimatedSection, StaggeredContainer } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: ShoppingCart,
      title: t('features.items.marketplace.title'),
      description: t('features.items.marketplace.description'),
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: Users,
      title: t('features.items.community.title'),
      description: t('features.items.community.description'),
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: Calendar,
      title: t('features.items.events.title'),
      description: t('features.items.events.description'),
      color: 'bg-lime-100 text-lime-600'
    },
    {
      icon: Lightbulb,
      title: t('features.items.projects.title'),
      description: t('features.items.projects.description'),
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Shield,
      title: t('features.items.security.title'),
      description: t('features.items.security.description'),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Smartphone,
      title: t('features.items.mobile.title'),
      description: t('features.items.mobile.description'),
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <section className="py-16 lg:py-24" style={{backgroundColor: '#E2EAD6'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{color: '#059669'}}>
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </AnimatedSection>

        <StaggeredContainer 
          staggerDelay={0.15}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:border-emerald-500"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{color: '#059669'}}>
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </StaggeredContainer>
      </div>
    </section>
  );
};

export default Features;