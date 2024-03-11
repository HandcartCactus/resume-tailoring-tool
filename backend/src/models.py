from pydantic import BaseModel, Field
from typing import List, Tuple, Callable, Literal

VectorFunc = Callable[
                [
                    List[str], 
                    List[Literal['jobs', 'requirements']], 
                ], 
                List[List[float]]
            ]

DistanceFunc = Callable[
    [
        List[List[float]],
        List[List[float]]
    ],
    List[List[float]]
]

FormatFunc = Callable[[str, str], str]

class Node(BaseModel):
    id: str
    value: str
    group: str

class Edge(BaseModel):
    source: str
    target: str
    value: float

class DistGraph(BaseModel):
    nodelist: List[Node]
    edgelist: List[Edge]


class Job(BaseModel):
    title: str
    bullets: List[str]

class StandardInputForm(BaseModel):
    jobs: List[Job]
    requirements: List[str]

    def flatbullet(self, format_func:FormatFunc):
        for j in self.jobs:
            for b in j.bullets:
                yield format_func(j.title, b)
    
    def jbv_rv_vectors(self, jb: List[str], r: List[str], vector_func: VectorFunc):
        sources = ['jobs' for _ in jb] + ['requirements' for _ in r]
        jb_plus_r = vector_func(jb+r, sources)
        jbv, rv = jb_plus_r[:len(jb)], jb_plus_r[len(jb):]
        return jbv, rv
    
    def distmat(self, format_func: FormatFunc, vector_func: VectorFunc, distance_func: DistanceFunc):
        jb = list(self.flatbullet(format_func=format_func))
        jbv, rv = self.jbv_rv_vectors(jb=jb, r=self.requirements, vector_func=vector_func)
        d = distance_func(jbv, rv)
        return d
    
    def to_distgraph(self, format_func: FormatFunc, vector_func: VectorFunc, distance_func: DistanceFunc):
        
        nodelist: List[Node] = []
        edgelist: List[Edge] = []
        for jidx, job in enumerate(self.jobs):
            job_node_id = f"job{jidx}"
            nodelist.append(Node(id=job_node_id, value=job.title, group='job'))
            for bidx, bullet in enumerate(job.bullets):
                bullet_node_id = f"job{jidx}bullet{bidx}"
                nodelist.append(Node(id=bullet_node_id, value=bullet, group='bullet'))
                edgelist.append(Edge(source=job_node_id, target=bullet_node_id, value=-1))

        for ridx, req in enumerate(self.requirements):
            req_node_idx = f"req{ridx}"
            nodelist.append(Node(id=req_node_idx, value=req, group='req'))
        
        jbv_idx = 0
        rv_idx = 0
        distmat = self.distmat(format_func, vector_func, distance_func)
        for jidx, job in enumerate(self.jobs):
            job_node_id = f"job{jidx}"

            for bidx, bullet in enumerate(job.bullets):
                bullet_node_id = f"job{jidx}bullet{bidx}"

                rv_idx = 0
                for ridx, req in enumerate(self.requirements):
                    req_node_idx = f"req{ridx}"

                    edgelist.append(Edge(source=bullet_node_id, target=req_node_idx, value=distmat[jbv_idx][rv_idx]))
                    rv_idx += 1
            
                jbv_idx += 1
    
        return DistGraph(nodelist=nodelist, edgelist=edgelist)