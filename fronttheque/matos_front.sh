#!/bin/bash

# Navigate to the fronttheque directory
# cd /home/nomena/Matostheque_App/fronttheque/

# Set NODE_ENV to production
export NODE_ENV=production

# Build the front-end application with NODE_ENV set to production
npm run build

# Start the front-end server
npm run start &

# npm run start
