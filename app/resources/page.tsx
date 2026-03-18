import Link from "next/link"
import { Card } from "@/components/ui/card"

// Icons
const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
)

const ScanIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const PlayCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
)

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
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
  { name: "AI Writing Guides", icon: BookOpenIcon, count: 15, color: "bg-[#0F4C81]" },
  { name: "Humanizer Tips", icon: LightbulbIcon, count: 12, color: "bg-[#28B04D]" },
  { name: "AI Detector Education", icon: ScanIcon, count: 8, color: "bg-[#0F4C81]" },
  { name: "Product Tutorials", icon: PlayCircleIcon, count: 20, color: "bg-[#28B04D]" },
  { name: "Case Studies", icon: FileTextIcon, count: 6, color: "bg-[#0F4C81]" },
  { name: "Industry Insights", icon: TrendingUpIcon, count: 10, color: "bg-[#28B04D]" },
]

const featuredResources = [
  { title: "How to make AI-generated text sound natural", category: "AI Writing Guides", readTime: "8 min read", description: "Learn the techniques to transform robotic AI writing into natural, human-sounding prose." },
  { title: "What AI detection scores really mean", category: "AI Detector Education", readTime: "6 min read", description: "Understanding the limitations of AI detection and how to interpret probabilistic scores." },
  { title: "Best practices for editing AI drafts", category: "Humanizer Tips", readTime: "5 min read", description: "A practical guide to refining and improving AI-generated content." },
]

const allResources = [
  { title: "How to build a personal writing voice", category: "AI Writing Guides", readTime: "7 min read" },
  { title: "When to use humanization vs rewriting", category: "Humanizer Tips", readTime: "4 min read" },
  { title: "Understanding detector confidence scores", category: "AI Detector Education", readTime: "5 min read" },
  { title: "Getting started with HumanWrite", category: "Product Tutorials", readTime: "3 min read" },
  { title: "How Company X improved their content quality", category: "Case Studies", readTime: "6 min read" },
  { title: "The future of AI in writing", category: "Industry Insights", readTime: "10 min read" },
  { title: "5 ways to personalize your voice profile", category: "Humanizer Tips", readTime: "5 min read" },
  { title: "AI detection: A balanced perspective", category: "AI Detector Education", readTime: "8 min read" },
]

export default function ResourcesPage() {
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

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
            Resources
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto">
            Learn how to get the most out of HumanWrite. Guides, tutorials, and insights 
            to help you write better.
          </p>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8">Featured</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => (
              <Link key={index} href="#" className="group">
                <Card className="p-6 border border-[#E2E8F0] hover:border-[#0F4C81]/30 hover:shadow-lg transition-all h-full">
                  <span className="inline-block px-3 py-1 bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-medium rounded-full mb-4">
                    {resource.category}
                  </span>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2 group-hover:text-[#0F4C81] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-[#475569] mb-4">{resource.description}</p>
                  <span className="text-xs text-[#475569]">{resource.readTime}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Browse by Category</h2>
            <p className="text-[#475569]">Find the content that matters most to you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href="#" className="group">
                <Card className="p-6 border border-[#E2E8F0] hover:border-[#0F4C81]/30 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F172A] group-hover:text-[#0F4C81] transition-colors">{category.name}</h3>
                      <span className="text-sm text-[#475569]">{category.count} articles</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8">All Resources</h2>
          <div className="space-y-4">
            {allResources.map((resource, index) => (
              <Link key={index} href="#" className="group">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#0F4C81]/30 transition-colors">
                  <div>
                    <span className="text-xs text-[#0F4C81] font-medium">{resource.category}</span>
                    <h3 className="font-medium text-[#0F172A] group-hover:text-[#0F4C81] transition-colors">{resource.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#475569]">{resource.readTime}</span>
                    <ArrowRightIcon className="w-5 h-5 text-[#475569] group-hover:text-[#0F4C81] transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-[#0F4C81] border-0 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Stay updated</h2>
                <p className="text-white/80 mb-0">
                  Get the latest guides, tips, and insights delivered to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full pl-10 pr-4 py-3 bg-white text-[#0F172A] rounded-lg focus:outline-none"
                  />
                </div>
                <button className="px-6 py-3 bg-[#28B04D] text-white font-medium rounded-lg hover:bg-[#229640] transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Ready to write better?</h2>
          <p className="text-[#475569] mb-8 max-w-xl mx-auto">
            Start using HumanWrite today and see the difference in your writing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/humanizer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#28B04D] text-white font-medium rounded-lg hover:bg-[#229640] transition-colors">
              Try Humanizer Free
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="inline-flex px-6 py-3 bg-white text-[#0F172A] font-medium rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#28B04D] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HW</span>
                </div>
                <span className="text-xl font-bold">HumanWrite</span>
              </div>
              <p className="text-sm text-gray-400">Helping writers write better, not just faster.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/humanizer" className="hover:text-white transition-colors">Humanizer</Link></li>
                <li><Link href="/detector" className="hover:text-white transition-colors">AI Detector</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/trust" className="hover:text-white transition-colors">Trust Center</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">(c) 2024 HumanWrite. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
