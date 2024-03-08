from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
import tfidf

origins = [
    "http://localhost:5173",
]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.post('/session/start/')
def print_request_ip(request: Request):
    print('New session from:', request.client.host)

app.include_router(
    router=tfidf.router,
    prefix='/tfidf',
    tags=['Document Query', 'TF-IDF'],
)
