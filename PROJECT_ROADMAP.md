# 🎯 Quizzy — Project Roadmap
## From Quiz App → Kahoot-Like Live Quiz Platform

---

## 📍 CURRENT STATE (Where We Are)

### Tech Stack
- **Framework:** Next.js 16.1.1 (App Router) + React 19 + TypeScript
- **Database:** PostgreSQL (Neon serverless) + Prisma 7.2 ORM
- **Auth:** Clerk (sign-in/sign-up, route protection, user sync)
- **UI:** Tailwind CSS 4 + shadcn/ui + Radix UI + Lucide icons
- **Forms:** React Hook Form + Zod validation
- **Deployment:** Vercel

### Existing Features ✅
- [x] User authentication (Clerk — sign-in, sign-up, protected routes)
- [x] Browse quizzes page with difficulty/category filters
- [x] Take a quiz with timer countdown
- [x] Multiple choice & true/false question types
- [x] Progress bar during quiz
- [x] Auto-submit when timer expires
- [x] Quiz results page with correct/incorrect feedback
- [x] User dashboard with stats (attempts, avg score, min/max)
- [x] Category-wise performance breakdown
- [x] Improvement trend tracking (improving/declining/stable)
- [x] Recent attempts history
- [x] Dark/light theme support
- [x] Responsive layout with header navigation
- [x] Server actions for all data operations (no REST API yet)

### Existing Database Models
- User, Quiz, Question, Option, QuizAttempt, UserAnswer
- Enums: Difficulty (EASY/MEDIUM/HARD), QuestionType (MULTIPLE_CHOICE/TRUE_FALSE)

### Existing Pages/Routes
- `/` — Home/welcome page
- `/quizzes` — Browse quizzes
- `/quiz/[id]` — Take a quiz
- `/quiz/[id]/results/[attemptId]` — View results
- `/dashboard` — User stats dashboard
- `/sign-in`, `/sign-up` — Auth pages

### What's Missing for Kahoot-Like Experience ❌
- [ ] No quiz creation UI (quizzes are only in DB/seed)
- [ ] No real-time multiplayer / live game lobby
- [ ] No game PIN / join code system
- [ ] No live leaderboard during games
- [ ] No host controls (start, pause, skip)
- [ ] No WebSocket/real-time communication
- [ ] No image support in questions
- [ ] No player avatars/nicknames for games
- [ ] No sound effects or animations
- [ ] No social features (share quiz, invite friends)
- [ ] No REST API routes (everything is server actions)

---

## 🏁 END GOAL (Where We Want To Be — 30 Days)

### Core Kahoot-Like Features
1. **Quiz Creator** — Full UI for creating/editing quizzes with questions, options, images, time limits
2. **Live Game Lobby** — Host creates a game, players join via 6-digit PIN
3. **Real-Time Gameplay** — All players see questions simultaneously, answers are timed
4. **Live Leaderboard** — Scores update after each question, top players highlighted
5. **Host Dashboard** — Host controls the game flow (next question, pause, end)
6. **Post-Game Summary** — Podium screen, detailed results, option to play again

### Additional Features
7. **My Quizzes** — Users can manage their created quizzes (edit, delete, duplicate)
8. **Quiz Library** — Public quiz discovery with search, categories, popularity sorting
9. **Player Profiles** — Avatars, game history, achievements/badges
10. **Solo Practice Mode** — Keep existing solo quiz functionality (already built)
11. **Responsive Mobile Play** — Mobile-optimized answer buttons for live games
12. **Sound & Animations** — Countdown sounds, correct/wrong feedback, podium celebration
13. **Open Trivia API Integration** — Import questions from Open Trivia DB (schema already exists)

### Tech Additions Needed
- **WebSockets** — Via Socket.io or Ably/Pusher for real-time game state
- **Redis or In-Memory Store** — For temporary live game state (active games, player lists)
- **API Routes** — REST endpoints for game actions alongside server actions
- **Image Uploads** — Via Cloudinary or UploadThing for question images
- **Animations** — Via Framer Motion for transitions and celebrations

---

## 🗺️ HOW TO GET THERE — Week-by-Week Overview

### Week 1 (Days 1–7): Quiz Creator + My Quizzes
Build the content creation pipeline. Without quizzes, there's no game.

### Week 2 (Days 8–14): Real-Time Infrastructure + Game Lobby
Set up WebSockets, game state management, and the join-by-PIN flow.

### Week 3 (Days 15–21): Live Gameplay + Leaderboard
Build the actual real-time game experience — synced questions, scoring, leaderboard.

### Week 4 (Days 22–28): Polish, Mobile, Social, Extras
Add animations, sound, mobile optimization, sharing, and achievements.

### Days 29–30: Testing, Bug Fixes, Deployment
Final QA pass and production deployment.

---

## 📅 30-DAY DAILY PLAN

---

### WEEK 1 — Quiz Creator & Content Management

#### Day 1 — Quiz Creator: Database & Schema Updates
- [ ] Add `creatorId` field to Quiz model (link quiz to the user who created it)
- [ ] Add `isPublic` boolean to Quiz model (public vs private quizzes)
- [ ] Add `imageUrl` optional field to Question model
- [ ] Run `prisma migrate` and verify schema changes
- [ ] Create Zod validation schemas for quiz creation form (title, description, difficulty, category, time limit)
- [ ] Test migration works on Neon database

#### Day 2 — Quiz Creator: Form UI (Part 1)
- [ ] Create `/create` route and page
- [ ] Build quiz metadata form (title, description, category dropdown, difficulty selector, time limit)
- [ ] Use React Hook Form + Zod for validation
- [ ] Style with shadcn/ui components (Input, Select, Textarea, Card)
- [ ] Add "Create Quiz" button to header navigation for signed-in users
- [ ] Ensure form is responsive on mobile

#### Day 3 — Quiz Creator: Question Builder (Part 2)
- [ ] Build "Add Question" section below quiz metadata
- [ ] Create question card component (question text, type selector, options list)
- [ ] Support adding/removing options dynamically (2–6 options)
- [ ] Add "Mark as correct" toggle for each option
- [ ] Add "Add Another Question" button to append questions
- [ ] Add question reordering (move up/down buttons)
- [ ] Validate: at least 1 question, each question has at least 2 options, exactly 1 correct answer

#### Day 4 — Quiz Creator: Server Action & Save
- [ ] Create `createQuizByUser` server action (different from seed-based `createQuiz`)
- [ ] Wire form submission to server action
- [ ] Handle success: redirect to the new quiz's detail page
- [ ] Handle errors: display validation errors inline
- [ ] Test end-to-end: create a quiz → see it in `/quizzes` list
- [ ] Add loading/submitting state to the form button

#### Day 5 — My Quizzes Page
- [ ] Create `/my-quizzes` route and page
- [ ] Create `getQuizzesByUser` server action (fetch quizzes where creatorId = current user)
- [ ] Display quizzes in a card grid (title, question count, difficulty badge, created date)
- [ ] Add "Edit" and "Delete" buttons on each card
- [ ] Implement `deleteQuiz` server action with confirmation dialog
- [ ] Add "My Quizzes" link to header navigation

#### Day 6 — Quiz Editor (Edit Existing Quiz)
- [ ] Create `/edit/[id]` route and page
- [ ] Reuse quiz creator form components, pre-filled with existing data
- [ ] Create `updateQuiz` server action
- [ ] Handle adding new questions to existing quiz
- [ ] Handle removing questions from existing quiz
- [ ] Handle updating question text and options
- [ ] Verify only the quiz creator can edit their quiz (authorization check)

#### Day 7 — Quiz Detail Page + Open Trivia Import
- [ ] Create `/quiz/[id]/details` preview page (view quiz info before playing)
- [ ] Show: title, description, question count, difficulty, category, creator name
- [ ] Add "Play Solo" and "Host Live Game" buttons (Host button disabled for now)
- [ ] Build simple Open Trivia DB import: fetch questions by category/difficulty
- [ ] Create a "Quick Create from Trivia DB" button on the create page
- [ ] Transform API response using existing `/lib/transforms/quiz.ts`
- [ ] Test importing and saving trivia questions

---

### WEEK 2 — Real-Time Infrastructure & Game Lobby

#### Day 8 — Research & Setup Real-Time Service
- [ ] Decide: Socket.io (self-hosted) vs Pusher/Ably (managed service)
  - **Recommendation:** Ably or Pusher for Vercel deployment (serverless-friendly)
  - **Alternative:** Socket.io if switching to a Node.js server (Railway/Render)
- [ ] Install chosen package (`pusher` + `pusher-js` OR `ably`)
- [ ] Set up account and get API keys
- [ ] Add keys to `.env` file
- [ ] Create utility wrapper: `/lib/realtime.ts` for publish/subscribe helpers
- [ ] Test basic message send/receive in a throwaway component

#### Day 9 — Game Session Database Schema
- [ ] Add `GameSession` model to Prisma schema:
  - `id`, `pin` (unique 6-digit string), `hostId`, `quizId`, `status` (LOBBY/PLAYING/FINISHED)
  - `currentQuestionIndex`, `createdAt`, `startedAt`, `endedAt`
- [ ] Add `GamePlayer` model:
  - `id`, `sessionId`, `userId` (nullable for guests), `nickname`, `avatarUrl`, `score`, `joinedAt`
- [ ] Add `GameAnswer` model:
  - `id`, `sessionId`, `playerId`, `questionId`, `selectedOptionId`, `isCorrect`, `timeMs`, `points`
- [ ] Run migration
- [ ] Create server actions: `createGameSession`, `joinGameSession`, `getGameSession`

#### Day 10 — Host: Create Game Flow
- [ ] Enable "Host Live Game" button on quiz detail page
- [ ] On click: call `createGameSession` → generates unique 6-digit PIN
- [ ] Redirect host to `/game/[sessionId]/lobby` page
- [ ] Display: game PIN prominently, quiz title, player count
- [ ] Host sees a "Start Game" button (disabled until ≥1 player joins)
- [ ] Host sees real-time player list as players join

#### Day 11 — Player: Join Game Flow
- [ ] Create `/join` page with large PIN input (6 digits)
- [ ] Add "Join Game" to header navigation
- [ ] On PIN submit: validate PIN exists and game is in LOBBY status
- [ ] Prompt for nickname (pre-fill with user's name if signed in)
- [ ] Allow guest players (no sign-in required to join)
- [ ] On join: create `GamePlayer` record, redirect to `/game/[sessionId]/lobby`
- [ ] Player sees lobby: waiting screen with "Waiting for host to start..."

#### Day 12 — Lobby: Real-Time Player List
- [ ] When a player joins, publish event to game channel
- [ ] Host's lobby page subscribes to join events → updates player list in real-time
- [ ] Show player nicknames with random avatar/color
- [ ] Show player count: "5 players joined"
- [ ] Handle player disconnect: remove from list after timeout
- [ ] Add fun waiting animations/messages ("Get ready!", quiz topic hint)

#### Day 13 — Game State Machine Design
- [ ] Design game state flow:
  - LOBBY → COUNTDOWN → QUESTION_DISPLAY → ANSWERING → ANSWER_REVEAL → LEADERBOARD → (next question or) FINISHED
- [ ] Create `/lib/game-state.ts` with state management logic
- [ ] Define events: `GAME_START`, `SHOW_QUESTION`, `SUBMIT_ANSWER`, `TIME_UP`, `SHOW_RESULTS`, `NEXT_QUESTION`, `GAME_END`
- [ ] Create server action: `advanceGameState` (host only)
- [ ] Create server action: `submitGameAnswer` (player)
- [ ] Plan scoring: base points (1000) × time bonus (faster = more points)

#### Day 14 — API Routes for Game Actions
- [ ] Create `/api/game/create` — POST to create game session
- [ ] Create `/api/game/[sessionId]/join` — POST to join game
- [ ] Create `/api/game/[sessionId]/start` — POST (host only) to start game
- [ ] Create `/api/game/[sessionId]/answer` — POST to submit answer
- [ ] Create `/api/game/[sessionId]/next` — POST (host only) to advance question
- [ ] Create `/api/game/[sessionId]/state` — GET current game state
- [ ] Add proper error handling and auth checks to all routes
- [ ] Test all endpoints manually

---

### WEEK 3 — Live Gameplay & Leaderboard

#### Day 15 — Host Game Screen
- [ ] Create `/game/[sessionId]/host` page
- [ ] Display current question (large, centered, readable)
- [ ] Show answer options with Kahoot-style colored blocks (red, blue, green, yellow)
- [ ] Display countdown timer (prominent, animated)
- [ ] Show number of players who have answered: "12/20 answered"
- [ ] "Next Question" button appears after time's up or all answered

#### Day 16 — Player Game Screen
- [ ] Create `/game/[sessionId]/play` page
- [ ] Show question text at top
- [ ] Show 4 large colored answer buttons (mobile-friendly, full-width)
- [ ] On answer tap: send answer + timestamp to server
- [ ] After answering: show "Answer locked in!" with waiting animation
- [ ] After time's up: show if answer was correct/incorrect with points earned
- [ ] Handle edge case: player doesn't answer in time (0 points)

#### Day 17 — Scoring System
- [ ] Implement scoring algorithm:
  - Base: 1000 points for correct answer
  - Time bonus: multiply by (time_remaining / total_time) — faster = more points
  - Streak bonus: +100 for each consecutive correct answer
  - Max per question: 1000 points
  - Wrong answer: 0 points (streak resets)
- [ ] Create `calculatePoints` utility function
- [ ] Save scores to `GameAnswer` records
- [ ] Update `GamePlayer.score` running total after each question
- [ ] Test scoring with edge cases (instant answer, last-second, timeout)

#### Day 18 — Answer Reveal Screen
- [ ] After question timer ends, show answer reveal to ALL players:
  - Correct answer highlighted in green
  - Show bar chart: how many picked each option
  - Host sees percentage breakdown
  - Players see if they were right + points earned
- [ ] Publish answer reveal event via real-time channel
- [ ] Auto-advance to leaderboard after 5 seconds (or host clicks "Show Leaderboard")

#### Day 19 — Live Leaderboard
- [ ] After answer reveal, show top 5 players with animated scoreboard
- [ ] Leaderboard updates with smooth animations (position changes)
- [ ] Each player on their own screen sees their rank: "You're in 3rd place!"
- [ ] Host sees full leaderboard on their screen
- [ ] Add podium-style display for top 3 (gold/silver/bronze)

#### Day 20 — Game End & Results
- [ ] After last question's leaderboard, transition to "Game Over" screen
- [ ] Show final podium: top 3 players with celebration animation
- [ ] Host sees: full final rankings, per-question stats
- [ ] Players see: their final rank, total score, accuracy percentage
- [ ] Save final results to database (update GameSession status to FINISHED)
- [ ] Add "Play Again" button (creates new session with same quiz)
- [ ] Add "Back to Home" button

#### Day 21 — Solo Mode Polish + Game History
- [ ] Ensure existing solo quiz mode still works perfectly alongside live mode
- [ ] Add solo game results to user dashboard
- [ ] Create `/game-history` page showing past live games
- [ ] Show: game date, quiz title, player count, rank, score
- [ ] Link from dashboard to game history
- [ ] Fix any bugs found during integration

---

### WEEK 4 — Polish, Mobile, Social & Extras

#### Day 22 — Mobile Optimization
- [ ] Audit all pages for mobile responsiveness
- [ ] Make player game screen thumb-friendly (large tap targets)
- [ ] Make PIN entry screen large and centered on mobile
- [ ] Test lobby screen on mobile (scrollable player list)
- [ ] Ensure host screen is readable on tablet (primary host device)
- [ ] Fix any overflow, text truncation, or layout issues
- [ ] Test on actual mobile devices (or Chrome DevTools mobile simulation)

#### Day 23 — Animations with Framer Motion
- [ ] Install `framer-motion`
- [ ] Add page transition animations (fade in/slide)
- [ ] Add countdown animation (3, 2, 1, GO!)
- [ ] Add score increment animation (numbers rolling up)
- [ ] Add leaderboard position change animation (slides up/down)
- [ ] Add podium celebration animation (confetti or bounce)
- [ ] Add correct/wrong answer feedback animation (green flash / red shake)

#### Day 24 — Sound Effects
- [ ] Add optional sound effects (can be toggled off):
  - Lobby: background music / waiting sound
  - Countdown: tick-tick-tick
  - Question appear: whoosh
  - Correct answer: ding / chime
  - Wrong answer: buzz
  - Leaderboard: dramatic reveal
  - Final podium: celebration fanfare
- [ ] Create sound utility: `/lib/sounds.ts` with play/stop/toggle functions
- [ ] Store sound preference in localStorage
- [ ] Add sound toggle button (speaker icon) in game header

#### Day 25 — Quiz Sharing & Social
- [ ] Add "Share Quiz" button with copy-to-clipboard link
- [ ] Add social share buttons (WhatsApp, Twitter/X — using native share API)
- [ ] Create shareable quiz preview card (for link previews / Open Graph)
- [ ] Add quiz "likes" or "plays" counter
- [ ] Show "Popular Quizzes" section on home page
- [ ] Add quiz search functionality on `/quizzes` page (search by title/category)

#### Day 26 — Player Profiles & Avatars
- [ ] Create `/profile` page
- [ ] Show: user stats, games played, quizzes created, win rate
- [ ] Add avatar selection (pick from preset avatars or use Clerk profile image)
- [ ] Add display name customization
- [ ] Show recent games and created quizzes on profile
- [ ] Create simple achievement badges:
  - "First Quiz" — complete first quiz
  - "Quiz Creator" — create first quiz
  - "On Fire" — 3 correct streak in a game
  - "Champion" — win a live game
  - "Scholar" — score 100% on any quiz

#### Day 27 — Quiz Library & Discovery Improvements
- [ ] Improve `/quizzes` page with better filtering:
  - Search bar (by title)
  - Category tabs/chips
  - Difficulty filter
  - Sort by: newest, most played, highest rated
- [ ] Add pagination or infinite scroll
- [ ] Add quiz thumbnail/cover image support
- [ ] Show quiz stats on cards (times played, avg score)
- [ ] Add "Featured Quizzes" section (manually curated or most popular)

#### Day 28 — Error Handling, Edge Cases & Security
- [ ] Handle network disconnection during live game (reconnection logic)
- [ ] Handle host leaving during game (auto-end or transfer host)
- [ ] Handle player leaving during game (mark as disconnected, skip their answers)
- [ ] Rate limit game creation and joining (prevent abuse)
- [ ] Validate all inputs on both client and server
- [ ] Add proper error boundaries for React components
- [ ] Add loading skeletons for all pages
- [ ] Audit for XSS, injection, and auth bypass vulnerabilities

---

### FINAL STRETCH

#### Day 29 — Testing & Bug Fixes
- [ ] Test complete flow: create quiz → host game → players join → play → results
- [ ] Test solo mode still works correctly
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Test with 5+ simultaneous players (recruit friends or use multiple tabs)
- [ ] Fix all discovered bugs
- [ ] Check all pages for console errors
- [ ] Verify database queries are efficient (check for N+1 issues)

#### Day 30 — Final Deploy & Launch Prep
- [ ] Run `prisma migrate deploy` on production database
- [ ] Set all new environment variables in Vercel dashboard
- [ ] Deploy to Vercel and test production build
- [ ] Test real-time features in production
- [ ] Create a few sample quizzes for new users to try
- [ ] Write a brief README update with new features
- [ ] Share with friends and collect feedback
- [ ] Plan post-launch: what to improve in the next sprint

---

## 🎯 SUCCESS METRICS (After 30 Days)

| Feature | Target |
|---------|--------|
| Users can create quizzes via UI | ✅ Working |
| Live game with PIN join | ✅ Working |
| 10+ simultaneous players | ✅ Stable |
| Real-time leaderboard | ✅ Animated |
| Mobile playable | ✅ Responsive |
| Solo mode preserved | ✅ No regression |
| Sound & animations | ✅ Toggleable |
| Average page load | < 2 seconds |
| Game latency | < 500ms |

---

## 🧰 NEW PACKAGES TO INSTALL

| Package | Purpose | When |
|---------|---------|------|
| `pusher` + `pusher-js` (or `ably`) | Real-time WebSocket communication | Day 8 |
| `framer-motion` | Animations & transitions | Day 23 |
| `nanoid` | Generate unique game PINs | Day 9 |
| `uploadthing` or `cloudinary` | Image uploads for questions | Day 7 (optional) |
| `use-sound` | Sound effects hook | Day 24 |

---

## 📂 NEW FILES/FOLDERS TO CREATE

```
src/
├── app/
│   ├── create/page.tsx              # Quiz creator
│   ├── edit/[id]/page.tsx           # Quiz editor
│   ├── my-quizzes/page.tsx          # User's quizzes
│   ├── join/page.tsx                # Join game by PIN
│   ├── game/[sessionId]/
│   │   ├── lobby/page.tsx           # Pre-game lobby
│   │   ├── host/page.tsx            # Host game view
│   │   └── play/page.tsx            # Player game view
│   ├── game-history/page.tsx        # Past games
│   ├── profile/page.tsx             # User profile
│   └── api/
│       └── game/
│           ├── create/route.ts
│           ├── [sessionId]/
│           │   ├── join/route.ts
│           │   ├── start/route.ts
│           │   ├── answer/route.ts
│           │   ├── next/route.ts
│           │   └── state/route.ts
├── components/
│   ├── quiz-creator/
│   │   ├── QuizForm.tsx
│   │   ├── QuestionCard.tsx
│   │   └── OptionInput.tsx
│   ├── game/
│   │   ├── GameLobby.tsx
│   │   ├── HostQuestion.tsx
│   │   ├── PlayerAnswer.tsx
│   │   ├── AnswerReveal.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── Podium.tsx
│   │   └── CountdownTimer.tsx
│   ├── PinInput.tsx
│   └── AvatarSelector.tsx
├── lib/
│   ├── realtime.ts                  # WebSocket wrapper
│   ├── game-state.ts                # Game state machine
│   ├── scoring.ts                   # Points calculation
│   └── sounds.ts                    # Sound effects manager
└── actions/
    └── game.ts                      # Game server actions
```

---

> **Remember:** Ship incrementally. Each day's work should be deployable.
> Don't aim for perfection — aim for "players are having fun."
