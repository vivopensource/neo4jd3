/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { NgNeo4jD3Icons } from './ng-neo4jd3.icons';
import { Neo4jD3Records } from "./ng-neo4jd3.records";
import * as i0 from "@angular/core";
var NgNeo4jd3Service = /** @class */ (function () {
    function NgNeo4jd3Service() {
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
            graphContainerHeight: '300px'
        };
    }
    /**
     * @param {?} _selector
     * @param {?} _options
     * @return {?}
     */
    NgNeo4jd3Service.prototype.setValues = /**
     * @param {?} _selector
     * @param {?} _options
     * @return {?}
     */
    function (_selector, _options) {
        new NgNeo4jD3Icons(this.options);
        this.containerIdentity = _selector;
        this.optionsInput = _options;
        this.valueSet = true;
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.isValueSet = /**
     * @return {?}
     */
    function () {
        return this.valueSet;
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.getOptionsInput = /**
     * @return {?}
     */
    function () {
        return this.optionsInput;
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.getContainer = /**
     * @return {?}
     */
    function () {
        return this.container;
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.init = /**
     * @return {?}
     */
    function () {
        this.container = d3.select(this.containerIdentity);
        this.initIconMap(this.options);
        this.mergeProperty(this.options, this.optionsInput);
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
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.initSimulation = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var thisObj = this;
        /** @type {?} */
        var parentElement = this.svg.node().parentElement;
        if (parentElement == undefined || parentElement.parentElement == undefined) {
            return;
        }
        /** @type {?} */
        var clientWidth = this.svg.node().parentElement.parentElement.clientWidth / 2;
        /** @type {?} */
        var clientHeight = this.svg.node().parentElement.parentElement.clientHeight / 2;
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
    };
    /**
     * @param {?} container
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendGraph = /**
     * @param {?} container
     * @return {?}
     */
    function (container) {
        /** @type {?} */
        var thisObj = this;
        /** @type {?} */
        var svg = container.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
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
    };
    /**
     * @param {?} container
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendInfoPanel = /**
     * @param {?} container
     * @return {?}
     */
    function (container) {
        return container.append('div')
            .attr('class', 'neo4jd3-info');
    };
    /**
     * @param {?} cls
     * @param {?} isNode
     * @param {?} property
     * @param {?=} value
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendInfoElement = /**
     * @param {?} cls
     * @param {?} isNode
     * @param {?} property
     * @param {?=} value
     * @return {?}
     */
    function (cls, isNode, property, value) {
        if (value === void 0) { value = null; }
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
    };
    /**
     * @param {?} cls
     * @param {?} node
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendInfoElementClass = /**
     * @param {?} cls
     * @param {?} node
     * @return {?}
     */
    function (cls, node) {
        this.appendInfoElement(cls, true, node);
    };
    /**
     * @param {?} cls
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendInfoElementProperty = /**
     * @param {?} cls
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    function (cls, property, value) {
        this.appendInfoElement(cls, false, property, value);
    };
    /**
     * @param {?} cls
     * @param {?} relationship
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendInfoElementRelationship = /**
     * @param {?} cls
     * @param {?} relationship
     * @return {?}
     */
    function (cls, relationship) {
        this.appendInfoElement(cls, false, relationship);
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendNode = /**
     * @return {?}
     */
    function () {
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
                    var highlight = thisObj.options.highlight[i];
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
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendNodeToGraph = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendOutlineToNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
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
    };
    /**
     * @param {?} cls
     * @return {?}
     */
    NgNeo4jd3Service.prototype.class2color = /**
     * @param {?} cls
     * @return {?}
     */
    function (cls) {
        /** @type {?} */
        var color = this.classes2colors[cls];
        if (!color) {
            // color = this.options.colors[Math.min(numClasses, this.options.colors.length - 1)];
            color = this.options.colors[this.numClasses % this.options.colors.length];
            this.classes2colors[cls] = color;
            this.numClasses++;
        }
        return color;
    };
    /**
     * @param {?} cls
     * @return {?}
     */
    NgNeo4jd3Service.prototype.class2darkenColor = /**
     * @param {?} cls
     * @return {?}
     */
    function (cls) {
        /** @type {?} */
        var colorValue = this.class2color(cls);
        try {
            // COLOR Object is not working properly when the optimization is set true
            /** @type {?} */
            var colorObject = d3.rgb(colorValue);
            return colorObject.darker(1);
        }
        catch (err) { }
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendRingToNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
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
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendImageToNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
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
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendTextToNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
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
            var rgb = 'fill: rgb(225, 225, 225); stroke: rgb(000, 000, 000);';
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
    };
    /**
     * @param {?} d
     * @param {?} maxNodesToGenerate
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendRandomDataToNode = /**
     * @param {?} d
     * @param {?} maxNodesToGenerate
     * @return {?}
     */
    function (d, maxNodesToGenerate) {
        /** @type {?} */
        var data = this.randomD3Data(d, maxNodesToGenerate);
        this.updateWithNeo4jData(data);
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendRelationship = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var thisObj = this;
        // Function > Double Click 
        /** @type {?} */
        var fnDoubleClick = (/**
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
        var fnMouseEnter = (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (thisObj.info) {
                thisObj.updateInfo(d);
            }
        });
        return this.relationship.enter().append('g').attr('class', 'relationship').on('dblclick', fnDoubleClick).on('mouseenter', fnMouseEnter);
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.clearInfo = /**
     * @return {?}
     */
    function () {
        this.info.html('');
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.color = /**
     * @return {?}
     */
    function () {
        return this.options.colors[this.options.colors.length * Math.random() << 0];
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.colors = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} array
     * @param {?} id
     * @return {?}
     */
    NgNeo4jd3Service.prototype.containsResult = /**
     * @param {?} array
     * @param {?} id
     * @return {?}
     */
    function (array, id) {
        /** @type {?} */
        var filter = array.filter((/**
         * @param {?} elem
         * @return {?}
         */
        function (elem) {
            return elem.id === id;
        }));
        return filter.length > 0;
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.defaultColor = /**
     * @return {?}
     */
    function () {
        return this.options.relationshipColor;
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.defaultDarkenColor = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var colorValue = this.options.colors[this.options.colors.length - 1];
        try {
            // COLOR Object is not working properly when the optimization is set true
            /** @type {?} */
            var colorObject = d3.rgb(colorValue);
            return colorObject.darker(1);
        }
        catch (err) { }
    };
    /**
     * @param {?} d
     * @return {?}
     */
    NgNeo4jd3Service.prototype.dragEnded = /**
     * @param {?} d
     * @return {?}
     */
    function (d) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0);
        }
        if (this.options.onNodeDragEnd != undefined) {
            this.options.onNodeDragEnd(d);
        }
    };
    /**
     * @param {?} d
     * @return {?}
     */
    NgNeo4jd3Service.prototype.dragged = /**
     * @param {?} d
     * @return {?}
     */
    function (d) {
        this.stickNode(d);
    };
    /**
     * @param {?} d
     * @return {?}
     */
    NgNeo4jd3Service.prototype.dragStarted = /**
     * @param {?} d
     * @return {?}
     */
    function (d) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
        if (this.options.onNodeDragStart != undefined) {
            this.options.onNodeDragStart(d);
        }
    };
    /**
     * @param {?} obj1
     * @param {?} obj2
     * @return {?}
     */
    NgNeo4jd3Service.prototype.extend = /**
     * @param {?} obj1
     * @param {?} obj2
     * @return {?}
     */
    function (obj1, obj2) {
        /** @type {?} */
        var obj = {};
        this.mergeProperty(obj, obj1);
        this.mergeProperty(obj, obj2);
        return obj;
    };
    /**
     * @param {?} d
     * @return {?}
     */
    NgNeo4jd3Service.prototype.icon = /**
     * @param {?} d
     * @return {?}
     */
    function (d) {
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
    };
    /**
     * @param {?} d
     * @return {?}
     */
    NgNeo4jd3Service.prototype.image = /**
     * @param {?} d
     * @return {?}
     */
    function (d) {
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
            var imgRef = d.img == undefined ? d.labels[0] : d.img;
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
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.loadNeo4jData = /**
     * @return {?}
     */
    function () {
        this.nodes = [];
        this.relationships = [];
        this.updateWithNeo4jData(this.options.neo4jData);
    };
    /**
     * @param {?} neo4jDataUrl
     * @return {?}
     */
    NgNeo4jd3Service.prototype.loadNeo4jDataFromUrl = /**
     * @param {?} neo4jDataUrl
     * @return {?}
     */
    function (neo4jDataUrl) {
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
    };
    /**
     * @param {?} data
     * @return {?}
     */
    NgNeo4jd3Service.prototype.neo4jDataToD3Data = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
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
    };
    /**
     * @param {?} d
     * @return {?}
     */
    NgNeo4jd3Service.prototype.toString = /**
     * @param {?} d
     * @return {?}
     */
    function (d) {
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
    };
    /**
     * @param {?} d
     * @param {?} maxNodesToGenerate
     * @return {?}
     */
    NgNeo4jd3Service.prototype.randomD3Data = /**
     * @param {?} d
     * @param {?} maxNodesToGenerate
     * @return {?}
     */
    function (d, maxNodesToGenerate) {
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
            var label = "Hello";
            // icons[icons.length * Math.random() << 0];
            /** @type {?} */
            var node = {
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
            var relationship = {
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
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.size = /**
     * @return {?}
     */
    function () {
        return {
            nodes: this.nodes.length,
            relationships: this.relationships.length
        };
    };
    /**
     * @param {?} d
     * @return {?}
     */
    NgNeo4jd3Service.prototype.stickNode = /**
     * @param {?} d
     * @return {?}
     */
    function (d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.tick = /**
     * @return {?}
     */
    function () {
        this.tickNodes();
        this.tickRelationships();
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.tickNodes = /**
     * @return {?}
     */
    function () {
        if (this.node) {
            this.node.attr('transform', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                if (d != undefined)
                    return 'translate(' + d.x + ', ' + d.y + ')';
                /** @type {?} */
                var msg = "=========>>>>>>>>>>>>>> ERROR >> tickNodes";
                console.error(msg);
                throw new Error(msg);
            }));
        }
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.tickRelationships = /**
     * @return {?}
     */
    function () {
        if (this.relationship) {
            /** @type {?} */
            var thisObj_1 = this;
            this.relationship.attr('transform', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                if (d != undefined) {
                    /** @type {?} */
                    var angle = thisObj_1.rotation(d.source, d.target);
                    if (d.source != undefined) {
                        return 'translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')';
                    }
                }
                /** @type {?} */
                var msg = "=========>>>>>>>>>>>>>> ERROR >> tickRelationships";
                console.error(msg);
                throw new Error(msg);
            }));
            this.tickRelationshipsTexts();
            this.tickRelationshipsOutlines();
            this.tickRelationshipsOverlays();
        }
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.tickRelationshipsOutlines = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var thisObj = this;
        this.relationship.each((/**
         * @param {?} relationship
         * @param {?} index
         * @param {?} g
         * @return {?}
         */
        function (relationship, index, g) {
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
    };
    /**
     * @param {?} d
     * @param {?} text
     * @return {?}
     */
    NgNeo4jd3Service.prototype.outlineFunction = /**
     * @param {?} d
     * @param {?} text
     * @return {?}
     */
    function (d, text) {
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.tickRelationshipsOverlays = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.tickRelationshipsTexts = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} source
     * @param {?} target
     * @param {?=} newLength
     * @return {?}
     */
    NgNeo4jd3Service.prototype.unitaryNormalVector = /**
     * @param {?} source
     * @param {?} target
     * @param {?=} newLength
     * @return {?}
     */
    function (source, target, newLength) {
        if (newLength === void 0) { newLength = 1; }
        /** @type {?} */
        var center = { x: 0, y: 0 };
        /** @type {?} */
        var vector = this.unitaryVector(source, target, newLength);
        return this.rotatePoint(center, vector, 90);
    };
    /**
     * @param {?} source
     * @param {?} target
     * @param {?=} newLength
     * @return {?}
     */
    NgNeo4jd3Service.prototype.unitaryVector = /**
     * @param {?} source
     * @param {?} target
     * @param {?=} newLength
     * @return {?}
     */
    function (source, target, newLength) {
        if (newLength === void 0) { newLength = 1; }
        /** @type {?} */
        var length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)) / Math.sqrt(newLength || 1);
        return {
            x: (target.x - source.x) / length,
            y: (target.y - source.y) / length,
        };
    };
    /**
     * This function is obselete and not used any where
     * @obselete
     * @param d3Data
     */
    /**
     * This function is obselete and not used any where
     * \@obselete
     * @param {?} d3Data
     * @return {?}
     */
    NgNeo4jd3Service.prototype.updateWithD3Data = /**
     * This function is obselete and not used any where
     * \@obselete
     * @param {?} d3Data
     * @return {?}
     */
    function (d3Data) {
        this.updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
    };
    /**
     * Update data for Neo4j Visualization
     * @param neo4jData
     */
    /**
     * Update data for Neo4j Visualization
     * @param {?} neo4jData
     * @return {?}
     */
    NgNeo4jd3Service.prototype.updateWithNeo4jData = /**
     * Update data for Neo4j Visualization
     * @param {?} neo4jData
     * @return {?}
     */
    function (neo4jData) {
        /** @type {?} */
        var d3Data = this.neo4jDataToD3Data(neo4jData);
        this.updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
    };
    /**
     * @param {?} d
     * @return {?}
     */
    NgNeo4jd3Service.prototype.updateInfo = /**
     * @param {?} d
     * @return {?}
     */
    function (d) {
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
    };
    /**
     * @param {?} n
     * @return {?}
     */
    NgNeo4jd3Service.prototype.updateNodes = /**
     * @param {?} n
     * @return {?}
     */
    function (n) {
        Array.prototype.push.apply(this.nodes, n);
        this.node = this.svgNodes.selectAll('.node').data(this.nodes, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.id; }));
        /** @type {?} */
        var nodeEnter = this.appendNodeToGraph();
        this.node = nodeEnter.merge(this.node);
    };
    /**
     * @param {?} n
     * @param {?} r
     * @return {?}
     */
    NgNeo4jd3Service.prototype.updateNodesAndRelationships = /**
     * @param {?} n
     * @param {?} r
     * @return {?}
     */
    function (n, r) {
        this.updateRelationships(r);
        this.updateNodes(n);
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.relationships);
    };
    /**
     * @param {?} r
     * @return {?}
     */
    NgNeo4jd3Service.prototype.updateRelationships = /**
     * @param {?} r
     * @return {?}
     */
    function (r) {
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
    };
    // ---------------------------------
    //            Neo4j Util
    // ---------------------------------
    // ---------------------------------
    //            Neo4j Util
    // ---------------------------------
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.getOptionsPresentation = 
    // ---------------------------------
    //            Neo4j Util
    // ---------------------------------
    /**
     * @return {?}
     */
    function () {
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
            graphContainerHeight: '300px'
        };
    };
    /**
     * @param {?} c
     * @param {?} p
     * @param {?} angle
     * @return {?}
     */
    NgNeo4jd3Service.prototype.rotatePoint = /**
     * @param {?} c
     * @param {?} p
     * @param {?} angle
     * @return {?}
     */
    function (c, p, angle) {
        return this.rotate(c.x, c.y, p.x, p.y, angle);
    };
    /**
     * @param {?} source
     * @param {?} target
     * @return {?}
     */
    NgNeo4jd3Service.prototype.rotation = /**
     * @param {?} source
     * @param {?} target
     * @return {?}
     */
    function (source, target) {
        return Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
    };
    /**
     * @param {?} cx
     * @param {?} cy
     * @param {?} x
     * @param {?} y
     * @param {?} angle
     * @return {?}
     */
    NgNeo4jd3Service.prototype.rotate = /**
     * @param {?} cx
     * @param {?} cy
     * @param {?} x
     * @param {?} y
     * @param {?} angle
     * @return {?}
     */
    function (cx, cy, x, y, angle) {
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
    };
    /**
     * @param {?} options
     * @return {?}
     */
    NgNeo4jd3Service.prototype.initIconMap = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
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
    };
    /**
     * @param {?} options
     * @return {?}
     */
    NgNeo4jd3Service.prototype.initImageMap = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
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
    };
    /**
     * @param {?} r
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendTextToRelationship = /**
     * @param {?} r
     * @return {?}
     */
    function (r) {
        /** @type {?} */
        var rText = r.append('text');
        return rText.attr('class', 'text').attr('fill', '#000000').attr('font-size', '8px').attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.type; }));
    };
    /**
     * @param {?} relationship
     * @return {?}
     */
    NgNeo4jd3Service.prototype.appendRelationshipToGraph = /**
     * @param {?} relationship
     * @return {?}
     */
    function (relationship) {
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
    };
    /**
     * @param {?} target
     * @param {?} source
     * @return {?}
     */
    NgNeo4jd3Service.prototype.mergeProperty = /**
     * @param {?} target
     * @param {?} source
     * @return {?}
     */
    function (target, source) {
        Object.keys(source).forEach((/**
         * @param {?} property
         * @return {?}
         */
        function (property) {
            /** @type {?} */
            var sourceProperty = source[property];
            if (sourceProperty != undefined) {
                if (!(sourceProperty instanceof Array))
                    target[property] = source[property];
                else if (sourceProperty.length > 0)
                    target[property] = source[property];
            }
        }));
    };
    /**
     * @return {?}
     */
    NgNeo4jd3Service.prototype.version = /**
     * @return {?}
     */
    function () {
        return "1.0.0";
    };
    NgNeo4jd3Service.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    NgNeo4jd3Service.ctorParameters = function () { return []; };
    /** @nocollapse */ NgNeo4jd3Service.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NgNeo4jd3Service_Factory() { return new NgNeo4jd3Service(); }, token: NgNeo4jd3Service, providedIn: "root" });
    return NgNeo4jd3Service;
}());
export { NgNeo4jd3Service };
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
    NgNeo4jd3Service.prototype.label;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbmVvNGpkMy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbmVvNGpkMy8iLCJzb3VyY2VzIjpbImxpYi9uZy1uZW80amQzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7QUFFdEQ7SUFnRUU7UUEzRE8saUJBQVksR0FBYSxLQUFLLENBQUM7UUFDOUIsYUFBUSxHQUFhLEtBQUssQ0FBQztRQXFCM0IsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQU1yQixZQUFPLEdBQXNCO1lBQ2pDLFNBQVMsRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDckIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsS0FBSyxFQUFFLFNBQVM7WUFDaEIsT0FBTyxFQUFFLEVBQUU7O1lBQ1gsUUFBUSxFQUFFLEVBQUU7WUFDWixNQUFNLEVBQUUsU0FBUztZQUNqQixTQUFTLEVBQUUsSUFBSTtZQUNmLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLG9CQUFvQixFQUFFLFNBQVM7WUFDL0IsVUFBVSxFQUFFLEVBQUU7WUFDZCxpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsU0FBUyxFQUFFLElBQUk7WUFDZixpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLGdCQUFnQixF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QyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDakssY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDckcsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUN6RixjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUNySSxjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUN6SixjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDalAsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMs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LEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7Z0JBQ3BELENBQUMsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQzs7Z0JBQ3ZELGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O2dCQUM5RSxhQUFhLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7Z0JBQzFILGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7Z0JBQ3hJLGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENB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Ozs7OztJQUNqQiw0Q0FBeUI7Ozs7O0lBQ3pCLHdDQUFxQjs7Ozs7SUFFckIsMENBQTRCOzs7OztJQUM1QixzQ0FBMkI7Ozs7O0lBQzNCLHNDQUF1Qjs7Ozs7SUFDdkIsb0NBQTZCOzs7OztJQUU3QixpQ0FBYzs7Ozs7SUFFZCx3Q0FBOEI7Ozs7O0lBRTlCLG1DQXlCRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcbmltcG9ydCB7IE5nTmVvNGpEM09wdGlvbnMsIFJlbGF0aW9uc2hpcEVudGVyIH0gZnJvbSAnLi9uZy1uZW80amQzLm1vZGVsJztcbmltcG9ydCB7IE5nTmVvNGpEM0ljb25zIH0gZnJvbSAnLi9uZy1uZW80amQzLmljb25zJztcbmltcG9ydCB7IE5lbzRqRDNSZWNvcmRzIH0gZnJvbSBcIi4vbmctbmVvNGpkMy5yZWNvcmRzXCI7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5nTmVvNGpkM1NlcnZpY2Uge1xuXG4gIHB1YmxpYyBvdXRPZkNvbnRleHQgOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgdmFsdWVTZXQgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBjb250YWluZXI7XG4gIHByaXZhdGUgY29udGFpbmVySWRlbnRpdHk7XG4gIHByaXZhdGUgaW5mbztcbiAgcHJpdmF0ZSBub2RlO1xuICBwcml2YXRlIG5vZGVzO1xuXG4gIHByaXZhdGUgcmVsYXRpb25zaGlwO1xuICBwcml2YXRlIHJlbGF0aW9uc2hpcHMgOiBBcnJheTxhbnk+O1xuICBwcml2YXRlIHJlbGF0aW9uc2hpcE91dGxpbmU7XG4gIHByaXZhdGUgcmVsYXRpb25zaGlwT3ZlcmxheTtcbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXBUZXh0O1xuXG4gIHByaXZhdGUgc2ltdWxhdGlvbjtcblxuICBwdWJsaWMgc3ZnO1xuICBwcml2YXRlIHN2Z05vZGVzO1xuICBwcml2YXRlIHN2Z1JlbGF0aW9uc2hpcHM7XG4gIHByaXZhdGUgc3ZnVHJhbnNsYXRlO1xuICBcbiAgcHJpdmF0ZSBjbGFzc2VzMmNvbG9ycyA9IHt9O1xuICBwcml2YXRlIGp1c3RMb2FkZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBudW1DbGFzc2VzID0gMDtcbiAgcHJpdmF0ZSBzdmdTY2FsZSA9IHVuZGVmaW5lZDtcblxuICBwcml2YXRlIGxhYmVsO1xuXG4gIHByaXZhdGUgb3B0aW9uc0lucHV0IDogT2JqZWN0O1xuXG4gIHByaXZhdGUgb3B0aW9ucyA6IE5nTmVvNGpEM09wdGlvbnMgPSB7XG4gICAgICBhcnJvd1NpemU6IDQsXG4gICAgICBjb2xvcnM6IHRoaXMuY29sb3JzKCksXG4gICAgICBoaWdobGlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgIGljb25zOiB1bmRlZmluZWQsXG4gICAgICBpY29uTWFwOiBbXSwgICAgLy8gVGhpcyB2YWx1ZSBhc3NpZ25lZCBpbiBOZW80alJhbmRvbVxuICAgICAgaW1hZ2VNYXA6IHt9LFxuICAgICAgaW1hZ2VzOiB1bmRlZmluZWQsXG4gICAgICBpbmZvUGFuZWw6IHRydWUsXG4gICAgICBtaW5Db2xsaXNpb246IHVuZGVmaW5lZCxcbiAgICAgIG5lbzRqRGF0YTogdW5kZWZpbmVkLFxuICAgICAgbmVvNGpEYXRhVXJsOiB1bmRlZmluZWQsXG4gICAgICBub2RlT3V0bGluZUZpbGxDb2xvcjogdW5kZWZpbmVkLFxuICAgICAgbm9kZVJhZGl1czogMjUsXG4gICAgICByZWxhdGlvbnNoaXBDb2xvcjogJyNhNWFiYjYnLFxuICAgICAgem9vbUZpdDogZmFsc2UsXG4gICAgICBzaG93SWNvbnM6IHRydWUsXG4gICAgICBvbk5vZGVEb3VibGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZU1vdXNlRW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZU1vdXNlTGVhdmU6IHVuZGVmaW5lZCxcbiAgICAgIG9uUmVsYXRpb25zaGlwRG91YmxlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZURyYWdFbmQ6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZURyYWdTdGFydDogdW5kZWZpbmVkLFxuICAgICAgZ3JhcGhDb250YWluZXJIZWlnaHQ6ICczMDBweCdcbiAgfTtcblxuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBwdWJsaWMgc2V0VmFsdWVzIChfc2VsZWN0b3IsIF9vcHRpb25zOmFueSkgOiB2b2lkIHtcbiAgICAgIG5ldyBOZ05lbzRqRDNJY29ucyh0aGlzLm9wdGlvbnMpO1xuICAgICAgdGhpcy5jb250YWluZXJJZGVudGl0eSA9IF9zZWxlY3RvcjtcbiAgICAgIHRoaXMub3B0aW9uc0lucHV0ID0gX29wdGlvbnM7XG4gICAgICB0aGlzLnZhbHVlU2V0ID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBpc1ZhbHVlU2V0KCkgOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlU2V0O1xuICB9XG5cbiAgcHVibGljIGdldE9wdGlvbnNJbnB1dCgpIDogT2JqZWN0IHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNJbnB1dDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDb250YWluZXIoKSA6IE9iamVjdCB7XG4gICAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XG4gIH1cblxuXG4gIHB1YmxpYyBpbml0KCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gZDMuc2VsZWN0KHRoaXMuY29udGFpbmVySWRlbnRpdHkpO1xuICAgIHRoaXMuaW5pdEljb25NYXAodGhpcy5vcHRpb25zKTtcblxuICAgIHRoaXMubWVyZ2VQcm9wZXJ0eSh0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9uc0lucHV0KTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaWNvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNob3dJY29ucyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMubWluQ29sbGlzaW9uKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5taW5Db2xsaXNpb24gPSB0aGlzLm9wdGlvbnMubm9kZVJhZGl1cyAqIDI7XG4gICAgfVxuICAgIHRoaXMuaW5pdEltYWdlTWFwKHRoaXMub3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5hdHRyKCdjbGFzcycsICduZW80amQzJylcbiAgICAgICAgICAuaHRtbCgnJyk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmluZm9QYW5lbCkge1xuICAgICAgICB0aGlzLmluZm8gPSB0aGlzLmFwcGVuZEluZm9QYW5lbCh0aGlzLmNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5zdmcgPSB0aGlzLmFwcGVuZEdyYXBoKHRoaXMuY29udGFpbmVyKTtcblxuICAgIHRoaXMuc2ltdWxhdGlvbiA9IHRoaXMuaW5pdFNpbXVsYXRpb24oKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMubmVvNGpEYXRhKSB7XG4gICAgICAgIHRoaXMubG9hZE5lbzRqRGF0YSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLm5lbzRqRGF0YVVybCkge1xuICAgICAgICB0aGlzLmxvYWROZW80akRhdGFGcm9tVXJsKHRoaXMub3B0aW9ucy5uZW80akRhdGFVcmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBib3RoIG5lbzRqRGF0YSBhbmQgbmVvNGpEYXRhVXJsIGFyZSBlbXB0eSEnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICB9XG5cbiAgcHVibGljIGluaXRTaW11bGF0aW9uKCkge1xuXG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG5cbiAgICAgIHZhciBwYXJlbnRFbGVtZW50ID0gdGhpcy5zdmcubm9kZSgpLnBhcmVudEVsZW1lbnQ7XG4gICAgICBpZihwYXJlbnRFbGVtZW50PT11bmRlZmluZWQgfHwgcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50PT11bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNsaWVudFdpZHRoID0gdGhpcy5zdmcubm9kZSgpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDI7XG4gICAgICBjb25zdCBjbGllbnRIZWlnaHQgPSB0aGlzLnN2Zy5ub2RlKCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDI7XG5cbiAgICAgIHZhciBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKCkgXG4gICAgICAgICAgLy8gLnZlbG9jaXR5RGVjYXkoMC44KVxuICAgICAgICAgIC8vIC5mb3JjZSgneCcsIGQzLmZvcmNlKCkuc3RyZW5ndGgoMC4wMDIpKVxuICAgICAgICAgIC8vIC5mb3JjZSgneScsIGQzLmZvcmNlKCkuc3RyZW5ndGgoMC4wMDIpKVxuICAgICAgICAgIC5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLm9wdGlvbnMubWluQ29sbGlzaW9uO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLml0ZXJhdGlvbnMoMikpXG4gICAgICAgICAgLmZvcmNlKCdjaGFyZ2UnLCBkMy5mb3JjZU1hbnlCb2R5KCkpXG4gICAgICAgICAgLmZvcmNlKCdsaW5rJywgZDMuZm9yY2VMaW5rKCkuaWQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gZC5pZDtcbiAgICAgICAgICB9KSlcbiAgICAgICAgICAuZm9yY2UoJ2NlbnRlcicsIGQzLmZvcmNlQ2VudGVyKGNsaWVudFdpZHRoLCBjbGllbnRIZWlnaHQpKVxuICAgICAgICAgIC5vbigndGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB0aGlzT2JqLnRpY2soKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMuem9vbUZpdCAmJiAhdGhpc09iai5qdXN0TG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gRk9SIENVU1RPTUlaQVRJT05cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNpbXVsYXRpb247XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kR3JhcGgoY29udGFpbmVyKSB7XG4gICAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgICAgdmFyIHN2ZyA9IGNvbnRhaW5lci5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsICcxMDAlJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsICcxMDAlJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMtZ3JhcGgnKVxuICAgICAgICAgICAgICAgICAuY2FsbChkMy56b29tKCkub24oJ3pvb20nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZSA9IGQzLmV2ZW50LnRyYW5zZm9ybS5rLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSA9IFtkMy5ldmVudC50cmFuc2Zvcm0ueCwgZDMuZXZlbnQudHJhbnNmb3JtLnldO1xuXG4gICAgICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5zdmdUcmFuc2xhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVbMF0gKz0gdGhpc09iai5zdmdUcmFuc2xhdGVbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlWzFdICs9IHRoaXNPYmouc3ZnVHJhbnNsYXRlWzFdO1xuICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5zdmdTY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlICo9IHRoaXNPYmouc3ZnU2NhbGU7XG4gICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmouc3ZnLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHRyYW5zbGF0ZVswXSArICcsICcgKyB0cmFuc2xhdGVbMV0gKyAnKSBzY2FsZSgnICsgc2NhbGUgKyAnKScpO1xuICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgLm9uKCdkYmxjbGljay56b29tJywgbnVsbClcbiAgICAgICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsICcxMDAlJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsICcxMDAlJyk7XG5cbiAgICAgICAgICAgICAgICAgIHRoaXMuc3ZnUmVsYXRpb25zaGlwcyA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdyZWxhdGlvbnNoaXBzJyk7XG4gICAgICAgICAgICAgICAgICB0aGlzLnN2Z05vZGVzID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ25vZGVzJyk7XG4gICAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9QYW5lbChjb250YWluZXIpIHtcbiAgICAgIHJldHVybiBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMtaW5mbycpO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9FbGVtZW50KGNscywgaXNOb2RlLCBwcm9wZXJ0eSwgdmFsdWU9bnVsbCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLmluZm8uYXBwZW5kKCdhJyk7XG5cbiAgICAgIGVsZW0uYXR0cignaHJlZicsICcjJylcbiAgICAgIC5hdHRyKCdjbGFzcycsIGNscylcbiAgICAgIC5odG1sKCc8c3Ryb25nPicgKyBwcm9wZXJ0eSArICc8L3N0cm9uZz4nICsgKHZhbHVlID8gKCc6ICcgKyB2YWx1ZSkgOiAnJykpO1xuXG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICAgICAgICBlbGVtLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gdGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yIDogKGlzTm9kZSA/IHRoaXNPYmouY2xhc3MyY29sb3IocHJvcGVydHkpIDogdGhpc09iai5kZWZhdWx0Q29sb3IoKSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ2JvcmRlci1jb2xvcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3IodGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yKSA6IChpc05vZGUgPyB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKHByb3BlcnR5KSA6IHRoaXNPYmouZGVmYXVsdERhcmtlbkNvbG9yKCkpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN0eWxlKCdjb2xvcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3IodGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yKSA6ICcjZmZmJztcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvRWxlbWVudENsYXNzKGNscywgbm9kZSkge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudChjbHMsIHRydWUsIG5vZGUpO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9FbGVtZW50UHJvcGVydHkoY2xzLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCBmYWxzZSwgcHJvcGVydHksIHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvRWxlbWVudFJlbGF0aW9uc2hpcChjbHMsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudChjbHMsIGZhbHNlLCByZWxhdGlvbnNoaXApO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZE5vZGUoKSB7XG4gICAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMubm9kZS5lbnRlcigpXG4gICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICB2YXIgY2xhc3NlcyA9ICdub2RlJztcbiAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouaWNvbihkKSkge1xuICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaWNvbic7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouaW1hZ2UoZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgKz0gJyBub2RlLWltYWdlJztcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLmhpZ2hsaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzT2JqLm9wdGlvbnMuaGlnaGxpZ2h0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGlnaGxpZ2h0ID0gdGhpc09iai5vcHRpb25zLmhpZ2hsaWdodFtpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkLmxhYmVsc1swXSA9PT0gaGlnaGxpZ2h0LmNsYXNzICYmIGQucHJvcGVydGllc1toaWdobGlnaHQucHJvcGVydHldID09PSBoaWdobGlnaHQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaGlnaGxpZ2h0ZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXM7XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgZC5meCA9IGQuZnkgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vbk5vZGVDbGljayAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uTm9kZUNsaWNrKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgdGhpc09iai5zdGlja05vZGUoZCk7XG4gICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25Ob2RlRG91YmxlQ2xpY2sgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vbk5vZGVEb3VibGVDbGljayhkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLmluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLnVwZGF0ZUluZm8oZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uTm9kZU1vdXNlRW50ZXIgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vbk5vZGVNb3VzZUVudGVyKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouaW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmouY2xlYXJJbmZvKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uTm9kZU1vdXNlTGVhdmUgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vbk5vZGVNb3VzZUxlYXZlKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLmNhbGwoZDMuZHJhZygpXG4gICAgICAgICAgICAgICAgICAgICAub24oJ3N0YXJ0JywgIGZ1bmN0aW9uKGQpIHsgdGhpc09iai5kcmFnU3RhcnRlZChkKTsgfSApXG4gICAgICAgICAgICAgICAgICAgICAub24oJ2RyYWcnLCBmdW5jdGlvbihkKSB7IHRoaXNPYmouZHJhZ2dlZChkKTsgfSApXG4gICAgICAgICAgICAgICAgICAgICAub24oJ2VuZCcsIGZ1bmN0aW9uKGQpIHsgdGhpc09iai5kcmFnRW5kZWQoZCk7IH0gKSApO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZE5vZGVUb0dyYXBoKCkge1xuICAgICAgdmFyIG4gPSB0aGlzLmFwcGVuZE5vZGUoKTtcbiAgICAgIHRoaXMuYXBwZW5kUmluZ1RvTm9kZShuKTtcbiAgICAgIHRoaXMuYXBwZW5kT3V0bGluZVRvTm9kZShuKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWNvbnMpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZFRleHRUb05vZGUobik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmltYWdlcykge1xuICAgICAgICAgIHRoaXMuYXBwZW5kSW1hZ2VUb05vZGUobik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbjtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRPdXRsaW5lVG9Ob2RlKG5vZGUpIHtcbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdvdXRsaW5lJylcbiAgICAgICAgICAgICAuYXR0cigncicsIG9wdGlvbnMubm9kZVJhZGl1cylcbiAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA6IHRoaXNPYmouY2xhc3MyY29sb3IoZC5sYWJlbHNbMF0pO1xuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcihvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yKSA6IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3IoZC5sYWJlbHNbMF0pO1xuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLmFwcGVuZCgndGl0bGUnKS50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLnRvU3RyaW5nKGQpO1xuICAgICAgICAgICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGNsYXNzMmNvbG9yKGNscykge1xuICAgICAgdmFyIGNvbG9yID0gdGhpcy5jbGFzc2VzMmNvbG9yc1tjbHNdO1xuICAgICAgaWYgKCFjb2xvcikge1xuICAgICAgICAgIC8vIGNvbG9yID0gdGhpcy5vcHRpb25zLmNvbG9yc1tNYXRoLm1pbihudW1DbGFzc2VzLCB0aGlzLm9wdGlvbnMuY29sb3JzLmxlbmd0aCAtIDEpXTtcbiAgICAgICAgICBjb2xvciA9IHRoaXMub3B0aW9ucy5jb2xvcnNbdGhpcy5udW1DbGFzc2VzICUgdGhpcy5vcHRpb25zLmNvbG9ycy5sZW5ndGhdO1xuICAgICAgICAgIHRoaXMuY2xhc3NlczJjb2xvcnNbY2xzXSA9IGNvbG9yO1xuICAgICAgICAgIHRoaXMubnVtQ2xhc3NlcysrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbG9yO1xuICB9XG5cbiAgcHVibGljIGNsYXNzMmRhcmtlbkNvbG9yKGNscykge1xuICAgICAgdmFyIGNvbG9yVmFsdWUgPSB0aGlzLmNsYXNzMmNvbG9yKGNscyk7XG4gICAgICB0cnkge1xuICAgICAgICAgIC8vIENPTE9SIE9iamVjdCBpcyBub3Qgd29ya2luZyBwcm9wZXJseSB3aGVuIHRoZSBvcHRpbWl6YXRpb24gaXMgc2V0IHRydWVcbiAgICAgICAgICB2YXIgY29sb3JPYmplY3QgPSBkMy5yZ2IoY29sb3JWYWx1ZSk7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yT2JqZWN0LmRhcmtlcigxKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoKGVycikge31cbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRSaW5nVG9Ob2RlKG5vZGUpIHtcbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcbiAgICAgIHJldHVybiBub2RlLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAncmluZycpXG4gICAgICAgICAgLmF0dHIoJ3InLCB0aGlzLm9wdGlvbnMubm9kZVJhZGl1cyAqIDEuMTYpXG4gICAgICAgICAgLmFwcGVuZCgndGl0bGUnKS50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpc09iai50b1N0cmluZyhkKTtcbiAgICAgIH0pO1xuICB9XG5cblxuICBwdWJsaWMgYXBwZW5kSW1hZ2VUb05vZGUobm9kZSkge1xuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuICAgICAgLy8gVE9ETyA+PiBDaGFuZ2UgVGhpcyBUbyBCZWNvbWUgVGhlIENvbnRhaW5lclxuICAgICAgLy8gQWRkZWQgdGhlIFtpY29uRmxhZ10gYXR0cmlidXRlIGluIHRoZSBub2RlIG9yICdkJyB2YXJpYWJsZVxuICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCdpbWFnZScpLmF0dHIoJ3dpZHRoJywgJzM1cHgnKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgJzM1cHgnKS5hdHRyKCd4JywgJy0xOHB4JykuYXR0cigneScsICctMThweCcpXG4gICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgZnVuY3Rpb24oZCkgeyByZXR1cm4gdGhpc09iai5pbWFnZShkKTsgfSk7XG4gICAgIDtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRUZXh0VG9Ob2RlKG5vZGUpIHtcbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcbiAgICAgIHJldHVybiBub2RlLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgZnVuY3Rpb24oZCkgeyByZXR1cm4gJ3RleHQnICsgKHRoaXNPYmouaWNvbihkKSA/ICcgaWNvbicgOiAnJyk7IH0pXG4gICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgICAgIC5hdHRyKCdmb250LXNpemUnLCBmdW5jdGlvbihkKSB7IHJldHVybiAodGhpc09iai5pY29uKGQpID8gJzI1cHgnIDogJzEycHgnKTsgfSlcbiAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbihkKSB7IHJldHVybiAodGhpc09iai5pY29uKGQpID8gJzI1cHgnIDogJzMwcHgnKTsgfSlcbiAgICAgICAgICAuYXR0cigneScsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICh0aGlzT2JqLmljb24oZCkgPyAnMjVweCcgOiAnMzBweCcpOyB9KVxuICAgICAgICAgIC5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgY29uc3QgcmdiID0gJ2ZpbGw6IHJnYigyMjUsIDIyNSwgMjI1KTsgc3Ryb2tlOiByZ2IoMDAwLCAwMDAsIDAwMCk7JztcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmouaWNvbihkKSA/IHJnYiA6ICcnO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmh0bWwoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICB2YXIgX2ljb24gPSB0aGlzT2JqLmljb24oZCk7XG4gICAgICAgICAgICAgIHJldHVybiBfaWNvbiA/ICcmI3gnICsgX2ljb24gOiBkLmlkO1xuICAgICAgICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFJhbmRvbURhdGFUb05vZGUoZCwgbWF4Tm9kZXNUb0dlbmVyYXRlKSB7XG4gICAgICB2YXIgZGF0YSA9IHRoaXMucmFuZG9tRDNEYXRhKGQsIG1heE5vZGVzVG9HZW5lcmF0ZSk7XG4gICAgICB0aGlzLnVwZGF0ZVdpdGhOZW80akRhdGEoZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kUmVsYXRpb25zaGlwKCkge1xuICAgICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICAgIC8vIEZ1bmN0aW9uID4gRG91YmxlIENsaWNrIFxuICAgICAgY29uc3QgZm5Eb3VibGVDbGljayA9IGZ1bmN0aW9uKGQ6YW55KSB7XG4gICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uUmVsYXRpb25zaGlwRG91YmxlQ2xpY2soZCk7XG4gICAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIC8vIEZ1bmN0aW9uID4gTW91c2UgRW50ZXJcbiAgICAgIGNvbnN0IGZuTW91c2VFbnRlciA9IGZ1bmN0aW9uKGQ6YW55KSB7XG4gICAgICAgICAgaWYgKHRoaXNPYmouaW5mbykge1xuICAgICAgICAgICAgICB0aGlzT2JqLnVwZGF0ZUluZm8oZCk7XG4gICAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLnJlbGF0aW9uc2hpcC5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3JlbGF0aW9uc2hpcCcpLm9uKCdkYmxjbGljaycsIGZuRG91YmxlQ2xpY2spLm9uKCdtb3VzZWVudGVyJywgZm5Nb3VzZUVudGVyKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhckluZm8oKSB7XG4gICAgICB0aGlzLmluZm8uaHRtbCgnJyk7XG4gIH1cblxuICBwdWJsaWMgY29sb3IoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbG9yc1t0aGlzLm9wdGlvbnMuY29sb3JzLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkgPDwgMF07XG4gIH1cblxuICBwdWJsaWMgY29sb3JzKCkgOiBBcnJheTxTdHJpbmc+IHtcbiAgICAgIC8vIGQzLnNjaGVtZUNhdGVnb3J5MTAsXG4gICAgICAvLyBkMy5zY2hlbWVDYXRlZ29yeTIwLFxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAnIzY4YmRmNicsIC8vIGxpZ2h0IGJsdWVcbiAgICAgICAgICAnIzZkY2U5ZScsIC8vIGdyZWVuICMxXG4gICAgICAgICAgJyNmYWFmYzInLCAvLyBsaWdodCBwaW5rXG4gICAgICAgICAgJyNmMmJhZjYnLCAvLyBwdXJwbGVcbiAgICAgICAgICAnI2ZmOTI4YycsIC8vIGxpZ2h0IHJlZFxuICAgICAgICAgICcjZmNlYTdlJywgLy8gbGlnaHQgeWVsbG93XG4gICAgICAgICAgJyNmZmM3NjYnLCAvLyBsaWdodCBvcmFuZ2VcbiAgICAgICAgICAnIzQwNWY5ZScsIC8vIG5hdnkgYmx1ZVxuICAgICAgICAgICcjYTVhYmI2JywgLy8gZGFyayBncmF5XG4gICAgICAgICAgJyM3OGNlY2InLCAvLyBncmVlbiAjMixcbiAgICAgICAgICAnI2I4OGNiYicsIC8vIGRhcmsgcHVycGxlXG4gICAgICAgICAgJyNjZWQyZDknLCAvLyBsaWdodCBncmF5XG4gICAgICAgICAgJyNlODQ2NDYnLCAvLyBkYXJrIHJlZFxuICAgICAgICAgICcjZmE1Zjg2JywgLy8gZGFyayBwaW5rXG4gICAgICAgICAgJyNmZmFiMWEnLCAvLyBkYXJrIG9yYW5nZVxuICAgICAgICAgICcjZmNkYTE5JywgLy8gZGFyayB5ZWxsb3dcbiAgICAgICAgICAnIzc5N2I4MCcsIC8vIGJsYWNrXG4gICAgICAgICAgJyNjOWQ5NmYnLCAvLyBwaXN0YWNjaGlvXG4gICAgICAgICAgJyM0Nzk5MWYnLCAvLyBncmVlbiAjM1xuICAgICAgICAgICcjNzBlZGVlJywgLy8gdHVycXVvaXNlXG4gICAgICAgICAgJyNmZjc1ZWEnICAvLyBwaW5rXG4gICAgICBdO1xuICB9XG5cbiAgcHVibGljIGNvbnRhaW5zUmVzdWx0KGFycmF5LCBpZCkge1xuICAgICAgdmFyIGZpbHRlciA9IGFycmF5LmZpbHRlcihmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW0uaWQgPT09IGlkO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmlsdGVyLmxlbmd0aCA+IDA7XG4gIH1cblxuICBwdWJsaWMgZGVmYXVsdENvbG9yKCkge1xuICByZXR1cm4gdGhpcy5vcHRpb25zLnJlbGF0aW9uc2hpcENvbG9yO1xuICB9XG5cbiAgcHVibGljIGRlZmF1bHREYXJrZW5Db2xvcigpIHtcbiAgICAgIHZhciBjb2xvclZhbHVlID0gdGhpcy5vcHRpb25zLmNvbG9yc1t0aGlzLm9wdGlvbnMuY29sb3JzLmxlbmd0aCAtIDFdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBDT0xPUiBPYmplY3QgaXMgbm90IHdvcmtpbmcgcHJvcGVybHkgd2hlbiB0aGUgb3B0aW1pemF0aW9uIGlzIHNldCB0cnVlXG4gICAgICAgICAgdmFyIGNvbG9yT2JqZWN0ID0gZDMucmdiKGNvbG9yVmFsdWUpO1xuICAgICAgICAgIHJldHVybiBjb2xvck9iamVjdC5kYXJrZXIoMSk7XG4gICAgICB9XG4gICAgICBjYXRjaChlcnIpIHsgfVxuICB9XG5cbiAgcHVibGljIGRyYWdFbmRlZChkKSB7XG4gICAgICBpZiAoIWQzLmV2ZW50LmFjdGl2ZSkge1xuICAgICAgICAgIHRoaXMuc2ltdWxhdGlvbi5hbHBoYVRhcmdldCgwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbk5vZGVEcmFnRW5kICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25Ob2RlRHJhZ0VuZChkKTtcbiAgICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkcmFnZ2VkKGQpIHtcbiAgICAgIHRoaXMuc3RpY2tOb2RlKGQpO1xuICB9XG5cbiAgcHVibGljIGRyYWdTdGFydGVkKGQpIHtcbiAgICAgIGlmICghZDMuZXZlbnQuYWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5zaW11bGF0aW9uLmFscGhhVGFyZ2V0KDAuMykucmVzdGFydCgpO1xuICAgICAgfVxuICAgICAgZC5meCA9IGQueDtcbiAgICAgIGQuZnkgPSBkLnk7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm9uTm9kZURyYWdTdGFydCAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uTm9kZURyYWdTdGFydChkKTtcbiAgICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBleHRlbmQob2JqMSwgb2JqMikge1xuICAgIHZhciBvYmogPSB7fTtcbiAgICB0aGlzLm1lcmdlUHJvcGVydHkob2JqLCBvYmoxKTtcbiAgICB0aGlzLm1lcmdlUHJvcGVydHkob2JqLCBvYmoyKTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cblxuICBwdWJsaWMgaWNvbihkKSB7XG4gICAgdmFyIGNvZGU7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmljb25NYXAgJiYgdGhpcy5vcHRpb25zLnNob3dJY29ucyAmJiB0aGlzLm9wdGlvbnMuaWNvbnMpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV0gJiYgdGhpcy5vcHRpb25zLmljb25NYXBbdGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXV0pIHtcbiAgICAgICAgICAgIGNvZGUgPSB0aGlzLm9wdGlvbnMuaWNvbk1hcFt0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dXTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuaWNvbk1hcFtkLmxhYmVsc1swXV0pIHtcbiAgICAgICAgICAgIGNvZGUgPSB0aGlzLm9wdGlvbnMuaWNvbk1hcFtkLmxhYmVsc1swXV07XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXSkge1xuICAgICAgICAgICAgY29kZSA9IHRoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29kZTtcbiAgfVxuXG4gIHB1YmxpYyBpbWFnZShkKSB7XG4gICAgdmFyIGksIGltYWdlc0ZvckxhYmVsLCBpbWcsIGltZ0xldmVsLCBsYWJlbCwgbGFiZWxQcm9wZXJ0eVZhbHVlLCBwcm9wZXJ0eSwgdmFsdWU7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmltYWdlcykge1xuICAgICAgICBjb25zdCBpbWdSZWYgPSBkLmltZz09dW5kZWZpbmVkID8gZC5sYWJlbHNbMF0gOiBkLmltZztcbiAgICAgICAgaW1hZ2VzRm9yTGFiZWwgPSB0aGlzLm9wdGlvbnMuaW1hZ2VNYXBbaW1nUmVmXTtcblxuICAgICAgICBpZiAoaW1hZ2VzRm9yTGFiZWwpIHtcbiAgICAgICAgICAgIGltZ0xldmVsID0gMDtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGltYWdlc0ZvckxhYmVsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGFiZWxQcm9wZXJ0eVZhbHVlID0gaW1hZ2VzRm9yTGFiZWxbaV0uc3BsaXQoJ3wnKTtcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAobGFiZWxQcm9wZXJ0eVZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbGFiZWxQcm9wZXJ0eVZhbHVlWzJdO1xuICAgICAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBsYWJlbFByb3BlcnR5VmFsdWVbMV07XG4gICAgICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGxhYmVsUHJvcGVydHlWYWx1ZVswXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaW1nUmVmID09PSBsYWJlbCAmJlxuICAgICAgICAgICAgICAgICAgICAoIXByb3BlcnR5IHx8IGQucHJvcGVydGllc1twcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkgJiZcbiAgICAgICAgICAgICAgICAgICAgKCF2YWx1ZSB8fCBkLnByb3BlcnRpZXNbcHJvcGVydHldID09PSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGggPiBpbWdMZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gdGhpcy5vcHRpb25zLmltYWdlc1tpbWFnZXNGb3JMYWJlbFtpXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWdMZXZlbCA9IGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW1nO1xuICB9XG5cbiAgcHVibGljIGxvYWROZW80akRhdGEoKSB7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgIHRoaXMucmVsYXRpb25zaGlwcyA9IFtdO1xuICAgIHRoaXMudXBkYXRlV2l0aE5lbzRqRGF0YSh0aGlzLm9wdGlvbnMubmVvNGpEYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkTmVvNGpEYXRhRnJvbVVybChuZW80akRhdGFVcmwpIHtcbiAgICB0aGlzLm5vZGVzID0gW107XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBzID0gW107XG5cbiAgICBkMy5qc29uKG5lbzRqRGF0YVVybCwgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVdpdGhOZW80akRhdGEoZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmVvNGpEYXRhVG9EM0RhdGEoZGF0YSkge1xuICAgIHZhciBncmFwaCA9IHtcbiAgICAgICAgbm9kZXM6IFtdLFxuICAgICAgICByZWxhdGlvbnNoaXBzOiBbXVxuICAgIH07XG5cbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIGRhdGEucmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICByZXN1bHQuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuZ3JhcGgubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzT2JqLmNvbnRhaW5zUmVzdWx0KGdyYXBoLm5vZGVzLCBub2RlLmlkKSkge1xuICAgICAgICAgICAgICAgICAgICBncmFwaC5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMuZm9yRWFjaChmdW5jdGlvbihyZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAuc291cmNlID0gcmVsYXRpb25zaGlwLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAudGFyZ2V0ID0gcmVsYXRpb25zaGlwLmVuZE5vZGU7XG4gICAgICAgICAgICAgICAgZ3JhcGgucmVsYXRpb25zaGlwcy5wdXNoKHJlbGF0aW9uc2hpcCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIGlmIChhLnNvdXJjZSA+IGIuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYS5zb3VyY2UgPCBiLnNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEudGFyZ2V0ID4gYi50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGEudGFyZ2V0IDwgYi50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgIT09IDAgJiYgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLnNvdXJjZSA9PT0gZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ktMV0uc291cmNlICYmIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpXS50YXJnZXQgPT09IGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpLTFdLnRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaV0ubGlua251bSA9IGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpIC0gMV0ubGlua251bSArIDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLmxpbmtudW0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoZCkge1xuICAgIHZhciBzID0gZC5sYWJlbHMgPyBkLmxhYmVsc1swXSA6IGQudHlwZTtcbiAgICBzICs9ICcgKDxpZD46ICcgKyBkLmlkO1xuICAgIE9iamVjdC5rZXlzKGQucHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICBzICs9ICcsICcgKyBwcm9wZXJ0eSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShkLnByb3BlcnRpZXNbcHJvcGVydHldKTtcbiAgICB9KTtcbiAgICBzICs9ICcpJztcbiAgICByZXR1cm4gcztcbiAgfVxuXG4gIHB1YmxpYyByYW5kb21EM0RhdGEoZCwgbWF4Tm9kZXNUb0dlbmVyYXRlKSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIG5vZGVzOiBbXSxcbiAgICAgICAgcmVsYXRpb25zaGlwczogW11cbiAgICB9O1xuXG4gICAgdmFyIG51bU5vZGVzID0gKG1heE5vZGVzVG9HZW5lcmF0ZSAqIE1hdGgucmFuZG9tKCkgPDwgMCkgKyAxO1xuICAgIHZhciBzID0gdGhpcy5zaXplKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU5vZGVzOyBpKyspIHtcbiAgICAgIC8vIHZhciBpY29ucyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5pY29uTWFwKTtcbiAgICAgIGNvbnN0IGxhYmVsID0gXCJIZWxsb1wiOyAvLyBpY29uc1tpY29ucy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpIDw8IDBdO1xuXG4gICAgICBjb25zdCBub2RlID0ge1xuICAgICAgICAgIGlkOiBzLm5vZGVzICsgMSArIGksXG4gICAgICAgICAgbGFiZWxzOiBbbGFiZWxdLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcmFuZG9tOiBsYWJlbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeDogZC54LFxuICAgICAgICAgIHk6IGQueVxuICAgICAgfTtcblxuICAgICAgZGF0YS5ub2Rlc1tkYXRhLm5vZGVzLmxlbmd0aF0gPSBub2RlO1xuXG4gICAgICBjb25zdCByZWxhdGlvbnNoaXAgPSB7XG4gICAgICAgICAgaWQ6IHMucmVsYXRpb25zaGlwcyArIDEgKyBpLFxuICAgICAgICAgIHR5cGU6IGxhYmVsLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgc3RhcnROb2RlOiBkLmlkLFxuICAgICAgICAgIGVuZE5vZGU6IHMubm9kZXMgKyAxICsgaSxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGZyb206IERhdGUubm93KClcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNvdXJjZTogZC5pZCxcbiAgICAgICAgICB0YXJnZXQ6IHMubm9kZXMgKyAxICsgaSxcbiAgICAgICAgICBsaW5rbnVtOiBzLnJlbGF0aW9uc2hpcHMgKyAxICsgaVxuICAgICAgfTtcblxuICAgICAgZGF0YS5yZWxhdGlvbnNoaXBzW2RhdGEucmVsYXRpb25zaGlwcy5sZW5ndGhdID0gcmVsYXRpb25zaGlwO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBzaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBub2RlczogdGhpcy5ub2Rlcy5sZW5ndGgsXG4gICAgICByZWxhdGlvbnNoaXBzOiB0aGlzLnJlbGF0aW9uc2hpcHMubGVuZ3RoXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBzdGlja05vZGUoZCkge1xuICAgIGQuZnggPSBkMy5ldmVudC54O1xuICAgIGQuZnkgPSBkMy5ldmVudC55O1xuICB9XG5cbiAgcHVibGljIHRpY2soKSB7XG4gICAgdGhpcy50aWNrTm9kZXMoKTtcbiAgICB0aGlzLnRpY2tSZWxhdGlvbnNoaXBzKCk7XG4gIH1cblxuICBwdWJsaWMgdGlja05vZGVzKCkge1xuICAgIGlmICh0aGlzLm5vZGUpIHtcbiAgICAgIHRoaXMubm9kZS5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIGlmKGQhPXVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCAnICsgZC55ICsgJyknO1xuICAgICAgICBjb25zdCBtc2cgPSBcIj09PT09PT09PT4+Pj4+Pj4+Pj4+Pj4+IEVSUk9SID4+IHRpY2tOb2Rlc1wiO1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRpY2tSZWxhdGlvbnNoaXBzKCkge1xuICAgIGlmICh0aGlzLnJlbGF0aW9uc2hpcCkge1xuICAgICAgY29uc3QgdGhpc09iaiA9IHRoaXM7XG4gICAgICB0aGlzLnJlbGF0aW9uc2hpcC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIGlmKGQhPXVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBhbmdsZSA9IHRoaXNPYmoucm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KTtcbiAgICAgICAgICBpZihkLnNvdXJjZSE9dW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC5zb3VyY2UueCArICcsICcgKyBkLnNvdXJjZS55ICsgJykgcm90YXRlKCcgKyBhbmdsZSArICcpJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbXNnID0gXCI9PT09PT09PT0+Pj4+Pj4+Pj4+Pj4+PiBFUlJPUiA+PiB0aWNrUmVsYXRpb25zaGlwc1wiO1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgICAgIFxuICAgICAgfSk7XG4gICAgICB0aGlzLnRpY2tSZWxhdGlvbnNoaXBzVGV4dHMoKTtcbiAgICAgIHRoaXMudGlja1JlbGF0aW9uc2hpcHNPdXRsaW5lcygpO1xuICAgICAgdGhpcy50aWNrUmVsYXRpb25zaGlwc092ZXJsYXlzKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRpY2tSZWxhdGlvbnNoaXBzT3V0bGluZXMoKSB7XG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICB0aGlzLnJlbGF0aW9uc2hpcC5lYWNoKCAocmVsYXRpb25zaGlwLCBpbmRleCwgZykgPT4ge1xuICAgICAgdmFyIG9iaiA9IGdbaW5kZXhdO1xuICAgICAgdmFyIHJlbCA9IGQzLnNlbGVjdChvYmopO1xuICAgICAgdmFyIG91dGxpbmU7XG4gICAgICB0cnkge291dGxpbmUgPSByZWwuc2VsZWN0KCcub3V0bGluZScpO31cbiAgICAgIGNhdGNoKGVycikgeyByZXR1cm47IH1cbiAgICAgIFxuICAgICAgdmFyIHRleHQgPSByZWwuc2VsZWN0KCcudGV4dCcpO1xuICAgICAgXG4gICAgICB0cnkge3ZhciBiYm94ID0gdGV4dC5ub2RlKCkuZ2V0QkJveCgpO31cbiAgICAgIGNhdGNoKGVycikgeyByZXR1cm47IH1cblxuICAgICAgdmFyIHBhZGRpbmcgPSAzO1xuXG4gICAgICBvdXRsaW5lLmF0dHIoJ2QnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpc09iai5vcHRpb25zO1xuICAgICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXG4gICAgICAgICAgYW5nbGUgPSB0aGlzT2JqLnJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgdGV4dEJvdW5kaW5nQm94ID0gdGV4dC5ub2RlKCkuZ2V0QkJveCgpLFxuICAgICAgICAgIHRleHRQYWRkaW5nID0gNSxcbiAgICAgICAgICB1ID0gdGhpc09iai51bml0YXJ5VmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgdGV4dE1hcmdpbiA9IHsgeDogKGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKHRleHRCb3VuZGluZ0JveC53aWR0aCArIHRleHRQYWRkaW5nKSAqIHUueCkgKiAwLjUsIHk6IChkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtICh0ZXh0Qm91bmRpbmdCb3gud2lkdGggKyB0ZXh0UGFkZGluZykgKiB1LnkpICogMC41IH0sXG4gICAgICAgICAgbiA9IHRoaXNPYmoudW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEExID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogMCArICh0aGlzT2JqLm9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gbi54LCB5OiAwICsgKHRoaXNPYmoub3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEIxID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogdGV4dE1hcmdpbi54IC0gbi54LCB5OiB0ZXh0TWFyZ2luLnkgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEMxID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogdGV4dE1hcmdpbi54LCB5OiB0ZXh0TWFyZ2luLnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEQxID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogMCArIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCwgeTogMCArIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QTIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIHRleHRNYXJnaW4ueCAtIG4ueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSB0ZXh0TWFyZ2luLnkgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEIyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSBuLnggLSB1LnggKiBvcHRpb25zLmFycm93U2l6ZSwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSBuLnkgLSB1LnkgKiBvcHRpb25zLmFycm93U2l6ZSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QzIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIG4ueCArIChuLnggLSB1LngpICogb3B0aW9ucy5hcnJvd1NpemUsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IC0gbi55ICsgKG4ueSAtIHUueSkgKiBvcHRpb25zLmFycm93U2l6ZSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RDIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEUyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggKyAoLSBuLnggLSB1LngpICogb3B0aW9ucy5hcnJvd1NpemUsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55ICsgKC0gbi55IC0gdS55KSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRGMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gdS54ICogb3B0aW9ucy5hcnJvd1NpemUsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IC0gdS55ICogb3B0aW9ucy5hcnJvd1NpemUgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEcyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSB0ZXh0TWFyZ2luLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gdGV4dE1hcmdpbi55IH0sIGFuZ2xlKTtcblxuICAgICAgICByZXR1cm4gJ00gJyArIHJvdGF0ZWRQb2ludEExLnggKyAnICcgKyByb3RhdGVkUG9pbnRBMS55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEIxLnggKyAnICcgKyByb3RhdGVkUG9pbnRCMS55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEMxLnggKyAnICcgKyByb3RhdGVkUG9pbnRDMS55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEQxLnggKyAnICcgKyByb3RhdGVkUG9pbnREMS55ICtcbiAgICAgICAgICAnIFogTSAnICsgcm90YXRlZFBvaW50QTIueCArICcgJyArIHJvdGF0ZWRQb2ludEEyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QjIueCArICcgJyArIHJvdGF0ZWRQb2ludEIyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QzIueCArICcgJyArIHJvdGF0ZWRQb2ludEMyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RDIueCArICcgJyArIHJvdGF0ZWRQb2ludEQyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RTIueCArICcgJyArIHJvdGF0ZWRQb2ludEUyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RjIueCArICcgJyArIHJvdGF0ZWRQb2ludEYyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RzIueCArICcgJyArIHJvdGF0ZWRQb2ludEcyLnkgK1xuICAgICAgICAgICcgWic7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyKSB7IHJldHVybjsgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb3V0bGluZUZ1bmN0aW9uKGQsIHRleHQpIHtcbiAgICAgIFxuICB9XG5cbiAgcHVibGljIHRpY2tSZWxhdGlvbnNoaXBzT3ZlcmxheXMoKSB7XG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICB0aGlzLnJlbGF0aW9uc2hpcE92ZXJsYXkuYXR0cignZCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfSxcbiAgICAgICAgYW5nbGUgPSB0aGlzT2JqLnJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgIG4xID0gdGhpc09iai51bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgIG4gPSB0aGlzT2JqLnVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0LCA1MCksXG4gICAgICAgIHJvdGF0ZWRQb2ludEEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwIC0gbi54LCB5OiAwIC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgcm90YXRlZFBvaW50QiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gbi54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgIHJvdGF0ZWRQb2ludEMgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCArIG4ueCAtIG4xLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55ICsgbi55IC0gbjEueSB9LCBhbmdsZSksXG4gICAgICAgIHJvdGF0ZWRQb2ludEQgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwICsgbi54IC0gbjEueCwgeTogMCArIG4ueSAtIG4xLnkgfSwgYW5nbGUpO1xuXG4gICAgICByZXR1cm4gJ00gJyArIHJvdGF0ZWRQb2ludEEueCArICcgJyArIHJvdGF0ZWRQb2ludEEueSArXG4gICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50Qi54ICsgJyAnICsgcm90YXRlZFBvaW50Qi55ICtcbiAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRDLnggKyAnICcgKyByb3RhdGVkUG9pbnRDLnkgK1xuICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEQueCArICcgJyArIHJvdGF0ZWRQb2ludEQueSArXG4gICAgICAgICcgWic7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdGlja1JlbGF0aW9uc2hpcHNUZXh0cygpIHtcbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIHRoaXMucmVsYXRpb25zaGlwVGV4dC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgYW5nbGUgPSAodGhpc09iai5yb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpICsgMzYwKSAlIDM2MCxcbiAgICAgICAgbWlycm9yID0gYW5nbGUgPiA5MCAmJiBhbmdsZSA8IDI3MCxcbiAgICAgICAgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXG4gICAgICAgIG4gPSB0aGlzT2JqLnVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgbldlaWdodCA9IG1pcnJvciA/IDIgOiAtMyxcbiAgICAgICAgcG9pbnQgPSB7IHg6IChkLnRhcmdldC54IC0gZC5zb3VyY2UueCkgKiAwLjUgKyBuLnggKiBuV2VpZ2h0LCB5OiAoZC50YXJnZXQueSAtIGQuc291cmNlLnkpICogMC41ICsgbi55ICogbldlaWdodCB9LFxuICAgICAgICByb3RhdGVkUG9pbnQgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgcG9pbnQsIGFuZ2xlKTtcblxuICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIHJvdGF0ZWRQb2ludC54ICsgJywgJyArIHJvdGF0ZWRQb2ludC55ICsgJykgcm90YXRlKCcgKyAobWlycm9yID8gMTgwIDogMCkgKyAnKSc7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdW5pdGFyeU5vcm1hbFZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoPTEpIHtcbiAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH07XG4gICAgdmFyIHZlY3RvciA9IHRoaXMudW5pdGFyeVZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoKTtcbiAgICByZXR1cm4gdGhpcy5yb3RhdGVQb2ludChjZW50ZXIsIHZlY3RvciwgOTApO1xuICB9XG5cbiAgcHVibGljIHVuaXRhcnlWZWN0b3Ioc291cmNlLCB0YXJnZXQsIG5ld0xlbmd0aD0xKSB7XG4gICAgdmFyIGxlbmd0aCA9IE1hdGguc3FydChNYXRoLnBvdyh0YXJnZXQueCAtIHNvdXJjZS54LCAyKSArIE1hdGgucG93KHRhcmdldC55IC0gc291cmNlLnksIDIpKSAvIE1hdGguc3FydChuZXdMZW5ndGggfHwgMSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICh0YXJnZXQueCAtIHNvdXJjZS54KSAvIGxlbmd0aCxcbiAgICAgIHk6ICh0YXJnZXQueSAtIHNvdXJjZS55KSAvIGxlbmd0aCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgb2JzZWxldGUgYW5kIG5vdCB1c2VkIGFueSB3aGVyZVxuICAgKiBAb2JzZWxldGVcbiAgICogQHBhcmFtIGQzRGF0YVxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVdpdGhEM0RhdGEoZDNEYXRhKSB7XG4gICAgdGhpcy51cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMoZDNEYXRhLm5vZGVzLCBkM0RhdGEucmVsYXRpb25zaGlwcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGRhdGEgZm9yIE5lbzRqIFZpc3VhbGl6YXRpb25cbiAgICogQHBhcmFtIG5lbzRqRGF0YSBcbiAgICovXG4gIHB1YmxpYyB1cGRhdGVXaXRoTmVvNGpEYXRhKG5lbzRqRGF0YSkge1xuICAgIHZhciBkM0RhdGEgPSB0aGlzLm5lbzRqRGF0YVRvRDNEYXRhKG5lbzRqRGF0YSk7XG4gICAgdGhpcy51cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMoZDNEYXRhLm5vZGVzLCBkM0RhdGEucmVsYXRpb25zaGlwcyk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlSW5mbyhkKSB7XG4gICAgdGhpcy5jbGVhckluZm8oKTtcblxuICAgIGlmIChkLmxhYmVscykge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudENsYXNzKCdjbGFzcycsIGQubGFiZWxzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudFJlbGF0aW9uc2hpcCgnY2xhc3MnLCBkLnR5cGUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eSgncHJvcGVydHknLCAnJmx0O2lkJmd0OycsIGQuaWQpO1xuICAgIFxuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgT2JqZWN0LmtleXMoZC5wcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICB0aGlzT2JqLmFwcGVuZEluZm9FbGVtZW50UHJvcGVydHkoJ3Byb3BlcnR5JywgcHJvcGVydHksIEpTT04uc3RyaW5naWZ5KGQucHJvcGVydGllc1twcm9wZXJ0eV0pKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVOb2RlcyhuKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5ub2Rlcywgbik7XG5cbiAgICB0aGlzLm5vZGUgPSB0aGlzLnN2Z05vZGVzLnNlbGVjdEFsbCgnLm5vZGUnKS5kYXRhKHRoaXMubm9kZXMsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7IH0pO1xuICAgIHZhciBub2RlRW50ZXIgPSB0aGlzLmFwcGVuZE5vZGVUb0dyYXBoKCk7XG4gICAgdGhpcy5ub2RlID0gbm9kZUVudGVyLm1lcmdlKHRoaXMubm9kZSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlTm9kZXNBbmRSZWxhdGlvbnNoaXBzKG4sIHIpIHtcbiAgICB0aGlzLnVwZGF0ZVJlbGF0aW9uc2hpcHMocik7XG4gICAgdGhpcy51cGRhdGVOb2RlcyhuKTtcblxuICAgIHRoaXMuc2ltdWxhdGlvbi5ub2Rlcyh0aGlzLm5vZGVzKTtcbiAgICB0aGlzLnNpbXVsYXRpb24uZm9yY2UoJ2xpbmsnKS5saW5rcyh0aGlzLnJlbGF0aW9uc2hpcHMpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZVJlbGF0aW9uc2hpcHMocikge1xuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMucmVsYXRpb25zaGlwcywgcik7XG5cbiAgICB0aGlzLnJlbGF0aW9uc2hpcCA9IHRoaXMuc3ZnUmVsYXRpb25zaGlwcy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAnKS5kYXRhKHRoaXMucmVsYXRpb25zaGlwcywgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSk7XG4gICAgdmFyIHJlbGF0aW9uc2hpcCA9IHRoaXMuYXBwZW5kUmVsYXRpb25zaGlwKCk7XG5cbiAgICB2YXIgcmVsYXRpb25zaGlwRW50ZXIgOiBSZWxhdGlvbnNoaXBFbnRlciA9IHRoaXMuYXBwZW5kUmVsYXRpb25zaGlwVG9HcmFwaChyZWxhdGlvbnNoaXApO1xuICAgIHRoaXMucmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRW50ZXIucmVsYXRpb25zaGlwLm1lcmdlKHRoaXMucmVsYXRpb25zaGlwKTtcblxuICAgIHRoaXMucmVsYXRpb25zaGlwT3V0bGluZSA9IHRoaXMuc3ZnLnNlbGVjdEFsbCgnLnJlbGF0aW9uc2hpcCAub3V0bGluZScpO1xuICAgIHRoaXMucmVsYXRpb25zaGlwT3V0bGluZSA9IHJlbGF0aW9uc2hpcEVudGVyLm91dGxpbmUubWVyZ2UodGhpcy5yZWxhdGlvbnNoaXBPdXRsaW5lKTtcblxuICAgIHRoaXMucmVsYXRpb25zaGlwT3ZlcmxheSA9IHRoaXMuc3ZnLnNlbGVjdEFsbCgnLnJlbGF0aW9uc2hpcCAub3ZlcmxheScpO1xuICAgIHRoaXMucmVsYXRpb25zaGlwT3ZlcmxheSA9IHJlbGF0aW9uc2hpcEVudGVyLm92ZXJsYXkubWVyZ2UodGhpcy5yZWxhdGlvbnNoaXBPdmVybGF5KTtcblxuICAgIHRoaXMucmVsYXRpb25zaGlwVGV4dCA9IHRoaXMuc3ZnLnNlbGVjdEFsbCgnLnJlbGF0aW9uc2hpcCAudGV4dCcpO1xuICAgIHRoaXMucmVsYXRpb25zaGlwVGV4dCA9IHJlbGF0aW9uc2hpcEVudGVyLnRleHQubWVyZ2UodGhpcy5yZWxhdGlvbnNoaXBUZXh0KTtcbiAgfVxuXG5cblxuXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vICAgICAgICAgICAgTmVvNGogVXRpbFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG5cbiAgcHVibGljIGdldE9wdGlvbnNQcmVzZW50YXRpb24oKSA6IE5nTmVvNGpEM09wdGlvbnMge1xuICAgIHJldHVybiB7XG4gICAgICBhcnJvd1NpemU6IDQsXG4gICAgICBjb2xvcnM6IHVuZGVmaW5lZCxcbiAgICAgIGhpZ2hsaWdodDogW1xuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdQcm9qZWN0JyxcbiAgICAgICAgICBwcm9wZXJ0eTogJ25hbWUnLFxuICAgICAgICAgIHZhbHVlOiAnbmVvNGpkMydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAnVXNlcicsXG4gICAgICAgICAgcHJvcGVydHk6ICd1c2VySWQnLFxuICAgICAgICAgIHZhbHVlOiAnZWlzbWFuJ1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgaWNvbnM6IE5nTmVvNGpEM0ljb25zLmV4YW1wbGVJY29ucygpLFxuICAgICAgaW1hZ2VzOiBOZ05lbzRqRDNJY29ucy5leGFtcGxlSW1hZ2VzKCksXG4gICAgICBpY29uTWFwOiB1bmRlZmluZWQsICAgIC8vIFRoaXMgdmFsdWUgYXNzaWduZWQgaW4gTmVvNGpSYW5kb21cbiAgICAgIGltYWdlTWFwOiB1bmRlZmluZWQsXG4gICAgICBpbmZvUGFuZWw6IHRydWUsXG4gICAgICBtaW5Db2xsaXNpb246IDYwLFxuICAgICAgbmVvNGpEYXRhOiBOZW80akQzUmVjb3JkcyxcbiAgICAgIG5vZGVPdXRsaW5lRmlsbENvbG9yOiB1bmRlZmluZWQsXG4gICAgICBuZW80akRhdGFVcmw6IHVuZGVmaW5lZCxcbiAgICAgIG5vZGVSYWRpdXM6IDI1LFxuICAgICAgcmVsYXRpb25zaGlwQ29sb3I6ICcjYTVhYmI2JyxcbiAgICAgIG9uUmVsYXRpb25zaGlwRG91YmxlQ2xpY2s6IGZ1bmN0aW9uKHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZG91YmxlIGNsaWNrIG9uIHJlbGF0aW9uc2hpcDogJyArIEpTT04uc3RyaW5naWZ5KHJlbGF0aW9uc2hpcCkpO1xuICAgICAgfSxcbiAgICAgIHpvb21GaXQ6IHRydWUsXG4gICAgICBzaG93SWNvbnM6IHRydWUsXG4gICAgICBvbk5vZGVEb3VibGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZU1vdXNlRW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZU1vdXNlTGVhdmU6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZURyYWdFbmQ6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZURyYWdTdGFydDogdW5kZWZpbmVkLFxuICAgICAgZ3JhcGhDb250YWluZXJIZWlnaHQ6ICczMDBweCdcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZVBvaW50KGMsIHAsIGFuZ2xlKSB7XG4gICAgcmV0dXJuIHRoaXMucm90YXRlKGMueCwgYy55LCBwLngsIHAueSwgYW5nbGUpO1xuICB9XG5cbiAgcHVibGljIHJvdGF0aW9uKHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIodGFyZ2V0LnkgLSBzb3VyY2UueSwgdGFyZ2V0LnggLSBzb3VyY2UueCkgKiAxODAgLyBNYXRoLlBJO1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZShjeCwgY3ksIHgsIHksIGFuZ2xlKSB7XG4gICAgdmFyIHJhZGlhbnMgPSAoTWF0aC5QSSAvIDE4MCkgKiBhbmdsZSxcbiAgICAgICAgY29zID0gTWF0aC5jb3MocmFkaWFucyksXG4gICAgICAgIHNpbiA9IE1hdGguc2luKHJhZGlhbnMpLFxuICAgICAgICBueCA9IChjb3MgKiAoeCAtIGN4KSkgKyAoc2luICogKHkgLSBjeSkpICsgY3gsXG4gICAgICAgIG55ID0gKGNvcyAqICh5IC0gY3kpKSAtIChzaW4gKiAoeCAtIGN4KSkgKyBjeTtcblxuICAgIHJldHVybiB7IHg6IG54LCB5OiBueSB9O1xuICB9XG5cbiAgcHVibGljIGluaXRJY29uTWFwKG9wdGlvbnMpIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLmljb25NYXApLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgdmFyIGtleXMgPSBrZXkuc3BsaXQoJywnKTtcbiAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnMuaWNvbk1hcFtrZXldO1xuXG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIG9wdGlvbnMuaWNvbk1hcFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3B0aW9ucy5pY29uTWFwO1xuICB9XG5cbiAgcHVibGljIGluaXRJbWFnZU1hcChvcHRpb25zKSB7XG4gICAgLy8gdmFyIGtleSwga2V5cywgc2VsZWN0b3I7XG4gICAgdmFyIGtleSwga2V5cztcbiAgICBmb3IgKGtleSBpbiBvcHRpb25zLmltYWdlcykge1xuICAgICAgaWYgKG9wdGlvbnMuaW1hZ2VzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAga2V5cyA9IGtleS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAoIW9wdGlvbnMuaW1hZ2VNYXBba2V5c1swXV0pIHtcbiAgICAgICAgICBvcHRpb25zLmltYWdlTWFwW2tleXNbMF1dID0gW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXS5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kVGV4dFRvUmVsYXRpb25zaGlwKHIpIHtcbiAgICB2YXIgclRleHQgPSByLmFwcGVuZCgndGV4dCcpO1xuICAgIHJldHVybiByVGV4dC5hdHRyKCdjbGFzcycsICd0ZXh0JykuYXR0cignZmlsbCcsICcjMDAwMDAwJykuYXR0cignZm9udC1zaXplJywgJzhweCcpLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkLnR5cGU7IH0pO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFJlbGF0aW9uc2hpcFRvR3JhcGgocmVsYXRpb25zaGlwKSA6IFJlbGF0aW9uc2hpcEVudGVyIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMuYXBwZW5kVGV4dFRvUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCk7XG4gICAgdmFyIG91dGxpbmUgPSByZWxhdGlvbnNoaXAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnb3V0bGluZScpLmF0dHIoJ2ZpbGwnLCAnI2E1YWJiNicpLmF0dHIoJ3N0cm9rZScsICdub25lJyk7XG4gICAgdmFyIG92ZXJsYXkgPSByZWxhdGlvbnNoaXAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnb3ZlcmxheScpO1xuXG4gICAgLy8gdGhpcy5yZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXA7XG4gICAgcmV0dXJuIHtcbiAgICAgIG91dGxpbmU6IG91dGxpbmUsXG4gICAgICBvdmVybGF5OiBvdmVybGF5LFxuICAgICAgcmVsYXRpb25zaGlwOiByZWxhdGlvbnNoaXAsXG4gICAgICB0ZXh0OiB0ZXh0XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZVByb3BlcnR5KHRhcmdldCwgc291cmNlKSB7XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICBjb25zdCBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICBpZihzb3VyY2VQcm9wZXJ0eSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYoIShzb3VyY2VQcm9wZXJ0eSBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgZWxzZSBpZihzb3VyY2VQcm9wZXJ0eS5sZW5ndGg+MClcbiAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB2ZXJzaW9uKCkge1xuICAgIHJldHVybiBcIjEuMC4wXCI7XG4gIH1cbn1cblxuIl19