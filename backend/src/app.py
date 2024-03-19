from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
import tfidf

origins = [
    'http://localhost',
    #'http://127.0.0.1'
    #"http://localhost:5173",
    #"http://resumetool.eliasjaffe.com",
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
