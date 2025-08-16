FROM node:18-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

RUN npm install -g typescript nodemon

# COPY ./src ./src

# RUN npm run build

CMD ["npm", "run", "watch"]