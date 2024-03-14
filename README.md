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
| `INSTALL LOCATION` | `/home/ec2-user` |
| `WEB COMMON` | `/var/www` |


### Install
#### Common Install
```bash
sudo yum install -y nginx npm git python3
git clone https://github.com/HandcartCactus/resume-tailoring-tool.git <INSTALL LOCATION>/repo;
```
#### Frontend Install
```bash
cd <INSTALL LOCATION>/repo/frontend
npm install
npm run build
sudo mkdir <WEB COMMON>
sudo mkdir <WEB COMMON>/app
sudo cp -R <INSTALL LOCATION>/repo/frontend/dist <WEB COMMON>/app
# Modify filename & internal url before copying if you're not me
sudo cp <INSTALL LOCATION>/repo/frontend/resumetool.eliasjaffe.com.conf /etc/nginx/conf.d
```
#### Backend Install
```bash
cd <INSTALL LOCATION>/repo/backend
python3 -m venv venv
source <INSTALL LOCATION>/repo/backend/venv/bin/activate
python3 -m pip install -r <INSTALL LOCATION>/repo/backend/requirements.txt
deactivate
```
### Run Deployment
#### Frontend Run
```bash
sudo nginx 
```
#### Backend Run
```bash
cd <INSTALL LOCATION>/repo/backend
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
kill $(pgrep --full "<INSTALL LOCATION>/repo/backend/venv/bin/python3")
```


