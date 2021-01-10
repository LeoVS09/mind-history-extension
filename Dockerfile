FROM node:14-stretch as base

# Need for developming for developming
RUN apt update && apt upgrade -y && \
    apt install -y bash bash-completion make curl

FROM base as second

WORKDIR /work

COPY package*.json yarn.lock /work/

RUN yarn --frozen-lockfile

FROM second

# This development image!
# And not store project actually
# But if need uncomment next line
# COPY . /app

EXPOSE 3000