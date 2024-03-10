FROM amazonlinux:latest

# git clone application
RUN echo "Installing git & repo"
RUN yum install -y git
ARG $REPO_URL
ARG $REPO_DIR
RUN git clone $REPO_URL $REPO_DIR
WORKDIR $REPO_DIR

# frontend setup: npm install deps & build
RUN echo "installing npm & front-end deps"
RUN yum install -y npm
ARG $FRONTEND_DIR=frontend
WORKDIR $FRONTEND_DIR
RUN npm install
RUN npm run build

# backend setup: python venv pip install
RUN echo "installing python & back-end deps"
RUN yum install -y python3
ARG $BACKEND_DIR=backend
WORKDIR $BACKEND_DIR
RUN python -m venv venv
RUN source .venv/bin/activate
RUN python -m pip install --file requirements.txt

# install nginx and create config
RUN echo "installing front end web server"
RUN yum install -y nginx

ARG NGINX_CONF_PATH=/etc/nginx/conf.d
ARG SITE_DOMAIN
RUN echo "server {" > $NGINX_CONF_PATH
RUN echo "  listen 80;" >> $NGINX_CONF_PATH
RUN echo "  server_name ${SITE_DOMAIN};" >> $NGINX_CONF_PATH
RUN echo "  location / {" >> $NGINX_CONF_PATH
RUN echo "    root ${REPO_DIR}/${FRONTEND_DIR}/dist;" >> $NGINX_CONF_PATH
RUN echo "    index index.html;" >> $NGINX_CONF_PATH
RUN echo "  }" >> $NGINX_CONF_PATH
RUN echo "}" >> $NGINX_CONF_PATH

WORKDIR /
RUN echo "ngnix"

EXPOSE 80
CMD ["nginx", "-g", "daemon off", "&&", ""]

# uvicorn app:app --port $FASTAPI_PORT && nginx -g "daemon off;"