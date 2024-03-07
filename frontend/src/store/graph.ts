import { defineStore } from 'pinia';

type GraphNode = {
    id: string;
    value: string;
    group: string;
} 

type GraphEdge = {
    source: string;
    target: string;
    value: number;
}

export const useDocGraph = defineStore(
    'docGraph', 
    {
        state: () => (
            {
                nodes: [
                    {id: '0', value: '', group: ''},
                    {id: '1', value: '', group: ''},
                ] as GraphNode[],

                edges: [
                    {source: '0', target: '1', value: 1.0},
                ] as GraphEdge[],
            }
        ),
    getters: {
        
    },
    actions: {
        uniqueNodeId: function() {
            let proposedNum = this.nodes.length;
            while (this.nodeIdExists(`${proposedNum}`)) {
                proposedNum += 1;
            }
            return `${proposedNum}`
        },

        getNodesWithGroup: function(groupName: string) {
            return this.nodes.filter((node)=>node.group===groupName);
        },

        getNodesWithKeyword: function(value: string) {
            return this.nodes.filter((node)=>(node.value.includes(value))) as GraphNode[];
        },

        indexOfNode: function(nodeId: string, strict: boolean = true): number {
            const idx = this.nodes.findIndex((node)=> node.id === nodeId)
            if (strict && idx<0) {
                throw Error(`Node ${nodeId} does not exist.`)
            }
            return idx
        },

        nodeIdExists: function(nodeId: string) {
            return this.indexOfNode(nodeId, false) > 0
        },

        createNode: function(node: GraphNode) {
            if (this.nodeIdExists(node.id)) {
                node.id = this.uniqueNodeId()
            }
            this.nodes.push(node)
        },

        readNode: function(nodeId: string) {
            return this.nodes[this.indexOfNode(nodeId)];
        },

        updateNode: function(updatedNode: GraphNode) {
            this.nodes[this.indexOfNode(updatedNode.id)] = updatedNode;
        },

        updateNodeValue: function(nodeId:string, newValue: string) {
            this.nodes[this.indexOfNode(nodeId)].value = newValue;
        },

        updateNodeGroup: function(nodeId:string, newGroup: string) {
            this.nodes[this.indexOfNode(nodeId)].group = newGroup;
        },

        deleteNode: function(nodeId:string) {
            this.nodes.splice(this.indexOfNode(nodeId), 1);
            this.deleteEdgesTouching(nodeId);
        },

        indexOfEdge: function(source: string, target: string, strict: boolean = true) {
            const idx = this.edges.findIndex((edge)=> edge.source === source && edge.target === target)
            if (strict && idx<0) {
                throw Error(`Edge ${source}->${target} does not exist.`)
            }
            return idx
        },

        edgeExists: function(source: string, target: string) {
            return this.indexOfEdge(source, target, false) > 0
        },

        createEdge: function(edge: GraphEdge) {
            if (!this.nodeIdExists(edge.source)) {
                throw Error(`Node ${edge.source} does not exist.`)
            }
            if (!this.nodeIdExists(edge.target)) {
                throw Error(`Node ${edge.target} does not exist.`)
            }
            if (this.edgeExists(edge.source, edge.target)) {
                throw Error(`Edge ${edge.source}->${edge.target} already exists.`)
            }
            this.edges.push(edge)
        },

        readEdge: function(source: string, target: string) {
            return this.edges[this.indexOfEdge(source, target)];
        },

        updateEdge: function(edge: GraphEdge) {
            this.edges[this.indexOfEdge(edge.source, edge.target)] = edge;
        },

        updateEdgeValue: function(source: string, target: string, newValue:number) {
            this.edges[this.indexOfEdge(source, target)].value = newValue;
        },

        deleteEdge: function(source: string, target: string) {
            return this.nodes.splice(this.indexOfEdge(source, target), 1);
        },

        edgeTouches: function(edge: GraphEdge, nodeId: string) {
            return edge.source === nodeId || edge.target === nodeId
        },

        deleteEdgesTouching: function(nodeId: string) {
            this.edges = this.edges.filter((e)=> !this.edgeTouches(e, nodeId))
        },

        neighborhood: function(nodeId: string) {
            let nghe: GraphEdge[] = this.edges.filter((e)=>this.edgeTouches(e, nodeId));
            let nghn: GraphNode[] = this.nodes.filter((otherNode)=>nghe.some((e)=>this.edgeTouches(e, otherNode.id)));
            return {
                nodes: nghn,
                edges: nghe,
            }
        },

        getEdgesByValue: function(valueFilter: Function) {
            return this.edges.filter((e)=>valueFilter(e.value))
        },
    },
});