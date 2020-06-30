/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { NgNeo4jD3Icons } from './ng-neo4jd3.icons';
import { Neo4jD3Records } from "./ng-neo4jd3.records";
import * as i0 from "@angular/core";
export class NgNeo4jd3Service {
    constructor() {
        this.outOfContext = false;
        this.valueSet = false;
        this.classes2colors = {};
        this.justLoaded = false;
        this.numClasses = 0;
        this.svgScale = undefined;
        this.options = {
            arrowSize: 4,
            colors: this.colors(),
            highlight: undefined,
            icons: undefined,
            iconMap: [],
            // This value assigned in Neo4jRandom
            imageMap: {},
            images: undefined,
            infoPanel: true,
            minCollision: undefined,
            neo4jData: undefined,
            neo4jDataUrl: undefined,
            nodeOutlineFillColor: undefined,
            nodeRadius: 25,
            relationshipColor: '#a5abb6',
            zoomFit: false,
            showIcons: true,
            onNodeDoubleClick: undefined,
            onNodeClick: undefined,
            onNodeMouseEnter: undefined,
            onNodeMouseLeave: undefined,
            onRelationshipDoubleClick: undefined,
            onNodeDragEnd: undefined,
            onNodeDragStart: undefined,
            graphContainerHeight: '100%'
        };
    }
    /**
     * @param {?} _selector
     * @param {?} _options
     * @return {?}
     */
    setValues(_selector, _options) {
        new NgNeo4jD3Icons(this.options);
        this.containerIdentity = _selector;
        this.optionsInput = _options;
        this.valueSet = true;
    }
    /**
     * @return {?}
     */
    isValueSet() {
        return this.valueSet;
    }
    /**
     * @return {?}
     */
    getOptionsInput() {
        return this.optionsInput;
    }
    /**
     * @return {?}
     */
    getContainer() {
        return this.container;
    }
    /**
     * @return {?}
     */
    init() {
        this.container = d3.select(this.containerIdentity);
        this.initIconMap(this.options);
        this.mergeProperty(this.options, this.optionsInput);
        if (this.options.neo4jData) {
            this.mergeRelationshipWithSameNodes();
        }
        if (this.options.icons) {
            this.options.showIcons = true;
        }
        if (!this.options.minCollision) {
            this.options.minCollision = this.options.nodeRadius * 2;
        }
        this.initImageMap(this.options);
        this.container.attr('class', 'neo4jd3')
            .html('');
        if (this.options.infoPanel) {
            this.info = this.appendInfoPanel(this.container);
        }
        this.svg = this.appendGraph(this.container);
        this.simulation = this.initSimulation();
        if (this.options.neo4jData) {
            this.loadNeo4jData();
        }
        else if (this.options.neo4jDataUrl) {
            this.loadNeo4jDataFromUrl(this.options.neo4jDataUrl);
        }
        else {
            console.error('Error: both neo4jData and neo4jDataUrl are empty!');
        }
        return this.options;
    }
    /**
     * @return {?}
     */
    initSimulation() {
        /** @type {?} */
        var thisObj = this;
        /** @type {?} */
        var parentElement = this.svg.node().parentElement;
        if (parentElement == undefined || parentElement.parentElement == undefined) {
            return;
        }
        /** @type {?} */
        const clientWidth = this.svg.node().parentElement.parentElement.clientWidth / 2;
        /** @type {?} */
        const clientHeight = this.svg.node().parentElement.parentElement.clientHeight / 2;
        /** @type {?} */
        var simulation = d3.forceSimulation()
            // .velocityDecay(0.8)
            // .force('x', d3.force().strength(0.002))
            // .force('y', d3.force().strength(0.002))
            .force('collide', d3.forceCollide().radius((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return thisObj.options.minCollision;
        }))
            .iterations(2))
            .force('charge', d3.forceManyBody())
            .force('link', d3.forceLink().id((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return d.id;
        })))
            .force('center', d3.forceCenter(clientWidth, clientHeight))
            .on('tick', (/**
         * @return {?}
         */
        function () {
            thisObj.tick();
        }))
            .on('end', (/**
         * @return {?}
         */
        function () {
            if (thisObj.options.zoomFit && !thisObj.justLoaded) {
                // FOR CUSTOMIZATION
            }
        }));
        return simulation;
    }
    /**
     * @param {?} container
     * @return {?}
     */
    appendGraph(container) {
        /** @type {?} */
        var thisObj = this;
        /** @type {?} */
        var svg = container.append('svg')
            .attr('width', '100%')
            .attr('height', thisObj.options.graphContainerHeight)
            .attr('class', 'neo4jd3-graph')
            .call(d3.zoom().on('zoom', (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var scale = d3.event.transform.k;
            /** @type {?} */
            var translate = [d3.event.transform.x, d3.event.transform.y];
            if (thisObj.svgTranslate) {
                translate[0] += thisObj.svgTranslate[0];
                translate[1] += thisObj.svgTranslate[1];
            }
            if (thisObj.svgScale) {
                scale *= thisObj.svgScale;
            }
            thisObj.svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
        })))
            .on('dblclick.zoom', null)
            .append('g')
            .attr('width', '100%')
            .attr('height', '100%');
        this.svgRelationships = svg.append('g').attr('class', 'relationships');
        this.svgNodes = svg.append('g').attr('class', 'nodes');
        return svg;
    }
    /**
     * @param {?} container
     * @return {?}
     */
    appendInfoPanel(container) {
        return container.append('div')
            .attr('class', 'neo4jd3-info');
    }
    /**
     * @param {?} cls
     * @param {?} isNode
     * @param {?} property
     * @param {?=} value
     * @return {?}
     */
    appendInfoElement(cls, isNode, property, value = null) {
        /** @type {?} */
        var elem = this.info.append('a');
        elem.attr('href', '#')
            .attr('class', cls)
            .html('<strong>' + property + '</strong>' + (value ? (': ' + value) : ''));
        if (!value) {
            /** @type {?} */
            var thisObj = this;
            elem.style('background-color', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return thisObj.options.nodeOutlineFillColor ? thisObj.options.nodeOutlineFillColor : (isNode ? thisObj.class2color(property) : thisObj.defaultColor());
            }))
                .style('border-color', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return thisObj.options.nodeOutlineFillColor ? thisObj.class2darkenColor(thisObj.options.nodeOutlineFillColor) : (isNode ? thisObj.class2darkenColor(property) : thisObj.defaultDarkenColor());
            }))
                .style('color', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return thisObj.options.nodeOutlineFillColor ? thisObj.class2darkenColor(thisObj.options.nodeOutlineFillColor) : '#fff';
            }));
        }
    }
    /**
     * @param {?} cls
     * @param {?} node
     * @return {?}
     */
    appendInfoElementClass(cls, node) {
        this.appendInfoElement(cls, true, node);
    }
    /**
     * @param {?} cls
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    appendInfoElementProperty(cls, property, value) {
        this.appendInfoElement(cls, false, property, value);
    }
    /**
     * @param {?} cls
     * @param {?} relationship
     * @return {?}
     */
    appendInfoElementRelationship(cls, relationship) {
        this.appendInfoElement(cls, false, relationship);
    }
    /**
     * @return {?}
     */
    appendNode() {
        /** @type {?} */
        var thisObj = this;
        return this.node.enter()
            .append('g')
            .attr('class', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var classes = 'node';
            if (thisObj.icon(d)) {
                classes += ' node-icon';
            }
            if (thisObj.image(d)) {
                classes += ' node-image';
            }
            if (thisObj.options.highlight) {
                for (var i = 0; i < thisObj.options.highlight.length; i++) {
                    /** @type {?} */
                    const highlight = thisObj.options.highlight[i];
                    if (d.labels[0] === highlight.class && d.properties[highlight.property] === highlight.value) {
                        classes += ' node-highlighted';
                        break;
                    }
                }
            }
            return classes;
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            d.fx = d.fy = null;
            if (thisObj.options.onNodeClick != undefined) {
                thisObj.options.onNodeClick(d);
            }
        }))
            .on('dblclick', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            thisObj.stickNode(d);
            if (thisObj.options.onNodeDoubleClick != undefined) {
                thisObj.options.onNodeDoubleClick(d);
            }
        }))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (thisObj.info) {
                thisObj.updateInfo(d);
            }
            if (thisObj.options.onNodeMouseEnter != undefined) {
                thisObj.options.onNodeMouseEnter(d);
            }
        }))
            .on('mouseleave', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (thisObj.info) {
                thisObj.clearInfo();
            }
            if (thisObj.options.onNodeMouseLeave != undefined) {
                thisObj.options.onNodeMouseLeave(d);
            }
        }))
            .call(d3.drag()
            .on('start', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { thisObj.dragStarted(d); }))
            .on('drag', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { thisObj.dragged(d); }))
            .on('end', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { thisObj.dragEnded(d); })));
    }
    /**
     * @return {?}
     */
    appendNodeToGraph() {
        /** @type {?} */
        var n = this.appendNode();
        this.appendRingToNode(n);
        this.appendOutlineToNode(n);
        if (this.options.icons) {
            this.appendTextToNode(n);
        }
        if (this.options.images) {
            this.appendImageToNode(n);
        }
        return n;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    appendOutlineToNode(node) {
        /** @type {?} */
        var thisObj = this;
        /** @type {?} */
        var options = this.options;
        return node.append('circle')
            .attr('class', 'outline')
            .attr('r', options.nodeRadius)
            .style('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return options.nodeOutlineFillColor ? options.nodeOutlineFillColor : thisObj.class2color(d.labels[0]);
        }))
            .style('stroke', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return options.nodeOutlineFillColor ? thisObj.class2darkenColor(options.nodeOutlineFillColor) : thisObj.class2darkenColor(d.labels[0]);
        }))
            .append('title').text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return thisObj.toString(d);
        }));
    }
    /**
     * @param {?} cls
     * @return {?}
     */
    class2color(cls) {
        /** @type {?} */
        var color = this.classes2colors[cls];
        if (!color) {
            // color = this.options.colors[Math.min(numClasses, this.options.colors.length - 1)];
            color = this.options.colors[this.numClasses % this.options.colors.length];
            this.classes2colors[cls] = color;
            this.numClasses++;
        }
        return color;
    }
    /**
     * @param {?} cls
     * @return {?}
     */
    class2darkenColor(cls) {
        /** @type {?} */
        var colorValue = this.class2color(cls);
        try {
            // COLOR Object is not working properly when the optimization is set true
            /** @type {?} */
            var colorObject = d3.rgb(colorValue);
            return colorObject.darker(1);
        }
        catch (err) { }
    }
    /**
     * @param {?} node
     * @return {?}
     */
    appendRingToNode(node) {
        /** @type {?} */
        var thisObj = this;
        return node.append('circle')
            .attr('class', 'ring')
            .attr('r', this.options.nodeRadius * 1.16)
            .append('title').text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return thisObj.toString(d);
        }));
    }
    /**
     * @param {?} node
     * @return {?}
     */
    appendImageToNode(node) {
        /** @type {?} */
        var thisObj = this;
        // TODO >> Change This To Become The Container
        // Added the [iconFlag] attribute in the node or 'd' variable
        return node.append('image').attr('width', '35px')
            .attr('height', '35px').attr('x', '-18px').attr('y', '-18px')
            .attr('xlink:href', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return thisObj.image(d); }));
        ;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    appendTextToNode(node) {
        /** @type {?} */
        var thisObj = this;
        return node.append('text')
            .attr('class', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return 'text' + (thisObj.icon(d) ? ' icon' : ''); }))
            .attr('fill', 'black')
            .attr('font-size', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (thisObj.icon(d) ? '25px' : '12px'); }))
            .attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (thisObj.icon(d) ? '25px' : '30px'); }))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (thisObj.icon(d) ? '25px' : '30px'); }))
            .attr('style', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            const rgb = 'fill: rgb(225, 225, 225); stroke: rgb(000, 000, 000);';
            return thisObj.icon(d) ? rgb : '';
        }))
            .html((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var _icon = thisObj.icon(d);
            return _icon ? '&#x' + _icon : d.id;
        }));
    }
    /**
     * @param {?} d
     * @param {?} maxNodesToGenerate
     * @return {?}
     */
    appendRandomDataToNode(d, maxNodesToGenerate) {
        /** @type {?} */
        var data = this.randomD3Data(d, maxNodesToGenerate);
        this.updateWithNeo4jData(data);
    }
    /**
     * @return {?}
     */
    appendRelationship() {
        /** @type {?} */
        var thisObj = this;
        // Function > Double Click 
        /** @type {?} */
        const fnDoubleClick = (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (thisObj.options.onRelationshipDoubleClick != undefined) {
                thisObj.options.onRelationshipDoubleClick(d);
            }
        });
        // Function > Mouse Enter
        /** @type {?} */
        const fnMouseEnter = (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (thisObj.info) {
                thisObj.updateInfo(d);
            }
        });
        return this.relationship.enter().append('g').attr('class', 'relationship').on('dblclick', fnDoubleClick).on('mouseenter', fnMouseEnter);
    }
    /**
     * @return {?}
     */
    clearInfo() {
        this.info.html('');
    }
    /**
     * @return {?}
     */
    color() {
        return this.options.colors[this.options.colors.length * Math.random() << 0];
    }
    /**
     * @return {?}
     */
    colors() {
        // d3.schemeCategory10,
        // d3.schemeCategory20,
        return [
            '#68bdf6',
            '#6dce9e',
            '#faafc2',
            '#f2baf6',
            '#ff928c',
            '#fcea7e',
            '#ffc766',
            '#405f9e',
            '#a5abb6',
            '#78cecb',
            '#b88cbb',
            '#ced2d9',
            '#e84646',
            '#fa5f86',
            '#ffab1a',
            '#fcda19',
            '#797b80',
            '#c9d96f',
            '#47991f',
            '#70edee',
            '#ff75ea' // pink
        ];
    }
    /**
     * @param {?} array
     * @param {?} id
     * @return {?}
     */
    containsResult(array, id) {
        /** @type {?} */
        var filter = array.filter((/**
         * @param {?} elem
         * @return {?}
         */
        function (elem) {
            return elem.id === id;
        }));
        return filter.length > 0;
    }
    /**
     * @return {?}
     */
    defaultColor() {
        return this.options.relationshipColor;
    }
    /**
     * @return {?}
     */
    defaultDarkenColor() {
        /** @type {?} */
        var colorValue = this.options.colors[this.options.colors.length - 1];
        try {
            // COLOR Object is not working properly when the optimization is set true
            /** @type {?} */
            var colorObject = d3.rgb(colorValue);
            return colorObject.darker(1);
        }
        catch (err) { }
    }
    /**
     * @param {?} d
     * @return {?}
     */
    dragEnded(d) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0);
        }
        if (this.options.onNodeDragEnd != undefined) {
            this.options.onNodeDragEnd(d);
        }
    }
    /**
     * @param {?} d
     * @return {?}
     */
    dragged(d) {
        this.stickNode(d);
    }
    /**
     * @param {?} d
     * @return {?}
     */
    dragStarted(d) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
        if (this.options.onNodeDragStart != undefined) {
            this.options.onNodeDragStart(d);
        }
    }
    /**
     * @param {?} obj1
     * @param {?} obj2
     * @return {?}
     */
    extend(obj1, obj2) {
        /** @type {?} */
        var obj = {};
        this.mergeProperty(obj, obj1);
        this.mergeProperty(obj, obj2);
        return obj;
    }
    /**
     * @param {?} d
     * @return {?}
     */
    icon(d) {
        /** @type {?} */
        var code;
        if (this.options.iconMap && this.options.showIcons && this.options.icons) {
            if (this.options.icons[d.labels[0]] && this.options.iconMap[this.options.icons[d.labels[0]]]) {
                code = this.options.iconMap[this.options.icons[d.labels[0]]];
            }
            else if (this.options.iconMap[d.labels[0]]) {
                code = this.options.iconMap[d.labels[0]];
            }
            else if (this.options.icons[d.labels[0]]) {
                code = this.options.icons[d.labels[0]];
            }
        }
        return code;
    }
    /**
     * @param {?} d
     * @return {?}
     */
    image(d) {
        /** @type {?} */
        var i;
        /** @type {?} */
        var imagesForLabel;
        /** @type {?} */
        var img;
        /** @type {?} */
        var imgLevel;
        /** @type {?} */
        var label;
        /** @type {?} */
        var labelPropertyValue;
        /** @type {?} */
        var property;
        /** @type {?} */
        var value;
        if (this.options.images) {
            /** @type {?} */
            const imgRef = d.img == undefined ? d.labels[0] : d.img;
            imagesForLabel = this.options.imageMap[imgRef];
            if (imagesForLabel) {
                imgLevel = 0;
                for (i = 0; i < imagesForLabel.length; i++) {
                    labelPropertyValue = imagesForLabel[i].split('|');
                    switch (labelPropertyValue.length) {
                        case 3:
                            value = labelPropertyValue[2];
                        /* falls through */
                        case 2:
                            property = labelPropertyValue[1];
                        /* falls through */
                        case 1:
                            label = labelPropertyValue[0];
                    }
                    if (imgRef === label &&
                        (!property || d.properties[property] !== undefined) &&
                        (!value || d.properties[property] === value)) {
                        if (labelPropertyValue.length > imgLevel) {
                            img = this.options.images[imagesForLabel[i]];
                            imgLevel = labelPropertyValue.length;
                        }
                    }
                }
            }
        }
        return img;
    }
    /**
     * @return {?}
     */
    loadNeo4jData() {
        this.nodes = [];
        this.relationships = [];
        this.updateWithNeo4jData(this.options.neo4jData);
    }
    /**
     * @param {?} neo4jDataUrl
     * @return {?}
     */
    loadNeo4jDataFromUrl(neo4jDataUrl) {
        this.nodes = [];
        this.relationships = [];
        d3.json(neo4jDataUrl, (/**
         * @param {?} error
         * @param {?} data
         * @return {?}
         */
        function (error, data) {
            if (error) {
                throw error;
            }
            this.updateWithNeo4jData(data);
        }));
    }
    /**
     * @param {?} data
     * @return {?}
     */
    neo4jDataToD3Data(data) {
        /** @type {?} */
        var graph = {
            nodes: [],
            relationships: []
        };
        /** @type {?} */
        var thisObj = this;
        data.results.forEach((/**
         * @param {?} result
         * @return {?}
         */
        function (result) {
            result.data.forEach((/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                data.graph.nodes.forEach((/**
                 * @param {?} node
                 * @return {?}
                 */
                function (node) {
                    if (!thisObj.containsResult(graph.nodes, node.id)) {
                        graph.nodes.push(node);
                    }
                }));
                data.graph.relationships.forEach((/**
                 * @param {?} relationship
                 * @return {?}
                 */
                function (relationship) {
                    relationship.source = relationship.startNode;
                    relationship.target = relationship.endNode;
                    graph.relationships.push(relationship);
                }));
                data.graph.relationships.sort((/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                function (a, b) {
                    if (a.source > b.source) {
                        return 1;
                    }
                    else if (a.source < b.source) {
                        return -1;
                    }
                    else {
                        if (a.target > b.target) {
                            return 1;
                        }
                        if (a.target < b.target) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                }));
                for (var i = 0; i < data.graph.relationships.length; i++) {
                    if (i !== 0 && data.graph.relationships[i].source === data.graph.relationships[i - 1].source && data.graph.relationships[i].target === data.graph.relationships[i - 1].target) {
                        data.graph.relationships[i].linknum = data.graph.relationships[i - 1].linknum + 1;
                    }
                    else {
                        data.graph.relationships[i].linknum = 1;
                    }
                }
            }));
        }));
        return graph;
    }
    /**
     * @param {?} d
     * @return {?}
     */
    toString(d) {
        /** @type {?} */
        var s = d.labels ? d.labels[0] : d.type;
        s += ' (<id>: ' + d.id;
        Object.keys(d.properties).forEach((/**
         * @param {?} property
         * @return {?}
         */
        function (property) {
            s += ', ' + property + ': ' + JSON.stringify(d.properties[property]);
        }));
        s += ')';
        return s;
    }
    /**
     * @param {?} d
     * @param {?} maxNodesToGenerate
     * @return {?}
     */
    randomD3Data(d, maxNodesToGenerate) {
        /** @type {?} */
        var data = {
            nodes: [],
            relationships: []
        };
        /** @type {?} */
        var numNodes = (maxNodesToGenerate * Math.random() << 0) + 1;
        /** @type {?} */
        var s = this.size();
        for (var i = 0; i < numNodes; i++) {
            // var icons = Object.keys(this.options.iconMap);
            /** @type {?} */
            const label = "Hello";
            // icons[icons.length * Math.random() << 0];
            /** @type {?} */
            const node = {
                id: s.nodes + 1 + i,
                labels: [label],
                properties: {
                    random: label
                },
                x: d.x,
                y: d.y
            };
            data.nodes[data.nodes.length] = node;
            /** @type {?} */
            const relationship = {
                id: s.relationships + 1 + i,
                type: label.toUpperCase(),
                startNode: d.id,
                endNode: s.nodes + 1 + i,
                properties: {
                    from: Date.now()
                },
                source: d.id,
                target: s.nodes + 1 + i,
                linknum: s.relationships + 1 + i
            };
            data.relationships[data.relationships.length] = relationship;
        }
        return data;
    }
    /**
     * @return {?}
     */
    size() {
        return {
            nodes: this.nodes.length,
            relationships: this.relationships.length
        };
    }
    /**
     * @param {?} d
     * @return {?}
     */
    stickNode(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    /**
     * @return {?}
     */
    tick() {
        this.tickNodes();
        this.tickRelationships();
    }
    /**
     * @return {?}
     */
    tickNodes() {
        if (this.node) {
            this.node.attr('transform', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                if (d != undefined)
                    return 'translate(' + d.x + ', ' + d.y + ')';
                /** @type {?} */
                const msg = "=========>>>>>>>>>>>>>> ERROR >> tickNodes";
                console.error(msg);
                throw new Error(msg);
            }));
        }
    }
    /**
     * @return {?}
     */
    tickRelationships() {
        if (this.relationship) {
            /** @type {?} */
            const thisObj = this;
            this.relationship.attr('transform', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                if (d != undefined) {
                    /** @type {?} */
                    var angle = thisObj.rotation(d.source, d.target);
                    if (d.source != undefined) {
                        return 'translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')';
                    }
                }
                /** @type {?} */
                const msg = "=========>>>>>>>>>>>>>> ERROR >> tickRelationships";
                console.error(msg);
                throw new Error(msg);
            }));
            this.tickRelationshipsTexts();
            this.tickRelationshipsOutlines();
            this.tickRelationshipsOverlays();
        }
    }
    /**
     * @return {?}
     */
    tickRelationshipsOutlines() {
        /** @type {?} */
        var thisObj = this;
        this.relationship.each((/**
         * @param {?} relationship
         * @param {?} index
         * @param {?} g
         * @return {?}
         */
        (relationship, index, g) => {
            /** @type {?} */
            var obj = g[index];
            /** @type {?} */
            var rel = d3.select(obj);
            /** @type {?} */
            var outline;
            try {
                outline = rel.select('.outline');
            }
            catch (err) {
                return;
            }
            /** @type {?} */
            var text = rel.select('.text');
            try {
                /** @type {?} */
                var bbox = text.node().getBBox();
            }
            catch (err) {
                return;
            }
            /** @type {?} */
            var padding = 3;
            outline.attr('d', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                try {
                    /** @type {?} */
                    var options = thisObj.options;
                    /** @type {?} */
                    var center = { x: 0, y: 0 };
                    /** @type {?} */
                    var angle = thisObj.rotation(d.source, d.target);
                    /** @type {?} */
                    var textBoundingBox = text.node().getBBox();
                    /** @type {?} */
                    var textPadding = 5;
                    /** @type {?} */
                    var u = thisObj.unitaryVector(d.source, d.target);
                    /** @type {?} */
                    var textMargin = { x: (d.target.x - d.source.x - (textBoundingBox.width + textPadding) * u.x) * 0.5, y: (d.target.y - d.source.y - (textBoundingBox.width + textPadding) * u.y) * 0.5 };
                    /** @type {?} */
                    var n = thisObj.unitaryNormalVector(d.source, d.target);
                    /** @type {?} */
                    var rotatedPointA1 = thisObj.rotatePoint(center, { x: 0 + (thisObj.options.nodeRadius + 1) * u.x - n.x, y: 0 + (thisObj.options.nodeRadius + 1) * u.y - n.y }, angle);
                    /** @type {?} */
                    var rotatedPointB1 = thisObj.rotatePoint(center, { x: textMargin.x - n.x, y: textMargin.y - n.y }, angle);
                    /** @type {?} */
                    var rotatedPointC1 = thisObj.rotatePoint(center, { x: textMargin.x, y: textMargin.y }, angle);
                    /** @type {?} */
                    var rotatedPointD1 = thisObj.rotatePoint(center, { x: 0 + (options.nodeRadius + 1) * u.x, y: 0 + (options.nodeRadius + 1) * u.y }, angle);
                    /** @type {?} */
                    var rotatedPointA2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x - n.x, y: d.target.y - d.source.y - textMargin.y - n.y }, angle);
                    /** @type {?} */
                    var rotatedPointB2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - n.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - n.y - u.y * options.arrowSize }, angle);
                    /** @type {?} */
                    var rotatedPointC2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - n.x + (n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - n.y + (n.y - u.y) * options.arrowSize }, angle);
                    /** @type {?} */
                    var rotatedPointD2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y }, angle);
                    /** @type {?} */
                    var rotatedPointE2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x + (-n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y + (-n.y - u.y) * options.arrowSize }, angle);
                    /** @type {?} */
                    var rotatedPointF2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - u.y * options.arrowSize }, angle);
                    /** @type {?} */
                    var rotatedPointG2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x, y: d.target.y - d.source.y - textMargin.y }, angle);
                    return 'M ' + rotatedPointA1.x + ' ' + rotatedPointA1.y +
                        ' L ' + rotatedPointB1.x + ' ' + rotatedPointB1.y +
                        ' L ' + rotatedPointC1.x + ' ' + rotatedPointC1.y +
                        ' L ' + rotatedPointD1.x + ' ' + rotatedPointD1.y +
                        ' Z M ' + rotatedPointA2.x + ' ' + rotatedPointA2.y +
                        ' L ' + rotatedPointB2.x + ' ' + rotatedPointB2.y +
                        ' L ' + rotatedPointC2.x + ' ' + rotatedPointC2.y +
                        ' L ' + rotatedPointD2.x + ' ' + rotatedPointD2.y +
                        ' L ' + rotatedPointE2.x + ' ' + rotatedPointE2.y +
                        ' L ' + rotatedPointF2.x + ' ' + rotatedPointF2.y +
                        ' L ' + rotatedPointG2.x + ' ' + rotatedPointG2.y +
                        ' Z';
                }
                catch (err) {
                    return;
                }
            }));
        }));
    }
    /**
     * @param {?} d
     * @param {?} text
     * @return {?}
     */
    outlineFunction(d, text) {
    }
    /**
     * @return {?}
     */
    tickRelationshipsOverlays() {
        /** @type {?} */
        var thisObj = this;
        this.relationshipOverlay.attr('d', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var center = { x: 0, y: 0 };
            /** @type {?} */
            var angle = thisObj.rotation(d.source, d.target);
            /** @type {?} */
            var n1 = thisObj.unitaryNormalVector(d.source, d.target);
            /** @type {?} */
            var n = thisObj.unitaryNormalVector(d.source, d.target, 50);
            /** @type {?} */
            var rotatedPointA = thisObj.rotatePoint(center, { x: 0 - n.x, y: 0 - n.y }, angle);
            /** @type {?} */
            var rotatedPointB = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - n.x, y: d.target.y - d.source.y - n.y }, angle);
            /** @type {?} */
            var rotatedPointC = thisObj.rotatePoint(center, { x: d.target.x - d.source.x + n.x - n1.x, y: d.target.y - d.source.y + n.y - n1.y }, angle);
            /** @type {?} */
            var rotatedPointD = thisObj.rotatePoint(center, { x: 0 + n.x - n1.x, y: 0 + n.y - n1.y }, angle);
            return 'M ' + rotatedPointA.x + ' ' + rotatedPointA.y +
                ' L ' + rotatedPointB.x + ' ' + rotatedPointB.y +
                ' L ' + rotatedPointC.x + ' ' + rotatedPointC.y +
                ' L ' + rotatedPointD.x + ' ' + rotatedPointD.y +
                ' Z';
        }));
    }
    /**
     * @return {?}
     */
    tickRelationshipsTexts() {
        /** @type {?} */
        var thisObj = this;
        this.relationshipText.attr('transform', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var angle = (thisObj.rotation(d.source, d.target) + 360) % 360;
            /** @type {?} */
            var mirror = angle > 90 && angle < 270;
            /** @type {?} */
            var center = { x: 0, y: 0 };
            /** @type {?} */
            var n = thisObj.unitaryNormalVector(d.source, d.target);
            /** @type {?} */
            var nWeight = mirror ? 2 : -3;
            /** @type {?} */
            var point = { x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight, y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight };
            /** @type {?} */
            var rotatedPoint = thisObj.rotatePoint(center, point, angle);
            return 'translate(' + rotatedPoint.x + ', ' + rotatedPoint.y + ') rotate(' + (mirror ? 180 : 0) + ')';
        }));
    }
    /**
     * @param {?} source
     * @param {?} target
     * @param {?=} newLength
     * @return {?}
     */
    unitaryNormalVector(source, target, newLength = 1) {
        /** @type {?} */
        var center = { x: 0, y: 0 };
        /** @type {?} */
        var vector = this.unitaryVector(source, target, newLength);
        return this.rotatePoint(center, vector, 90);
    }
    /**
     * @param {?} source
     * @param {?} target
     * @param {?=} newLength
     * @return {?}
     */
    unitaryVector(source, target, newLength = 1) {
        /** @type {?} */
        var length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)) / Math.sqrt(newLength || 1);
        return {
            x: (target.x - source.x) / length,
            y: (target.y - source.y) / length,
        };
    }
    /**
     * This function is obselete and not used any where
     * \@obselete
     * @param {?} d3Data
     * @return {?}
     */
    updateWithD3Data(d3Data) {
        this.updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
    }
    /**
     * Update data for Neo4j Visualization
     * @param {?} neo4jData
     * @return {?}
     */
    updateWithNeo4jData(neo4jData) {
        /** @type {?} */
        var d3Data = this.neo4jDataToD3Data(neo4jData);
        this.updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
    }
    /**
     * @param {?} d
     * @return {?}
     */
    updateInfo(d) {
        this.clearInfo();
        if (d.labels) {
            this.appendInfoElementClass('class', d.labels[0]);
        }
        else {
            this.appendInfoElementRelationship('class', d.type);
        }
        this.appendInfoElementProperty('property', '&lt;id&gt;', d.id);
        /** @type {?} */
        var thisObj = this;
        Object.keys(d.properties).forEach((/**
         * @param {?} property
         * @return {?}
         */
        function (property) {
            thisObj.appendInfoElementProperty('property', property, JSON.stringify(d.properties[property]));
        }));
    }
    /**
     * @param {?} n
     * @return {?}
     */
    updateNodes(n) {
        Array.prototype.push.apply(this.nodes, n);
        this.node = this.svgNodes.selectAll('.node').data(this.nodes, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.id; }));
        /** @type {?} */
        var nodeEnter = this.appendNodeToGraph();
        this.node = nodeEnter.merge(this.node);
    }
    /**
     * @param {?} n
     * @param {?} r
     * @return {?}
     */
    updateNodesAndRelationships(n, r) {
        this.updateRelationships(r);
        this.updateNodes(n);
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.relationships);
    }
    /**
     * @param {?} r
     * @return {?}
     */
    updateRelationships(r) {
        Array.prototype.push.apply(this.relationships, r);
        this.relationship = this.svgRelationships.selectAll('.relationship').data(this.relationships, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.id; }));
        /** @type {?} */
        var relationship = this.appendRelationship();
        /** @type {?} */
        var relationshipEnter = this.appendRelationshipToGraph(relationship);
        this.relationship = relationshipEnter.relationship.merge(this.relationship);
        this.relationshipOutline = this.svg.selectAll('.relationship .outline');
        this.relationshipOutline = relationshipEnter.outline.merge(this.relationshipOutline);
        this.relationshipOverlay = this.svg.selectAll('.relationship .overlay');
        this.relationshipOverlay = relationshipEnter.overlay.merge(this.relationshipOverlay);
        this.relationshipText = this.svg.selectAll('.relationship .text');
        this.relationshipText = relationshipEnter.text.merge(this.relationshipText);
    }
    // ---------------------------------
    //            Neo4j Util
    // ---------------------------------
    /**
     * @return {?}
     */
    getOptionsPresentation() {
        return {
            arrowSize: 4,
            colors: undefined,
            highlight: [
                {
                    class: 'Project',
                    property: 'name',
                    value: 'neo4jd3'
                },
                {
                    class: 'User',
                    property: 'userId',
                    value: 'eisman'
                }
            ],
            icons: NgNeo4jD3Icons.exampleIcons(),
            images: NgNeo4jD3Icons.exampleImages(),
            iconMap: undefined,
            // This value assigned in Neo4jRandom
            imageMap: undefined,
            infoPanel: true,
            minCollision: 60,
            neo4jData: Neo4jD3Records,
            nodeOutlineFillColor: undefined,
            neo4jDataUrl: undefined,
            nodeRadius: 25,
            relationshipColor: '#a5abb6',
            onRelationshipDoubleClick: (/**
             * @param {?} relationship
             * @return {?}
             */
            function (relationship) {
                console.log('double click on relationship: ' + JSON.stringify(relationship));
            }),
            zoomFit: true,
            showIcons: true,
            onNodeDoubleClick: undefined,
            onNodeClick: undefined,
            onNodeMouseEnter: undefined,
            onNodeMouseLeave: undefined,
            onNodeDragEnd: undefined,
            onNodeDragStart: undefined,
            graphContainerHeight: '100%'
        };
    }
    /**
     * @param {?} c
     * @param {?} p
     * @param {?} angle
     * @return {?}
     */
    rotatePoint(c, p, angle) {
        return this.rotate(c.x, c.y, p.x, p.y, angle);
    }
    /**
     * @param {?} source
     * @param {?} target
     * @return {?}
     */
    rotation(source, target) {
        return Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
    }
    /**
     * @param {?} cx
     * @param {?} cy
     * @param {?} x
     * @param {?} y
     * @param {?} angle
     * @return {?}
     */
    rotate(cx, cy, x, y, angle) {
        /** @type {?} */
        var radians = (Math.PI / 180) * angle;
        /** @type {?} */
        var cos = Math.cos(radians);
        /** @type {?} */
        var sin = Math.sin(radians);
        /** @type {?} */
        var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        /** @type {?} */
        var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return { x: nx, y: ny };
    }
    /**
     * @param {?} options
     * @return {?}
     */
    initIconMap(options) {
        Object.keys(options.iconMap).forEach((/**
         * @param {?} key
         * @param {?} index
         * @return {?}
         */
        function (key, index) {
            /** @type {?} */
            var keys = key.split(',');
            /** @type {?} */
            var value = options.iconMap[key];
            keys.forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                options.iconMap[key] = value;
            }));
        }));
        return options.iconMap;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    initImageMap(options) {
        // var key, keys, selector;
        /** @type {?} */
        var key;
        /** @type {?} */
        var keys;
        for (key in options.images) {
            if (options.images.hasOwnProperty(key)) {
                keys = key.split('|');
                if (!options.imageMap[keys[0]]) {
                    options.imageMap[keys[0]] = [key];
                }
                else {
                    options.imageMap[keys[0]].push(key);
                }
            }
        }
    }
    /**
     * @param {?} r
     * @return {?}
     */
    appendTextToRelationship(r) {
        /** @type {?} */
        var rText = r.append('text');
        return rText.attr('class', 'text').attr('fill', '#000000').attr('font-size', '8px').attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.type; }));
    }
    /**
     * @param {?} relationship
     * @return {?}
     */
    appendRelationshipToGraph(relationship) {
        /** @type {?} */
        var text = this.appendTextToRelationship(relationship);
        /** @type {?} */
        var outline = relationship.append('path').attr('class', 'outline').attr('fill', '#a5abb6').attr('stroke', 'none');
        /** @type {?} */
        var overlay = relationship.append('path').attr('class', 'overlay');
        // this.relationship = relationship;
        return {
            outline: outline,
            overlay: overlay,
            relationship: relationship,
            text: text
        };
    }
    /**
     * @param {?} target
     * @param {?} source
     * @return {?}
     */
    mergeProperty(target, source) {
        Object.keys(source).forEach((/**
         * @param {?} property
         * @return {?}
         */
        function (property) {
            /** @type {?} */
            const sourceProperty = source[property];
            if (sourceProperty != undefined) {
                if (!(sourceProperty instanceof Array))
                    target[property] = source[property];
                else if (sourceProperty.length > 0)
                    target[property] = source[property];
            }
        }));
    }
    /**
     * @return {?}
     */
    version() {
        return "0.1.6";
    }
    // Merges All Relationships with the same nodes
    /**
     * @private
     * @return {?}
     */
    mergeRelationshipWithSameNodes() {
        /** @type {?} */
        let r = this.options.neo4jData.results[0].data[0].graph.relationships;
        // Check the relationship counts between 2 nodes
        /** @type {?} */
        var drawnRelationship = {};
        for (let rIndex = 0; rIndex < r.length; rIndex++) {
            /** @type {?} */
            let rel = r[rIndex];
            /** @type {?} */
            const startNode = rel['startNode'];
            /** @type {?} */
            const endNode = rel['endNode'];
            /** @type {?} */
            const relationshipKey = startNode + '-' + endNode;
            /** @type {?} */
            let relationshipValue = drawnRelationship[relationshipKey];
            rel['id'] = rel['id'].toString();
            if (relationshipValue != undefined) {
                if (relationshipKey == '1161-1148') {
                    console.log(JSON.stringify(rel));
                }
                /** @type {?} */
                let relationshipModified = {};
                /** @type {?} */
                const obj = relationshipValue;
                // 
                /** @type {?} */
                const keys = this.mergeKeys(obj, rel);
                keys.forEach((/**
                 * @param {?} key
                 * @return {?}
                 */
                key => {
                    /** @type {?} */
                    const newVal = this.assignAttributes(key, obj, rel);
                    if (newVal != undefined) {
                        relationshipModified[key] = this.assignAttributes(key, obj, rel);
                    }
                }));
                drawnRelationship[relationshipKey] = relationshipModified;
            }
            else {
                drawnRelationship[relationshipKey] = rel;
            }
        }
        /** @type {?} */
        const newRel = Object.values(drawnRelationship);
        this.options.neo4jData.results[0].data[0].graph.relationships = newRel;
    }
    /**
     * @private
     * @param {?} obj1
     * @param {?} obj2
     * @return {?}
     */
    mergeKeys(obj1, obj2) {
        /** @type {?} */
        let keys = Object.keys(obj1);
        keys = keys.concat(Object.keys(obj2));
        return [...new Set(keys)];
    }
    /**
     * @private
     * @param {?} key
     * @param {?} relationship1
     * @param {?} relationship2
     * @return {?}
     */
    assignAttributes(key, relationship1, relationship2) {
        if (key === 'properties') {
            /** @type {?} */
            const prop1 = relationship1.properties;
            /** @type {?} */
            const prop2 = relationship2.properties;
            if (prop1 == undefined && prop2 == undefined) {
                return {};
            }
            else if (prop1 == undefined) {
                return prop2;
            }
            else if (prop2 == undefined) {
                return prop1;
            }
            /** @type {?} */
            const keys = this.mergeKeys(prop1, prop2);
            /** @type {?} */
            let prop = {};
            keys.forEach((/**
             * @param {?} key
             * @return {?}
             */
            key => {
                prop[key] = this.assignAttributesValue(key, prop1, prop2);
            }));
            return prop;
        }
        else if (key == 'target' || key == 'linknum' || key == 'startNode' || key == 'endNode') {
            return relationship1[key];
        }
        return this.assignAttributesValue(key, relationship1, relationship2);
    }
    /**
     * @private
     * @param {?} key
     * @param {?} relationship1
     * @param {?} relationship2
     * @return {?}
     */
    assignAttributesValue(key, relationship1, relationship2) {
        /** @type {?} */
        let val1 = relationship1[key];
        /** @type {?} */
        let val2 = relationship2[key];
        if (val1 != undefined || val2 != undefined) {
            if (val1 == undefined) {
                return val2;
            }
            else if (val2 == undefined) {
                return val1;
            }
            else {
                if (val1 instanceof Array || val2 instanceof Array) {
                    if (!(val1 instanceof Array)) {
                        val2.push(val1);
                        return val2;
                    }
                    else if (!(val2 instanceof Array)) {
                        val1.push(val2);
                        return val1;
                    }
                    return val1.concat(val2);
                }
                else if (val1 instanceof Object || val2 instanceof Object) {
                    if (!(val1 instanceof Object)) {
                        val2.custom_key_assigned = val1;
                        return val2;
                    }
                    else if (!(val2 instanceof Object)) {
                        val1.custom_key_assigned = val2;
                        return val1;
                    }
                    /** @type {?} */
                    const keys = this.mergeKeys(val1, val2);
                    /** @type {?} */
                    let obj = {};
                    keys.forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    key => {
                        obj[key] = this.assignAttributesValue(key, val1, val2);
                    }));
                    return obj;
                }
                return val1 + ', ' + val2;
            }
        }
        return undefined;
    }
}
NgNeo4jd3Service.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NgNeo4jd3Service.ctorParameters = () => [];
/** @nocollapse */ NgNeo4jd3Service.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NgNeo4jd3Service_Factory() { return new NgNeo4jd3Service(); }, token: NgNeo4jd3Service, providedIn: "root" });
if (false) {
    /** @type {?} */
    NgNeo4jd3Service.prototype.outOfContext;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.valueSet;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.container;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.containerIdentity;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.info;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.node;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.nodes;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationship;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationships;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationshipOutline;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationshipOverlay;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationshipText;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.simulation;
    /** @type {?} */
    NgNeo4jd3Service.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.svgNodes;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.svgRelationships;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.svgTranslate;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.classes2colors;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.justLoaded;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.numClasses;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.svgScale;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.optionsInput;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbmVvNGpkMy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbmVvNGpkMy8iLCJzb3VyY2VzIjpbImxpYi9uZy1uZW80amQzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7QUFLdEQsTUFBTSxPQUFPLGdCQUFnQjtJQTJEM0I7UUF6RE8saUJBQVksR0FBYSxLQUFLLENBQUM7UUFDOUIsYUFBUSxHQUFhLEtBQUssQ0FBQztRQXFCM0IsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQUlyQixZQUFPLEdBQXNCO1lBQ2pDLFNBQVMsRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDckIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsS0FBSyxFQUFFLFNBQVM7WUFDaEIsT0FBTyxFQUFFLEVBQUU7O1lBQ1gsUUFBUSxFQUFFLEVBQUU7WUFDWixNQUFNLEVBQUUsU0FBUztZQUNqQixTQUFTLEVBQUUsSUFBSTtZQUNmLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLG9CQUFvQixFQUFFLFNBQVM7WUFDL0IsVUFBVSxFQUFFLEVBQUU7WUFDZCxpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsU0FBUyxFQUFFLElBQUk7WUFDZixpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLFdBQVcsRUFBRSxT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LENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUN6RixjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUNySSxjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUN6SixjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDalAsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ2pRLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUNqTCxjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDelAsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FB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Ozs7O0lBQ3RDLG9DQUFtQzs7Ozs7SUFFbkMscUNBQWtCOzs7OztJQUNsQiw2Q0FBMEI7Ozs7O0lBQzFCLGdDQUFhOzs7OztJQUNiLGdDQUFhOzs7OztJQUNiLGlDQUFjOzs7OztJQUVkLHdDQUFxQjs7Ozs7SUFDckIseUNBQW1DOzs7OztJQUNuQywrQ0FBNEI7Ozs7O0lBQzVCLCtDQUE0Qjs7Ozs7SUFDNUIsNENBQXlCOzs7OztJQUV6QixzQ0FBbUI7O0lBRW5CLCtCQUFXOzs7OztJQUNYLG9DQUFpQjs7Ozs7SUFDakIsNENBQXlCOzs7OztJQUN6Qix3Q0FBcUI7Ozs7O0lBRXJCLDBDQUE0Qjs7Ozs7SUFDNUIsc0NBQTJCOzs7OztJQUMzQixzQ0FBdUI7Ozs7O0lBQ3ZCLG9DQUE2Qjs7Ozs7SUFFN0Isd0NBQThCOzs7OztJQUU5QixtQ0F5QkUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XG5pbXBvcnQgeyBOZ05lbzRqRDNPcHRpb25zLCBSZWxhdGlvbnNoaXBFbnRlciB9IGZyb20gJy4vbmctbmVvNGpkMy5tb2RlbCc7XG5pbXBvcnQgeyBOZ05lbzRqRDNJY29ucyB9IGZyb20gJy4vbmctbmVvNGpkMy5pY29ucyc7XG5pbXBvcnQgeyBOZW80akQzUmVjb3JkcyB9IGZyb20gXCIuL25nLW5lbzRqZDMucmVjb3Jkc1wiO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ05lbzRqZDNTZXJ2aWNlIHtcblxuICBwdWJsaWMgb3V0T2ZDb250ZXh0IDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHZhbHVlU2V0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgY29udGFpbmVyO1xuICBwcml2YXRlIGNvbnRhaW5lcklkZW50aXR5O1xuICBwcml2YXRlIGluZm87XG4gIHByaXZhdGUgbm9kZTtcbiAgcHJpdmF0ZSBub2RlcztcblxuICBwcml2YXRlIHJlbGF0aW9uc2hpcDtcbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXBzIDogQXJyYXk8YW55PjtcbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXBPdXRsaW5lO1xuICBwcml2YXRlIHJlbGF0aW9uc2hpcE92ZXJsYXk7XG4gIHByaXZhdGUgcmVsYXRpb25zaGlwVGV4dDtcblxuICBwcml2YXRlIHNpbXVsYXRpb247XG5cbiAgcHVibGljIHN2ZztcbiAgcHJpdmF0ZSBzdmdOb2RlcztcbiAgcHJpdmF0ZSBzdmdSZWxhdGlvbnNoaXBzO1xuICBwcml2YXRlIHN2Z1RyYW5zbGF0ZTtcbiAgXG4gIHByaXZhdGUgY2xhc3NlczJjb2xvcnMgPSB7fTtcbiAgcHJpdmF0ZSBqdXN0TG9hZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgbnVtQ2xhc3NlcyA9IDA7XG4gIHByaXZhdGUgc3ZnU2NhbGUgPSB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBvcHRpb25zSW5wdXQgOiBPYmplY3Q7XG5cbiAgcHJpdmF0ZSBvcHRpb25zIDogTmdOZW80akQzT3B0aW9ucyA9IHtcbiAgICAgIGFycm93U2l6ZTogNCxcbiAgICAgIGNvbG9yczogdGhpcy5jb2xvcnMoKSxcbiAgICAgIGhpZ2hsaWdodDogdW5kZWZpbmVkLFxuICAgICAgaWNvbnM6IHVuZGVmaW5lZCxcbiAgICAgIGljb25NYXA6IFtdLCAgICAvLyBUaGlzIHZhbHVlIGFzc2lnbmVkIGluIE5lbzRqUmFuZG9tXG4gICAgICBpbWFnZU1hcDoge30sXG4gICAgICBpbWFnZXM6IHVuZGVmaW5lZCxcbiAgICAgIGluZm9QYW5lbDogdHJ1ZSxcbiAgICAgIG1pbkNvbGxpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgbmVvNGpEYXRhOiB1bmRlZmluZWQsXG4gICAgICBuZW80akRhdGFVcmw6IHVuZGVmaW5lZCxcbiAgICAgIG5vZGVPdXRsaW5lRmlsbENvbG9yOiB1bmRlZmluZWQsXG4gICAgICBub2RlUmFkaXVzOiAyNSxcbiAgICAgIHJlbGF0aW9uc2hpcENvbG9yOiAnI2E1YWJiNicsXG4gICAgICB6b29tRml0OiBmYWxzZSxcbiAgICAgIHNob3dJY29uczogdHJ1ZSxcbiAgICAgIG9uTm9kZURvdWJsZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlTW91c2VFbnRlcjogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlTW91c2VMZWF2ZTogdW5kZWZpbmVkLFxuICAgICAgb25SZWxhdGlvbnNoaXBEb3VibGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlRHJhZ0VuZDogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlRHJhZ1N0YXJ0OiB1bmRlZmluZWQsXG4gICAgICBncmFwaENvbnRhaW5lckhlaWdodDogJzEwMCUnXG4gIH07XG5cblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgcHVibGljIHNldFZhbHVlcyAoX3NlbGVjdG9yLCBfb3B0aW9uczphbnkpIDogdm9pZCB7XG4gICAgICBuZXcgTmdOZW80akQzSWNvbnModGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMuY29udGFpbmVySWRlbnRpdHkgPSBfc2VsZWN0b3I7XG4gICAgICB0aGlzLm9wdGlvbnNJbnB1dCA9IF9vcHRpb25zO1xuICAgICAgdGhpcy52YWx1ZVNldCA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgaXNWYWx1ZVNldCgpIDogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVNldDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRPcHRpb25zSW5wdXQoKSA6IE9iamVjdCB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zSW5wdXQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29udGFpbmVyKCkgOiBPYmplY3Qge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xuICB9XG5cblxuICBwdWJsaWMgaW5pdCgpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGQzLnNlbGVjdCh0aGlzLmNvbnRhaW5lcklkZW50aXR5KTtcbiAgICB0aGlzLmluaXRJY29uTWFwKHRoaXMub3B0aW9ucyk7XG5cbiAgICB0aGlzLm1lcmdlUHJvcGVydHkodGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnNJbnB1dCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm5lbzRqRGF0YSkge1xuICAgICAgdGhpcy5tZXJnZVJlbGF0aW9uc2hpcFdpdGhTYW1lTm9kZXMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmljb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zaG93SWNvbnMgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRpb25zLm1pbkNvbGxpc2lvbikge1xuICAgICAgICB0aGlzLm9wdGlvbnMubWluQ29sbGlzaW9uID0gdGhpcy5vcHRpb25zLm5vZGVSYWRpdXMgKiAyO1xuICAgIH1cbiAgICB0aGlzLmluaXRJbWFnZU1hcCh0aGlzLm9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb250YWluZXIuYXR0cignY2xhc3MnLCAnbmVvNGpkMycpXG4gICAgICAgICAgLmh0bWwoJycpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbmZvUGFuZWwpIHtcbiAgICAgICAgdGhpcy5pbmZvID0gdGhpcy5hcHBlbmRJbmZvUGFuZWwodGhpcy5jb250YWluZXIpO1xuICAgIH1cblxuICAgIHRoaXMuc3ZnID0gdGhpcy5hcHBlbmRHcmFwaCh0aGlzLmNvbnRhaW5lcik7XG5cbiAgICB0aGlzLnNpbXVsYXRpb24gPSB0aGlzLmluaXRTaW11bGF0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm5lbzRqRGF0YSkge1xuICAgICAgICB0aGlzLmxvYWROZW80akRhdGEoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5uZW80akRhdGFVcmwpIHtcbiAgICAgICAgdGhpcy5sb2FkTmVvNGpEYXRhRnJvbVVybCh0aGlzLm9wdGlvbnMubmVvNGpEYXRhVXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogYm90aCBuZW80akRhdGEgYW5kIG5lbzRqRGF0YVVybCBhcmUgZW1wdHkhJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBpbml0U2ltdWxhdGlvbigpIHtcblxuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuXG4gICAgICB2YXIgcGFyZW50RWxlbWVudCA9IHRoaXMuc3ZnLm5vZGUoKS5wYXJlbnRFbGVtZW50O1xuICAgICAgaWYocGFyZW50RWxlbWVudD09dW5kZWZpbmVkIHx8IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudD09dW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjbGllbnRXaWR0aCA9IHRoaXMuc3ZnLm5vZGUoKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGggLyAyO1xuICAgICAgY29uc3QgY2xpZW50SGVpZ2h0ID0gdGhpcy5zdmcubm9kZSgpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAyO1xuXG4gICAgICB2YXIgc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbigpIFxuICAgICAgICAgIC8vIC52ZWxvY2l0eURlY2F5KDAuOClcbiAgICAgICAgICAvLyAuZm9yY2UoJ3gnLCBkMy5mb3JjZSgpLnN0cmVuZ3RoKDAuMDAyKSlcbiAgICAgICAgICAvLyAuZm9yY2UoJ3knLCBkMy5mb3JjZSgpLnN0cmVuZ3RoKDAuMDAyKSlcbiAgICAgICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5vcHRpb25zLm1pbkNvbGxpc2lvbjtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5pdGVyYXRpb25zKDIpKVxuICAgICAgICAgIC5mb3JjZSgnY2hhcmdlJywgZDMuZm9yY2VNYW55Qm9keSgpKVxuICAgICAgICAgIC5mb3JjZSgnbGluaycsIGQzLmZvcmNlTGluaygpLmlkKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGQuaWQ7XG4gICAgICAgICAgfSkpXG4gICAgICAgICAgLmZvcmNlKCdjZW50ZXInLCBkMy5mb3JjZUNlbnRlcihjbGllbnRXaWR0aCwgY2xpZW50SGVpZ2h0KSlcbiAgICAgICAgICAub24oJ3RpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdGhpc09iai50aWNrKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLnpvb21GaXQgJiYgIXRoaXNPYmouanVzdExvYWRlZCkge1xuICAgICAgICAgICAgICAgIC8vIEZPUiBDVVNUT01JWkFUSU9OXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIHJldHVybiBzaW11bGF0aW9uO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEdyYXBoKGNvbnRhaW5lcikge1xuICAgICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICAgIHZhciBzdmcgPSBjb250YWluZXIuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzT2JqLm9wdGlvbnMuZ3JhcGhDb250YWluZXJIZWlnaHQpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICduZW80amQzLWdyYXBoJylcbiAgICAgICAgICAgICAgICAgLmNhbGwoZDMuem9vbSgpLm9uKCd6b29tJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSBkMy5ldmVudC50cmFuc2Zvcm0uayxcbiAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUgPSBbZDMuZXZlbnQudHJhbnNmb3JtLngsIGQzLmV2ZW50LnRyYW5zZm9ybS55XTtcblxuICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouc3ZnVHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlWzBdICs9IHRoaXNPYmouc3ZnVHJhbnNsYXRlWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVsxXSArPSB0aGlzT2JqLnN2Z1RyYW5zbGF0ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouc3ZnU2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZSAqPSB0aGlzT2JqLnN2Z1NjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLnN2Zy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB0cmFuc2xhdGVbMF0gKyAnLCAnICsgdHJhbnNsYXRlWzFdICsgJykgc2NhbGUoJyArIHNjYWxlICsgJyknKTtcbiAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgIC5vbignZGJsY2xpY2suem9vbScsIG51bGwpXG4gICAgICAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAnMTAwJScpO1xuXG4gICAgICAgICAgICAgICAgICB0aGlzLnN2Z1JlbGF0aW9uc2hpcHMgPSBzdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAncmVsYXRpb25zaGlwcycpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5zdmdOb2RlcyA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdub2RlcycpO1xuICAgICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvUGFuZWwoY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICduZW80amQzLWluZm8nKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvRWxlbWVudChjbHMsIGlzTm9kZSwgcHJvcGVydHksIHZhbHVlPW51bGwpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy5pbmZvLmFwcGVuZCgnYScpO1xuXG4gICAgICBlbGVtLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAuYXR0cignY2xhc3MnLCBjbHMpXG4gICAgICAuaHRtbCgnPHN0cm9uZz4nICsgcHJvcGVydHkgKyAnPC9zdHJvbmc+JyArICh2YWx1ZSA/ICgnOiAnICsgdmFsdWUpIDogJycpKTtcblxuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgICAgICAgZWxlbS5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA6IChpc05vZGUgPyB0aGlzT2JqLmNsYXNzMmNvbG9yKHByb3BlcnR5KSA6IHRoaXNPYmouZGVmYXVsdENvbG9yKCkpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN0eWxlKCdib3JkZXItY29sb3InLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvcikgOiAoaXNOb2RlID8gdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcihwcm9wZXJ0eSkgOiB0aGlzT2JqLmRlZmF1bHREYXJrZW5Db2xvcigpKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnY29sb3InLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvcikgOiAnI2ZmZic7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb0VsZW1lbnRDbGFzcyhjbHMsIG5vZGUpIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCB0cnVlLCBub2RlKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvRWxlbWVudFByb3BlcnR5KGNscywgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50KGNscywgZmFsc2UsIHByb3BlcnR5LCB2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb0VsZW1lbnRSZWxhdGlvbnNoaXAoY2xzLCByZWxhdGlvbnNoaXApIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCBmYWxzZSwgcmVsYXRpb25zaGlwKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmROb2RlKCkge1xuICAgICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLm5vZGUuZW50ZXIoKVxuICAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgdmFyIGNsYXNzZXMgPSAnbm9kZSc7XG4gICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLmljb24oZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgKz0gJyBub2RlLWljb24nO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLmltYWdlKGQpKSB7XG4gICAgICAgICAgICAgICAgICAgICBjbGFzc2VzICs9ICcgbm9kZS1pbWFnZSc7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpc09iai5vcHRpb25zLmhpZ2hsaWdodC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGhpZ2hsaWdodCA9IHRoaXNPYmoub3B0aW9ucy5oaWdobGlnaHRbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZC5sYWJlbHNbMF0gPT09IGhpZ2hsaWdodC5jbGFzcyAmJiBkLnByb3BlcnRpZXNbaGlnaGxpZ2h0LnByb3BlcnR5XSA9PT0gaGlnaGxpZ2h0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgKz0gJyBub2RlLWhpZ2hsaWdodGVkJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzO1xuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgIGQuZnggPSBkLmZ5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25Ob2RlQ2xpY2sgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vbk5vZGVDbGljayhkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5vbignZGJsY2xpY2snLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgIHRoaXNPYmouc3RpY2tOb2RlKGQpO1xuICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uTm9kZURvdWJsZUNsaWNrICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25Ob2RlRG91YmxlQ2xpY2soZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5pbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai51cGRhdGVJbmZvKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vbk5vZGVNb3VzZUVudGVyICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25Ob2RlTW91c2VFbnRlcihkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLmluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLmNsZWFySW5mbygpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vbk5vZGVNb3VzZUxlYXZlICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25Ob2RlTW91c2VMZWF2ZShkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5jYWxsKGQzLmRyYWcoKVxuICAgICAgICAgICAgICAgICAgICAgLm9uKCdzdGFydCcsICBmdW5jdGlvbihkKSB7IHRoaXNPYmouZHJhZ1N0YXJ0ZWQoZCk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAgLm9uKCdkcmFnJywgZnVuY3Rpb24oZCkgeyB0aGlzT2JqLmRyYWdnZWQoZCk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAgLm9uKCdlbmQnLCBmdW5jdGlvbihkKSB7IHRoaXNPYmouZHJhZ0VuZGVkKGQpOyB9ICkgKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmROb2RlVG9HcmFwaCgpIHtcbiAgICAgIHZhciBuID0gdGhpcy5hcHBlbmROb2RlKCk7XG4gICAgICB0aGlzLmFwcGVuZFJpbmdUb05vZGUobik7XG4gICAgICB0aGlzLmFwcGVuZE91dGxpbmVUb05vZGUobik7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmljb25zKSB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRUZXh0VG9Ob2RlKG4pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbWFnZXMpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZEltYWdlVG9Ob2RlKG4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG47XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kT3V0bGluZVRvTm9kZShub2RlKSB7XG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgIHJldHVybiBub2RlLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnb3V0bGluZScpXG4gICAgICAgICAgICAgLmF0dHIoJ3InLCBvcHRpb25zLm5vZGVSYWRpdXMpXG4gICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgOiB0aGlzT2JqLmNsYXNzMmNvbG9yKGQubGFiZWxzWzBdKTtcbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3Iob3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvcikgOiB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKGQubGFiZWxzWzBdKTtcbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5hcHBlbmQoJ3RpdGxlJykudGV4dChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai50b1N0cmluZyhkKTtcbiAgICAgICAgICAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjbGFzczJjb2xvcihjbHMpIHtcbiAgICAgIHZhciBjb2xvciA9IHRoaXMuY2xhc3NlczJjb2xvcnNbY2xzXTtcbiAgICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgICAvLyBjb2xvciA9IHRoaXMub3B0aW9ucy5jb2xvcnNbTWF0aC5taW4obnVtQ2xhc3NlcywgdGhpcy5vcHRpb25zLmNvbG9ycy5sZW5ndGggLSAxKV07XG4gICAgICAgICAgY29sb3IgPSB0aGlzLm9wdGlvbnMuY29sb3JzW3RoaXMubnVtQ2xhc3NlcyAlIHRoaXMub3B0aW9ucy5jb2xvcnMubGVuZ3RoXTtcbiAgICAgICAgICB0aGlzLmNsYXNzZXMyY29sb3JzW2Nsc10gPSBjb2xvcjtcbiAgICAgICAgICB0aGlzLm51bUNsYXNzZXMrKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb2xvcjtcbiAgfVxuXG4gIHB1YmxpYyBjbGFzczJkYXJrZW5Db2xvcihjbHMpIHtcbiAgICAgIHZhciBjb2xvclZhbHVlID0gdGhpcy5jbGFzczJjb2xvcihjbHMpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBDT0xPUiBPYmplY3QgaXMgbm90IHdvcmtpbmcgcHJvcGVybHkgd2hlbiB0aGUgb3B0aW1pemF0aW9uIGlzIHNldCB0cnVlXG4gICAgICAgICAgdmFyIGNvbG9yT2JqZWN0ID0gZDMucmdiKGNvbG9yVmFsdWUpO1xuICAgICAgICAgIHJldHVybiBjb2xvck9iamVjdC5kYXJrZXIoMSk7XG4gICAgICB9XG4gICAgICBjYXRjaChlcnIpIHt9XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kUmluZ1RvTm9kZShub2RlKSB7XG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG4gICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3JpbmcnKVxuICAgICAgICAgIC5hdHRyKCdyJywgdGhpcy5vcHRpb25zLm5vZGVSYWRpdXMgKiAxLjE2KVxuICAgICAgICAgIC5hcHBlbmQoJ3RpdGxlJykudGV4dChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXNPYmoudG9TdHJpbmcoZCk7XG4gICAgICB9KTtcbiAgfVxuXG5cbiAgcHVibGljIGFwcGVuZEltYWdlVG9Ob2RlKG5vZGUpIHtcbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcbiAgICAgIC8vIFRPRE8gPj4gQ2hhbmdlIFRoaXMgVG8gQmVjb21lIFRoZSBDb250YWluZXJcbiAgICAgIC8vIEFkZGVkIHRoZSBbaWNvbkZsYWddIGF0dHJpYnV0ZSBpbiB0aGUgbm9kZSBvciAnZCcgdmFyaWFibGVcbiAgICAgIHJldHVybiBub2RlLmFwcGVuZCgnaW1hZ2UnKS5hdHRyKCd3aWR0aCcsICczNXB4JylcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsICczNXB4JykuYXR0cigneCcsICctMThweCcpLmF0dHIoJ3knLCAnLTE4cHgnKVxuICAgICAgICAuYXR0cigneGxpbms6aHJlZicsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHRoaXNPYmouaW1hZ2UoZCk7IH0pO1xuICAgICA7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kVGV4dFRvTm9kZShub2RlKSB7XG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG4gICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICd0ZXh0JyArICh0aGlzT2JqLmljb24oZCkgPyAnIGljb24nIDogJycpOyB9KVxuICAgICAgICAgIC5hdHRyKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgICAgICAuYXR0cignZm9udC1zaXplJywgZnVuY3Rpb24oZCkgeyByZXR1cm4gKHRoaXNPYmouaWNvbihkKSA/ICcyNXB4JyA6ICcxMnB4Jyk7IH0pXG4gICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAgIC5hdHRyKCd4JywgZnVuY3Rpb24oZCkgeyByZXR1cm4gKHRoaXNPYmouaWNvbihkKSA/ICcyNXB4JyA6ICczMHB4Jyk7IH0pXG4gICAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbihkKSB7IHJldHVybiAodGhpc09iai5pY29uKGQpID8gJzI1cHgnIDogJzMwcHgnKTsgfSlcbiAgICAgICAgICAuYXR0cignc3R5bGUnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJnYiA9ICdmaWxsOiByZ2IoMjI1LCAyMjUsIDIyNSk7IHN0cm9rZTogcmdiKDAwMCwgMDAwLCAwMDApOyc7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLmljb24oZCkgPyByZ2IgOiAnJztcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5odG1sKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgdmFyIF9pY29uID0gdGhpc09iai5pY29uKGQpO1xuICAgICAgICAgICAgICByZXR1cm4gX2ljb24gPyAnJiN4JyArIF9pY29uIDogZC5pZDtcbiAgICAgICAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRSYW5kb21EYXRhVG9Ob2RlKGQsIG1heE5vZGVzVG9HZW5lcmF0ZSkge1xuICAgICAgdmFyIGRhdGEgPSB0aGlzLnJhbmRvbUQzRGF0YShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpO1xuICAgICAgdGhpcy51cGRhdGVXaXRoTmVvNGpEYXRhKGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFJlbGF0aW9uc2hpcCgpIHtcbiAgICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgICAvLyBGdW5jdGlvbiA+IERvdWJsZSBDbGljayBcbiAgICAgIGNvbnN0IGZuRG91YmxlQ2xpY2sgPSBmdW5jdGlvbihkOmFueSkge1xuICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25SZWxhdGlvbnNoaXBEb3VibGVDbGljayAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrKGQpO1xuICAgICAgICAgIH1cbiAgICAgIH07XG4gICAgICAvLyBGdW5jdGlvbiA+IE1vdXNlIEVudGVyXG4gICAgICBjb25zdCBmbk1vdXNlRW50ZXIgPSBmdW5jdGlvbihkOmFueSkge1xuICAgICAgICAgIGlmICh0aGlzT2JqLmluZm8pIHtcbiAgICAgICAgICAgICAgdGhpc09iai51cGRhdGVJbmZvKGQpO1xuICAgICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy5yZWxhdGlvbnNoaXAuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdyZWxhdGlvbnNoaXAnKS5vbignZGJsY2xpY2snLCBmbkRvdWJsZUNsaWNrKS5vbignbW91c2VlbnRlcicsIGZuTW91c2VFbnRlcik7XG4gIH1cblxuICBwdWJsaWMgY2xlYXJJbmZvKCkge1xuICAgICAgdGhpcy5pbmZvLmh0bWwoJycpO1xuICB9XG5cbiAgcHVibGljIGNvbG9yKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb2xvcnNbdGhpcy5vcHRpb25zLmNvbG9ycy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpIDw8IDBdO1xuICB9XG5cbiAgcHVibGljIGNvbG9ycygpIDogQXJyYXk8U3RyaW5nPiB7XG4gICAgICAvLyBkMy5zY2hlbWVDYXRlZ29yeTEwLFxuICAgICAgLy8gZDMuc2NoZW1lQ2F0ZWdvcnkyMCxcbiAgICAgIHJldHVybiBbXG4gICAgICAgICAgJyM2OGJkZjYnLCAvLyBsaWdodCBibHVlXG4gICAgICAgICAgJyM2ZGNlOWUnLCAvLyBncmVlbiAjMVxuICAgICAgICAgICcjZmFhZmMyJywgLy8gbGlnaHQgcGlua1xuICAgICAgICAgICcjZjJiYWY2JywgLy8gcHVycGxlXG4gICAgICAgICAgJyNmZjkyOGMnLCAvLyBsaWdodCByZWRcbiAgICAgICAgICAnI2ZjZWE3ZScsIC8vIGxpZ2h0IHllbGxvd1xuICAgICAgICAgICcjZmZjNzY2JywgLy8gbGlnaHQgb3JhbmdlXG4gICAgICAgICAgJyM0MDVmOWUnLCAvLyBuYXZ5IGJsdWVcbiAgICAgICAgICAnI2E1YWJiNicsIC8vIGRhcmsgZ3JheVxuICAgICAgICAgICcjNzhjZWNiJywgLy8gZ3JlZW4gIzIsXG4gICAgICAgICAgJyNiODhjYmInLCAvLyBkYXJrIHB1cnBsZVxuICAgICAgICAgICcjY2VkMmQ5JywgLy8gbGlnaHQgZ3JheVxuICAgICAgICAgICcjZTg0NjQ2JywgLy8gZGFyayByZWRcbiAgICAgICAgICAnI2ZhNWY4NicsIC8vIGRhcmsgcGlua1xuICAgICAgICAgICcjZmZhYjFhJywgLy8gZGFyayBvcmFuZ2VcbiAgICAgICAgICAnI2ZjZGExOScsIC8vIGRhcmsgeWVsbG93XG4gICAgICAgICAgJyM3OTdiODAnLCAvLyBibGFja1xuICAgICAgICAgICcjYzlkOTZmJywgLy8gcGlzdGFjY2hpb1xuICAgICAgICAgICcjNDc5OTFmJywgLy8gZ3JlZW4gIzNcbiAgICAgICAgICAnIzcwZWRlZScsIC8vIHR1cnF1b2lzZVxuICAgICAgICAgICcjZmY3NWVhJyAgLy8gcGlua1xuICAgICAgXTtcbiAgfVxuXG4gIHB1YmxpYyBjb250YWluc1Jlc3VsdChhcnJheSwgaWQpIHtcbiAgICAgIHZhciBmaWx0ZXIgPSBhcnJheS5maWx0ZXIoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgIHJldHVybiBlbGVtLmlkID09PSBpZDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZpbHRlci5sZW5ndGggPiAwO1xuICB9XG5cbiAgcHVibGljIGRlZmF1bHRDb2xvcigpIHtcbiAgcmV0dXJuIHRoaXMub3B0aW9ucy5yZWxhdGlvbnNoaXBDb2xvcjtcbiAgfVxuXG4gIHB1YmxpYyBkZWZhdWx0RGFya2VuQ29sb3IoKSB7XG4gICAgICB2YXIgY29sb3JWYWx1ZSA9IHRoaXMub3B0aW9ucy5jb2xvcnNbdGhpcy5vcHRpb25zLmNvbG9ycy5sZW5ndGggLSAxXTtcbiAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gQ09MT1IgT2JqZWN0IGlzIG5vdCB3b3JraW5nIHByb3Blcmx5IHdoZW4gdGhlIG9wdGltaXphdGlvbiBpcyBzZXQgdHJ1ZVxuICAgICAgICAgIHZhciBjb2xvck9iamVjdCA9IGQzLnJnYihjb2xvclZhbHVlKTtcbiAgICAgICAgICByZXR1cm4gY29sb3JPYmplY3QuZGFya2VyKDEpO1xuICAgICAgfVxuICAgICAgY2F0Y2goZXJyKSB7IH1cbiAgfVxuXG4gIHB1YmxpYyBkcmFnRW5kZWQoZCkge1xuICAgICAgaWYgKCFkMy5ldmVudC5hY3RpdmUpIHtcbiAgICAgICAgICB0aGlzLnNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub25Ob2RlRHJhZ0VuZCAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uTm9kZURyYWdFbmQoZCk7XG4gICAgICB9XG4gIH1cblxuICBwdWJsaWMgZHJhZ2dlZChkKSB7XG4gICAgICB0aGlzLnN0aWNrTm9kZShkKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmFnU3RhcnRlZChkKSB7XG4gICAgICBpZiAoIWQzLmV2ZW50LmFjdGl2ZSkge1xuICAgICAgICAgIHRoaXMuc2ltdWxhdGlvbi5hbHBoYVRhcmdldCgwLjMpLnJlc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIGQuZnggPSBkLng7XG4gICAgICBkLmZ5ID0gZC55O1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbk5vZGVEcmFnU3RhcnQgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5vbk5vZGVEcmFnU3RhcnQoZCk7XG4gICAgICB9XG4gIH1cblxuICBwdWJsaWMgZXh0ZW5kKG9iajEsIG9iajIpIHtcbiAgICB2YXIgb2JqID0ge307XG4gICAgdGhpcy5tZXJnZVByb3BlcnR5KG9iaiwgb2JqMSk7XG4gICAgdGhpcy5tZXJnZVByb3BlcnR5KG9iaiwgb2JqMik7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG5cbiAgcHVibGljIGljb24oZCkge1xuICAgIHZhciBjb2RlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pY29uTWFwICYmIHRoaXMub3B0aW9ucy5zaG93SWNvbnMgJiYgdGhpcy5vcHRpb25zLmljb25zKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dICYmIHRoaXMub3B0aW9ucy5pY29uTWFwW3RoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV1dKSB7XG4gICAgICAgICAgICBjb2RlID0gdGhpcy5vcHRpb25zLmljb25NYXBbdGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXV07XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmljb25NYXBbZC5sYWJlbHNbMF1dKSB7XG4gICAgICAgICAgICBjb2RlID0gdGhpcy5vcHRpb25zLmljb25NYXBbZC5sYWJlbHNbMF1dO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV0pIHtcbiAgICAgICAgICAgIGNvZGUgPSB0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvZGU7XG4gIH1cblxuICBwdWJsaWMgaW1hZ2UoZCkge1xuICAgIHZhciBpLCBpbWFnZXNGb3JMYWJlbCwgaW1nLCBpbWdMZXZlbCwgbGFiZWwsIGxhYmVsUHJvcGVydHlWYWx1ZSwgcHJvcGVydHksIHZhbHVlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbWFnZXMpIHtcbiAgICAgICAgY29uc3QgaW1nUmVmID0gZC5pbWc9PXVuZGVmaW5lZCA/IGQubGFiZWxzWzBdIDogZC5pbWc7XG4gICAgICAgIGltYWdlc0ZvckxhYmVsID0gdGhpcy5vcHRpb25zLmltYWdlTWFwW2ltZ1JlZl07XG5cbiAgICAgICAgaWYgKGltYWdlc0ZvckxhYmVsKSB7XG4gICAgICAgICAgICBpbWdMZXZlbCA9IDA7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbWFnZXNGb3JMYWJlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxhYmVsUHJvcGVydHlWYWx1ZSA9IGltYWdlc0ZvckxhYmVsW2ldLnNwbGl0KCd8Jyk7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGxhYmVsUHJvcGVydHlWYWx1ZVsyXTtcbiAgICAgICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gbGFiZWxQcm9wZXJ0eVZhbHVlWzFdO1xuICAgICAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBsYWJlbFByb3BlcnR5VmFsdWVbMF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGltZ1JlZiA9PT0gbGFiZWwgJiZcbiAgICAgICAgICAgICAgICAgICAgKCFwcm9wZXJ0eSB8fCBkLnByb3BlcnRpZXNbcHJvcGVydHldICE9PSB1bmRlZmluZWQpICYmXG4gICAgICAgICAgICAgICAgICAgICghdmFsdWUgfHwgZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSA9PT0gdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbFByb3BlcnR5VmFsdWUubGVuZ3RoID4gaW1nTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IHRoaXMub3B0aW9ucy5pbWFnZXNbaW1hZ2VzRm9yTGFiZWxbaV1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nTGV2ZWwgPSBsYWJlbFByb3BlcnR5VmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGltZztcbiAgfVxuXG4gIHB1YmxpYyBsb2FkTmVvNGpEYXRhKCkge1xuICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcHMgPSBbXTtcbiAgICB0aGlzLnVwZGF0ZVdpdGhOZW80akRhdGEodGhpcy5vcHRpb25zLm5lbzRqRGF0YSk7XG4gIH1cblxuICBwdWJsaWMgbG9hZE5lbzRqRGF0YUZyb21VcmwobmVvNGpEYXRhVXJsKSB7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgIHRoaXMucmVsYXRpb25zaGlwcyA9IFtdO1xuXG4gICAgZDMuanNvbihuZW80akRhdGFVcmwsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVXaXRoTmVvNGpEYXRhKGRhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5lbzRqRGF0YVRvRDNEYXRhKGRhdGEpIHtcbiAgICB2YXIgZ3JhcGggPSB7XG4gICAgICAgIG5vZGVzOiBbXSxcbiAgICAgICAgcmVsYXRpb25zaGlwczogW11cbiAgICB9O1xuXG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICBkYXRhLnJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0LmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBkYXRhLmdyYXBoLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpc09iai5jb250YWluc1Jlc3VsdChncmFwaC5ub2Rlcywgbm9kZS5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGgubm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzLmZvckVhY2goZnVuY3Rpb24ocmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLnNvdXJjZSA9IHJlbGF0aW9uc2hpcC5zdGFydE5vZGU7XG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLnRhcmdldCA9IHJlbGF0aW9uc2hpcC5lbmROb2RlO1xuICAgICAgICAgICAgICAgIGdyYXBoLnJlbGF0aW9uc2hpcHMucHVzaChyZWxhdGlvbnNoaXApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYS5zb3VyY2UgPiBiLnNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGEuc291cmNlIDwgYi5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhLnRhcmdldCA+IGIudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhLnRhcmdldCA8IGIudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpICE9PSAwICYmIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpXS5zb3VyY2UgPT09IGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpLTFdLnNvdXJjZSAmJiBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaV0udGFyZ2V0ID09PSBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaS0xXS50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLmxpbmtudW0gPSBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaSAtIDFdLmxpbmtudW0gKyAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpXS5saW5rbnVtID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKGQpIHtcbiAgICB2YXIgcyA9IGQubGFiZWxzID8gZC5sYWJlbHNbMF0gOiBkLnR5cGU7XG4gICAgcyArPSAnICg8aWQ+OiAnICsgZC5pZDtcbiAgICBPYmplY3Qua2V5cyhkLnByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgcyArPSAnLCAnICsgcHJvcGVydHkgKyAnOiAnICsgSlNPTi5zdHJpbmdpZnkoZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSk7XG4gICAgfSk7XG4gICAgcyArPSAnKSc7XG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICBwdWJsaWMgcmFuZG9tRDNEYXRhKGQsIG1heE5vZGVzVG9HZW5lcmF0ZSkge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgICBub2RlczogW10sXG4gICAgICAgIHJlbGF0aW9uc2hpcHM6IFtdXG4gICAgfTtcblxuICAgIHZhciBudW1Ob2RlcyA9IChtYXhOb2Rlc1RvR2VuZXJhdGUgKiBNYXRoLnJhbmRvbSgpIDw8IDApICsgMTtcbiAgICB2YXIgcyA9IHRoaXMuc2l6ZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XG4gICAgICAvLyB2YXIgaWNvbnMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuaWNvbk1hcCk7XG4gICAgICBjb25zdCBsYWJlbCA9IFwiSGVsbG9cIjsgLy8gaWNvbnNbaWNvbnMubGVuZ3RoICogTWF0aC5yYW5kb20oKSA8PCAwXTtcblxuICAgICAgY29uc3Qgbm9kZSA9IHtcbiAgICAgICAgICBpZDogcy5ub2RlcyArIDEgKyBpLFxuICAgICAgICAgIGxhYmVsczogW2xhYmVsXSxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHJhbmRvbTogbGFiZWxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHg6IGQueCxcbiAgICAgICAgICB5OiBkLnlcbiAgICAgIH07XG5cbiAgICAgIGRhdGEubm9kZXNbZGF0YS5ub2Rlcy5sZW5ndGhdID0gbm9kZTtcblxuICAgICAgY29uc3QgcmVsYXRpb25zaGlwID0ge1xuICAgICAgICAgIGlkOiBzLnJlbGF0aW9uc2hpcHMgKyAxICsgaSxcbiAgICAgICAgICB0eXBlOiBsYWJlbC50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIHN0YXJ0Tm9kZTogZC5pZCxcbiAgICAgICAgICBlbmROb2RlOiBzLm5vZGVzICsgMSArIGksXG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBmcm9tOiBEYXRlLm5vdygpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzb3VyY2U6IGQuaWQsXG4gICAgICAgICAgdGFyZ2V0OiBzLm5vZGVzICsgMSArIGksXG4gICAgICAgICAgbGlua251bTogcy5yZWxhdGlvbnNoaXBzICsgMSArIGlcbiAgICAgIH07XG5cbiAgICAgIGRhdGEucmVsYXRpb25zaGlwc1tkYXRhLnJlbGF0aW9uc2hpcHMubGVuZ3RoXSA9IHJlbGF0aW9uc2hpcDtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwdWJsaWMgc2l6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbm9kZXM6IHRoaXMubm9kZXMubGVuZ3RoLFxuICAgICAgcmVsYXRpb25zaGlwczogdGhpcy5yZWxhdGlvbnNoaXBzLmxlbmd0aFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgc3RpY2tOb2RlKGQpIHtcbiAgICBkLmZ4ID0gZDMuZXZlbnQueDtcbiAgICBkLmZ5ID0gZDMuZXZlbnQueTtcbiAgfVxuXG4gIHB1YmxpYyB0aWNrKCkge1xuICAgIHRoaXMudGlja05vZGVzKCk7XG4gICAgdGhpcy50aWNrUmVsYXRpb25zaGlwcygpO1xuICB9XG5cbiAgcHVibGljIHRpY2tOb2RlcygpIHtcbiAgICBpZiAodGhpcy5ub2RlKSB7XG4gICAgICB0aGlzLm5vZGUuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCkge1xuICAgICAgICBpZihkIT11bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywgJyArIGQueSArICcpJztcbiAgICAgICAgY29uc3QgbXNnID0gXCI9PT09PT09PT0+Pj4+Pj4+Pj4+Pj4+PiBFUlJPUiA+PiB0aWNrTm9kZXNcIjtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0aWNrUmVsYXRpb25zaGlwcygpIHtcbiAgICBpZiAodGhpcy5yZWxhdGlvbnNoaXApIHtcbiAgICAgIGNvbnN0IHRoaXNPYmogPSB0aGlzO1xuICAgICAgdGhpcy5yZWxhdGlvbnNoaXAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCkge1xuICAgICAgICBpZihkIT11bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgYW5nbGUgPSB0aGlzT2JqLnJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCk7XG4gICAgICAgICAgaWYoZC5zb3VyY2UhPXVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIGQuc291cmNlLnggKyAnLCAnICsgZC5zb3VyY2UueSArICcpIHJvdGF0ZSgnICsgYW5nbGUgKyAnKSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1zZyA9IFwiPT09PT09PT09Pj4+Pj4+Pj4+Pj4+Pj4gRVJST1IgPj4gdGlja1JlbGF0aW9uc2hpcHNcIjtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgICBcbiAgICAgIH0pO1xuICAgICAgdGhpcy50aWNrUmVsYXRpb25zaGlwc1RleHRzKCk7XG4gICAgICB0aGlzLnRpY2tSZWxhdGlvbnNoaXBzT3V0bGluZXMoKTtcbiAgICAgIHRoaXMudGlja1JlbGF0aW9uc2hpcHNPdmVybGF5cygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0aWNrUmVsYXRpb25zaGlwc091dGxpbmVzKCkge1xuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXAuZWFjaCggKHJlbGF0aW9uc2hpcCwgaW5kZXgsIGcpID0+IHtcbiAgICAgIHZhciBvYmogPSBnW2luZGV4XTtcbiAgICAgIHZhciByZWwgPSBkMy5zZWxlY3Qob2JqKTtcbiAgICAgIHZhciBvdXRsaW5lO1xuICAgICAgdHJ5IHtvdXRsaW5lID0gcmVsLnNlbGVjdCgnLm91dGxpbmUnKTt9XG4gICAgICBjYXRjaChlcnIpIHsgcmV0dXJuOyB9XG4gICAgICBcbiAgICAgIHZhciB0ZXh0ID0gcmVsLnNlbGVjdCgnLnRleHQnKTtcbiAgICAgIFxuICAgICAgdHJ5IHt2YXIgYmJveCA9IHRleHQubm9kZSgpLmdldEJCb3goKTt9XG4gICAgICBjYXRjaChlcnIpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHZhciBwYWRkaW5nID0gMztcblxuICAgICAgb3V0bGluZS5hdHRyKCdkJywgZnVuY3Rpb24oZCkge1xuICAgICAgICB0cnkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXNPYmoub3B0aW9ucztcbiAgICAgICAgdmFyIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxuICAgICAgICAgIGFuZ2xlID0gdGhpc09iai5yb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICAgIHRleHRCb3VuZGluZ0JveCA9IHRleHQubm9kZSgpLmdldEJCb3goKSxcbiAgICAgICAgICB0ZXh0UGFkZGluZyA9IDUsXG4gICAgICAgICAgdSA9IHRoaXNPYmoudW5pdGFyeVZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICAgIHRleHRNYXJnaW4gPSB7IHg6IChkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtICh0ZXh0Qm91bmRpbmdCb3gud2lkdGggKyB0ZXh0UGFkZGluZykgKiB1LngpICogMC41LCB5OiAoZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAodGV4dEJvdW5kaW5nQm94LndpZHRoICsgdGV4dFBhZGRpbmcpICogdS55KSAqIDAuNSB9LFxuICAgICAgICAgIG4gPSB0aGlzT2JqLnVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRBMSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgKyAodGhpc09iai5vcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIG4ueCwgeTogMCArICh0aGlzT2JqLm9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRCMSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IHRleHRNYXJnaW4ueCAtIG4ueCwgeTogdGV4dE1hcmdpbi55IC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRDMSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IHRleHRNYXJnaW4ueCwgeTogdGV4dE1hcmdpbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnREMSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgKyAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LngsIHk6IDAgKyAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEEyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSB0ZXh0TWFyZ2luLnggLSBuLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gdGV4dE1hcmdpbi55IC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRCMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gbi54IC0gdS54ICogb3B0aW9ucy5hcnJvd1NpemUsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IC0gbi55IC0gdS55ICogb3B0aW9ucy5hcnJvd1NpemUgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEMyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSBuLnggKyAobi54IC0gdS54KSAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIG4ueSArIChuLnkgLSB1LnkpICogb3B0aW9ucy5hcnJvd1NpemUgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEQyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRFMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54ICsgKC0gbi54IC0gdS54KSAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSArICgtIG4ueSAtIHUueSkgKiBvcHRpb25zLmFycm93U2l6ZSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RjIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIHUueCAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIHUueSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRHMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gdGV4dE1hcmdpbi54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIHRleHRNYXJnaW4ueSB9LCBhbmdsZSk7XG5cbiAgICAgICAgcmV0dXJuICdNICcgKyByb3RhdGVkUG9pbnRBMS54ICsgJyAnICsgcm90YXRlZFBvaW50QTEueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCMS54ICsgJyAnICsgcm90YXRlZFBvaW50QjEueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRDMS54ICsgJyAnICsgcm90YXRlZFBvaW50QzEueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnREMS54ICsgJyAnICsgcm90YXRlZFBvaW50RDEueSArXG4gICAgICAgICAgJyBaIE0gJyArIHJvdGF0ZWRQb2ludEEyLnggKyAnICcgKyByb3RhdGVkUG9pbnRBMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEIyLnggKyAnICcgKyByb3RhdGVkUG9pbnRCMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEMyLnggKyAnICcgKyByb3RhdGVkUG9pbnRDMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEQyLnggKyAnICcgKyByb3RhdGVkUG9pbnREMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEUyLnggKyAnICcgKyByb3RhdGVkUG9pbnRFMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEYyLnggKyAnICcgKyByb3RhdGVkUG9pbnRGMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEcyLnggKyAnICcgKyByb3RhdGVkUG9pbnRHMi55ICtcbiAgICAgICAgICAnIFonO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycikgeyByZXR1cm47IH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG91dGxpbmVGdW5jdGlvbihkLCB0ZXh0KSB7XG4gICAgICBcbiAgfVxuXG4gIHB1YmxpYyB0aWNrUmVsYXRpb25zaGlwc092ZXJsYXlzKCkge1xuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdmVybGF5LmF0dHIoJ2QnLCBmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXG4gICAgICAgIGFuZ2xlID0gdGhpc09iai5yb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICBuMSA9IHRoaXNPYmoudW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICBuID0gdGhpc09iai51bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCwgNTApLFxuICAgICAgICByb3RhdGVkUG9pbnRBID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogMCAtIG4ueCwgeTogMCAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgIHJvdGF0ZWRQb2ludEIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIG4ueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICByb3RhdGVkUG9pbnRDID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggKyBuLnggLSBuMS54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSArIG4ueSAtIG4xLnkgfSwgYW5nbGUpLFxuICAgICAgICByb3RhdGVkUG9pbnREID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogMCArIG4ueCAtIG4xLngsIHk6IDAgKyBuLnkgLSBuMS55IH0sIGFuZ2xlKTtcblxuICAgICAgcmV0dXJuICdNICcgKyByb3RhdGVkUG9pbnRBLnggKyAnICcgKyByb3RhdGVkUG9pbnRBLnkgK1xuICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEIueCArICcgJyArIHJvdGF0ZWRQb2ludEIueSArXG4gICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50Qy54ICsgJyAnICsgcm90YXRlZFBvaW50Qy55ICtcbiAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRELnggKyAnICcgKyByb3RhdGVkUG9pbnRELnkgK1xuICAgICAgICAnIFonO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHRpY2tSZWxhdGlvbnNoaXBzVGV4dHMoKSB7XG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICB0aGlzLnJlbGF0aW9uc2hpcFRleHQuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIGFuZ2xlID0gKHRoaXNPYmoucm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSArIDM2MCkgJSAzNjAsXG4gICAgICAgIG1pcnJvciA9IGFuZ2xlID4gOTAgJiYgYW5nbGUgPCAyNzAsXG4gICAgICAgIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxuICAgICAgICBuID0gdGhpc09iai51bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgIG5XZWlnaHQgPSBtaXJyb3IgPyAyIDogLTMsXG4gICAgICAgIHBvaW50ID0geyB4OiAoZC50YXJnZXQueCAtIGQuc291cmNlLngpICogMC41ICsgbi54ICogbldlaWdodCwgeTogKGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55KSAqIDAuNSArIG4ueSAqIG5XZWlnaHQgfSxcbiAgICAgICAgcm90YXRlZFBvaW50ID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHBvaW50LCBhbmdsZSk7XG5cbiAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyByb3RhdGVkUG9pbnQueCArICcsICcgKyByb3RhdGVkUG9pbnQueSArICcpIHJvdGF0ZSgnICsgKG1pcnJvciA/IDE4MCA6IDApICsgJyknO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHVuaXRhcnlOb3JtYWxWZWN0b3Ioc291cmNlLCB0YXJnZXQsIG5ld0xlbmd0aD0xKSB7XG4gICAgdmFyIGNlbnRlciA9IHsgeDogMCwgeTogMCB9O1xuICAgIHZhciB2ZWN0b3IgPSB0aGlzLnVuaXRhcnlWZWN0b3Ioc291cmNlLCB0YXJnZXQsIG5ld0xlbmd0aCk7XG4gICAgcmV0dXJuIHRoaXMucm90YXRlUG9pbnQoY2VudGVyLCB2ZWN0b3IsIDkwKTtcbiAgfVxuXG4gIHB1YmxpYyB1bml0YXJ5VmVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBuZXdMZW5ndGg9MSkge1xuICAgIHZhciBsZW5ndGggPSBNYXRoLnNxcnQoTWF0aC5wb3codGFyZ2V0LnggLSBzb3VyY2UueCwgMikgKyBNYXRoLnBvdyh0YXJnZXQueSAtIHNvdXJjZS55LCAyKSkgLyBNYXRoLnNxcnQobmV3TGVuZ3RoIHx8IDEpO1xuICAgIHJldHVybiB7XG4gICAgICB4OiAodGFyZ2V0LnggLSBzb3VyY2UueCkgLyBsZW5ndGgsXG4gICAgICB5OiAodGFyZ2V0LnkgLSBzb3VyY2UueSkgLyBsZW5ndGgsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIG9ic2VsZXRlIGFuZCBub3QgdXNlZCBhbnkgd2hlcmVcbiAgICogQG9ic2VsZXRlXG4gICAqIEBwYXJhbSBkM0RhdGFcbiAgICovXG4gIHB1YmxpYyB1cGRhdGVXaXRoRDNEYXRhKGQzRGF0YSkge1xuICAgIHRoaXMudXBkYXRlTm9kZXNBbmRSZWxhdGlvbnNoaXBzKGQzRGF0YS5ub2RlcywgZDNEYXRhLnJlbGF0aW9uc2hpcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBkYXRhIGZvciBOZW80aiBWaXN1YWxpemF0aW9uXG4gICAqIEBwYXJhbSBuZW80akRhdGEgXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlV2l0aE5lbzRqRGF0YShuZW80akRhdGEpIHtcbiAgICB2YXIgZDNEYXRhID0gdGhpcy5uZW80akRhdGFUb0QzRGF0YShuZW80akRhdGEpO1xuICAgIHRoaXMudXBkYXRlTm9kZXNBbmRSZWxhdGlvbnNoaXBzKGQzRGF0YS5ub2RlcywgZDNEYXRhLnJlbGF0aW9uc2hpcHMpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUluZm8oZCkge1xuICAgIHRoaXMuY2xlYXJJbmZvKCk7XG5cbiAgICBpZiAoZC5sYWJlbHMpIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnRDbGFzcygnY2xhc3MnLCBkLmxhYmVsc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnRSZWxhdGlvbnNoaXAoJ2NsYXNzJywgZC50eXBlKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50UHJvcGVydHkoJ3Byb3BlcnR5JywgJyZsdDtpZCZndDsnLCBkLmlkKTtcbiAgICBcbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKGQucHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgdGhpc09iai5hcHBlbmRJbmZvRWxlbWVudFByb3BlcnR5KCdwcm9wZXJ0eScsIHByb3BlcnR5LCBKU09OLnN0cmluZ2lmeShkLnByb3BlcnRpZXNbcHJvcGVydHldKSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlTm9kZXMobikge1xuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMubm9kZXMsIG4pO1xuXG4gICAgdGhpcy5ub2RlID0gdGhpcy5zdmdOb2Rlcy5zZWxlY3RBbGwoJy5ub2RlJykuZGF0YSh0aGlzLm5vZGVzLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkOyB9KTtcbiAgICB2YXIgbm9kZUVudGVyID0gdGhpcy5hcHBlbmROb2RlVG9HcmFwaCgpO1xuICAgIHRoaXMubm9kZSA9IG5vZGVFbnRlci5tZXJnZSh0aGlzLm5vZGUpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZU5vZGVzQW5kUmVsYXRpb25zaGlwcyhuLCByKSB7XG4gICAgdGhpcy51cGRhdGVSZWxhdGlvbnNoaXBzKHIpO1xuICAgIHRoaXMudXBkYXRlTm9kZXMobik7XG5cbiAgICB0aGlzLnNpbXVsYXRpb24ubm9kZXModGhpcy5ub2Rlcyk7XG4gICAgdGhpcy5zaW11bGF0aW9uLmZvcmNlKCdsaW5rJykubGlua3ModGhpcy5yZWxhdGlvbnNoaXBzKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVSZWxhdGlvbnNoaXBzKHIpIHtcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLnJlbGF0aW9uc2hpcHMsIHIpO1xuXG4gICAgdGhpcy5yZWxhdGlvbnNoaXAgPSB0aGlzLnN2Z1JlbGF0aW9uc2hpcHMuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwJykuZGF0YSh0aGlzLnJlbGF0aW9uc2hpcHMsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7IH0pO1xuICAgIHZhciByZWxhdGlvbnNoaXAgPSB0aGlzLmFwcGVuZFJlbGF0aW9uc2hpcCgpO1xuXG4gICAgdmFyIHJlbGF0aW9uc2hpcEVudGVyIDogUmVsYXRpb25zaGlwRW50ZXIgPSB0aGlzLmFwcGVuZFJlbGF0aW9uc2hpcFRvR3JhcGgocmVsYXRpb25zaGlwKTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcEVudGVyLnJlbGF0aW9uc2hpcC5tZXJnZSh0aGlzLnJlbGF0aW9uc2hpcCk7XG5cbiAgICB0aGlzLnJlbGF0aW9uc2hpcE91dGxpbmUgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAgLm91dGxpbmUnKTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcE91dGxpbmUgPSByZWxhdGlvbnNoaXBFbnRlci5vdXRsaW5lLm1lcmdlKHRoaXMucmVsYXRpb25zaGlwT3V0bGluZSk7XG5cbiAgICB0aGlzLnJlbGF0aW9uc2hpcE92ZXJsYXkgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAgLm92ZXJsYXknKTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcE92ZXJsYXkgPSByZWxhdGlvbnNoaXBFbnRlci5vdmVybGF5Lm1lcmdlKHRoaXMucmVsYXRpb25zaGlwT3ZlcmxheSk7XG5cbiAgICB0aGlzLnJlbGF0aW9uc2hpcFRleHQgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAgLnRleHQnKTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcFRleHQgPSByZWxhdGlvbnNoaXBFbnRlci50ZXh0Lm1lcmdlKHRoaXMucmVsYXRpb25zaGlwVGV4dCk7XG4gIH1cblxuXG5cblxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyAgICAgICAgICAgIE5lbzRqIFV0aWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuXG4gIHB1YmxpYyBnZXRPcHRpb25zUHJlc2VudGF0aW9uKCkgOiBOZ05lbzRqRDNPcHRpb25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgYXJyb3dTaXplOiA0LFxuICAgICAgY29sb3JzOiB1bmRlZmluZWQsXG4gICAgICBoaWdobGlnaHQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAnUHJvamVjdCcsXG4gICAgICAgICAgcHJvcGVydHk6ICduYW1lJyxcbiAgICAgICAgICB2YWx1ZTogJ25lbzRqZDMnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzczogJ1VzZXInLFxuICAgICAgICAgIHByb3BlcnR5OiAndXNlcklkJyxcbiAgICAgICAgICB2YWx1ZTogJ2Vpc21hbidcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGljb25zOiBOZ05lbzRqRDNJY29ucy5leGFtcGxlSWNvbnMoKSxcbiAgICAgIGltYWdlczogTmdOZW80akQzSWNvbnMuZXhhbXBsZUltYWdlcygpLFxuICAgICAgaWNvbk1hcDogdW5kZWZpbmVkLCAgICAvLyBUaGlzIHZhbHVlIGFzc2lnbmVkIGluIE5lbzRqUmFuZG9tXG4gICAgICBpbWFnZU1hcDogdW5kZWZpbmVkLFxuICAgICAgaW5mb1BhbmVsOiB0cnVlLFxuICAgICAgbWluQ29sbGlzaW9uOiA2MCxcbiAgICAgIG5lbzRqRGF0YTogTmVvNGpEM1JlY29yZHMsXG4gICAgICBub2RlT3V0bGluZUZpbGxDb2xvcjogdW5kZWZpbmVkLFxuICAgICAgbmVvNGpEYXRhVXJsOiB1bmRlZmluZWQsXG4gICAgICBub2RlUmFkaXVzOiAyNSxcbiAgICAgIHJlbGF0aW9uc2hpcENvbG9yOiAnI2E1YWJiNicsXG4gICAgICBvblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrOiBmdW5jdGlvbihyZWxhdGlvbnNoaXApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RvdWJsZSBjbGljayBvbiByZWxhdGlvbnNoaXA6ICcgKyBKU09OLnN0cmluZ2lmeShyZWxhdGlvbnNoaXApKTtcbiAgICAgIH0sXG4gICAgICB6b29tRml0OiB0cnVlLFxuICAgICAgc2hvd0ljb25zOiB0cnVlLFxuICAgICAgb25Ob2RlRG91YmxlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVNb3VzZUVudGVyOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVNb3VzZUxlYXZlOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVEcmFnRW5kOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVEcmFnU3RhcnQ6IHVuZGVmaW5lZCxcbiAgICAgIGdyYXBoQ29udGFpbmVySGVpZ2h0OiAnMTAwJSdcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZVBvaW50KGMsIHAsIGFuZ2xlKSB7XG4gICAgcmV0dXJuIHRoaXMucm90YXRlKGMueCwgYy55LCBwLngsIHAueSwgYW5nbGUpO1xuICB9XG5cbiAgcHVibGljIHJvdGF0aW9uKHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIodGFyZ2V0LnkgLSBzb3VyY2UueSwgdGFyZ2V0LnggLSBzb3VyY2UueCkgKiAxODAgLyBNYXRoLlBJO1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZShjeCwgY3ksIHgsIHksIGFuZ2xlKSB7XG4gICAgdmFyIHJhZGlhbnMgPSAoTWF0aC5QSSAvIDE4MCkgKiBhbmdsZSxcbiAgICAgICAgY29zID0gTWF0aC5jb3MocmFkaWFucyksXG4gICAgICAgIHNpbiA9IE1hdGguc2luKHJhZGlhbnMpLFxuICAgICAgICBueCA9IChjb3MgKiAoeCAtIGN4KSkgKyAoc2luICogKHkgLSBjeSkpICsgY3gsXG4gICAgICAgIG55ID0gKGNvcyAqICh5IC0gY3kpKSAtIChzaW4gKiAoeCAtIGN4KSkgKyBjeTtcblxuICAgIHJldHVybiB7IHg6IG54LCB5OiBueSB9O1xuICB9XG5cbiAgcHVibGljIGluaXRJY29uTWFwKG9wdGlvbnMpIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLmljb25NYXApLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgdmFyIGtleXMgPSBrZXkuc3BsaXQoJywnKTtcbiAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnMuaWNvbk1hcFtrZXldO1xuXG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIG9wdGlvbnMuaWNvbk1hcFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3B0aW9ucy5pY29uTWFwO1xuICB9XG5cbiAgcHVibGljIGluaXRJbWFnZU1hcChvcHRpb25zKSB7XG4gICAgLy8gdmFyIGtleSwga2V5cywgc2VsZWN0b3I7XG4gICAgdmFyIGtleSwga2V5cztcbiAgICBmb3IgKGtleSBpbiBvcHRpb25zLmltYWdlcykge1xuICAgICAgaWYgKG9wdGlvbnMuaW1hZ2VzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAga2V5cyA9IGtleS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAoIW9wdGlvbnMuaW1hZ2VNYXBba2V5c1swXV0pIHtcbiAgICAgICAgICBvcHRpb25zLmltYWdlTWFwW2tleXNbMF1dID0gW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXS5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kVGV4dFRvUmVsYXRpb25zaGlwKHIpIHtcbiAgICB2YXIgclRleHQgPSByLmFwcGVuZCgndGV4dCcpO1xuICAgIHJldHVybiByVGV4dC5hdHRyKCdjbGFzcycsICd0ZXh0JykuYXR0cignZmlsbCcsICcjMDAwMDAwJykuYXR0cignZm9udC1zaXplJywgJzhweCcpLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkLnR5cGU7IH0pO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFJlbGF0aW9uc2hpcFRvR3JhcGgocmVsYXRpb25zaGlwKSA6IFJlbGF0aW9uc2hpcEVudGVyIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMuYXBwZW5kVGV4dFRvUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCk7XG4gICAgdmFyIG91dGxpbmUgPSByZWxhdGlvbnNoaXAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnb3V0bGluZScpLmF0dHIoJ2ZpbGwnLCAnI2E1YWJiNicpLmF0dHIoJ3N0cm9rZScsICdub25lJyk7XG4gICAgdmFyIG92ZXJsYXkgPSByZWxhdGlvbnNoaXAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnb3ZlcmxheScpO1xuXG4gICAgLy8gdGhpcy5yZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXA7XG4gICAgcmV0dXJuIHtcbiAgICAgIG91dGxpbmU6IG91dGxpbmUsXG4gICAgICBvdmVybGF5OiBvdmVybGF5LFxuICAgICAgcmVsYXRpb25zaGlwOiByZWxhdGlvbnNoaXAsXG4gICAgICB0ZXh0OiB0ZXh0XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZVByb3BlcnR5KHRhcmdldCwgc291cmNlKSB7XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICBjb25zdCBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICBpZihzb3VyY2VQcm9wZXJ0eSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYoIShzb3VyY2VQcm9wZXJ0eSBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgZWxzZSBpZihzb3VyY2VQcm9wZXJ0eS5sZW5ndGg+MClcbiAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB2ZXJzaW9uKCkge1xuICAgIHJldHVybiBcIjAuMS42XCI7XG4gIH1cblxuXG5cblxuICAvLyBNZXJnZXMgQWxsIFJlbGF0aW9uc2hpcHMgd2l0aCB0aGUgc2FtZSBub2Rlc1xuICBwcml2YXRlIG1lcmdlUmVsYXRpb25zaGlwV2l0aFNhbWVOb2RlcygpIHtcbiAgICBsZXQgciA9IHRoaXMub3B0aW9ucy5uZW80akRhdGEucmVzdWx0c1swXS5kYXRhWzBdLmdyYXBoLnJlbGF0aW9uc2hpcHM7XG4gICAgLy8gQ2hlY2sgdGhlIHJlbGF0aW9uc2hpcCBjb3VudHMgYmV0d2VlbiAyIG5vZGVzXG4gICAgdmFyIGRyYXduUmVsYXRpb25zaGlwID0ge307XG5cbiAgICBmb3IgKGxldCBySW5kZXg9MDsgckluZGV4PHIubGVuZ3RoOyBySW5kZXgrKykge1xuICAgICAgbGV0IHJlbCA9IHJbckluZGV4XTtcbiAgICAgIGNvbnN0IHN0YXJ0Tm9kZSA9IHJlbFsnc3RhcnROb2RlJ107XG4gICAgICBjb25zdCBlbmROb2RlID0gcmVsWydlbmROb2RlJ107XG4gICAgICBjb25zdCByZWxhdGlvbnNoaXBLZXkgPSBzdGFydE5vZGUgKyAnLScgKyBlbmROb2RlO1xuICAgICAgbGV0IHJlbGF0aW9uc2hpcFZhbHVlID0gZHJhd25SZWxhdGlvbnNoaXBbcmVsYXRpb25zaGlwS2V5XTtcbiAgICAgIHJlbFsnaWQnXSA9IHJlbFsnaWQnXS50b1N0cmluZygpO1xuICAgICAgaWYgKHJlbGF0aW9uc2hpcFZhbHVlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoIHJlbGF0aW9uc2hpcEtleSA9PSAnMTE2MS0xMTQ4JyApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZWwpKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVsYXRpb25zaGlwTW9kaWZpZWQgPSB7fTtcbiAgICAgICAgY29uc3Qgb2JqID0gcmVsYXRpb25zaGlwVmFsdWU7XG4gICAgICAgIC8vIFxuICAgICAgICBjb25zdCBrZXlzID0gdGhpcy5tZXJnZUtleXMob2JqLCByZWwpO1xuICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBjb25zdCBuZXdWYWwgPSB0aGlzLmFzc2lnbkF0dHJpYnV0ZXMoa2V5LCBvYmosIHJlbCk7XG4gICAgICAgICAgaWYgKG5ld1ZhbCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmVsYXRpb25zaGlwTW9kaWZpZWRba2V5XSA9IHRoaXMuYXNzaWduQXR0cmlidXRlcyhrZXksIG9iaiwgcmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkcmF3blJlbGF0aW9uc2hpcFtyZWxhdGlvbnNoaXBLZXldID0gcmVsYXRpb25zaGlwTW9kaWZpZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcmF3blJlbGF0aW9uc2hpcFtyZWxhdGlvbnNoaXBLZXldID0gcmVsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG5ld1JlbCA9IE9iamVjdC52YWx1ZXMoZHJhd25SZWxhdGlvbnNoaXApO1xuICAgIHRoaXMub3B0aW9ucy5uZW80akRhdGEucmVzdWx0c1swXS5kYXRhWzBdLmdyYXBoLnJlbGF0aW9uc2hpcHMgPSBuZXdSZWw7XG5cbiAgfVxuXG4gIHByaXZhdGUgbWVyZ2VLZXlzKG9iajEsIG9iajIpIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iajEpO1xuICAgIGtleXMgPSBrZXlzLmNvbmNhdChPYmplY3Qua2V5cyhvYmoyKSk7XG4gICAgcmV0dXJuIFsuLi5uZXcgU2V0KGtleXMpXTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzaWduQXR0cmlidXRlcyhrZXksIHJlbGF0aW9uc2hpcDEsIHJlbGF0aW9uc2hpcDIpIHtcbiAgICBpZiAoa2V5ID09PSAncHJvcGVydGllcycpIHtcbiAgICAgICAgY29uc3QgcHJvcDEgPSByZWxhdGlvbnNoaXAxLnByb3BlcnRpZXM7XG4gICAgICAgIGNvbnN0IHByb3AyID0gcmVsYXRpb25zaGlwMi5wcm9wZXJ0aWVzO1xuICAgICAgICBpZiAocHJvcDEgPT0gdW5kZWZpbmVkICYmIHByb3AyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9wMSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcDI7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvcDIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3AxO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLm1lcmdlS2V5cyhwcm9wMSwgcHJvcDIpO1xuICAgICAgICBsZXQgcHJvcCA9IHt9O1xuICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBwcm9wW2tleV0gPSB0aGlzLmFzc2lnbkF0dHJpYnV0ZXNWYWx1ZShrZXksIHByb3AxLCBwcm9wMik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvcDtcbiAgICB9IGVsc2UgaWYgKGtleSA9PSAndGFyZ2V0JyB8fCBrZXkgPT0gJ2xpbmtudW0nIHx8IGtleSA9PSAnc3RhcnROb2RlJyB8fCBrZXkgPT0gJ2VuZE5vZGUnKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwMVtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hc3NpZ25BdHRyaWJ1dGVzVmFsdWUoa2V5LCByZWxhdGlvbnNoaXAxLCByZWxhdGlvbnNoaXAyKTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzaWduQXR0cmlidXRlc1ZhbHVlKGtleSwgcmVsYXRpb25zaGlwMSwgcmVsYXRpb25zaGlwMikge1xuICAgIGxldCB2YWwxID0gcmVsYXRpb25zaGlwMVtrZXldO1xuICAgIGxldCB2YWwyID0gcmVsYXRpb25zaGlwMltrZXldO1xuICAgIGlmICh2YWwxICE9IHVuZGVmaW5lZCB8fCB2YWwyICE9IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHZhbDEgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDI7XG4gICAgICB9IGVsc2UgaWYgKHZhbDIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodmFsMSBpbnN0YW5jZW9mIEFycmF5IHx8IHZhbDIgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIGlmICghKHZhbDEgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgICAgdmFsMi5wdXNoKHZhbDEpO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKCEodmFsMiBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgICB2YWwxLnB1c2godmFsMik7XG4gICAgICAgICAgICAgIHJldHVybiB2YWwxO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsMS5jb25jYXQodmFsMik7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsMSBpbnN0YW5jZW9mIE9iamVjdCB8fCB2YWwyIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgaWYgKCEodmFsMSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgICAgIHZhbDIuY3VzdG9tX2tleV9hc3NpZ25lZCA9IHZhbDE7XG4gICAgICAgICAgICByZXR1cm4gdmFsMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKCEodmFsMiBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgICAgIHZhbDEuY3VzdG9tX2tleV9hc3NpZ25lZCA9IHZhbDI7XG4gICAgICAgICAgICByZXR1cm4gdmFsMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qga2V5cyA9IHRoaXMubWVyZ2VLZXlzKHZhbDEsIHZhbDIpO1xuICAgICAgICAgIGxldCBvYmogPSB7fTtcbiAgICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIG9ialtrZXldID0gdGhpcy5hc3NpZ25BdHRyaWJ1dGVzVmFsdWUoa2V5LCB2YWwxLCB2YWwyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWwxICsgJywgJyArIHZhbDI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxufVxuXG4iXX0=