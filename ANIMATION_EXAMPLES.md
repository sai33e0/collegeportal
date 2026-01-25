# Animation Implementation Examples

## 🎬 Component Examples with Animations

### Example 1: Animated Card Component
```tsx
// Component with automatic animations
export default function DashboardCard({ title, children }) {
  return (
    <div className="dashboard-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

/* CSS (already in globals.css): 
.dashboard-card {
  animation: fadeInScale 0.6s ease-out both;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dashboard-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 25px 60px rgba(255, 107, 53, 0.25);
}
*/
```

### Example 2: Animated Form with Focus Effects
```tsx
export default function LoginForm() {
  return (
    <form className="portal-card">
      <h1>Login</h1>
      <input 
        className="form-input" 
        type="email" 
        placeholder="Enter email"
      />
      {/* Automatically gets focus glow animation */}
      <input 
        className="form-input" 
        type="password" 
        placeholder="Enter password"
      />
      {/* Automatically gets focus glow animation */}
      <button className="btn-primary">Login</button>
      {/* Button has ripple effect and hover glow */}
    </form>
  );
}
```

### Example 3: Animated List with Stagger
```tsx
export default function StudentList({ students }) {
  return (
    <div className="quick-links-grid">
      {students.map((student, index) => (
        <li key={index} className="quick-link-item">
          <span className="quick-link-icon">👤</span>
          <span className="quick-link-text">{student.name}</span>
          {/* Each list item staggers in automatically */}
        </li>
      ))}
    </div>
  );
}

/* Each item animates with stagger delay:
   Item 1: 0s delay
   Item 2: 0.1s delay
   Item 3: 0.2s delay
   etc...
*/
```

### Example 4: Notification with Animation
```tsx
export default function SuccessNotification({ message }) {
  return (
    <div className="success">
      ✓ {message}
    </div>
  );
}

/* CSS already applied:
.success {
  animation: slideInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  border-left: 4px solid #10b981;
  padding-left: 12px;
}
*/
```

### Example 5: Button with Multiple Effects
```tsx
export default function ActionButton() {
  return (
    <>
      {/* Primary button with ripple + glow */}
      <button className="btn-primary">
        Submit
      </button>
      
      {/* Secondary button with expanding background */}
      <button className="btn-secondary">
        Cancel
      </button>
      
      {/* Danger button with enhanced shadow */}
      <button className="btn-danger">
        Delete
      </button>
      
      {/* Ghost button with subtle animation */}
      <button className="btn-ghost">
        More Options
      </button>
    </>
  );
}
```

### Example 6: Loading State with Spinner
```tsx
export default function LoadingSpinner() {
  return (
    <div className="spinner">
      ⟳
    </div>
  );
}

/* CSS already applied:
.spinner {
  animation: spin 1s linear infinite;
}
*/
```

---

## 🎨 Creating Custom Animations

### Custom Fade-In with Delay
```tsx
export default function CustomFadeComponent() {
  const styles = `
    .custom-fade {
      animation: fadeIn 0.8s ease-out 0.3s both;
    }
  `;
  
  return <div style={styles} className="custom-fade">Content</div>;
}
```

### Custom Hover Animation
```tsx
export default function CustomHoverCard() {
  const styles = `
    .hover-scale {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .hover-scale:hover {
      transform: scale(1.1) translateY(-10px);
      box-shadow: 0 20px 50px rgba(255, 107, 53, 0.3);
    }
  `;
  
  return <div className="hover-scale">Hover me!</div>;
}
```

### Custom Stagger Animation for Items
```tsx
export default function StaggerList({ items }) {
  return (
    <div className="stagger-list">
      {items.map((item, index) => (
        <div 
          key={index}
          style={{
            animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Animation Timing Presets

### Fast Animation (400ms)
```css
.fast-animation {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Normal Animation (600ms)
```css
.normal-animation {
  animation: fadeIn 0.6s ease-out both;
}
```

### Slow Animation (1000ms)
```css
.slow-animation {
  animation: slideInUp 1s ease-out both;
}
```

### Instant with Smooth Exit
```css
.instant-smooth {
  transition: all 0.3s ease-out;
}
```

---

## 💡 Advanced Pattern Examples

### Animated Card Grid
```tsx
export default function CardGrid({ cards }) {
  return (
    <div className="rank-grid">
      {cards.map((card, index) => (
        <div key={index} className="rank-card">
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
}

/* CSS already applied:
.rank-card {
  animation: fadeInScale 0.6s ease-out both;
}

.rank-card:hover {
  transform: translateY(-10px) scale(1.02);
  animation: glowPulse 2s ease-in-out infinite;
}
*/
```

### Animated Form Validation Feedback
```tsx
export default function FormWithFeedback({ value, error }) {
  return (
    <div>
      <input className="form-input" value={value} />
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      {/* Error slides up when it appears */}
    </div>
  );
}

/* CSS already applied:
.error {
  animation: slideInUp 0.4s cubic-bezier(...) both;
  border-left: 4px solid #ef4444;
  padding-left: 12px;
}
*/
```

### Animated Loading Indicator
```tsx
export default function AsyncDataComponent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data
    setTimeout(() => {
      setData({ name: "John" });
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="spinner pulse">
        Loading...
      </div>
    );
  }

  return <div className="fade-in">{data.name}</div>;
}

/* CSS already applied:
.spinner {
  animation: spin 1s linear infinite;
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

.fade-in {
  animation: fadeIn 0.6s ease-out both;
}
*/
```

---

## 🎬 Animation Timing Functions Explained

### cubic-bezier(0.175, 0.885, 0.32, 1.275) - Bouncy
- Most natural and engaging
- Slightly overshoots on end
- Perfect for interactive elements

### ease-out
- Starts fast, slows down
- Great for entrance animations
- Feels smooth and intentional

### ease-in-out
- Starts slow, speeds up, slows down
- Perfect for transitions between states
- Professional feel

### linear
- Constant speed throughout
- Good for rotating, scrolling animations
- Mechanical feel (use sparingly)

---

## 🔍 Debugging Animations

### Check if animation is working:
```tsx
// Inspect element and look for:
// 1. animation property in computed styles
// 2. keyframes defined in CSS
// 3. No animation-play-state: paused

// Disable animation temporarily:
export default function TestComponent() {
  return (
    <div style={{ animationPlayState: 'paused' }}>
      Testing without animation
    </div>
  );
}
```

### Performance Check:
```tsx
// Use Performance API to measure
useEffect(() => {
  const start = performance.now();
  // Component renders with animations
  const end = performance.now();
  console.log(`Animation took ${end - start}ms`);
}, []);
```

---

## ✨ Best Animation Practices

### DO ✅
- Keep animations under 600ms for responsiveness
- Use transform and opacity for performance
- Combine animations for complex effects
- Test on actual devices
- Provide animated feedback to user actions
- Use consistent timing across components

### DON'T ❌
- Animate width/height (causes reflow)
- Use animations without purpose
- Make animations longer than 1 second
- Forget to test on slow devices
- Ignore accessibility (reduced motion preference)
- Chain too many animations together

---

## 🎯 Quick Copy-Paste Examples

### Smooth Button
```tsx
<button className="btn-primary">Click Me</button>
```

### Animated Notification
```tsx
<div className="success">
  ✓ Saved successfully!
</div>
```

### Loading Spinner
```tsx
<div className="spinner">⟳</div>
```

### Staggered List
```tsx
<div className="quick-links-grid">
  <div className="quick-link-item">Item 1</div>
  <div className="quick-link-item">Item 2</div>
</div>
```

### Animated Card
```tsx
<div className="dashboard-card">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

---

**All animations are ready to use out of the box!** 🚀✨

Just apply the class names and your components will automatically have smooth, modern animations.
