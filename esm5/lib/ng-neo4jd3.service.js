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
            onNodeDragStart: undefined
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
            onNodeDragStart: undefined
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbmVvNGpkMy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbmVvNGpkMy8iLCJzb3VyY2VzIjpbImxpYi9uZy1uZW80amQzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7QUFFdEQ7SUErREU7UUExRE8saUJBQVksR0FBYSxLQUFLLENBQUM7UUFDOUIsYUFBUSxHQUFhLEtBQUssQ0FBQztRQXFCM0IsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQU1yQixZQUFPLEdBQXNCO1lBQ2pDLFNBQVMsRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDckIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsS0FBSyxFQUFFLFNBQVM7WUFDaEIsT0FBTyxFQUFFLEVBQUU7O1lBQ1gsUUFBUSxFQUFFLEVBQUU7WUFDWixNQUFNLEVBQUUsU0FBUztZQUNqQixTQUFTLEVBQUUsSUFBSTtZQUNmLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLG9CQUFvQixFQUFFLFNBQVM7WUFDL0IsVUFBVSxFQUFFLEVBQUU7WUFDZCxpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsU0FBUyxFQUFFLElBQUk7WUFDZixpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLGdCQUFnQixF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QUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ2pLLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ3JHLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDekYsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDckksY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDekosY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ2pQLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FB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QUM7O2dCQUNwRCxDQUFDLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7O2dCQUN2RCxhQUFhLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOztnQkFDOUUsYUFBYSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O2dCQUMxSCxhQUFhLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O2dCQUN4SSxhQUFhLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUs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Q0FBNEI7Ozs7O0lBQzVCLHNDQUEyQjs7Ozs7SUFDM0Isc0NBQXVCOzs7OztJQUN2QixvQ0FBNkI7Ozs7O0lBRTdCLGlDQUFjOzs7OztJQUVkLHdDQUE4Qjs7Ozs7SUFFOUIsbUNBd0JFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xuaW1wb3J0IHsgTmdOZW80akQzT3B0aW9ucywgUmVsYXRpb25zaGlwRW50ZXIgfSBmcm9tICcuL25nLW5lbzRqZDMubW9kZWwnO1xuaW1wb3J0IHsgTmdOZW80akQzSWNvbnMgfSBmcm9tICcuL25nLW5lbzRqZDMuaWNvbnMnO1xuaW1wb3J0IHsgTmVvNGpEM1JlY29yZHMgfSBmcm9tIFwiLi9uZy1uZW80amQzLnJlY29yZHNcIjtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdOZW80amQzU2VydmljZSB7XG5cbiAgcHVibGljIG91dE9mQ29udGV4dCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB2YWx1ZVNldCA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIGNvbnRhaW5lcjtcbiAgcHJpdmF0ZSBjb250YWluZXJJZGVudGl0eTtcbiAgcHJpdmF0ZSBpbmZvO1xuICBwcml2YXRlIG5vZGU7XG4gIHByaXZhdGUgbm9kZXM7XG5cbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXA7XG4gIHByaXZhdGUgcmVsYXRpb25zaGlwcyA6IEFycmF5PGFueT47XG4gIHByaXZhdGUgcmVsYXRpb25zaGlwT3V0bGluZTtcbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXBPdmVybGF5O1xuICBwcml2YXRlIHJlbGF0aW9uc2hpcFRleHQ7XG5cbiAgcHJpdmF0ZSBzaW11bGF0aW9uO1xuXG4gIHB1YmxpYyBzdmc7XG4gIHByaXZhdGUgc3ZnTm9kZXM7XG4gIHByaXZhdGUgc3ZnUmVsYXRpb25zaGlwcztcbiAgcHJpdmF0ZSBzdmdUcmFuc2xhdGU7XG4gIFxuICBwcml2YXRlIGNsYXNzZXMyY29sb3JzID0ge307XG4gIHByaXZhdGUganVzdExvYWRlZCA9IGZhbHNlO1xuICBwcml2YXRlIG51bUNsYXNzZXMgPSAwO1xuICBwcml2YXRlIHN2Z1NjYWxlID0gdW5kZWZpbmVkO1xuXG4gIHByaXZhdGUgbGFiZWw7XG5cbiAgcHJpdmF0ZSBvcHRpb25zSW5wdXQgOiBPYmplY3Q7XG5cbiAgcHJpdmF0ZSBvcHRpb25zIDogTmdOZW80akQzT3B0aW9ucyA9IHtcbiAgICAgIGFycm93U2l6ZTogNCxcbiAgICAgIGNvbG9yczogdGhpcy5jb2xvcnMoKSxcbiAgICAgIGhpZ2hsaWdodDogdW5kZWZpbmVkLFxuICAgICAgaWNvbnM6IHVuZGVmaW5lZCxcbiAgICAgIGljb25NYXA6IFtdLCAgICAvLyBUaGlzIHZhbHVlIGFzc2lnbmVkIGluIE5lbzRqUmFuZG9tXG4gICAgICBpbWFnZU1hcDoge30sXG4gICAgICBpbWFnZXM6IHVuZGVmaW5lZCxcbiAgICAgIGluZm9QYW5lbDogdHJ1ZSxcbiAgICAgIG1pbkNvbGxpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgbmVvNGpEYXRhOiB1bmRlZmluZWQsXG4gICAgICBuZW80akRhdGFVcmw6IHVuZGVmaW5lZCxcbiAgICAgIG5vZGVPdXRsaW5lRmlsbENvbG9yOiB1bmRlZmluZWQsXG4gICAgICBub2RlUmFkaXVzOiAyNSxcbiAgICAgIHJlbGF0aW9uc2hpcENvbG9yOiAnI2E1YWJiNicsXG4gICAgICB6b29tRml0OiBmYWxzZSxcbiAgICAgIHNob3dJY29uczogdHJ1ZSxcbiAgICAgIG9uTm9kZURvdWJsZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlTW91c2VFbnRlcjogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlTW91c2VMZWF2ZTogdW5kZWZpbmVkLFxuICAgICAgb25SZWxhdGlvbnNoaXBEb3VibGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlRHJhZ0VuZDogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlRHJhZ1N0YXJ0OiB1bmRlZmluZWRcbiAgfTtcblxuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBwdWJsaWMgc2V0VmFsdWVzIChfc2VsZWN0b3IsIF9vcHRpb25zOmFueSkgOiB2b2lkIHtcbiAgICAgIG5ldyBOZ05lbzRqRDNJY29ucyh0aGlzLm9wdGlvbnMpO1xuICAgICAgdGhpcy5jb250YWluZXJJZGVudGl0eSA9IF9zZWxlY3RvcjtcbiAgICAgIHRoaXMub3B0aW9uc0lucHV0ID0gX29wdGlvbnM7XG4gICAgICB0aGlzLnZhbHVlU2V0ID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBpc1ZhbHVlU2V0KCkgOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlU2V0O1xuICB9XG5cbiAgcHVibGljIGdldE9wdGlvbnNJbnB1dCgpIDogT2JqZWN0IHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNJbnB1dDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDb250YWluZXIoKSA6IE9iamVjdCB7XG4gICAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XG4gIH1cblxuXG4gIHB1YmxpYyBpbml0KCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gZDMuc2VsZWN0KHRoaXMuY29udGFpbmVySWRlbnRpdHkpO1xuICAgIHRoaXMuaW5pdEljb25NYXAodGhpcy5vcHRpb25zKTtcblxuICAgIHRoaXMubWVyZ2VQcm9wZXJ0eSh0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9uc0lucHV0KTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaWNvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNob3dJY29ucyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMubWluQ29sbGlzaW9uKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5taW5Db2xsaXNpb24gPSB0aGlzLm9wdGlvbnMubm9kZVJhZGl1cyAqIDI7XG4gICAgfVxuICAgIHRoaXMuaW5pdEltYWdlTWFwKHRoaXMub3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5hdHRyKCdjbGFzcycsICduZW80amQzJylcbiAgICAgICAgICAuaHRtbCgnJyk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmluZm9QYW5lbCkge1xuICAgICAgICB0aGlzLmluZm8gPSB0aGlzLmFwcGVuZEluZm9QYW5lbCh0aGlzLmNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5zdmcgPSB0aGlzLmFwcGVuZEdyYXBoKHRoaXMuY29udGFpbmVyKTtcblxuICAgIHRoaXMuc2ltdWxhdGlvbiA9IHRoaXMuaW5pdFNpbXVsYXRpb24oKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMubmVvNGpEYXRhKSB7XG4gICAgICAgIHRoaXMubG9hZE5lbzRqRGF0YSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLm5lbzRqRGF0YVVybCkge1xuICAgICAgICB0aGlzLmxvYWROZW80akRhdGFGcm9tVXJsKHRoaXMub3B0aW9ucy5uZW80akRhdGFVcmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBib3RoIG5lbzRqRGF0YSBhbmQgbmVvNGpEYXRhVXJsIGFyZSBlbXB0eSEnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICB9XG5cbiAgcHVibGljIGluaXRTaW11bGF0aW9uKCkge1xuXG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG5cbiAgICAgIHZhciBwYXJlbnRFbGVtZW50ID0gdGhpcy5zdmcubm9kZSgpLnBhcmVudEVsZW1lbnQ7XG4gICAgICBpZihwYXJlbnRFbGVtZW50PT11bmRlZmluZWQgfHwgcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50PT11bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNsaWVudFdpZHRoID0gdGhpcy5zdmcubm9kZSgpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDI7XG4gICAgICBjb25zdCBjbGllbnRIZWlnaHQgPSB0aGlzLnN2Zy5ub2RlKCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDI7XG5cbiAgICAgIHZhciBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKCkgXG4gICAgICAgICAgLy8gLnZlbG9jaXR5RGVjYXkoMC44KVxuICAgICAgICAgIC8vIC5mb3JjZSgneCcsIGQzLmZvcmNlKCkuc3RyZW5ndGgoMC4wMDIpKVxuICAgICAgICAgIC8vIC5mb3JjZSgneScsIGQzLmZvcmNlKCkuc3RyZW5ndGgoMC4wMDIpKVxuICAgICAgICAgIC5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLm9wdGlvbnMubWluQ29sbGlzaW9uO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLml0ZXJhdGlvbnMoMikpXG4gICAgICAgICAgLmZvcmNlKCdjaGFyZ2UnLCBkMy5mb3JjZU1hbnlCb2R5KCkpXG4gICAgICAgICAgLmZvcmNlKCdsaW5rJywgZDMuZm9yY2VMaW5rKCkuaWQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gZC5pZDtcbiAgICAgICAgICB9KSlcbiAgICAgICAgICAuZm9yY2UoJ2NlbnRlcicsIGQzLmZvcmNlQ2VudGVyKGNsaWVudFdpZHRoLCBjbGllbnRIZWlnaHQpKVxuICAgICAgICAgIC5vbigndGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB0aGlzT2JqLnRpY2soKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMuem9vbUZpdCAmJiAhdGhpc09iai5qdXN0TG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gRk9SIENVU1RPTUlaQVRJT05cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNpbXVsYXRpb247XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kR3JhcGgoY29udGFpbmVyKSB7XG4gICAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgICAgdmFyIHN2ZyA9IGNvbnRhaW5lci5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsICcxMDAlJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsICcxMDAlJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMtZ3JhcGgnKVxuICAgICAgICAgICAgICAgICAuY2FsbChkMy56b29tKCkub24oJ3pvb20nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZSA9IGQzLmV2ZW50LnRyYW5zZm9ybS5rLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSA9IFtkMy5ldmVudC50cmFuc2Zvcm0ueCwgZDMuZXZlbnQudHJhbnNmb3JtLnldO1xuXG4gICAgICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5zdmdUcmFuc2xhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVbMF0gKz0gdGhpc09iai5zdmdUcmFuc2xhdGVbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlWzFdICs9IHRoaXNPYmouc3ZnVHJhbnNsYXRlWzFdO1xuICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5zdmdTY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlICo9IHRoaXNPYmouc3ZnU2NhbGU7XG4gICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmouc3ZnLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHRyYW5zbGF0ZVswXSArICcsICcgKyB0cmFuc2xhdGVbMV0gKyAnKSBzY2FsZSgnICsgc2NhbGUgKyAnKScpO1xuICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgLm9uKCdkYmxjbGljay56b29tJywgbnVsbClcbiAgICAgICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsICcxMDAlJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsICcxMDAlJyk7XG5cbiAgICAgICAgICAgICAgICAgIHRoaXMuc3ZnUmVsYXRpb25zaGlwcyA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdyZWxhdGlvbnNoaXBzJyk7XG4gICAgICAgICAgICAgICAgICB0aGlzLnN2Z05vZGVzID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ25vZGVzJyk7XG4gICAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9QYW5lbChjb250YWluZXIpIHtcbiAgICAgIHJldHVybiBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMtaW5mbycpO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9FbGVtZW50KGNscywgaXNOb2RlLCBwcm9wZXJ0eSwgdmFsdWU9bnVsbCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLmluZm8uYXBwZW5kKCdhJyk7XG5cbiAgICAgIGVsZW0uYXR0cignaHJlZicsICcjJylcbiAgICAgIC5hdHRyKCdjbGFzcycsIGNscylcbiAgICAgIC5odG1sKCc8c3Ryb25nPicgKyBwcm9wZXJ0eSArICc8L3N0cm9uZz4nICsgKHZhbHVlID8gKCc6ICcgKyB2YWx1ZSkgOiAnJykpO1xuXG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICAgICAgICBlbGVtLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gdGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yIDogKGlzTm9kZSA/IHRoaXNPYmouY2xhc3MyY29sb3IocHJvcGVydHkpIDogdGhpc09iai5kZWZhdWx0Q29sb3IoKSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ2JvcmRlci1jb2xvcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3IodGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yKSA6IChpc05vZGUgPyB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKHByb3BlcnR5KSA6IHRoaXNPYmouZGVmYXVsdERhcmtlbkNvbG9yKCkpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN0eWxlKCdjb2xvcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3IodGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yKSA6ICcjZmZmJztcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvRWxlbWVudENsYXNzKGNscywgbm9kZSkge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudChjbHMsIHRydWUsIG5vZGUpO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9FbGVtZW50UHJvcGVydHkoY2xzLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCBmYWxzZSwgcHJvcGVydHksIHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvRWxlbWVudFJlbGF0aW9uc2hpcChjbHMsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudChjbHMsIGZhbHNlLCByZWxhdGlvbnNoaXApO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZE5vZGUoKSB7XG4gICAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMubm9kZS5lbnRlcigpXG4gICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICB2YXIgY2xhc3NlcyA9ICdub2RlJztcbiAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouaWNvbihkKSkge1xuICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaWNvbic7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouaW1hZ2UoZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgKz0gJyBub2RlLWltYWdlJztcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLmhpZ2hsaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzT2JqLm9wdGlvbnMuaGlnaGxpZ2h0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGlnaGxpZ2h0ID0gdGhpc09iai5vcHRpb25zLmhpZ2hsaWdodFtpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkLmxhYmVsc1swXSA9PT0gaGlnaGxpZ2h0LmNsYXNzICYmIGQucHJvcGVydGllc1toaWdobGlnaHQucHJvcGVydHldID09PSBoaWdobGlnaHQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaGlnaGxpZ2h0ZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXM7XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgZC5meCA9IGQuZnkgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vbk5vZGVDbGljayAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uTm9kZUNsaWNrKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgdGhpc09iai5zdGlja05vZGUoZCk7XG4gICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25Ob2RlRG91YmxlQ2xpY2sgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vbk5vZGVEb3VibGVDbGljayhkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLmluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLnVwZGF0ZUluZm8oZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uTm9kZU1vdXNlRW50ZXIgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vbk5vZGVNb3VzZUVudGVyKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouaW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmouY2xlYXJJbmZvKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uTm9kZU1vdXNlTGVhdmUgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vbk5vZGVNb3VzZUxlYXZlKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLmNhbGwoZDMuZHJhZygpXG4gICAgICAgICAgICAgICAgICAgICAub24oJ3N0YXJ0JywgIGZ1bmN0aW9uKGQpIHsgdGhpc09iai5kcmFnU3RhcnRlZChkKTsgfSApXG4gICAgICAgICAgICAgICAgICAgICAub24oJ2RyYWcnLCBmdW5jdGlvbihkKSB7IHRoaXNPYmouZHJhZ2dlZChkKTsgfSApXG4gICAgICAgICAgICAgICAgICAgICAub24oJ2VuZCcsIGZ1bmN0aW9uKGQpIHsgdGhpc09iai5kcmFnRW5kZWQoZCk7IH0gKSApO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZE5vZGVUb0dyYXBoKCkge1xuICAgICAgdmFyIG4gPSB0aGlzLmFwcGVuZE5vZGUoKTtcbiAgICAgIHRoaXMuYXBwZW5kUmluZ1RvTm9kZShuKTtcbiAgICAgIHRoaXMuYXBwZW5kT3V0bGluZVRvTm9kZShuKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWNvbnMpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZFRleHRUb05vZGUobik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmltYWdlcykge1xuICAgICAgICAgIHRoaXMuYXBwZW5kSW1hZ2VUb05vZGUobik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbjtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRPdXRsaW5lVG9Ob2RlKG5vZGUpIHtcbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdvdXRsaW5lJylcbiAgICAgICAgICAgICAuYXR0cigncicsIG9wdGlvbnMubm9kZVJhZGl1cylcbiAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA6IHRoaXNPYmouY2xhc3MyY29sb3IoZC5sYWJlbHNbMF0pO1xuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcihvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yKSA6IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3IoZC5sYWJlbHNbMF0pO1xuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLmFwcGVuZCgndGl0bGUnKS50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLnRvU3RyaW5nKGQpO1xuICAgICAgICAgICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGNsYXNzMmNvbG9yKGNscykge1xuICAgICAgdmFyIGNvbG9yID0gdGhpcy5jbGFzc2VzMmNvbG9yc1tjbHNdO1xuICAgICAgaWYgKCFjb2xvcikge1xuICAgICAgICAgIC8vIGNvbG9yID0gdGhpcy5vcHRpb25zLmNvbG9yc1tNYXRoLm1pbihudW1DbGFzc2VzLCB0aGlzLm9wdGlvbnMuY29sb3JzLmxlbmd0aCAtIDEpXTtcbiAgICAgICAgICBjb2xvciA9IHRoaXMub3B0aW9ucy5jb2xvcnNbdGhpcy5udW1DbGFzc2VzICUgdGhpcy5vcHRpb25zLmNvbG9ycy5sZW5ndGhdO1xuICAgICAgICAgIHRoaXMuY2xhc3NlczJjb2xvcnNbY2xzXSA9IGNvbG9yO1xuICAgICAgICAgIHRoaXMubnVtQ2xhc3NlcysrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbG9yO1xuICB9XG5cbiAgcHVibGljIGNsYXNzMmRhcmtlbkNvbG9yKGNscykge1xuICAgICAgdmFyIGNvbG9yVmFsdWUgPSB0aGlzLmNsYXNzMmNvbG9yKGNscyk7XG4gICAgICB0cnkge1xuICAgICAgICAgIC8vIENPTE9SIE9iamVjdCBpcyBub3Qgd29ya2luZyBwcm9wZXJseSB3aGVuIHRoZSBvcHRpbWl6YXRpb24gaXMgc2V0IHRydWVcbiAgICAgICAgICB2YXIgY29sb3JPYmplY3QgPSBkMy5yZ2IoY29sb3JWYWx1ZSk7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yT2JqZWN0LmRhcmtlcigxKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoKGVycikge31cbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRSaW5nVG9Ob2RlKG5vZGUpIHtcbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcbiAgICAgIHJldHVybiBub2RlLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAncmluZycpXG4gICAgICAgICAgLmF0dHIoJ3InLCB0aGlzLm9wdGlvbnMubm9kZVJhZGl1cyAqIDEuMTYpXG4gICAgICAgICAgLmFwcGVuZCgndGl0bGUnKS50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpc09iai50b1N0cmluZyhkKTtcbiAgICAgIH0pO1xuICB9XG5cblxuICBwdWJsaWMgYXBwZW5kSW1hZ2VUb05vZGUobm9kZSkge1xuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuICAgICAgLy8gVE9ETyA+PiBDaGFuZ2UgVGhpcyBUbyBCZWNvbWUgVGhlIENvbnRhaW5lclxuICAgICAgLy8gQWRkZWQgdGhlIFtpY29uRmxhZ10gYXR0cmlidXRlIGluIHRoZSBub2RlIG9yICdkJyB2YXJpYWJsZVxuICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCdpbWFnZScpLmF0dHIoJ3dpZHRoJywgJzM1cHgnKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgJzM1cHgnKS5hdHRyKCd4JywgJy0xOHB4JykuYXR0cigneScsICctMThweCcpXG4gICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgZnVuY3Rpb24oZCkgeyByZXR1cm4gdGhpc09iai5pbWFnZShkKTsgfSk7XG4gICAgIDtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRUZXh0VG9Ob2RlKG5vZGUpIHtcbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcbiAgICAgIHJldHVybiBub2RlLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgZnVuY3Rpb24oZCkgeyByZXR1cm4gJ3RleHQnICsgKHRoaXNPYmouaWNvbihkKSA/ICcgaWNvbicgOiAnJyk7IH0pXG4gICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgICAgIC5hdHRyKCdmb250LXNpemUnLCBmdW5jdGlvbihkKSB7IHJldHVybiAodGhpc09iai5pY29uKGQpID8gJzI1cHgnIDogJzEycHgnKTsgfSlcbiAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbihkKSB7IHJldHVybiAodGhpc09iai5pY29uKGQpID8gJzI1cHgnIDogJzMwcHgnKTsgfSlcbiAgICAgICAgICAuYXR0cigneScsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICh0aGlzT2JqLmljb24oZCkgPyAnMjVweCcgOiAnMzBweCcpOyB9KVxuICAgICAgICAgIC5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgY29uc3QgcmdiID0gJ2ZpbGw6IHJnYigyMjUsIDIyNSwgMjI1KTsgc3Ryb2tlOiByZ2IoMDAwLCAwMDAsIDAwMCk7JztcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmouaWNvbihkKSA/IHJnYiA6ICcnO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmh0bWwoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICB2YXIgX2ljb24gPSB0aGlzT2JqLmljb24oZCk7XG4gICAgICAgICAgICAgIHJldHVybiBfaWNvbiA/ICcmI3gnICsgX2ljb24gOiBkLmlkO1xuICAgICAgICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFJhbmRvbURhdGFUb05vZGUoZCwgbWF4Tm9kZXNUb0dlbmVyYXRlKSB7XG4gICAgICB2YXIgZGF0YSA9IHRoaXMucmFuZG9tRDNEYXRhKGQsIG1heE5vZGVzVG9HZW5lcmF0ZSk7XG4gICAgICB0aGlzLnVwZGF0ZVdpdGhOZW80akRhdGEoZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kUmVsYXRpb25zaGlwKCkge1xuICAgICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICAgIC8vIEZ1bmN0aW9uID4gRG91YmxlIENsaWNrIFxuICAgICAgY29uc3QgZm5Eb3VibGVDbGljayA9IGZ1bmN0aW9uKGQ6YW55KSB7XG4gICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uUmVsYXRpb25zaGlwRG91YmxlQ2xpY2soZCk7XG4gICAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIC8vIEZ1bmN0aW9uID4gTW91c2UgRW50ZXJcbiAgICAgIGNvbnN0IGZuTW91c2VFbnRlciA9IGZ1bmN0aW9uKGQ6YW55KSB7XG4gICAgICAgICAgaWYgKHRoaXNPYmouaW5mbykge1xuICAgICAgICAgICAgICB0aGlzT2JqLnVwZGF0ZUluZm8oZCk7XG4gICAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLnJlbGF0aW9uc2hpcC5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3JlbGF0aW9uc2hpcCcpLm9uKCdkYmxjbGljaycsIGZuRG91YmxlQ2xpY2spLm9uKCdtb3VzZWVudGVyJywgZm5Nb3VzZUVudGVyKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhckluZm8oKSB7XG4gICAgICB0aGlzLmluZm8uaHRtbCgnJyk7XG4gIH1cblxuICBwdWJsaWMgY29sb3IoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbG9yc1t0aGlzLm9wdGlvbnMuY29sb3JzLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkgPDwgMF07XG4gIH1cblxuICBwdWJsaWMgY29sb3JzKCkgOiBBcnJheTxTdHJpbmc+IHtcbiAgICAgIC8vIGQzLnNjaGVtZUNhdGVnb3J5MTAsXG4gICAgICAvLyBkMy5zY2hlbWVDYXRlZ29yeTIwLFxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAnIzY4YmRmNicsIC8vIGxpZ2h0IGJsdWVcbiAgICAgICAgICAnIzZkY2U5ZScsIC8vIGdyZWVuICMxXG4gICAgICAgICAgJyNmYWFmYzInLCAvLyBsaWdodCBwaW5rXG4gICAgICAgICAgJyNmMmJhZjYnLCAvLyBwdXJwbGVcbiAgICAgICAgICAnI2ZmOTI4YycsIC8vIGxpZ2h0IHJlZFxuICAgICAgICAgICcjZmNlYTdlJywgLy8gbGlnaHQgeWVsbG93XG4gICAgICAgICAgJyNmZmM3NjYnLCAvLyBsaWdodCBvcmFuZ2VcbiAgICAgICAgICAnIzQwNWY5ZScsIC8vIG5hdnkgYmx1ZVxuICAgICAgICAgICcjYTVhYmI2JywgLy8gZGFyayBncmF5XG4gICAgICAgICAgJyM3OGNlY2InLCAvLyBncmVlbiAjMixcbiAgICAgICAgICAnI2I4OGNiYicsIC8vIGRhcmsgcHVycGxlXG4gICAgICAgICAgJyNjZWQyZDknLCAvLyBsaWdodCBncmF5XG4gICAgICAgICAgJyNlODQ2NDYnLCAvLyBkYXJrIHJlZFxuICAgICAgICAgICcjZmE1Zjg2JywgLy8gZGFyayBwaW5rXG4gICAgICAgICAgJyNmZmFiMWEnLCAvLyBkYXJrIG9yYW5nZVxuICAgICAgICAgICcjZmNkYTE5JywgLy8gZGFyayB5ZWxsb3dcbiAgICAgICAgICAnIzc5N2I4MCcsIC8vIGJsYWNrXG4gICAgICAgICAgJyNjOWQ5NmYnLCAvLyBwaXN0YWNjaGlvXG4gICAgICAgICAgJyM0Nzk5MWYnLCAvLyBncmVlbiAjM1xuICAgICAgICAgICcjNzBlZGVlJywgLy8gdHVycXVvaXNlXG4gICAgICAgICAgJyNmZjc1ZWEnICAvLyBwaW5rXG4gICAgICBdO1xuICB9XG5cbiAgcHVibGljIGNvbnRhaW5zUmVzdWx0KGFycmF5LCBpZCkge1xuICAgICAgdmFyIGZpbHRlciA9IGFycmF5LmZpbHRlcihmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW0uaWQgPT09IGlkO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmlsdGVyLmxlbmd0aCA+IDA7XG4gIH1cblxuICBwdWJsaWMgZGVmYXVsdENvbG9yKCkge1xuICByZXR1cm4gdGhpcy5vcHRpb25zLnJlbGF0aW9uc2hpcENvbG9yO1xuICB9XG5cbiAgcHVibGljIGRlZmF1bHREYXJrZW5Db2xvcigpIHtcbiAgICAgIHZhciBjb2xvclZhbHVlID0gdGhpcy5vcHRpb25zLmNvbG9yc1t0aGlzLm9wdGlvbnMuY29sb3JzLmxlbmd0aCAtIDFdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBDT0xPUiBPYmplY3QgaXMgbm90IHdvcmtpbmcgcHJvcGVybHkgd2hlbiB0aGUgb3B0aW1pemF0aW9uIGlzIHNldCB0cnVlXG4gICAgICAgICAgdmFyIGNvbG9yT2JqZWN0ID0gZDMucmdiKGNvbG9yVmFsdWUpO1xuICAgICAgICAgIHJldHVybiBjb2xvck9iamVjdC5kYXJrZXIoMSk7XG4gICAgICB9XG4gICAgICBjYXRjaChlcnIpIHsgfVxuICB9XG5cbiAgcHVibGljIGRyYWdFbmRlZChkKSB7XG4gICAgICBpZiAoIWQzLmV2ZW50LmFjdGl2ZSkge1xuICAgICAgICAgIHRoaXMuc2ltdWxhdGlvbi5hbHBoYVRhcmdldCgwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbk5vZGVEcmFnRW5kICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25Ob2RlRHJhZ0VuZChkKTtcbiAgICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkcmFnZ2VkKGQpIHtcbiAgICAgIHRoaXMuc3RpY2tOb2RlKGQpO1xuICB9XG5cbiAgcHVibGljIGRyYWdTdGFydGVkKGQpIHtcbiAgICAgIGlmICghZDMuZXZlbnQuYWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5zaW11bGF0aW9uLmFscGhhVGFyZ2V0KDAuMykucmVzdGFydCgpO1xuICAgICAgfVxuICAgICAgZC5meCA9IGQueDtcbiAgICAgIGQuZnkgPSBkLnk7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm9uTm9kZURyYWdTdGFydCAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uTm9kZURyYWdTdGFydChkKTtcbiAgICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBleHRlbmQob2JqMSwgb2JqMikge1xuICAgIHZhciBvYmogPSB7fTtcbiAgICB0aGlzLm1lcmdlUHJvcGVydHkob2JqLCBvYmoxKTtcbiAgICB0aGlzLm1lcmdlUHJvcGVydHkob2JqLCBvYmoyKTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cblxuICBwdWJsaWMgaWNvbihkKSB7XG4gICAgdmFyIGNvZGU7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmljb25NYXAgJiYgdGhpcy5vcHRpb25zLnNob3dJY29ucyAmJiB0aGlzLm9wdGlvbnMuaWNvbnMpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV0gJiYgdGhpcy5vcHRpb25zLmljb25NYXBbdGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXV0pIHtcbiAgICAgICAgICAgIGNvZGUgPSB0aGlzLm9wdGlvbnMuaWNvbk1hcFt0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dXTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuaWNvbk1hcFtkLmxhYmVsc1swXV0pIHtcbiAgICAgICAgICAgIGNvZGUgPSB0aGlzLm9wdGlvbnMuaWNvbk1hcFtkLmxhYmVsc1swXV07XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXSkge1xuICAgICAgICAgICAgY29kZSA9IHRoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29kZTtcbiAgfVxuXG4gIHB1YmxpYyBpbWFnZShkKSB7XG4gICAgdmFyIGksIGltYWdlc0ZvckxhYmVsLCBpbWcsIGltZ0xldmVsLCBsYWJlbCwgbGFiZWxQcm9wZXJ0eVZhbHVlLCBwcm9wZXJ0eSwgdmFsdWU7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmltYWdlcykge1xuICAgICAgICBjb25zdCBpbWdSZWYgPSBkLmltZz09dW5kZWZpbmVkID8gZC5sYWJlbHNbMF0gOiBkLmltZztcbiAgICAgICAgaW1hZ2VzRm9yTGFiZWwgPSB0aGlzLm9wdGlvbnMuaW1hZ2VNYXBbaW1nUmVmXTtcblxuICAgICAgICBpZiAoaW1hZ2VzRm9yTGFiZWwpIHtcbiAgICAgICAgICAgIGltZ0xldmVsID0gMDtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGltYWdlc0ZvckxhYmVsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGFiZWxQcm9wZXJ0eVZhbHVlID0gaW1hZ2VzRm9yTGFiZWxbaV0uc3BsaXQoJ3wnKTtcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAobGFiZWxQcm9wZXJ0eVZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbGFiZWxQcm9wZXJ0eVZhbHVlWzJdO1xuICAgICAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBsYWJlbFByb3BlcnR5VmFsdWVbMV07XG4gICAgICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGxhYmVsUHJvcGVydHlWYWx1ZVswXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaW1nUmVmID09PSBsYWJlbCAmJlxuICAgICAgICAgICAgICAgICAgICAoIXByb3BlcnR5IHx8IGQucHJvcGVydGllc1twcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkgJiZcbiAgICAgICAgICAgICAgICAgICAgKCF2YWx1ZSB8fCBkLnByb3BlcnRpZXNbcHJvcGVydHldID09PSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGggPiBpbWdMZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gdGhpcy5vcHRpb25zLmltYWdlc1tpbWFnZXNGb3JMYWJlbFtpXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWdMZXZlbCA9IGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW1nO1xuICB9XG5cbiAgcHVibGljIGxvYWROZW80akRhdGEoKSB7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgIHRoaXMucmVsYXRpb25zaGlwcyA9IFtdO1xuICAgIHRoaXMudXBkYXRlV2l0aE5lbzRqRGF0YSh0aGlzLm9wdGlvbnMubmVvNGpEYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkTmVvNGpEYXRhRnJvbVVybChuZW80akRhdGFVcmwpIHtcbiAgICB0aGlzLm5vZGVzID0gW107XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBzID0gW107XG5cbiAgICBkMy5qc29uKG5lbzRqRGF0YVVybCwgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVdpdGhOZW80akRhdGEoZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmVvNGpEYXRhVG9EM0RhdGEoZGF0YSkge1xuICAgIHZhciBncmFwaCA9IHtcbiAgICAgICAgbm9kZXM6IFtdLFxuICAgICAgICByZWxhdGlvbnNoaXBzOiBbXVxuICAgIH07XG5cbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIGRhdGEucmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICByZXN1bHQuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuZ3JhcGgubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzT2JqLmNvbnRhaW5zUmVzdWx0KGdyYXBoLm5vZGVzLCBub2RlLmlkKSkge1xuICAgICAgICAgICAgICAgICAgICBncmFwaC5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMuZm9yRWFjaChmdW5jdGlvbihyZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAuc291cmNlID0gcmVsYXRpb25zaGlwLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAudGFyZ2V0ID0gcmVsYXRpb25zaGlwLmVuZE5vZGU7XG4gICAgICAgICAgICAgICAgZ3JhcGgucmVsYXRpb25zaGlwcy5wdXNoKHJlbGF0aW9uc2hpcCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIGlmIChhLnNvdXJjZSA+IGIuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYS5zb3VyY2UgPCBiLnNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEudGFyZ2V0ID4gYi50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGEudGFyZ2V0IDwgYi50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgIT09IDAgJiYgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLnNvdXJjZSA9PT0gZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ktMV0uc291cmNlICYmIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpXS50YXJnZXQgPT09IGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpLTFdLnRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaV0ubGlua251bSA9IGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpIC0gMV0ubGlua251bSArIDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLmxpbmtudW0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoZCkge1xuICAgIHZhciBzID0gZC5sYWJlbHMgPyBkLmxhYmVsc1swXSA6IGQudHlwZTtcbiAgICBzICs9ICcgKDxpZD46ICcgKyBkLmlkO1xuICAgIE9iamVjdC5rZXlzKGQucHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICBzICs9ICcsICcgKyBwcm9wZXJ0eSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShkLnByb3BlcnRpZXNbcHJvcGVydHldKTtcbiAgICB9KTtcbiAgICBzICs9ICcpJztcbiAgICByZXR1cm4gcztcbiAgfVxuXG4gIHB1YmxpYyByYW5kb21EM0RhdGEoZCwgbWF4Tm9kZXNUb0dlbmVyYXRlKSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIG5vZGVzOiBbXSxcbiAgICAgICAgcmVsYXRpb25zaGlwczogW11cbiAgICB9O1xuXG4gICAgdmFyIG51bU5vZGVzID0gKG1heE5vZGVzVG9HZW5lcmF0ZSAqIE1hdGgucmFuZG9tKCkgPDwgMCkgKyAxO1xuICAgIHZhciBzID0gdGhpcy5zaXplKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU5vZGVzOyBpKyspIHtcbiAgICAgIC8vIHZhciBpY29ucyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5pY29uTWFwKTtcbiAgICAgIGNvbnN0IGxhYmVsID0gXCJIZWxsb1wiOyAvLyBpY29uc1tpY29ucy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpIDw8IDBdO1xuXG4gICAgICBjb25zdCBub2RlID0ge1xuICAgICAgICAgIGlkOiBzLm5vZGVzICsgMSArIGksXG4gICAgICAgICAgbGFiZWxzOiBbbGFiZWxdLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcmFuZG9tOiBsYWJlbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeDogZC54LFxuICAgICAgICAgIHk6IGQueVxuICAgICAgfTtcblxuICAgICAgZGF0YS5ub2Rlc1tkYXRhLm5vZGVzLmxlbmd0aF0gPSBub2RlO1xuXG4gICAgICBjb25zdCByZWxhdGlvbnNoaXAgPSB7XG4gICAgICAgICAgaWQ6IHMucmVsYXRpb25zaGlwcyArIDEgKyBpLFxuICAgICAgICAgIHR5cGU6IGxhYmVsLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgc3RhcnROb2RlOiBkLmlkLFxuICAgICAgICAgIGVuZE5vZGU6IHMubm9kZXMgKyAxICsgaSxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGZyb206IERhdGUubm93KClcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNvdXJjZTogZC5pZCxcbiAgICAgICAgICB0YXJnZXQ6IHMubm9kZXMgKyAxICsgaSxcbiAgICAgICAgICBsaW5rbnVtOiBzLnJlbGF0aW9uc2hpcHMgKyAxICsgaVxuICAgICAgfTtcblxuICAgICAgZGF0YS5yZWxhdGlvbnNoaXBzW2RhdGEucmVsYXRpb25zaGlwcy5sZW5ndGhdID0gcmVsYXRpb25zaGlwO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBzaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBub2RlczogdGhpcy5ub2Rlcy5sZW5ndGgsXG4gICAgICByZWxhdGlvbnNoaXBzOiB0aGlzLnJlbGF0aW9uc2hpcHMubGVuZ3RoXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBzdGlja05vZGUoZCkge1xuICAgIGQuZnggPSBkMy5ldmVudC54O1xuICAgIGQuZnkgPSBkMy5ldmVudC55O1xuICB9XG5cbiAgcHVibGljIHRpY2soKSB7XG4gICAgdGhpcy50aWNrTm9kZXMoKTtcbiAgICB0aGlzLnRpY2tSZWxhdGlvbnNoaXBzKCk7XG4gIH1cblxuICBwdWJsaWMgdGlja05vZGVzKCkge1xuICAgIGlmICh0aGlzLm5vZGUpIHtcbiAgICAgIHRoaXMubm9kZS5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIGlmKGQhPXVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCAnICsgZC55ICsgJyknO1xuICAgICAgICBjb25zdCBtc2cgPSBcIj09PT09PT09PT4+Pj4+Pj4+Pj4+Pj4+IEVSUk9SID4+IHRpY2tOb2Rlc1wiO1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRpY2tSZWxhdGlvbnNoaXBzKCkge1xuICAgIGlmICh0aGlzLnJlbGF0aW9uc2hpcCkge1xuICAgICAgY29uc3QgdGhpc09iaiA9IHRoaXM7XG4gICAgICB0aGlzLnJlbGF0aW9uc2hpcC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIGlmKGQhPXVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBhbmdsZSA9IHRoaXNPYmoucm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KTtcbiAgICAgICAgICBpZihkLnNvdXJjZSE9dW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC5zb3VyY2UueCArICcsICcgKyBkLnNvdXJjZS55ICsgJykgcm90YXRlKCcgKyBhbmdsZSArICcpJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbXNnID0gXCI9PT09PT09PT0+Pj4+Pj4+Pj4+Pj4+PiBFUlJPUiA+PiB0aWNrUmVsYXRpb25zaGlwc1wiO1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgICAgIFxuICAgICAgfSk7XG4gICAgICB0aGlzLnRpY2tSZWxhdGlvbnNoaXBzVGV4dHMoKTtcbiAgICAgIHRoaXMudGlja1JlbGF0aW9uc2hpcHNPdXRsaW5lcygpO1xuICAgICAgdGhpcy50aWNrUmVsYXRpb25zaGlwc092ZXJsYXlzKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRpY2tSZWxhdGlvbnNoaXBzT3V0bGluZXMoKSB7XG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICB0aGlzLnJlbGF0aW9uc2hpcC5lYWNoKCAocmVsYXRpb25zaGlwLCBpbmRleCwgZykgPT4ge1xuICAgICAgdmFyIG9iaiA9IGdbaW5kZXhdO1xuICAgICAgdmFyIHJlbCA9IGQzLnNlbGVjdChvYmopO1xuICAgICAgdmFyIG91dGxpbmU7XG4gICAgICB0cnkge291dGxpbmUgPSByZWwuc2VsZWN0KCcub3V0bGluZScpO31cbiAgICAgIGNhdGNoKGVycikgeyByZXR1cm47IH1cbiAgICAgIFxuICAgICAgdmFyIHRleHQgPSByZWwuc2VsZWN0KCcudGV4dCcpO1xuICAgICAgXG4gICAgICB0cnkge3ZhciBiYm94ID0gdGV4dC5ub2RlKCkuZ2V0QkJveCgpO31cbiAgICAgIGNhdGNoKGVycikgeyByZXR1cm47IH1cblxuICAgICAgdmFyIHBhZGRpbmcgPSAzO1xuXG4gICAgICBvdXRsaW5lLmF0dHIoJ2QnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpc09iai5vcHRpb25zO1xuICAgICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXG4gICAgICAgICAgYW5nbGUgPSB0aGlzT2JqLnJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgdGV4dEJvdW5kaW5nQm94ID0gdGV4dC5ub2RlKCkuZ2V0QkJveCgpLFxuICAgICAgICAgIHRleHRQYWRkaW5nID0gNSxcbiAgICAgICAgICB1ID0gdGhpc09iai51bml0YXJ5VmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgdGV4dE1hcmdpbiA9IHsgeDogKGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKHRleHRCb3VuZGluZ0JveC53aWR0aCArIHRleHRQYWRkaW5nKSAqIHUueCkgKiAwLjUsIHk6IChkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtICh0ZXh0Qm91bmRpbmdCb3gud2lkdGggKyB0ZXh0UGFkZGluZykgKiB1LnkpICogMC41IH0sXG4gICAgICAgICAgbiA9IHRoaXNPYmoudW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEExID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogMCArICh0aGlzT2JqLm9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gbi54LCB5OiAwICsgKHRoaXNPYmoub3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEIxID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogdGV4dE1hcmdpbi54IC0gbi54LCB5OiB0ZXh0TWFyZ2luLnkgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEMxID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogdGV4dE1hcmdpbi54LCB5OiB0ZXh0TWFyZ2luLnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEQxID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogMCArIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCwgeTogMCArIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QTIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIHRleHRNYXJnaW4ueCAtIG4ueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSB0ZXh0TWFyZ2luLnkgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEIyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSBuLnggLSB1LnggKiBvcHRpb25zLmFycm93U2l6ZSwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSBuLnkgLSB1LnkgKiBvcHRpb25zLmFycm93U2l6ZSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QzIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIG4ueCArIChuLnggLSB1LngpICogb3B0aW9ucy5hcnJvd1NpemUsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IC0gbi55ICsgKG4ueSAtIHUueSkgKiBvcHRpb25zLmFycm93U2l6ZSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RDIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEUyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggKyAoLSBuLnggLSB1LngpICogb3B0aW9ucy5hcnJvd1NpemUsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55ICsgKC0gbi55IC0gdS55KSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRGMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gdS54ICogb3B0aW9ucy5hcnJvd1NpemUsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IC0gdS55ICogb3B0aW9ucy5hcnJvd1NpemUgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEcyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSB0ZXh0TWFyZ2luLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gdGV4dE1hcmdpbi55IH0sIGFuZ2xlKTtcblxuICAgICAgICByZXR1cm4gJ00gJyArIHJvdGF0ZWRQb2ludEExLnggKyAnICcgKyByb3RhdGVkUG9pbnRBMS55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEIxLnggKyAnICcgKyByb3RhdGVkUG9pbnRCMS55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEMxLnggKyAnICcgKyByb3RhdGVkUG9pbnRDMS55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEQxLnggKyAnICcgKyByb3RhdGVkUG9pbnREMS55ICtcbiAgICAgICAgICAnIFogTSAnICsgcm90YXRlZFBvaW50QTIueCArICcgJyArIHJvdGF0ZWRQb2ludEEyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QjIueCArICcgJyArIHJvdGF0ZWRQb2ludEIyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QzIueCArICcgJyArIHJvdGF0ZWRQb2ludEMyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RDIueCArICcgJyArIHJvdGF0ZWRQb2ludEQyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RTIueCArICcgJyArIHJvdGF0ZWRQb2ludEUyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RjIueCArICcgJyArIHJvdGF0ZWRQb2ludEYyLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RzIueCArICcgJyArIHJvdGF0ZWRQb2ludEcyLnkgK1xuICAgICAgICAgICcgWic7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyKSB7IHJldHVybjsgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb3V0bGluZUZ1bmN0aW9uKGQsIHRleHQpIHtcbiAgICAgIFxuICB9XG5cbiAgcHVibGljIHRpY2tSZWxhdGlvbnNoaXBzT3ZlcmxheXMoKSB7XG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICB0aGlzLnJlbGF0aW9uc2hpcE92ZXJsYXkuYXR0cignZCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfSxcbiAgICAgICAgYW5nbGUgPSB0aGlzT2JqLnJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgIG4xID0gdGhpc09iai51bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgIG4gPSB0aGlzT2JqLnVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0LCA1MCksXG4gICAgICAgIHJvdGF0ZWRQb2ludEEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwIC0gbi54LCB5OiAwIC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgcm90YXRlZFBvaW50QiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gbi54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgIHJvdGF0ZWRQb2ludEMgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCArIG4ueCAtIG4xLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55ICsgbi55IC0gbjEueSB9LCBhbmdsZSksXG4gICAgICAgIHJvdGF0ZWRQb2ludEQgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwICsgbi54IC0gbjEueCwgeTogMCArIG4ueSAtIG4xLnkgfSwgYW5nbGUpO1xuXG4gICAgICByZXR1cm4gJ00gJyArIHJvdGF0ZWRQb2ludEEueCArICcgJyArIHJvdGF0ZWRQb2ludEEueSArXG4gICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50Qi54ICsgJyAnICsgcm90YXRlZFBvaW50Qi55ICtcbiAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRDLnggKyAnICcgKyByb3RhdGVkUG9pbnRDLnkgK1xuICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEQueCArICcgJyArIHJvdGF0ZWRQb2ludEQueSArXG4gICAgICAgICcgWic7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdGlja1JlbGF0aW9uc2hpcHNUZXh0cygpIHtcbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIHRoaXMucmVsYXRpb25zaGlwVGV4dC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgYW5nbGUgPSAodGhpc09iai5yb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpICsgMzYwKSAlIDM2MCxcbiAgICAgICAgbWlycm9yID0gYW5nbGUgPiA5MCAmJiBhbmdsZSA8IDI3MCxcbiAgICAgICAgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXG4gICAgICAgIG4gPSB0aGlzT2JqLnVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgbldlaWdodCA9IG1pcnJvciA/IDIgOiAtMyxcbiAgICAgICAgcG9pbnQgPSB7IHg6IChkLnRhcmdldC54IC0gZC5zb3VyY2UueCkgKiAwLjUgKyBuLnggKiBuV2VpZ2h0LCB5OiAoZC50YXJnZXQueSAtIGQuc291cmNlLnkpICogMC41ICsgbi55ICogbldlaWdodCB9LFxuICAgICAgICByb3RhdGVkUG9pbnQgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgcG9pbnQsIGFuZ2xlKTtcblxuICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIHJvdGF0ZWRQb2ludC54ICsgJywgJyArIHJvdGF0ZWRQb2ludC55ICsgJykgcm90YXRlKCcgKyAobWlycm9yID8gMTgwIDogMCkgKyAnKSc7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdW5pdGFyeU5vcm1hbFZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoPTEpIHtcbiAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH07XG4gICAgdmFyIHZlY3RvciA9IHRoaXMudW5pdGFyeVZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoKTtcbiAgICByZXR1cm4gdGhpcy5yb3RhdGVQb2ludChjZW50ZXIsIHZlY3RvciwgOTApO1xuICB9XG5cbiAgcHVibGljIHVuaXRhcnlWZWN0b3Ioc291cmNlLCB0YXJnZXQsIG5ld0xlbmd0aD0xKSB7XG4gICAgdmFyIGxlbmd0aCA9IE1hdGguc3FydChNYXRoLnBvdyh0YXJnZXQueCAtIHNvdXJjZS54LCAyKSArIE1hdGgucG93KHRhcmdldC55IC0gc291cmNlLnksIDIpKSAvIE1hdGguc3FydChuZXdMZW5ndGggfHwgMSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICh0YXJnZXQueCAtIHNvdXJjZS54KSAvIGxlbmd0aCxcbiAgICAgIHk6ICh0YXJnZXQueSAtIHNvdXJjZS55KSAvIGxlbmd0aCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgb2JzZWxldGUgYW5kIG5vdCB1c2VkIGFueSB3aGVyZVxuICAgKiBAb2JzZWxldGVcbiAgICogQHBhcmFtIGQzRGF0YVxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVdpdGhEM0RhdGEoZDNEYXRhKSB7XG4gICAgdGhpcy51cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMoZDNEYXRhLm5vZGVzLCBkM0RhdGEucmVsYXRpb25zaGlwcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGRhdGEgZm9yIE5lbzRqIFZpc3VhbGl6YXRpb25cbiAgICogQHBhcmFtIG5lbzRqRGF0YSBcbiAgICovXG4gIHB1YmxpYyB1cGRhdGVXaXRoTmVvNGpEYXRhKG5lbzRqRGF0YSkge1xuICAgIHZhciBkM0RhdGEgPSB0aGlzLm5lbzRqRGF0YVRvRDNEYXRhKG5lbzRqRGF0YSk7XG4gICAgdGhpcy51cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMoZDNEYXRhLm5vZGVzLCBkM0RhdGEucmVsYXRpb25zaGlwcyk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlSW5mbyhkKSB7XG4gICAgdGhpcy5jbGVhckluZm8oKTtcblxuICAgIGlmIChkLmxhYmVscykge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudENsYXNzKCdjbGFzcycsIGQubGFiZWxzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudFJlbGF0aW9uc2hpcCgnY2xhc3MnLCBkLnR5cGUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eSgncHJvcGVydHknLCAnJmx0O2lkJmd0OycsIGQuaWQpO1xuICAgIFxuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgT2JqZWN0LmtleXMoZC5wcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICB0aGlzT2JqLmFwcGVuZEluZm9FbGVtZW50UHJvcGVydHkoJ3Byb3BlcnR5JywgcHJvcGVydHksIEpTT04uc3RyaW5naWZ5KGQucHJvcGVydGllc1twcm9wZXJ0eV0pKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVOb2RlcyhuKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5ub2Rlcywgbik7XG5cbiAgICB0aGlzLm5vZGUgPSB0aGlzLnN2Z05vZGVzLnNlbGVjdEFsbCgnLm5vZGUnKS5kYXRhKHRoaXMubm9kZXMsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7IH0pO1xuICAgIHZhciBub2RlRW50ZXIgPSB0aGlzLmFwcGVuZE5vZGVUb0dyYXBoKCk7XG4gICAgdGhpcy5ub2RlID0gbm9kZUVudGVyLm1lcmdlKHRoaXMubm9kZSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlTm9kZXNBbmRSZWxhdGlvbnNoaXBzKG4sIHIpIHtcbiAgICB0aGlzLnVwZGF0ZVJlbGF0aW9uc2hpcHMocik7XG4gICAgdGhpcy51cGRhdGVOb2RlcyhuKTtcblxuICAgIHRoaXMuc2ltdWxhdGlvbi5ub2Rlcyh0aGlzLm5vZGVzKTtcbiAgICB0aGlzLnNpbXVsYXRpb24uZm9yY2UoJ2xpbmsnKS5saW5rcyh0aGlzLnJlbGF0aW9uc2hpcHMpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZVJlbGF0aW9uc2hpcHMocikge1xuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMucmVsYXRpb25zaGlwcywgcik7XG5cbiAgICB0aGlzLnJlbGF0aW9uc2hpcCA9IHRoaXMuc3ZnUmVsYXRpb25zaGlwcy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAnKS5kYXRhKHRoaXMucmVsYXRpb25zaGlwcywgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSk7XG4gICAgdmFyIHJlbGF0aW9uc2hpcCA9IHRoaXMuYXBwZW5kUmVsYXRpb25zaGlwKCk7XG5cbiAgICB2YXIgcmVsYXRpb25zaGlwRW50ZXIgOiBSZWxhdGlvbnNoaXBFbnRlciA9IHRoaXMuYXBwZW5kUmVsYXRpb25zaGlwVG9HcmFwaChyZWxhdGlvbnNoaXApO1xuICAgIHRoaXMucmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRW50ZXIucmVsYXRpb25zaGlwLm1lcmdlKHRoaXMucmVsYXRpb25zaGlwKTtcblxuICAgIHRoaXMucmVsYXRpb25zaGlwT3V0bGluZSA9IHRoaXMuc3ZnLnNlbGVjdEFsbCgnLnJlbGF0aW9uc2hpcCAub3V0bGluZScpO1xuICAgIHRoaXMucmVsYXRpb25zaGlwT3V0bGluZSA9IHJlbGF0aW9uc2hpcEVudGVyLm91dGxpbmUubWVyZ2UodGhpcy5yZWxhdGlvbnNoaXBPdXRsaW5lKTtcblxuICAgIHRoaXMucmVsYXRpb25zaGlwT3ZlcmxheSA9IHRoaXMuc3ZnLnNlbGVjdEFsbCgnLnJlbGF0aW9uc2hpcCAub3ZlcmxheScpO1xuICAgIHRoaXMucmVsYXRpb25zaGlwT3ZlcmxheSA9IHJlbGF0aW9uc2hpcEVudGVyLm92ZXJsYXkubWVyZ2UodGhpcy5yZWxhdGlvbnNoaXBPdmVybGF5KTtcblxuICAgIHRoaXMucmVsYXRpb25zaGlwVGV4dCA9IHRoaXMuc3ZnLnNlbGVjdEFsbCgnLnJlbGF0aW9uc2hpcCAudGV4dCcpO1xuICAgIHRoaXMucmVsYXRpb25zaGlwVGV4dCA9IHJlbGF0aW9uc2hpcEVudGVyLnRleHQubWVyZ2UodGhpcy5yZWxhdGlvbnNoaXBUZXh0KTtcbiAgfVxuXG5cblxuXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vICAgICAgICAgICAgTmVvNGogVXRpbFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG5cbiAgcHVibGljIGdldE9wdGlvbnNQcmVzZW50YXRpb24oKSA6IE5nTmVvNGpEM09wdGlvbnMge1xuICAgIHJldHVybiB7XG4gICAgICBhcnJvd1NpemU6IDQsXG4gICAgICBjb2xvcnM6IHVuZGVmaW5lZCxcbiAgICAgIGhpZ2hsaWdodDogW1xuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdQcm9qZWN0JyxcbiAgICAgICAgICBwcm9wZXJ0eTogJ25hbWUnLFxuICAgICAgICAgIHZhbHVlOiAnbmVvNGpkMydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAnVXNlcicsXG4gICAgICAgICAgcHJvcGVydHk6ICd1c2VySWQnLFxuICAgICAgICAgIHZhbHVlOiAnZWlzbWFuJ1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgaWNvbnM6IE5nTmVvNGpEM0ljb25zLmV4YW1wbGVJY29ucygpLFxuICAgICAgaW1hZ2VzOiBOZ05lbzRqRDNJY29ucy5leGFtcGxlSW1hZ2VzKCksXG4gICAgICBpY29uTWFwOiB1bmRlZmluZWQsICAgIC8vIFRoaXMgdmFsdWUgYXNzaWduZWQgaW4gTmVvNGpSYW5kb21cbiAgICAgIGltYWdlTWFwOiB1bmRlZmluZWQsXG4gICAgICBpbmZvUGFuZWw6IHRydWUsXG4gICAgICBtaW5Db2xsaXNpb246IDYwLFxuICAgICAgbmVvNGpEYXRhOiBOZW80akQzUmVjb3JkcyxcbiAgICAgIG5vZGVPdXRsaW5lRmlsbENvbG9yOiB1bmRlZmluZWQsXG4gICAgICBuZW80akRhdGFVcmw6IHVuZGVmaW5lZCxcbiAgICAgIG5vZGVSYWRpdXM6IDI1LFxuICAgICAgcmVsYXRpb25zaGlwQ29sb3I6ICcjYTVhYmI2JyxcbiAgICAgIG9uUmVsYXRpb25zaGlwRG91YmxlQ2xpY2s6IGZ1bmN0aW9uKHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZG91YmxlIGNsaWNrIG9uIHJlbGF0aW9uc2hpcDogJyArIEpTT04uc3RyaW5naWZ5KHJlbGF0aW9uc2hpcCkpO1xuICAgICAgfSxcbiAgICAgIHpvb21GaXQ6IHRydWUsXG4gICAgICBzaG93SWNvbnM6IHRydWUsXG4gICAgICBvbk5vZGVEb3VibGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZU1vdXNlRW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZU1vdXNlTGVhdmU6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZURyYWdFbmQ6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZURyYWdTdGFydDogdW5kZWZpbmVkXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyByb3RhdGVQb2ludChjLCBwLCBhbmdsZSkge1xuICAgIHJldHVybiB0aGlzLnJvdGF0ZShjLngsIGMueSwgcC54LCBwLnksIGFuZ2xlKTtcbiAgfVxuXG4gIHB1YmxpYyByb3RhdGlvbihzb3VyY2UsIHRhcmdldCkge1xuICAgIHJldHVybiBNYXRoLmF0YW4yKHRhcmdldC55IC0gc291cmNlLnksIHRhcmdldC54IC0gc291cmNlLngpICogMTgwIC8gTWF0aC5QSTtcbiAgfVxuXG4gIHB1YmxpYyByb3RhdGUoY3gsIGN5LCB4LCB5LCBhbmdsZSkge1xuICAgIHZhciByYWRpYW5zID0gKE1hdGguUEkgLyAxODApICogYW5nbGUsXG4gICAgICAgIGNvcyA9IE1hdGguY29zKHJhZGlhbnMpLFxuICAgICAgICBzaW4gPSBNYXRoLnNpbihyYWRpYW5zKSxcbiAgICAgICAgbnggPSAoY29zICogKHggLSBjeCkpICsgKHNpbiAqICh5IC0gY3kpKSArIGN4LFxuICAgICAgICBueSA9IChjb3MgKiAoeSAtIGN5KSkgLSAoc2luICogKHggLSBjeCkpICsgY3k7XG5cbiAgICByZXR1cm4geyB4OiBueCwgeTogbnkgfTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0SWNvbk1hcChvcHRpb25zKSB7XG4gICAgT2JqZWN0LmtleXMob3B0aW9ucy5pY29uTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgpIHtcbiAgICAgIHZhciBrZXlzID0ga2V5LnNwbGl0KCcsJyk7XG4gICAgICB2YXIgdmFsdWUgPSBvcHRpb25zLmljb25NYXBba2V5XTtcblxuICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBvcHRpb25zLmljb25NYXBba2V5XSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9wdGlvbnMuaWNvbk1hcDtcbiAgfVxuXG4gIHB1YmxpYyBpbml0SW1hZ2VNYXAob3B0aW9ucykge1xuICAgIC8vIHZhciBrZXksIGtleXMsIHNlbGVjdG9yO1xuICAgIHZhciBrZXksIGtleXM7XG4gICAgZm9yIChrZXkgaW4gb3B0aW9ucy5pbWFnZXMpIHtcbiAgICAgIGlmIChvcHRpb25zLmltYWdlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGtleXMgPSBrZXkuc3BsaXQoJ3wnKTtcbiAgICAgICAgaWYgKCFvcHRpb25zLmltYWdlTWFwW2tleXNbMF1dKSB7XG4gICAgICAgICAgb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXSA9IFtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wdGlvbnMuaW1hZ2VNYXBba2V5c1swXV0ucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFwcGVuZFRleHRUb1JlbGF0aW9uc2hpcChyKSB7XG4gICAgdmFyIHJUZXh0ID0gci5hcHBlbmQoJ3RleHQnKTtcbiAgICByZXR1cm4gclRleHQuYXR0cignY2xhc3MnLCAndGV4dCcpLmF0dHIoJ2ZpbGwnLCAnIzAwMDAwMCcpLmF0dHIoJ2ZvbnQtc2l6ZScsICc4cHgnKS5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50eXBlOyB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRSZWxhdGlvbnNoaXBUb0dyYXBoKHJlbGF0aW9uc2hpcCkgOiBSZWxhdGlvbnNoaXBFbnRlciB7XG4gICAgdmFyIHRleHQgPSB0aGlzLmFwcGVuZFRleHRUb1JlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApO1xuICAgIHZhciBvdXRsaW5lID0gcmVsYXRpb25zaGlwLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ291dGxpbmUnKS5hdHRyKCdmaWxsJywgJyNhNWFiYjYnKS5hdHRyKCdzdHJva2UnLCAnbm9uZScpO1xuICAgIHZhciBvdmVybGF5ID0gcmVsYXRpb25zaGlwLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ292ZXJsYXknKTtcblxuICAgIC8vIHRoaXMucmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwO1xuICAgIHJldHVybiB7XG4gICAgICBvdXRsaW5lOiBvdXRsaW5lLFxuICAgICAgb3ZlcmxheTogb3ZlcmxheSxcbiAgICAgIHJlbGF0aW9uc2hpcDogcmVsYXRpb25zaGlwLFxuICAgICAgdGV4dDogdGV4dFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgbWVyZ2VQcm9wZXJ0eSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgY29uc3Qgc291cmNlUHJvcGVydHkgPSBzb3VyY2VbcHJvcGVydHldO1xuICAgICAgaWYoc291cmNlUHJvcGVydHkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmKCEoc291cmNlUHJvcGVydHkgaW5zdGFuY2VvZiBBcnJheSkpXG4gICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICAgIGVsc2UgaWYoc291cmNlUHJvcGVydHkubGVuZ3RoPjApXG4gICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdmVyc2lvbigpIHtcbiAgICByZXR1cm4gXCIxLjAuMFwiO1xuICB9XG59XG5cbiJdfQ==