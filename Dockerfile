FROM node:alpine
WORKDIR /app
COPY app/package.json /app
COPY app/app.js /app
RUN npm install
CMD ["node","app.js"]