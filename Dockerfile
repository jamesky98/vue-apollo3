FROM node:16-alpine
RUN yarn create vite vue-apollo3 --template vue
COPY vite* /vue-apollo3/
WORKDIR /vue-apollo3
RUN yarn install
RUN npm i -g npm
COPY /dist /vue-apollo3/dist
CMD npx vite preview --port 4173
# CMD npm run preivew
EXPOSE 4173