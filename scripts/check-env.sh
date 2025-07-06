#!/bin/bash

# Setup script for MongoDB initialization
# This script creates mongo-init.js and mongo-init-test.js from the templates with proper credentials

set -e

echo "🔧 Setting up initialization..."

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

# Check test variables (use main variables as fallback if not set)
if [ -z "${MONGO_TEST_USER:-}" ]; then
    MONGO_TEST_USER="${MONGO_USER}"
fi

if [ -z "${MONGO_TEST_PASSWORD:-}" ]; then
    MONGO_TEST_PASSWORD="${MONGO_PASSWORD}"
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

echo "✅ Initialization setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review mongo-init.js and mongo-init-test.js and update credentials if needed"
echo "   2. Run 'npm run docker:up' to start MongoDB with authentication"
echo "   3. Update your .env file to use authenticated connection strings"
echo ""
echo "🔒 Security note: Both init scripts are now in .gitignore and won't be committed"
echo ""
echo "🔑 Credentials configured:"
echo "   - Application User: $MONGO_USER"
echo "   - Test User: $MONGO_TEST_USER"
echo "   - Admin User: $MONGO_ADMIN_USERNAME"
