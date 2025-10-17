import React from 'react';

interface MaleAvatarProps {
  className?: string;
}

export const MaleAvatar: React.FC<MaleAvatarProps> = ({ className = 'w-32 h-32' }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="100" cy="70" r="35" fill="#FFD4A3" stroke="#333" strokeWidth="2"/>
    {/* Hair */}
    <path d="M 70 50 Q 70 35, 85 35 Q 100 30, 115 35 Q 130 35, 130 50" fill="#4A3F35" />
    {/* Eyes */}
    <circle cx="90" cy="70" r="3" fill="#333"/>
    <circle cx="110" cy="70" r="3" fill="#333"/>
    {/* Nose */}
    <line x1="100" y1="75" x2="100" y2="82" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
    {/* Mouth */}
    <path d="M 92 90 Q 100 95, 108 90" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Body */}
    <rect x="75" y="105" width="50" height="55" rx="5" fill="#3B82F6"/>
    {/* Arms */}
    <rect x="60" y="110" width="15" height="35" rx="7" fill="#FFD4A3"/>
    <rect x="125" y="110" width="15" height="35" rx="7" fill="#FFD4A3"/>
    {/* Legs */}
    <rect x="80" y="160" width="15" height="35" rx="7" fill="#1E40AF"/>
    <rect x="105" y="160" width="15" height="35" rx="7" fill="#1E40AF"/>
  </svg>
);

export const FemaleAvatar: React.FC<MaleAvatarProps> = ({ className = 'w-32 h-32' }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="100" cy="70" r="35" fill="#FFE4C4" stroke="#333" strokeWidth="2"/>
    {/* Hair - longer style */}
    <ellipse cx="100" cy="55" rx="38" ry="30" fill="#8B4513"/>
    <path d="M 62 65 Q 62 90, 68 95 L 72 90 Q 70 70, 65 60" fill="#8B4513"/>
    <path d="M 138 65 Q 138 90, 132 95 L 128 90 Q 130 70, 135 60" fill="#8B4513"/>
    {/* Eyes - larger */}
    <circle cx="90" cy="70" r="4" fill="#333"/>
    <circle cx="110" cy="70" r="4" fill="#333"/>
    {/* Eyelashes */}
    <line x1="88" y1="66" x2="86" y2="63" stroke="#333" strokeWidth="1"/>
    <line x1="92" y1="66" x2="94" y2="63" stroke="#333" strokeWidth="1"/>
    <line x1="108" y1="66" x2="106" y2="63" stroke="#333" strokeWidth="1"/>
    <line x1="112" y1="66" x2="114" y2="63" stroke="#333" strokeWidth="1"/>
    {/* Nose */}
    <line x1="100" y1="75" x2="100" y2="80" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Lips */}
    <path d="M 92 88 Q 100 92, 108 88" stroke="#FF6B9D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Body - dress */}
    <path d="M 75 105 L 70 160 L 130 160 L 125 105 Z" fill="#EC4899" stroke="#333" strokeWidth="2"/>
    {/* Arms */}
    <rect x="60" y="110" width="15" height="35" rx="7" fill="#FFE4C4"/>
    <rect x="125" y="110" width="15" height="35" rx="7" fill="#FFE4C4"/>
  </svg>
);

export const NeutralAvatar: React.FC<MaleAvatarProps> = ({ className = 'w-32 h-32' }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="100" cy="70" r="35" fill="#F5DEB3" stroke="#333" strokeWidth="2"/>
    {/* Hair */}
    <path d="M 65 50 Q 70 35, 100 35 Q 130 35, 135 50" fill="#6B5B4D" />
    {/* Eyes */}
    <circle cx="90" cy="70" r="3.5" fill="#333"/>
    <circle cx="110" cy="70" r="3.5" fill="#333"/>
    {/* Nose */}
    <line x1="100" y1="75" x2="100" y2="81" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
    {/* Mouth */}
    <line x1="92" y1="90" x2="108" y2="90" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
    {/* Body */}
    <rect x="75" y="105" width="50" height="55" rx="5" fill="#10B981"/>
    {/* Arms */}
    <rect x="60" y="110" width="15" height="35" rx="7" fill="#F5DEB3"/>
    <rect x="125" y="110" width="15" height="35" rx="7" fill="#F5DEB3"/>
    {/* Legs */}
    <rect x="80" y="160" width="15" height="35" rx="7" fill="#064E3B"/>
    <rect x="105" y="160" width="15" height="35" rx="7" fill="#064E3B"/>
  </svg>
);

interface GenderAvatarProps {
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  className?: string;
}

export const GenderAvatar: React.FC<GenderAvatarProps> = ({ gender, className = 'w-32 h-32' }) => {
  switch (gender) {
    case 'male':
      return <MaleAvatar className={className} />;
    case 'female':
      return <FemaleAvatar className={className} />;
    default:
      return <NeutralAvatar className={className} />;
  }
};
