import Link from "next/link"
import { Card } from "@/components/ui/card"

// Icons
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const BookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
)

const RocketIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
)

const ScanIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MicIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
)

const HistoryIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const WrenchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const HelpCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
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

const categories = [
  { name: "Getting Started", icon: RocketIcon, description: "Learn the basics of HumanWrite", count: 8 },
  { name: "Humanizer", icon: BookIcon, description: "How to humanize your text", count: 12 },
  { name: "AI Detector", icon: ScanIcon, description: "Understanding detection scores", count: 10 },
  { name: "Billing & Plans", icon: CreditCardIcon, description: "Pricing and subscription help", count: 8 },
  { name: "Account & Login", icon: UserIcon, description: "Managing your account", count: 6 },
  { name: "Voice Profile", icon: MicIcon, description: "Building your writing voice", count: 7 },
  { name: "History & Saved", icon: HistoryIcon, description: "Your saved content", count: 5 },
  { name: "Troubleshooting", icon: WrenchIcon, description: "Fix common issues", count: 9 },
]

const popularArticles = [
  { title: "How to get started with HumanWrite", category: "Getting Started" },
  { title: "Understanding AI detection scores", category: "AI Detector" },
  { title: "How to use the Humanizer effectively", category: "Humanizer" },
  { title: "Changing your subscription plan", category: "Billing & Plans" },
  { title: "Building your voice profile", category: "Voice Profile" },
]

const faqs = [
  { question: "How does the Humanizer work?", answer: "The Humanizer uses advanced AI to rewrite your text in a more natural, human-sounding way while preserving your original meaning. You can choose from different tones and adjust the strength of the humanization." },
  { question: "Are AI detector scores accurate?", answer: "AI detection scores are probabilistic estimates, not definitive proof. We clearly communicate that these scores should be used as one signal among many, not as conclusive evidence of authorship. No detection method is 100% accurate." },
  { question: "Can I cancel my subscription anytime?", answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. You won't be charged again after cancellation." },
  { question: "Is my content private?", answer: "Yes. We never train our AI models on your content without explicit consent. Your content is used only to provide the service you request. You can delete your data at any time." },
  { question: "How do I build a voice profile?", answer: "Upload 5-10 samples of your writing (emails, documents, articles) to teach HumanWrite your unique style. Our AI will learn your tone, vocabulary, and preferences to provide more personalized suggestions." },
]

export default function HelpPage() {
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

      {/* Hero with Search */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">How can we help?</h1>
          <p className="text-[#475569] mb-8">Search our knowledge base or browse categories below.</p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
            <input 
              type="text" 
              placeholder="Search for articles..." 
              className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#475569] focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20"
            />
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {popularArticles.map((article, index) => (
              <a key={index} href="#" className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-full text-sm text-[#475569] hover:border-[#0F4C81] hover:text-[#0F4C81] transition-colors">
                {article.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Browse by Category</h2>
            <p className="text-[#475569]">Find answers organized by topic.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href="#" className="group">
                <Card className="p-6 border border-[#E2E8F0] hover:border-[#0F4C81]/30 hover:shadow-lg transition-all h-full">
                  <div className="w-12 h-12 bg-[#0F4C81]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0F4C81]/20 transition-colors">
                    <category.icon className="w-6 h-6 text-[#0F4C81]" />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">{category.name}</h3>
                  <p className="text-sm text-[#475569] mb-2">{category.description}</p>
                  <span className="text-xs text-[#0F4C81] font-medium">{category.count} articles</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">Featured Articles</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-[#0F172A]">
                  {faq.question}
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-[#475569] text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-[#0F4C81] border-0 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
                <p className="text-white/80 mb-4">Can't find what you're looking for? Our support team is here to help.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0F4C81] font-medium rounded-lg hover:bg-white/90 transition-colors">
                  <MailIcon className="w-5 h-5" />
                  Contact Support
                </Link>
                <a href="mailto:help@humanwrite.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors">
                  Email Us
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="bg-white border-t border-[#E2E8F0] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#0F4C81] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HW</span>
                </div>
                <span className="text-xl font-bold text-[#0F172A]">HumanWrite</span>
              </div>
              <p className="text-sm text-[#475569]">Helping writers write better, not just faster.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#0F172A]">Product</h4>
              <ul className="space-y-2 text-sm text-[#475569]">
                <li><Link href="/humanizer" className="hover:text-[#0F4C81] transition-colors">Humanizer</Link></li>
                <li><Link href="/detector" className="hover:text-[#0F4C81] transition-colors">AI Detector</Link></li>
                <li><Link href="/pricing" className="hover:text-[#0F4C81] transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#0F172A]">Company</h4>
              <ul className="space-y-2 text-sm text-[#475569]">
                <li><Link href="/about" className="hover:text-[#0F4C81] transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-[#0F4C81] transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-[#0F4C81] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#0F172A]">Support</h4>
              <ul className="space-y-2 text-sm text-[#475569]">
                <li><Link href="/help" className="hover:text-[#0F4C81] transition-colors">Help Center</Link></li>
                <li><Link href="/trust" className="hover:text-[#0F4C81] transition-colors">Trust Center</Link></li>
                <li><Link href="/resources" className="hover:text-[#0F4C81] transition-colors">Resources</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#475569]">(c) 2024 HumanWrite. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-[#475569]">
              <Link href="/privacy" className="hover:text-[#0F4C81] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#0F4C81] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
