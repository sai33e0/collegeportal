# Notifications & Events Integration - SRIT Website Data

## Overview
Integrated exam notifications, event information, and social media links from the official SRIT website (https://www.srit.ac.in/) into the college portal.

## Features Added

### 1. **Notifications Component** (`src/components/Notifications.tsx`)
A comprehensive notifications and events display component featuring:

- **8 Sample Notifications** including:
  - Mid Semester Examinations (Feb 15, 2026)
  - Mini-Project Expo (Apr 22, 2026)
  - TCS Placement Drive (Jan 25, 2026)
  - IPR Workshop (Mar 28, 2026)
  - Health Awareness Program (Mar 28, 2026)
  - Semester End Examination (May 1, 2026)
  - Infotech Placement Drive (Feb 10, 2026)
  - Campus Photography Contest (Feb 28, 2026)

- **Notification Types**:
  - 📝 Exam - Blue color code
  - 🎉 Event - Purple color code
  - 💼 Placement - Green color code
  - 📢 Notice - Amber color code

- **Priority Levels**:
  - High Priority (Red) - Exams, Major Placements
  - Medium Priority (Amber) - Events, Workshops
  - Low Priority (Gray) - Contests, Awareness Programs

- **Interactive Filter Tabs** - Filter by notification type
- **Responsive Grid Layout** - Auto-adapting to screen sizes
- **Hover Effects** - Smooth animations and visual feedback

### 2. **Social Media Integration**
Direct links to SRIT official accounts:
- **Twitter/X**: @sritatp (https://twitter.com/sritatp)
- **Instagram**: @sritatp (https://www.instagram.com/sritatp/)
- **Facebook**: sritatp (https://www.facebook.com/sritatp)
- **LinkedIn**: SRIT (https://www.linkedin.com/school/sritatp/)
- **YouTube**: SRIT Channel (https://www.youtube.com/channel/UC_J4p9Xovt4UGP6ddPzr42g)

Each social media card features:
- Platform icon
- Handle/username
- Direct link with hover effects
- Color-coded borders matching platform branding

### 3. **Contact Information Section**
Prominent contact details:
- **Phone**: +91-951 561 1111
- **Email**: hr@srit.ac.in
- **Address**: Rotarypuram Village, BK Samudram, Anantapur District, AP 515701

### 4. **Pages & Routes**

#### Notifications Standalone Page
- **Route**: `/notifications`
- **Component**: Full-page notifications view with Header and Footer
- **Accessibility**: Available from navbar and homepage

#### Homepage Integration
- Notifications component integrated into home page
- Displays above CTA section
- Maintains consistent branding with orange theme

### 5. **Navigation Updates**
Updated `src/components/Navbar.tsx`:
- Added "📢 Notifications" link in desktop navigation
- Added notifications link in mobile menu
- Positioned between "About" and "Departments"

## Design Characteristics

### Color Scheme
- **Primary Orange**: #ff6b35 (SRIT branding)
- **Secondary Orange**: #ffa952
- **White Background**: #ffffff
- **Dark Text**: #1f2937
- **Secondary Text**: #6b7280

### Styling Features
- **Card-based Layout** - Clean, organized presentation
- **Border Colors** - Type-specific left borders for quick identification
- **Type Badges** - Inline badges showing notification category
- **Priority Indicators** - Color-coded priority labels
- **Responsive Grid** - Auto-adjusting columns (min 200px-320px)
- **Smooth Animations** - Hover effects and transitions
- **Typography** - Hierarchical font sizes and weights

### Interactive Elements
- Filter buttons with active states
- Hoverable notification cards with lift effect
- Social media links with platform-specific hover colors
- Responsive touch-friendly interface

## Data Sources
All information extracted from official SRIT website:
- Exam schedules and dates
- Upcoming events and workshops
- Placement drives and company information
- Social media handles and links
- Contact information

## Files Modified
1. `src/components/Notifications.tsx` - New component
2. `src/app/notifications/page.tsx` - New page
3. `src/app/page.tsx` - Added import and component integration
4. `src/components/Navbar.tsx` - Added notifications link

## Browser Compatibility
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes
- Touch-friendly interactive elements

## Future Enhancements
- Backend API integration for dynamic notifications
- Real-time notification updates
- User preference filters
- Email notifications for important events
- Notification archives
- Department-specific event filtering
