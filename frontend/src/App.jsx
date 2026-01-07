function App() {
  return (
    // If the background is DARK BLUE/BLACK, Tailwind is working.
    // If it's white, Tailwind is NOT working.
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      
      {/* If this text is HUGE (5xl) and CYAN (Bright Blue), Tailwind is working. */}
      <h1 className="text-5xl font-bold text-cyan-400 mb-4 animate-pulse">
        SECURESCAPE
      </h1>
      
      <p className="text-xl text-slate-300">
        System Status: <span className="text-green-500 font-mono">ONLINE</span>
      </p>

      <button className="mt-8 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/50 transition-all">
        Test Connection
      </button>

    </div>
  )
}

export default App
