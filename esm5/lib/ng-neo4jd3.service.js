/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
        this.drawnRelationship = {};
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
            graphContainerHeight: '100%'
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
        return "0.1.6";
    };
    // Merges All Relationships with the same nodes
    // Merges All Relationships with the same nodes
    /**
     * @private
     * @return {?}
     */
    NgNeo4jd3Service.prototype.mergeRelationshipWithSameNodes = 
    // Merges All Relationships with the same nodes
    /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var r = this.options.neo4jData.results[0].data[0].graph.relationships;
        // Check the relationship counts between 2 nodes
        /** @type {?} */
        var spliceThem = [];
        var _loop_1 = function (rIndex) {
            /** @type {?} */
            var rel = r[rIndex];
            /** @type {?} */
            var startNode = rel['startNode'];
            /** @type {?} */
            var endNode = rel['endNode'];
            /** @type {?} */
            var relationshipKey = startNode + '-' + endNode;
            /** @type {?} */
            var relationshipValue = this_1.drawnRelationship[relationshipKey];
            if (relationshipValue != undefined) {
                /** @type {?} */
                var relationshipModified_1 = {};
                /** @type {?} */
                var obj_1 = relationshipValue.obj;
                // 
                /** @type {?} */
                var keys = this_1.mergeKeys(obj_1, rel);
                keys.forEach((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) {
                    /** @type {?} */
                    var newVal = _this.assignAttributes(key, obj_1, rel);
                    if (newVal != undefined) {
                        relationshipModified_1[key] = _this.assignAttributes(key, obj_1, rel);
                    }
                }));
                relationshipValue.obj = relationshipModified_1;
                r[relationshipValue.pos] = relationshipModified_1;
                spliceThem.push(rIndex);
            }
            else {
                this_1.drawnRelationship[relationshipKey] = {
                    pos: rIndex,
                    obj: rel
                };
            }
        };
        var this_1 = this;
        for (var rIndex = 0; rIndex < r.length; rIndex++) {
            _loop_1(rIndex);
        }
        spliceThem.forEach((/**
         * @param {?} index
         * @return {?}
         */
        function (index) {
            r.splice(index, 1);
        }));
    };
    /**
     * @private
     * @param {?} obj1
     * @param {?} obj2
     * @return {?}
     */
    NgNeo4jd3Service.prototype.mergeKeys = /**
     * @private
     * @param {?} obj1
     * @param {?} obj2
     * @return {?}
     */
    function (obj1, obj2) {
        /** @type {?} */
        var keys = Object.keys(obj1);
        keys = keys.concat(Object.keys(obj2));
        return tslib_1.__spread(new Set(keys));
    };
    /**
     * @private
     * @param {?} key
     * @param {?} relationship1
     * @param {?} relationship2
     * @return {?}
     */
    NgNeo4jd3Service.prototype.assignAttributes = /**
     * @private
     * @param {?} key
     * @param {?} relationship1
     * @param {?} relationship2
     * @return {?}
     */
    function (key, relationship1, relationship2) {
        var _this = this;
        if (key === 'properties') {
            /** @type {?} */
            var prop1_1 = relationship1.properties;
            /** @type {?} */
            var prop2_1 = relationship2.properties;
            if (prop1_1 == undefined && prop2_1 == undefined) {
                return {};
            }
            else if (prop1_1 == undefined) {
                return prop2_1;
            }
            else if (prop2_1 == undefined) {
                return prop1_1;
            }
            /** @type {?} */
            var keys = this.mergeKeys(prop1_1, prop2_1);
            /** @type {?} */
            var prop_1 = {};
            keys.forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                prop_1[key] = _this.assignAttributesValue(key, prop1_1, prop2_1);
            }));
            return prop_1;
        }
        else if (key == 'target' || key == 'linknum' || key == 'startNode' || key == 'endNode') {
            return relationship1[key];
        }
        return this.assignAttributesValue(key, relationship1, relationship2);
    };
    /**
     * @private
     * @param {?} key
     * @param {?} relationship1
     * @param {?} relationship2
     * @return {?}
     */
    NgNeo4jd3Service.prototype.assignAttributesValue = /**
     * @private
     * @param {?} key
     * @param {?} relationship1
     * @param {?} relationship2
     * @return {?}
     */
    function (key, relationship1, relationship2) {
        var _this = this;
        /** @type {?} */
        var val1 = relationship1[key];
        /** @type {?} */
        var val2 = relationship2[key];
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
                    var keys = this.mergeKeys(val1, val2);
                    /** @type {?} */
                    var obj_2 = {};
                    keys.forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    function (key) {
                        obj_2[key] = _this.assignAttributesValue(key, val1, val2);
                    }));
                    return obj_2;
                }
                return val1 + ', ' + val2;
            }
        }
        return undefined;
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
    NgNeo4jd3Service.prototype.drawnRelationship;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbmVvNGpkMy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbmVvNGpkMy8iLCJzb3VyY2VzIjpbImxpYi9uZy1uZW80amQzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBRXpCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7O0FBRXREO0lBaUVFO1FBNURPLGlCQUFZLEdBQWEsS0FBSyxDQUFDO1FBQzlCLGFBQVEsR0FBYSxLQUFLLENBQUM7UUFxQjNCLG1CQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLGFBQVEsR0FBRyxTQUFTLENBQUM7UUFHckIsc0JBQWlCLEdBQUcsRUFBRSxDQUFBO1FBSXRCLFlBQU8sR0FBc0I7WUFDakMsU0FBUyxFQUFFLENBQUM7WUFDWixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyQixTQUFTLEVBQUUsU0FBUztZQUNwQixLQUFLLEVBQUUsU0FBUztZQUNoQixPQUFPLEVBQUUsRUFBRTs7WUFDWCxRQUFRLEVBQUUsRUFBRTtZQUNaLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsWUFBWSxFQUFFLFNBQVM7WUFDdkIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsWUFBWSxFQUFFLFNBQVM7WUFDdkIsb0JBQW9CLEVBQUUsU0FBUztZQUMvQixVQUFVLEVBQUUsRUFBRTtZQUNkLGlCQUFpQixFQUFFLFNBQVM7WUFDNUIsT0FBTyxFQUFFLEtBQUs7WUFDZCxTQUFTLEVBQUUsSUFBSTtZQUNmLGlCQUFpQixFQUFFLFNBQVM7WUFDNUIsV0FBVyxFQUFFLFNBQVM7WUFDdEIsZ0JBQWdCLEVBQUUsU0FBUztZQUMzQixnQkFBZ0IsRUFBRSxTQUFTO1lBQzNCLHlCQUF5QixFQUFFLFNBQVM7WUFDcEMsYUFBYSxFQUFFLFNBQVM7WUFDeEIsZUFBZSxFQUFFLFNBQVM7WUFDMUIsb0JBQW9CLEVBQUUsTUFBTTtTQUMvQixDQUFDO0lBR2EsQ0FBQzs7Ozs7O0lBRVQsb0NBQVM7Ozs7O0lBQWhCLFVBQWtCLFNBQVMsRUFBRSxRQUFZO1FBQ3JDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7Ozs7SUFFTSxxQ0FBVTs7O0lBQWpCO1FBQ0ksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7Ozs7SUFFTSwwQ0FBZTs7O0lBQXRCO1FBQ0ksT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7Ozs7SUFFTSx1Q0FBWTs7O0lBQW5CO1FBQ0ksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7Ozs7SUFHTSwrQkFBSTs7O0lBQVg7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVwRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQzFCLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO1NBQ3ZDO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDakM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7WUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQzthQUNoQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFaEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV4QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN4QjthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7WUFDbEMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDeEQ7YUFBTTtZQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUN0RTtRQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDOzs7O0lBRU0seUNBQWM7OztJQUFyQjs7WUFFUSxPQUFPLEdBQUcsSUFBSTs7WUFFZCxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxhQUFhO1FBQ2pELElBQUcsYUFBYSxJQUFFLFNBQVMsSUFBSSxhQUFhLENBQUMsYUFBYSxJQUFFLFNBQVMsRUFBRTtZQUNuRSxPQUFPO1NBQ1Y7O1lBRUssV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsQ0FBQzs7WUFDekUsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEdBQUcsQ0FBQzs7WUFFN0UsVUFBVSxHQUFHLEVBQUUsQ0FBQyxlQUFlLEVBQUU7WUFDakMsc0JBQXNCO1lBQ3RCLDBDQUEwQztZQUMxQywwQ0FBMEM7YUFDekMsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTTs7OztRQUFDLFVBQVMsQ0FBQztZQUNqRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ3hDLENBQUMsRUFBQzthQUNELFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNkLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQ25DLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUU7Ozs7UUFBQyxVQUFTLENBQUM7WUFDdkMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2hCLENBQUMsRUFBQyxDQUFDO2FBQ0YsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQzthQUMxRCxFQUFFLENBQUMsTUFBTTs7O1FBQUU7WUFDUixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkIsQ0FBQyxFQUFDO2FBQ0QsRUFBRSxDQUFDLEtBQUs7OztRQUFFO1lBQ1AsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQ2xELG9CQUFvQjthQUNyQjtRQUNMLENBQUMsRUFBQztRQUNOLE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7Ozs7O0lBRU0sc0NBQVc7Ozs7SUFBbEIsVUFBbUIsU0FBUzs7WUFDcEIsT0FBTyxHQUFzQixJQUFJOztZQUNqQyxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDckIsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7YUFDckIsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDO2FBQ3BELElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDO2FBQzlCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07OztRQUFFOztnQkFDbkIsS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7O2dCQUM1QixTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBRTVELElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDdEIsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzNDO1lBRUQsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUNsQixLQUFLLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQzthQUM3QjtZQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNoSCxDQUFDLEVBQUMsQ0FBQzthQUNGLEVBQUUsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDO2FBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQzthQUNyQixJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7SUFFTSwwQ0FBZTs7OztJQUF0QixVQUF1QixTQUFTO1FBQzVCLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDakIsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7Ozs7OztJQUVNLDRDQUFpQjs7Ozs7OztJQUF4QixVQUF5QixHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFVO1FBQVYsc0JBQUEsRUFBQSxZQUFVOztZQUNsRCxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBRWhDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQzthQUNyQixJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQzthQUNsQixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsR0FBRyxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTNFLElBQUksQ0FBQyxLQUFLLEVBQUU7O2dCQUNKLE9BQU8sR0FBc0IsSUFBSTtZQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQjs7OztZQUFFLFVBQVMsQ0FBQztnQkFDckMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDM0osQ0FBQyxFQUFDO2lCQUNELEtBQUssQ0FBQyxjQUFjOzs7O1lBQUUsVUFBUyxDQUFDO2dCQUM3QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7WUFDbE0sQ0FBQyxFQUFDO2lCQUNELEtBQUssQ0FBQyxPQUFPOzs7O1lBQUUsVUFBUyxDQUFDO2dCQUN0QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUMzSCxDQUFDLEVBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQzs7Ozs7O0lBRU0saURBQXNCOzs7OztJQUE3QixVQUE4QixHQUFHLEVBQUUsSUFBSTtRQUNuQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7Ozs7O0lBRU0sb0RBQXlCOzs7Ozs7SUFBaEMsVUFBaUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLO1FBQ2pELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RCxDQUFDOzs7Ozs7SUFFTSx3REFBNkI7Ozs7O0lBQXBDLFVBQXFDLEdBQUcsRUFBRSxZQUFZO1FBQ2xELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3JELENBQUM7Ozs7SUFFTSxxQ0FBVTs7O0lBQWpCOztZQUNRLE9BQU8sR0FBc0IsSUFBSTtRQUNyQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsT0FBTzs7OztRQUFFLFVBQVMsQ0FBQzs7Z0JBQ2pCLE9BQU8sR0FBRyxNQUFNO1lBQ3BCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDakIsT0FBTyxJQUFJLFlBQVksQ0FBQzthQUMzQjtZQUNELElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbEIsT0FBTyxJQUFJLGFBQWEsQ0FBQzthQUM1QjtZQUNELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7Z0JBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O3dCQUNqRCxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUU5QyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLENBQUMsS0FBSyxFQUFFO3dCQUN6RixPQUFPLElBQUksbUJBQW1CLENBQUM7d0JBQy9CLE1BQU07cUJBQ1Q7aUJBQ0o7YUFDSjtZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUMsRUFBQzthQUNELEVBQUUsQ0FBQyxPQUFPOzs7O1FBQUUsVUFBUyxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDbkIsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxTQUFTLEVBQUc7Z0JBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xDO1FBQ04sQ0FBQyxFQUFDO2FBQ0QsRUFBRSxDQUFDLFVBQVU7Ozs7UUFBRSxVQUFTLENBQUM7WUFDdEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLElBQUksU0FBUyxFQUFHO2dCQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3hDO1FBQ04sQ0FBQyxFQUFDO2FBQ0QsRUFBRSxDQUFDLFlBQVk7Ozs7UUFBRSxVQUFTLENBQUM7WUFDdkIsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekI7WUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLElBQUksU0FBUyxFQUFHO2dCQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZDO1FBQ04sQ0FBQyxFQUFDO2FBQ0QsRUFBRSxDQUFDLFlBQVk7Ozs7UUFBRSxVQUFTLENBQUM7WUFDdkIsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUN2QjtZQUNELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxTQUFTLEVBQUc7Z0JBQ2hELE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkM7UUFDTixDQUFDLEVBQUM7YUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRTthQUNOLEVBQUUsQ0FBQyxPQUFPOzs7O1FBQUcsVUFBUyxDQUFDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTthQUN0RCxFQUFFLENBQUMsTUFBTTs7OztRQUFFLFVBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7YUFDaEQsRUFBRSxDQUFDLEtBQUs7Ozs7UUFBRSxVQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQztJQUN4RSxDQUFDOzs7O0lBRU0sNENBQWlCOzs7SUFBeEI7O1lBQ1EsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1QjtRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDckIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDOzs7OztJQUVNLDhDQUFtQjs7OztJQUExQixVQUEyQixJQUFJOztZQUN2QixPQUFPLEdBQUcsSUFBSTs7WUFDZCxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU87UUFDMUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQzthQUNwQixJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQzthQUN4QixJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUM7YUFDN0IsS0FBSyxDQUFDLE1BQU07Ozs7UUFBRSxVQUFTLENBQUM7WUFDckIsT0FBTyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUcsQ0FBQyxFQUFDO2FBQ0QsS0FBSyxDQUFDLFFBQVE7Ozs7UUFBRSxVQUFTLENBQUM7WUFDdkIsT0FBTyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzSSxDQUFDLEVBQUM7YUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSTs7OztRQUFDLFVBQVMsQ0FBQztZQUMzQixPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxFQUFDLENBQUM7SUFDZCxDQUFDOzs7OztJQUVNLHNDQUFXOzs7O0lBQWxCLFVBQW1CLEdBQUc7O1lBQ2QsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDUixxRkFBcUY7WUFDckYsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDakMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7Ozs7SUFFTSw0Q0FBaUI7Ozs7SUFBeEIsVUFBeUIsR0FBRzs7WUFDcEIsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO1FBQ3RDLElBQUk7OztnQkFFSSxXQUFXLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDcEMsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTSxHQUFHLEVBQUUsR0FBRTtJQUNqQixDQUFDOzs7OztJQUVNLDJDQUFnQjs7OztJQUF2QixVQUF3QixJQUFJOztZQUNwQixPQUFPLEdBQUcsSUFBSTtRQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO2FBQ3ZCLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO2FBQ3JCLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2FBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJOzs7O1FBQUMsVUFBUyxDQUFDO1lBQ2hDLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7O0lBR00sNENBQWlCOzs7O0lBQXhCLFVBQXlCLElBQUk7O1lBQ3JCLE9BQU8sR0FBRyxJQUFJO1FBQ2xCLDhDQUE4QztRQUM5Qyw2REFBNkQ7UUFDN0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO2FBQzlDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQzthQUM1RCxJQUFJLENBQUMsWUFBWTs7OztRQUFFLFVBQVMsQ0FBQyxJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO1FBQ2pFLENBQUM7SUFDSixDQUFDOzs7OztJQUVNLDJDQUFnQjs7OztJQUF2QixVQUF3QixJQUFJOztZQUNwQixPQUFPLEdBQUcsSUFBSTtRQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQ3JCLElBQUksQ0FBQyxPQUFPOzs7O1FBQUUsVUFBUyxDQUFDLElBQUksT0FBTyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO2FBQ2hGLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO2FBQ3JCLElBQUksQ0FBQyxXQUFXOzs7O1FBQUUsVUFBUyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7YUFDOUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQzthQUM5QixJQUFJLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQzthQUM3QixJQUFJLENBQUMsR0FBRzs7OztRQUFFLFVBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO2FBQ3RFLElBQUksQ0FBQyxHQUFHOzs7O1FBQUUsVUFBUyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7YUFDdEUsSUFBSSxDQUFDLE9BQU87Ozs7UUFBRSxVQUFTLENBQUM7O2dCQUNmLEdBQUcsR0FBRyx1REFBdUQ7WUFDbkUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0QyxDQUFDLEVBQUM7YUFDRCxJQUFJOzs7O1FBQUMsVUFBUyxDQUFDOztnQkFDUixLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0IsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDeEMsQ0FBQyxFQUFDLENBQUM7SUFDWCxDQUFDOzs7Ozs7SUFFTSxpREFBc0I7Ozs7O0lBQTdCLFVBQThCLENBQUMsRUFBRSxrQkFBa0I7O1lBQzNDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7OztJQUVNLDZDQUFrQjs7O0lBQXpCOztZQUNRLE9BQU8sR0FBc0IsSUFBSTs7O1lBRS9CLGFBQWE7Ozs7UUFBRyxVQUFTLENBQUs7WUFDaEMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLHlCQUF5QixJQUFJLFNBQVMsRUFBRztnQkFDekQsT0FBTyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoRDtRQUNMLENBQUMsQ0FBQTs7O1lBRUssWUFBWTs7OztRQUFHLFVBQVMsQ0FBSztZQUMvQixJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6QjtRQUNMLENBQUMsQ0FBQTtRQUNELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDNUksQ0FBQzs7OztJQUVNLG9DQUFTOzs7SUFBaEI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2QixDQUFDOzs7O0lBRU0sZ0NBQUs7OztJQUFaO1FBQ0ksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7Ozs7SUFFTSxpQ0FBTTs7O0lBQWI7UUFDSSx1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLE9BQU87WUFDSCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVMsQ0FBRSxPQUFPO1NBQ3JCLENBQUM7SUFDTixDQUFDOzs7Ozs7SUFFTSx5Q0FBYzs7Ozs7SUFBckIsVUFBc0IsS0FBSyxFQUFFLEVBQUU7O1lBQ3ZCLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTTs7OztRQUFDLFVBQVMsSUFBSTtZQUNuQyxPQUFPLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQzFCLENBQUMsRUFBQztRQUNGLE9BQU8sTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7OztJQUVNLHVDQUFZOzs7SUFBbkI7UUFDQSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7SUFDdEMsQ0FBQzs7OztJQUVNLDZDQUFrQjs7O0lBQXpCOztZQUNRLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3BFLElBQUk7OztnQkFFSSxXQUFXLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDcEMsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTSxHQUFHLEVBQUUsR0FBRztJQUNsQixDQUFDOzs7OztJQUVNLG9DQUFTOzs7O0lBQWhCLFVBQWlCLENBQUM7UUFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEM7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLFNBQVMsRUFBRztZQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQztJQUNMLENBQUM7Ozs7O0lBRU0sa0NBQU87Ozs7SUFBZCxVQUFlLENBQUM7UUFDWixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7Ozs7O0lBRU0sc0NBQVc7Ozs7SUFBbEIsVUFBbUIsQ0FBQztRQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDOUM7UUFDRCxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxJQUFJLFNBQVMsRUFBRztZQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQztJQUNMLENBQUM7Ozs7OztJQUVNLGlDQUFNOzs7OztJQUFiLFVBQWMsSUFBSSxFQUFFLElBQUk7O1lBQ2xCLEdBQUcsR0FBRyxFQUFFO1FBQ1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDOzs7OztJQUdNLCtCQUFJOzs7O0lBQVgsVUFBWSxDQUFDOztZQUNQLElBQUk7UUFFUixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ3RFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUMxRixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEU7aUJBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDNUM7aUJBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUM7U0FDSjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7SUFFTSxnQ0FBSzs7OztJQUFaLFVBQWEsQ0FBQzs7WUFDUixDQUFDOztZQUFFLGNBQWM7O1lBQUUsR0FBRzs7WUFBRSxRQUFROztZQUFFLEtBQUs7O1lBQUUsa0JBQWtCOztZQUFFLFFBQVE7O1lBQUUsS0FBSztRQUVoRixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFOztnQkFDZixNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHO1lBQ3JELGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUvQyxJQUFJLGNBQWMsRUFBRTtnQkFDaEIsUUFBUSxHQUFHLENBQUMsQ0FBQztnQkFFYixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3hDLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRWxELFFBQVEsa0JBQWtCLENBQUMsTUFBTSxFQUFFO3dCQUMvQixLQUFLLENBQUM7NEJBQ04sS0FBSyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5QixtQkFBbUI7d0JBQ25CLEtBQUssQ0FBQzs0QkFDTixRQUFRLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pDLG1CQUFtQjt3QkFDbkIsS0FBSyxDQUFDOzRCQUNOLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDakM7b0JBRUQsSUFBSSxNQUFNLEtBQUssS0FBSzt3QkFDaEIsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsQ0FBQzt3QkFDbkQsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO3dCQUM5QyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxRQUFRLEVBQUU7NEJBQ3RDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDN0MsUUFBUSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQzt5QkFDeEM7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKO1FBRUQsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDOzs7O0lBRU0sd0NBQWE7OztJQUFwQjtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Ozs7O0lBRU0sK0NBQW9COzs7O0lBQTNCLFVBQTRCLFlBQVk7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFFeEIsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZOzs7OztRQUFFLFVBQVMsS0FBSyxFQUFFLElBQUk7WUFDdEMsSUFBSSxLQUFLLEVBQUU7Z0JBQ1AsTUFBTSxLQUFLLENBQUM7YUFDZjtZQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBRU0sNENBQWlCOzs7O0lBQXhCLFVBQXlCLElBQUk7O1lBQ3ZCLEtBQUssR0FBRztZQUNSLEtBQUssRUFBRSxFQUFFO1lBQ1QsYUFBYSxFQUFFLEVBQUU7U0FDcEI7O1lBRUcsT0FBTyxHQUFzQixJQUFJO1FBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTzs7OztRQUFDLFVBQVMsTUFBTTtZQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU87Ozs7WUFBQyxVQUFTLElBQUk7Z0JBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU87Ozs7Z0JBQUMsVUFBUyxJQUFJO29CQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTt3QkFDL0MsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQzFCO2dCQUNMLENBQUMsRUFBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU87Ozs7Z0JBQUMsVUFBUyxZQUFZO29CQUNsRCxZQUFZLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7b0JBQzdDLFlBQVksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQztvQkFDM0MsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzNDLENBQUMsRUFBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUk7Ozs7O2dCQUFDLFVBQVMsQ0FBQyxFQUFFLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO3dCQUNyQixPQUFPLENBQUMsQ0FBQztxQkFDWjt5QkFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTt3QkFDNUIsT0FBTyxDQUFDLENBQUMsQ0FBQztxQkFDYjt5QkFBTTt3QkFDSCxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTs0QkFDckIsT0FBTyxDQUFDLENBQUM7eUJBQ1o7d0JBRUQsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUU7NEJBQ3JCLE9BQU8sQ0FBQyxDQUFDLENBQUM7eUJBQ2I7NkJBQU07NEJBQ0gsT0FBTyxDQUFDLENBQUM7eUJBQ1o7cUJBQ0o7Z0JBQ0wsQ0FBQyxFQUFDLENBQUM7Z0JBRUgsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO3dCQUN2SyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7cUJBQ3JGO3lCQUFNO3dCQUNILElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7cUJBQzNDO2lCQUNKO1lBQ0wsQ0FBQyxFQUFDLENBQUM7UUFDUCxDQUFDLEVBQUMsQ0FBQztRQUVILE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7SUFFTSxtQ0FBUTs7OztJQUFmLFVBQWdCLENBQUM7O1lBQ1gsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ3ZDLENBQUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBUyxRQUFRO1lBQy9DLENBQUMsSUFBSSxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN6RSxDQUFDLEVBQUMsQ0FBQztRQUNILENBQUMsSUFBSSxHQUFHLENBQUM7UUFDVCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7Ozs7OztJQUVNLHVDQUFZOzs7OztJQUFuQixVQUFvQixDQUFDLEVBQUUsa0JBQWtCOztZQUNuQyxJQUFJLEdBQUc7WUFDUCxLQUFLLEVBQUUsRUFBRTtZQUNULGFBQWEsRUFBRSxFQUFFO1NBQ3BCOztZQUVHLFFBQVEsR0FBRyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDOztZQUN4RCxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRTtRQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFOzs7Z0JBRTNCLEtBQUssR0FBRyxPQUFPOzs7Z0JBRWYsSUFBSSxHQUFHO2dCQUNULEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNuQixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBQ2YsVUFBVSxFQUFFO29CQUNSLE1BQU0sRUFBRSxLQUFLO2lCQUNoQjtnQkFDRCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ1Q7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDOztnQkFFL0IsWUFBWSxHQUFHO2dCQUNqQixFQUFFLEVBQUUsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUU7Z0JBQ3pCLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDZixPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDeEIsVUFBVSxFQUFFO29CQUNSLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2lCQUNuQjtnQkFDRCxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxDQUFDO2FBQ25DO1lBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQztTQUM5RDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7OztJQUVNLCtCQUFJOzs7SUFBWDtRQUNFLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1lBQ3hCLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU07U0FDekMsQ0FBQztJQUNKLENBQUM7Ozs7O0lBRU0sb0NBQVM7Ozs7SUFBaEIsVUFBaUIsQ0FBQztRQUNoQixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQzs7OztJQUVNLCtCQUFJOzs7SUFBWDtRQUNFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDOzs7O0lBRU0sb0NBQVM7OztJQUFoQjtRQUNFLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7Ozs7WUFBRSxVQUFTLENBQUM7Z0JBQ3BDLElBQUcsQ0FBQyxJQUFFLFNBQVM7b0JBQ1gsT0FBTyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7O29CQUMzQyxHQUFHLEdBQUcsNENBQTRDO2dCQUN4RCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7O0lBRU0sNENBQWlCOzs7SUFBeEI7UUFDRSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7O2dCQUNmLFNBQU8sR0FBRyxJQUFJO1lBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVc7Ozs7WUFBRSxVQUFTLENBQUM7Z0JBQzVDLElBQUcsQ0FBQyxJQUFFLFNBQVMsRUFBRTs7d0JBQ1gsS0FBSyxHQUFHLFNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO29CQUNoRCxJQUFHLENBQUMsQ0FBQyxNQUFNLElBQUUsU0FBUyxFQUFFO3dCQUN0QixPQUFPLFlBQVksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7cUJBQ2xGO2lCQUNGOztvQkFDSyxHQUFHLEdBQUcsb0RBQW9EO2dCQUNoRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXZCLENBQUMsRUFBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7U0FDbEM7SUFDSCxDQUFDOzs7O0lBRU0sb0RBQXlCOzs7SUFBaEM7O1lBQ00sT0FBTyxHQUFzQixJQUFJO1FBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSTs7Ozs7O1FBQUUsVUFBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLENBQUM7O2dCQUN6QyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7Z0JBQ2QsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztnQkFDcEIsT0FBTztZQUNYLElBQUk7Z0JBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7YUFBQztZQUN2QyxPQUFNLEdBQUcsRUFBRTtnQkFBRSxPQUFPO2FBQUU7O2dCQUVsQixJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFFOUIsSUFBSTs7b0JBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7YUFBRTtZQUN2QyxPQUFNLEdBQUcsRUFBRTtnQkFBRSxPQUFPO2FBQUU7O2dCQUVsQixPQUFPLEdBQUcsQ0FBQztZQUVmLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRzs7OztZQUFFLFVBQVMsQ0FBQztnQkFDMUIsSUFBSTs7d0JBQ0EsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPOzt3QkFDekIsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFOzt3QkFDekIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDOzt3QkFDNUMsZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7O3dCQUN2QyxXQUFXLEdBQUcsQ0FBQzs7d0JBQ2YsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDOzt3QkFDN0MsVUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUU7O3dCQUNuTCxDQUFDLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7d0JBQ25ELGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ2pLLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ3JHLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDekYsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDckksY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDekosY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ2pQLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUNqUSxjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDakwsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ3pQLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ3JPLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDO29CQUUvSSxPQUFPLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQzt3QkFDckQsS0FBSyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFD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QWM7Ozs7O0lBRWQsd0NBQXFCOzs7OztJQUNyQix5Q0FBbUM7Ozs7O0lBQ25DLCtDQUE0Qjs7Ozs7SUFDNUIsK0NBQTRCOzs7OztJQUM1Qiw0Q0FBeUI7Ozs7O0lBRXpCLHNDQUFtQjs7SUFFbkIsK0JBQVc7Ozs7O0lBQ1gsb0NBQWlCOzs7OztJQUNqQiw0Q0FBeUI7Ozs7O0lBQ3pCLHdDQUFxQjs7Ozs7SUFFckIsMENBQTRCOzs7OztJQUM1QixzQ0FBMkI7Ozs7O0lBQzNCLHNDQUF1Qjs7Ozs7SUFDdkIsb0NBQTZCOzs7OztJQUU3QixpQ0FBYzs7Ozs7SUFDZCw2Q0FBOEI7Ozs7O0lBRTlCLHdDQUE4Qjs7Ozs7SUFFOUIsbUNBeUJFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xuaW1wb3J0IHsgTmdOZW80akQzT3B0aW9ucywgUmVsYXRpb25zaGlwRW50ZXIgfSBmcm9tICcuL25nLW5lbzRqZDMubW9kZWwnO1xuaW1wb3J0IHsgTmdOZW80akQzSWNvbnMgfSBmcm9tICcuL25nLW5lbzRqZDMuaWNvbnMnO1xuaW1wb3J0IHsgTmVvNGpEM1JlY29yZHMgfSBmcm9tIFwiLi9uZy1uZW80amQzLnJlY29yZHNcIjtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdOZW80amQzU2VydmljZSB7XG5cbiAgcHVibGljIG91dE9mQ29udGV4dCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB2YWx1ZVNldCA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIGNvbnRhaW5lcjtcbiAgcHJpdmF0ZSBjb250YWluZXJJZGVudGl0eTtcbiAgcHJpdmF0ZSBpbmZvO1xuICBwcml2YXRlIG5vZGU7XG4gIHByaXZhdGUgbm9kZXM7XG5cbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXA7XG4gIHByaXZhdGUgcmVsYXRpb25zaGlwcyA6IEFycmF5PGFueT47XG4gIHByaXZhdGUgcmVsYXRpb25zaGlwT3V0bGluZTtcbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXBPdmVybGF5O1xuICBwcml2YXRlIHJlbGF0aW9uc2hpcFRleHQ7XG5cbiAgcHJpdmF0ZSBzaW11bGF0aW9uO1xuXG4gIHB1YmxpYyBzdmc7XG4gIHByaXZhdGUgc3ZnTm9kZXM7XG4gIHByaXZhdGUgc3ZnUmVsYXRpb25zaGlwcztcbiAgcHJpdmF0ZSBzdmdUcmFuc2xhdGU7XG4gIFxuICBwcml2YXRlIGNsYXNzZXMyY29sb3JzID0ge307XG4gIHByaXZhdGUganVzdExvYWRlZCA9IGZhbHNlO1xuICBwcml2YXRlIG51bUNsYXNzZXMgPSAwO1xuICBwcml2YXRlIHN2Z1NjYWxlID0gdW5kZWZpbmVkO1xuXG4gIHByaXZhdGUgbGFiZWw7XG4gIHByaXZhdGUgZHJhd25SZWxhdGlvbnNoaXAgPSB7fVxuXG4gIHByaXZhdGUgb3B0aW9uc0lucHV0IDogT2JqZWN0O1xuXG4gIHByaXZhdGUgb3B0aW9ucyA6IE5nTmVvNGpEM09wdGlvbnMgPSB7XG4gICAgICBhcnJvd1NpemU6IDQsXG4gICAgICBjb2xvcnM6IHRoaXMuY29sb3JzKCksXG4gICAgICBoaWdobGlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgIGljb25zOiB1bmRlZmluZWQsXG4gICAgICBpY29uTWFwOiBbXSwgICAgLy8gVGhpcyB2YWx1ZSBhc3NpZ25lZCBpbiBOZW80alJhbmRvbVxuICAgICAgaW1hZ2VNYXA6IHt9LFxuICAgICAgaW1hZ2VzOiB1bmRlZmluZWQsXG4gICAgICBpbmZvUGFuZWw6IHRydWUsXG4gICAgICBtaW5Db2xsaXNpb246IHVuZGVmaW5lZCxcbiAgICAgIG5lbzRqRGF0YTogdW5kZWZpbmVkLFxuICAgICAgbmVvNGpEYXRhVXJsOiB1bmRlZmluZWQsXG4gICAgICBub2RlT3V0bGluZUZpbGxDb2xvcjogdW5kZWZpbmVkLFxuICAgICAgbm9kZVJhZGl1czogMjUsXG4gICAgICByZWxhdGlvbnNoaXBDb2xvcjogJyNhNWFiYjYnLFxuICAgICAgem9vbUZpdDogZmFsc2UsXG4gICAgICBzaG93SWNvbnM6IHRydWUsXG4gICAgICBvbk5vZGVEb3VibGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZU1vdXNlRW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZU1vdXNlTGVhdmU6IHVuZGVmaW5lZCxcbiAgICAgIG9uUmVsYXRpb25zaGlwRG91YmxlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZURyYWdFbmQ6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZURyYWdTdGFydDogdW5kZWZpbmVkLFxuICAgICAgZ3JhcGhDb250YWluZXJIZWlnaHQ6ICcxMDAlJ1xuICB9O1xuXG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHB1YmxpYyBzZXRWYWx1ZXMgKF9zZWxlY3RvciwgX29wdGlvbnM6YW55KSA6IHZvaWQge1xuICAgICAgbmV3IE5nTmVvNGpEM0ljb25zKHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLmNvbnRhaW5lcklkZW50aXR5ID0gX3NlbGVjdG9yO1xuICAgICAgdGhpcy5vcHRpb25zSW5wdXQgPSBfb3B0aW9ucztcbiAgICAgIHRoaXMudmFsdWVTZXQgPSB0cnVlO1xuICB9XG5cbiAgcHVibGljIGlzVmFsdWVTZXQoKSA6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVTZXQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0T3B0aW9uc0lucHV0KCkgOiBPYmplY3Qge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc0lucHV0O1xuICB9XG5cbiAgcHVibGljIGdldENvbnRhaW5lcigpIDogT2JqZWN0IHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcbiAgfVxuXG5cbiAgcHVibGljIGluaXQoKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBkMy5zZWxlY3QodGhpcy5jb250YWluZXJJZGVudGl0eSk7XG4gICAgdGhpcy5pbml0SWNvbk1hcCh0aGlzLm9wdGlvbnMpO1xuXG4gICAgdGhpcy5tZXJnZVByb3BlcnR5KHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25zSW5wdXQpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5uZW80akRhdGEpIHtcbiAgICAgIHRoaXMubWVyZ2VSZWxhdGlvbnNoaXBXaXRoU2FtZU5vZGVzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pY29ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2hvd0ljb25zID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5taW5Db2xsaXNpb24pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLm1pbkNvbGxpc2lvbiA9IHRoaXMub3B0aW9ucy5ub2RlUmFkaXVzICogMjtcbiAgICB9XG4gICAgdGhpcy5pbml0SW1hZ2VNYXAodGhpcy5vcHRpb25zKTtcblxuICAgIHRoaXMuY29udGFpbmVyLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMnKVxuICAgICAgICAgIC5odG1sKCcnKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaW5mb1BhbmVsKSB7XG4gICAgICAgIHRoaXMuaW5mbyA9IHRoaXMuYXBwZW5kSW5mb1BhbmVsKHRoaXMuY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLnN2ZyA9IHRoaXMuYXBwZW5kR3JhcGgodGhpcy5jb250YWluZXIpO1xuXG4gICAgdGhpcy5zaW11bGF0aW9uID0gdGhpcy5pbml0U2ltdWxhdGlvbigpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5uZW80akRhdGEpIHtcbiAgICAgICAgdGhpcy5sb2FkTmVvNGpEYXRhKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMubmVvNGpEYXRhVXJsKSB7XG4gICAgICAgIHRoaXMubG9hZE5lbzRqRGF0YUZyb21VcmwodGhpcy5vcHRpb25zLm5lbzRqRGF0YVVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IGJvdGggbmVvNGpEYXRhIGFuZCBuZW80akRhdGFVcmwgYXJlIGVtcHR5IScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgaW5pdFNpbXVsYXRpb24oKSB7XG5cbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcblxuICAgICAgdmFyIHBhcmVudEVsZW1lbnQgPSB0aGlzLnN2Zy5ub2RlKCkucGFyZW50RWxlbWVudDtcbiAgICAgIGlmKHBhcmVudEVsZW1lbnQ9PXVuZGVmaW5lZCB8fCBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ9PXVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2xpZW50V2lkdGggPSB0aGlzLnN2Zy5ub2RlKCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMjtcbiAgICAgIGNvbnN0IGNsaWVudEhlaWdodCA9IHRoaXMuc3ZnLm5vZGUoKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMjtcblxuICAgICAgdmFyIHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oKSBcbiAgICAgICAgICAvLyAudmVsb2NpdHlEZWNheSgwLjgpXG4gICAgICAgICAgLy8gLmZvcmNlKCd4JywgZDMuZm9yY2UoKS5zdHJlbmd0aCgwLjAwMikpXG4gICAgICAgICAgLy8gLmZvcmNlKCd5JywgZDMuZm9yY2UoKS5zdHJlbmd0aCgwLjAwMikpXG4gICAgICAgICAgLmZvcmNlKCdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKCkucmFkaXVzKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoub3B0aW9ucy5taW5Db2xsaXNpb247XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuaXRlcmF0aW9ucygyKSlcbiAgICAgICAgICAuZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHkoKSlcbiAgICAgICAgICAuZm9yY2UoJ2xpbmsnLCBkMy5mb3JjZUxpbmsoKS5pZChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkLmlkO1xuICAgICAgICAgIH0pKVxuICAgICAgICAgIC5mb3JjZSgnY2VudGVyJywgZDMuZm9yY2VDZW50ZXIoY2xpZW50V2lkdGgsIGNsaWVudEhlaWdodCkpXG4gICAgICAgICAgLm9uKCd0aWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHRoaXNPYmoudGljaygpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy56b29tRml0ICYmICF0aGlzT2JqLmp1c3RMb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBGT1IgQ1VTVE9NSVpBVElPTlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICByZXR1cm4gc2ltdWxhdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRHcmFwaChjb250YWluZXIpIHtcbiAgICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgICB2YXIgc3ZnID0gY29udGFpbmVyLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpc09iai5vcHRpb25zLmdyYXBoQ29udGFpbmVySGVpZ2h0KVxuICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbmVvNGpkMy1ncmFwaCcpXG4gICAgICAgICAgICAgICAgIC5jYWxsKGQzLnpvb20oKS5vbignem9vbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gZDMuZXZlbnQudHJhbnNmb3JtLmssXG4gICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlID0gW2QzLmV2ZW50LnRyYW5zZm9ybS54LCBkMy5ldmVudC50cmFuc2Zvcm0ueV07XG5cbiAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLnN2Z1RyYW5zbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVswXSArPSB0aGlzT2JqLnN2Z1RyYW5zbGF0ZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVbMV0gKz0gdGhpc09iai5zdmdUcmFuc2xhdGVbMV07XG4gICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLnN2Z1NjYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGUgKj0gdGhpc09iai5zdmdTY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5zdmcuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgdHJhbnNsYXRlWzBdICsgJywgJyArIHRyYW5zbGF0ZVsxXSArICcpIHNjYWxlKCcgKyBzY2FsZSArICcpJyk7XG4gICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAub24oJ2RibGNsaWNrLnpvb20nLCBudWxsKVxuICAgICAgICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgJzEwMCUnKTtcblxuICAgICAgICAgICAgICAgICAgdGhpcy5zdmdSZWxhdGlvbnNoaXBzID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3JlbGF0aW9uc2hpcHMnKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3ZnTm9kZXMgPSBzdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnbm9kZXMnKTtcbiAgICAgIHJldHVybiBzdmc7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb1BhbmVsKGNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbmVvNGpkMy1pbmZvJyk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCBpc05vZGUsIHByb3BlcnR5LCB2YWx1ZT1udWxsKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuaW5mby5hcHBlbmQoJ2EnKTtcblxuICAgICAgZWxlbS5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgY2xzKVxuICAgICAgLmh0bWwoJzxzdHJvbmc+JyArIHByb3BlcnR5ICsgJzwvc3Ryb25nPicgKyAodmFsdWUgPyAoJzogJyArIHZhbHVlKSA6ICcnKSk7XG5cbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgICAgICAgIGVsZW0uc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyB0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgOiAoaXNOb2RlID8gdGhpc09iai5jbGFzczJjb2xvcihwcm9wZXJ0eSkgOiB0aGlzT2JqLmRlZmF1bHRDb2xvcigpKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnYm9yZGVyLWNvbG9yJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcih0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IpIDogKGlzTm9kZSA/IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3IocHJvcGVydHkpIDogdGhpc09iai5kZWZhdWx0RGFya2VuQ29sb3IoKSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ2NvbG9yJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcih0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IpIDogJyNmZmYnO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9FbGVtZW50Q2xhc3MoY2xzLCBub2RlKSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50KGNscywgdHJ1ZSwgbm9kZSk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eShjbHMsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudChjbHMsIGZhbHNlLCBwcm9wZXJ0eSwgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9FbGVtZW50UmVsYXRpb25zaGlwKGNscywgcmVsYXRpb25zaGlwKSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50KGNscywgZmFsc2UsIHJlbGF0aW9uc2hpcCk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kTm9kZSgpIHtcbiAgICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlLmVudGVyKClcbiAgICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgIHZhciBjbGFzc2VzID0gJ25vZGUnO1xuICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5pY29uKGQpKSB7XG4gICAgICAgICAgICAgICAgICAgICBjbGFzc2VzICs9ICcgbm9kZS1pY29uJztcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5pbWFnZShkKSkge1xuICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaW1hZ2UnO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMuaGlnaGxpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXNPYmoub3B0aW9ucy5oaWdobGlnaHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoaWdobGlnaHQgPSB0aGlzT2JqLm9wdGlvbnMuaGlnaGxpZ2h0W2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQubGFiZWxzWzBdID09PSBoaWdobGlnaHQuY2xhc3MgJiYgZC5wcm9wZXJ0aWVzW2hpZ2hsaWdodC5wcm9wZXJ0eV0gPT09IGhpZ2hsaWdodC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzICs9ICcgbm9kZS1oaWdobGlnaHRlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NlcztcbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICBkLmZ4ID0gZC5meSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uTm9kZUNsaWNrICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25Ob2RlQ2xpY2soZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICB0aGlzT2JqLnN0aWNrTm9kZShkKTtcbiAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vbk5vZGVEb3VibGVDbGljayAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uTm9kZURvdWJsZUNsaWNrKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouaW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoudXBkYXRlSW5mbyhkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25Ob2RlTW91c2VFbnRlciAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uTm9kZU1vdXNlRW50ZXIoZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5pbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5jbGVhckluZm8oKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25Ob2RlTW91c2VMZWF2ZSAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uTm9kZU1vdXNlTGVhdmUoZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAuY2FsbChkMy5kcmFnKClcbiAgICAgICAgICAgICAgICAgICAgIC5vbignc3RhcnQnLCAgZnVuY3Rpb24oZCkgeyB0aGlzT2JqLmRyYWdTdGFydGVkKGQpOyB9IClcbiAgICAgICAgICAgICAgICAgICAgIC5vbignZHJhZycsIGZ1bmN0aW9uKGQpIHsgdGhpc09iai5kcmFnZ2VkKGQpOyB9IClcbiAgICAgICAgICAgICAgICAgICAgIC5vbignZW5kJywgZnVuY3Rpb24oZCkgeyB0aGlzT2JqLmRyYWdFbmRlZChkKTsgfSApICk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kTm9kZVRvR3JhcGgoKSB7XG4gICAgICB2YXIgbiA9IHRoaXMuYXBwZW5kTm9kZSgpO1xuICAgICAgdGhpcy5hcHBlbmRSaW5nVG9Ob2RlKG4pO1xuICAgICAgdGhpcy5hcHBlbmRPdXRsaW5lVG9Ob2RlKG4pO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5pY29ucykge1xuICAgICAgICAgIHRoaXMuYXBwZW5kVGV4dFRvTm9kZShuKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW1hZ2VzKSB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRJbWFnZVRvTm9kZShuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZE91dGxpbmVUb05vZGUobm9kZSkge1xuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ291dGxpbmUnKVxuICAgICAgICAgICAgIC5hdHRyKCdyJywgb3B0aW9ucy5ub2RlUmFkaXVzKVxuICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yIDogdGhpc09iai5jbGFzczJjb2xvcihkLmxhYmVsc1swXSk7XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IpIDogdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcihkLmxhYmVsc1swXSk7XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAuYXBwZW5kKCd0aXRsZScpLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoudG9TdHJpbmcoZCk7XG4gICAgICAgICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY2xhc3MyY29sb3IoY2xzKSB7XG4gICAgICB2YXIgY29sb3IgPSB0aGlzLmNsYXNzZXMyY29sb3JzW2Nsc107XG4gICAgICBpZiAoIWNvbG9yKSB7XG4gICAgICAgICAgLy8gY29sb3IgPSB0aGlzLm9wdGlvbnMuY29sb3JzW01hdGgubWluKG51bUNsYXNzZXMsIHRoaXMub3B0aW9ucy5jb2xvcnMubGVuZ3RoIC0gMSldO1xuICAgICAgICAgIGNvbG9yID0gdGhpcy5vcHRpb25zLmNvbG9yc1t0aGlzLm51bUNsYXNzZXMgJSB0aGlzLm9wdGlvbnMuY29sb3JzLmxlbmd0aF07XG4gICAgICAgICAgdGhpcy5jbGFzc2VzMmNvbG9yc1tjbHNdID0gY29sb3I7XG4gICAgICAgICAgdGhpcy5udW1DbGFzc2VzKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29sb3I7XG4gIH1cblxuICBwdWJsaWMgY2xhc3MyZGFya2VuQ29sb3IoY2xzKSB7XG4gICAgICB2YXIgY29sb3JWYWx1ZSA9IHRoaXMuY2xhc3MyY29sb3IoY2xzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gQ09MT1IgT2JqZWN0IGlzIG5vdCB3b3JraW5nIHByb3Blcmx5IHdoZW4gdGhlIG9wdGltaXphdGlvbiBpcyBzZXQgdHJ1ZVxuICAgICAgICAgIHZhciBjb2xvck9iamVjdCA9IGQzLnJnYihjb2xvclZhbHVlKTtcbiAgICAgICAgICByZXR1cm4gY29sb3JPYmplY3QuZGFya2VyKDEpO1xuICAgICAgfVxuICAgICAgY2F0Y2goZXJyKSB7fVxuICB9XG5cbiAgcHVibGljIGFwcGVuZFJpbmdUb05vZGUobm9kZSkge1xuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdyaW5nJylcbiAgICAgICAgICAuYXR0cigncicsIHRoaXMub3B0aW9ucy5ub2RlUmFkaXVzICogMS4xNilcbiAgICAgICAgICAuYXBwZW5kKCd0aXRsZScpLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzT2JqLnRvU3RyaW5nKGQpO1xuICAgICAgfSk7XG4gIH1cblxuXG4gIHB1YmxpYyBhcHBlbmRJbWFnZVRvTm9kZShub2RlKSB7XG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG4gICAgICAvLyBUT0RPID4+IENoYW5nZSBUaGlzIFRvIEJlY29tZSBUaGUgQ29udGFpbmVyXG4gICAgICAvLyBBZGRlZCB0aGUgW2ljb25GbGFnXSBhdHRyaWJ1dGUgaW4gdGhlIG5vZGUgb3IgJ2QnIHZhcmlhYmxlXG4gICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ2ltYWdlJykuYXR0cignd2lkdGgnLCAnMzVweCcpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAnMzVweCcpLmF0dHIoJ3gnLCAnLTE4cHgnKS5hdHRyKCd5JywgJy0xOHB4JylcbiAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBmdW5jdGlvbihkKSB7IHJldHVybiB0aGlzT2JqLmltYWdlKGQpOyB9KTtcbiAgICAgO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFRleHRUb05vZGUobm9kZSkge1xuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBmdW5jdGlvbihkKSB7IHJldHVybiAndGV4dCcgKyAodGhpc09iai5pY29uKGQpID8gJyBpY29uJyA6ICcnKTsgfSlcbiAgICAgICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICh0aGlzT2JqLmljb24oZCkgPyAnMjVweCcgOiAnMTJweCcpOyB9KVxuICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICh0aGlzT2JqLmljb24oZCkgPyAnMjVweCcgOiAnMzBweCcpOyB9KVxuICAgICAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oZCkgeyByZXR1cm4gKHRoaXNPYmouaWNvbihkKSA/ICcyNXB4JyA6ICczMHB4Jyk7IH0pXG4gICAgICAgICAgLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICBjb25zdCByZ2IgPSAnZmlsbDogcmdiKDIyNSwgMjI1LCAyMjUpOyBzdHJva2U6IHJnYigwMDAsIDAwMCwgMDAwKTsnO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5pY29uKGQpID8gcmdiIDogJyc7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuaHRtbChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHZhciBfaWNvbiA9IHRoaXNPYmouaWNvbihkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9pY29uID8gJyYjeCcgKyBfaWNvbiA6IGQuaWQ7XG4gICAgICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kUmFuZG9tRGF0YVRvTm9kZShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpIHtcbiAgICAgIHZhciBkYXRhID0gdGhpcy5yYW5kb21EM0RhdGEoZCwgbWF4Tm9kZXNUb0dlbmVyYXRlKTtcbiAgICAgIHRoaXMudXBkYXRlV2l0aE5lbzRqRGF0YShkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRSZWxhdGlvbnNoaXAoKSB7XG4gICAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgICAgLy8gRnVuY3Rpb24gPiBEb3VibGUgQ2xpY2sgXG4gICAgICBjb25zdCBmbkRvdWJsZUNsaWNrID0gZnVuY3Rpb24oZDphbnkpIHtcbiAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uUmVsYXRpb25zaGlwRG91YmxlQ2xpY2sgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25SZWxhdGlvbnNoaXBEb3VibGVDbGljayhkKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8gRnVuY3Rpb24gPiBNb3VzZSBFbnRlclxuICAgICAgY29uc3QgZm5Nb3VzZUVudGVyID0gZnVuY3Rpb24oZDphbnkpIHtcbiAgICAgICAgICBpZiAodGhpc09iai5pbmZvKSB7XG4gICAgICAgICAgICAgIHRoaXNPYmoudXBkYXRlSW5mbyhkKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25zaGlwLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAncmVsYXRpb25zaGlwJykub24oJ2RibGNsaWNrJywgZm5Eb3VibGVDbGljaykub24oJ21vdXNlZW50ZXInLCBmbk1vdXNlRW50ZXIpO1xuICB9XG5cbiAgcHVibGljIGNsZWFySW5mbygpIHtcbiAgICAgIHRoaXMuaW5mby5odG1sKCcnKTtcbiAgfVxuXG4gIHB1YmxpYyBjb2xvcigpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29sb3JzW3RoaXMub3B0aW9ucy5jb2xvcnMubGVuZ3RoICogTWF0aC5yYW5kb20oKSA8PCAwXTtcbiAgfVxuXG4gIHB1YmxpYyBjb2xvcnMoKSA6IEFycmF5PFN0cmluZz4ge1xuICAgICAgLy8gZDMuc2NoZW1lQ2F0ZWdvcnkxMCxcbiAgICAgIC8vIGQzLnNjaGVtZUNhdGVnb3J5MjAsXG4gICAgICByZXR1cm4gW1xuICAgICAgICAgICcjNjhiZGY2JywgLy8gbGlnaHQgYmx1ZVxuICAgICAgICAgICcjNmRjZTllJywgLy8gZ3JlZW4gIzFcbiAgICAgICAgICAnI2ZhYWZjMicsIC8vIGxpZ2h0IHBpbmtcbiAgICAgICAgICAnI2YyYmFmNicsIC8vIHB1cnBsZVxuICAgICAgICAgICcjZmY5MjhjJywgLy8gbGlnaHQgcmVkXG4gICAgICAgICAgJyNmY2VhN2UnLCAvLyBsaWdodCB5ZWxsb3dcbiAgICAgICAgICAnI2ZmYzc2NicsIC8vIGxpZ2h0IG9yYW5nZVxuICAgICAgICAgICcjNDA1ZjllJywgLy8gbmF2eSBibHVlXG4gICAgICAgICAgJyNhNWFiYjYnLCAvLyBkYXJrIGdyYXlcbiAgICAgICAgICAnIzc4Y2VjYicsIC8vIGdyZWVuICMyLFxuICAgICAgICAgICcjYjg4Y2JiJywgLy8gZGFyayBwdXJwbGVcbiAgICAgICAgICAnI2NlZDJkOScsIC8vIGxpZ2h0IGdyYXlcbiAgICAgICAgICAnI2U4NDY0NicsIC8vIGRhcmsgcmVkXG4gICAgICAgICAgJyNmYTVmODYnLCAvLyBkYXJrIHBpbmtcbiAgICAgICAgICAnI2ZmYWIxYScsIC8vIGRhcmsgb3JhbmdlXG4gICAgICAgICAgJyNmY2RhMTknLCAvLyBkYXJrIHllbGxvd1xuICAgICAgICAgICcjNzk3YjgwJywgLy8gYmxhY2tcbiAgICAgICAgICAnI2M5ZDk2ZicsIC8vIHBpc3RhY2NoaW9cbiAgICAgICAgICAnIzQ3OTkxZicsIC8vIGdyZWVuICMzXG4gICAgICAgICAgJyM3MGVkZWUnLCAvLyB0dXJxdW9pc2VcbiAgICAgICAgICAnI2ZmNzVlYScgIC8vIHBpbmtcbiAgICAgIF07XG4gIH1cblxuICBwdWJsaWMgY29udGFpbnNSZXN1bHQoYXJyYXksIGlkKSB7XG4gICAgICB2YXIgZmlsdGVyID0gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICByZXR1cm4gZWxlbS5pZCA9PT0gaWQ7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmaWx0ZXIubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHB1YmxpYyBkZWZhdWx0Q29sb3IoKSB7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMucmVsYXRpb25zaGlwQ29sb3I7XG4gIH1cblxuICBwdWJsaWMgZGVmYXVsdERhcmtlbkNvbG9yKCkge1xuICAgICAgdmFyIGNvbG9yVmFsdWUgPSB0aGlzLm9wdGlvbnMuY29sb3JzW3RoaXMub3B0aW9ucy5jb2xvcnMubGVuZ3RoIC0gMV07XG4gICAgICB0cnkge1xuICAgICAgICAgIC8vIENPTE9SIE9iamVjdCBpcyBub3Qgd29ya2luZyBwcm9wZXJseSB3aGVuIHRoZSBvcHRpbWl6YXRpb24gaXMgc2V0IHRydWVcbiAgICAgICAgICB2YXIgY29sb3JPYmplY3QgPSBkMy5yZ2IoY29sb3JWYWx1ZSk7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yT2JqZWN0LmRhcmtlcigxKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoKGVycikgeyB9XG4gIH1cblxuICBwdWJsaWMgZHJhZ0VuZGVkKGQpIHtcbiAgICAgIGlmICghZDMuZXZlbnQuYWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5zaW11bGF0aW9uLmFscGhhVGFyZ2V0KDApO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm9uTm9kZURyYWdFbmQgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5vbk5vZGVEcmFnRW5kKGQpO1xuICAgICAgfVxuICB9XG5cbiAgcHVibGljIGRyYWdnZWQoZCkge1xuICAgICAgdGhpcy5zdGlja05vZGUoZCk7XG4gIH1cblxuICBwdWJsaWMgZHJhZ1N0YXJ0ZWQoZCkge1xuICAgICAgaWYgKCFkMy5ldmVudC5hY3RpdmUpIHtcbiAgICAgICAgICB0aGlzLnNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMC4zKS5yZXN0YXJ0KCk7XG4gICAgICB9XG4gICAgICBkLmZ4ID0gZC54O1xuICAgICAgZC5meSA9IGQueTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub25Ob2RlRHJhZ1N0YXJ0ICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25Ob2RlRHJhZ1N0YXJ0KGQpO1xuICAgICAgfVxuICB9XG5cbiAgcHVibGljIGV4dGVuZChvYmoxLCBvYmoyKSB7XG4gICAgdmFyIG9iaiA9IHt9O1xuICAgIHRoaXMubWVyZ2VQcm9wZXJ0eShvYmosIG9iajEpO1xuICAgIHRoaXMubWVyZ2VQcm9wZXJ0eShvYmosIG9iajIpO1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuXG4gIHB1YmxpYyBpY29uKGQpIHtcbiAgICB2YXIgY29kZTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaWNvbk1hcCAmJiB0aGlzLm9wdGlvbnMuc2hvd0ljb25zICYmIHRoaXMub3B0aW9ucy5pY29ucykge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXSAmJiB0aGlzLm9wdGlvbnMuaWNvbk1hcFt0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dXSkge1xuICAgICAgICAgICAgY29kZSA9IHRoaXMub3B0aW9ucy5pY29uTWFwW3RoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV1dO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5pY29uTWFwW2QubGFiZWxzWzBdXSkge1xuICAgICAgICAgICAgY29kZSA9IHRoaXMub3B0aW9ucy5pY29uTWFwW2QubGFiZWxzWzBdXTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dKSB7XG4gICAgICAgICAgICBjb2RlID0gdGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb2RlO1xuICB9XG5cbiAgcHVibGljIGltYWdlKGQpIHtcbiAgICB2YXIgaSwgaW1hZ2VzRm9yTGFiZWwsIGltZywgaW1nTGV2ZWwsIGxhYmVsLCBsYWJlbFByb3BlcnR5VmFsdWUsIHByb3BlcnR5LCB2YWx1ZTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaW1hZ2VzKSB7XG4gICAgICAgIGNvbnN0IGltZ1JlZiA9IGQuaW1nPT11bmRlZmluZWQgPyBkLmxhYmVsc1swXSA6IGQuaW1nO1xuICAgICAgICBpbWFnZXNGb3JMYWJlbCA9IHRoaXMub3B0aW9ucy5pbWFnZU1hcFtpbWdSZWZdO1xuXG4gICAgICAgIGlmIChpbWFnZXNGb3JMYWJlbCkge1xuICAgICAgICAgICAgaW1nTGV2ZWwgPSAwO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW1hZ2VzRm9yTGFiZWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsYWJlbFByb3BlcnR5VmFsdWUgPSBpbWFnZXNGb3JMYWJlbFtpXS5zcGxpdCgnfCcpO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChsYWJlbFByb3BlcnR5VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBsYWJlbFByb3BlcnR5VmFsdWVbMl07XG4gICAgICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IGxhYmVsUHJvcGVydHlWYWx1ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsID0gbGFiZWxQcm9wZXJ0eVZhbHVlWzBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpbWdSZWYgPT09IGxhYmVsICYmXG4gICAgICAgICAgICAgICAgICAgICghcHJvcGVydHkgfHwgZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSAmJlxuICAgICAgICAgICAgICAgICAgICAoIXZhbHVlIHx8IGQucHJvcGVydGllc1twcm9wZXJ0eV0gPT09IHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWxQcm9wZXJ0eVZhbHVlLmxlbmd0aCA+IGltZ0xldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSB0aGlzLm9wdGlvbnMuaW1hZ2VzW2ltYWdlc0ZvckxhYmVsW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZ0xldmVsID0gbGFiZWxQcm9wZXJ0eVZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpbWc7XG4gIH1cblxuICBwdWJsaWMgbG9hZE5lbzRqRGF0YSgpIHtcbiAgICB0aGlzLm5vZGVzID0gW107XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBzID0gW107XG4gICAgdGhpcy51cGRhdGVXaXRoTmVvNGpEYXRhKHRoaXMub3B0aW9ucy5uZW80akRhdGEpO1xuICB9XG5cbiAgcHVibGljIGxvYWROZW80akRhdGFGcm9tVXJsKG5lbzRqRGF0YVVybCkge1xuICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcHMgPSBbXTtcblxuICAgIGQzLmpzb24obmVvNGpEYXRhVXJsLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlV2l0aE5lbzRqRGF0YShkYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBuZW80akRhdGFUb0QzRGF0YShkYXRhKSB7XG4gICAgdmFyIGdyYXBoID0ge1xuICAgICAgICBub2RlczogW10sXG4gICAgICAgIHJlbGF0aW9uc2hpcHM6IFtdXG4gICAgfTtcblxuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgZGF0YS5yZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdC5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5ncmFwaC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXNPYmouY29udGFpbnNSZXN1bHQoZ3JhcGgubm9kZXMsIG5vZGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwcy5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC5zb3VyY2UgPSByZWxhdGlvbnNoaXAuc3RhcnROb2RlO1xuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC50YXJnZXQgPSByZWxhdGlvbnNoaXAuZW5kTm9kZTtcbiAgICAgICAgICAgICAgICBncmFwaC5yZWxhdGlvbnNoaXBzLnB1c2gocmVsYXRpb25zaGlwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEuc291cmNlID4gYi5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhLnNvdXJjZSA8IGIuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYS50YXJnZXQgPiBiLnRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYS50YXJnZXQgPCBiLnRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSAhPT0gMCAmJiBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaV0uc291cmNlID09PSBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaS0xXS5zb3VyY2UgJiYgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLnRhcmdldCA9PT0gZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ktMV0udGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpXS5saW5rbnVtID0gZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2kgLSAxXS5saW5rbnVtICsgMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaV0ubGlua251bSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZyhkKSB7XG4gICAgdmFyIHMgPSBkLmxhYmVscyA/IGQubGFiZWxzWzBdIDogZC50eXBlO1xuICAgIHMgKz0gJyAoPGlkPjogJyArIGQuaWQ7XG4gICAgT2JqZWN0LmtleXMoZC5wcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgIHMgKz0gJywgJyArIHByb3BlcnR5ICsgJzogJyArIEpTT04uc3RyaW5naWZ5KGQucHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgIH0pO1xuICAgIHMgKz0gJyknO1xuICAgIHJldHVybiBzO1xuICB9XG5cbiAgcHVibGljIHJhbmRvbUQzRGF0YShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpIHtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbm9kZXM6IFtdLFxuICAgICAgICByZWxhdGlvbnNoaXBzOiBbXVxuICAgIH07XG5cbiAgICB2YXIgbnVtTm9kZXMgPSAobWF4Tm9kZXNUb0dlbmVyYXRlICogTWF0aC5yYW5kb20oKSA8PCAwKSArIDE7XG4gICAgdmFyIHMgPSB0aGlzLnNpemUoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtTm9kZXM7IGkrKykge1xuICAgICAgLy8gdmFyIGljb25zID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmljb25NYXApO1xuICAgICAgY29uc3QgbGFiZWwgPSBcIkhlbGxvXCI7IC8vIGljb25zW2ljb25zLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkgPDwgMF07XG5cbiAgICAgIGNvbnN0IG5vZGUgPSB7XG4gICAgICAgICAgaWQ6IHMubm9kZXMgKyAxICsgaSxcbiAgICAgICAgICBsYWJlbHM6IFtsYWJlbF0sXG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICByYW5kb206IGxhYmVsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4OiBkLngsXG4gICAgICAgICAgeTogZC55XG4gICAgICB9O1xuXG4gICAgICBkYXRhLm5vZGVzW2RhdGEubm9kZXMubGVuZ3RoXSA9IG5vZGU7XG5cbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcCA9IHtcbiAgICAgICAgICBpZDogcy5yZWxhdGlvbnNoaXBzICsgMSArIGksXG4gICAgICAgICAgdHlwZTogbGFiZWwudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICBzdGFydE5vZGU6IGQuaWQsXG4gICAgICAgICAgZW5kTm9kZTogcy5ub2RlcyArIDEgKyBpLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZnJvbTogRGF0ZS5ub3coKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc291cmNlOiBkLmlkLFxuICAgICAgICAgIHRhcmdldDogcy5ub2RlcyArIDEgKyBpLFxuICAgICAgICAgIGxpbmtudW06IHMucmVsYXRpb25zaGlwcyArIDEgKyBpXG4gICAgICB9O1xuXG4gICAgICBkYXRhLnJlbGF0aW9uc2hpcHNbZGF0YS5yZWxhdGlvbnNoaXBzLmxlbmd0aF0gPSByZWxhdGlvbnNoaXA7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIHNpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vZGVzOiB0aGlzLm5vZGVzLmxlbmd0aCxcbiAgICAgIHJlbGF0aW9uc2hpcHM6IHRoaXMucmVsYXRpb25zaGlwcy5sZW5ndGhcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHN0aWNrTm9kZShkKSB7XG4gICAgZC5meCA9IGQzLmV2ZW50Lng7XG4gICAgZC5meSA9IGQzLmV2ZW50Lnk7XG4gIH1cblxuICBwdWJsaWMgdGljaygpIHtcbiAgICB0aGlzLnRpY2tOb2RlcygpO1xuICAgIHRoaXMudGlja1JlbGF0aW9uc2hpcHMoKTtcbiAgfVxuXG4gIHB1YmxpYyB0aWNrTm9kZXMoKSB7XG4gICAgaWYgKHRoaXMubm9kZSkge1xuICAgICAgdGhpcy5ub2RlLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgaWYoZCE9dW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsICcgKyBkLnkgKyAnKSc7XG4gICAgICAgIGNvbnN0IG1zZyA9IFwiPT09PT09PT09Pj4+Pj4+Pj4+Pj4+Pj4gRVJST1IgPj4gdGlja05vZGVzXCI7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdGlja1JlbGF0aW9uc2hpcHMoKSB7XG4gICAgaWYgKHRoaXMucmVsYXRpb25zaGlwKSB7XG4gICAgICBjb25zdCB0aGlzT2JqID0gdGhpcztcbiAgICAgIHRoaXMucmVsYXRpb25zaGlwLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgaWYoZCE9dW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGFuZ2xlID0gdGhpc09iai5yb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpO1xuICAgICAgICAgIGlmKGQuc291cmNlIT11bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnNvdXJjZS54ICsgJywgJyArIGQuc291cmNlLnkgKyAnKSByb3RhdGUoJyArIGFuZ2xlICsgJyknO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtc2cgPSBcIj09PT09PT09PT4+Pj4+Pj4+Pj4+Pj4+IEVSUk9SID4+IHRpY2tSZWxhdGlvbnNoaXBzXCI7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICAgICAgXG4gICAgICB9KTtcbiAgICAgIHRoaXMudGlja1JlbGF0aW9uc2hpcHNUZXh0cygpO1xuICAgICAgdGhpcy50aWNrUmVsYXRpb25zaGlwc091dGxpbmVzKCk7XG4gICAgICB0aGlzLnRpY2tSZWxhdGlvbnNoaXBzT3ZlcmxheXMoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdGlja1JlbGF0aW9uc2hpcHNPdXRsaW5lcygpIHtcbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIHRoaXMucmVsYXRpb25zaGlwLmVhY2goIChyZWxhdGlvbnNoaXAsIGluZGV4LCBnKSA9PiB7XG4gICAgICB2YXIgb2JqID0gZ1tpbmRleF07XG4gICAgICB2YXIgcmVsID0gZDMuc2VsZWN0KG9iaik7XG4gICAgICB2YXIgb3V0bGluZTtcbiAgICAgIHRyeSB7b3V0bGluZSA9IHJlbC5zZWxlY3QoJy5vdXRsaW5lJyk7fVxuICAgICAgY2F0Y2goZXJyKSB7IHJldHVybjsgfVxuICAgICAgXG4gICAgICB2YXIgdGV4dCA9IHJlbC5zZWxlY3QoJy50ZXh0Jyk7XG4gICAgICBcbiAgICAgIHRyeSB7dmFyIGJib3ggPSB0ZXh0Lm5vZGUoKS5nZXRCQm94KCk7fVxuICAgICAgY2F0Y2goZXJyKSB7IHJldHVybjsgfVxuXG4gICAgICB2YXIgcGFkZGluZyA9IDM7XG5cbiAgICAgIG91dGxpbmUuYXR0cignZCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzT2JqLm9wdGlvbnM7XG4gICAgICAgIHZhciBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfSxcbiAgICAgICAgICBhbmdsZSA9IHRoaXNPYmoucm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgICB0ZXh0Qm91bmRpbmdCb3ggPSB0ZXh0Lm5vZGUoKS5nZXRCQm94KCksXG4gICAgICAgICAgdGV4dFBhZGRpbmcgPSA1LFxuICAgICAgICAgIHUgPSB0aGlzT2JqLnVuaXRhcnlWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgICB0ZXh0TWFyZ2luID0geyB4OiAoZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAodGV4dEJvdW5kaW5nQm94LndpZHRoICsgdGV4dFBhZGRpbmcpICogdS54KSAqIDAuNSwgeTogKGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKHRleHRCb3VuZGluZ0JveC53aWR0aCArIHRleHRQYWRkaW5nKSAqIHUueSkgKiAwLjUgfSxcbiAgICAgICAgICBuID0gdGhpc09iai51bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgcm90YXRlZFBvaW50QTEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwICsgKHRoaXNPYmoub3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSBuLngsIHk6IDAgKyAodGhpc09iai5vcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QjEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiB0ZXh0TWFyZ2luLnggLSBuLngsIHk6IHRleHRNYXJnaW4ueSAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QzEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiB0ZXh0TWFyZ2luLngsIHk6IHRleHRNYXJnaW4ueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RDEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwICsgKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54LCB5OiAwICsgKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRBMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gdGV4dE1hcmdpbi54IC0gbi54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIHRleHRNYXJnaW4ueSAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QjIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIG4ueCAtIHUueCAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIG4ueSAtIHUueSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRDMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gbi54ICsgKG4ueCAtIHUueCkgKiBvcHRpb25zLmFycm93U2l6ZSwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSBuLnkgKyAobi55IC0gdS55KSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnREMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RTIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCArICgtIG4ueCAtIHUueCkgKiBvcHRpb25zLmFycm93U2l6ZSwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgKyAoLSBuLnkgLSB1LnkpICogb3B0aW9ucy5hcnJvd1NpemUgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEYyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSB1LnggKiBvcHRpb25zLmFycm93U2l6ZSwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSB1LnkgKiBvcHRpb25zLmFycm93U2l6ZSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RzIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIHRleHRNYXJnaW4ueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSB0ZXh0TWFyZ2luLnkgfSwgYW5nbGUpO1xuXG4gICAgICAgIHJldHVybiAnTSAnICsgcm90YXRlZFBvaW50QTEueCArICcgJyArIHJvdGF0ZWRQb2ludEExLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QjEueCArICcgJyArIHJvdGF0ZWRQb2ludEIxLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QzEueCArICcgJyArIHJvdGF0ZWRQb2ludEMxLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RDEueCArICcgJyArIHJvdGF0ZWRQb2ludEQxLnkgK1xuICAgICAgICAgICcgWiBNICcgKyByb3RhdGVkUG9pbnRBMi54ICsgJyAnICsgcm90YXRlZFBvaW50QTIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCMi54ICsgJyAnICsgcm90YXRlZFBvaW50QjIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRDMi54ICsgJyAnICsgcm90YXRlZFBvaW50QzIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnREMi54ICsgJyAnICsgcm90YXRlZFBvaW50RDIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRFMi54ICsgJyAnICsgcm90YXRlZFBvaW50RTIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRGMi54ICsgJyAnICsgcm90YXRlZFBvaW50RjIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRHMi54ICsgJyAnICsgcm90YXRlZFBvaW50RzIueSArXG4gICAgICAgICAgJyBaJztcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlcnIpIHsgcmV0dXJuOyB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvdXRsaW5lRnVuY3Rpb24oZCwgdGV4dCkge1xuICAgICAgXG4gIH1cblxuICBwdWJsaWMgdGlja1JlbGF0aW9uc2hpcHNPdmVybGF5cygpIHtcbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIHRoaXMucmVsYXRpb25zaGlwT3ZlcmxheS5hdHRyKCdkJywgZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxuICAgICAgICBhbmdsZSA9IHRoaXNPYmoucm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgbjEgPSB0aGlzT2JqLnVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgbiA9IHRoaXNPYmoudW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQsIDUwKSxcbiAgICAgICAgcm90YXRlZFBvaW50QSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgLSBuLngsIHk6IDAgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICByb3RhdGVkUG9pbnRCID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSBuLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgcm90YXRlZFBvaW50QyA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54ICsgbi54IC0gbjEueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgKyBuLnkgLSBuMS55IH0sIGFuZ2xlKSxcbiAgICAgICAgcm90YXRlZFBvaW50RCA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgKyBuLnggLSBuMS54LCB5OiAwICsgbi55IC0gbjEueSB9LCBhbmdsZSk7XG5cbiAgICAgIHJldHVybiAnTSAnICsgcm90YXRlZFBvaW50QS54ICsgJyAnICsgcm90YXRlZFBvaW50QS55ICtcbiAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCLnggKyAnICcgKyByb3RhdGVkUG9pbnRCLnkgK1xuICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEMueCArICcgJyArIHJvdGF0ZWRQb2ludEMueSArXG4gICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RC54ICsgJyAnICsgcm90YXRlZFBvaW50RC55ICtcbiAgICAgICAgJyBaJztcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0aWNrUmVsYXRpb25zaGlwc1RleHRzKCkge1xuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBUZXh0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBhbmdsZSA9ICh0aGlzT2JqLnJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCkgKyAzNjApICUgMzYwLFxuICAgICAgICBtaXJyb3IgPSBhbmdsZSA+IDkwICYmIGFuZ2xlIDwgMjcwLFxuICAgICAgICBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfSxcbiAgICAgICAgbiA9IHRoaXNPYmoudW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICBuV2VpZ2h0ID0gbWlycm9yID8gMiA6IC0zLFxuICAgICAgICBwb2ludCA9IHsgeDogKGQudGFyZ2V0LnggLSBkLnNvdXJjZS54KSAqIDAuNSArIG4ueCAqIG5XZWlnaHQsIHk6IChkLnRhcmdldC55IC0gZC5zb3VyY2UueSkgKiAwLjUgKyBuLnkgKiBuV2VpZ2h0IH0sXG4gICAgICAgIHJvdGF0ZWRQb2ludCA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCBwb2ludCwgYW5nbGUpO1xuXG4gICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgcm90YXRlZFBvaW50LnggKyAnLCAnICsgcm90YXRlZFBvaW50LnkgKyAnKSByb3RhdGUoJyArIChtaXJyb3IgPyAxODAgOiAwKSArICcpJztcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1bml0YXJ5Tm9ybWFsVmVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBuZXdMZW5ndGg9MSkge1xuICAgIHZhciBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICB2YXIgdmVjdG9yID0gdGhpcy51bml0YXJ5VmVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBuZXdMZW5ndGgpO1xuICAgIHJldHVybiB0aGlzLnJvdGF0ZVBvaW50KGNlbnRlciwgdmVjdG9yLCA5MCk7XG4gIH1cblxuICBwdWJsaWMgdW5pdGFyeVZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoPTEpIHtcbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KE1hdGgucG93KHRhcmdldC54IC0gc291cmNlLngsIDIpICsgTWF0aC5wb3codGFyZ2V0LnkgLSBzb3VyY2UueSwgMikpIC8gTWF0aC5zcXJ0KG5ld0xlbmd0aCB8fCAxKTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKHRhcmdldC54IC0gc291cmNlLngpIC8gbGVuZ3RoLFxuICAgICAgeTogKHRhcmdldC55IC0gc291cmNlLnkpIC8gbGVuZ3RoLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBvYnNlbGV0ZSBhbmQgbm90IHVzZWQgYW55IHdoZXJlXG4gICAqIEBvYnNlbGV0ZVxuICAgKiBAcGFyYW0gZDNEYXRhXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlV2l0aEQzRGF0YShkM0RhdGEpIHtcbiAgICB0aGlzLnVwZGF0ZU5vZGVzQW5kUmVsYXRpb25zaGlwcyhkM0RhdGEubm9kZXMsIGQzRGF0YS5yZWxhdGlvbnNoaXBzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgZGF0YSBmb3IgTmVvNGogVmlzdWFsaXphdGlvblxuICAgKiBAcGFyYW0gbmVvNGpEYXRhIFxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVdpdGhOZW80akRhdGEobmVvNGpEYXRhKSB7XG4gICAgdmFyIGQzRGF0YSA9IHRoaXMubmVvNGpEYXRhVG9EM0RhdGEobmVvNGpEYXRhKTtcbiAgICB0aGlzLnVwZGF0ZU5vZGVzQW5kUmVsYXRpb25zaGlwcyhkM0RhdGEubm9kZXMsIGQzRGF0YS5yZWxhdGlvbnNoaXBzKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVJbmZvKGQpIHtcbiAgICB0aGlzLmNsZWFySW5mbygpO1xuXG4gICAgaWYgKGQubGFiZWxzKSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50Q2xhc3MoJ2NsYXNzJywgZC5sYWJlbHNbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50UmVsYXRpb25zaGlwKCdjbGFzcycsIGQudHlwZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudFByb3BlcnR5KCdwcm9wZXJ0eScsICcmbHQ7aWQmZ3Q7JywgZC5pZCk7XG4gICAgXG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICBPYmplY3Qua2V5cyhkLnByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgIHRoaXNPYmouYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eSgncHJvcGVydHknLCBwcm9wZXJ0eSwgSlNPTi5zdHJpbmdpZnkoZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZU5vZGVzKG4pIHtcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLm5vZGVzLCBuKTtcblxuICAgIHRoaXMubm9kZSA9IHRoaXMuc3ZnTm9kZXMuc2VsZWN0QWxsKCcubm9kZScpLmRhdGEodGhpcy5ub2RlcywgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSk7XG4gICAgdmFyIG5vZGVFbnRlciA9IHRoaXMuYXBwZW5kTm9kZVRvR3JhcGgoKTtcbiAgICB0aGlzLm5vZGUgPSBub2RlRW50ZXIubWVyZ2UodGhpcy5ub2RlKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMobiwgcikge1xuICAgIHRoaXMudXBkYXRlUmVsYXRpb25zaGlwcyhyKTtcbiAgICB0aGlzLnVwZGF0ZU5vZGVzKG4pO1xuXG4gICAgdGhpcy5zaW11bGF0aW9uLm5vZGVzKHRoaXMubm9kZXMpO1xuICAgIHRoaXMuc2ltdWxhdGlvbi5mb3JjZSgnbGluaycpLmxpbmtzKHRoaXMucmVsYXRpb25zaGlwcyk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlUmVsYXRpb25zaGlwcyhyKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5yZWxhdGlvbnNoaXBzLCByKTtcblxuICAgIHRoaXMucmVsYXRpb25zaGlwID0gdGhpcy5zdmdSZWxhdGlvbnNoaXBzLnNlbGVjdEFsbCgnLnJlbGF0aW9uc2hpcCcpLmRhdGEodGhpcy5yZWxhdGlvbnNoaXBzLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkOyB9KTtcbiAgICB2YXIgcmVsYXRpb25zaGlwID0gdGhpcy5hcHBlbmRSZWxhdGlvbnNoaXAoKTtcblxuICAgIHZhciByZWxhdGlvbnNoaXBFbnRlciA6IFJlbGF0aW9uc2hpcEVudGVyID0gdGhpcy5hcHBlbmRSZWxhdGlvbnNoaXBUb0dyYXBoKHJlbGF0aW9uc2hpcCk7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBFbnRlci5yZWxhdGlvbnNoaXAubWVyZ2UodGhpcy5yZWxhdGlvbnNoaXApO1xuXG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdXRsaW5lID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC5vdXRsaW5lJyk7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdXRsaW5lID0gcmVsYXRpb25zaGlwRW50ZXIub3V0bGluZS5tZXJnZSh0aGlzLnJlbGF0aW9uc2hpcE91dGxpbmUpO1xuXG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdmVybGF5ID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC5vdmVybGF5Jyk7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdmVybGF5ID0gcmVsYXRpb25zaGlwRW50ZXIub3ZlcmxheS5tZXJnZSh0aGlzLnJlbGF0aW9uc2hpcE92ZXJsYXkpO1xuXG4gICAgdGhpcy5yZWxhdGlvbnNoaXBUZXh0ID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC50ZXh0Jyk7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBUZXh0ID0gcmVsYXRpb25zaGlwRW50ZXIudGV4dC5tZXJnZSh0aGlzLnJlbGF0aW9uc2hpcFRleHQpO1xuICB9XG5cblxuXG5cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gICAgICAgICAgICBOZW80aiBVdGlsXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cblxuICBwdWJsaWMgZ2V0T3B0aW9uc1ByZXNlbnRhdGlvbigpIDogTmdOZW80akQzT3B0aW9ucyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFycm93U2l6ZTogNCxcbiAgICAgIGNvbG9yczogdW5kZWZpbmVkLFxuICAgICAgaGlnaGxpZ2h0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzczogJ1Byb2plY3QnLFxuICAgICAgICAgIHByb3BlcnR5OiAnbmFtZScsXG4gICAgICAgICAgdmFsdWU6ICduZW80amQzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdVc2VyJyxcbiAgICAgICAgICBwcm9wZXJ0eTogJ3VzZXJJZCcsXG4gICAgICAgICAgdmFsdWU6ICdlaXNtYW4nXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBpY29uczogTmdOZW80akQzSWNvbnMuZXhhbXBsZUljb25zKCksXG4gICAgICBpbWFnZXM6IE5nTmVvNGpEM0ljb25zLmV4YW1wbGVJbWFnZXMoKSxcbiAgICAgIGljb25NYXA6IHVuZGVmaW5lZCwgICAgLy8gVGhpcyB2YWx1ZSBhc3NpZ25lZCBpbiBOZW80alJhbmRvbVxuICAgICAgaW1hZ2VNYXA6IHVuZGVmaW5lZCxcbiAgICAgIGluZm9QYW5lbDogdHJ1ZSxcbiAgICAgIG1pbkNvbGxpc2lvbjogNjAsXG4gICAgICBuZW80akRhdGE6IE5lbzRqRDNSZWNvcmRzLFxuICAgICAgbm9kZU91dGxpbmVGaWxsQ29sb3I6IHVuZGVmaW5lZCxcbiAgICAgIG5lbzRqRGF0YVVybDogdW5kZWZpbmVkLFxuICAgICAgbm9kZVJhZGl1czogMjUsXG4gICAgICByZWxhdGlvbnNoaXBDb2xvcjogJyNhNWFiYjYnLFxuICAgICAgb25SZWxhdGlvbnNoaXBEb3VibGVDbGljazogZnVuY3Rpb24ocmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkb3VibGUgY2xpY2sgb24gcmVsYXRpb25zaGlwOiAnICsgSlNPTi5zdHJpbmdpZnkocmVsYXRpb25zaGlwKSk7XG4gICAgICB9LFxuICAgICAgem9vbUZpdDogdHJ1ZSxcbiAgICAgIHNob3dJY29uczogdHJ1ZSxcbiAgICAgIG9uTm9kZURvdWJsZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlTW91c2VFbnRlcjogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlTW91c2VMZWF2ZTogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlRHJhZ0VuZDogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlRHJhZ1N0YXJ0OiB1bmRlZmluZWQsXG4gICAgICBncmFwaENvbnRhaW5lckhlaWdodDogJzEwMCUnXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyByb3RhdGVQb2ludChjLCBwLCBhbmdsZSkge1xuICAgIHJldHVybiB0aGlzLnJvdGF0ZShjLngsIGMueSwgcC54LCBwLnksIGFuZ2xlKTtcbiAgfVxuXG4gIHB1YmxpYyByb3RhdGlvbihzb3VyY2UsIHRhcmdldCkge1xuICAgIHJldHVybiBNYXRoLmF0YW4yKHRhcmdldC55IC0gc291cmNlLnksIHRhcmdldC54IC0gc291cmNlLngpICogMTgwIC8gTWF0aC5QSTtcbiAgfVxuXG4gIHB1YmxpYyByb3RhdGUoY3gsIGN5LCB4LCB5LCBhbmdsZSkge1xuICAgIHZhciByYWRpYW5zID0gKE1hdGguUEkgLyAxODApICogYW5nbGUsXG4gICAgICAgIGNvcyA9IE1hdGguY29zKHJhZGlhbnMpLFxuICAgICAgICBzaW4gPSBNYXRoLnNpbihyYWRpYW5zKSxcbiAgICAgICAgbnggPSAoY29zICogKHggLSBjeCkpICsgKHNpbiAqICh5IC0gY3kpKSArIGN4LFxuICAgICAgICBueSA9IChjb3MgKiAoeSAtIGN5KSkgLSAoc2luICogKHggLSBjeCkpICsgY3k7XG5cbiAgICByZXR1cm4geyB4OiBueCwgeTogbnkgfTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0SWNvbk1hcChvcHRpb25zKSB7XG4gICAgT2JqZWN0LmtleXMob3B0aW9ucy5pY29uTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgpIHtcbiAgICAgIHZhciBrZXlzID0ga2V5LnNwbGl0KCcsJyk7XG4gICAgICB2YXIgdmFsdWUgPSBvcHRpb25zLmljb25NYXBba2V5XTtcblxuICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBvcHRpb25zLmljb25NYXBba2V5XSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9wdGlvbnMuaWNvbk1hcDtcbiAgfVxuXG4gIHB1YmxpYyBpbml0SW1hZ2VNYXAob3B0aW9ucykge1xuICAgIC8vIHZhciBrZXksIGtleXMsIHNlbGVjdG9yO1xuICAgIHZhciBrZXksIGtleXM7XG4gICAgZm9yIChrZXkgaW4gb3B0aW9ucy5pbWFnZXMpIHtcbiAgICAgIGlmIChvcHRpb25zLmltYWdlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGtleXMgPSBrZXkuc3BsaXQoJ3wnKTtcbiAgICAgICAgaWYgKCFvcHRpb25zLmltYWdlTWFwW2tleXNbMF1dKSB7XG4gICAgICAgICAgb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXSA9IFtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wdGlvbnMuaW1hZ2VNYXBba2V5c1swXV0ucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFwcGVuZFRleHRUb1JlbGF0aW9uc2hpcChyKSB7XG4gICAgdmFyIHJUZXh0ID0gci5hcHBlbmQoJ3RleHQnKTtcbiAgICByZXR1cm4gclRleHQuYXR0cignY2xhc3MnLCAndGV4dCcpLmF0dHIoJ2ZpbGwnLCAnIzAwMDAwMCcpLmF0dHIoJ2ZvbnQtc2l6ZScsICc4cHgnKS5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50eXBlOyB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRSZWxhdGlvbnNoaXBUb0dyYXBoKHJlbGF0aW9uc2hpcCkgOiBSZWxhdGlvbnNoaXBFbnRlciB7XG4gICAgdmFyIHRleHQgPSB0aGlzLmFwcGVuZFRleHRUb1JlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApO1xuICAgIHZhciBvdXRsaW5lID0gcmVsYXRpb25zaGlwLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ291dGxpbmUnKS5hdHRyKCdmaWxsJywgJyNhNWFiYjYnKS5hdHRyKCdzdHJva2UnLCAnbm9uZScpO1xuICAgIHZhciBvdmVybGF5ID0gcmVsYXRpb25zaGlwLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ292ZXJsYXknKTtcblxuICAgIC8vIHRoaXMucmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwO1xuICAgIHJldHVybiB7XG4gICAgICBvdXRsaW5lOiBvdXRsaW5lLFxuICAgICAgb3ZlcmxheTogb3ZlcmxheSxcbiAgICAgIHJlbGF0aW9uc2hpcDogcmVsYXRpb25zaGlwLFxuICAgICAgdGV4dDogdGV4dFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgbWVyZ2VQcm9wZXJ0eSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgY29uc3Qgc291cmNlUHJvcGVydHkgPSBzb3VyY2VbcHJvcGVydHldO1xuICAgICAgaWYoc291cmNlUHJvcGVydHkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmKCEoc291cmNlUHJvcGVydHkgaW5zdGFuY2VvZiBBcnJheSkpXG4gICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICAgIGVsc2UgaWYoc291cmNlUHJvcGVydHkubGVuZ3RoPjApXG4gICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdmVyc2lvbigpIHtcbiAgICByZXR1cm4gXCIwLjEuNlwiO1xuICB9XG5cblxuXG5cbiAgLy8gTWVyZ2VzIEFsbCBSZWxhdGlvbnNoaXBzIHdpdGggdGhlIHNhbWUgbm9kZXNcbiAgcHJpdmF0ZSBtZXJnZVJlbGF0aW9uc2hpcFdpdGhTYW1lTm9kZXMoKSB7XG4gICAgbGV0IHIgPSB0aGlzLm9wdGlvbnMubmVvNGpEYXRhLnJlc3VsdHNbMF0uZGF0YVswXS5ncmFwaC5yZWxhdGlvbnNoaXBzO1xuICAgIC8vIENoZWNrIHRoZSByZWxhdGlvbnNoaXAgY291bnRzIGJldHdlZW4gMiBub2Rlc1xuICAgIGxldCBzcGxpY2VUaGVtID0gW107XG4gICAgZm9yIChsZXQgckluZGV4PTA7IHJJbmRleDxyLmxlbmd0aDsgckluZGV4KyspIHtcbiAgICAgIGxldCByZWwgPSByW3JJbmRleF07XG4gICAgICBjb25zdCBzdGFydE5vZGUgPSByZWxbJ3N0YXJ0Tm9kZSddO1xuICAgICAgY29uc3QgZW5kTm9kZSA9IHJlbFsnZW5kTm9kZSddO1xuICAgICAgY29uc3QgcmVsYXRpb25zaGlwS2V5ID0gc3RhcnROb2RlICsgJy0nICsgZW5kTm9kZTtcbiAgICAgIGxldCByZWxhdGlvbnNoaXBWYWx1ZSA9IHRoaXMuZHJhd25SZWxhdGlvbnNoaXBbcmVsYXRpb25zaGlwS2V5XTtcbiAgICAgIGlmIChyZWxhdGlvbnNoaXBWYWx1ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHJlbGF0aW9uc2hpcE1vZGlmaWVkID0ge307XG4gICAgICAgIGNvbnN0IG9iaiA9IHJlbGF0aW9uc2hpcFZhbHVlLm9iajtcbiAgICAgICAgLy8gXG4gICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLm1lcmdlS2V5cyhvYmosIHJlbCk7XG4gICAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5ld1ZhbCA9IHRoaXMuYXNzaWduQXR0cmlidXRlcyhrZXksIG9iaiwgcmVsKTtcbiAgICAgICAgICBpZiAobmV3VmFsICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZWxhdGlvbnNoaXBNb2RpZmllZFtrZXldID0gdGhpcy5hc3NpZ25BdHRyaWJ1dGVzKGtleSwgb2JqLCByZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJlbGF0aW9uc2hpcFZhbHVlLm9iaiA9IHJlbGF0aW9uc2hpcE1vZGlmaWVkO1xuICAgICAgICByW3JlbGF0aW9uc2hpcFZhbHVlLnBvc10gPSByZWxhdGlvbnNoaXBNb2RpZmllZDtcbiAgICAgICAgc3BsaWNlVGhlbS5wdXNoKHJJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXduUmVsYXRpb25zaGlwW3JlbGF0aW9uc2hpcEtleV0gPSB7XG4gICAgICAgICAgcG9zOiBySW5kZXgsXG4gICAgICAgICAgb2JqOiByZWxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpY2VUaGVtLmZvckVhY2goIGluZGV4ID0+IHtcbiAgICAgIHIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbWVyZ2VLZXlzKG9iajEsIG9iajIpIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iajEpO1xuICAgIGtleXMgPSBrZXlzLmNvbmNhdChPYmplY3Qua2V5cyhvYmoyKSk7XG4gICAgcmV0dXJuIFsuLi5uZXcgU2V0KGtleXMpXTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzaWduQXR0cmlidXRlcyhrZXksIHJlbGF0aW9uc2hpcDEsIHJlbGF0aW9uc2hpcDIpIHtcbiAgICBpZiAoa2V5ID09PSAncHJvcGVydGllcycpIHtcbiAgICAgICAgY29uc3QgcHJvcDEgPSByZWxhdGlvbnNoaXAxLnByb3BlcnRpZXM7XG4gICAgICAgIGNvbnN0IHByb3AyID0gcmVsYXRpb25zaGlwMi5wcm9wZXJ0aWVzO1xuICAgICAgICBpZiAocHJvcDEgPT0gdW5kZWZpbmVkICYmIHByb3AyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9wMSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcDI7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvcDIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3AxO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLm1lcmdlS2V5cyhwcm9wMSwgcHJvcDIpO1xuICAgICAgICBsZXQgcHJvcCA9IHt9O1xuICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBwcm9wW2tleV0gPSB0aGlzLmFzc2lnbkF0dHJpYnV0ZXNWYWx1ZShrZXksIHByb3AxLCBwcm9wMik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvcDtcbiAgICB9IGVsc2UgaWYgKGtleSA9PSAndGFyZ2V0JyB8fCBrZXkgPT0gJ2xpbmtudW0nIHx8IGtleSA9PSAnc3RhcnROb2RlJyB8fCBrZXkgPT0gJ2VuZE5vZGUnKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwMVtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hc3NpZ25BdHRyaWJ1dGVzVmFsdWUoa2V5LCByZWxhdGlvbnNoaXAxLCByZWxhdGlvbnNoaXAyKTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzaWduQXR0cmlidXRlc1ZhbHVlKGtleSwgcmVsYXRpb25zaGlwMSwgcmVsYXRpb25zaGlwMikge1xuICAgIGxldCB2YWwxID0gcmVsYXRpb25zaGlwMVtrZXldO1xuICAgIGxldCB2YWwyID0gcmVsYXRpb25zaGlwMltrZXldO1xuICAgIGlmICh2YWwxICE9IHVuZGVmaW5lZCB8fCB2YWwyICE9IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHZhbDEgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDI7XG4gICAgICB9IGVsc2UgaWYgKHZhbDIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodmFsMSBpbnN0YW5jZW9mIEFycmF5IHx8IHZhbDIgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIGlmICghKHZhbDEgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgICAgdmFsMi5wdXNoKHZhbDEpO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKCEodmFsMiBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgICB2YWwxLnB1c2godmFsMik7XG4gICAgICAgICAgICAgIHJldHVybiB2YWwxO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsMS5jb25jYXQodmFsMik7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsMSBpbnN0YW5jZW9mIE9iamVjdCB8fCB2YWwyIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgaWYgKCEodmFsMSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgICAgIHZhbDIuY3VzdG9tX2tleV9hc3NpZ25lZCA9IHZhbDE7XG4gICAgICAgICAgICByZXR1cm4gdmFsMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKCEodmFsMiBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgICAgIHZhbDEuY3VzdG9tX2tleV9hc3NpZ25lZCA9IHZhbDI7XG4gICAgICAgICAgICByZXR1cm4gdmFsMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qga2V5cyA9IHRoaXMubWVyZ2VLZXlzKHZhbDEsIHZhbDIpO1xuICAgICAgICAgIGxldCBvYmogPSB7fTtcbiAgICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIG9ialtrZXldID0gdGhpcy5hc3NpZ25BdHRyaWJ1dGVzVmFsdWUoa2V5LCB2YWwxLCB2YWwyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWwxICsgJywgJyArIHZhbDI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxufVxuXG4iXX0=