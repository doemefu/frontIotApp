# module install
FROM arm64v8/node:20-alpine as module-install-stage
# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN apk add npm
RUN npm install --production

# build
FROM arm64v8/node:20-alpine as build-stage
COPY --from=module-install-stage /app/node_modules/ /app/node_modules
WORKDIR /app
COPY . .
RUN npm run build

# serve
FROM arm64v8/node:20-alpine
COPY --from=build-stage /app/build/ /app/build
RUN npm install -g serve
# start app
CMD serve -s /app/build -l 33