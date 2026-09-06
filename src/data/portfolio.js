export const PORTFOLIO = {
  about: {
    accent: "#3ecf8e",
    accentColor: 0x3ecf8e,
    eyebrow: "BUILDING 01 / ABOUT",
    title: "About Me",
    fullName: "GAURAV KUMAR SINGH",
    email: "gauravsingh02195@gmail.com",
    phone: "+91 6388474535",
    location: "India",
    github: "https://github.com/gaurav01singh",
    linkedin: "https://linkedin.com/in/gaurav10singh",
    role: "Creative Technologist & Unity Game Developer",
    summary:
      "Creative Technologist and Unity game developer crafting games with Unity & C#, high-speed interactive Canvas/PixiJS web experiences, and desktop apps with Electron.js & Node.js.",
    quotes: [
      "Welcome to my studio! I build games in Unity and real-time apps with PixiJS!",
      "Ctrl+S is my daily love language.",
      "99 bugs in the code, fix 1... 127 bugs in the code!",
      "Check out the Battlestation and Bookshelf to explore my work!",
    ],
    html: `
      <p>Hi, I'm <strong>Gaurav Kumar Singh</strong> — a Creative Technologist and Unity game
      developer from India. I like building things that respond: interactive scenes, real-time
      gameplay systems, and full-stack apps that feel alive.</p><p>I currently work at <strong>Binaire Pvt. Ltd.</strong> as a Creative Technologist, crafting games with Unity and C# and
      desktop apps, interactive experiences with Electron.js, Node.js and PixiJS — and this very
      portfolio is a small tribute to that. Before that I shipped multiple Unity titles at
      <strong>Qwcodes</strong> and built backend systems as an intern at
      <strong>VidyaInterna Hub</strong>.</p><p>I graduated with a <strong>B.Tech in Computer Science &amp; Engineering</strong> from
      Dr. A.P.J Abdul Kalam Technical University in 2025, and I care about problem solving,
      adaptability, and shipping things that work smoothly under real players' hands.</p>
    `,
  },

  skills: {
    accent: "#ffb347",
    accentColor: 0xffb347,
    eyebrow: "BUILDING 02 / SKILLS",
    title: "Skills Summary",
    groups: [
      {
        category: "Languages",
        color: 0x00f2fe,
        nodes: [
          {
            name: "C#",
            desc: "Primary language for Unity gameplay scripting, physics loops, component architecture, state machines, and performance-critical game code.",
          },
          {
            name: "JavaScript",
            desc: "Modern ES6+, PixiJS 2D canvas rendering, event pipelines, async loops, full-stack microservices, and Node.js toolchains.",
          },
        ],
      },
      {
        category: "Technologies & Tools",
        color: 0x4facfe,
        nodes: [
          {
            name: "Unity Engine",
            desc: "Physics simulation, UI Toolkit, animation blending, 2D/3D gameplay mechanics, particle VFX, audio triggers, and mobile/desktop builds.",
          },
          {
            name: "PixiJS",
            desc: "Hardware-accelerated 2D WebGL/WebGPU graphics, particle containers, scene graphs, custom shaders, and interactive canvas worlds.",
          },
          {
            name: "Node.js",
            desc: "Scalable async runtime, event loops, RESTful microservices, WebSocket channels, file system streams, and build tooling.",
          },
          {
            name: "Socket.io",
            desc: "Bidirectional event broadcasting, room partitioning, real-time multiplayer state synchronization, and low-latency packet streaming.",
          },
          {
            name: "Express",
            desc: "Modular REST routing, middleware pipelines, JWT auth protection, error interceptors, and CORS configuration.",
          },
          {
            name: "GitHub",
            desc: "Git branching workflows, CI/CD automated test pipelines, release tagging, merge reviews, and open-source contribution tracking.",
          },
          {
            name: "RESTful APIs",
            desc: "Structured HTTP endpoint design, payload compression, pagination, status contracts, and rate limiting.",
          },
          {
            name: "TransformerJS",
            desc: "On-device neural network embeddings, tokenizer pipelines, local inference models, and real-time browser text processing.",
          },
        ],
      },
      {
        category: "Web Server & Databases",
        color: 0x38bdf8,
        nodes: [
          {
            name: "MongoDB",
            desc: "NoSQL document schema modeling, aggregation pipelines, compound indexing strategies, and high-throughput read/write operations.",
          },
        ],
      },
      {
        category: "Frameworks",
        color: 0x9775fa,
        nodes: [
          {
            name: "React.js",
            desc: "Component lifecycle management, custom hooks, atomic state management, virtual DOM reconciliation, and responsive layouts.",
          },
          {
            name: "ElectronJS",
            desc: "Cross-platform desktop native apps, IPC communication channels, native window framing, hardware access, and offline caching.",
          },
        ],
      },
      {
        category: "Soft Skills",
        color: 0x51cf66,
        nodes: [
          {
            name: "Problem Solving",
            desc: "Algorithmic thinking, diagnosing frame-rate bottlenecks, memory leak tracing, and breaking complex game loops into clean systems.",
          },
          {
            name: "Adaptability",
            desc: "Rapid onboarding onto unfamiliar game engines, native SDKs, emerging WebGPU standards, and modern frontend paradigms.",
          },
          {
            name: "Communication",
            desc: "Cross-functional synchronization between game designers, 3D artists, sound engineers, and backend teams in agile sprints.",
          },
          {
            name: "Decision-Making",
            desc: "Pragmatic technical trade-offs between delivery velocity, architectural scalability, rendering fidelity, and mobile hardware constraints.",
          },
        ],
      },
    ],
    html: `
      <h3>Languages</h3><div><span class="tag">C#</span><span class="tag">JavaScript</span></div>
      <h3>Technologies &amp; Tools</h3><div><span class="tag">Unity Engine</span><span class="tag">PixiJS</span><span class="tag">Node.js</span><span class="tag">Socket.io</span><span class="tag">Express</span><span class="tag">GitHub</span><span class="tag">RESTful APIs</span><span class="tag">TransformerJS</span></div>
      <h3>Web Server &amp; Databases</h3><div><span class="tag">MongoDB</span></div>
      <h3>Frameworks</h3><div><span class="tag">React.js</span><span class="tag">ElectronJS</span></div>
      <h3>Soft Skills</h3><div><span class="tag">Problem Solving</span><span class="tag">Adaptability</span><span class="tag">Communication</span><span class="tag">Decision-Making</span></div>
    `,
  },

  experience: {
    accent: "#ff6b6b",
    accentColor: 0xff6b6b,
    eyebrow: "BUILDING 03 / EXPERIENCE",
    title: "Work Experience / Internship",
    jobs: [
      {
        role: "Creative Technologist",
        company: "Binaire Pvt. Ltd.",
        tech: "Unity Game Engine, JavaScript",
        period: "Dec 2025 – Present",
        status: "CURRENT ROLE",
        color: 0x3ecf8e,
        bullets: [
          "Develop and maintain interactive applications using JavaScript technologies, including Electron.js, Node.js, PixiJS, and Vanilla JavaScript. Design and implement desktop applications and real-time interactive experiences, ensuring high performance and scalability.",
          "Contribute to game development projects in Unity, specializing in scripting, UI implementation, visual effects (VFX), sound effects (SFX), and gameplay systems. Played a key role in developing a pinball game using the Visual Pinball Engine, implementing game mechanics, scoring systems, and user interface elements.",
          "Optimized game performance by improving scripts, reducing resource usage, and enhancing overall gameplay responsiveness across target platforms.",
        ],
        stack: [
          "Unity Game Engine",
          "JavaScript",
          "Electron.js",
          "Node.js",
          "PixiJS",
          "Visual Pinball Engine",
          "VFX & SFX",
        ],
      },
      {
        role: "Unity Game Developer",
        company: "Qwcodes",
        tech: "Unity Game Engine",
        period: "Jan 2025 – Dec 2025",
        status: "SHIPPED TITLES",
        color: 0x4dabf7,
        bullets: [
          "Developed and maintained multiple Unity games, including Bubble Shooter, Ludo, and QuickJack, using C# and Unity Engine. Designed and implemented responsive user interfaces using Unity UI Toolkit, improving usability and player experience.",
          "Built core gameplay systems, game mechanics, scoring systems, level progression, and game state management.",
          "Integrated animations, audio effects, and visual feedback to create engaging gameplay experiences.",
        ],
        stack: [
          "Unity Game Engine",
          "C#",
          "Unity UI Toolkit",
          "Game Mechanics",
          "Level Progression",
          "State Management",
        ],
      },
      {
        role: "Backend Developer Intern",
        company: "VidyaInterna Hub",
        tech: "JavaScript",
        period: "Apr 2025 – Jul 2025",
        status: "INTERNSHIP",
        color: 0xffa94d,
        bullets: [
          "Developing backend APIs for Sports Management using Node.js and Express.js for scalable applications.",
          "Designing database schemas and handling data transactions with MongoDB.",
          "Ensuring code quality, debugging issues, and performing unit testing.",
          "Collaborating with frontend developers to integrate APIs and enhance functionality.",
        ],
        stack: [
          "JavaScript",
          "Node.js",
          "Express.js",
          "MongoDB",
          "REST APIs",
          "Unit Testing",
        ],
      },
    ],
    html: `
      <div class="job">
        <div class="job-meta">Creative Technologist — Binaire Pvt. Ltd. (Unity Game Engine, JavaScript) · Dec 2025 – Present</div>
        <ul>
          <li>Develop and maintain interactive applications using JavaScript technologies, including Electron.js, Node.js, PixiJS, and Vanilla JavaScript. Design and implement desktop applications and real-time interactive experiences, ensuring high performance and scalability.</li>
          <li>Contribute to game development projects in Unity, specializing in scripting, UI implementation, visual effects (VFX), sound effects (SFX), and gameplay systems. Played a key role in developing a pinball game using the Visual Pinball Engine, implementing game mechanics, scoring systems, and user interface elements.</li>
          <li>Optimized game performance by improving scripts, reducing resource usage, and enhancing overall gameplay responsiveness across target platforms.</li>
        </ul>
      </div>
      <div class="job">
        <div class="job-meta">Unity Game Developer — Qwcodes (Unity Game Engine) · Jan 2025 – Dec 2025</div>
        <ul>
          <li>Developed and maintained multiple Unity games, including Bubble Shooter, Ludo, and QuickJack, using C# and Unity Engine. Designed and implemented responsive user interfaces using Unity UI Toolkit, improving usability and player experience.</li>
          <li>Built core gameplay systems, game mechanics, scoring systems, level progression, and game state management. Integrated animations, audio effects, and visual feedback to create engaging gameplay experiences.</li>
        </ul>
      </div>
      <div class="job">
        <div class="job-meta">Backend Developer Intern — VidyaInterna Hub (JavaScript) · Apr 2025 – Jul 2025</div>
        <ul>
          <li>Developing backend APIs for Sports Management using Node.js and Express.js for scalable applications.</li>
          <li>Designing database schemas and handling data transactions with MongoDB.</li>
          <li>Ensuring code quality, debugging issues, and performing unit testing.</li>
          <li>Collaborating with frontend developers to integrate APIs and enhance functionality.</li>
        </ul>
      </div>
    `,
  },

  education: {
    accent: "#9775fa",
    accentColor: 0x9775fa,
    eyebrow: "BUILDING 04 / EDUCATION",
    title: "Education",
    degree: {
      title: "B.Tech in Computer Science and Engineering",
      university: "Dr. A.P.J Abdul Kalam Technical University",
      period: "Oct 2021 – Jun 2025",
      score: "CGPA: 7/10",
      desc: "Four-year engineering degree covering fundamental and applied Computer Science topics, Object-Oriented systems, database modeling, and real-time computation.",
    },
    coursework: [
      {
        name: "OOP",
        tag: "CORE",
        desc: "Object-Oriented Programming: C# scripting, state machines, inheritance, and component architecture.",
      },
      {
        name: "DBMS",
        tag: "DATA",
        desc: "Database Management Systems: document modeling, indexing, and transactional data integrity.",
      },
      {
        name: "DSA",
        tag: "LOGIC",
        desc: "Data Structures & Algorithms: tree search, spatial hashing, sorting, and algorithmic complexity.",
      },
      {
        name: "OS",
        tag: "SYSTEM",
        desc: "Operating Systems: memory management, concurrency, asynchronous threads, and event loops.",
      },
      {
        name: "Machine Learning",
        tag: "AI",
        desc: "Machine Learning: neural networks, embeddings, classifiers, and on-device TransformerJS inference.",
      },
      {
        name: "Statistics",
        tag: "MATH",
        desc: "Applied Statistics: probability matrices, random distributions, and procedural algorithms.",
      },
    ],
    certificates: [
      {
        title: "Backend Developer Intern",
        issuer: "VidyaInterna Hub",
        period: "Completed Jul 2025",
        color: 0x4dabf7,
        desc: "Backend API development with Node.js and Express.js, MongoDB schema design, and unit testing.",
      },
      {
        title: "CSRBOX Web Dev Internship",
        issuer: "IBM SkillsBuild",
        period: "Completed 2024",
        color: 0x20c997,
        desc: "Responsive web architectures, modern JavaScript standards, and agile sprint workflows.",
      },
    ],
    html: `
      <div class="job">
        <div class="job-meta">Dr. A.P.J Abdul Kalam Technical University · Oct 2021 – Jun 2025</div>
        <p><strong>B.Tech in Computer Science and Engineering</strong> — CGPA 7/10</p>
        <p>Coursework: OOP, DBMS, DSA, OS, Machine Learning, Statistics</p>
      </div>
      <h3>Certificates</h3>
      <ul>
        <li>Backend Developer Intern — VidyaInterna Hub</li>
        <li>CSRBOX Web Dev Internship — IBM SkillsBuild</li>
      </ul>
    `,
  },

  projects: {
    accent: "#4dabf7",
    accentColor: 0x4dabf7,
    eyebrow: "BUILDING 05 / PROJECTS",
    title: "Projects",
    list: [
      {
        id: "flappy",
        title: "Flappy Bird Clone",
        engine: "UNITY",
        type: "2D ARCADE",
        color: 0x38bdf8,
        thumbnail: "./assets/projects/flappy-1.jpg",
        images: [
          {
            url: "./assets/projects/flappy-1.jpg",
            title: "Arcade Gameplay & Obstacle Physics",
            desc: "2D physics loop with responsive flap impulse, procedural pipe obstacle spawning, and dynamic score counter.",
          },
          {
            url: "./assets/projects/flappy-2.jpg",
            title: "Game Over & Scorecard Summary",
            desc: "State machine managing session score preservation, high score tracking, and instant replay flow.",
          },
          {
            url: "./assets/projects/flappy-3.jpg",
            title: "Unity 2D Engine Scene & Inspector",
            desc: "Custom C# BirdController script, Rigidbody2D dynamics, BoxCollider2D trigger collision detection.",
          },
        ],
        bullets: [
          "Developed a 2D arcade game using Unity and C#. Applied game state management and responsive UI elements.",
          "Implemented player movement, procedural obstacle spawning, collision detection, and score tracking.",
        ],
        stack: [
          "Unity",
          "C#",
          "2D Arcade",
          "Game State Management",
          "Collision Detection",
        ],
        link: "https://drive.google.com/file/d/1aHkJ2WIhmZGJHG494k8GRelss0mC-KZR/view",
      },
      {
        id: "runner",
        title: "Endless Runner Game",
        engine: "UNITY",
        type: "3D CASUAL",
        color: 0xf59e0b,
        thumbnail: "./assets/projects/runner-1.jpg",
        images: [
          {
            url: "./assets/projects/runner-1.jpg",
            title: "Cyberpunk 3D Runner Gameplay",
            desc: "Third-person character runner dodging laser barricades, speed booster tracks, and collecting golden energy rings.",
          },
          {
            url: "./assets/projects/runner-2.jpg",
            title: "City Highway & Magnet Powerups",
            desc: "Dynamic highway level progression, speed multiplier combos, and active magnetic coin attraction system.",
          },
          {
            url: "./assets/projects/runner-3.jpg",
            title: "Unity 3D Project Architecture",
            desc: "ObstacleSpawner algorithms, procedural highway tile instantiation, and optimized mesh rendering.",
          },
        ],
        bullets: [
          "Created an endless runner game with dynamic obstacle generation and scoring mechanics.",
          "Developed player controls, collision systems, and gameplay progression features.",
          "Optimized gameplay performance for smooth user experience.",
        ],
        stack: [
          "Unity",
          "C#",
          "Dynamic Generation",
          "Scoring Mechanics",
          "Player Controls",
        ],
        link: "https://drive.google.com/file/d/1Ppux3KMu1sIIGbDCrNfjpsIw1LQ0oIpW/view",
      },
      {
        id: "procedural-modular-dungeon-generator",
        title: "Procedural Modular Dungeon Generator",
        engine: "UNITY",
        type: "PROCEDURAL 3D",
        color: 0x06b6d4,
        thumbnail: "./assets/projects/DungeonGenerator-2.png",
        images: [
          {
            url: "./assets/projects/DungeonGenerator-1.png",
            title: "Command Hub & Terminal Interior",
            desc: "Specialized modular room placement featuring interior workstations, control terminals, and branching doorway connections.",
          },
          {
            url: "./assets/projects/DungeonGenerator-2.png",
            title: "Atmospheric Corridor Lighting & Architecture",
            desc: "Emissive lighting bands, modular structural framing, and room transition thresholds maintained across dynamically generated paths.",
          },
          {
            url: "./assets/projects/DungeonGenerator-3.png",
            title: "Sci-Fi Corridor Traversal & Navigation",
            desc: "Third-person character traversal through seamlessly connected modular corridor sections, octagonal bulkheads, and atmospheric windows.",
          },
          {
            url: "./assets/projects/DungeonGenerator-4.png",
            title: "Modular Dungeon Layout & Generation Graph",
            desc: "Top-down 3D scene view of dynamically connected modular rooms and corridors generated via connection points, collision checking, and end caps.",
          },
        ],
        bullets: [
          "Developed a procedural dungeon generation system in Unity using C# to assemble connected layouts dynamically from modular rooms and corridors.",
          "Implemented connection-point based assembly, weighted module selection, and collision/overlap validation to prevent invalid room placements.",
          "Engineered an intelligent backtracking system that removes blocked modules and explores alternative paths when generation gets stuck.",
          "Built seed-based generation, room constraints, final room and end-cap placement, and interactive debug visualization for generation steps.",
        ],
        stack: [
          "Unity",
          "C#",
          "Procedural Generation",
          "Backtracking",
          "Modular Level Design",
          "Collision Validation",
          "Seed Generation",
        ],
        link: "https://youtu.be/7esCA1aaDPA",
      },
      {
        id: "tutorial",
        title: "Tutorial Haven",
        engine: "MERN",
        type: "COMMUNITY PLATFORM",
        color: 0xa855f7,
        thumbnail: "./assets/projects/tutorial-1.jpg",
        images: [
          {
            url: "./assets/projects/tutorial-1.jpg",
            title: "Community Tutorial Feed & Filter",
            desc: "Interactive feed of developer tutorials with search filters, technology tags (React, Node.js, Unity), and reading stats.",
          },
          {
            url: "./assets/projects/tutorial-2.jpg",
            title: "Real-Time Markdown Editor",
            desc: "Split-screen content creation suite with syntax highlighting, live preview formatting, and instant asset embedding.",
          },
          {
            url: "./assets/projects/tutorial-3.jpg",
            title: "Interactive Article & Code Playground",
            desc: "In-browser JavaScript playground execution, threaded developer comments, and JWT authenticated profile system.",
          },
        ],
        bullets: [
          "Developed a scalable tutorial-sharing platform using the MERN stack. Integrated a Markdown editor for content creation and formatting.",
          "Implemented JWT-based authentication and bcrypt password encryption. Designed REST APIs and database schemas for efficient content management.",
        ],
        stack: [
          "MongoDB",
          "Express.js",
          "React.js",
          "Node.js",
          "JWT Auth",
          "Markdown Editor",
        ],
        link: "https://tutorial-haven-theta.vercel.app/",
      },
      {
        id: "ecommerce",
        title: "Full-Stack E-Commerce Platform",
        engine: "MERN",
        type: "MARKETPLACE",
        color: 0x10b981,
        thumbnail: "./assets/projects/ecommerce-1.jpg",
        images: [
          {
            url: "./assets/projects/ecommerce-1.jpg",
            title: "Hardware & Tech Storefront",
            desc: "Dynamic product catalog with multi-facet category filters, real-time price sliders, and star rating analytics.",
          },
          {
            url: "./assets/projects/ecommerce-2.jpg",
            title: "Interactive Product Showcase",
            desc: "Multi-image thumbnail gallery, custom switch selectors, interactive specifications matrix, and shopping cart drawer.",
          },
          {
            url: "./assets/projects/ecommerce-3.jpg",
            title: "Secure Braintree Checkout Flow",
            desc: "End-to-end encrypted payment processing, coupon code validator, order tax calculation, and order tracking.",
          },
        ],
        bullets: [
          "Built a full-stack e-commerce application using MongoDB, Express.js, React, and Node.js.",
          "Developed RESTful APIs for product, user, and order management.",
          "Integrated Braintree payment gateway for secure online transactions. Implemented authentication, authorization, and admin management features.",
        ],
        stack: [
          "MongoDB",
          "Express.js",
          "React.js",
          "Node.js",
          "Braintree",
          "Auth & Admin",
        ],
        link: "https://shopyshop-theta.vercel.app/",
      },
    ],
    html: `
      <div class="job">
        <div class="job-meta">Procedural Modular Dungeon Generator (Unity)</div>
        <ul>
          <li>Developed a procedural dungeon generation system in Unity using C# to dynamically assemble modular rooms and corridors.</li>
          <li>Implemented connection-point based generation, weighted module selection, collision/overlap validation, and backtracking to handle failed generation paths.</li>
          <li>Created seed-based generation, room constraints, final room and end-cap placement, and real-time generation visualization/debugging.</li>
        </ul>
      </div>
      <div class="job">
        <div class="job-meta">Flappy Bird Clone (Unity)</div>
        <ul>
          <li>Developed a 2D arcade game using Unity and C#. Applied game state management and responsive UI elements.</li>
          <li>Implemented player movement, procedural obstacle spawning, collision detection, and score tracking.</li>
        </ul>
      </div>
      <div class="job">
        <div class="job-meta">Endless Runner Game (Unity)</div>
        <ul>
          <li>Created an endless runner game with dynamic obstacle generation and scoring mechanics.</li>
          <li>Developed player controls, collision systems, and gameplay progression features.</li>
          <li>Optimized gameplay performance for smooth user experience.</li>
        </ul>
      </div>
      <div class="job">
        <div class="job-meta">Full-Stack E-commerce Platform (MERN)</div>
        <ul>
          <li>Built a full-stack e-commerce application using MongoDB, Express.js, React, and Node.js.</li>
          <li>Developed RESTful APIs for product, user, and order management.</li>
          <li>Integrated Braintree payment gateway for secure online transactions. Implemented authentication, authorization, and admin management features.</li>
        </ul>
      </div>
      <div class="job">
        <div class="job-meta">Tutorial Haven (MERN)</div>
        <ul>
          <li>Developed a scalable tutorial-sharing platform using the MERN stack. Integrated a Markdown editor for content creation and formatting.</li>
          <li>Implemented JWT-based authentication and bcrypt password encryption. Designed REST APIs and database schemas for efficient content management.</li>
        </ul>
      </div>
    `,
  },

  contact: {
    accent: "#f783ac",
    accentColor: 0xff8fab,
    eyebrow: "BUILDING 06 / CONTACT",
    title: "Let's Talk",
    fullName: "GAURAV KUMAR SINGH",
    email: "gauravsingh02195@gmail.com",
    phone: "+91 6388474535",
    location: "India",
    socials: [
      {
        name: "GitHub",
        handle: "Gaurav-Singh-02",
        url: "https://github.com/gaurav01singh",
      },
      {
        name: "LinkedIn",
        handle: "gauravsingh02",
        url: "https://linkedin.com/in/gaurav10singh",
      },
    ],
    html: `
      <div class="contact-row">Email: gauravsingh02195@gmail.com</div>
      <div class="contact-row">Phone: +91 6388474535</div>
      <div class="contact-row">Location: India</div>
      <div class="contact-row">Profiles: GitHub &amp; LinkedIn</div>
      <p style="margin-top:16px;">Reach out about Unity projects, interactive web experiences, or
      full-stack builds — always happy to talk shop.</p>
    `,
  },
};
