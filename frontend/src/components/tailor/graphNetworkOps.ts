
export interface GraphNode {
    id: string;
    value: string;
    group: string;
} 

export interface GraphEdge {
    source: string;
    target: string;
    value: number;
}

export interface GraphNetwork {
    nodelist: GraphNode[];
    edgelist: GraphEdge[];
}

export class GraphNetwork {
    constructor(nodelist: GraphNode[], edgelist:GraphEdge[]) {
        this.nodelist = nodelist;
        this.edgelist = edgelist;
    }

    uniqueNodeId() {
        let proposedNum = this.nodelist.length;
        while (this.nodeIdExists(`${proposedNum}`)) {
            proposedNum += 1;
        }
        return `${proposedNum}`
    }

    getNodesWithGroup(groupName: string) {
        return this.nodelist.filter((node)=>node.group===groupName);
    }

    getNodesWithKeyword(value: string) {
        return this.nodelist.filter((node)=>(node.value.includes(value))) as GraphNode[];
    }

    indexOfNode(nodeId: string, strict: boolean = true): number {
        const idx = this.nodelist.findIndex((node)=> node.id === nodeId)
        if (strict && idx<0) {
            throw Error(`Node ${nodeId} does not exist.`)
        }
        return idx
    }

    nodeIdExists(nodeId: string) {
        return this.indexOfNode(nodeId, false) > 0
    }

    createNode(node: GraphNode) {
        if (this.nodeIdExists(node.id)) {
            node.id = this.uniqueNodeId()
        }
        this.nodelist.push(node)
    }

    readNode(nodeId: string) {
        return this.nodelist[this.indexOfNode(nodeId)];
    }

    updateNode(updatedNode: GraphNode) {
        this.nodelist[this.indexOfNode(updatedNode.id)] = updatedNode;
    }

    updateNodeValue(nodeId:string, newValue: string) {
        this.nodelist[this.indexOfNode(nodeId)].value = newValue;
    }

    updateNodeGroup(nodeId:string, newGroup: string) {
        this.nodelist[this.indexOfNode(nodeId)].group = newGroup;
    }

    deleteNode(nodeId:string) {
        this.nodelist.splice(this.indexOfNode(nodeId), 1);
        this.deleteEdgesTouching(nodeId);
    }

    indexOfEdge(source: string, target: string, strict: boolean = true) {
        const idx = this.edgelist.findIndex((edge)=> edge.source === source && edge.target === target)
        if (strict && idx<0) {
            throw Error(`Edge ${source}->${target} does not exist.`)
        }
        return idx
    }

    edgeExists(source: string, target: string) {
        return this.indexOfEdge(source, target, false) > 0
    }

    createEdge(edge: GraphEdge) {
        if (!this.nodeIdExists(edge.source)) {
            throw Error(`Node ${edge.source} does not exist.`)
        }
        if (!this.nodeIdExists(edge.target)) {
            throw Error(`Node ${edge.target} does not exist.`)
        }
        if (this.edgeExists(edge.source, edge.target)) {
            throw Error(`Edge ${edge.source}->${edge.target} already exists.`)
        }
        this.edgelist.push(edge)
    }

    readEdge(source: string, target: string) {
        return this.edgelist[this.indexOfEdge(source, target)];
    }

    updateEdge(edge: GraphEdge) {
        this.edgelist[this.indexOfEdge(edge.source, edge.target)] = edge;
    }

    updateEdgeValue(source: string, target: string, newValue:number) {
        this.edgelist[this.indexOfEdge(source, target)].value = newValue;
    }

    deleteEdge(source: string, target: string) {
        return this.nodelist.splice(this.indexOfEdge(source, target), 1);
    }

    edgeTouches(edge: GraphEdge, nodeId: string) {
        return edge.source === nodeId || edge.target === nodeId
    }

    deleteEdgesTouching(nodeId: string) {
        this.edgelist = this.edgelist.filter((e)=> !this.edgeTouches(e, nodeId))
    }

    neighborhood(nodeId: string, inplace: boolean = false) {
        let nghe: GraphEdge[] = this.edgelist.filter((e)=>this.edgeTouches(e, nodeId));
        let nghn: GraphNode[] = this.nodelist.filter((otherNode)=>nghe.some((e)=>this.edgeTouches(e, otherNode.id)));
        if (!inplace) {
            nghn = structuredClone(nghn);
            nghe = structuredClone(nghe);
        }
        return new GraphNetwork(nghn, nghe);
    }

    neighborNodes(nodeId: string, group?: string, edgeValueMax?: number) {
        let neighborNodesA: GraphNode[] = [];
        for (let edge of this.edgelist) {
            if (edge.value < (edgeValueMax == null ? Infinity : edgeValueMax)) {
                let sourceNodeIsId = nodeId === edge.source;
                let targetNodeIsId = nodeId === edge.target;
                let otherNodeId;
                if (sourceNodeIsId) {
                    otherNodeId = edge.target;
                } else if (targetNodeIsId) {
                    otherNodeId = edge.source;
                }
                let otherNodeIndex = !!otherNodeId? this.indexOfNode(otherNodeId) : undefined;
                let otherNode = !!otherNodeIndex? this.nodelist[otherNodeIndex] : undefined;
                let otherNodeGroup = !!otherNode? otherNode.group : undefined;
                let otherNodeCanBeIncluded = !!otherNodeGroup && ((!!group && otherNodeGroup === group) || !group);
                if (otherNodeCanBeIncluded && !!otherNode) {
                    neighborNodesA.push(otherNode);
                }
            }
        }
        return neighborNodesA;
    }

    neighborNodesAndEdgeWt(nodeId: string, group?: string, edgeValueMax?: number) {
        let neighborNodesA: {node: GraphNode, edgeWt: number}[] = [];
        for (let edge of this.edgelist) {
            if (edge.value < (edgeValueMax == null ? Infinity : edgeValueMax)) {
                let sourceNodeIsId = nodeId === edge.source;
                let targetNodeIsId = nodeId === edge.target;
                let otherNodeId;
                if (sourceNodeIsId) {
                    otherNodeId = edge.target;
                } else if (targetNodeIsId) {
                    otherNodeId = edge.source;
                }
                let otherNodeIndex = !!otherNodeId? this.indexOfNode(otherNodeId) : undefined;
                let otherNode = !!otherNodeIndex? this.nodelist[otherNodeIndex] : undefined;
                let otherNodeGroup = !!otherNode? otherNode.group : undefined;
                let otherNodeCanBeIncluded = !!otherNodeGroup && ((!!group && otherNodeGroup === group) || !group);
                if (otherNodeCanBeIncluded && !!otherNode) {
                    neighborNodesA.push({node: otherNode, edgeWt: edge.value});
                }
            }
        }
        return neighborNodesA.sort((a,b)=>(a.edgeWt - b.edgeWt));
    }

    clone() {
        return new GraphNetwork(structuredClone(this.nodelist), structuredClone(this.edgelist));
    }

    getEdgesByValue(valueFilter: Function) {
        return this.edgelist.filter((e)=>valueFilter(e.value))
    }



    getNeighborsWithGroup(nodeId: string, group: string, keepSelf: boolean = false, inplace: boolean =false) {
        let g = this.neighborhood(nodeId, inplace);
        
        for (let node of g.clone().nodelist) {
            if (node.group === group || ((node.id === nodeId) && keepSelf)) {
                // keep... logic easier to understand when inverted
            } else {
                g.deleteEdgesTouching(node.id);
                g.deleteNode(node.id);
            }
        }

        return g;
    }

    getNeighborsWithValueLt(nodeId: string, edgeValueMax: number, inplace:boolean=false) {
        let g = this.neighborhood(nodeId, inplace);

        for (let edge of g.clone().edgelist) {
            if (edge.value >= edgeValueMax) {
                g.deleteEdge(edge.source, edge.target);
                if (edge.source === nodeId) {
                    g.deleteNode(edge.target);
                } else if (edge.target === nodeId) {
                    g.deleteNode(edge.source);
                }
               
            }
        }
        return g;
    }
}