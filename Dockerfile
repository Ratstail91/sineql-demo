FROM node:16
WORKDIR "/app"
COPY package*.json ./
RUN npm install
COPY . /app
EXPOSE 4000
ENTRYPOINT ["bash", "-c"]
CMD ["npm start"]