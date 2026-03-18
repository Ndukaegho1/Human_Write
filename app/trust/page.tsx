import Link from "next/link"
import { Card } from "@/components/ui/card"

// Icons
const ShieldIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const LockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const EyeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const ServerIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
)

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const BrainIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const navigation = [
  { name: "About", href: "/about" },
  { name: "Trust Center", href: "/trust" },
  { name: "Careers", href: "/careers" },
  { name: "Help Center", href: "/help" },
  { name: "Contact Us", href: "/contact" },
  { name: "Resources", href: "/resources" },
]

const faqs = [
  {
    question: "How does HumanWrite protect my data?",
    answer: "We use industry-standard encryption (TLS 1.3) for all data in transit, and AES-256 encryption for data at rest. Our infrastructure is hosted on secure cloud providers with SOC 2 Type II compliance."
  },
  {
    question: "Do you train AI models on my content?",
    answer: "No. We never train our models on user-submitted content without explicit consent. Your content is used only to provide the service you request, and is deleted according to our data retention policy."
  },
  {
    question: "Can I delete my data?",
    answer: "Yes. You can delete your account and all associated data at any time from your account settings. We will permanently delete your data within 30 days of account deletion."
  },
  {
    question: "What are AI detector scores?",
    answer: "Our AI detector provides probabilistic estimates, meaning it is a statistical prediction, not definitive proof. We clearly communicate this limitation and never claim our scores are 100% accurate. The scores should be used as one signal among many, not as conclusive evidence."
  },
]

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0F4C81] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HW</span>
              </div>
              <span className="text-xl font-bold text-[#0F172A]">HumanWrite</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="text-sm font-medium text-[#475569] hover:text-[#0F4C81] transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth" className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors">Sign In</Link>
              <Link href="/pricing" className="px-4 py-2 bg-[#0F4C81] text-white text-sm font-medium rounded-lg hover:bg-[#0a3d66] transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-[#0F4C81]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldIcon className="w-8 h-8 text-[#0F4C81]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">Trust & Security Center</h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto">
            Your trust is our foundation. Learn how we protect your data, ensure privacy, and use AI responsibly.
          </p>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Privacy Commitment</h2>
            <p className="text-[#475569] max-w-2xl mx-auto">We're committed to protecting your privacy and giving you control over your data.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border border-[#E2E8F0]">
              <LockIcon className="w-8 h-8 text-[#28B04D] mb-4" />
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Your Data, Your Ownership</h3>
              <p className="text-[#475569] text-sm">You retain full ownership of all content you submit. We never train our models on your data without explicit consent.</p>
            </Card>
            <Card className="p-6 border border-[#E2E8F0]">
              <EyeIcon className="w-8 h-8 text-[#0F4C81] mb-4" />
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Transparency</h3>
              <p className="text-[#475569] text-sm">We clearly explain what data we collect, how we use it, and who has access. No hidden clauses, no surprises.</p>
            </Card>
            <Card className="p-6 border border-[#E2E8F0]">
              <UserIcon className="w-8 h-8 text-[#28B04D] mb-4" />
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Control</h3>
              <p className="text-[#475569] text-sm">Delete your account and data at any time. Download your data. Control what you share with granular settings.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8 text-center">Data Protection</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-3">Data We Collect</h3>
              <ul className="space-y-2 text-[#475569]">
                <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#28B04D] shrink-0 mt-0.5" /><span>Account information (email, name) when you sign up</span></li>
                <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#28B04D] shrink-0 mt-0.5" /><span>Content you explicitly submit for humanization or detection</span></li>
                <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#28B04D] shrink-0 mt-0.5" /><span>Usage data to improve our services (anonymized)</span></li>
                <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#28B04D] shrink-0 mt-0.5" /><span>Writing samples you upload for voice profiling (with consent)</span></li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-3">How We Protect Your Data</h3>
              <ul className="space-y-2 text-[#475569]">
                <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#28B04D] shrink-0 mt-0.5" /><span>TLS 1.3 encryption for all data in transit</span></li>
                <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#28B04D] shrink-0 mt-0.5" /><span>AES-256 encryption for data at rest</span></li>
                <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#28B04D] shrink-0 mt-0.5" /><span>SOC 2 Type II compliant infrastructure</span></li>
                <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#28B04D] shrink-0 mt-0.5" /><span>Regular security audits and penetration testing</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Account Security */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8 text-center">Authentication & Account Security</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] mb-2">Secure Authentication</h3>
              <p className="text-[#475569] text-sm">We use Firebase Authentication with industry-best security practices. Your passwords are never stored on our servers.</p>
            </Card>
            <Card className="p-6 border border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] mb-2">Two-Factor Authentication</h3>
              <p className="text-[#475569] text-sm">Enable 2FA in your account settings for an extra layer of security on your account.</p>
            </Card>
            <Card className="p-6 border border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] mb-2">Session Management</h3>
              <p className="text-[#475569] text-sm">View and manage active sessions. Automatically log out after periods of inactivity.</p>
            </Card>
            <Card className="p-6 border border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] mb-2">Account Recovery</h3>
              <p className="text-[#475569] text-sm">Secure account recovery options to help you regain access while preventing unauthorized access.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Responsible AI */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8 text-center">Responsible AI Use</h2>
          <div className="bg-white rounded-xl p-8 border border-[#E2E8F0]">
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangleIcon className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A]">AI Detection is Probabilistic</h3>
                <p className="text-[#475569] mt-2">Our AI detector provides statistical estimates, not definitive proof. No AI detection technology can guarantee 100% accuracy. Our scores should be used as one signal among many, never as conclusive evidence of authorship.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <BrainIcon className="w-8 h-8 text-[#0F4C81] shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A]">Our Commitment to Responsible Use</h3>
                <p className="text-[#475569] mt-2">HumanWrite is designed for legitimate writing enhancement, helping people communicate more clearly. We actively work to prevent misuse and reserve the right to suspend accounts that violate our terms of service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Uptime & Reliability */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8 text-center">Uptime & Reliability</h2>
          <Card className="p-8 border border-[#E2E8F0]">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#28B04D] mb-2">99.9%</div>
                <p className="text-[#475569] text-sm">Uptime SLA</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#0F4C81] mb-2">&lt;200ms</div>
                <p className="text-[#475569] text-sm">Average Response</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#28B04D] mb-2">24/7</div>
                <p className="text-[#475569] text-sm">Monitoring</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Security Contact */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Security Concerns?</h2>
          <p className="text-[#475569] mb-6">If you discover a security vulnerability, please report it responsibly.</p>
          <a href="mailto:security@humanwrite.com" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F4C81] text-white font-medium rounded-lg hover:bg-[#0a3d66] transition-colors">
            <MailIcon className="w-5 h-5" />
            Report Security Issue
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-[#0F172A]">
                  {faq.question}
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-4 pb-4 text-[#475569] text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
