<template>
        <div :id="SVG_CONTAINER_DIV_ID"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as d3 from "d3";

// unique div id we will load graph network into
const SVG_CONTAINER_DIV_ID = "force-network-svg-container-lWOHS1nBckdatG8L";
const SVG_ELEMENT_ID = "force-network-svg-element";

const NODE_SIZES: { [group: string]: number } = {
    job: 5,
    bullet: 10,
    req: 15,
}

const NODE_COLORS: { [group: string]: string } = {
    job: 'gray',
    bullet: 'blue',
    req: 'orange',
}

const NODE_X_FORCES: { [group: string]: number } = {
    job: 0.05,
    bullet: 0.0,
    req: -0.05,
}

function trimString(s: string, length: number) {
    return s.length > length ? s.substring(0, length - 3) + "..." : s
}

function filterLinks(links: any[], lessThan: number) {
    return links.filter((link: any) => link.value < lessThan)
}

// 
interface NodeDatumInterface extends d3.SimulationNodeDatum {
    id: string;
    value: string;
    group: string;
}

interface LinkDatumInterface extends d3.SimulationLinkDatum<NodeDatumInterface> {
    source: string;
    target: string;
    value: number;
}

type NodeDatum = NodeDatumInterface;
type LinkDatum = LinkDatumInterface;

export default defineComponent({
    name: "GraphVis",
    components: {},
    props: {
        nodes: {
            // The `Array as () => NodeDatum[]` syntax is a workaround to use a type as a prop type in Vue.
            type: Array as () => NodeDatum[],
            default: [
                { id: "job0", value: "some text", group: "job" },
                { id: "job0bullet0", value: "some text", group: "bullet" },
                { id: "job0bullet1", value: "some text", group: "bullet" },
                { id: "job1", value: "some text", group: "job" },
                { id: "job1bullet0", value: "some text", group: "bullet" },
                { id: "job1bullet1", value: "some text", group: "bullet" },
                { id: "req0", value: "some text", group: "req" },
                { id: "req1", value: "some text", group: "req" },
                { id: "req2", value: "some text", group: "req" },
                { id: "req3", value: "some text", group: "req" }
            ],
        },
        links: {
            // The `Array as () => NodeDatum[]` syntax is a workaround to use a type as a prop type in Vue.
            type: Array as () => LinkDatum[],
            default: filterLinks([
                { source: "job0", target: "job0bullet0", value: -1 },
                { source: "job0", target: "job0bullet1", value: -1 },
                { source: "job1", target: "job1bullet0", value: -1 },
                { source: "job1", target: "job1bullet1", value: -1 },
                { source: "job0bullet0", target: "req0", value: d3.randomUniform()() },
                { source: "job0bullet1", target: "req0", value: d3.randomUniform()() },
                { source: "job1bullet0", target: "req0", value: d3.randomUniform()() },
                { source: "job1bullet1", target: "req0", value: d3.randomUniform()() },
                { source: "job0bullet0", target: "req1", value: d3.randomUniform()() },
                { source: "job0bullet1", target: "req1", value: d3.randomUniform()() },
                { source: "job1bullet0", target: "req1", value: d3.randomUniform()() },
                { source: "job1bullet1", target: "req1", value: d3.randomUniform()() },
                { source: "job0bullet0", target: "req2", value: d3.randomUniform()() },
                { source: "job0bullet1", target: "req2", value: d3.randomUniform()() },
                { source: "job1bullet0", target: "req2", value: d3.randomUniform()() },
                { source: "job1bullet1", target: "req2", value: d3.randomUniform()() },
                { source: "job0bullet0", target: "req3", value: d3.randomUniform()() },
                { source: "job0bullet1", target: "req3", value: d3.randomUniform()() },
                { source: "job1bullet0", target: "req3", value: d3.randomUniform()() },
                { source: "job1bullet1", target: "req3", value: d3.randomUniform()() },
            ], 0.5),
        },
        width: {
            type: Number,
            default: 600,
        },
        height: {
            type: Number,
            default: 600,
        },
        svgStyle: {
            type: String,
            default: "max-width: 100%; height: auto; background: white;"
        },
        nodeSize: {
            type: Number,
            default: 24
        },

    },
    setup(props) {
        const createSvg = function () {

            // The force simulation mutates links and nodes, so create a copy
            // so that re-evaluating this cell produces the same result.
            const links = props.links.map((d: any) => ({ ...d }));
            const nodes = props.nodes.map((d: any) => ({ ...d }));

            // Create a simulation with several forces.
            const simulation = d3
                .forceSimulation(nodes)
                .force("link", d3.forceLink(links).id((d: any) => d.id))
                .force("charge", d3.forceManyBody().strength(-20))
                .force("center", d3.forceCenter(props.width / 2, props.height / 2).strength(1.1))
                .force("collide", d3.forceCollide().radius((d: any) => (4 * NODE_SIZES[d.group])))
                .force("x", d3.forceX().strength((d: any)=>NODE_X_FORCES[d.group]))
                .on("tick", ticked);

            // Create the SVG container.
            const svg = d3
                .create("svg")
                .attr("width", props.width)
                .attr("height", props.height)
                .attr("viewBox", [0, 0, props.width, props.height])
                .attr("style", props.svgStyle)
                .attr("id", SVG_ELEMENT_ID);

            // Add a line for each link, and a circle for each node.
            const link = svg
                .append("g")
                .selectAll<SVGLineElement, LinkDatum>("line")
                .data(links)
                .join("line")
                .attr("stroke", 'black')
                .attr("stroke-opacity", 0.6)
                .attr("stroke-width", (d: any) => (d.value < 0 ? 1 : 5 * (1 - d.value)));

            link.append("title").text((d: any) => d.linkTitle);

            const node = svg
                .append("g")
                .selectAll<SVGCircleElement, NodeDatum>("circle")
                .data(nodes)
                .join("circle")
                .attr("stroke", 'black')
                .attr("stroke-opacity", 1.0)
                .attr("stroke-width", 1.5)
                .attr("r", (d: any) => NODE_SIZES[d.group])
                .attr("fill", (d: any) => NODE_COLORS[d.group]);

            node.append("title").text((d: any) => d.value);

            const labels = svg
                .append("g")
                .selectAll()
                .data(nodes)
                .join("text")
                
                .text((d: any) => trimString(d.value, 20)).attr("class", "node-label");

            // Add a drag behavior. Generics necessary to appease typescript gods.
            const dragBehaviorCircle: d3.DragBehavior<SVGCircleElement, any, any> = d3.drag<SVGCircleElement, any>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);

            node.call(dragBehaviorCircle);

            // Set the position attributes of links and nodes each time the simulation ticks.
            function ticked() {
                // constrain nodes to viewport (issue with flyaway nodes)
                for (const nodeI of nodes) {
                    if (nodeI.x + NODE_SIZES[nodeI.group] < 0) {
                        nodeI.x = 0 + NODE_SIZES[nodeI.group];

                    } else if (props.width - NODE_SIZES[nodeI.group] < nodeI.x) {
                        nodeI.x = props.width - NODE_SIZES[nodeI.group];
                    }

                    if (nodeI.y + NODE_SIZES[nodeI.group] < 0) {
                        nodeI.y = 0 + NODE_SIZES[nodeI.group]

                    } else if (props.height - NODE_SIZES[nodeI.group] < nodeI.y) {
                        nodeI.y = props.height - NODE_SIZES[nodeI.group];
                    }
                }

                // update positions of each element
                link
                    .attr("x1", (d: any) => d.source.x)
                    .attr("y1", (d: any) => d.source.y)
                    .attr("x2", (d: any) => d.target.x)
                    .attr("y2", (d: any) => d.target.y);

                node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

                labels.attr("x", (d: any) => d.x - 2 * NODE_SIZES[d.group]).attr("y", (d: any) => d.y - NODE_SIZES[d.group]);

            }

            // Reheat the simulation when drag starts, and fix the subject position.
            function dragstarted(event: d3.D3DragEvent<SVGCircleElement, d3.SimulationNodeDatum, d3.SimulationNodeDatum>) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            // Update the subject (dragged node) position during drag.
            function dragged(event: d3.D3DragEvent<SVGCircleElement, d3.SimulationNodeDatum, d3.SimulationNodeDatum>) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            // Restore the target alpha so the simulation cools after dragging ends.
            // Unfix the subject position now that it’s no longer being dragged.
            function dragended(event: d3.D3DragEvent<SVGCircleElement, d3.SimulationNodeDatum, d3.SimulationNodeDatum>) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            let svgNode = svg.node();
            if (svgNode == null) {
                throw Error("weird! contact developer");
            }
            return svgNode;
        };

        return {
            props,
            createSvg,
            SVG_CONTAINER_DIV_ID,
            SVG_ELEMENT_ID,
        };
    },
    mounted() {
        let container = document.getElementById(this.SVG_CONTAINER_DIV_ID);
        if (container == null) {
            throw Error(`no div with id ${SVG_CONTAINER_DIV_ID}`)
        }
        container.appendChild(this.createSvg());
        this.$watch('nodes', ()=>{
            document.getElementById(SVG_ELEMENT_ID)?.remove();
            container?.appendChild(this.createSvg());
        });
        this.$watch('links', ()=>{
            document.getElementById(SVG_ELEMENT_ID)?.remove();
            container?.appendChild(this.createSvg());
        });
    },
    
});
</script>

<style scoped type="css">

.node-label {
    font-size: 5px;
}
</style>
