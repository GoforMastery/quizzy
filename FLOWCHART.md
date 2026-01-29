# 🔀 Quizzy — End Goal System Flowchart

> Visual architecture and user flow diagrams for the complete Kahoot-like quiz platform.
> All diagrams use Mermaid syntax — render in GitHub, VS Code (with Mermaid extension), or mermaid.live

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph Client ["🖥️ Client (Next.js App)"]
        UI[React UI Components]
        RSC[Server Components]
        CC[Client Components]
        SA[Server Actions]
    end

    subgraph Realtime ["⚡ Real-Time Layer"]
        WS[Pusher / Ably WebSocket Service]
    end

    subgraph Backend ["⚙️ Backend"]
        API[Next.js API Routes]
        AUTH[Clerk Auth]
        GSM[Game State Manager]
    end

    subgraph Database ["🗄️ Database"]
        PG[(PostgreSQL — Neon)]
        PRISMA[Prisma ORM]
    end

    subgraph Storage ["📦 Storage"]
        IMG[Image Upload Service]
    end

    UI --> RSC
    UI --> CC
    CC --> SA
    CC --> WS
    SA --> PRISMA
    API --> PRISMA
    API --> GSM
    GSM --> WS
    PRISMA --> PG
    AUTH --> API
    AUTH --> SA
    IMG --> API
```

---

## 2. Complete User Journey Flowchart

```mermaid
flowchart TD
    START([User Opens Quizzy]) --> AUTH{Signed In?}

    AUTH -->|No| GUEST[Browse as Guest]
    AUTH -->|Yes| HOME[Home Page]

    GUEST --> JOIN_ONLY[Can Only Join Games]
    GUEST --> SIGN[Sign In / Sign Up]
    SIGN --> HOME

    HOME --> BROWSE[Browse Quiz Library]
    HOME --> CREATE[Create New Quiz]
    HOME --> MY_Q[My Quizzes]
    HOME --> DASH[Dashboard]
    HOME --> JOIN[Join Live Game]
    HOME --> PROFILE[My Profile]

    %% Browse Flow
    BROWSE --> FILTER[Filter: Category / Difficulty / Search]
    FILTER --> SELECT[Select a Quiz]
    SELECT --> DETAIL[Quiz Detail Page]
    DETAIL --> SOLO[Play Solo]
    DETAIL --> HOST[Host Live Game]

    %% Solo Flow
    SOLO --> SOLO_PLAY[Answer Questions with Timer]
    SOLO_PLAY --> SOLO_RESULT[View Results & Score]
    SOLO_RESULT --> DASH
    SOLO_RESULT --> HOME

    %% Create Flow
    CREATE --> META[Enter Quiz Metadata]
    META --> ADD_Q[Add Questions & Options]
    ADD_Q --> IMPORT{Import from Trivia DB?}
    IMPORT -->|Yes| TRIVIA[Fetch from Open Trivia API]
    TRIVIA --> ADD_Q
    IMPORT -->|No| SAVE[Save Quiz]
    ADD_Q --> SAVE
    SAVE --> MY_Q

    %% My Quizzes Flow
    MY_Q --> EDIT[Edit Quiz]
    MY_Q --> DELETE[Delete Quiz]
    MY_Q --> HOST
    EDIT --> SAVE

    %% Host Live Game Flow
    HOST --> CREATE_SESSION[Generate 6-Digit PIN]
    CREATE_SESSION --> LOBBY_HOST[Host Lobby Screen]
    LOBBY_HOST --> WAIT_PLAYERS[Wait for Players to Join]
    WAIT_PLAYERS --> START_GAME{Enough Players?}
    START_GAME -->|Yes| BEGIN[Start Game]
    START_GAME -->|No| WAIT_PLAYERS

    %% Join Flow
    JOIN --> ENTER_PIN[Enter 6-Digit PIN]
    JOIN_ONLY --> ENTER_PIN
    ENTER_PIN --> VALID{PIN Valid?}
    VALID -->|No| ENTER_PIN
    VALID -->|Yes| NICKNAME[Enter Nickname]
    NICKNAME --> LOBBY_PLAYER[Player Lobby Screen]
    LOBBY_PLAYER --> WAITING[Waiting for Host...]

    %% Game Flow
    BEGIN --> GAME_LOOP[Game Loop]
    WAITING --> GAME_LOOP

    GAME_LOOP --> COUNTDOWN[3-2-1 Countdown]
    COUNTDOWN --> SHOW_Q[Display Question to All]
    SHOW_Q --> ANSWER_PHASE[Players Answer — Timer Running]
    ANSWER_PHASE --> TIME_UP[Timer Expires / All Answered]
    TIME_UP --> REVEAL[Show Correct Answer + Stats]
    REVEAL --> LEADER[Show Leaderboard — Top 5]
    LEADER --> MORE_Q{More Questions?}
    MORE_Q -->|Yes| GAME_LOOP
    MORE_Q -->|No| GAME_END

    %% Game End
    GAME_END --> PODIUM[🏆 Podium — Top 3 Players]
    PODIUM --> FINAL_STATS[Final Results for All Players]
    FINAL_STATS --> AGAIN{Play Again?}
    AGAIN -->|Yes| CREATE_SESSION
    AGAIN -->|No| HOME

    %% Dashboard
    DASH --> STATS[View Stats & Trends]
    DASH --> HISTORY[Game History]
    DASH --> BADGES[Achievements & Badges]

    %% Profile
    PROFILE --> AVATAR[Select Avatar]
    PROFILE --> VIEW_STATS[View Personal Stats]
```

---

## 3. Live Game State Machine

```mermaid
stateDiagram-v2
    [*] --> LOBBY: Host creates game

    LOBBY --> COUNTDOWN: Host clicks "Start Game"
    LOBBY --> CANCELLED: Host cancels / disconnects

    COUNTDOWN --> QUESTION_DISPLAY: Countdown (3-2-1) complete

    QUESTION_DISPLAY --> ANSWERING: Question shown to all players

    ANSWERING --> TIME_UP: Timer expires
    ANSWERING --> ALL_ANSWERED: All players answered
    ANSWERING --> TIME_UP: Host forces skip

    TIME_UP --> ANSWER_REVEAL: Show correct answer
    ALL_ANSWERED --> ANSWER_REVEAL: Show correct answer

    ANSWER_REVEAL --> LEADERBOARD: Auto-advance (5s) or host clicks

    LEADERBOARD --> COUNTDOWN: More questions remain
    LEADERBOARD --> GAME_OVER: Last question done

    GAME_OVER --> PODIUM: Show final rankings
    PODIUM --> [*]: Game complete

    CANCELLED --> [*]: Game ended early
```

---

## 4. Real-Time Communication Flow

```mermaid
sequenceDiagram
    participant H as Host
    participant S as Server
    participant WS as WebSocket (Pusher/Ably)
    participant P1 as Player 1
    participant P2 as Player 2

    Note over H,P2: === LOBBY PHASE ===
    H->>S: Create Game Session
    S-->>H: Game PIN: 482916

    P1->>S: Join Game (PIN: 482916)
    S->>WS: Publish: player-joined
    WS-->>H: Player 1 joined
    WS-->>P1: Welcome to lobby

    P2->>S: Join Game (PIN: 482916)
    S->>WS: Publish: player-joined
    WS-->>H: Player 2 joined
    WS-->>P1: Player 2 joined
    WS-->>P2: Welcome to lobby

    Note over H,P2: === GAME START ===
    H->>S: Start Game
    S->>WS: Publish: game-started (countdown)
    WS-->>P1: 3... 2... 1...
    WS-->>P2: 3... 2... 1...

    Note over H,P2: === QUESTION ROUND ===
    S->>WS: Publish: question (Q1 data + timer)
    WS-->>H: Show Q1 (host view)
    WS-->>P1: Show Q1 (player view)
    WS-->>P2: Show Q1 (player view)

    P1->>S: Submit answer (Option B, 3.2s)
    S->>WS: Publish: answer-count-update
    WS-->>H: 1/2 answered

    P2->>S: Submit answer (Option A, 7.1s)
    S->>WS: Publish: answer-count-update
    WS-->>H: 2/2 answered

    S->>WS: Publish: answer-reveal (correct: B)
    WS-->>H: Show results chart
    WS-->>P1: ✅ Correct! +850 pts
    WS-->>P2: ❌ Wrong! +0 pts

    S->>WS: Publish: leaderboard-update
    WS-->>H: Show leaderboard
    WS-->>P1: You're #1!
    WS-->>P2: You're #2

    Note over H,P2: === GAME END ===
    S->>WS: Publish: game-over (final rankings)
    WS-->>H: Show podium
    WS-->>P1: 🥇 1st Place!
    WS-->>P2: 🥈 2nd Place!
```

---

## 5. Database Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email UK
        boolean emailVerified
        string image
        datetime createdAt
        datetime updatedAt
    }

    QUIZ {
        string id PK
        string title
        string description
        int questionCount
        int timeLimit
        enum difficulty
        string category
        boolean isPublic
        string creatorId FK
        string externalId UK
        datetime createdAt
        datetime updatedAt
    }

    QUESTION {
        string id PK
        string text
        string imageUrl
        enum type
        enum difficulty
        string category
        string quizId FK
        datetime createdAt
        datetime updatedAt
    }

    OPTION {
        string id PK
        string text
        boolean isCorrect
        string questionId FK
    }

    QUIZ_ATTEMPT {
        string id PK
        int score
        datetime startedAt
        datetime completedAt
        string userId FK
        string quizId FK
    }

    USER_ANSWER {
        string id PK
        boolean isCorrect
        string attemptId FK
        string questionId FK
        string selectedOptionId FK
    }

    GAME_SESSION {
        string id PK
        string pin UK
        enum status
        int currentQuestionIndex
        string hostId FK
        string quizId FK
        datetime createdAt
        datetime startedAt
        datetime endedAt
    }

    GAME_PLAYER {
        string id PK
        string nickname
        string avatarUrl
        int score
        int streak
        string sessionId FK
        string userId FK
        datetime joinedAt
    }

    GAME_ANSWER {
        string id PK
        boolean isCorrect
        int timeMs
        int points
        string sessionId FK
        string playerId FK
        string questionId FK
        string selectedOptionId FK
    }

    USER ||--o{ QUIZ : creates
    USER ||--o{ QUIZ_ATTEMPT : takes
    USER ||--o{ GAME_SESSION : hosts
    USER ||--o{ GAME_PLAYER : "plays as"
    QUIZ ||--o{ QUESTION : contains
    QUIZ ||--o{ QUIZ_ATTEMPT : "attempted in"
    QUIZ ||--o{ GAME_SESSION : "played in"
    QUESTION ||--o{ OPTION : has
    QUESTION ||--o{ USER_ANSWER : "answered in"
    QUESTION ||--o{ GAME_ANSWER : "answered in"
    OPTION ||--o{ USER_ANSWER : "selected in"
    OPTION ||--o{ GAME_ANSWER : "selected in"
    QUIZ_ATTEMPT ||--o{ USER_ANSWER : contains
    GAME_SESSION ||--o{ GAME_PLAYER : has
    GAME_SESSION ||--o{ GAME_ANSWER : records
    GAME_PLAYER ||--o{ GAME_ANSWER : submits
```

---

## 6. Scoring Algorithm Flow

```mermaid
flowchart TD
    ANS[Player Submits Answer] --> CORRECT{Is Answer Correct?}

    CORRECT -->|No| ZERO[Points = 0]
    ZERO --> RESET[Reset Streak to 0]
    RESET --> SAVE[Save to GameAnswer]

    CORRECT -->|Yes| BASE[Base Points = 1000]
    BASE --> TIME[Calculate Time Bonus]
    TIME --> FORMULA["time_bonus = time_remaining / total_time"]
    FORMULA --> CALC["points = round(1000 × time_bonus)"]
    CALC --> STREAK{Has Streak ≥ 2?}
    STREAK -->|Yes| BONUS["points += streak × 100 (cap 500)"]
    STREAK -->|No| NO_BONUS[No streak bonus]
    BONUS --> CAP[Cap at 1500 max per question]
    NO_BONUS --> CAP
    CAP --> INC[Increment Streak Counter]
    INC --> SAVE

    SAVE --> UPDATE[Update Player Total Score]
    UPDATE --> DONE[Return Points to Player]
```

---

## 7. Page Navigation Map

```mermaid
graph LR
    subgraph Public ["Public Pages"]
        HOME[🏠 Home]
        BROWSE[📚 Browse Quizzes]
        JOIN[🎮 Join Game]
        SIGNIN[🔐 Sign In]
        SIGNUP[📝 Sign Up]
    end

    subgraph Auth ["Authenticated Pages"]
        DASH[📊 Dashboard]
        CREATE[✏️ Create Quiz]
        MY[📁 My Quizzes]
        EDIT[🔧 Edit Quiz]
        PROFILE[👤 Profile]
        HISTORY[📜 Game History]
    end

    subgraph Quiz ["Quiz Pages"]
        DETAIL[📋 Quiz Detail]
        SOLO[🎯 Solo Play]
        RESULTS[📈 Results]
    end

    subgraph Game ["Live Game Pages"]
        LOBBY[🏟️ Game Lobby]
        HOST_VIEW[🎙️ Host View]
        PLAYER_VIEW[🎮 Player View]
        PODIUM[🏆 Podium]
    end

    HOME --> BROWSE
    HOME --> JOIN
    HOME --> DASH
    HOME --> CREATE
    HOME --> SIGNIN

    BROWSE --> DETAIL
    DETAIL --> SOLO
    DETAIL --> LOBBY
    SOLO --> RESULTS
    RESULTS --> DASH

    CREATE --> MY
    MY --> EDIT
    MY --> DETAIL

    JOIN --> LOBBY
    LOBBY --> HOST_VIEW
    LOBBY --> PLAYER_VIEW
    HOST_VIEW --> PODIUM
    PLAYER_VIEW --> PODIUM
    PODIUM --> HOME

    DASH --> HISTORY
    DASH --> PROFILE
```

---

## 8. Deployment Architecture

```mermaid
graph TB
    subgraph Users ["Users"]
        BROWSER[🌐 Browser / Mobile]
    end

    subgraph Vercel ["Vercel Platform"]
        EDGE[Edge Network / CDN]
        SSR[Serverless Functions — Next.js]
        API[API Routes]
    end

    subgraph Services ["Third-Party Services"]
        CLERK[🔐 Clerk — Auth]
        PUSHER[⚡ Pusher/Ably — WebSockets]
        UPLOAD[📷 UploadThing — Images]
    end

    subgraph Data ["Data Layer"]
        NEON[(🐘 Neon PostgreSQL)]
    end

    BROWSER <-->|HTTPS| EDGE
    EDGE <--> SSR
    EDGE <--> API
    SSR <--> NEON
    API <--> NEON
    BROWSER <-->|WebSocket| PUSHER
    API <--> PUSHER
    API <--> CLERK
    API <--> UPLOAD
    SSR <--> CLERK
```

---

## 9. Feature Priority Matrix

```
                        HIGH IMPACT
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            │  🔴 DO FIRST  │  🟡 DO NEXT   │
            │               │               │
            │ • Quiz Creator│ • Animations  │
            │ • Live Game   │ • Sound FX    │
            │ • Game Lobby  │ • Achievements│
            │ • Leaderboard │ • Sharing     │
            │ • Scoring     │ • Avatars     │
 HIGH ──────┼───────────────┼───────────────┼────── LOW
 EFFORT     │               │               │  EFFORT
            │  🟠 CONSIDER  │  🟢 EASY WINS │
            │               │               │
            │ • Teams Mode  │ • Dark Mode ✅│
            │ • Video Q's   │ • Filters ✅  │
            │ • AI Quizzes  │ • Search      │
            │ • Tournaments │ • OG Images   │
            │               │               │
            └───────────────┼───────────────┘
                            │
                        LOW IMPACT
```

---

> **How to view these diagrams:**
> - **GitHub:** Push this file — GitHub renders Mermaid natively
> - **VS Code:** Install "Markdown Preview Mermaid Support" extension
> - **Browser:** Copy any diagram block to [mermaid.live](https://mermaid.live)
