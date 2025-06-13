"use client";

import React, { useState } from "react";

export default function ZapierDarkUI() {
  const [activeTab, setActiveTab] = useState("ai");
  const [activeSidebar, setActiveSidebar] = useState("Home");

  const tabClass = (value: string) =>
    `text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      activeTab === value
        ? "bg-white text-black shadow-sm"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`;

  const sidebarItemClass = (item: string) =>
    `w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      activeSidebar === item
        ? "bg-white text-black"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`;

  const navigationItems = [
    { name: "Home", beta: false },
    { name: "Discover", beta: false },
    { name: "Zaps", beta: false },
    { name: "Tables", beta: false },
    { name: "Interfaces", beta: false },
    { name: "Chatbots", beta: true },
    { name: "Canvas", beta: true },
    { name: "Agents", beta: true },
    { name: "App Connections", beta: false },
    { name: "Zap History", beta: false },
    { name: "More", beta: false }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Top Bar */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">zapier</div>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="text-sm text-gray-400">Automation Platform</div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              + Create
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-white font-medium">
              GP
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-950 border-r border-gray-800 min-h-screen">
          <div className="p-6">
            <button className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium mb-6">
              + Create
            </button>
            
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSidebar(item.name)}
                  className={sidebarItemClass(item.name)}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.beta && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                        Beta
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-12 py-8">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-4xl font-bold">
                What would you like to{" "}
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  automate
                </span>
                ?
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-300 border border-gray-800">
                ✨ AI Beta
              </span>
            </div>

            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Build powerful automations with AI assistance. Connect your favorite apps and services to create seamless workflows.
            </p>

            <div className="flex items-center space-x-4 mb-8">
              <button className="border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-900 hover:border-gray-600 transition-all font-medium">
                Find Template
              </button>
              <button className="border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-900 hover:border-gray-600 transition-all font-medium">
                Generate Zap
              </button>
            </div>

            <div className="max-w-3xl">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Describe what you want to automate..."
                  className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent pr-24"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  Generate
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-gray-500">Suggestions:</span>
                {["Facebook Lead Ads", "Google Sheets", "Slack to Email", "Customer Support", "Sales Automation"].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="text-gray-400 hover:text-white underline underline-offset-4 hover:no-underline transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start from Scratch */}
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Start from Scratch</h2>
              <p className="text-gray-400">Choose your automation type to get started</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { name: "Zap", desc: "Automated workflows", icon: "⚡" },
                { name: "Table", desc: "Automated data", icon: "📊" },
                { name: "Interface", desc: "Apps, forms, pages", icon: "🖥️" },
                { name: "Chatbot", desc: "AI-powered assistant", icon: "🤖" },
                { name: "Canvas", desc: "Process visualization", icon: "🎨" }
              ].map((item) => (
                <div
                  key={item.name}
                  className="group bg-gray-900 border border-gray-800 p-6 rounded-xl hover:bg-gray-800 hover:border-gray-600 cursor-pointer transition-all duration-200"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Templates */}
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Popular Templates</h2>
              <p className="text-gray-400">Get started with proven automation workflows</p>
            </div>

            <div className="flex space-x-2 mb-8 border-b border-gray-800 pb-4">
              <button className={tabClass("ai")} onClick={() => setActiveTab("ai")}>
                🤖 AI Workflows
              </button>
              <button className={tabClass("popular")} onClick={() => setActiveTab("popular")}>
                🔥 Most Popular
              </button>
              <button className={tabClass("trending")} onClick={() => setActiveTab("trending")}>
                📈 Trending
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Capture Facebook Leads with AI Analysis",
                  description: "Automatically capture leads from Facebook ads, analyze with AI, and store in your CRM system.",
                  badge: "AI-Powered",
                  apps: ["Facebook", "OpenAI", "Salesforce"],
                  uses: "2.3k"
                },
                {
                  title: "Smart Google Sheets Updates",
                  description: "Get automatic updates in Google Sheets with ChatGPT insights and detailed analysis.",
                  badge: "AI-Powered", 
                  apps: ["Google Sheets", "ChatGPT", "Gmail"],
                  uses: "1.8k"
                },
                {
                  title: "AI Email Auto-Responder",
                  description: "Instantly respond to emails with AI-powered replies via Gmail and Google Workspace integration.",
                  badge: "AI-Powered",
                  apps: ["Gmail", "OpenAI", "Slack"],
                  uses: "1.5k"
                }
              ].map((template, i) => (
                <div
                  key={i}
                  className="group bg-gray-900 border border-gray-800 p-6 rounded-xl hover:bg-gray-800 hover:border-gray-600 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                      ✨ {template.badge}
                    </span>
                    <span className="text-xs text-gray-500">{template.uses} uses</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-white transition-colors">
                    {template.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors leading-relaxed">
                    {template.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {template.apps.map((app, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center px-3 py-1 rounded-md text-xs bg-gray-800 text-gray-400 border border-gray-700"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-800">
            <div className="text-gray-500 text-sm">
              <p className="mb-2">Ready to automate your workflows?</p>
              <div className="flex space-x-6">
                <button className="text-white hover:underline underline-offset-4 transition-colors">
                  Get started for free
                </button>
                <button className="text-white hover:underline underline-offset-4 transition-colors">
                  View documentation
                </button>
                <button className="text-white hover:underline underline-offset-4 transition-colors">
                  Browse templates
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}