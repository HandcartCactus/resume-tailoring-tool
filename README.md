# Resume Tailoring Tool
## Intro & Demo
[![Intro and Demo Video](https://img.youtube.com/vi/-xjNAUPHewo/0.jpg)](https://www.youtube.com/watch?v=-xjNAUPHewo)

_An intro and demo video for the tool._

## Import / Export JSON File Examples
+ [Requirements](frontend/sample_data/Requirements_silly.json)
+ [Resume](frontend/sample_data/Résumé_silly.json)

## Development
### Frontend Dev
```bash
cd frontend
npm install && npm run dev 
```
### Backend Dev
```bash
cd backend
# activate venv
cd src
uvicorn --port 20595 app:app --reload --env-file ./.env.development
```

## Production
| Variable | Sensible Default (Amazon Linux) |
| -------- | ------------------------ |
| **INSTALL LOCATION** | `/home/ec2-user/repo` |
| **WEB COMMON** | `/var/www/app/dist` |


### Install
#### Common Install
```bash
sudo yum install -y nginx npm git python3
git clone https://github.com/HandcartCactus/resume-tailoring-tool.git /home/ec2-user/repo;
```
#### Frontend Install
```bash
#cd /home/ec2-user/repo/frontend

npm install
npm run build
sudo mkdir /var/www/
sudo mkdir /var/www/app
sudo cp -R /home/ec2-user/repo/frontend/dist /var/www/app
# Modify filename & internal url before copying if you're not me
sudo cp /home/ec2-user/repo/frontend/resumetool.eliasjaffe.com.conf /etc/nginx/conf.d
```
##### Install SSL/TLS Cert (if needed)
```bash
sudo yum install certbot
sudo certbot certonly --standalone -d resumetool.eliasjaffe.com
sudo systemctl start certbot-renew.timer
```
#### Backend Install
```bash
cd /home/ec2-user/repo/backend
python3 -m venv venv
source /home/ec2-user/repo/backend/venv/bin/activate
python3 -m pip install -r /home/ec2-user/repo/backend/requirements.txt
deactivate
```
### Run Deployment
#### Frontend Run
```bash
sudo nginx 
```
#### Backend Run
```bash
cd /home/ec2-user/repo/backend
source venv/bin/activate
cd src
nohup uvicorn app:app --host 0.0.0.0 --port 20595 --workers 4 --env-file ./.env.development &
```

### Stop Deployment
#### Frontend Stop
See [NGINX stop options](https://docs.nginx.com/nginx/admin-guide/basic-functionality/runtime-control/#controlling-nginx)
```bash
# one of these:
# graceful stop
sudo nginx -s quit
# i'm serious
sudo nginx -s stop
# don't make me call your mother
kill -9 $(pgrep --full nginx)
```
#### Backend Stop
```bash
kill $(pgrep --full "/home/ec2-user/repo/backend/venv/bin/python3")
```


