// server.js - Tiny LiveKit token server for the classroom (CommonJS)

const express = require("express");
const { AccessToken } = require("livekit-server-sdk");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = 3000;

// Same API key/secret you put in classroom.yaml
const API_KEY = "CLASSROOM_KEY";
const API_SECRET = "devsecret";
const ROOM_NAME = "classroom";

// Serve static files from ./public
app.use(express.static("public"));

// Default route points to the student listener UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "student.html"));
});

// ---- TEACHER TOKEN ----
app.get("/token/teacher", async (req, res) => {
  const identity = "teacher";

  const at = new AccessToken(API_KEY, API_SECRET, {
    identity,
    ttl: "24h",
  });

  at.addGrant({
    room: ROOM_NAME,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  res.json({
    identity,
    token: await at.toJwt(),
  });
});

// ---- STUDENT TOKEN (listen-only, unique identity) ----
app.get("/token/student", async (req, res) => {
  const identity = "student-" + crypto.randomBytes(4).toString("hex");

  const at = new AccessToken(API_KEY, API_SECRET, {
    identity,
    ttl: "24h",
  });

  at.addGrant({
    room: ROOM_NAME,
    roomJoin: true,
    canPublish: false,   // students are listeners only
    canSubscribe: true,
  });

  res.json({
    identity,
    token: await at.toJwt(),
  });
});

app.listen(PORT, () => {
  console.log(`Token server running at http://localhost:${PORT}`);
});
