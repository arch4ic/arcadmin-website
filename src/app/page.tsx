"use client";

import { useState, useEffect } from "react";

const ASCII_LOGO = `
 █████╗ ██████╗  ██████╗ █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
███████║██████╔╝██║     ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
██╔══██║██╔══██╗██║     ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
██║  ██║██║  ██║╚██████╗██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝
`;

const SWARM_ASCII = `
    ┌─────────┐     ┌─────────┐     ┌─────────┐
    │  NODE   │     │  NODE   │     │  NODE   │
    │   01    │     │   02    │     │   03    │
    └────┬────┘     └────┬────┘     └────┬────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                   ┌─────┴─────┐
                   │ ARCADMIN  │
                   │   BRAIN   │
                   └───────────┘
`;

const BOOT_MESSAGES = [
  { text: "BIOS Date 12/30/25 Ver: 1.0.0", delay: 100 },
  { text: "Detecting Primary Master... arcadmin-core", delay: 200 },
  { text: "Detecting Primary Slave... None", delay: 150 },
  { text: "Memory Test: 65536K OK", delay: 300 },
  { text: "", delay: 100 },
  { text: "Initializing arcadmin system...", delay: 400 },
  { text: "Loading SSH executor module... [OK]", delay: 200 },
  { text: "Loading command validator... [OK]", delay: 200 },
  { text: "Loading safety gate... [OK]", delay: 200 },
  { text: "Establishing persistent sessions... [OK]", delay: 300 },
  { text: "", delay: 100 },
  { text: "arcadmin v1.0.0 - Distributed Sysadmin Agent Swarm", delay: 200 },
  { text: "Copyright (c) 2025. All rights reserved.", delay: 100 },
  { text: "", delay: 100 },
  { text: "System ready. Type 'help' for available commands.", delay: 200 },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Agentless Architecture",
    description: "Execute commands on remote targets via persistent SSH sessions. No software installation required on target machines.",
    command: "ssh user@target",
  },
  {
    icon: "🔄",
    title: "Stateful Execution",
    description: "Maintains shell state across multiple commands. Working directory, environment variables - all preserved.",
    command: "cd /app && export ENV=prod",
  },
  {
    icon: "🔐",
    title: "Interactive Auth",
    description: "Seamlessly handles password prompts. Control handed to user when authentication is required.",
    command: "sudo systemctl restart nginx",
  },
  {
    icon: "🛡️",
    title: "Deterministic Safety",
    description: "Three-tier validation: autorun, requires_permission, denylist. Only safe commands pass through.",
    command: "validate --strict cmd",
  },
  {
    icon: "📊",
    title: "Structured Results",
    description: "Detailed RemoteCommandResult objects with exit codes, stdout, and execution duration.",
    command: "result.exit_code == 0",
  },
  {
    icon: "🤖",
    title: "LLM-Ready Transcripts",
    description: "Automatically generates execution transcripts optimized for LLM Brain integration.",
    command: "transcript.to_llm()",
  },
];

const DEMO_COMMANDS = [
  { prompt: "root@arcadmin:~#", cmd: "arcadmin connect server01.internal", output: "Establishing SSH connection to server01.internal...\n[OK] Connected via persistent session" },
  { prompt: "root@server01:~#", cmd: "uname -a", output: "Linux server01 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux" },
  { prompt: "root@server01:~#", cmd: "df -h | head -3", output: "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1       100G   45G   55G  45% /\n/dev/sdb1       500G  200G  300G  40% /data" },
  { prompt: "root@server01:~#", cmd: "docker ps --format 'table {{.Names}}\\t{{.Status}}'", output: "NAMES          STATUS\nnginx-proxy    Up 15 days\npostgres-db    Up 15 days\nredis-cache    Up 15 days" },
];

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < BOOT_MESSAGES.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, BOOT_MESSAGES[currentIndex].text]);
        setCurrentIndex(prev => prev + 1);
      }, BOOT_MESSAGES[currentIndex].delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="terminal-window w-full max-w-3xl">
        <div className="terminal-header">
          <div className="terminal-button close"></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
          <div className="terminal-title">ARCADMIN BOOT SEQUENCE</div>
        </div>
        <div className="p-6 font-mono text-sm leading-relaxed min-h-[400px]">
          {lines.map((line, idx) => (
            <div key={idx} className="boot-line" style={{ animationDelay: `${idx * 0.05}s` }}>
              {line.includes("[OK]") ? (
                <>
                  {line.replace("[OK]", "")}
                  <span className="text-[#33ff33]">[OK]</span>
                </>
              ) : line.includes("arcadmin") && idx === 10 ? (
                <span className="glow-amber">{line}</span>
              ) : (
                line
              )}
            </div>
          ))}
          {currentIndex < BOOT_MESSAGES.length && (
            <span className="cursor"></span>
          )}
        </div>
      </div>
    </div>
  );
}

function TypeWriter({ text, delay = 50, onComplete }: { text: string; delay?: number; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return (
    <span>
      {displayText}
      {currentIndex < text.length && <span className="cursor"></span>}
    </span>
  );
}

function TerminalDemo() {
  const [visibleCommands, setVisibleCommands] = useState(0);
  const [typingComplete, setTypingComplete] = useState<boolean[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCommands(prev => {
        if (prev < DEMO_COMMANDS.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-window border-pulse">
      <div className="terminal-header">
        <div className="terminal-button close"></div>
        <div className="terminal-button minimize"></div>
        <div className="terminal-button maximize"></div>
        <div className="terminal-title">arcadmin@swarm ~ live demo</div>
      </div>
      <div className="p-4 text-sm min-h-[300px] overflow-hidden">
        {DEMO_COMMANDS.slice(0, visibleCommands).map((item, idx) => (
          <div key={idx} className="mb-4 fade-in" style={{ animationDelay: `${idx * 0.3}s` }}>
            <div className="flex gap-2">
              <span className="glow-cyan shrink-0">{item.prompt}</span>
              <span className="glow">
                {idx === visibleCommands - 1 && !typingComplete[idx] ? (
                  <TypeWriter 
                    text={item.cmd} 
                    delay={30} 
                    onComplete={() => setTypingComplete(prev => {
                      const newState = [...prev];
                      newState[idx] = true;
                      return newState;
                    })}
                  />
                ) : (
                  item.cmd
                )}
              </span>
            </div>
            {(typingComplete[idx] || idx < visibleCommands - 1) && (
              <pre className="text-[#999] mt-1 ml-0 whitespace-pre-wrap text-xs leading-relaxed">
                {item.output}
              </pre>
            )}
          </div>
        ))}
        {visibleCommands >= DEMO_COMMANDS.length && (
          <div className="flex gap-2 mt-2">
            <span className="glow-cyan">root@server01:~#</span>
            <span className="cursor"></span>
          </div>
        )}
      </div>
    </div>
  );
}

function MatrixRain() {
  return (
    <div className="matrix-bg">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="matrix" width="20" height="20" patternUnits="userSpaceOnUse">
            <text x="0" y="15" fill="#33ff33" fontSize="12" fontFamily="monospace" opacity="0.3">
              {Math.random() > 0.5 ? "1" : "0"}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#matrix)" />
      </svg>
    </div>
  );
}

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [skipBoot, setSkipBoot] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        setSkipBoot(true);
        setBootComplete(true);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!bootComplete && !skipBoot) {
    return (
      <div className="crt-screen" onClick={() => { setSkipBoot(true); setBootComplete(true); }}>
        <MatrixRain />
        <BootSequence onComplete={() => setBootComplete(true)} />
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[#666] text-xs">
          Press any key or click to skip...
        </div>
      </div>
    );
  }

  return (
    <div className="crt-screen">
      <MatrixRain />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
        <div className="text-center max-w-5xl mx-auto">
          {/* ASCII Logo */}
          <pre className="ascii-art glow text-center mx-auto mb-8 overflow-x-auto">
            {ASCII_LOGO}
          </pre>
          
          {/* Tagline */}
          <h2 className="text-lg md:text-xl mb-6 glow-amber tracking-wider">
            DISTRIBUTED SYSADMIN AGENT SWARM
          </h2>
          
          {/* Description */}
          <p className="text-[#888] max-w-2xl mx-auto mb-8 leading-relaxed">
            A lightweight, extensible, and distributed system administration agent in Python.
            Execute commands on remote targets through persistent SSH sessions without deploying any software.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <a 
              href="https://github.com/yourusername/arcadmin" 
              target="_blank"
              rel="noopener noreferrer"
              className="term-button flex items-center gap-2"
            >
              <span>⟨</span> VIEW SOURCE <span>⟩</span>
            </a>
            <a 
              href="#features" 
              className="term-button flex items-center gap-2"
              style={{ borderColor: "var(--term-cyan)", color: "var(--term-cyan)" }}
            >
              <span>↓</span> EXPLORE FEATURES
            </a>
          </div>

          {/* Quick Install */}
          <div className="code-block max-w-md mx-auto text-left">
            <div className="text-[#666] text-xs mb-2"># Quick Install</div>
            <div className="flex items-center gap-2">
              <span className="glow-cyan">$</span>
              <code className="glow">pip install arcadmin</code>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-[#666] text-2xl">⌄</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl glow mb-4 tracking-wide">
              ══════ SYSTEM CAPABILITIES ══════
            </h2>
            <p className="text-[#666]">Core features that make arcadmin powerful</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg glow-amber mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-[#888] text-sm mb-4 leading-relaxed">{feature.description}</p>
                <code className="text-xs text-[#666] block bg-black/30 p-2 rounded">
                  <span className="glow-cyan">$</span> {feature.command}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl glow mb-4 tracking-wide">
              ══════ SWARM ARCHITECTURE ══════
            </h2>
            <p className="text-[#666]">Distributed execution across multiple nodes</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <pre className="ascii-art text-center glow text-[0.6rem] md:text-xs leading-relaxed mx-auto">
              {SWARM_ASCII}
            </pre>
            
            <div className="space-y-6">
              <div className="feature-card">
                <h3 className="glow-cyan mb-2">src/nodes/executor.py</h3>
                <p className="text-[#888] text-sm">
                  Manages persistent SSH connections using <code className="text-[#ffb000]">pexpect</code> and 
                  a sentinel pattern for stateful execution across sessions.
                </p>
              </div>
              <div className="feature-card">
                <h3 className="glow-cyan mb-2">src/nodes/validator.py</h3>
                <p className="text-[#888] text-sm">
                  Deterministic safety gate that validates commands against <code className="text-[#ffb000]">config.yaml</code> policies.
                </p>
              </div>
              <div className="feature-card">
                <h3 className="glow-cyan mb-2">config.yaml</h3>
                <p className="text-[#888] text-sm">
                  Centralized policy for command categorization: <code className="text-[#33ff33]">autorun</code>, 
                  <code className="text-[#ffb000]"> requires_permission</code>, 
                  <code className="text-[#ff3333]"> denylist</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl glow mb-4 tracking-wide">
              ══════ LIVE TERMINAL ══════
            </h2>
            <p className="text-[#666]">Watch arcadmin in action</p>
          </div>
          
          <TerminalDemo />
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl glow mb-4 tracking-wide">
              ══════ SAFETY PROTOCOLS ══════
            </h2>
            <p className="text-[#666]">Three-tier command validation system</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="feature-card border-[#33ff33]/50">
              <div className="text-[#33ff33] text-sm mb-2">▓▓▓ AUTORUN ▓▓▓</div>
              <h3 className="glow text-lg mb-3">Safe Commands</h3>
              <p className="text-[#888] text-sm mb-4">Automatically executed without confirmation</p>
              <div className="space-y-1 text-xs">
                <div className="text-[#33ff33]">• uname -a</div>
                <div className="text-[#33ff33]">• df -h</div>
                <div className="text-[#33ff33]">• ps aux</div>
                <div className="text-[#33ff33]">• docker ps</div>
              </div>
            </div>
            
            <div className="feature-card border-[#ffb000]/50">
              <div className="text-[#ffb000] text-sm mb-2">▓▓▓ PERMISSION ▓▓▓</div>
              <h3 className="glow-amber text-lg mb-3">Requires Approval</h3>
              <p className="text-[#888] text-sm mb-4">User confirmation needed before execution</p>
              <div className="space-y-1 text-xs">
                <div className="text-[#ffb000]">• systemctl restart</div>
                <div className="text-[#ffb000]">• apt update</div>
                <div className="text-[#ffb000]">• docker run</div>
                <div className="text-[#ffb000]">• tail /var/log/*</div>
              </div>
            </div>
            
            <div className="feature-card border-[#ff3333]/50">
              <div className="text-[#ff3333] text-sm mb-2">▓▓▓ DENYLIST ▓▓▓</div>
              <h3 className="glow-red text-lg mb-3">Blocked Commands</h3>
              <p className="text-[#888] text-sm mb-4">Never executed under any circumstances</p>
              <div className="space-y-1 text-xs">
                <div className="text-[#ff3333]">• rm -rf /</div>
                <div className="text-[#ff3333]">• mkfs.ext4 /dev/sda</div>
                <div className="text-[#ff3333]">• chmod -R 777 /</div>
                <div className="text-[#ff3333]">• {`:(){ :|:& };:`}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl glow mb-4 tracking-wide">
              ══════ GETTING STARTED ══════
            </h2>
            <p className="text-[#666]">Up and running in minutes</p>
          </div>
          
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-button close"></div>
              <div className="terminal-button minimize"></div>
              <div className="terminal-button maximize"></div>
              <div className="terminal-title">installation</div>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <div className="text-[#666] text-xs mb-2"># 1. Clone the repository</div>
                <div><span className="glow-cyan">$</span> <span className="glow">git clone https://github.com/yourusername/arcadmin.git</span></div>
              </div>
              <div>
                <div className="text-[#666] text-xs mb-2"># 2. Set up virtual environment</div>
                <div><span className="glow-cyan">$</span> <span className="glow">cd arcadmin && python -m venv venv</span></div>
                <div><span className="glow-cyan">$</span> <span className="glow">source venv/bin/activate</span></div>
              </div>
              <div>
                <div className="text-[#666] text-xs mb-2"># 3. Install dependencies</div>
                <div><span className="glow-cyan">$</span> <span className="glow">pip install -r requirements.txt</span></div>
              </div>
              <div>
                <div className="text-[#666] text-xs mb-2"># 4. Configure policies</div>
                <div><span className="glow-cyan">$</span> <span className="glow">vim config.yaml</span></div>
              </div>
              <div>
                <div className="text-[#666] text-xs mb-2"># 5. Run tests</div>
                <div><span className="glow-cyan">$</span> <span className="glow">python3 tests/test_executor.py</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl glow mb-4 tracking-wide">
              ══════ ROADMAP ══════
            </h2>
            <p className="text-[#666]">What&apos;s coming next</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="feature-card">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#ffb000]">◆</span>
                <h3 className="glow-amber">SSH Key Authentication</h3>
              </div>
              <p className="text-[#888] text-sm">
                Support for SSH key-based authentication for enhanced security and automation.
              </p>
              <div className="mt-3 text-xs text-[#666]">Status: <span className="text-[#ffb000]">In Progress</span></div>
            </div>
            
            <div className="feature-card">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#ff33ff]">◆</span>
                <h3 className="glow-magenta">Gemini API Integration</h3>
              </div>
              <p className="text-[#888] text-sm">
                Integration with Gemini API for autonomous task planning and intelligent decision-making.
              </p>
              <div className="mt-3 text-xs text-[#666]">Status: <span className="text-[#ff33ff]">Planned</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#1a991a]/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <pre className="text-xs glow leading-tight">
{`┌─────────────────┐
│    ARCADMIN     │
│    v1.0.0       │
└─────────────────┘`}
              </pre>
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="https://github.com/yourusername/arcadmin" className="hover:glow transition-all">
                GitHub
              </a>
              <a href="#" className="hover:glow transition-all">
                Documentation
              </a>
              <a href="#" className="hover:glow transition-all">
                License
              </a>
            </div>
            
            <div className="text-[#666] text-xs text-center md:text-right">
              <div>Built with Python & SSH</div>
              <div className="mt-1">© 2025 arcadmin</div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#1a991a]/20 text-center text-[#444] text-xs">
            <code>SESSION TERMINATED - GOODBYE</code>
          </div>
        </div>
      </footer>
    </div>
  );
}
