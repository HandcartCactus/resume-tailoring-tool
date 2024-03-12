from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
import tfidf

origins = [
    'http://localhost',
    #"http://localhost:5173",
    #"http://resumetool.eliasjaffe.com",
]


app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(
    router=tfidf.router,
    prefix='/tfidf',
    tags=['Document Query', 'TF-IDF'],
)
