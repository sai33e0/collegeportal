# Quick Animation Reference Guide

## 🎯 Animation Classes You Can Use Immediately

### Entrance Animations
```html
<!-- Fade in from bottom -->
<div class="fade-in">Content</div>

<!-- Slide up animation -->
<div class="animate-fade-in">Content</div>

<!-- Scale in animation -->
<div class="scaleIn">Content</div>

<!-- Bounce animation -->
<div class="bounce">Content</div>
```

### Effect Animations
```html
<!-- Pulsing effect (great for pending states) -->
<div class="pulse">Loading...</div>

<!-- Glowing shadow effect -->
<div class="glow">Important</div>

<!-- Smooth transition -->
<div class="transition-smooth">Hover me</div>

<!-- Bouncy transition -->
<div class="transition-bounce">Click me</div>
```

### Button Animations
```html
<!-- Primary button with glow effect -->
<button class="btn-primary">Click Me</button>

<!-- Secondary button with ripple -->
<button class="btn-secondary">Secondary</button>

<!-- Danger button with enhanced shadow -->
<button class="btn-danger">Delete</button>

<!-- Ghost button with smooth transition -->
<button class="btn-ghost">Subtle</button>
```

### Card Animations
```html
<!-- Dashboard card slides in on load -->
<div class="dashboard-card">Content</div>

<!-- Portal card with lift on hover -->
<div class="portal-card">Content</div>

<!-- Quick link with shimmer -->
<div class="quick-link-item">Link</div>

<!-- Glass-morphism card -->
<div class="glass-card">Content</div>
```

---

## 🎨 Component-Specific Animations

### Form Inputs
- Inputs get a **smooth glow** on focus
- Smooth **lift effect** when focused
- **Blue glow box-shadow** around the input

### Cards
- **Slide-up** animation on page load
- **Lift and scale** on hover
- **Glow shadow** increases on hover
- Icon inside quick-links **rotates 10°** on hover

### Buttons
- **Ripple effect** expands on hover
- **Lift effect** (translate Y -3px to -4px)
- **Glow pulse** animation for primary buttons
- **Color transitions** are smooth (0.4s cubic-bezier)

### Lists
- Items **stagger in** with delays
- Each row animates with 0.1s-0.5s delay
- Creates cascading effect

### Navigation
- Links have **smooth background slide**
- **Color transitions** on hover
- Active state has **glow shadow**

---

## 🚀 Advanced Animation Combinations

### Hero Section
```css
/* Automatically animated */
.hero-title       /* Slides up with shimmer on hover */
.hero-subtitle    /* Slides up with slight delay */
.hero-actions     /* Slides up with more delay */
```

### Card Grid
```css
/* Items animate with stagger */
.rank-card        /* Scales in, glows on hover */
.focus-card       /* Scales up, glows on hover */
.explore-card     /* Lifts on hover */
.dept-card        /* Rotates in, scales on hover */
```

### Form Feedback
```css
.success          /* Slides up with green border */
.error            /* Slides up with red border */
.warning          /* Slides up with orange border */
```

---

## 🎬 Animation Timing

| Effect | Duration | Easing |
|--------|----------|--------|
| Hover lift | 400ms | cubic-bezier(0.175, 0.885, 0.32, 1.275) |
| Focus glow | 300ms | cubic-bezier(0.175, 0.885, 0.32, 1.275) |
| Card enter | 600ms | ease-out |
| Button hover | 1500ms (infinite) | ease-in-out |
| Stagger delay | 100ms per item | - |
| Fade in | 600ms | ease-out |
| Slide in | 400-800ms | ease-out |

---

## 💡 Pro Tips

1. **Mobile-Friendly**: Remove stagger delays on mobile with:
   ```html
   <div class="animation-delay-mobile-none">
     <!-- Items won't stagger -->
   </div>
   ```

2. **Accessibility**: All animations use `animation-duration` < 500ms (except infinite ones) to avoid motion sickness

3. **Performance**: Animations use GPU-accelerated properties:
   - `transform` (not width/height)
   - `opacity` (not color)

4. **Combine Effects**: Mix animations for creative effects:
   ```html
   <button class="btn-primary transition-bounce">
     Click me
   </button>
   ```

---

## 🎯 Best Practices

✅ **DO:**
- Use `.transition-smooth` for general interactive elements
- Apply `.bounce` to success messages
- Use `.glow` for important notifications
- Keep animations under 600ms for responsiveness
- Test animations on lower-end devices

❌ **DON'T:**
- Animate too many elements at once (causes lag)
- Use animations longer than 1s (becomes annoying)
- Animate without purpose (affects UX negatively)
- Forget to test on mobile devices
- Ignore prefers-reduced-motion preferences

---

## 🔧 Common Use Cases

### Loading State
```html
<div class="spinner">
  <i class="fas fa-spinner"></i>
</div>
```

### Success Message
```html
<div class="success">
  Operation completed successfully!
</div>
```

### Form Input
```html
<input class="form-input" type="text" placeholder="Enter name">
<!-- Automatically animates on focus -->
```

### List of Items
```html
<ul class="quick-links-grid">
  <li class="quick-link-item">Item 1</li>
  <li class="quick-link-item">Item 2</li>
  <li class="quick-link-item">Item 3</li>
  <!-- Each item staggers in -->
</ul>
```

### Button with Ripple
```html
<button class="btn-primary">
  Submit
</button>
<!-- Ripple effect on hover -->
```

---

## 📊 Animation Coverage

| Element | Animation | Status |
|---------|-----------|--------|
| Buttons | Hover glow + ripple | ✅ |
| Cards | Lift + scale | ✅ |
| Forms | Focus glow | ✅ |
| Lists | Stagger | ✅ |
| Navigation | Smooth transition | ✅ |
| Icons | Rotate + scale | ✅ |
| Notifications | Slide + fade | ✅ |
| Modals | Scale + slide | ✅ |

---

**Remember:** These animations are subtle and professional. They enhance UX without being distracting!

Enjoy your animated portal! 🚀✨
