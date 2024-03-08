FROM amazonlinux:latest

ARG REPO_URL
ARG REPO_DIR
ARG FRONTEND_DIR
ARG NGINX_CONF_PATH
ARG SITE_DOMAIN

RUN yum install -y npm python3 nginx git

RUN git clone $REPO_URL $REPO_DIR

WORKDIR $FRONTEND_DIR
RUN npm install && npm run build

RUN echo "server {" > $NGINX_CONF_PATH
RUN echo "  listen 80;" >> $NGINX_CONF_PATH
RUN echo "  server_name ${SITE_DOMAIN};" >> $NGINX_CONF_PATH
RUN echo "  location / {" >> $NGINX_CONF_PATH
RUN echo "    root /app/$REPO_DIR/$SUBFOLDER/dist;" >> $NGINX_CONF_PATH
RUN echo "    index index.html;" >> $NGINX_CONF_PATH
RUN echo "  }" >> $NGINX_CONF_PATH
RUN echo "}" >> $NGINX_CONF_PATH

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# install dependencies


# git clone application
ARG $REPO_URL
ARG $REPO_DIR
RUN git clone $REPO_URL $REPO_DIR
WORKDIR $REPO_DIR

# frontend setup: npm install deps & build
ARG $FRONTEND_DIR=frontend
RUN yum install -y npm
WORKDIR $FRONTEND_DIR
RUN npm install
RUN npm run build

# backend setup: python venv pip install
ARG $BACKEND_DIR=backend
WORKDIR $BACKEND_DIR
RUN python -m venv venv
RUN 
# uvicorn app:app --port $FASTAPI_PORT && nginx -g "daemon off;"