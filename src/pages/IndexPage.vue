<template>
  <q-page class="bg-black text-white">
    <!-- Hero Section -->
    <div class="hero-section row items-center relative-position overflow-hidden q-px-md-xl">
      <!-- 3D Particle Animation Covering Whole Hero -->
      <div class="absolute-full" style="z-index: 1; opacity: 0.5; pointer-events: none;">
          <ThreeBackground />
      </div>

      <!-- Background Ambient Glow -->
      <div class="absolute-center bg-primary" style="width: 1000px; height: 1000px; filter: blur(350px); opacity: 0.15; border-radius: 50%;"></div>
      
      <div class="row full-width items-center relative-position" style="z-index: 2; max-width: 1600px; margin: 0 auto;">
        <!-- Left Content -->
        <div class="col-12 col-md-5 offset-md-1 flex column justify-center hero-left-col" style="min-height: 60vh; height: auto;">
          
          <div class="inline-block q-mb-lg">
            <q-badge color="grey-9" text-color="grey-4" class="q-px-md q-py-sm text-subtitle2 rounded-borders">
              100% Free & Open Source
            </q-badge>
          </div>
          
          <h1 class="text-h1 text-weight-bolder leading-tiny q-my-none q-mb-lg">
            Master Your <br/>
            Tuition <span class="text-grey-6">Business</span>
          </h1>
          
          <p class="text-h6 text-grey-5 q-mb-xl text-weight-regular hero-desc" style="line-height: 1.6;">
             Streamline students, payments, and schedules in one unified platform. Focus on teaching, we handle the rest.
          </p>
          
          <div class="row q-gutter-md btn-container">
             <q-btn
              unelevated
              color="white"
              text-color="black"
              label="Start Free Trial"
              padding="12px 32px"
              class="text-weight-bold letter-spacing-1 text-body1 full-width-sm"
              no-caps
              to="/register"
            />
             <q-btn
              outline
              color="white"
              label="View Demo"
              icon-right="arrow_forward"
              padding="12px 32px"
              class="text-weight-bold letter-spacing-1 text-body1 full-width-sm"
              no-caps
            />
          </div>
        </div>

        <!-- Right Visual (Image + 3D Animation Overlay) -->
        <div class="col-12 col-md-6 relative-position flex flex-center align-right hero-right-col">
          <div class="visual-container full-width full-height flex flex-center relative-position">
             <!-- Base Image -->
             <q-img 
              src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop"
              class="hero-image"
              fit="contain"
              style="max-height: 85%; width: 100%; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.6)); z-index: 1;"
            />

             <!-- 3D Particle Animation Overlay -->
            <div class="absolute-full" style="z-index: 2; opacity: 0.7;">
                <ThreeBackground />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-dark-surface q-py-xl border-y-dark">
      <div class="container text-center">
        <div class="row justify-center q-col-gutter-lg">
          <div class="col-12 col-sm-4 q-mb-lg q-mb-sm-none">
            <h2 class="text-h2 text-weight-bold q-my-none">500<span class="text-grey-5">+</span></h2>
            <div class="text-subtitle1 text-grey-5 q-mt-sm uppercase-tracking">Classrooms Managed</div>
          </div>
          <div class="col-12 col-sm-4 q-mb-lg q-mb-sm-none">
            <h2 class="text-h2 text-weight-bold q-my-none">10k<span class="text-grey-5">+</span></h2>
            <div class="text-subtitle1 text-grey-5 q-mt-sm uppercase-tracking">Active Students</div>
          </div>
          <div class="col-12 col-sm-4">
            <h2 class="text-h2 text-weight-bold q-my-none">99.9<span class="text-grey-5">%</span></h2>
            <div class="text-subtitle1 text-grey-5 q-mt-sm uppercase-tracking">Uptime / Reliability</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section class="section-padded container relative-position">
      <div class="text-center section-mb">
        <div class="text-caption text-white text-weight-bolder tracking-widest border-bottom-inline q-pb-xs q-mb-md inline-block">CORE CAPABILITIES</div>
        <h2 class="text-h3 text-weight-bolder q-mb-md text-white">Everything You Need</h2>
        <p class="text-body1 text-grey-5 q-px-md" style="max-width: 600px; margin: 0 auto; font-size: 1.1rem;">
          Powerful tools designed to automate your workflow, giving you the freedom to focus on what matters most: Teaching.
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6 col-md-4" v-for="(feature, index) in features" :key="index">
          <q-card flat class="feature-card h-100 column justify-center q-pa-lg">
            <div class="icon-box q-mb-lg flex flex-center">
                <q-icon :name="feature.icon" size="32px" color="black" />
            </div>
            <div class="text-h5 text-weight-bold q-mb-md">{{ feature.title }}</div>
            <div class="text-body1 text-grey-5" style="line-height: 1.6">{{ feature.desc }}</div>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Modern Image / Content Split -->
    <section class="section-padded bg-dark-surface border-y-dark">
      <div class="container">
        <div class="row items-center q-col-gutter-lg">
          <div class="col-12 col-md-6 order-last order-md-first">
             <div class="image-wrapper relative-position">
                <q-img 
                  src="https://cdn.quasar.dev/img/material.png" 
                  class="rounded-borders grayscale-img"
                  style="min-height: 300px; border: 1px solid #333;"
                />
                <!-- Decorative element -->
                <div class="absolute-bottom-right bg-white text-black q-pa-md q-pa-md-lg rounded-tl-xl" style="right:0; bottom:0">
                    <div class="text-h4 text-weight-bold">40%</div>
                    <div class="text-caption text-weight-bold">EFFICIENCY BOOST</div>
                </div>
             </div>
          </div>
          <div class="col-12 col-md-6 text-white analytics-text-col">
            <h2 class="text-h3 text-weight-bolder q-mb-md">Smart Analytics</h2>
            <p class="text-h6 text-grey-5 q-mb-lg text-weight-regular">
              Track student performance, payment history, and attendance trends with our comprehensive analytics dashboard.
            </p>
            
            <q-list class="q-gutter-y-md inline-block text-left">
              <q-item class="q-pa-none" v-for="i in 3" :key="i">
                <q-item-section avatar style="min-width: 40px;">
                  <q-icon color="white" name="check_circle" size="24px" />
                </q-item-section>
                <q-item-section class="text-body1 text-grey-4">Real-time attendance tracking and reporting</q-item-section>
              </q-item>
            </q-list>
            
            <div class="q-mt-xl analytics-btn-container">
                <q-btn flat color="white" label="Explore Analytics" icon-right="arrow_forward" class="q-px-none" no-caps />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call To Action -->
    <section class="bg-white text-black section-padded text-center relative-position overflow-hidden">
      <!-- Abstract BG pattern -->
      <div class="absolute-full" style="background: radial-gradient(circle at center, #eee 0%, #fff 70%); opacity: 0.5;"></div>
      
      <div class="container relative-position" style="z-index: 1">
        <h2 class="text-h2 text-weight-bolder q-mb-md letter-spacing-tight">Ready to Transform?</h2>
        <p class="text-h5 text-grey-8 q-mb-xl text-weight-normal q-px-md">Join elite tutors managing their institutes smarter.</p>
             <q-btn
              unelevated
              color="white"
              text-color="black"
              label="Start Free Trial"
              padding="12px 32px"
              class="text-weight-bold letter-spacing-1 text-body1 full-width-sm"
              no-caps
              to="/register"
            />
        <div class="q-mt-lg text-caption text-grey-6">No credit card required. Cancel anytime.</div>
      </div>
    </section>
    
<!-- Footer -->
    <footer class="bg-black text-white q-pt-xl q-pb-lg border-top-dark">
      <div class="container">
        <div class="row q-col-gutter-xl">
          <!-- Brand Column -->
          <div class="col-12 col-md-4 footer-brand-col">
            <div class="row items-center footer-brand-row q-mb-md">
              <q-icon name="school" size="28px" class="q-mr-sm" />
              <div class="text-h5 text-weight-bold">ClassMaster</div>
            </div>
            <p class="text-grey-6 text-body2 footer-desc" style="line-height: 1.6;">
              Empowering education entrepreneurs with the best tools to manage and grow their tuition classes efficiently.
            </p>
          </div>

          <!-- Product Links -->
          <div class="col-6 col-md-2">
            <div class="text-subtitle1 text-weight-bold q-mb-md text-grey-4">PRODUCT</div>
            <div class="column q-gutter-sm text-grey-6">
              <a href="#" class="footer-link">Features</a>
              <a href="#" class="footer-link">Pricing</a>
              <a href="#" class="footer-link">Mobile App</a>
              <a href="#" class="footer-link">Security</a>
            </div>
          </div>

          <!-- Company Links -->
          <div class="col-6 col-md-2">
            <div class="text-subtitle1 text-weight-bold q-mb-md text-grey-4">COMPANY</div>
            <div class="column q-gutter-sm text-grey-6">
              <a href="#" class="footer-link">About Us</a>
              <a href="#" class="footer-link">Careers</a>
              <a href="#" class="footer-link">Blog</a>
              <a href="#" class="footer-link">Contact</a>
            </div>
          </div>

          <!-- Subscribe -->
          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-md text-grey-4">SUBSCRIBE</div>
            <p class="text-grey-6 text-body2 q-mb-md">Get the latest news and updates.</p>
            <div class="row no-wrap items-center">
              <q-input
                dark
                standout="bg-grey-9 text-white"
                v-model="email"
                placeholder="Enter your email"
                dense
                class="col rounded-borders"
                bg-color="grey-10"
                input-class="text-white"
                borderless
              >
                <template v-slot:append>
                    <q-icon name="lock" size="xs" color="grey-7" />
                </template>
              </q-input>
              <q-btn flat round color="white" icon="arrow_forward" class="q-ml-sm" />
            </div>
          </div>
        </div>

        <div class="q-mt-xl q-pt-lg border-top-light text-center text-grey-8 text-caption">
          <div class="q-mb-xs">© 2024 ClassMaster Inc. All rights reserved.</div>
          <div>Powered by KDJ Lanka (Pvt) Ltd</div>
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ThreeBackground from '../components/ThreeBackground.vue'

const email = ref('')

const features = [
  {
    title: 'Student Management',
    desc: 'Effortlessly organize student profiles, contact details, and academic history in one secure place.',
    icon: 'groups'
  },
  {
    title: 'Smart Attendance',
    desc: 'Mark attendance quickly with QR codes or manual entry, and generate instant monthly reports.',
    icon: 'qr_code_scanner'
  },
  {
    title: 'Fee Automation',
    desc: 'Track payments, generate receipts, and send automated reminders to parents for overdue fees.',
    icon: 'receipt_long'
  },
  {
    title: 'Exam Results',
    desc: 'Store marks, calculate averages, and visualize student progress over time with graphs.',
    icon: 'analytics'
  },
  {
    title: 'Mobile Access',
    desc: 'Access your dashboard from anywhere, on any device. Completely responsive design.',
    icon: 'smartphone'
  },
  {
    title: 'Bank-Grade Security',
    desc: 'Encryption keeps your sensitive student and financial data safe and private.',
    icon: 'security'
  }
]
</script>

<style lang="scss" scoped>
// Typography Utilities
.text-h1 { 
    font-size: 2.5rem; 
    @media (min-width: 600px) { font-size: 4rem; }
}
.text-h2 { 
    font-size: 2rem; 
    @media (min-width: 600px) { font-size: 3rem; }
}
.text-h3 { 
    font-size: 1.75rem; 
    @media (min-width: 600px) { font-size: 2.5rem; }
}

// Responsive Helper Classes (Replaces invalid usage)
.hero-left-col {
    text-align: center;
    padding: 32px 16px 0 16px;
    
    .hero-desc {
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
    }
    
    .btn-container {
        justify-content: center;
    }

    @media (min-width: 1024px) {
        text-align: left;
        padding: 0;
        
        .hero-desc {
            max-width: 450px;
            margin-left: 0;
            margin-right: 0;
        }

        .btn-container {
            justify-content: flex-start;
        }
    }
}

.hero-right-col {
    height: 50vh;
    margin-top: 40px;
    
    @media (min-width: 600px) {
        height: 60vh;
    }
    @media (min-width: 1024px) {
        height: 90vh;
        margin-top: 0;
    }
}

.section-padded {
    padding-top: 60px;
    padding-bottom: 60px;
    
    @media (min-width: 1024px) {
        padding-top: 120px;
        padding-bottom: 120px;
    }
}

.section-mb {
    margin-bottom: 40px;
    @media (min-width: 1024px) {
        margin-bottom: 80px;
    }
}

// Fix for "Smart Analytics" Section
.analytics-text-col {
    // Reset any existing conflicting padding
    padding: 0 16px; 
    margin-top: 32px;
    text-align: center;
    
    @media (min-width: 1024px) {
        padding-left: 48px; // Restore gutter/spacing manually for desktop
        margin-top: 0;
        text-align: left;
        padding-right: 0;
    }
}

.analytics-btn-container {
    display: flex;
    justify-content: center;
    @media (min-width: 1024px) {
        justify-content: flex-start;
    }
}

// Footer Helpers
.footer-brand-col {
    text-align: center;
    @media (min-width: 1024px) {
        text-align: left;
    }
}
.footer-brand-row {
    justify-content: center;
    @media (min-width: 1024px) {
        justify-content: flex-start;
    }
}
.footer-desc {
    margin: 0 auto;
    max-width: 300px;
    @media (min-width: 1024px) {
        margin: 0;
    }
}

// Custom Utilities
@media (max-width: 599px) {
    .full-width-sm { width: 100%; }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px; 
  @media (min-width: 600px) { padding: 0 32px; }
}

.hero-section { // Default mobile
    min-height: auto;
    padding-bottom: 60px;
    
    @media (min-width: 1024px) {
        min-height: 100vh;
        padding-bottom: 0;
    }
}

.leading-tight { line-height: 1.1; letter-spacing: -0.02em; }
.leading-tiny { line-height: 1.0; letter-spacing: -0.03em; }
.letter-spacing-1 { letter-spacing: 1px; }

// Backgrounds & Borders
.bg-dark-surface { background-color: #0A0A0A; }
.border-y-dark { border-top: 1px solid #222; border-bottom: 1px solid #222; }
.border-top-light { border-top: 1px solid rgba(255,255,255,0.05); }
.border-top-dark { border-top: 1px solid #222; }

// Cards
.feature-card {
  background: transparent;
  border: 1px solid #222;
  border-radius: 20px;
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-8px);
    border-color: #fff;
    background: #0A0A0A;
    
    .icon-box {
        transform: scale(1.1);
        background: white; // keep white
    }
  }
}

.icon-box {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background: #fff;
    transition: transform 0.4s ease;
}

// Images & Visuals
.visual-container {
  height: 600px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}
// Override height for Hero context if needed, but hero-right-col handles it
.hero-image { width: 100%; height: 100%; object-fit: cover; }
.bg-gradient-overlay {
    background: linear-gradient(90deg, #000 0%, transparent 20%, transparent 80%, #000 100%);
}
.grayscale-img { filter: grayscale(100%); transition: all 0.5s ease; &:hover { filter: grayscale(0%); } }

// Misc
.opacity-60 { opacity: 0.6; }
.tracking-widest { letter-spacing: 0.2em; }
.uppercase-tracking { text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }
.hover-white:hover { color: white !important; }

.footer-link {
  text-decoration: none;
  color: inherit;
  transition: color 0.3s;
  
  &:hover {
    color: white;
  }
}
</style>
