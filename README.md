.
├── backend/                  # Contains all server-side code
│   ├── src/                  # Source code for the backend
│   │   ├── api/              # API routes and controllers (e.g., /auth, /users, /game)
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   └── game/
│   │   ├── models/           # Data models and schemas (e.g., User, Game, Tournament)
│   │   ├── services/         # Business logic and helper functions
│   │   ├── utils/            # Utility functions (e.g., hashing, validation)
│   │   ├── config/           # Backend configurations (e.g., database connection)
│   │   ├── middleware/       # Express/Fastify middleware (e.g., authentication, logging)
│   │   ├── database/         # Database connection and schema setup (SQLite related)
│   │   │   └── migrations/   # Database migration scripts
│   │   ├── blockchain/       # Solidity contracts, Avalanche integration code
│   │   │   ├── contracts/    # Smart contracts (Solidity)
│   │   │   └── lib/          # Blockchain interaction libraries
│   │   └── app.ts            # Main backend application entry point
│   ├── tests/                # Backend unit and integration tests
│   ├── .env.example          # Example environment variables (do NOT commit .env)
│   └── package.json          # Node.js dependencies (if using Fastify) / composer.json (if using PHP)
│
├── frontend/                 # Contains all client-side code (Typescript, Tailwind CSS)
│   ├── public/               # Static assets (index.html, images, fonts)
│   ├── src/
│   │   ├── components/       # Reusable UI components (buttons, forms, game elements)
│   │   ├── pages/            # Application pages (Home, Login, Game, Tournament, Profile)
│   │   ├── assets/           # Images, icons, local static assets
│   │   ├── styles/           # Tailwind CSS configuration and custom styles
│   │   ├── utils/            # Frontend utility functions (e.g., API helpers, game logic)
│   │   ├── services/         # Frontend services (e.g., authentication, API calls)
│   │   ├── stores/           # State management (if using a store library)
│   │   ├── game/             # Core game logic (Pong, other games, rendering)
│   │   │   ├── entities/     # Game objects (paddles, ball, etc.)
│   │   │   ├── engine/       # Game loop, physics
│   │   │   └── ui/           # Game specific UI elements
│   │   ├── chat/             # Live chat specific components and logic
│   │   ├── security/         # 2FA, JWT handling on frontend
│   │   ├── routes/           # Frontend routing configuration
│   │   └── main.ts           # Main frontend application entry point
│   ├── tests/                # Frontend unit and E2E tests
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── tsconfig.json         # Typescript configuration
│
├── docker/                   # Docker-related files
│   ├── backend/              # Dockerfile for backend service
│   ├── frontend/             # Dockerfile for frontend service
│   ├── db/                   # Dockerfile for database service (SQLite setup)
│   ├── nginx/                # Nginx configuration for reverse proxy, HTTPS, WAF
│   │   └── conf.d/
│   │       └── default.conf  # Nginx site configuration
│   ├── certs/                # SSL certificates (for HTTPS)
│   ├── vault/                # HashiCorp Vault configuration
│   └── prometheus/           # Prometheus configuration
│   └── grafana/              # Grafana configuration
│   └── elk/                  # ELK stack configurations
│
├── .gitignore                # Files/directories to ignore for Git
├── docker-compose.yml        # Orchestrates all Docker services
├── README.md                 # Project documentation
└── Makefile                  # Common commands for building, running, testing