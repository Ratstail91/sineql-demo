FROM node:18-bullseye-slim
WORKDIR "/app"
COPY package*.json ./
RUN npm install
COPY . /app
EXPOSE 4000
ENTRYPOINT ["bash", "-c"]
CMD ["npm start"]