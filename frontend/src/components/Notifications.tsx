import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  title: string;
  type: 'exam' | 'event' | 'placement' | 'notice';
  date: string;
  description: string;
  details?: string;
  priority: 'high' | 'medium' | 'low';
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  details: string;
  date: string;
  category: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeTab, setActiveTab] = useState<'notifications' | 'news'>('notifications');

  useEffect(() => {
    // Sample notifications from SRIT website
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Mid Semester Examinations',
        type: 'exam',
        date: '2026-02-15',
        description: 'Mid-semester exams for all departments scheduled from February 15 to March 5, 2026.',
        details: 'Mid Semester Examinations Schedule:\n\n✓ CSE Department: Feb 15 - Feb 22\n✓ ECE Department: Feb 15 - Feb 22\n✓ MECH Department: Feb 23 - Mar 2\n✓ CIVIL Department: Feb 23 - Mar 2\n\nVenue: Main Exam Hall\nTiming: 10:00 AM - 1:00 PM\nNegative Marking: -0.25 per wrong answer\n\nNote: Carry hall ticket and ID proof. Late entry will not be allowed after 10:15 AM.',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Mini-Project Expo',
        type: 'event',
        date: '2026-04-22',
        description: 'Mini-Project Expo at SRIT B Block Seminar Hall. All students are encouraged to showcase their projects.',
        details: 'Mini-Project Expo 2026:\n\n📍 Location: SRIT B Block Seminar Hall\n⏰ Time: 09:30 AM - 1:30 PM\n📅 Date: April 22, 2026\n\nParticipation Details:\n• All 3rd and 4th semester students can participate\n• Projects from all domains welcome\n• Judging by industry experts\n• Top 10 projects will receive awards\n• Prize money: ₹50,000 total\n\nRegistration deadline: April 15, 2026\nContact: academics@srit.ac.in',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'TCS Placement Drive',
        type: 'placement',
        date: '2026-01-25',
        description: 'TCS is conducting a mega recruitment drive. Eligible students can register on the placement portal.',
        details: 'TCS Mega Recruitment Drive:\n\n💼 Company: Tata Consultancy Services\n📊 Job Roles:\n  • System Engineer (Entry Level)\n  • Associate System Engineer\n  • IT Analyst\n\n💰 Package Details:\n  • Ninja Offers: 3.45 LPA (130 positions)\n  • Digital Offers: 7.08 LPA (31 positions)\n  • Prime Offers: 9.08 LPA (3 positions)\n\n📋 Eligibility:\n  • CGPA: 6.5+\n  • Graduation Year: 2024, 2025, 2026\n  • No active backlog\n\n📅 Timeline:\n  • Registration: Jan 20 - Jan 24\n  • Written Test: Jan 25\n  • Technical Interview: Jan 26 - Jan 28\n  • HR Round: Jan 29\n\n✅ Register now on placement portal!',
        priority: 'high'
      },
      {
        id: '4',
        title: 'IPR Workshop',
        type: 'event',
        date: '2026-03-28',
        description: 'Workshop on Intellectual Property Rights and IP Management for Startups at A-35, A-Block.',
        details: 'Intellectual Property Rights Workshop:\n\n🎓 Trainer: Mr. Annavaram Kiran Kumar\n           AICTE MIC Innovation Ambassador\n           Assistant Professor, CSE (AI & ML)\n\n📚 Topics Covered:\n  • Patent Filing Process\n  • Copyright Laws & Registration\n  • Trademark Protection\n  • Trade Secret Management\n  • IP Strategy for Startups\n\n📍 Venue: A-35, A-Block\n⏰ Time: 9:30 AM - 4:30 PM\n📅 Date: March 28, 2026\n\n👥 Target Audience: All students interested in entrepreneurship\n💻 Hands-on Sessions: Yes\n🎁 Certificates: Provided to all participants\n\nFree Entry | Lunch & Refreshments Provided',
        priority: 'medium'
      },
      {
        id: '5',
        title: 'Health Awareness Program',
        type: 'event',
        date: '2026-03-28',
        description: 'Health awareness program on preventive health practices at SRIT B Block Seminar Hall.',
        details: 'Health Awareness Program 2026:\n\n🏥 Organized by: Women Empowerment Cell\n\n📋 Topics:\n  • Menstrual Hygiene\n  • Adolescent Health\n  • Safe Sexual Practices\n  • Lifestyle Modifications\n  • PCOD Prevention & Screening\n  • Cervical Cancer Prevention\n  • Breast Cancer Screening\n\n👨‍⚕️ Expert Speakers: Medical professionals from Apollo Hospital\n\n📍 Venue: SRIT B Block Seminar Hall\n⏰ Time: 2:00 PM - 4:30 PM\n📅 Date: March 28, 2026\n\n👥 Participation: Open to all students\n📝 Q&A Session: Yes\n\nFree of cost | All are welcome',
        priority: 'low'
      },
      {
        id: '6',
        title: 'Semester End Examination Schedule',
        type: 'exam',
        date: '2026-05-01',
        description: 'Semester end examinations will be conducted from May 1 to May 31, 2026. Date sheet will be published soon.',
        details: 'Semester End Examination Schedule:\n\n📅 Examination Period: May 1 - May 31, 2026\n\nExamination Pattern:\n  • Theory Papers: 3 Hours each\n  • Practical Exams: 4 Hours each\n  • Lab Evaluation: As per department guidelines\n\n📍 Exam Centers:\n  • Main Exam Hall\n  • Class Rooms (Lab Exams)\n  • Online Portal (Online Courses)\n\n⏰ Daily Schedule:\n  • Forenoon: 10:00 AM - 1:00 PM\n  • Afternoon: 2:00 PM - 5:00 PM\n\n📋 Important Instructions:\n  1. Arrive 15 minutes before exam time\n  2. Carry hall ticket and valid ID\n  3. Electronic devices are strictly prohibited\n  4. Negative marking: -0.25 per wrong answer\n  5. Passing: 40% marks required\n\n📍 Date sheet will be released on April 25, 2026',
        priority: 'high'
      },
      {
        id: '7',
        title: 'Infotech Placement Drive',
        type: 'placement',
        date: '2026-02-10',
        description: 'Infotech Solutions is recruiting for Software Engineer positions. Minimum CGPA: 6.5',
        details: 'Infotech Solutions - Placement Drive:\n\n💼 Company: Infotech Solutions Pvt Ltd\n   (Global IT Services & Solutions Provider)\n\n📊 Job Position: Software Engineer\n\n💰 Compensation Package:\n  • Base Salary: ₹4.5 LPA\n  • Performance Bonus: Up to ₹1 LPA\n  • Total: ₹5.5 LPA\n\n🎯 Selection Process:\n  1. Online Test (Aptitude + Coding): 90 minutes\n  2. Technical Interview: 45 minutes\n  3. HR Round: 30 minutes\n\n📋 Eligibility:\n  • CGPA: 6.5+\n  • Branches: CSE, ECE, MECH\n  • No active backlog\n  • No more than 2 backlogs in the past\n\n📅 Important Dates:\n  • Registration: Jan 25 - Feb 8\n  • Written Test: Feb 10\n  • Technical Interviews: Feb 11 - 13\n  • Results: Feb 14\n\n✅ Register on placement portal now!',
        priority: 'high'
      },
      {
        id: '8',
        title: 'Campus Photography Contest',
        type: 'event',
        date: '2026-02-28',
        description: 'SRIT Shutterbugs organization invites entries for campus photography contest. Prizes worth ₹15,000.',
        details: 'Campus Photography Contest 2026:\n\n📷 Organized by: SRIT Shutterbugs Club\n\n🏆 Prizes:\n  • 1st Prize: ₹8,000 + Certificate\n  • 2nd Prize: ₹5,000 + Certificate\n  • 3rd Prize: ₹2,000 + Certificate\n  • Special Category: ₹1,000 each\n\n📋 Categories:\n  1. Campus Life & Moments\n  2. Nature & Wildlife\n  3. Candid Moments\n  4. Monsoon Magic\n  5. Black & White Photography\n\n📸 Submission Details:\n  • Format: JPG/PNG (max 10MB)\n  • Resolution: Minimum 1920x1080\n  • Limit: 5 photos per category per participant\n  • Deadline: Feb 28, 2026\n\n🎯 Guidelines:\n  • Original work only\n  • No filters or heavy editing allowed\n  • Must be taken on SRIT campus\n  • Watermarking allowed\n\n📧 Submit at: photography@sritstudentclub.com\n\nWinners will be announced on March 10, 2026!',
        priority: 'low'
      }
    ];

    const sampleNews: NewsItem[] = [
      {
        id: 'n1',
        title: 'SURGETHON 2K24 - Innovation Marathon Success',
        category: 'achievement',
        date: '2026-01-20',
        description: 'SRIT EEE Department successfully organized SURGETHON 2K24, an innovation marathon where students showcased breakthrough solutions.',
        details: 'SURGETHON 2K24 - A Thriving Innovation Marathon:\n\n🎯 Event Overview:\nThe Department of Electrical and Electronics Engineering recently organized SURGETHON 2K24, a high-energy innovation marathon that united visionary minds from diverse backgrounds across campus.\n\nTheme: "Surge Ahead with Breakthrough Solutions"\n\n📊 Event Details:\n• Duration: 48 hours continuous innovation session\n• Participants: 150+ students from all departments\n• Teams: 30+ innovation teams\n• Mentors: 15 industry experts and faculty\n\n🏆 Results:\n• Overall Winner: AI-Powered Health Monitoring System\n• Runner-up: Smart Grid Management Solution\n• Best Execution: IoT-based Campus Management\n\n📈 Impact:\n• 5 teams selected for incubation\n• 3 teams received industry funding offers\n• Best project featured in IEEE newsletter\n\n💡 Innovation Categories:\n1. Healthcare Technology\n2. Smart City Solutions\n3. Environmental Sustainability\n4. Industrial Automation\n5. Consumer Electronics\n\n📸 Event Highlights:\n• Day 1: Ideation & Team Formation\n• Day 2: Development & Prototyping\n• Day 3: Testing & Refinement\n• Day 4: Final Presentations\n\nNext Edition: SURGETHON 2K25 planned for June 2026'
      },
      {
        id: 'n2',
        title: 'SRIT Students Awarded at JIGNASA 2K24',
        category: 'achievement',
        date: '2026-01-18',
        description: 'M. Chakradhar and C. Kushanth, IV EEE students, secured third prize at the National Level Technical Fest JIGNASA 2K24.',
        details: 'National Level Achievement - JIGNASA 2K24:\n\n🏆 Achievement:\nM. Chakradhar and C. Kushanth (IV Year EEE)\nSecured 3rd Prize in Paper Presentation\n\n📍 Event Details:\nJIGNASA 2K24 - National Level Technical Student Fest\nHosted by: G. Pulla Reddy Engineering College (Autonomous), Kurnool\nDate: October 25, 2024\nParticipation: 200+ teams from 50+ colleges\n\n📄 Research Paper:\nTitle: "Comprehensive Preventive System for Automobile Accident Mitigation: Enhancing Safety with Automated Response Mechanisms"\n\n🔬 Key Features of Research:\n• Automated collision detection system\n• Real-time alert mechanisms\n• Emergency response coordination\n• Driver behavior analysis\n• Vehicle diagnostics integration\n\n💡 Innovation Highlights:\n• Novel sensor fusion approach\n• AI-based predictive analytics\n• Cost-effective implementation\n• Real-world applicability\n\n🎓 Under Guidance of:\nDr. S. Rajasekhar, Professor, EEE Department\n\n📊 Significance:\nThis research contributes to vehicle safety standards and aligns with global efforts to reduce traffic-related fatalities through advanced technologies.\n\n🎉 Congratulations to the team for bringing laurels to SRIT!'
      },
      {
        id: 'n3',
        title: 'Dr. Dada Sikandar Kanekal Awarded Ph.D.',
        category: 'faculty',
        date: '2026-01-15',
        description: 'Dr. Dada Sikandar Kanekal, Faculty from ECE Department, awarded Ph.D. on October 18, 2024.',
        details: 'Faculty Achievement - Ph.D. Awarded:\n\n📚 Doctorate Degree Awarded:\nDr. Dada Sikandar Kanekal\nECE Department, SRIT\nAwarded Date: October 18, 2024\n\n🏫 University:\nSchool of Electronics Engineering\nVIT University, Vellore\n\n🔬 Doctoral Research:\nResearch Title: "Enhancing the Performance of MEMS Piezoresistive Pressure Sensors for Multi-environment Applications"\n\nResearch Focus:\n• MEMS sensor technology\n• Piezoresistive pressure sensing\n• Multi-environment compatibility\n• Performance optimization\n\n🎯 Applications:\n• Industrial Automation\n• Aerospace Engineering\n• Healthcare Technology\n• Environmental Monitoring\n• Smart City Development\n\n📊 Research Contribution:\n• 8 international journal publications\n• 5 conference presentations\n• 2 patent filings\n• Industry collaboration with 3 companies\n\n👨‍🏫 Current Role:\nAssistant Professor, ECE Department, SRIT\nSpecialization: Sensors and IoT\n\n🌟 Significance:\nDr. Kanekal\'s research significantly advances sensor technology with broad impact across multiple industries and contributes to the growing research ecosystem at SRIT.\n\n🎉 SRIT congratulates Dr. Kanekal on this remarkable achievement!'
      },
      {
        id: 'n4',
        title: 'CSR Initiative - Education Support to Rural School',
        category: 'csr',
        date: '2026-01-12',
        description: 'SRIT donated educational infrastructure worth ₹80,000 to Ambedkar Girls Gurukula School, Korrapadu.',
        details: 'Corporate Social Responsibility Initiative:\n\n🤝 CSR Project: Education for Rural Communities\n\nBeneficiary School:\nAmbedkar Girls Gurukula School\nLocation: Korrapadu, Anantapur District\n\n💰 Donation Value: ₹80,000\n\n📦 Donated Items:\n1. Benches (20 units)\n   - Improved classroom seating\n   - Ergonomic design\n   - Better student comfort\n\n2. Audio-Visual Equipment\n   - Digital speakers (5 units)\n   - Enhanced audio-visual learning\n   - Modern teaching methodology support\n\n3. Water Management\n   - Storage water cans (10 units)\n   - Hydration and sanitation\n   - Health and wellness support\n\n4. Library Resources\n   - Books (500+ volumes)\n   - Various subject domains\n   - Age-appropriate reading material\n\n5. Storage Solutions\n   - Almirahs (8 units)\n   - Organized resource management\n   - Better classroom administration\n\n🎯 Impact:\n• Benefits 400+ girl students\n• Improved learning environment\n• Enhanced educational outcomes\n• Better health and sanitation\n• Community empowerment\n\n👥 SRIT Delegation:\nPrincipal Dr. K. Subrahmanyam\nCSR Committee Members\nFaculty Representatives\nStudent Volunteers\n\n📝 SRIT Values Demonstrated:\n✓ Social Responsibility\n✓ Community Support\n✓ Education Advocacy\n✓ Gender Equality\n✓ Sustainable Development\n\nThis initiative aligns with SRIT\'s mission of "Education is a Key Enabler for Progress" and extends the reach of quality education to underserved communities.'
      },
      {
        id: 'n5',
        title: 'Pentagon Space - 29 Students Selected',
        category: 'placement',
        date: '2026-01-10',
        description: '29 final-year students received offer letters from Pentagon Space after successful campus recruitment drive.',
        details: 'Successful Campus Recruitment Drive:\n\n💼 Company: Pentagon Space\n   (Talent-Opportunity Connector)\n\n🌟 Network:\n   • 3,214+ Hiring Partners\n   • Pan-India Operations\n   • Niche Technology Focus\n\n📊 Drive Results:\n   • Total Applicants: 85 students\n   • Selected: 29 students (34% success rate)\n   • Offer Letters: Distributed on Oct 28, 2024\n\n🎯 Training Programs Offered:\n1. Java Full Stack Development\n2. Python Full Stack Development\n3. Software Testing\n4. Machine Learning\n5. Artificial Intelligence\n\n💰 Package Details:\n   • Base Salary: ₹3.5 - 5.5 LPA\n   • Performance Bonus: ₹0.5 - 1 LPA\n   • Total: ₹4 - 6.5 LPA\n   • Specialization Bonus: Up to ₹1 LPA\n\n📚 Training Features:\n   • Hands-on industry projects\n   • Mentorship from industry experts\n   • Certification upon completion\n   • Job placement guarantee\n\n🚀 Career Path:\n   • 3 months intensive training\n   • 2 months internship\n   • Permanent placement\n   • Career progression support\n\n🎓 Selected Students Branches:\n   • CSE: 12 students\n   • ECE: 8 students\n   • MECH: 5 students\n   • EEE: 4 students\n\n👨‍💼 Ms. Kajol & Team:\nPentagon Space Coordinator\nLed the entire recruitment and training process\n\n🎉 This is a significant milestone for SRIT\'s placement record in 2026!'
      }
    ];

    setNotifications(sampleNotifications);
    setNewsItems(sampleNews);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return '📝';
      case 'event':
        return '🎉';
      case 'placement':
        return '💼';
      case 'notice':
        return '📢';
      default:
        return '📌';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return '#3b82f6';
      case 'event':
        return '#8b5cf6';
      case 'placement':
        return '#10b981';
      case 'notice':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  return (
    <div style={{ padding: '24px', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
            📢 Notifications & News
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280' }}>
            Stay updated with latest exam schedules, events, placements, and news
          </p>
        </div>

        {/* Main Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '0',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              padding: '16px 24px',
              border: 'none',
              background: activeTab === 'notifications' ? '#ff6b35' : 'transparent',
              color: activeTab === 'notifications' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              borderBottom: activeTab === 'notifications' ? '3px solid #ff6b35' : 'none',
              marginBottom: '-2px',
              transition: 'all 0.3s ease'
            }}
          >
            📌 Notifications & Events
          </button>
          <button
            onClick={() => setActiveTab('news')}
            style={{
              padding: '16px 24px',
              border: 'none',
              background: activeTab === 'news' ? '#ff6b35' : 'transparent',
              color: activeTab === 'news' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              borderBottom: activeTab === 'news' ? '3px solid #ff6b35' : 'none',
              marginBottom: '-2px',
              transition: 'all 0.3s ease'
            }}
          >
            📰 News & Achievements
          </button>
        </div>

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <>
            {/* Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px',
              flexWrap: 'wrap'
            }}>
              {['all', 'exam', 'event', 'placement', 'notice'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: filter === tab ? '#ff6b35' : '#ffffff',
                    color: filter === tab ? '#ffffff' : '#1f2937',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    boxShadow: filter === tab ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'all' ? '📌 All' : `${getTypeIcon(tab)} ${tab}`}
                </button>
              ))}
            </div>

            {/* Notifications Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: `2px solid ${getTypeColor(notification.type)}20`,
                    borderLeft: `4px solid ${getTypeColor(notification.type)}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedNotification(notification)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Header with icon and priority */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{getTypeIcon(notification.type)}</span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: getPriorityColor(notification.priority) + '20',
                      color: getPriorityColor(notification.priority),
                      textTransform: 'uppercase'
                    }}>
                      {notification.priority} Priority
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {notification.title}
                  </h3>

                  {/* Type badge */}
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: getTypeColor(notification.type) + '20',
                      color: getTypeColor(notification.type),
                      textTransform: 'capitalize'
                    }}>
                      {notification.type}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    marginBottom: '12px',
                    lineHeight: '1.5'
                  }}>
                    {notification.description}
                  </p>

                  {/* Date and Button */}
                  <div style={{
                    paddingTop: '12px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#6b7280',
                      fontSize: '13px'
                    }}>
                      <span>📅</span>
                      {new Date(notification.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <button style={{
                      background: '#ff6b35',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Get Info
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div style={{
            display: 'grid',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {newsItems.map(news => (
              <div
                key={news.id}
                onClick={() => setSelectedNews(news)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: '2px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ff6b35',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}>
                    {news.category}
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {news.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '12px',
                    lineHeight: '1.5'
                  }}>
                    {news.description}
                  </p>
                  <div style={{
                    fontSize: '13px',
                    color: '#9ca3af'
                  }}>
                    📅 {new Date(news.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <button style={{
                  background: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginLeft: '20px',
                  whiteSpace: 'nowrap'
                }}>
                  Read More
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Notification Details */}
        {selectedNotification && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedNotification(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>

              {/* Content */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>{getTypeIcon(selectedNotification.type)}</span>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0
                }}>
                  {selectedNotification.title}
                </h2>
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: getTypeColor(selectedNotification.type) + '20',
                  color: getTypeColor(selectedNotification.type),
                  textTransform: 'capitalize'
                }}>
                  {selectedNotification.type}
                </span>
                <span style={{
                  display: 'inline-block',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: getPriorityColor(selectedNotification.priority) + '20',
                  color: getPriorityColor(selectedNotification.priority),
                  textTransform: 'uppercase'
                }}>
                  {selectedNotification.priority} Priority
                </span>
              </div>

              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                📅 {new Date(selectedNotification.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div style={{
                fontSize: '15px',
                color: '#374151',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                marginBottom: '24px'
              }}>
                {selectedNotification.details || selectedNotification.description}
              </div>

              <button
                onClick={() => setSelectedNotification(null)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffa952 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal for News Details */}
        {selectedNews && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedNews(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>

              {/* Content */}
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#ff6b35',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                📰 {selectedNews.category}
              </div>

              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                {selectedNews.title}
              </h2>

              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                📅 {new Date(selectedNews.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div style={{
                fontSize: '15px',
                color: '#374151',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                marginBottom: '24px'
              }}>
                {selectedNews.details}
              </div>

              <button
                onClick={() => setSelectedNews(null)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffa952 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Social Media Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            📱 Follow SRIT on Social Media
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              {
                platform: 'Twitter',
                icon: '𝕏',
                handle: '@sritatp',
                url: 'https://twitter.com/sritatp',
                color: '#000000'
              },
              {
                platform: 'Instagram',
                icon: '📷',
                handle: '@sritatp',
                url: 'https://www.instagram.com/sritatp/',
                color: '#E4405F'
              },
              {
                platform: 'Facebook',
                icon: 'f',
                handle: 'sritatp',
                url: 'https://www.facebook.com/sritatp',
                color: '#1877F2'
              },
              {
                platform: 'LinkedIn',
                icon: 'in',
                handle: 'SRIT',
                url: 'https://www.linkedin.com/school/sritatp/',
                color: '#0A66C2'
              },
              {
                platform: 'YouTube',
                icon: '▶️',
                handle: 'SRIT Channel',
                url: 'https://www.youtube.com/channel/UC_J4p9Xovt4UGP6ddPzr42g',
                color: '#FF0000'
              }
            ].map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '16px',
                  borderRadius: '12px',
                  border: `2px solid ${social.color}20`,
                  background: social.color + '05',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = social.color;
                  e.currentTarget.style.background = social.color + '15';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = social.color + '20';
                  e.currentTarget.style.background = social.color + '05';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontSize: '24px',
                  marginBottom: '8px',
                  color: social.color
                }}>
                  {social.icon}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  {social.platform}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {social.handle}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div style={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #ffa952 100%)',
          borderRadius: '16px',
          padding: '32px',
          color: 'white'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            📍 Contact SRIT
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>📞 Phone</div>
              <a href="tel:+919515611111" style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                textDecoration: 'none'
              }}>
                +91-951 561 1111
              </a>
            </div>
            <div>
              <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>📧 Email</div>
              <a href="mailto:hr@srit.ac.in" style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                textDecoration: 'none'
              }}>
                hr@srit.ac.in
              </a>
            </div>
            <div>
              <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>🏫 Address</div>
              <div style={{ fontSize: '14px' }}>
                Rotarypuram Village, BK Samudram, Anantapur District, AP 515701
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
