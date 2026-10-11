const { spawn } = require("child_process");
const path = require("path");

const serverDirectory = __dirname;
const frontendDirectory = path.resolve(__dirname, "../frontend");
const viteEntry = path.join(frontendDirectory, "node_modules/vite/bin/vite.js");

const api = spawn(process.execPath, ["server.js"], {
  cwd: serverDirectory,
  env: process.env,
  stdio: "inherit",
});

const frontend = spawn(process.execPath, [viteEntry, "--host", "localhost", "--strictPort"], {
  cwd: frontendDirectory,
  env: process.env,
  stdio: "inherit",
});

const children = [api, frontend];
let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exitCode = exitCode;
}

for (const [name, child] of [["API", api], ["frontend", frontend]]) {
  child.on("error", (error) => {
    console.error(`Unable to start the ${name}: ${error.message}`);
    stop(1);
  });
  child.on("exit", (code, signal) => {
    if (stopping) return;
    console.error(`${name} stopped${signal ? ` (${signal})` : ` with exit code ${code}`}. Stopping the other process.`);
    stop(code || 1);
  });
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

console.log("Starting API at http://localhost:5000 and frontend at http://localhost:5173/pankhudi");
