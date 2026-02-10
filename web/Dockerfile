FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build the application
# We set valid API URL for build time if SSG needs it, though usually client-side.
# If using valid Supabase, we might need env vars here.
ENV NEXT_PUBLIC_API_URL=http://localhost:3000

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start", "--", "-p", "3001"]
