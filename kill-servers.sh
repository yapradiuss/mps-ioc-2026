#!/bin/bash

# Kill All Servers Script
# Kills all Node.js servers running on ports 3000, 3001, and other common ports

echo "🔍 Searching for running servers..."

# Kill processes on common ports
PORTS=(3000 3001 3002 3003 8080 5000)
KILLED=false

for PORT in "${PORTS[@]}"; do
    PID=$(lsof -ti:$PORT 2>/dev/null)
    if [ ! -z "$PID" ]; then
        echo "🛑 Killing process on port $PORT (PID: $PID)"
        kill -9 $PID 2>/dev/null
        KILLED=true
    fi
done

# Kill Node.js server processes
echo "🔍 Searching for Node.js server processes..."

# Kill backend server
pkill -f "node.*server.js" 2>/dev/null && echo "✅ Killed backend server (server.js)" && KILLED=true
pkill -f "ts-node.*server.ts" 2>/dev/null && echo "✅ Killed backend server (server.ts)" && KILLED=true
pkill -f "nodemon.*server" 2>/dev/null && echo "✅ Killed nodemon server" && KILLED=true

# Kill Next.js frontend server
pkill -f "next dev" 2>/dev/null && echo "✅ Killed Next.js dev server" && KILLED=true
pkill -f "next start" 2>/dev/null && echo "✅ Killed Next.js production server" && KILLED=true

# Kill any node processes in the project directories
if [ -d "/Users/mac/Development Arfi/Dashboard-Dev-PBT/MPSepang-IOC 17112025" ]; then
    pkill -f "mpsepang-shadcn" 2>/dev/null && echo "✅ Killed mpsepang processes" && KILLED=true
fi

if [ "$KILLED" = true ]; then
    echo ""
    echo "✅ All servers killed successfully!"
else
    echo ""
    echo "ℹ️  No running servers found"
fi

echo ""
echo "📊 Checking for remaining processes on ports 3000-3003..."
for PORT in "${PORTS[@]}"; do
    PID=$(lsof -ti:$PORT 2>/dev/null)
    if [ ! -z "$PID" ]; then
        echo "⚠️  Port $PORT is still in use (PID: $PID)"
    else
        echo "✓ Port $PORT is free"
    fi
done
