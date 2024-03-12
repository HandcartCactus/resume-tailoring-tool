#!/bin/bash

# sudo rm -rf /home/e2-user/repo;
# sudo rm -rf /var/www/app;
# sudo rm /etc/nginx/conf.d/resumetool.eliasjaffe.com.conf;
set -x;

sudo yum install -y nginx npm git python3;
git clone https://github.com/HandcartCactus/resume-tailoring-tool.git /home/ec2-user/repo;

cd /home/ec2-user/repo/frontend;
npm install;
npm run build;
sudo mkdir /var/www;
sudo mkdir /var/www/app;
sudo cp -R /home/ec2-user/repo/frontend/dist /var/www/app;
sudo cp /home/ec2-user/repo/frontend/resumetool.eliasjaffe.com.conf /etc/nginx/conf.d;
sudo nginx;

cd /home/ec2-user/repo/backend/;
python3 -m venv venv;
source /home/ec2-user/repo/backend/venv/bin/activate;
python3 -m pip install -r /home/ec2-user/repo/backend/requirements.txt;
cd /home/ec2-user/repo/backend/src;
uvicorn --port 20595 app:app;