<script setup lang="ts">
import { Building2, Phone, Mail, ShieldAlert, ExternalLink } from 'lucide-vue-next'
</script>

<template>
  <footer class="gigw-footer" role="contentinfo">
    <!-- Top Policy Bar -->
    <div class="gigw-footer-top">
      <div class="gigw-footer-container">
        <div class="gigw-policy-links">
          <a href="#" @click.prevent>Terms of Use</a>
          <span class="sep">|</span>
          <a href="#" @click.prevent>Privacy Policy</a>
          <span class="sep">|</span>
          <a href="#" @click.prevent>Hyperlinking Policy</a>
          <span class="sep">|</span>
          <a href="#" @click.prevent>Copyright Policy</a>
          <span class="sep">|</span>
          <a href="#" @click.prevent>Disclaimer</a>
          <span class="sep">|</span>
          <a href="#" @click.prevent>Accessibility Statement</a>
          <span class="sep">|</span>
          <a href="#" @click.prevent>Help / FAQ</a>
        </div>
      </div>
    </div>

    <!-- Main Footer Information Grid -->
    <div class="gigw-footer-main">
      <div class="gigw-footer-container gigw-footer-grid">
        <!-- Col 1: Council Address -->
        <div class="footer-col">
          <div class="footer-col-title">
            <Building2 :size="16" />
            <span>AICTE Headquarters</span>
          </div>
          <address class="footer-address">
            All India Council for Technical Education<br />
            Nelson Mandela Marg, Vasant Kunj,<br />
            New Delhi - 110070, India
          </address>
        </div>

        <!-- Col 2: Official Contact -->
        <div class="footer-col">
          <div class="footer-col-title">
            <Phone :size="16" />
            <span>Grievance Redressal Cell</span>
          </div>
          <p class="footer-contact-item">
            <strong>Toll Free Helpdesk:</strong> 1800-11-2234 / 011-29581000
          </p>
          <p class="footer-contact-item">
            <strong>Official Email:</strong> pgrc@aicte.gov.in
          </p>
          <p class="footer-contact-item">
            <strong>Working Hours:</strong> Mon to Fri (9:30 AM – 6:00 PM)
          </p>
        </div>

        <!-- Col 3: Portal Information -->
        <div class="footer-col">
          <div class="footer-col-title">
            <ShieldAlert :size="16" />
            <span>Statutory Mandate</span>
          </div>
          <p class="footer-mandate-text [text-wrap:pretty]">
            Established under the All India Council for Technical Education Act, 1987. Centralized cross-bureau coordination for student, faculty, and public grievances across technical institutes.
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom Attribution Strip -->
    <div class="gigw-footer-bottom">
      <div class="gigw-footer-container gigw-bottom-inner">
        <div class="attribution-text">
          <span>Portal Content Owned and Maintained by All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India.</span><br />
          <span>Technical Architecture: Smart India Hackathon 2026 Prototype (Problem Statement 26264).</span>
        </div>
        <div class="last-updated-text">
          <span>Last Updated: 27 October 2026</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.gigw-footer {
  width: 100%;
  background: #001f35;
  color: #e2e8f0;
  font-family: 'DM Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  margin-top: auto;
  border-top: 3px solid #ff9933;
}
.gigw-footer-container {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* Top Policy Bar */
.gigw-footer-top {
  background: #001524;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 0;
  font-size: 12px;
}
.gigw-policy-links {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px 12px;
}
.gigw-policy-links a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.15s ease;
}
.gigw-policy-links a:hover {
  color: #ffffff;
  text-decoration: underline;
}
.gigw-policy-links .sep {
  color: #475569;
}

/* Main Grid */
.gigw-footer-main {
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.gigw-footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.75rem;
}
.footer-col-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff9933;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}
.footer-address {
  font-style: normal;
  font-size: 12px;
  line-height: 1.6;
  color: #cbd5e1;
}
.footer-contact-item {
  font-size: 12px;
  color: #cbd5e1;
  margin: 4px 0;
  line-height: 1.5;
}
.footer-contact-item strong {
  color: #ffffff;
}
.footer-mandate-text {
  font-size: 12px;
  line-height: 1.6;
  color: #94a3b8;
}

/* Bottom Attribution Strip */
.gigw-footer-bottom {
  background: #000f1a;
  padding: 12px 0;
  font-size: 12px;
  color: #94a3b8;
}
.gigw-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.attribution-text {
  line-height: 1.5;
}
.last-updated-text {
  font-weight: 600;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .gigw-bottom-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
