<template>
    <div :id="SVG_CONTAINER_DIV_ID"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as d3 from "d3";

interface FNSNodeInterface extends d3.SimulationNodeDatum {
    // x?: Number | undefined;
    // y?: Number | undefined;
    // vx?: Number | undefined;
    // vy?: Number | undefined;
    // fx?: Number | undefined;
    // fy?: Number | undefined;
    nodeStroke?: String | undefined;
    nodeStrokeOpacity?: Number | undefined;
    nodeStrokeWidth?: Number | undefined;
    nodeRadius?: Number | undefined;
    nodeFill?: Number | undefined;
    nodeTitle?: String | undefined;
    forceX?: Number | undefined;
    forceY?: Number | undefined;
    forceManyBodyStrength?: Number | undefined;
    forceCollideRadius?: Number | undefined;
}

interface FNSLinkInterface extends d3.SimulationLinkDatum {
    linkStroke?: String | undefined; 
    linkStrokeOpacity?: Number | undefined; 
    linkStrokeWidth?: Number | undefined;
    linkTitle?: String | undefined; 
}

// class FNSNode implements FNSNodeInterface {
// }

// class FNSLink implements FNSLinkInterface {

// }

const SVG_CONTAINER_DIV_ID = "force-network-svg-container-sedru7gheriugheirfuvhq-r89jerivuhwsp9er8ghswre-9v";

export default defineComponent({
    name: "ForceNetworkSvg",
    components: {},
    props: {
        nodes: {
            //type: FNSNode[],
            default: [
                { id: 1, nodeTitle: "nodeTitle: 'nodeTitle'" }, 
                { id: 2, nodeTitle: "nodeStroke: '#FFFFFF'", nodeStroke: '#FFFFFF' }, 
                { id: 3, nodeTitle: 'nodeFill: "#0000FF"', nodeFill: "#000077" }, 
                { id: 4, nodeTitle: 'nodeRadius: 17', nodeRadius: 17 }, 
                { id: 5, }, 
                { id: 6, },
                { id: 7, }, 
                { id: 8, },
            ],
        },
        links: {
            //type: FNSLink[],
            default: [
                { source: 1, target: 2, }, 
                { source: 2, target: 3, linkStroke: 'white', linkTitle: 'linkStroke: white' }, 
                { source: 2, target: 4, linkStrokeWidth: 10, linkTitle: 'linkStrokeWidth: 10'}, 
                { source: 4, target: 5, }, 
                { source: 4, target: 6 }, 
                { source: 1, target: 6 },
                { source: 5, target: 7 }, 
                { source: 5, target: 8 }
            ],
        },
        width: {
            type: Number,
            default: 928,
        },
        height: {
            type: Number,
            default: 600,
        },
        svgStyle: {
            type: String,
            default: "max-width: 100%; height: auto;"
        },
        nodeStroke: {
            type: [String],
            default: "#000000",
        },
        nodeStrokeOpacity: {
            type: Number,
            default: 1,
        },
        nodeStrokeWidth: {
            type: Number,
            default: 1.5,
        },
        nodeRadius: {
            type: Number,
            default: 10,
        },
        nodeFill: {
            type: [String],
            default: "#007000",
        },
        linkStroke: {
            type: [String],
            default: "#000000",
        },
        linkStrokeOpacity: {
            type: Number,
            default: 0.6,
        },
        linkStrokeWidth: {
            type: Number,
            default: 1,
        },
        simulationDragStartAlphaTarget: {
            type: Number,
            default: 0.3,
        },
        forceLinkDistance: {
            type: Number,
            default: 30,
        },
        forceLinkIterations: {
            type: Number,
            default: 1,
        },
        forceCenterStrength: {
            type: Number,
            default: 1,
        },
        forceCollideRadius: {
            type: Number,
            default: 20,
        },
        forceX: {
            type: Number,
            default: 0,
        },
        forceY: {
            type: Number,
            default: 0,
        },
        forceManyBodyStrength: {
            type: Number,
            default: -60,//-30,
        },
        forceManyBodyTheta: {
            type: Number,
            default: 0.9,
        },
        forceManyBodyDistanceMin: {
            type: Number,
            default: 1,
        },
        forceManyBodyDistanceMax: {
            type: Number,
            default: Infinity,
        },

    },
    setup(props) {
        const createSvg = function () {
            
            // The force simulation mutates links and nodes, so create a copy
            // so that re-evaluating this cell produces the same result.
            const links = props.links.map((d) => ({ ...d }));
            const nodes = props.nodes.map((d) => ({ ...d }));

            // Create a simulation with several forces.
            const simulation = d3
                .forceSimulation(nodes)
                .force("link", d3.forceLink(links).id((d) => d.id)
                    .distance((d)=>d.forceLinkDistance ?? props.forceLinkDistance)
                    // .strength
                    .iterations(props.forceLinkIterations)
                )
                .force("charge", d3.forceManyBody()
                    .strength((d)=>d.forceManyBodyStrength ?? props.forceManyBodyStrength)
                    .theta(props.forceManyBodyTheta)
                    .distanceMin(props.forceManyBodyDistanceMin)
                    .distanceMax(props.forceManyBodyDistanceMax)
                )
                .force("center", d3.forceCenter(props.width / 2, props.height / 2)
                    .strength(props.forceCenterStrength)
                )
                .force("collide", d3.forceCollide().radius((d)=> (d.forceCollideRadius ?? 2 * d.nodeRadius) ?? props.forceCollideRadius))
                .force("x", d3.forceX().strength((d)=>d.forceX ?? props.forceX))
                .force("y", d3.forceY().strength((d)=>d.forceY ?? props.forceY))
                .on("tick", ticked);

            // Create the SVG container.
            const svg = d3
                .create("svg")
                .attr("width", props.width)
                .attr("height", props.height)
                .attr("viewBox", [0, 0, props.width, props.height])
                .attr("style", props.svgStyle);

            // Add a line for each link, and a circle for each node.
            const link = svg
                .append("g")
                .selectAll()
                .data(links)
                .join("line")
                .attr("stroke", (d) => d.linkStroke ?? props.linkStroke)
                .attr("stroke-opacity", (d) => d.linkStrokeOpacity ?? props.linkStrokeOpacity)
                .attr("stroke-width", (d) => d.linkStrokeWidth ?? props.linkStrokeWidth);

            link.append("title").text((d) => d.linkTitle);

            const node = svg
                .append("g")
                .selectAll()
                .data(nodes)
                .join("circle")
                .attr("stroke", (d) => d.nodeStroke ?? props.nodeStroke)
                .attr("stroke-opacity", (d) => d.nodeStrokeOpacity ?? props.nodeStrokeOpacity)
                .attr("stroke-width", (d) => d.nodeStrokeWidth ?? props.nodeStrokeWidth)
                .attr("r", (d) => d.nodeRadius ?? props.nodeRadius)
                .attr("fill", (d) => d.nodeFill ?? props.nodeFill);

            node.append("title").text((d) => d.nodeTitle ?? d.id);

            // Add a drag behavior.
            node.call(
                d3
                    .drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );

            // Set the position attributes of links and nodes each time the simulation ticks.
            function ticked() {
                link
                    .attr("x1", (d) => d.source.x)
                    .attr("y1", (d) => d.source.y)
                    .attr("x2", (d) => d.target.x)
                    .attr("y2", (d) => d.target.y);

                node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
            }

            // Reheat the simulation when drag starts, and fix the subject position.
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(props.simulationDragStartAlphaTarget).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            // Update the subject (dragged node) position during drag.
            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            // Restore the target alpha so the simulation cools after dragging ends.
            // Unfix the subject position now that it’s no longer being dragged.
            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            let svgNode = svg.node();
            if (svgNode == null) {
                throw Error("weird! contact developer")
            }
            return svgNode;
        };

        return {
            props,
            createSvg,
            SVG_CONTAINER_DIV_ID,
        };
    },
    mounted() {
        let container = document.getElementById(this.SVG_CONTAINER_DIV_ID);
        if (container == null) {
            throw Error(`no div with id ${SVG_CONTAINER_DIV_ID}`)
        }
        container.appendChild(this.createSvg());
    },
});
</script>

<style scoped type="css"></style>
