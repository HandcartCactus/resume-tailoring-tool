from fastapi import APIRouter
from sklearn.feature_extraction.text import TfidfVectorizer
import scipy.spatial as sps
import constants
import models

def format_func(job_title, bullet):
    return f"{job_title} {bullet}"
    
def vector_func(texts, sources):
    tfidf = TfidfVectorizer(
        stop_words=constants.STOP_WORDS,
    )
    tfidf = tfidf.fit(texts)
    vecs = tfidf.transform(texts).todense().tolist()
    return vecs

def distance_func(jbv, rv):
    return [[sps.distance.cosine(jbvi, rvi) for rvi in rv] for jbvi in jbv]
    

router = APIRouter()

@router.post('/distgraph', response_model=models.DistGraph)
def enrich_with_tfidf(standard_input: models.StandardInputForm):
    return standard_input.to_distgraph(
        format_func=format_func,
        vector_func=vector_func,
        distance_func=distance_func,
    )

