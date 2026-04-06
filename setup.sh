#!/bin/bash

# Chat App Quick Start Script

echo "Starting Chat Application Setup..."
echo ""

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Error installing server dependencies"
    exit 1
fi

# Install client dependencies
echo ""
echo "Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "Error installing client dependencies"
    exit 1
fi

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client"
echo "  npm start"
echo ""
echo "Make sure MongoDB is running!"
echo ""
