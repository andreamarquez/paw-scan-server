#!/bin/bash

# Setup script for MongoDB initialization
# This script creates mongo-init.js from the template with proper credentials

set -e

echo "🔧 Setting up MongoDB initialization script..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one from env.example first."
    echo "   cp env.example .env"
    exit 1
fi

# Load environment variables from .env file
while IFS= read -r line; do
    # Skip comments and empty lines
    if [[ ! "$line" =~ ^[[:space:]]*# ]] && [[ -n "$line" ]]; then
        export "$line"
    fi
done < .env

# Check if required variables are set and not empty
MISSING_VARS=()

if [ -z "${MONGO_USER:-}" ]; then
    MISSING_VARS+=("MONGO_USER")
fi

if [ -z "${MONGO_PASSWORD:-}" ]; then
    MISSING_VARS+=("MONGO_PASSWORD")
fi

if [ -z "${MONGO_ADMIN_USERNAME:-}" ]; then
    MISSING_VARS+=("MONGO_ADMIN_USERNAME")
fi

if [ -z "${MONGO_ADMIN_PASSWORD:-}" ]; then
    MISSING_VARS+=("MONGO_ADMIN_PASSWORD")
fi

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing or empty required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please update your .env file with the required credentials."
    echo "See env.example for the required variables."
    exit 1
fi

# Create mongo-init.js from template
if [ -f "./scripts/mongo-init.template.js" ]; then
    cp ./scripts/mongo-init.template.js ./scripts/mongo-init.js
    echo "✅ Created mongo-init.js from template"
else
    echo "❌ mongo-init.template.js not found"
    exit 1
fi

echo "✅ MongoDB initialization setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review mongo-init.js and update credentials if needed"
echo "   2. Run 'npm run docker:up' to start MongoDB with authentication"
echo "   3. Update your .env file to use authenticated connection strings"
echo ""
echo "🔒 Security note: mongo-init.js is now in .gitignore and won't be committed"
echo ""
echo "🔑 Credentials configured:"
echo "   - Application User: $MONGO_USER"
echo "   - Admin User: $MONGO_ADMIN_USERNAME"
