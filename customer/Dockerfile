FROM node:18

WORKDIR /app/customer

# COPY package.json .
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8007

CMD ["npm", "start"]
# CMD ["nodemon", "src/index.js"]