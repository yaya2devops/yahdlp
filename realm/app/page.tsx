'use client'
import { Copy, Github, Package } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'
import { useEffect } from 'react'

export default function YahDLPLanding() {
  useEffect(() => {
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = '/yahdlp.png?' + new Date().getTime();
    document.head.appendChild(link);

    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = '/yahdlp.png?' + new Date().getTime();
    document.head.appendChild(appleLink);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#e4e4ff] font-mono flex flex-col">
      <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 pt-16 sm:pt-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-[#6262D5]">yahDLP</h1>
        <p className="text-xl mb-12">A Must-have PII Detection & Redaction Appliance</p>
        
        <div className="bg-[#252542] p-6 rounded-lg mb-12 w-full max-w-2xl relative group">
          <pre className="overflow-x-auto text-[#a6a6ff] text-lg">
            <code>npm install -g yahdlp</code>
          </pre>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Copy command"
            onClick={() => navigator.clipboard.writeText('npm install -g yahdlp')}
          >
            <Copy className="w-5 h-5 text-[#6262D5] hover:text-[#7f7fc9]" />
          </button>
        </div>
        <div className="flex gap-4 mb-16">
          <Link
            href="https://www.npmjs.com/package/yahdlp"
            className="bg-[#6262D5] hover:bg-[#7f7fc9] px-6 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <Package className="w-5 h-5" />
            NPM
          </Link>
          <Link
            href="https://github.com/yaya2devops/yahdlp"
            className="bg-[#6262D5] hover:bg-[#7f7fc9] px-6 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <Github className="w-5 h-5" />
            GitHub
          </Link>
        </div>
        <div className="max-w-3xl mx-auto text-lg leading-relaxed space-y-6 text-[#b3b3ff]">
          <p>
            Turn your sensitive data handling into a fully-configured, beautiful,
            and modern workflow by running a single command. That's the one-line pitch for yahDLP. No need to write bespoke configs for every essential tool just to get started with PII detection.
          </p>
          <p>
            yahDLP combines powerful PII detection algorithms with smart redaction
            capabilities, ensuring your data remains confidential and compliant
            with privacy regulations.
          </p>
          <p>
            yahDLP can be further explored via NPM.
          </p>
        </div>
      </main>
      <footer className="w-full text-center py-4 text-[#6262D5]">
        <p>&copy; 2024 yahDLP | Empowering data privacy</p>
      </footer>
    </div>
  )
}