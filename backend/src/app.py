from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
import tfidf
import os

origins = [
    os.getenv("RESUMETOOL_FRONTEND_URL_ORIGIN")
]


app = FastAPI(debug=True,root_path='/api')
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router=tfidf.router,
    prefix='/tfidf',
    tags=['Document Query', 'TF-IDF'],
)

@app.get('/test')
def basic_test():
    return Response(content='hello world')
