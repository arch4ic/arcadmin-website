"use client";

import { useState, useEffect, useRef } from "react";

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

// ASCII Button Component - Clickable ASCII text
interface AsciiButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "cyan";
  size?: "sm" | "md" | "lg";
}

function AsciiButton({ children, href, onClick, variant = "primary", size = "md" }: AsciiButtonProps) {
  const colors = {
    primary: "glow",
    secondary: "glow-amber", 
    danger: "glow-red",
    cyan: "glow-cyan"
  };
  
  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const content = (
    <span className={`ascii-button ${colors[variant]} ${sizes[size]}`}>
      {`[ ${children} ]`}
    </span>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="bg-transparent border-none cursor-pointer">
      {content}
    </button>
  );
}

// ASCII Link - Inline clickable text
interface AsciiLinkProps {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "cyan" | "amber";
}

function AsciiLink({ children, href, variant = "cyan" }: AsciiLinkProps) {
  const colors = {
    primary: "glow",
    cyan: "glow-cyan",
    amber: "glow-amber"
  };
  
  return (
    <a 
      href={href} 
      target={href.startsWith("http") ? "_blank" : undefined} 
      rel="noopener noreferrer"
      className={`ascii-link ${colors[variant]}`}
    >
      {`<${children}>`}
    </a>
  );
}

// ASCII Nav Item
interface AsciiNavProps {
  children: React.ReactNode;
  href: string;
  active?: boolean;
}

function AsciiNav({ children, href, active }: AsciiNavProps) {
  return (
    <a 
      href={href} 
      className={`ascii-nav ${active ? 'active' : ''}`}
    >
      {active ? `>[${children}]<` : `[${children}]`}
    </a>
  );
}

const FEATURES = [
  {
    icon: "[ ⚡ ]",
    title: "Agentless Architecture",
    description: "Execute commands on remote targets via persistent SSH sessions. No software installation required on target machines.",
    command: "ssh user@target",
  },
  {
    icon: "[ ↻ ]",
    title: "Stateful Execution",
    description: "Maintains shell state across multiple commands. Working directory, environment variables - all preserved.",
    command: "cd /app && export ENV=prod",
  },
  {
    icon: "[ ⚿ ]",
    title: "Interactive Auth",
    description: "Seamlessly handles password prompts. Control handed to user when authentication is required.",
    command: "sudo systemctl restart nginx",
  },
  {
    icon: "[ ◈ ]",
    title: "Deterministic Safety",
    description: "Three-tier validation: autorun, requires_permission, denylist. Only safe commands pass through.",
    command: "validate --strict cmd",
  },
  {
    icon: "[ ▤ ]",
    title: "Structured Results",
    description: "Detailed RemoteCommandResult objects with exit codes, stdout, and execution duration.",
    command: "result.exit_code == 0",
  },
  {
    icon: "[ ◉ ]",
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

// Main Terminal Frame Component
function TerminalFrame({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState(new Date());
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = time.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });

  return (
    <div className="terminal-frame">
      {/* Terminal Title Bar */}
      <div className="terminal-titlebar">
        <div className="titlebar-left">
          <span className="titlebar-buttons">
            <span className="btn-close">×</span>
            <span className="btn-min">−</span>
            <span className="btn-max">□</span>
          </span>
        </div>
        <div className="titlebar-center">
          <span className="glow">arcadmin@swarm:~</span>
        </div>
        <div className="titlebar-right">
          <span className="text-[#666]">{dateStr}</span>
          <span className="glow-amber">{timeStr}</span>
        </div>
      </div>
      
      {/* Terminal Menu Bar */}
      <div className="terminal-menubar">
        <AsciiNav href="#home" active>HOME</AsciiNav>
        <AsciiNav href="#features">FEATURES</AsciiNav>
        <AsciiNav href="#architecture">ARCH</AsciiNav>
        <AsciiNav href="#demo">DEMO</AsciiNav>
        <AsciiNav href="#safety">SAFETY</AsciiNav>
        <AsciiNav href="#install">INSTALL</AsciiNav>
        <AsciiNav href="#roadmap">ROADMAP</AsciiNav>
        <div className="ml-auto flex gap-4">
          <AsciiLink href="https://github.com/yourusername/arcadmin" variant="cyan">GITHUB</AsciiLink>
          <AsciiLink href="#docs" variant="amber">DOCS</AsciiLink>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div className="terminal-content" ref={contentRef}>
        {children}
      </div>

      {/* Terminal Status Bar */}
      <div className="terminal-statusbar">
        <div className="statusbar-left">
          <span className="text-[#33ff33]">●</span>
          <span className="text-[#666]">SSH: Connected</span>
          <span className="text-[#666]">│</span>
          <span className="text-[#ffb000]">↑↓</span>
          <span className="text-[#666]">2.4KB/s</span>
        </div>
        <div className="statusbar-center">
          <span className="text-[#666]">─────────────</span>
          <span className="glow-cyan"> ARCADMIN v1.0.0 </span>
          <span className="text-[#666]">─────────────</span>
        </div>
        <div className="statusbar-right">
          <span className="text-[#666]">PID: 31337</span>
          <span className="text-[#666]">│</span>
          <span className="text-[#33ff33]">MEM: 64MB</span>
        </div>
      </div>
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
    <div className="crt-screen terminal-outer">
      <MatrixRain />
      
      <TerminalFrame>
        {/* Hero Section */}
        <section id="home" className="terminal-section">
          <div className="section-header">
            <span className="text-[#666]">┌──────────────────────────────────────────────────────────────┐</span>
            <div className="text-center glow-cyan">WELCOME TO ARCADMIN CONTROL CENTER</div>
            <span className="text-[#666]">└──────────────────────────────────────────────────────────────┘</span>
          </div>
          
          <div className="text-center py-8">
            {/* ASCII Logo */}
            <pre className="ascii-art glow text-center mx-auto mb-6 overflow-x-auto">
              {ASCII_LOGO}
            </pre>
            
            {/* Tagline */}
            <div className="mb-6">
              <span className="text-[#666]">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>
              <h2 className="text-lg md:text-xl glow-amber tracking-wider py-2">
                DISTRIBUTED SYSADMIN AGENT SWARM
              </h2>
              <span className="text-[#666]">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>
            </div>
            
            {/* Description */}
            <p className="text-[#888] max-w-2xl mx-auto mb-8 leading-relaxed px-4">
              A lightweight, extensible, and distributed system administration agent in Python.
              Execute commands on remote targets through persistent SSH sessions without deploying any software.
            </p>
            
            {/* ASCII CTA Buttons */}
            <div className="flex flex-wrap gap-6 justify-center mb-8">
              <AsciiButton href="https://github.com/yourusername/arcadmin" variant="primary" size="lg">
                ⟨ VIEW SOURCE ⟩
              </AsciiButton>
              <AsciiButton href="#features" variant="cyan" size="lg">
                ↓ EXPLORE FEATURES
              </AsciiButton>
            </div>

            {/* Quick Install */}
            <div className="inline-block text-left bg-black/40 border border-[#1a991a]/50 p-4">
              <div className="text-[#666] text-xs mb-2"># Quick Install</div>
              <div className="flex items-center gap-2">
                <span className="glow-cyan">$</span>
                <code className="glow">pip install arcadmin</code>
                <AsciiButton onClick={() => navigator.clipboard.writeText('pip install arcadmin')} variant="secondary" size="sm">
                  COPY
                </AsciiButton>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="terminal-section">
          <div className="section-header">
            <span className="text-[#666]">╔══════════════════════════════════════════════════════════════╗</span>
            <div className="text-center glow py-2">▶ SYSTEM CAPABILITIES ◀</div>
            <span className="text-[#666]">╚══════════════════════════════════════════════════════════════╝</span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 stagger-children">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="feature-card-ascii">
                <div className="feature-header">
                  <span className="glow text-lg">{feature.icon}</span>
                  <span className="glow-amber">{feature.title}</span>
                </div>
                <div className="feature-border">├{'─'.repeat(40)}┤</div>
                <p className="text-[#888] text-sm mb-3 leading-relaxed">{feature.description}</p>
                <code className="text-xs block bg-black/40 p-2 border-l-2 border-[#33ff33]">
                  <span className="glow-cyan">$</span> {feature.command}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="terminal-section bg-black/30">
          <div className="section-header">
            <span className="text-[#666]">╔══════════════════════════════════════════════════════════════╗</span>
            <div className="text-center glow py-2">▶ SWARM ARCHITECTURE ◀</div>
            <span className="text-[#666]">╚══════════════════════════════════════════════════════════════╝</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 p-6 items-center">
            <pre className="ascii-art text-center glow text-[0.6rem] md:text-xs leading-relaxed mx-auto">
              {SWARM_ASCII}
            </pre>
            
            <div className="space-y-4">
              <div className="feature-card-ascii">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#666]">├─►</span>
                  <span className="glow-cyan">src/nodes/executor.py</span>
                </div>
                <p className="text-[#888] text-sm pl-6">
                  Manages persistent SSH connections using <code className="text-[#ffb000]">pexpect</code> and 
                  a sentinel pattern for stateful execution.
                </p>
              </div>
              <div className="feature-card-ascii">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#666]">├─►</span>
                  <span className="glow-cyan">src/nodes/validator.py</span>
                </div>
                <p className="text-[#888] text-sm pl-6">
                  Deterministic safety gate that validates commands against <code className="text-[#ffb000]">config.yaml</code> policies.
                </p>
              </div>
              <div className="feature-card-ascii">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#666]">└─►</span>
                  <span className="glow-cyan">config.yaml</span>
                </div>
                <p className="text-[#888] text-sm pl-6">
                  Centralized policy for command categorization: 
                  <span className="text-[#33ff33]"> autorun</span>,
                  <span className="text-[#ffb000]"> permission</span>,
                  <span className="text-[#ff3333]"> deny</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section id="demo" className="terminal-section">
          <div className="section-header">
            <span className="text-[#666]">╔══════════════════════════════════════════════════════════════╗</span>
            <div className="text-center glow py-2">▶ LIVE TERMINAL DEMO ◀</div>
            <span className="text-[#666]">╚══════════════════════════════════════════════════════════════╝</span>
          </div>
          
          <div className="p-6 max-w-3xl mx-auto">
            <TerminalDemo />
          </div>
        </section>

        {/* Safety Section */}
        <section id="safety" className="terminal-section bg-black/30">
          <div className="section-header">
            <span className="text-[#666]">╔══════════════════════════════════════════════════════════════╗</span>
            <div className="text-center glow py-2">▶ SAFETY PROTOCOLS ◀</div>
            <span className="text-[#666]">╚══════════════════════════════════════════════════════════════╝</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 p-6">
            <div className="safety-card safe">
              <pre className="text-[#33ff33] text-xs text-center mb-3">{`
┌─────────────────┐
│   ◈ AUTORUN ◈   │
│    SAFE CMDS    │
└─────────────────┘`}</pre>
              <p className="text-[#888] text-sm mb-3 text-center">Auto-executed without confirmation</p>
              <div className="space-y-1 text-xs">
                <div className="cmd-safe">├─ uname -a</div>
                <div className="cmd-safe">├─ df -h</div>
                <div className="cmd-safe">├─ ps aux</div>
                <div className="cmd-safe">└─ docker ps</div>
              </div>
            </div>
            
            <div className="safety-card warning">
              <pre className="text-[#ffb000] text-xs text-center mb-3">{`
┌─────────────────┐
│ ◈ PERMISSION ◈  │
│  NEEDS CONFIRM  │
└─────────────────┘`}</pre>
              <p className="text-[#888] text-sm mb-3 text-center">User approval required</p>
              <div className="space-y-1 text-xs">
                <div className="cmd-warn">├─ systemctl restart</div>
                <div className="cmd-warn">├─ apt update</div>
                <div className="cmd-warn">├─ docker run</div>
                <div className="cmd-warn">└─ tail /var/log/*</div>
              </div>
            </div>
            
            <div className="safety-card danger">
              <pre className="text-[#ff3333] text-xs text-center mb-3">{`
┌─────────────────┐
│  ◈ DENYLIST ◈   │
│    BLOCKED!     │
└─────────────────┘`}</pre>
              <p className="text-[#888] text-sm mb-3 text-center">Never executed</p>
              <div className="space-y-1 text-xs">
                <div className="cmd-danger">├─ rm -rf /</div>
                <div className="cmd-danger">├─ mkfs.ext4 /dev/sda</div>
                <div className="cmd-danger">├─ chmod -R 777 /</div>
                <div className="cmd-danger">└─ {`:(){ :|:& };:`}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section id="install" className="terminal-section">
          <div className="section-header">
            <span className="text-[#666]">╔══════════════════════════════════════════════════════════════╗</span>
            <div className="text-center glow py-2">▶ INSTALLATION GUIDE ◀</div>
            <span className="text-[#666]">╚══════════════════════════════════════════════════════════════╝</span>
          </div>
          
          <div className="p-6 max-w-2xl mx-auto">
            <div className="install-terminal">
              <div className="install-line">
                <span className="text-[#666] text-xs"># 1. Clone the repository</span>
              </div>
              <div className="install-cmd">
                <span className="glow-cyan">$</span>
                <span className="glow">git clone https://github.com/yourusername/arcadmin.git</span>
              </div>
              
              <div className="install-line mt-4">
                <span className="text-[#666] text-xs"># 2. Set up virtual environment</span>
              </div>
              <div className="install-cmd">
                <span className="glow-cyan">$</span>
                <span className="glow">cd arcadmin && python -m venv venv</span>
              </div>
              <div className="install-cmd">
                <span className="glow-cyan">$</span>
                <span className="glow">source venv/bin/activate</span>
              </div>
              
              <div className="install-line mt-4">
                <span className="text-[#666] text-xs"># 3. Install dependencies</span>
              </div>
              <div className="install-cmd">
                <span className="glow-cyan">$</span>
                <span className="glow">pip install -r requirements.txt</span>
              </div>
              
              <div className="install-line mt-4">
                <span className="text-[#666] text-xs"># 4. Configure & run</span>
              </div>
              <div className="install-cmd">
                <span className="glow-cyan">$</span>
                <span className="glow">vim config.yaml && python3 tests/test_executor.py</span>
              </div>
              
              <div className="install-result mt-4">
                <span className="text-[#33ff33]">[OK]</span>
                <span className="text-[#888]"> All tests passed. System ready.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Future Plans Section */}
        <section id="roadmap" className="terminal-section bg-black/30">
          <div className="section-header">
            <span className="text-[#666]">╔══════════════════════════════════════════════════════════════╗</span>
            <div className="text-center glow py-2">▶ DEVELOPMENT ROADMAP ◀</div>
            <span className="text-[#666]">╚══════════════════════════════════════════════════════════════╝</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 p-6">
            <div className="roadmap-item">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#ffb000]">[▓▓▓▓░░░░░░]</span>
                <span className="text-[#ffb000]">40%</span>
              </div>
              <h3 className="glow-amber mb-2">SSH Key Authentication</h3>
              <p className="text-[#888] text-sm">
                Support for SSH key-based authentication for enhanced security.
              </p>
              <div className="mt-2 text-xs">
                <AsciiButton href="#" variant="secondary" size="sm">TRACK PROGRESS</AsciiButton>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#ff33ff]">[▓░░░░░░░░░]</span>
                <span className="text-[#ff33ff]">10%</span>
              </div>
              <h3 className="glow-magenta mb-2">Gemini API Integration</h3>
              <p className="text-[#888] text-sm">
                Integration with Gemini API for autonomous task planning.
              </p>
              <div className="mt-2 text-xs">
                <AsciiButton href="#" variant="cyan" size="sm">VIEW SPEC</AsciiButton>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="terminal-section border-t border-[#1a991a]/30">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <pre className="text-xs glow leading-tight">{`┌─────────────────┐
│    ARCADMIN     │
│    v1.0.0       │
└─────────────────┘`}</pre>
              
              <div className="flex gap-6 text-sm">
                <AsciiLink href="https://github.com/yourusername/arcadmin" variant="cyan">GitHub</AsciiLink>
                <AsciiLink href="#" variant="amber">Docs</AsciiLink>
                <AsciiLink href="#" variant="primary">License</AsciiLink>
              </div>
              
              <div className="text-[#666] text-xs text-center md:text-right">
                <div>Built with Python & SSH</div>
                <div className="mt-1">© 2025 arcadmin</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#1a991a]/20 text-center">
              <code className="text-[#444] text-xs">
                ═══════════════════ SESSION TERMINATED ═══════════════════
              </code>
            </div>
          </div>
        </footer>
      </TerminalFrame>
    </div>
  );
}
