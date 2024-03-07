from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple, Callable
from sklearn.feature_extraction.text import TfidfVectorizer
import scipy.spatial as sps
#from sentence_transformers import SentenceTransformer
from time import time

STOP_WORDS = "a, an, and, are, as, at, be, but, by, for, if, in, into, is, it, no, not, of, on, or, such, that, the, their, then, there, these, they, this, to, was, will, with".split(', ')

#sentence_transformer_nomic = SentenceTransformer("nomic-ai/nomic-embed-text-v1", trust_remote_code=True)
run_metrics = {
    'unique_visitors': set(),
    'job_bullets': 0,
    'requirements': 0,
    'run_time_hours': time()
}

origins = [
    "http://localhost:5173",
]
ip_md5_hashes = set()

class Requirement(BaseModel):
    id: int
    value: str

class Job(BaseModel):
    title: str
    bullets: List[str]

class StandardInputForm(BaseModel):
    jobs: List[Job]
    requirements: List[Requirement]

    def unpack_sources_ids_texts_titles(self):
        sources, ids, text, titles = [], [], [], []
        for job in self.resume:
            for bullet in job.bullets:
                sources.append('resume')
                ids.append([job.id, bullet.id])
                text.append(bullet.text)
                titles.append(job.title)
        
        for requirement in self.requirements:
            sources.append('requirements')
            ids.append(requirement.id)
            text.append(requirement.value)
            titles.append(None)

        return sources, ids, text, titles
    
    def enrich(
            self, vector_func:Callable, 
            distance_func:Callable=sps.distance.cosine,
        ):
        sources, ids, texts, titles = self.unpack_sources_ids_texts_titles()
        result = Enrichments(resume=[], requirements=[])

        vectors = vector_func(texts, sources, titles)

        for source_i, id_i, text_i, vector_i, title_i in zip(sources, ids, texts, vectors, titles):

            if source_i == 'resume':
                
                # might cause issues on refactor
                run_metrics['job_bullets'] += 1

                # make a new enriched job bullet
                job_id, bullet_id = id_i
                new_enriched_job_bullet = EnrichedJobBullet(
                    id=bullet_id, 
                    text=text_i, 
                    embedding=vector_i, 
                    distances=[],
                )
                
                # find the job it belongs to
                for resume_idx, job in enumerate(result.resume):
                    if job.id == job_id:
                        resume_idx_actual = resume_idx
                        result.resume[resume_idx_actual] = new_enriched_job_bullet
                        break
                else:
                    # make a new one if it isnt there
                    result.resume.append(EnrichedJob(id=job_id, title=title_i, bullets=[new_enriched_job_bullet]))


            elif source_i == 'requirements':
                # might cause issues on refactor
                run_metrics['requirements'] += 1

                new_enriched_requirement = EnrichedRequirement(id=id_i, value=text_i, embedding=vector_i, distances=[])
                result.requirements.append(new_enriched_requirement)
                        
        # add the distances on the resume side
        for job in result.resume:
            for bullet in job.bullets:
                for requirement in result.requirements:
                    bullet.distances.append((requirement.id, distance_func(bullet.embedding, requirement.embedding)))

        # add the distances on the requirement side
        for requirement in result.requirements:
            for job in result.resume:
                for bullet in job.bullets:
                    requirement.distances.append(
                        (
                            JobBulletKey(job_id = job.id, bullet_id = bullet.id), 
                            distance_func(bullet.embedding, requirement.embedding)
                        )
                    )
        
        return result


class JobBulletKey(BaseModel):
    job_id: int
    bullet_id: int

class Embedding(BaseModel):
    vector: List[float]

class EnrichedRequirement(Requirement):
    embedding: List[float]
    distances: List[Tuple[JobBulletKey, float]]

class EnrichedJobBullet(BaseModel):
    bullet: str
    embedding: List[float]
    distances: List[Tuple[int, float]]

class EnrichedJob(BaseModel):
    id: int
    title: str
    bullets: List[EnrichedJobBullet]

class Enrichments(BaseModel):
    resume: List[EnrichedJob]
    requirements: List[EnrichedRequirement]



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=["*"],
)

@app.middleware("http")
async def print_req(request: Request, call_next):
    print(request)

@app.get('/status/')
def get_status():
    return Response('hello')

@app.post('/enrich/tfidf/', response_model=Enrichments)
def enrich_with_tfidf(standard_input: StandardInputForm):

    tfidf = TfidfVectorizer(
        stop_words=STOP_WORDS,
    )
    
    def vector_func(texts, sources, titles):
        return tfidf.fit_transform(texts).todense().tolist()

    result = standard_input.enrich(vector_func=vector_func, distance_func=sps.distance.cosine)
    
    return result

# @app.post('/enrich/transformer/', response_model=Enrichments)
# def enrich_with_transformer(standard_input: StandardInputForm):
    
#     def vector_func(texts, sources, titles):
#         formatted_text = [
#             f'search_query: {te}' if s == 'requirements' else f'search_document: {te} ({ti})'
#             for te, s, ti in zip(texts, sources, titles)
#         ]
#         return sentence_transformer_nomic.encode(formatted_text)

#     result=standard_input.enrich(vector_func=vector_func, distance_func=sps.distance.cosine)

#     return result

@app.post('/analytics/share')
def analytics(ip_md5_hash:str, country:str):
    ip_md5_hashes.add(ip_md5_hash)

@app.get('/analytics/view')
def analytics():
    from copy import deepcopy
    response = deepcopy(run_metrics)
    response['unique_visitors'] = len(response['unique_visitors'])
    response['run_time_hours'] = (time() - response['run_time_hours'])/60
    return response