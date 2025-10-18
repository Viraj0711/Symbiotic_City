import { pool } from '../config/database';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed Events
    const events = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Community Clean-Up Drive',
        description: 'Join us for a neighborhood clean-up event to make our community greener and cleaner.',
        start_date: '2026-03-15T09:00:00Z',
        end_date: '2026-03-15T13:00:00Z',
        location: JSON.stringify({ address: 'Central Park', city: 'Downtown', coordinates: { lat: 40.7829, lng: -73.9654 } }),
        category: 'volunteer',
        tags: ['community', 'environment', 'volunteer'],
        organizer_id: '00000000-0000-0000-0000-000000000001', // System organizer
        attendees: [],
        max_attendees: 100,
        is_virtual: false,
        virtual_link: null
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Sustainability Workshop',
        description: 'Learn about sustainable living practices and how to reduce your carbon footprint.',
        start_date: '2026-03-20T14:00:00Z',
        end_date: '2026-03-20T17:00:00Z',
        location: JSON.stringify({ address: 'Community Center', city: 'Midtown', coordinates: { lat: 40.7589, lng: -73.9851 } }),
        category: 'workshop',
        tags: ['education', 'sustainability', 'workshop'],
        organizer_id: '00000000-0000-0000-0000-000000000001',
        attendees: [],
        max_attendees: 50,
        is_virtual: false,
        virtual_link: null
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        title: 'Green Technology Masterclass',
        description: 'Expert-led session on renewable energy and green technology innovations.',
        start_date: '2026-03-25T10:00:00Z',
        end_date: '2026-03-25T15:00:00Z',
        location: JSON.stringify({ address: 'Tech Hub', city: 'Innovation District', coordinates: { lat: 40.7489, lng: -73.9680 } }),
        category: 'masterclass',
        tags: ['technology', 'renewable energy', 'innovation'],
        organizer_id: '00000000-0000-0000-0000-000000000001',
        attendees: [],
        max_attendees: 80,
        is_virtual: true,
        virtual_link: 'https://meet.example.com/green-tech'
      }
    ];

    // Seed Projects
    const projects = [
      {
        id: '650e8400-e29b-41d4-a716-446655440001',
        title: 'Urban Garden Initiative',
        description: 'Transform unused urban spaces into thriving community gardens for fresh, local produce.',
        status: 'ACTIVE',
        category: 'agriculture',
        tags: ['gardening', 'food security', 'community'],
        author_id: '00000000-0000-0000-0000-000000000001',
        participants: [],
        location: JSON.stringify({ address: 'Downtown District', city: 'City Center' }),
        start_date: '2024-01-15T10:00:00Z',
        end_date: '2026-12-31T23:59:59Z'
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440002',
        title: 'Smart Recycling Program',
        description: 'Implementing AI-powered recycling bins to improve waste sorting and recycling rates.',
        status: 'ACTIVE',
        category: 'technology',
        tags: ['recycling', 'AI', 'waste management'],
        author_id: '00000000-0000-0000-0000-000000000001',
        participants: [],
        location: JSON.stringify({ address: 'City Center', city: 'Metropolitan Area' }),
        start_date: '2024-02-01T14:30:00Z',
        end_date: '2026-06-30T23:59:59Z'
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440003',
        title: 'Youth Environmental Education',
        description: 'Educational program teaching sustainability and environmental stewardship to young people.',
        status: 'ACTIVE',
        category: 'education',
        tags: ['education', 'youth', 'environment'],
        author_id: '00000000-0000-0000-0000-000000000001',
        participants: [],
        location: JSON.stringify({ address: 'Educational District', city: 'School Zone' }),
        start_date: '2024-01-20T09:15:00Z',
        end_date: '2026-12-31T23:59:59Z'
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440004',
        title: 'Green Transportation Network',
        description: 'Building bike lanes and promoting eco-friendly transportation alternatives.',
        status: 'ACTIVE',
        category: 'transportation',
        tags: ['cycling', 'public transit', 'sustainability'],
        author_id: '00000000-0000-0000-0000-000000000001',
        participants: [],
        location: JSON.stringify({ address: 'Transportation Hub', city: 'City Wide' }),
        start_date: '2024-02-10T16:45:00Z',
        end_date: '2027-12-31T23:59:59Z'
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440005',
        title: 'Digital Inclusion Initiative',
        description: 'Providing free WiFi access in public spaces to bridge the digital divide.',
        status: 'ACTIVE',
        category: 'technology',
        tags: ['digital access', 'connectivity', 'inclusion'],
        author_id: '00000000-0000-0000-0000-000000000001',
        participants: [],
        location: JSON.stringify({ address: 'Public Parks', city: 'Various Locations' }),
        start_date: '2024-01-25T11:20:00Z',
        end_date: '2026-12-31T23:59:59Z'
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440006',
        title: 'Local Food Market Hub',
        description: 'Supporting local farmers and artisans through a community marketplace.',
        status: 'ACTIVE',
        category: 'agriculture',
        tags: ['local economy', 'farmers market', 'community'],
        author_id: '00000000-0000-0000-0000-000000000001',
        participants: [],
        location: JSON.stringify({ address: 'Market Square', city: 'Downtown' }),
        start_date: '2024-02-05T13:10:00Z',
        end_date: '2026-12-31T23:59:59Z'
      }
    ];

    // Insert events
    console.log('📅 Inserting events...');
    for (const event of events) {
      await pool.query(
        `INSERT INTO events (id, title, description, start_date, end_date, location, category, tags, organizer_id, attendees, max_attendees, is_virtual, virtual_link)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT id FROM users LIMIT 1), $9, $10, $11, $12)
         ON CONFLICT (id) DO NOTHING`,
        [
          event.id,
          event.title,
          event.description,
          event.start_date,
          event.end_date,
          event.location,
          event.category,
          event.tags,
          event.attendees,
          event.max_attendees,
          event.is_virtual,
          event.virtual_link
        ]
      );
    }
    console.log(`✅ Inserted ${events.length} events`);

    // Insert projects
    console.log('📊 Inserting projects...');
    for (const project of projects) {
      await pool.query(
        `INSERT INTO projects (id, title, description, status, category, tags, author_id, participants, location, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6, (SELECT id FROM users LIMIT 1), $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING`,
        [
          project.id,
          project.title,
          project.description,
          project.status,
          project.category,
          project.tags,
          project.participants,
          project.location,
          project.start_date,
          project.end_date
        ]
      );
    }
    console.log(`✅ Inserted ${projects.length} projects`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
