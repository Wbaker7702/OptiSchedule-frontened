require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const shiftsRouter = require("./routes/shifts");
const aiRouter = require("./routes/ai");

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "opti_session";
const IS_PROD = process.env.NODE_ENV === "production";

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set and at least 32 characters long.");
}

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
        "connect-src": ["'self'"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "frame-ancestors": ["'none'"],
        "form-action": ["'self'"],
      },
    },
    referrerPolicy: { policy: "no-referrer" },
  })
);

// Rate limiting (global, demo-safe)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts. Please try again later.",
});

// ---------- helpers ----------
function signSession(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD, // true under https
    sameSite: "strict",
    maxAge: 8 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    path: "/",
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
  });
}

function isApiRequest(req) {
  const accepts = req.headers.accept || "";
  return (
    req.originalUrl.startsWith("/api/") ||
    accepts.includes("application/json") ||
    req.xhr
  );
}

function rejectUnauthorized(req, res) {
  if (isApiRequest(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.redirect("/");
}

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return rejectUnauthorized(req, res);

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (e) {
    clearSessionCookie(res);
    return rejectUnauthorized(req, res);
  }
}

// ---------- health ----------
app.get("/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "production" });
});

// ---------- APIs ----------
app.use("/api/shifts", requireAuth, shiftsRouter);
app.use("/api/ai", requireAuth, aiRouter);

app.get("/api/session", requireAuth, (req, res) => {
  const user = req.user || {};
  res.json({
    authenticated: true,
    name: user.name || "Manager",
    role: user.role || "manager",
    expiresAt: user.exp ? new Date(user.exp * 1000).toISOString() : null,
  });
});

// ---------- UI: Login ----------
app.get("/", (req, res) => {
  // If already logged in, go to dashboard
  const token = req.cookies[COOKIE_NAME];
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return res.redirect("/dashboard");
    } catch (_) {
      // ignore
    }
  }

  res.status(200).send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>OptiSchedule Pro — Secure Access</title>
<style>
  :root{
    --bg0:#061a40;
    --bg1:#0b3d91;
    --ink:#0f172a;
    --muted:#64748b;
    --line:#e2e8f0;
    --card:#ffffff;
    --accent:#0b3d91;
    --accent2:#22c55e;
    --danger:#ef4444;
  }
  *{box-sizing:border-box}
  body{
    margin:0;
    min-height:100vh;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji";
    color:#fff;
    overflow:hidden;
    background:
      radial-gradient(1200px 600px at 12% 18%, rgba(34,197,94,.20), transparent 55%),
      radial-gradient(900px 500px at 80% 30%, rgba(59,130,246,.25), transparent 55%),
      radial-gradient(800px 500px at 50% 100%, rgba(14,165,233,.18), transparent 60%),
      linear-gradient(135deg, var(--bg0), var(--bg1));
  }
  .grid{
    min-height:100vh;
    display:grid;
    grid-template-columns: 1.25fr 520px;
  }
  .left{
    padding:72px 72px 72px 72px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:18px;
  }
  .brand{
    display:flex;align-items:center;gap:14px;
    letter-spacing:.2px;
  }
  .mark{
    width:44px;height:44px;border-radius:12px;
    background:linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.06));
    border:1px solid rgba(255,255,255,.18);
    display:flex;align-items:center;justify-content:center;
    box-shadow: 0 20px 60px rgba(0,0,0,.25);
  }
  .mark svg{opacity:.95}
  .title{
    font-size:46px; line-height:1.05; margin:6px 0 0 0; font-weight:800;
  }
  .subtitle{
    font-size:18px; line-height:1.6; max-width:640px;
    color: rgba(255,255,255,.86);
  }
  .pillrow{display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;}
  .pill{
    font-size:12px;
    padding:8px 10px;
    border-radius:999px;
    border:1px solid rgba(255,255,255,.18);
    background:rgba(255,255,255,.06);
    color:rgba(255,255,255,.88);
    backdrop-filter: blur(10px);
  }
  .footnote{
    margin-top:28px;
    font-size:12px;
    color:rgba(255,255,255,.70);
  }

  .right{
    background:rgba(255,255,255,.04);
    border-left:1px solid rgba(255,255,255,.10);
    backdrop-filter: blur(14px);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:28px;
  }
  .card{
    width:100%;
    max-width:420px;
    background: rgba(255,255,255,.96);
    color: var(--ink);
    border-radius: 18px;
    border: 1px solid rgba(15,23,42,.08);
    box-shadow: 0 30px 90px rgba(0,0,0,.35);
    padding: 28px;
    position:relative;
    overflow:hidden;
  }
  .card:before{
    content:"";
    position:absolute; inset:-120px -120px auto auto;
    width:240px; height:240px; border-radius:999px;
    background: radial-gradient(circle, rgba(11,61,145,.25), transparent 60%);
    filter: blur(2px);
  }
  .card h2{
    margin:0 0 6px 0;
    font-size:20px;
    font-weight:800;
    letter-spacing:.2px;
  }
  .card p{
    margin:0 0 18px 0;
    color: var(--muted);
    font-size:13px;
    line-height:1.5;
  }
  label{display:block; font-size:12px; color:#334155; margin:10px 0 6px;}
  input{
    width:100%;
    padding:12px 12px;
    border-radius:10px;
    border:1px solid var(--line);
    outline:none;
    font-size:14px;
    background:#fff;
  }
  input:focus{
    border-color: rgba(11,61,145,.55);
    box-shadow: 0 0 0 4px rgba(11,61,145,.12);
  }
  .row{
    display:flex; gap:10px; align-items:center; justify-content:space-between;
    margin-top:12px;
  }
  .btn{
    width:100%;
    padding:12px 14px;
    border-radius:12px;
    border:none;
    cursor:pointer;
    font-weight:800;
    letter-spacing:.2px;
    background: linear-gradient(135deg, #0b3d91, #0ea5e9);
    color:#fff;
    box-shadow: 0 16px 40px rgba(11,61,145,.30);
  }
  .btn:hover{filter:brightness(1.02)}
  .meta{
    margin-top:14px;
    display:flex;
    justify-content:space-between;
    gap:10px;
    font-size:11px;
    color:#64748b;
  }
  .badge{
    display:inline-flex;align-items:center;gap:8px;
    font-size:11px;
    padding:8px 10px;
    border-radius:999px;
    border:1px solid rgba(34,197,94,.25);
    background: rgba(34,197,94,.10);
    color:#166534;
    font-weight:700;
  }
  .badge i{
    width:8px;height:8px;border-radius:999px;background: var(--accent2);
    box-shadow: 0 0 0 4px rgba(34,197,94,.16);
  }

  /* subtle background motion */
  .glow{
    position:absolute; inset:auto auto -180px -180px;
    width:420px; height:420px; border-radius:999px;
    background: radial-gradient(circle, rgba(255,255,255,.10), transparent 55%);
    filter: blur(2px);
    animation: floaty 10s ease-in-out infinite;
    pointer-events:none;
  }
  @keyframes floaty{
    0%{transform:translate(0,0)}
    50%{transform:translate(40px,-20px)}
    100%{transform:translate(0,0)}
  }

  @media (max-width: 980px){
    .grid{grid-template-columns: 1fr;}
    .left{padding:46px 22px}
    .right{border-left:none; border-top:1px solid rgba(255,255,255,.10)}
    body{overflow:auto}
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="grid">
    <section class="left">
      <div class="brand">
        <div class="mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l8 4v6c0 5-3.5 9.2-8 10-4.5-.8-8-5-8-10V6l8-4z" stroke="white" stroke-width="1.6"/>
            <path d="M8.7 12.2l2.1 2.2 4.6-4.8" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div style="opacity:.92;font-weight:800;">Operational Trust Access</div>
      </div>

      <div class="title">OptiSchedule Pro</div>
      <div class="subtitle">
        Secure workforce compliance & shift intelligence platform designed to increase operational trust,
        labor precision, and real-time accountability at enterprise scale.
      </div>

      <div class="pillrow">
        <div class="pill">Real-time trust metrics</div>
        <div class="pill">Protected AI decisioning</div>
        <div class="pill">Audit-grade infrastructure</div>
        <div class="pill">Pilot: Store #2080</div>
      </div>

      <div class="footnote">
        Access is monitored and logged. Demo mode uses parallel execution — no disruption to existing workforce systems.
      </div>
    </section>

    <aside class="right">
      <div class="card">
        <h2>Secure Access</h2>
        <p>Authorized workforce leadership only. Sessions are encrypted and audit-logged.</p>

        <div class="badge"><i></i> Infrastructure: Hardened • TLS • JWT</div>

        <form method="POST" action="/login">
          <label>Username</label>
          <input name="username" autocomplete="username" required />

          <label>Password</label>
          <input type="password" name="password" autocomplete="current-password" required />

          <div class="row">
            <button class="btn" type="submit">Initialize Secure Session</button>
          </div>
        </form>

        <div class="meta">
          <span>Parallel Pilot • 30 days</span>
          <span>Store #2080 • Battle Creek, MI</span>
        </div>
      </div>
    </aside>
  </div>
</body>
</html>`);
});

// ---------- auth ----------
app.post("/login", loginLimiter, (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  if (!username || !password) return res.redirect("/");

  const token = signSession({
    userId: 1,
    role: "manager",
    name: username.slice(0, 80),
  });
  setSessionCookie(res, token);
  return res.redirect(303, "/dashboard");
});

app.post("/logout", (req, res) => {
  clearSessionCookie(res);
  res.redirect(303, "/");
});

// ---------- dashboard ----------
app.get("/dashboard", requireAuth, (req, res) => {
  const user = req.user || { name: "Manager" };
  res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>OptiSchedule Pro — Dashboard</title>
<style>
  :root{
    --bg:#090f1f;
    --surface:#111b32;
    --surface2:#0f172a;
    --border:rgba(148,163,184,.2);
    --text:#e2e8f0;
    --muted:#94a3b8;
    --primary:#2563eb;
    --danger:#ef4444;
    --ok:#22c55e;
  }
  *{box-sizing:border-box}
  body{
    margin:0;
    color:var(--text);
    font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;
    background:
      radial-gradient(900px 400px at 0% -10%, rgba(37,99,235,.2), transparent 50%),
      radial-gradient(700px 300px at 100% 0%, rgba(34,197,94,.12), transparent 55%),
      var(--bg);
    min-height:100vh;
  }
  .wrap{max-width:1120px;margin:0 auto;padding:26px}
  .top{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:14px;
    flex-wrap:wrap;
  }
  .title{font-size:24px;font-weight:900;letter-spacing:.2px}
  .sub{color:var(--muted);font-size:13px;margin-top:6px}
  .topRight{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
  .pill{
    font-size:11px;
    padding:7px 10px;
    border-radius:999px;
    border:1px solid rgba(34,197,94,.35);
    color:#bbf7d0;
    background:rgba(34,197,94,.12);
    font-weight:700;
  }
  .logout{
    background:transparent;
    border:1px solid var(--border);
    padding:10px 12px;
    border-radius:10px;
    color:var(--text);
    cursor:pointer;
    font-weight:800;
  }
  .metricGrid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:12px;
    margin-top:18px;
  }
  .card{
    background:linear-gradient(180deg, var(--surface), var(--surface2));
    border:1px solid var(--border);
    border-radius:14px;
    padding:14px;
    box-shadow:0 10px 30px rgba(2,6,23,.24);
  }
  .label{color:var(--muted);font-size:12px}
  .value{font-size:26px;font-weight:900;margin-top:6px}
  .delta{font-size:11px;margin-top:6px;color:#93c5fd}
  .panel{
    margin-top:14px;
    display:grid;
    grid-template-columns:1.2fr .8fr;
    gap:12px;
  }
  .h2{font-size:15px;font-weight:800;letter-spacing:.2px;margin:0}
  .p{margin:8px 0 0 0;color:#cbd5e1;font-size:13px;line-height:1.5}
  .tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
  .tag{
    font-size:11px;
    color:#bfdbfe;
    border:1px solid rgba(147,197,253,.28);
    padding:6px 10px;
    border-radius:999px;
    background:rgba(37,99,235,.12);
  }
  .actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
  .btn{
    padding:10px 12px;
    border-radius:10px;
    border:1px solid var(--border);
    background:#18243f;
    color:var(--text);
    cursor:pointer;
    font-weight:800;
  }
  .btnPrimary{
    background:linear-gradient(135deg,#dc2626,#ef4444);
    border:none;
  }
  .btn:disabled{
    opacity:.65;
    cursor:not-allowed;
  }
  .status{
    margin-top:14px;
    border-radius:10px;
    border:1px solid var(--border);
    padding:10px 12px;
    color:var(--muted);
    font-size:12px;
    background:rgba(15,23,42,.45);
  }
  .status.ok{
    color:#86efac;
    border-color:rgba(34,197,94,.35);
    background:rgba(20,83,45,.22);
  }
  .status.error{
    color:#fecaca;
    border-color:rgba(239,68,68,.35);
    background:rgba(127,29,29,.24);
  }
  .noteList{
    margin:12px 0 0 0;
    padding-left:16px;
    color:#cbd5e1;
    font-size:13px;
    line-height:1.6;
  }
  .activity{
    margin:12px 0 0 0;
    padding:0;
    list-style:none;
    display:flex;
    flex-direction:column;
    gap:8px;
  }
  .activity li{
    border:1px solid var(--border);
    border-radius:10px;
    padding:10px;
    font-size:12px;
    color:#cbd5e1;
    background:rgba(15,23,42,.45);
  }
  @media(max-width:980px){
    .metricGrid{grid-template-columns:repeat(2,1fr)}
    .panel{grid-template-columns:1fr}
  }
  @media(max-width:640px){
    .wrap{padding:18px}
    .metricGrid{grid-template-columns:1fr}
  }
</style>
</head>
<body>
  <div class="wrap">
    <header class="top">
      <div>
        <div class="title">Operations Dashboard — Store #2080</div>
        <div class="sub">Welcome, ${escapeHtml(user.name || "Manager")} • Enterprise demo mode</div>
      </div>
      <div class="topRight">
        <span class="pill">Session Active</span>
        <form method="POST" action="/logout">
          <button class="logout" type="submit">Log out</button>
        </form>
      </div>
    </header>

    <section class="metricGrid">
      <div class="card">
        <div class="label">Total Shifts</div>
        <div class="value">1,204</div>
        <div class="delta">+4.2% from last week</div>
      </div>
      <div class="card">
        <div class="label">Compliance Flags</div>
        <div class="value">0</div>
        <div class="delta">No high-severity events</div>
      </div>
      <div class="card">
        <div class="label">Trust Score</div>
        <div class="value">98</div>
        <div class="delta">Stable across 30 days</div>
      </div>
      <div class="card">
        <div class="label">Missed Shifts</div>
        <div class="value">2</div>
        <div class="delta">-1 vs previous period</div>
      </div>
    </section>

    <section class="panel">
      <div class="card">
        <h2 class="h2">Simulation Controls</h2>
        <p class="p">Run pilot simulation actions without blocking your workflow. Responses are shown below.</p>
        <div class="tags">
          <span class="tag">Parallel Run</span>
          <span class="tag">Audit Logs Enabled</span>
          <span class="tag">JWT Protected</span>
        </div>
        <div class="actions">
          <button id="blackFridayBtn" class="btn btnPrimary" type="button">
            Activate Black Friday Mode
          </button>
          <button id="resetBtn" class="btn" type="button">
            Reset Simulation
          </button>
        </div>
        <div id="simStatus" class="status" role="status" aria-live="polite">
          No simulation actions executed yet.
        </div>
      </div>

      <div class="card">
        <h2 class="h2">Operational Notes</h2>
        <ul class="noteList">
          <li>This pilot runs in parallel with existing systems (no disruption).</li>
          <li>Actions are monitored and recorded for traceability.</li>
          <li>Use reset after simulation to return to baseline mode.</li>
        </ul>
      </div>
    </section>

    <section class="card" style="margin-top:12px;">
      <h2 class="h2">Recent Activity</h2>
      <ul id="activityLog" class="activity">
        <li>System ready. Awaiting simulation commands.</li>
      </ul>
    </section>
  </div>
  <script>
    (function () {
      const statusEl = document.getElementById("simStatus");
      const logEl = document.getElementById("activityLog");
      const blackFridayBtn = document.getElementById("blackFridayBtn");
      const resetBtn = document.getElementById("resetBtn");

      function setStatus(message, kind) {
        statusEl.textContent = message;
        statusEl.className = "status " + (kind || "");
      }

      function appendLog(message) {
        const item = document.createElement("li");
        const timestamp = new Date().toLocaleTimeString();
        item.textContent = "[" + timestamp + "] " + message;
        logEl.prepend(item);
      }

      async function trigger(endpoint, label, button) {
        blackFridayBtn.disabled = true;
        resetBtn.disabled = true;
        setStatus("Running " + label + "...", "");

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            credentials: "same-origin"
          });

          if (!res.ok) {
            throw new Error("Request failed with status " + res.status);
          }

          const payload = await res.json();
          const mode = payload.mode || "UNKNOWN";
          setStatus(label + " complete. Current mode: " + mode, "ok");
          appendLog(label + " completed (mode: " + mode + ")");
        } catch (err) {
          setStatus("Unable to run " + label + ". Please re-authenticate and retry.", "error");
          appendLog(label + " failed");
        } finally {
          blackFridayBtn.disabled = false;
          resetBtn.disabled = false;
          button.focus();
        }
      }

      blackFridayBtn.addEventListener("click", function () {
        trigger("/api/sim/black-friday", "Black Friday activation", blackFridayBtn);
      });

      resetBtn.addEventListener("click", function () {
        trigger("/api/sim/reset", "Simulation reset", resetBtn);
      });
    })();
  </script>
</body>
</html>`);
});

// ---------- demo API routes (JWT protected) ----------
app.post("/api/sim/black-friday", requireAuth, (req, res) => {
  // TODO: hook to your real spike engine
  res.json({
    ok: true,
    mode: "BLACK_FRIDAY",
    updatedAt: new Date().toISOString(),
  });
});

app.post("/api/sim/reset", requireAuth, (req, res) => {
  res.json({
    ok: true,
    mode: "NORMAL",
    updatedAt: new Date().toISOString(),
  });
});

// Express JSON parsing and fallback error handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Malformed JSON payload" });
  }
  return next(err);
});

app.use((req, res) => {
  if (isApiRequest(req)) {
    return res.status(404).json({ error: "Not found" });
  }
  return res.status(404).send("Not found");
});

// ---- tiny escape helper for HTML injection safety ----
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`OptiSchedule Enterprise running on ${PORT}`));



