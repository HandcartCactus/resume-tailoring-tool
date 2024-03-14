# Resume Tailoring Tool

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
uvicorn --port 20595 app:app --reload
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
nohup uvicorn app:app --host 0.0.0.0 --port 20595 --workers 4 &
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


