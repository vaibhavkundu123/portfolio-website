import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Github, Linkedin, Mail, Phone, MapPin,
  ChevronRight, Code, Terminal, Database, Cpu,
  BrainCircuit, Smartphone, Globe, Award, Briefcase, GraduationCap, Download, ChevronDown,
  Bot, Sparkles, Send, Loader2, User, Check
} from 'lucide-react';

// --- DATA ---
const PORTFOLIO_DATA = {
  name: "Vaibhav Kundu",
  role: "Machine Learning & Software Developer",
  location: "Kolkata, India",
  email: "vaibhavkundu69@gmail.com",
  phone: "+91-9836026975",
  linkedin: "https://linkedin.com/in/vaibhav-kundu-b074a0240",
  github: "https://github.com/vaibhavkundu123",

  // --- LOCAL FILE PATHS ---
  // Ensure these files are placed inside your project's "public" folder
  profileImage: "/me.jpg",
  resumePath: "/resume.pdf",

  about: "Motivated B.Tech Computer Science student with practical experience in Machine Learning and Deep Learning. Currently a Research Trainee at DRDO (CABS), developing speech processing systems for tactical communications using the NVIDIA NeMo framework and models like MarbleNet and Titanet-L. Proficient in Python, TensorFlow, and PyTorch, with a track record of building predictive models and conducting comparative neural network studies to optimize model accuracy.",
  skills: [
    { category: "Machine Learning & AI", icon: <BrainCircuit size={20} />, items: ["NLP", "TensorFlow", "PyTorch", "Scikit-Learn", "NumPy", "Pandas", "Matplotlib", "OpenCV"] },
    { category: "Programming Languages", icon: <Terminal size={20} />, items: ["Python", "C", "Core Java", "SQL", "PL/SQL"] },
    { category: "App & Web Dev", icon: <Smartphone size={20} />, items: ["Android Studio", "Android Framework (Java)", "Django"] },
    { category: "Core Concepts", icon: <Cpu size={20} />, items: ["Data Structures & Algorithms", "Operating Systems", "Computer Networks", "Linux", "Windows"] }
  ],
  experience: [
    {
      title: "Research Trainee",
      company: "DRDO, Centre for Airborne Systems (CABS)",
      location: "Bengaluru, India",
      period: "Aug 2025 - Feb 2026",
      description: [
        "Developing a Speaker Identification, Diarization, and Voice Conversion system using NVIDIA NeMo framework.",
        "Utilizing advanced models such as MarbleNet, Titanet-L, and MSDD for speech processing tasks."
      ]
    },
    {
      title: "Android Development Intern",
      company: "Sasken Technologies",
      location: "Remote",
      period: "Jun 2025 - Jul 2025",
      description: [
        "Built a School Management App using Java (Android Framework) with modules for student profiles, notices, queries, attendance, and leave tracking.",
        "Enhanced communication channels between students, parents, and administrators."
      ]
    },
    {
      title: "Summer Internship (Research)",
      company: "IEEE Computational Intelligence Society Kolkata Chapter",
      location: "Remote",
      period: "Jun 2025 - Jul 2025",
      description: [
        "Conducted a comparative study between the performances of CNN (Convolutional Neural Network) and ViT (Vision Transformer) on the same dataset."
      ]
    },
    {
      title: "Summer Internship (Data Science)",
      company: "Celebal Technologies",
      location: "Remote",
      period: "May 2025 - Jul 2025",
      description: [
        "Built a Python system to predict student exam scores using Linear Regression.",
        "Utilized Pandas/NumPy for data preparation, Matplotlib for visualization, and Scikit-learn for modeling."
      ]
    },
    {
      title: "Project Intern",
      company: "Infosys Springboard",
      location: "Remote",
      period: "Oct 2024 - Dec 2024",
      description: [
        "Built a machine learning model to detect patient diseases based on symptoms and biological parameters.",
        "Tech Stack Used: Machine Learning, Python, Django."
      ]
    }
  ],
  education: [
    {
      degree: "B. Tech in Computer Science & Engineering",
      institution: "Netaji Subhas Engineering College",
      location: "Kolkata, India",
      period: "2022 - 2026",
      score: "CGPA: 7.49 (avg.)",
      extras: "Vice President, GNX (Official GNU/Linux group and open-source community of NSEC)"
    },
    {
      degree: "Class XII (CBSE)",
      institution: "South Point High School",
      location: "Kolkata, India",
      period: "2022",
      score: "Percentage: 70.4%"
    },
    {
      degree: "Class X (CBSE)",
      institution: "South Point High School",
      location: "Kolkata, India",
      period: "2020",
      score: "Percentage: 90.8%"
    }
  ]
};

// --- API & UTILS ---
const PORTFOLIO_CONTEXT = JSON.stringify({
  ...PORTFOLIO_DATA,
  skills: PORTFOLIO_DATA.skills.map(s => ({ category: s.category, items: s.items }))
});

const callGemini = async (prompt, systemInstruction) => {
  const apiKey = "AIzaSyCcaVzryEL5pb4UbzoeFA2bLJ0qihQaBnc";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  const delays = [1000, 2000, 4000, 8000, 16000];

  for (let i = 0; i < delays.length + 1; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    } catch (error) {
      if (i === delays.length) return "I'm experiencing high traffic. Please try again later!";
      await new Promise(resolve => setTimeout(resolve, delays[i]));
    }
  }
};

const copyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

// --- COMPONENTS ---

const Navbar = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ['Home', 'About', 'Skills', 'Experience', 'Education', 'Contact'];

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full z-50 top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('home')}>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {'<Vaibhav Kundu/>'}
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-cyan-400
                    ${activeSection === link.toLowerCase() ? 'text-cyan-400' : 'text-slate-300'}`}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-400 hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-in slide-in-from-top">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(link)}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium 
                  ${activeSection === link.toLowerCase() ? 'text-cyan-400 bg-slate-800' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const typingSpeed = 100;

  const roles = ["Machine Learning Enthusiast", "Research Trainee @ DRDO", "Android Developer", "Computer Science Student"];

  useEffect(() => {
    let ticker = setInterval(() => {
      let i = loopNum % roles.length;
      let fullText = roles[i];
      let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
      setText(updatedText);
      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    }, isDeleting ? typingSpeed / 2 : typingSpeed);
    return () => clearInterval(ticker);
  }, [text, isDeleting, loopNum]);

  const handleEmailClick = () => {
    copyToClipboard(PORTFOLIO_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #06b6d4 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950 z-0"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <p className="text-cyan-400 font-mono text-lg tracking-wide">Hi there, I am</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">Vaibhav Kundu</h1>
            <div className="h-12 flex items-center justify-center lg:justify-start text-xl sm:text-2xl text-slate-300 font-light">
              <span>I am a <span className="text-cyan-400 font-semibold">{text}</span><span className="animate-pulse">|</span></span>
            </div>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Computer Science student and AI researcher specializing in predictive models and deep learning. Currently building tactical speech processing systems at DRDO.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 w-full sm:w-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25">Get In Touch</button>
            <button onClick={() => window.open(PORTFOLIO_DATA.resumePath, '_blank')} className="px-8 py-3 w-full sm:w-auto rounded-full border border-cyan-500 text-cyan-400 font-medium hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2">
              <Download size={18} /> Download Resume
            </button>
            <div className="flex items-center gap-4">
              <a href={PORTFOLIO_DATA.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"><Linkedin size={20} /></a>
              <a href={PORTFOLIO_DATA.github} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"><Github size={20} /></a>
              <div className="relative group/email">
                <button onClick={handleEmailClick} className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors">
                  {copied ? <Check size={20} className="text-green-400" /> : <Mail size={20} />}
                </button>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/email:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">
                  {copied ? 'Copied!' : 'Copy Email'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-4 border-2 border-slate-800 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-8 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border border-slate-700 shadow-2xl group">
              {!imageError ? (
                <img
                  src={PORTFOLIO_DATA.profileImage}
                  alt=""
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                  <User size={80} strokeWidth={1} />
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">Upload Photo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer text-slate-400 hover:text-cyan-400 transition-colors group z-20">
        <ChevronDown size={24} className="animate-bounce" />
      </div>
    </section>
  );
};

// ... (Rest of components: About, Skills, Experience, Education, Contact, ChatAssistant, App remain same)
// Truncating for brevity - ensure they are in your local file.
// ...

const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-12">
    <div className="flex items-center gap-4 mb-2">
      <div className="h-[1px] w-12 bg-cyan-500"></div>
      <h2 className="text-3xl sm:text-4xl font-bold text-white">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-400 ml-16">{subtitle}</p>}
  </div>
);

const About = () => (
  <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
    <div className="max-w-7xl mx-auto">
      <SectionHeading title="About Me" subtitle="Get to know me better" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        <div className="flex justify-center">
          <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 group bg-slate-800 flex items-center justify-center border border-slate-700">
            <BrainCircuit size={80} className="text-slate-600" />
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-2xl font-semibold text-slate-200">Transforming Ideas into <span className="text-cyan-400">Intelligent Systems</span></h3>
          <p className="text-slate-400 text-lg leading-relaxed">{PORTFOLIO_DATA.about}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 text-slate-300"><MapPin className="text-cyan-500" size={20} /><span>{PORTFOLIO_DATA.location}</span></div>
            <div className="flex items-center gap-3 text-slate-300"><GraduationCap className="text-cyan-500" size={20} /><span>B.Tech CSE (2022-2026)</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Skills = () => (
  <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
    <div className="max-w-7xl mx-auto">
      <SectionHeading title="Technical Skills" subtitle="My toolkit and technologies" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PORTFOLIO_DATA.skills.map((skillGroup, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-slate-800 rounded-lg text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">{skillGroup.icon}</div>
              <h3 className="text-lg font-semibold text-white">{skillGroup.category}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((skill, sIdx) => (
                <span key={sIdx} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full border border-slate-700/50 hover:bg-slate-700 transition-colors">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Experience = () => (
  <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
    <div className="max-w-7xl mx-auto">
      <SectionHeading title="Experience" subtitle="My professional journey" />
      <div className="relative border-l border-slate-800 ml-4 md:ml-0 md:pl-8 space-y-12">
        {PORTFOLIO_DATA.experience.map((exp, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-[21px] md:-left-[41px] top-1 h-4 w-4 rounded-full bg-slate-800 border-2 border-cyan-500 group-hover:bg-cyan-500 transition-colors z-10"></div>
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-4">
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{exp.title}</h3>
              <span className="text-sm font-medium text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full">{exp.period}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/5 transition-all">
              <div className="flex items-center gap-2 mb-4 text-slate-300 font-medium"><Briefcase size={18} className="text-slate-500" /><span>{exp.company}</span></div>
              <ul className="space-y-3">
                {exp.description.map((desc, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-3 text-slate-400"><ChevronRight size={18} className="text-cyan-500 flex-shrink-0 mt-0.5" /><span>{desc}</span></li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Education = () => (
  <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
    <div className="max-w-7xl mx-auto">
      <SectionHeading title="Education" subtitle="My academic background" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PORTFOLIO_DATA.education.map((edu, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-blue-500/30 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all duration-500"><GraduationCap size={100} className="text-cyan-500" /></div>
            <div className="relative z-10">
              <span className="text-cyan-400 font-mono text-sm mb-2 block">{edu.period}</span>
              <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
              <h4 className="text-lg text-slate-300 mb-4">{edu.institution}</h4>
              <div className="flex items-center gap-2 mb-4"><Award size={18} className="text-yellow-500" /><span className="font-semibold text-slate-200">{edu.score}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => {
  const [jdText, setJdText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [showJdInput, setShowJdInput] = useState(false);
  const [status, setStatus] = useState('IDLE');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [emailCopied, setEmailCopied] = useState(false);

  // REPLACE THIS WITH YOUR FORMSPREE ID FROM https://formspree.io/
  const FORMSPREE_ID = "mwvnrpog";

  const handleDraftPitch = async () => {
    if (!jdText.trim()) return;
    setIsDrafting(true);
    const system = `You are Vaibhav Kundu, a Machine Learning developer. Draft a 2-paragraph professional pitch for this JD based on his profile: ${PORTFOLIO_CONTEXT}.`;
    const res = await callGemini(jdText, system);
    setMessageText(res);
    setIsDrafting(false);
    setShowJdInput(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus('SENDING');
    if (!FORMSPREE_ID || FORMSPREE_ID === "YOUR_ID_HERE") {
      setTimeout(() => setStatus('SUCCESS'), 1500);
      return;
    }
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, message: messageText })
      });
      if (response.ok) {
        setStatus('SUCCESS');
        setFormData({ name: '', email: '' });
        setMessageText('');
      } else setStatus('ERROR');
    } catch { setStatus('ERROR'); }
  };

  if (status === 'SUCCESS') return (
    <section id="contact" className="py-20 px-4 bg-slate-900"><div className="max-w-3xl mx-auto text-center bg-slate-950 border border-cyan-500/30 rounded-2xl p-12 animate-in zoom-in">
      <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={40} /></div>
      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
      <p className="text-slate-400 mb-8">Thanks for reaching out! Vaibhav will get back to you soon.</p>
      <button onClick={() => setStatus('IDLE')} className="text-cyan-400 font-medium hover:underline">Send another message</button>
    </div></section>
  );

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Get In Touch" subtitle="Let's build something together" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div onClick={() => { copyToClipboard(PORTFOLIO_DATA.email); setEmailCopied(true); setTimeout(() => setEmailCopied(false), 2000); }} className="flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer group">
            <div className={`p-4 rounded-full mb-4 ${emailCopied ? 'bg-green-500/20 text-green-400' : 'bg-slate-900 text-cyan-400'}`}>{emailCopied ? <Check size={32} /> : <Mail size={32} />}</div>
            <h3 className="text-lg font-semibold text-white">{emailCopied ? 'Copied!' : 'Email'}</h3>
            <p className="text-slate-400 text-center text-xs break-all mt-2">{PORTFOLIO_DATA.email}</p>
          </div>
          <a href={PORTFOLIO_DATA.linkedin} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-all group">
            <div className="p-4 bg-slate-900 text-cyan-400 rounded-full mb-4"><Linkedin size={32} /></div>
            <h3 className="text-lg font-semibold text-white">LinkedIn</h3>
          </a>
          <a href={PORTFOLIO_DATA.github} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-all group">
            <div className="p-4 bg-slate-900 text-cyan-400 rounded-full mb-4"><Github size={32} /></div>
            <h3 className="text-lg font-semibold text-white">GitHub</h3>
          </a>
          <div className="flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-xl cursor-default">
            <div className="p-4 bg-slate-900 text-cyan-400 rounded-full mb-4"><Phone size={32} /></div>
            <h3 className="text-lg font-semibold text-white">Phone</h3>
            <p className="text-slate-400 mt-2">{PORTFOLIO_DATA.phone}</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-8">
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors" placeholder="Your Name" />
              <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors" placeholder="Your Email" />
            </div>
            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4">
              <button type="button" onClick={() => setShowJdInput(!showJdInput)} className="flex items-center gap-2 text-cyan-400 text-sm font-medium"><Sparkles size={16} /> recruiter? Auto-draft a pitch from JD</button>
              {showJdInput && <div className="mt-4 space-y-3"><textarea rows={3} value={jdText} onChange={(e) => setJdText(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white text-sm outline-none" placeholder="Paste JD here..."></textarea><button type="button" onClick={handleDraftPitch} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-cyan-400 rounded-lg text-sm">{isDrafting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Draft Pitch</button></div>}
            </div>
            <textarea required rows={6} value={messageText} onChange={(e) => setMessageText(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none" placeholder="Your Message..."></textarea>
            <button disabled={status === 'SENDING'} className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium flex items-center justify-center gap-3 disabled:opacity-70">{status === 'SENDING' ? <Loader2 className="animate-spin" /> : <Send size={18} />} Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: "Hi! I'm Vaibhav's AI Assistant ✨. Ask me about his work or projects!" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setIsTyping(true);
    const system = `You represent Vaibhav Kundu. Base answers strictly on: ${PORTFOLIO_CONTEXT}. Be professional. Contact: ${PORTFOLIO_DATA.email}`;
    const reply = await callGemini(msg, system);
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden flex flex-col h-[450px]">
        <div className="bg-slate-800 px-4 py-3 flex justify-between items-center text-white"><div className="flex items-center gap-2"><Bot size={18} /><span>AI Assistant</span></div><button onClick={() => setIsOpen(false)}><X size={20} /></button></div>
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950/50 space-y-4">
          {messages.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{m.text}</div></div>)}
          {isTyping && <div className="flex justify-start"><div className="bg-slate-800 rounded-2xl px-4 py-2 text-slate-400">Typing...</div></div>}
          <div ref={endRef} />
        </div>
        <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2"><input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask something..." className="flex-1 bg-slate-950 text-white text-sm px-3 rounded-full outline-none" /><button onClick={handleSend} className="bg-cyan-500 p-2 rounded-full"><Send size={14} /></button></div>
      </div>}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-lg"><Sparkles size={24} /></button>
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'experience', 'education', 'contact'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el && el.offsetTop <= window.scrollY + 100 && el.offsetTop + el.offsetHeight > window.scrollY + 100) {
          setActiveSection(s); break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans">
      <Navbar activeSection={activeSection} />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Contact />
      <ChatAssistant />
      <footer className="bg-slate-950 py-8 border-t border-slate-800 text-center"><p className="text-slate-400">© 2026 Vaibhav Kundu. Built with React & Tailwind.</p></footer>
      <style>{`html { scroll-behavior: smooth; }`}</style>
    </div>
  );
}