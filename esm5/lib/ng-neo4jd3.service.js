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
        return node.append('image').attr('width', '35px').attr('height', '35px').attr('x', '-18px').attr('y', '-18px')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbmVvNGpkMy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbmVvNGpkMy8iLCJzb3VyY2VzIjpbImxpYi9uZy1uZW80amQzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7QUFFdEQ7SUErREU7UUExRE8saUJBQVksR0FBYSxLQUFLLENBQUM7UUFDOUIsYUFBUSxHQUFhLEtBQUssQ0FBQztRQXFCM0IsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQU1yQixZQUFPLEdBQXNCO1lBQ2pDLFNBQVMsRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDckIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsS0FBSyxFQUFFLFNBQVM7WUFDaEIsT0FBTyxFQUFFLEVBQUU7O1lBQ1gsUUFBUSxFQUFFLEVBQUU7WUFDWixNQUFNLEVBQUUsU0FBUztZQUNqQixTQUFTLEVBQUUsSUFBSTtZQUNmLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLG9CQUFvQixFQUFFLFNBQVM7WUFDL0IsVUFBVSxFQUFFLEVBQUU7WUFDZCxpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsU0FBUyxFQUFFLElBQUk7WUFDZixpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLGdCQUFnQixFQUFFLFNBQVM7WUFDM0IsZ0JBQWdCLEVBQUUsU0FBUztZQUMzQix5QkFBeUIsRUFBRSxTQUFTO1lBQ3BDLGFBQWEsRUFBRSxTQUFTO1lBQ3hCLGVBQWUsRUFBRSxTQUFTO1NBQzdCLENBQUM7SUFHYSxDQUFDOzs7Ozs7SUFFVCxvQ0FBUzs7Ozs7SUFBaEIsVUFBa0IsU0FBUyxFQUFFLFFBQVk7UUFDckMsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7UUFDbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQzs7OztJQUVNLHFDQUFVOzs7SUFBakI7UUFDSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQzs7OztJQUVNLDBDQUFlOzs7SUFBdEI7UUFDSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQzs7OztJQUVNLHVDQUFZOzs7SUFBbkI7UUFDSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQzs7OztJQUdNLCtCQUFJOzs7SUFBWDtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXBELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ2pDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztTQUMzRDtRQUNELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWhDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUM7YUFDaEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWhCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNwRDtRQUVELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFNUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUN4QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7YUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3hEO2FBQU07WUFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7U0FDdEU7UUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQzs7OztJQUVNLHlDQUFjOzs7SUFBckI7O1lBRVEsT0FBTyxHQUFHLElBQUk7O1lBRWQsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsYUFBYTtRQUNqRCxJQUFHLGFBQWEsSUFBRSxTQUFTLElBQUksYUFBYSxDQUFDLGFBQWEsSUFBRSxTQUFTLEVBQUU7WUFDbkUsT0FBTztTQUNWOztZQUVLLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFHLENBQUM7O1lBQ3pFLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLENBQUM7O1lBRTdFLFVBQVUsR0FBRyxFQUFFLENBQUMsZUFBZSxFQUFFO1lBQ2pDLHNCQUFzQjtZQUN0QiwwQ0FBMEM7WUFDMUMsMENBQTBDO2FBQ3pDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU07Ozs7UUFBQyxVQUFTLENBQUM7WUFDakQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUN4QyxDQUFDLEVBQUM7YUFDRCxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZCxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUNuQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFOzs7O1FBQUMsVUFBUyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNoQixDQUFDLEVBQUMsQ0FBQzthQUNGLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDMUQsRUFBRSxDQUFDLE1BQU07OztRQUFFO1lBQ1IsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLENBQUMsRUFBQzthQUNELEVBQUUsQ0FBQyxLQUFLOzs7UUFBRTtZQUNQLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO2dCQUNsRCxvQkFBb0I7YUFDckI7UUFDTCxDQUFDLEVBQUM7UUFDTixPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDOzs7OztJQUVNLHNDQUFXOzs7O0lBQWxCLFVBQW1CLFNBQVM7O1lBQ3BCLE9BQU8sR0FBc0IsSUFBSTs7WUFDakMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ3JCLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO2FBQ3JCLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO2FBQ3RCLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDO2FBQzlCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07OztRQUFFOztnQkFDbkIsS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7O2dCQUM1QixTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBRTVELElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDdEIsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzNDO1lBRUQsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUNsQixLQUFLLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQzthQUM3QjtZQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNoSCxDQUFDLEVBQUMsQ0FBQzthQUNGLEVBQUUsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDO2FBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQzthQUNyQixJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7SUFFTSwwQ0FBZTs7OztJQUF0QixVQUF1QixTQUFTO1FBQzVCLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDakIsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7Ozs7OztJQUVNLDRDQUFpQjs7Ozs7OztJQUF4QixVQUF5QixHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFVO1FBQVYsc0JBQUEsRUFBQSxZQUFVOztZQUNsRCxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBRWhDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQzthQUNyQixJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQzthQUNsQixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsR0FBRyxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTNFLElBQUksQ0FBQyxLQUFLLEVBQUU7O2dCQUNKLE9BQU8sR0FBc0IsSUFBSTtZQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQjs7OztZQUFFLFVBQVMsQ0FBQztnQkFDckMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDM0osQ0FBQyxFQUFDO2lCQUNELEtBQUssQ0FBQyxjQUFjOzs7O1lBQUUsVUFBUyxDQUFDO2dCQUM3QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7WUFDbE0sQ0FBQyxFQUFDO2lCQUNELEtBQUssQ0FBQyxPQUFPOzs7O1lBQUUsVUFBUyxDQUFDO2dCQUN0QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUMzSCxDQUFDLEVBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQzs7Ozs7O0lBRU0saURBQXNCOzs7OztJQUE3QixVQUE4QixHQUFHLEVBQUUsSUFBSTtRQUNuQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7Ozs7O0lBRU0sb0RBQXlCOzs7Ozs7SUFBaEMsVUFBaUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLO1FBQ2pELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RCxDQUFDOzs7Ozs7SUFFTSx3REFBNkI7Ozs7O0lBQXBDLFVBQXFDLEdBQUcsRUFBRSxZQUFZO1FBQ2xELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3JELENBQUM7Ozs7SUFFTSxxQ0FBVTs7O0lBQWpCOztZQUNRLE9BQU8sR0FBc0IsSUFBSTtRQUNyQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsT0FBTzs7OztRQUFFLFVBQVMsQ0FBQzs7Z0JBQ2pCLE9BQU8sR0FBRyxNQUFNO1lBQ3BCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDakIsT0FBTyxJQUFJLFlBQVksQ0FBQzthQUMzQjtZQUNELElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbEIsT0FBTyxJQUFJLGFBQWEsQ0FBQzthQUM1QjtZQUNELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7Z0JBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O3dCQUNqRCxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUU5QyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLENBQUMsS0FBSyxFQUFFO3dCQUN6RixPQUFPLElBQUksbUJBQW1CLENBQUM7d0JBQy9CLE1BQU07cUJBQ1Q7aUJBQ0o7YUFDSjtZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUMsRUFBQzthQUNELEVBQUUsQ0FBQyxPQUFPOzs7O1FBQUUsVUFBUyxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDbkIsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxTQUFTLEVBQUc7Z0JBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xDO1FBQ04sQ0FBQyxFQUFDO2FBQ0QsRUFBRSxDQUFDLFVBQVU7Ozs7UUFBRSxVQUFTLENBQUM7WUFDdEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLElBQUksU0FBUyxFQUFHO2dCQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3hDO1FBQ04sQ0FBQyxFQUFDO2FBQ0QsRUFBRSxDQUFDLFlBQVk7Ozs7UUFBRSxVQUFTLENBQUM7WUFDdkIsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekI7WUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLElBQUksU0FBUyxFQUFHO2dCQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZDO1FBQ04sQ0FBQyxFQUFDO2FBQ0QsRUFBRSxDQUFDLFlBQVk7Ozs7UUFBRSxVQUFTLENBQUM7WUFDdkIsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUN2QjtZQUNELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxTQUFTLEVBQUc7Z0JBQ2hELE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkM7UUFDTixDQUFDLEVBQUM7YUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRTthQUNOLEVBQUUsQ0FBQyxPQUFPOzs7O1FBQUcsVUFBUyxDQUFDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTthQUN0RCxFQUFFLENBQUMsTUFBTTs7OztRQUFFLFVBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7YUFDaEQsRUFBRSxDQUFDLEtBQUs7Ozs7UUFBRSxVQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQztJQUN4RSxDQUFDOzs7O0lBRU0sNENBQWlCOzs7SUFBeEI7O1lBQ1EsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1QjtRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDckIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDOzs7OztJQUVNLDhDQUFtQjs7OztJQUExQixVQUEyQixJQUFJOztZQUN2QixPQUFPLEdBQUcsSUFBSTs7WUFDZCxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU87UUFDMUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQzthQUNwQixJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQzthQUN4QixJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUM7YUFDN0IsS0FBSyxDQUFDLE1BQU07Ozs7UUFBRSxVQUFTLENBQUM7WUFDckIsT0FBTyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUcsQ0FBQyxFQUFDO2FBQ0QsS0FBSyxDQUFDLFFBQVE7Ozs7UUFBRSxVQUFTLENBQUM7WUFDdkIsT0FBTyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzSSxDQUFDLEVBQUM7YUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSTs7OztRQUFDLFVBQVMsQ0FBQztZQUMzQixPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxFQUFDLENBQUM7SUFDZCxDQUFDOzs7OztJQUVNLHNDQUFXOzs7O0lBQWxCLFVBQW1CLEdBQUc7O1lBQ2QsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDUixxRkFBcUY7WUFDckYsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDakMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7Ozs7SUFFTSw0Q0FBaUI7Ozs7SUFBeEIsVUFBeUIsR0FBRzs7WUFDcEIsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO1FBQ3RDLElBQUk7OztnQkFFSSxXQUFXLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDcEMsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTSxHQUFHLEVBQUUsR0FBRTtJQUNqQixDQUFDOzs7OztJQUVNLDJDQUFnQjs7OztJQUF2QixVQUF3QixJQUFJOztZQUNwQixPQUFPLEdBQUcsSUFBSTtRQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO2FBQ3ZCLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO2FBQ3JCLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2FBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJOzs7O1FBQUMsVUFBUyxDQUFDO1lBQ2hDLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7O0lBR00sNENBQWlCOzs7O0lBQXhCLFVBQXlCLElBQUk7O1lBQ3JCLE9BQU8sR0FBRyxJQUFJO1FBQ2xCLDhDQUE4QztRQUM5Qyw2REFBNkQ7UUFDN0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO2FBQzdHLElBQUksQ0FBQyxZQUFZOzs7O1FBQUUsVUFBUyxDQUFDLElBQUksT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7UUFDL0QsQ0FBQztJQUNKLENBQUM7Ozs7O0lBRU0sMkNBQWdCOzs7O0lBQXZCLFVBQXdCLElBQUk7O1lBQ3BCLE9BQU8sR0FBRyxJQUFJO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDckIsSUFBSSxDQUFDLE9BQU87Ozs7UUFBRSxVQUFTLENBQUMsSUFBSSxPQUFPLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7YUFDaEYsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7YUFDckIsSUFBSSxDQUFDLFdBQVc7Ozs7UUFBRSxVQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQzthQUM5RSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDO2FBQzlCLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDO2FBQzdCLElBQUksQ0FBQyxHQUFHOzs7O1FBQUUsVUFBUyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7YUFDdEUsSUFBSSxDQUFDLEdBQUc7Ozs7UUFBRSxVQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQzthQUN0RSxJQUFJLENBQUMsT0FBTzs7OztRQUFFLFVBQVMsQ0FBQzs7Z0JBQ2YsR0FBRyxHQUFHLHVEQUF1RDtZQUNuRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RDLENBQUMsRUFBQzthQUNELElBQUk7Ozs7UUFBQyxVQUFTLENBQUM7O2dCQUNSLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4QyxDQUFDLEVBQUMsQ0FBQztJQUNYLENBQUM7Ozs7OztJQUVNLGlEQUFzQjs7Ozs7SUFBN0IsVUFBOEIsQ0FBQyxFQUFFLGtCQUFrQjs7WUFDM0MsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDO1FBQ25ELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7O0lBRU0sNkNBQWtCOzs7SUFBekI7O1lBQ1EsT0FBTyxHQUFzQixJQUFJOzs7WUFFL0IsYUFBYTs7OztRQUFHLFVBQVMsQ0FBSztZQUNoQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMseUJBQXlCLElBQUksU0FBUyxFQUFHO2dCQUN6RCxPQUFPLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hEO1FBQ0wsQ0FBQyxDQUFBOzs7WUFFSyxZQUFZOzs7O1FBQUcsVUFBUyxDQUFLO1lBQy9CLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDZCxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pCO1FBQ0wsQ0FBQyxDQUFBO1FBQ0QsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUM1SSxDQUFDOzs7O0lBRU0sb0NBQVM7OztJQUFoQjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Ozs7SUFFTSxnQ0FBSzs7O0lBQVo7UUFDSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQzs7OztJQUVNLGlDQUFNOzs7SUFBYjtRQUNJLHVCQUF1QjtRQUN2Qix1QkFBdUI7UUFDdkIsT0FBTztZQUNILFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUyxDQUFFLE9BQU87U0FDckIsQ0FBQztJQUNOLENBQUM7Ozs7OztJQUVNLHlDQUFjOzs7OztJQUFyQixVQUFzQixLQUFLLEVBQUUsRUFBRTs7WUFDdkIsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNOzs7O1FBQUMsVUFBUyxJQUFJO1lBQ25DLE9BQU8sSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDMUIsQ0FBQyxFQUFDO1FBQ0YsT0FBTyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDOzs7O0lBRU0sdUNBQVk7OztJQUFuQjtRQUNBLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztJQUN0QyxDQUFDOzs7O0lBRU0sNkNBQWtCOzs7SUFBekI7O1lBQ1EsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDcEUsSUFBSTs7O2dCQUVJLFdBQVcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztZQUNwQyxPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEM7UUFDRCxPQUFNLEdBQUcsRUFBRSxHQUFHO0lBQ2xCLENBQUM7Ozs7O0lBRU0sb0NBQVM7Ozs7SUFBaEIsVUFBaUIsQ0FBQztRQUNkLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQztRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksU0FBUyxFQUFHO1lBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQzs7Ozs7SUFFTSxrQ0FBTzs7OztJQUFkLFVBQWUsQ0FBQztRQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQzs7Ozs7SUFFTSxzQ0FBVzs7OztJQUFsQixVQUFtQixDQUFDO1FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUM5QztRQUNELENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLElBQUksU0FBUyxFQUFHO1lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25DO0lBQ0wsQ0FBQzs7Ozs7O0lBRU0saUNBQU07Ozs7O0lBQWIsVUFBYyxJQUFJLEVBQUUsSUFBSTs7WUFDbEIsR0FBRyxHQUFHLEVBQUU7UUFDWixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Ozs7O0lBR00sK0JBQUk7Ozs7SUFBWCxVQUFZLENBQUM7O1lBQ1AsSUFBSTtRQUVSLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDdEUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzFGLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoRTtpQkFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDMUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM1QztpQkFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxQztTQUNKO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzs7OztJQUVNLGdDQUFLOzs7O0lBQVosVUFBYSxDQUFDOztZQUNSLENBQUM7O1lBQUUsY0FBYzs7WUFBRSxHQUFHOztZQUFFLFFBQVE7O1lBQUUsS0FBSzs7WUFBRSxrQkFBa0I7O1lBQUUsUUFBUTs7WUFBRSxLQUFLO1FBRWhGLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7O2dCQUNmLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUc7WUFDckQsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRS9DLElBQUksY0FBYyxFQUFFO2dCQUNoQixRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUViLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDeEMsa0JBQWtCLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFbEQsUUFBUSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUU7d0JBQy9CLEtBQUssQ0FBQzs0QkFDTixLQUFLLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlCLG1CQUFtQjt3QkFDbkIsS0FBSyxDQUFDOzRCQUNOLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakMsbUJBQW1CO3dCQUNuQixLQUFLLENBQUM7NEJBQ04sS0FBSyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNqQztvQkFFRCxJQUFJLE1BQU0sS0FBSyxLQUFLO3dCQUNoQixDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxDQUFDO3dCQUNuRCxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7d0JBQzlDLElBQUksa0JBQWtCLENBQUMsTUFBTSxHQUFHLFFBQVEsRUFBRTs0QkFDdEMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM3QyxRQUFRLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO3lCQUN4QztxQkFDSjtpQkFDSjthQUNKO1NBQ0o7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Ozs7SUFFTSx3Q0FBYTs7O0lBQXBCO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkQsQ0FBQzs7Ozs7SUFFTSwrQ0FBb0I7Ozs7SUFBM0IsVUFBNEIsWUFBWTtRQUN0QyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUV4QixFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVk7Ozs7O1FBQUUsVUFBUyxLQUFLLEVBQUUsSUFBSTtZQUN0QyxJQUFJLEtBQUssRUFBRTtnQkFDUCxNQUFNLEtBQUssQ0FBQzthQUNmO1lBQ0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFFTSw0Q0FBaUI7Ozs7SUFBeEIsVUFBeUIsSUFBSTs7WUFDdkIsS0FBSyxHQUFHO1lBQ1IsS0FBSyxFQUFFLEVBQUU7WUFDVCxhQUFhLEVBQUUsRUFBRTtTQUNwQjs7WUFFRyxPQUFPLEdBQXNCLElBQUk7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPOzs7O1FBQUMsVUFBUyxNQUFNO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTzs7OztZQUFDLFVBQVMsSUFBSTtnQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTzs7OztnQkFBQyxVQUFTLElBQUk7b0JBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO3dCQUMvQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDMUI7Z0JBQ0wsQ0FBQyxFQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTzs7OztnQkFBQyxVQUFTLFlBQVk7b0JBQ2xELFlBQVksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQztvQkFDN0MsWUFBWSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDO29CQUMzQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDM0MsQ0FBQyxFQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSTs7Ozs7Z0JBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQztvQkFDdkMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUU7d0JBQ3JCLE9BQU8sQ0FBQyxDQUFDO3FCQUNaO3lCQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO3dCQUM1QixPQUFPLENBQUMsQ0FBQyxDQUFDO3FCQUNiO3lCQUFNO3dCQUNILElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFOzRCQUNyQixPQUFPLENBQUMsQ0FBQzt5QkFDWjt3QkFFRCxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTs0QkFDckIsT0FBTyxDQUFDLENBQUMsQ0FBQzt5QkFDYjs2QkFBTTs0QkFDSCxPQUFPLENBQUMsQ0FBQzt5QkFDWjtxQkFDSjtnQkFDTCxDQUFDLEVBQUMsQ0FBQztnQkFFSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7d0JBQ3ZLLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztxQkFDckY7eUJBQU07d0JBQ0gsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztxQkFDM0M7aUJBQ0o7WUFDTCxDQUFDLEVBQUMsQ0FBQztRQUNQLENBQUMsRUFBQyxDQUFDO1FBRUgsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7OztJQUVNLG1DQUFROzs7O0lBQWYsVUFBZ0IsQ0FBQzs7WUFDWCxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDdkMsQ0FBQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFTLFFBQVE7WUFDL0MsQ0FBQyxJQUFJLElBQUksR0FBRyxRQUFRLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsRUFBQyxDQUFDO1FBQ0gsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUNULE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7Ozs7O0lBRU0sdUNBQVk7Ozs7O0lBQW5CLFVBQW9CLENBQUMsRUFBRSxrQkFBa0I7O1lBQ25DLElBQUksR0FBRztZQUNQLEtBQUssRUFBRSxFQUFFO1lBQ1QsYUFBYSxFQUFFLEVBQUU7U0FDcEI7O1lBRUcsUUFBUSxHQUFHLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7O1lBQ3hELENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBRW5CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7OztnQkFFM0IsS0FBSyxHQUFHLE9BQU87OztnQkFFZixJQUFJLEdBQUc7Z0JBQ1QsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDZixVQUFVLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLEtBQUs7aUJBQ2hCO2dCQUNELENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDTixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDVDtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7O2dCQUUvQixZQUFZLEdBQUc7Z0JBQ2pCLEVBQUUsRUFBRSxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRTtnQkFDekIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNmLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUN4QixVQUFVLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7aUJBQ25CO2dCQUNELE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDWixNQUFNLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDdkIsT0FBTyxFQUFFLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUM7YUFDbkM7WUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDO1NBQzlEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzs7O0lBRU0sK0JBQUk7OztJQUFYO1FBQ0UsT0FBTztZQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07WUFDeEIsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTTtTQUN6QyxDQUFDO0lBQ0osQ0FBQzs7Ozs7SUFFTSxvQ0FBUzs7OztJQUFoQixVQUFpQixDQUFDO1FBQ2hCLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDOzs7O0lBRU0sK0JBQUk7OztJQUFYO1FBQ0UsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFTSxvQ0FBUzs7O0lBQWhCO1FBQ0UsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVzs7OztZQUFFLFVBQVMsQ0FBQztnQkFDcEMsSUFBRyxDQUFDLElBQUUsU0FBUztvQkFDWCxPQUFPLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7b0JBQzNDLEdBQUcsR0FBRyw0Q0FBNEM7Z0JBQ3hELE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxFQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Ozs7SUFFTSw0Q0FBaUI7OztJQUF4QjtRQUNFLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTs7Z0JBQ2YsU0FBTyxHQUFHLElBQUk7WUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVzs7OztZQUFFLFVBQVMsQ0FBQztnQkFDNUMsSUFBRyxDQUFDLElBQUUsU0FBUyxFQUFFOzt3QkFDWCxLQUFLLEdBQUcsU0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQ2hELElBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBRSxTQUFTLEVBQUU7d0JBQ3RCLE9BQU8sWUFBWSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxXQUFXLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztxQkFDbEY7aUJBQ0Y7O29CQUNLLEdBQUcsR0FBRyxvREFBb0Q7Z0JBQ2hFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFdkIsQ0FBQyxFQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztTQUNsQztJQUNILENBQUM7Ozs7SUFFTSxvREFBeUI7OztJQUFoQzs7WUFDTSxPQUFPLEdBQXNCLElBQUk7UUFDckMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJOzs7Ozs7UUFBRSxVQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsQ0FBQzs7Z0JBQ3pDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztnQkFDZCxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7O2dCQUNwQixPQUFPO1lBQ1gsSUFBSTtnQkFBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUFDO1lBQ3ZDLE9BQU0sR0FBRyxFQUFFO2dCQUFFLE9BQU87YUFBRTs7Z0JBRWxCLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUU5QixJQUFJOztvQkFBSyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRTthQUFFO1lBQ3ZDLE9BQU0sR0FBRyxFQUFFO2dCQUFFLE9BQU87YUFBRTs7Z0JBRWxCLE9BQU8sR0FBRyxDQUFDO1lBRWYsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHOzs7O1lBQUUsVUFBUyxDQUFDO2dCQUMxQixJQUFJOzt3QkFDQSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87O3dCQUN6QixNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7O3dCQUN6QixLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7O3dCQUM1QyxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRTs7d0JBQ3ZDLFdBQVcsR0FBRyxDQUFDOzt3QkFDZixDQUFDLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7O3dCQUM3QyxVQUFVLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRTs7d0JBQ25MLENBQUMsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDOzt3QkFDbkQsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDakssY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDckcsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUN6RixjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUNySSxjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUN6SixjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDalAsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFD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Qzs7Z0JBQ3BELENBQUMsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQzs7Z0JBQ3ZELGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7O2dCQUM5RSxhQUFhLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7Z0JBQzFILGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7Z0JBQ3hJLGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxD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QUE0Qjs7Ozs7SUFDNUIsc0NBQTJCOzs7OztJQUMzQixzQ0FBdUI7Ozs7O0lBQ3ZCLG9DQUE2Qjs7Ozs7SUFFN0IsaUNBQWM7Ozs7O0lBRWQsd0NBQThCOzs7OztJQUU5QixtQ0F3QkUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XG5pbXBvcnQgeyBOZ05lbzRqRDNPcHRpb25zLCBSZWxhdGlvbnNoaXBFbnRlciB9IGZyb20gJy4vbmctbmVvNGpkMy5tb2RlbCc7XG5pbXBvcnQgeyBOZ05lbzRqRDNJY29ucyB9IGZyb20gJy4vbmctbmVvNGpkMy5pY29ucyc7XG5pbXBvcnQgeyBOZW80akQzUmVjb3JkcyB9IGZyb20gXCIuL25nLW5lbzRqZDMucmVjb3Jkc1wiO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ05lbzRqZDNTZXJ2aWNlIHtcblxuICBwdWJsaWMgb3V0T2ZDb250ZXh0IDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHZhbHVlU2V0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgY29udGFpbmVyO1xuICBwcml2YXRlIGNvbnRhaW5lcklkZW50aXR5O1xuICBwcml2YXRlIGluZm87XG4gIHByaXZhdGUgbm9kZTtcbiAgcHJpdmF0ZSBub2RlcztcblxuICBwcml2YXRlIHJlbGF0aW9uc2hpcDtcbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXBzIDogQXJyYXk8YW55PjtcbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXBPdXRsaW5lO1xuICBwcml2YXRlIHJlbGF0aW9uc2hpcE92ZXJsYXk7XG4gIHByaXZhdGUgcmVsYXRpb25zaGlwVGV4dDtcblxuICBwcml2YXRlIHNpbXVsYXRpb247XG5cbiAgcHVibGljIHN2ZztcbiAgcHJpdmF0ZSBzdmdOb2RlcztcbiAgcHJpdmF0ZSBzdmdSZWxhdGlvbnNoaXBzO1xuICBwcml2YXRlIHN2Z1RyYW5zbGF0ZTtcbiAgXG4gIHByaXZhdGUgY2xhc3NlczJjb2xvcnMgPSB7fTtcbiAgcHJpdmF0ZSBqdXN0TG9hZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgbnVtQ2xhc3NlcyA9IDA7XG4gIHByaXZhdGUgc3ZnU2NhbGUgPSB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBsYWJlbDtcblxuICBwcml2YXRlIG9wdGlvbnNJbnB1dCA6IE9iamVjdDtcblxuICBwcml2YXRlIG9wdGlvbnMgOiBOZ05lbzRqRDNPcHRpb25zID0ge1xuICAgICAgYXJyb3dTaXplOiA0LFxuICAgICAgY29sb3JzOiB0aGlzLmNvbG9ycygpLFxuICAgICAgaGlnaGxpZ2h0OiB1bmRlZmluZWQsXG4gICAgICBpY29uczogdW5kZWZpbmVkLFxuICAgICAgaWNvbk1hcDogW10sICAgIC8vIFRoaXMgdmFsdWUgYXNzaWduZWQgaW4gTmVvNGpSYW5kb21cbiAgICAgIGltYWdlTWFwOiB7fSxcbiAgICAgIGltYWdlczogdW5kZWZpbmVkLFxuICAgICAgaW5mb1BhbmVsOiB0cnVlLFxuICAgICAgbWluQ29sbGlzaW9uOiB1bmRlZmluZWQsXG4gICAgICBuZW80akRhdGE6IHVuZGVmaW5lZCxcbiAgICAgIG5lbzRqRGF0YVVybDogdW5kZWZpbmVkLFxuICAgICAgbm9kZU91dGxpbmVGaWxsQ29sb3I6IHVuZGVmaW5lZCxcbiAgICAgIG5vZGVSYWRpdXM6IDI1LFxuICAgICAgcmVsYXRpb25zaGlwQ29sb3I6ICcjYTVhYmI2JyxcbiAgICAgIHpvb21GaXQ6IGZhbHNlLFxuICAgICAgc2hvd0ljb25zOiB0cnVlLFxuICAgICAgb25Ob2RlRG91YmxlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVNb3VzZUVudGVyOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVNb3VzZUxlYXZlOiB1bmRlZmluZWQsXG4gICAgICBvblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVEcmFnRW5kOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVEcmFnU3RhcnQ6IHVuZGVmaW5lZFxuICB9O1xuXG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHB1YmxpYyBzZXRWYWx1ZXMgKF9zZWxlY3RvciwgX29wdGlvbnM6YW55KSA6IHZvaWQge1xuICAgICAgbmV3IE5nTmVvNGpEM0ljb25zKHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLmNvbnRhaW5lcklkZW50aXR5ID0gX3NlbGVjdG9yO1xuICAgICAgdGhpcy5vcHRpb25zSW5wdXQgPSBfb3B0aW9ucztcbiAgICAgIHRoaXMudmFsdWVTZXQgPSB0cnVlO1xuICB9XG5cbiAgcHVibGljIGlzVmFsdWVTZXQoKSA6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVTZXQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0T3B0aW9uc0lucHV0KCkgOiBPYmplY3Qge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc0lucHV0O1xuICB9XG5cbiAgcHVibGljIGdldENvbnRhaW5lcigpIDogT2JqZWN0IHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcbiAgfVxuXG5cbiAgcHVibGljIGluaXQoKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBkMy5zZWxlY3QodGhpcy5jb250YWluZXJJZGVudGl0eSk7XG4gICAgdGhpcy5pbml0SWNvbk1hcCh0aGlzLm9wdGlvbnMpO1xuXG4gICAgdGhpcy5tZXJnZVByb3BlcnR5KHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25zSW5wdXQpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pY29ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2hvd0ljb25zID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5taW5Db2xsaXNpb24pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLm1pbkNvbGxpc2lvbiA9IHRoaXMub3B0aW9ucy5ub2RlUmFkaXVzICogMjtcbiAgICB9XG4gICAgdGhpcy5pbml0SW1hZ2VNYXAodGhpcy5vcHRpb25zKTtcblxuICAgIHRoaXMuY29udGFpbmVyLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMnKVxuICAgICAgICAgIC5odG1sKCcnKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaW5mb1BhbmVsKSB7XG4gICAgICAgIHRoaXMuaW5mbyA9IHRoaXMuYXBwZW5kSW5mb1BhbmVsKHRoaXMuY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLnN2ZyA9IHRoaXMuYXBwZW5kR3JhcGgodGhpcy5jb250YWluZXIpO1xuXG4gICAgdGhpcy5zaW11bGF0aW9uID0gdGhpcy5pbml0U2ltdWxhdGlvbigpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5uZW80akRhdGEpIHtcbiAgICAgICAgdGhpcy5sb2FkTmVvNGpEYXRhKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMubmVvNGpEYXRhVXJsKSB7XG4gICAgICAgIHRoaXMubG9hZE5lbzRqRGF0YUZyb21VcmwodGhpcy5vcHRpb25zLm5lbzRqRGF0YVVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IGJvdGggbmVvNGpEYXRhIGFuZCBuZW80akRhdGFVcmwgYXJlIGVtcHR5IScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgaW5pdFNpbXVsYXRpb24oKSB7XG5cbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcblxuICAgICAgdmFyIHBhcmVudEVsZW1lbnQgPSB0aGlzLnN2Zy5ub2RlKCkucGFyZW50RWxlbWVudDtcbiAgICAgIGlmKHBhcmVudEVsZW1lbnQ9PXVuZGVmaW5lZCB8fCBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ9PXVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2xpZW50V2lkdGggPSB0aGlzLnN2Zy5ub2RlKCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMjtcbiAgICAgIGNvbnN0IGNsaWVudEhlaWdodCA9IHRoaXMuc3ZnLm5vZGUoKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMjtcblxuICAgICAgdmFyIHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oKSBcbiAgICAgICAgICAvLyAudmVsb2NpdHlEZWNheSgwLjgpXG4gICAgICAgICAgLy8gLmZvcmNlKCd4JywgZDMuZm9yY2UoKS5zdHJlbmd0aCgwLjAwMikpXG4gICAgICAgICAgLy8gLmZvcmNlKCd5JywgZDMuZm9yY2UoKS5zdHJlbmd0aCgwLjAwMikpXG4gICAgICAgICAgLmZvcmNlKCdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKCkucmFkaXVzKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoub3B0aW9ucy5taW5Db2xsaXNpb247XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuaXRlcmF0aW9ucygyKSlcbiAgICAgICAgICAuZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHkoKSlcbiAgICAgICAgICAuZm9yY2UoJ2xpbmsnLCBkMy5mb3JjZUxpbmsoKS5pZChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkLmlkO1xuICAgICAgICAgIH0pKVxuICAgICAgICAgIC5mb3JjZSgnY2VudGVyJywgZDMuZm9yY2VDZW50ZXIoY2xpZW50V2lkdGgsIGNsaWVudEhlaWdodCkpXG4gICAgICAgICAgLm9uKCd0aWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHRoaXNPYmoudGljaygpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy56b29tRml0ICYmICF0aGlzT2JqLmp1c3RMb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBGT1IgQ1VTVE9NSVpBVElPTlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICByZXR1cm4gc2ltdWxhdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRHcmFwaChjb250YWluZXIpIHtcbiAgICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgICB2YXIgc3ZnID0gY29udGFpbmVyLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgJzEwMCUnKVxuICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbmVvNGpkMy1ncmFwaCcpXG4gICAgICAgICAgICAgICAgIC5jYWxsKGQzLnpvb20oKS5vbignem9vbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gZDMuZXZlbnQudHJhbnNmb3JtLmssXG4gICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlID0gW2QzLmV2ZW50LnRyYW5zZm9ybS54LCBkMy5ldmVudC50cmFuc2Zvcm0ueV07XG5cbiAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLnN2Z1RyYW5zbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVswXSArPSB0aGlzT2JqLnN2Z1RyYW5zbGF0ZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVbMV0gKz0gdGhpc09iai5zdmdUcmFuc2xhdGVbMV07XG4gICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLnN2Z1NjYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGUgKj0gdGhpc09iai5zdmdTY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5zdmcuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgdHJhbnNsYXRlWzBdICsgJywgJyArIHRyYW5zbGF0ZVsxXSArICcpIHNjYWxlKCcgKyBzY2FsZSArICcpJyk7XG4gICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAub24oJ2RibGNsaWNrLnpvb20nLCBudWxsKVxuICAgICAgICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgJzEwMCUnKTtcblxuICAgICAgICAgICAgICAgICAgdGhpcy5zdmdSZWxhdGlvbnNoaXBzID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3JlbGF0aW9uc2hpcHMnKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3ZnTm9kZXMgPSBzdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnbm9kZXMnKTtcbiAgICAgIHJldHVybiBzdmc7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb1BhbmVsKGNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbmVvNGpkMy1pbmZvJyk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCBpc05vZGUsIHByb3BlcnR5LCB2YWx1ZT1udWxsKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuaW5mby5hcHBlbmQoJ2EnKTtcblxuICAgICAgZWxlbS5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgY2xzKVxuICAgICAgLmh0bWwoJzxzdHJvbmc+JyArIHByb3BlcnR5ICsgJzwvc3Ryb25nPicgKyAodmFsdWUgPyAoJzogJyArIHZhbHVlKSA6ICcnKSk7XG5cbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgICAgICAgIGVsZW0uc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyB0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgOiAoaXNOb2RlID8gdGhpc09iai5jbGFzczJjb2xvcihwcm9wZXJ0eSkgOiB0aGlzT2JqLmRlZmF1bHRDb2xvcigpKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnYm9yZGVyLWNvbG9yJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcih0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IpIDogKGlzTm9kZSA/IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3IocHJvcGVydHkpIDogdGhpc09iai5kZWZhdWx0RGFya2VuQ29sb3IoKSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ2NvbG9yJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5vcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcih0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IpIDogJyNmZmYnO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9FbGVtZW50Q2xhc3MoY2xzLCBub2RlKSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50KGNscywgdHJ1ZSwgbm9kZSk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eShjbHMsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudChjbHMsIGZhbHNlLCBwcm9wZXJ0eSwgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEluZm9FbGVtZW50UmVsYXRpb25zaGlwKGNscywgcmVsYXRpb25zaGlwKSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50KGNscywgZmFsc2UsIHJlbGF0aW9uc2hpcCk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kTm9kZSgpIHtcbiAgICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlLmVudGVyKClcbiAgICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgIHZhciBjbGFzc2VzID0gJ25vZGUnO1xuICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5pY29uKGQpKSB7XG4gICAgICAgICAgICAgICAgICAgICBjbGFzc2VzICs9ICcgbm9kZS1pY29uJztcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5pbWFnZShkKSkge1xuICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaW1hZ2UnO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMuaGlnaGxpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXNPYmoub3B0aW9ucy5oaWdobGlnaHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoaWdobGlnaHQgPSB0aGlzT2JqLm9wdGlvbnMuaGlnaGxpZ2h0W2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQubGFiZWxzWzBdID09PSBoaWdobGlnaHQuY2xhc3MgJiYgZC5wcm9wZXJ0aWVzW2hpZ2hsaWdodC5wcm9wZXJ0eV0gPT09IGhpZ2hsaWdodC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzICs9ICcgbm9kZS1oaWdobGlnaHRlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NlcztcbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICBkLmZ4ID0gZC5meSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uTm9kZUNsaWNrICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25Ob2RlQ2xpY2soZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICB0aGlzT2JqLnN0aWNrTm9kZShkKTtcbiAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vbk5vZGVEb3VibGVDbGljayAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uTm9kZURvdWJsZUNsaWNrKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouaW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoudXBkYXRlSW5mbyhkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25Ob2RlTW91c2VFbnRlciAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uTm9kZU1vdXNlRW50ZXIoZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5pbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5jbGVhckluZm8oKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25Ob2RlTW91c2VMZWF2ZSAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai5vcHRpb25zLm9uTm9kZU1vdXNlTGVhdmUoZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAuY2FsbChkMy5kcmFnKClcbiAgICAgICAgICAgICAgICAgICAgIC5vbignc3RhcnQnLCAgZnVuY3Rpb24oZCkgeyB0aGlzT2JqLmRyYWdTdGFydGVkKGQpOyB9IClcbiAgICAgICAgICAgICAgICAgICAgIC5vbignZHJhZycsIGZ1bmN0aW9uKGQpIHsgdGhpc09iai5kcmFnZ2VkKGQpOyB9IClcbiAgICAgICAgICAgICAgICAgICAgIC5vbignZW5kJywgZnVuY3Rpb24oZCkgeyB0aGlzT2JqLmRyYWdFbmRlZChkKTsgfSApICk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kTm9kZVRvR3JhcGgoKSB7XG4gICAgICB2YXIgbiA9IHRoaXMuYXBwZW5kTm9kZSgpO1xuICAgICAgdGhpcy5hcHBlbmRSaW5nVG9Ob2RlKG4pO1xuICAgICAgdGhpcy5hcHBlbmRPdXRsaW5lVG9Ob2RlKG4pO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5pY29ucykge1xuICAgICAgICAgIHRoaXMuYXBwZW5kVGV4dFRvTm9kZShuKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW1hZ2VzKSB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRJbWFnZVRvTm9kZShuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZE91dGxpbmVUb05vZGUobm9kZSkge1xuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ291dGxpbmUnKVxuICAgICAgICAgICAgIC5hdHRyKCdyJywgb3B0aW9ucy5ub2RlUmFkaXVzKVxuICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yIDogdGhpc09iai5jbGFzczJjb2xvcihkLmxhYmVsc1swXSk7XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IpIDogdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcihkLmxhYmVsc1swXSk7XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAuYXBwZW5kKCd0aXRsZScpLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoudG9TdHJpbmcoZCk7XG4gICAgICAgICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY2xhc3MyY29sb3IoY2xzKSB7XG4gICAgICB2YXIgY29sb3IgPSB0aGlzLmNsYXNzZXMyY29sb3JzW2Nsc107XG4gICAgICBpZiAoIWNvbG9yKSB7XG4gICAgICAgICAgLy8gY29sb3IgPSB0aGlzLm9wdGlvbnMuY29sb3JzW01hdGgubWluKG51bUNsYXNzZXMsIHRoaXMub3B0aW9ucy5jb2xvcnMubGVuZ3RoIC0gMSldO1xuICAgICAgICAgIGNvbG9yID0gdGhpcy5vcHRpb25zLmNvbG9yc1t0aGlzLm51bUNsYXNzZXMgJSB0aGlzLm9wdGlvbnMuY29sb3JzLmxlbmd0aF07XG4gICAgICAgICAgdGhpcy5jbGFzc2VzMmNvbG9yc1tjbHNdID0gY29sb3I7XG4gICAgICAgICAgdGhpcy5udW1DbGFzc2VzKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29sb3I7XG4gIH1cblxuICBwdWJsaWMgY2xhc3MyZGFya2VuQ29sb3IoY2xzKSB7XG4gICAgICB2YXIgY29sb3JWYWx1ZSA9IHRoaXMuY2xhc3MyY29sb3IoY2xzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gQ09MT1IgT2JqZWN0IGlzIG5vdCB3b3JraW5nIHByb3Blcmx5IHdoZW4gdGhlIG9wdGltaXphdGlvbiBpcyBzZXQgdHJ1ZVxuICAgICAgICAgIHZhciBjb2xvck9iamVjdCA9IGQzLnJnYihjb2xvclZhbHVlKTtcbiAgICAgICAgICByZXR1cm4gY29sb3JPYmplY3QuZGFya2VyKDEpO1xuICAgICAgfVxuICAgICAgY2F0Y2goZXJyKSB7fVxuICB9XG5cbiAgcHVibGljIGFwcGVuZFJpbmdUb05vZGUobm9kZSkge1xuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdyaW5nJylcbiAgICAgICAgICAuYXR0cigncicsIHRoaXMub3B0aW9ucy5ub2RlUmFkaXVzICogMS4xNilcbiAgICAgICAgICAuYXBwZW5kKCd0aXRsZScpLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzT2JqLnRvU3RyaW5nKGQpO1xuICAgICAgfSk7XG4gIH1cblxuXG4gIHB1YmxpYyBhcHBlbmRJbWFnZVRvTm9kZShub2RlKSB7XG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG4gICAgICAvLyBUT0RPID4+IENoYW5nZSBUaGlzIFRvIEJlY29tZSBUaGUgQ29udGFpbmVyXG4gICAgICAvLyBBZGRlZCB0aGUgW2ljb25GbGFnXSBhdHRyaWJ1dGUgaW4gdGhlIG5vZGUgb3IgJ2QnIHZhcmlhYmxlXG4gICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ2ltYWdlJykuYXR0cignd2lkdGgnLCAnMzVweCcpLmF0dHIoJ2hlaWdodCcsICczNXB4JykuYXR0cigneCcsICctMThweCcpLmF0dHIoJ3knLCAnLTE4cHgnKVxuICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBmdW5jdGlvbihkKSB7IHJldHVybiB0aGlzT2JqLmltYWdlKGQpOyB9KTtcbiAgICAgO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFRleHRUb05vZGUobm9kZSkge1xuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBmdW5jdGlvbihkKSB7IHJldHVybiAndGV4dCcgKyAodGhpc09iai5pY29uKGQpID8gJyBpY29uJyA6ICcnKTsgfSlcbiAgICAgICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICh0aGlzT2JqLmljb24oZCkgPyAnMjVweCcgOiAnMTJweCcpOyB9KVxuICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICh0aGlzT2JqLmljb24oZCkgPyAnMjVweCcgOiAnMzBweCcpOyB9KVxuICAgICAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oZCkgeyByZXR1cm4gKHRoaXNPYmouaWNvbihkKSA/ICcyNXB4JyA6ICczMHB4Jyk7IH0pXG4gICAgICAgICAgLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICBjb25zdCByZ2IgPSAnZmlsbDogcmdiKDIyNSwgMjI1LCAyMjUpOyBzdHJva2U6IHJnYigwMDAsIDAwMCwgMDAwKTsnO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5pY29uKGQpID8gcmdiIDogJyc7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuaHRtbChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHZhciBfaWNvbiA9IHRoaXNPYmouaWNvbihkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9pY29uID8gJyYjeCcgKyBfaWNvbiA6IGQuaWQ7XG4gICAgICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kUmFuZG9tRGF0YVRvTm9kZShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpIHtcbiAgICAgIHZhciBkYXRhID0gdGhpcy5yYW5kb21EM0RhdGEoZCwgbWF4Tm9kZXNUb0dlbmVyYXRlKTtcbiAgICAgIHRoaXMudXBkYXRlV2l0aE5lbzRqRGF0YShkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRSZWxhdGlvbnNoaXAoKSB7XG4gICAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgICAgLy8gRnVuY3Rpb24gPiBEb3VibGUgQ2xpY2sgXG4gICAgICBjb25zdCBmbkRvdWJsZUNsaWNrID0gZnVuY3Rpb24oZDphbnkpIHtcbiAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uUmVsYXRpb25zaGlwRG91YmxlQ2xpY2sgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25SZWxhdGlvbnNoaXBEb3VibGVDbGljayhkKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8gRnVuY3Rpb24gPiBNb3VzZSBFbnRlclxuICAgICAgY29uc3QgZm5Nb3VzZUVudGVyID0gZnVuY3Rpb24oZDphbnkpIHtcbiAgICAgICAgICBpZiAodGhpc09iai5pbmZvKSB7XG4gICAgICAgICAgICAgIHRoaXNPYmoudXBkYXRlSW5mbyhkKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25zaGlwLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAncmVsYXRpb25zaGlwJykub24oJ2RibGNsaWNrJywgZm5Eb3VibGVDbGljaykub24oJ21vdXNlZW50ZXInLCBmbk1vdXNlRW50ZXIpO1xuICB9XG5cbiAgcHVibGljIGNsZWFySW5mbygpIHtcbiAgICAgIHRoaXMuaW5mby5odG1sKCcnKTtcbiAgfVxuXG4gIHB1YmxpYyBjb2xvcigpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29sb3JzW3RoaXMub3B0aW9ucy5jb2xvcnMubGVuZ3RoICogTWF0aC5yYW5kb20oKSA8PCAwXTtcbiAgfVxuXG4gIHB1YmxpYyBjb2xvcnMoKSA6IEFycmF5PFN0cmluZz4ge1xuICAgICAgLy8gZDMuc2NoZW1lQ2F0ZWdvcnkxMCxcbiAgICAgIC8vIGQzLnNjaGVtZUNhdGVnb3J5MjAsXG4gICAgICByZXR1cm4gW1xuICAgICAgICAgICcjNjhiZGY2JywgLy8gbGlnaHQgYmx1ZVxuICAgICAgICAgICcjNmRjZTllJywgLy8gZ3JlZW4gIzFcbiAgICAgICAgICAnI2ZhYWZjMicsIC8vIGxpZ2h0IHBpbmtcbiAgICAgICAgICAnI2YyYmFmNicsIC8vIHB1cnBsZVxuICAgICAgICAgICcjZmY5MjhjJywgLy8gbGlnaHQgcmVkXG4gICAgICAgICAgJyNmY2VhN2UnLCAvLyBsaWdodCB5ZWxsb3dcbiAgICAgICAgICAnI2ZmYzc2NicsIC8vIGxpZ2h0IG9yYW5nZVxuICAgICAgICAgICcjNDA1ZjllJywgLy8gbmF2eSBibHVlXG4gICAgICAgICAgJyNhNWFiYjYnLCAvLyBkYXJrIGdyYXlcbiAgICAgICAgICAnIzc4Y2VjYicsIC8vIGdyZWVuICMyLFxuICAgICAgICAgICcjYjg4Y2JiJywgLy8gZGFyayBwdXJwbGVcbiAgICAgICAgICAnI2NlZDJkOScsIC8vIGxpZ2h0IGdyYXlcbiAgICAgICAgICAnI2U4NDY0NicsIC8vIGRhcmsgcmVkXG4gICAgICAgICAgJyNmYTVmODYnLCAvLyBkYXJrIHBpbmtcbiAgICAgICAgICAnI2ZmYWIxYScsIC8vIGRhcmsgb3JhbmdlXG4gICAgICAgICAgJyNmY2RhMTknLCAvLyBkYXJrIHllbGxvd1xuICAgICAgICAgICcjNzk3YjgwJywgLy8gYmxhY2tcbiAgICAgICAgICAnI2M5ZDk2ZicsIC8vIHBpc3RhY2NoaW9cbiAgICAgICAgICAnIzQ3OTkxZicsIC8vIGdyZWVuICMzXG4gICAgICAgICAgJyM3MGVkZWUnLCAvLyB0dXJxdW9pc2VcbiAgICAgICAgICAnI2ZmNzVlYScgIC8vIHBpbmtcbiAgICAgIF07XG4gIH1cblxuICBwdWJsaWMgY29udGFpbnNSZXN1bHQoYXJyYXksIGlkKSB7XG4gICAgICB2YXIgZmlsdGVyID0gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICByZXR1cm4gZWxlbS5pZCA9PT0gaWQ7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmaWx0ZXIubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHB1YmxpYyBkZWZhdWx0Q29sb3IoKSB7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMucmVsYXRpb25zaGlwQ29sb3I7XG4gIH1cblxuICBwdWJsaWMgZGVmYXVsdERhcmtlbkNvbG9yKCkge1xuICAgICAgdmFyIGNvbG9yVmFsdWUgPSB0aGlzLm9wdGlvbnMuY29sb3JzW3RoaXMub3B0aW9ucy5jb2xvcnMubGVuZ3RoIC0gMV07XG4gICAgICB0cnkge1xuICAgICAgICAgIC8vIENPTE9SIE9iamVjdCBpcyBub3Qgd29ya2luZyBwcm9wZXJseSB3aGVuIHRoZSBvcHRpbWl6YXRpb24gaXMgc2V0IHRydWVcbiAgICAgICAgICB2YXIgY29sb3JPYmplY3QgPSBkMy5yZ2IoY29sb3JWYWx1ZSk7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yT2JqZWN0LmRhcmtlcigxKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoKGVycikgeyB9XG4gIH1cblxuICBwdWJsaWMgZHJhZ0VuZGVkKGQpIHtcbiAgICAgIGlmICghZDMuZXZlbnQuYWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5zaW11bGF0aW9uLmFscGhhVGFyZ2V0KDApO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm9uTm9kZURyYWdFbmQgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5vbk5vZGVEcmFnRW5kKGQpO1xuICAgICAgfVxuICB9XG5cbiAgcHVibGljIGRyYWdnZWQoZCkge1xuICAgICAgdGhpcy5zdGlja05vZGUoZCk7XG4gIH1cblxuICBwdWJsaWMgZHJhZ1N0YXJ0ZWQoZCkge1xuICAgICAgaWYgKCFkMy5ldmVudC5hY3RpdmUpIHtcbiAgICAgICAgICB0aGlzLnNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMC4zKS5yZXN0YXJ0KCk7XG4gICAgICB9XG4gICAgICBkLmZ4ID0gZC54O1xuICAgICAgZC5meSA9IGQueTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub25Ob2RlRHJhZ1N0YXJ0ICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25Ob2RlRHJhZ1N0YXJ0KGQpO1xuICAgICAgfVxuICB9XG5cbiAgcHVibGljIGV4dGVuZChvYmoxLCBvYmoyKSB7XG4gICAgdmFyIG9iaiA9IHt9O1xuICAgIHRoaXMubWVyZ2VQcm9wZXJ0eShvYmosIG9iajEpO1xuICAgIHRoaXMubWVyZ2VQcm9wZXJ0eShvYmosIG9iajIpO1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuXG4gIHB1YmxpYyBpY29uKGQpIHtcbiAgICB2YXIgY29kZTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaWNvbk1hcCAmJiB0aGlzLm9wdGlvbnMuc2hvd0ljb25zICYmIHRoaXMub3B0aW9ucy5pY29ucykge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXSAmJiB0aGlzLm9wdGlvbnMuaWNvbk1hcFt0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dXSkge1xuICAgICAgICAgICAgY29kZSA9IHRoaXMub3B0aW9ucy5pY29uTWFwW3RoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV1dO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5pY29uTWFwW2QubGFiZWxzWzBdXSkge1xuICAgICAgICAgICAgY29kZSA9IHRoaXMub3B0aW9ucy5pY29uTWFwW2QubGFiZWxzWzBdXTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dKSB7XG4gICAgICAgICAgICBjb2RlID0gdGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb2RlO1xuICB9XG5cbiAgcHVibGljIGltYWdlKGQpIHtcbiAgICB2YXIgaSwgaW1hZ2VzRm9yTGFiZWwsIGltZywgaW1nTGV2ZWwsIGxhYmVsLCBsYWJlbFByb3BlcnR5VmFsdWUsIHByb3BlcnR5LCB2YWx1ZTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaW1hZ2VzKSB7XG4gICAgICAgIGNvbnN0IGltZ1JlZiA9IGQuaW1nPT11bmRlZmluZWQgPyBkLmxhYmVsc1swXSA6IGQuaW1nO1xuICAgICAgICBpbWFnZXNGb3JMYWJlbCA9IHRoaXMub3B0aW9ucy5pbWFnZU1hcFtpbWdSZWZdO1xuXG4gICAgICAgIGlmIChpbWFnZXNGb3JMYWJlbCkge1xuICAgICAgICAgICAgaW1nTGV2ZWwgPSAwO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW1hZ2VzRm9yTGFiZWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsYWJlbFByb3BlcnR5VmFsdWUgPSBpbWFnZXNGb3JMYWJlbFtpXS5zcGxpdCgnfCcpO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChsYWJlbFByb3BlcnR5VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBsYWJlbFByb3BlcnR5VmFsdWVbMl07XG4gICAgICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IGxhYmVsUHJvcGVydHlWYWx1ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsID0gbGFiZWxQcm9wZXJ0eVZhbHVlWzBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpbWdSZWYgPT09IGxhYmVsICYmXG4gICAgICAgICAgICAgICAgICAgICghcHJvcGVydHkgfHwgZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSAmJlxuICAgICAgICAgICAgICAgICAgICAoIXZhbHVlIHx8IGQucHJvcGVydGllc1twcm9wZXJ0eV0gPT09IHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWxQcm9wZXJ0eVZhbHVlLmxlbmd0aCA+IGltZ0xldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSB0aGlzLm9wdGlvbnMuaW1hZ2VzW2ltYWdlc0ZvckxhYmVsW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZ0xldmVsID0gbGFiZWxQcm9wZXJ0eVZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpbWc7XG4gIH1cblxuICBwdWJsaWMgbG9hZE5lbzRqRGF0YSgpIHtcbiAgICB0aGlzLm5vZGVzID0gW107XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBzID0gW107XG4gICAgdGhpcy51cGRhdGVXaXRoTmVvNGpEYXRhKHRoaXMub3B0aW9ucy5uZW80akRhdGEpO1xuICB9XG5cbiAgcHVibGljIGxvYWROZW80akRhdGFGcm9tVXJsKG5lbzRqRGF0YVVybCkge1xuICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcHMgPSBbXTtcblxuICAgIGQzLmpzb24obmVvNGpEYXRhVXJsLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlV2l0aE5lbzRqRGF0YShkYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBuZW80akRhdGFUb0QzRGF0YShkYXRhKSB7XG4gICAgdmFyIGdyYXBoID0ge1xuICAgICAgICBub2RlczogW10sXG4gICAgICAgIHJlbGF0aW9uc2hpcHM6IFtdXG4gICAgfTtcblxuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgZGF0YS5yZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdC5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5ncmFwaC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXNPYmouY29udGFpbnNSZXN1bHQoZ3JhcGgubm9kZXMsIG5vZGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwcy5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC5zb3VyY2UgPSByZWxhdGlvbnNoaXAuc3RhcnROb2RlO1xuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC50YXJnZXQgPSByZWxhdGlvbnNoaXAuZW5kTm9kZTtcbiAgICAgICAgICAgICAgICBncmFwaC5yZWxhdGlvbnNoaXBzLnB1c2gocmVsYXRpb25zaGlwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEuc291cmNlID4gYi5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhLnNvdXJjZSA8IGIuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYS50YXJnZXQgPiBiLnRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYS50YXJnZXQgPCBiLnRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSAhPT0gMCAmJiBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaV0uc291cmNlID09PSBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaS0xXS5zb3VyY2UgJiYgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLnRhcmdldCA9PT0gZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ktMV0udGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpXS5saW5rbnVtID0gZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2kgLSAxXS5saW5rbnVtICsgMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaV0ubGlua251bSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZyhkKSB7XG4gICAgdmFyIHMgPSBkLmxhYmVscyA/IGQubGFiZWxzWzBdIDogZC50eXBlO1xuICAgIHMgKz0gJyAoPGlkPjogJyArIGQuaWQ7XG4gICAgT2JqZWN0LmtleXMoZC5wcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgIHMgKz0gJywgJyArIHByb3BlcnR5ICsgJzogJyArIEpTT04uc3RyaW5naWZ5KGQucHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgIH0pO1xuICAgIHMgKz0gJyknO1xuICAgIHJldHVybiBzO1xuICB9XG5cbiAgcHVibGljIHJhbmRvbUQzRGF0YShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpIHtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbm9kZXM6IFtdLFxuICAgICAgICByZWxhdGlvbnNoaXBzOiBbXVxuICAgIH07XG5cbiAgICB2YXIgbnVtTm9kZXMgPSAobWF4Tm9kZXNUb0dlbmVyYXRlICogTWF0aC5yYW5kb20oKSA8PCAwKSArIDE7XG4gICAgdmFyIHMgPSB0aGlzLnNpemUoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtTm9kZXM7IGkrKykge1xuICAgICAgLy8gdmFyIGljb25zID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmljb25NYXApO1xuICAgICAgY29uc3QgbGFiZWwgPSBcIkhlbGxvXCI7IC8vIGljb25zW2ljb25zLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkgPDwgMF07XG5cbiAgICAgIGNvbnN0IG5vZGUgPSB7XG4gICAgICAgICAgaWQ6IHMubm9kZXMgKyAxICsgaSxcbiAgICAgICAgICBsYWJlbHM6IFtsYWJlbF0sXG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICByYW5kb206IGxhYmVsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4OiBkLngsXG4gICAgICAgICAgeTogZC55XG4gICAgICB9O1xuXG4gICAgICBkYXRhLm5vZGVzW2RhdGEubm9kZXMubGVuZ3RoXSA9IG5vZGU7XG5cbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcCA9IHtcbiAgICAgICAgICBpZDogcy5yZWxhdGlvbnNoaXBzICsgMSArIGksXG4gICAgICAgICAgdHlwZTogbGFiZWwudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICBzdGFydE5vZGU6IGQuaWQsXG4gICAgICAgICAgZW5kTm9kZTogcy5ub2RlcyArIDEgKyBpLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZnJvbTogRGF0ZS5ub3coKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc291cmNlOiBkLmlkLFxuICAgICAgICAgIHRhcmdldDogcy5ub2RlcyArIDEgKyBpLFxuICAgICAgICAgIGxpbmtudW06IHMucmVsYXRpb25zaGlwcyArIDEgKyBpXG4gICAgICB9O1xuXG4gICAgICBkYXRhLnJlbGF0aW9uc2hpcHNbZGF0YS5yZWxhdGlvbnNoaXBzLmxlbmd0aF0gPSByZWxhdGlvbnNoaXA7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIHNpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vZGVzOiB0aGlzLm5vZGVzLmxlbmd0aCxcbiAgICAgIHJlbGF0aW9uc2hpcHM6IHRoaXMucmVsYXRpb25zaGlwcy5sZW5ndGhcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHN0aWNrTm9kZShkKSB7XG4gICAgZC5meCA9IGQzLmV2ZW50Lng7XG4gICAgZC5meSA9IGQzLmV2ZW50Lnk7XG4gIH1cblxuICBwdWJsaWMgdGljaygpIHtcbiAgICB0aGlzLnRpY2tOb2RlcygpO1xuICAgIHRoaXMudGlja1JlbGF0aW9uc2hpcHMoKTtcbiAgfVxuXG4gIHB1YmxpYyB0aWNrTm9kZXMoKSB7XG4gICAgaWYgKHRoaXMubm9kZSkge1xuICAgICAgdGhpcy5ub2RlLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgaWYoZCE9dW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsICcgKyBkLnkgKyAnKSc7XG4gICAgICAgIGNvbnN0IG1zZyA9IFwiPT09PT09PT09Pj4+Pj4+Pj4+Pj4+Pj4gRVJST1IgPj4gdGlja05vZGVzXCI7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdGlja1JlbGF0aW9uc2hpcHMoKSB7XG4gICAgaWYgKHRoaXMucmVsYXRpb25zaGlwKSB7XG4gICAgICBjb25zdCB0aGlzT2JqID0gdGhpcztcbiAgICAgIHRoaXMucmVsYXRpb25zaGlwLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgaWYoZCE9dW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGFuZ2xlID0gdGhpc09iai5yb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpO1xuICAgICAgICAgIGlmKGQuc291cmNlIT11bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnNvdXJjZS54ICsgJywgJyArIGQuc291cmNlLnkgKyAnKSByb3RhdGUoJyArIGFuZ2xlICsgJyknO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtc2cgPSBcIj09PT09PT09PT4+Pj4+Pj4+Pj4+Pj4+IEVSUk9SID4+IHRpY2tSZWxhdGlvbnNoaXBzXCI7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICAgICAgXG4gICAgICB9KTtcbiAgICAgIHRoaXMudGlja1JlbGF0aW9uc2hpcHNUZXh0cygpO1xuICAgICAgdGhpcy50aWNrUmVsYXRpb25zaGlwc091dGxpbmVzKCk7XG4gICAgICB0aGlzLnRpY2tSZWxhdGlvbnNoaXBzT3ZlcmxheXMoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdGlja1JlbGF0aW9uc2hpcHNPdXRsaW5lcygpIHtcbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIHRoaXMucmVsYXRpb25zaGlwLmVhY2goIChyZWxhdGlvbnNoaXAsIGluZGV4LCBnKSA9PiB7XG4gICAgICB2YXIgb2JqID0gZ1tpbmRleF07XG4gICAgICB2YXIgcmVsID0gZDMuc2VsZWN0KG9iaik7XG4gICAgICB2YXIgb3V0bGluZTtcbiAgICAgIHRyeSB7b3V0bGluZSA9IHJlbC5zZWxlY3QoJy5vdXRsaW5lJyk7fVxuICAgICAgY2F0Y2goZXJyKSB7IHJldHVybjsgfVxuICAgICAgXG4gICAgICB2YXIgdGV4dCA9IHJlbC5zZWxlY3QoJy50ZXh0Jyk7XG4gICAgICBcbiAgICAgIHRyeSB7dmFyIGJib3ggPSB0ZXh0Lm5vZGUoKS5nZXRCQm94KCk7fVxuICAgICAgY2F0Y2goZXJyKSB7IHJldHVybjsgfVxuXG4gICAgICB2YXIgcGFkZGluZyA9IDM7XG5cbiAgICAgIG91dGxpbmUuYXR0cignZCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzT2JqLm9wdGlvbnM7XG4gICAgICAgIHZhciBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfSxcbiAgICAgICAgICBhbmdsZSA9IHRoaXNPYmoucm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgICB0ZXh0Qm91bmRpbmdCb3ggPSB0ZXh0Lm5vZGUoKS5nZXRCQm94KCksXG4gICAgICAgICAgdGV4dFBhZGRpbmcgPSA1LFxuICAgICAgICAgIHUgPSB0aGlzT2JqLnVuaXRhcnlWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgICB0ZXh0TWFyZ2luID0geyB4OiAoZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAodGV4dEJvdW5kaW5nQm94LndpZHRoICsgdGV4dFBhZGRpbmcpICogdS54KSAqIDAuNSwgeTogKGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKHRleHRCb3VuZGluZ0JveC53aWR0aCArIHRleHRQYWRkaW5nKSAqIHUueSkgKiAwLjUgfSxcbiAgICAgICAgICBuID0gdGhpc09iai51bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgcm90YXRlZFBvaW50QTEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwICsgKHRoaXNPYmoub3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSBuLngsIHk6IDAgKyAodGhpc09iai5vcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QjEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiB0ZXh0TWFyZ2luLnggLSBuLngsIHk6IHRleHRNYXJnaW4ueSAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QzEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiB0ZXh0TWFyZ2luLngsIHk6IHRleHRNYXJnaW4ueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RDEgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwICsgKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54LCB5OiAwICsgKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRBMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gdGV4dE1hcmdpbi54IC0gbi54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIHRleHRNYXJnaW4ueSAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50QjIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIG4ueCAtIHUueCAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIG4ueSAtIHUueSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRDMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gbi54ICsgKG4ueCAtIHUueCkgKiBvcHRpb25zLmFycm93U2l6ZSwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSBuLnkgKyAobi55IC0gdS55KSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnREMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RTIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCArICgtIG4ueCAtIHUueCkgKiBvcHRpb25zLmFycm93U2l6ZSwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgKyAoLSBuLnkgLSB1LnkpICogb3B0aW9ucy5hcnJvd1NpemUgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEYyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSB1LnggKiBvcHRpb25zLmFycm93U2l6ZSwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSB1LnkgKiBvcHRpb25zLmFycm93U2l6ZSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RzIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIHRleHRNYXJnaW4ueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSB0ZXh0TWFyZ2luLnkgfSwgYW5nbGUpO1xuXG4gICAgICAgIHJldHVybiAnTSAnICsgcm90YXRlZFBvaW50QTEueCArICcgJyArIHJvdGF0ZWRQb2ludEExLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QjEueCArICcgJyArIHJvdGF0ZWRQb2ludEIxLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QzEueCArICcgJyArIHJvdGF0ZWRQb2ludEMxLnkgK1xuICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RDEueCArICcgJyArIHJvdGF0ZWRQb2ludEQxLnkgK1xuICAgICAgICAgICcgWiBNICcgKyByb3RhdGVkUG9pbnRBMi54ICsgJyAnICsgcm90YXRlZFBvaW50QTIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCMi54ICsgJyAnICsgcm90YXRlZFBvaW50QjIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRDMi54ICsgJyAnICsgcm90YXRlZFBvaW50QzIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnREMi54ICsgJyAnICsgcm90YXRlZFBvaW50RDIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRFMi54ICsgJyAnICsgcm90YXRlZFBvaW50RTIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRGMi54ICsgJyAnICsgcm90YXRlZFBvaW50RjIueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRHMi54ICsgJyAnICsgcm90YXRlZFBvaW50RzIueSArXG4gICAgICAgICAgJyBaJztcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlcnIpIHsgcmV0dXJuOyB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvdXRsaW5lRnVuY3Rpb24oZCwgdGV4dCkge1xuICAgICAgXG4gIH1cblxuICBwdWJsaWMgdGlja1JlbGF0aW9uc2hpcHNPdmVybGF5cygpIHtcbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIHRoaXMucmVsYXRpb25zaGlwT3ZlcmxheS5hdHRyKCdkJywgZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxuICAgICAgICBhbmdsZSA9IHRoaXNPYmoucm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgbjEgPSB0aGlzT2JqLnVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgbiA9IHRoaXNPYmoudW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQsIDUwKSxcbiAgICAgICAgcm90YXRlZFBvaW50QSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgLSBuLngsIHk6IDAgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICByb3RhdGVkUG9pbnRCID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSBuLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgcm90YXRlZFBvaW50QyA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54ICsgbi54IC0gbjEueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgKyBuLnkgLSBuMS55IH0sIGFuZ2xlKSxcbiAgICAgICAgcm90YXRlZFBvaW50RCA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgKyBuLnggLSBuMS54LCB5OiAwICsgbi55IC0gbjEueSB9LCBhbmdsZSk7XG5cbiAgICAgIHJldHVybiAnTSAnICsgcm90YXRlZFBvaW50QS54ICsgJyAnICsgcm90YXRlZFBvaW50QS55ICtcbiAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCLnggKyAnICcgKyByb3RhdGVkUG9pbnRCLnkgK1xuICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEMueCArICcgJyArIHJvdGF0ZWRQb2ludEMueSArXG4gICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RC54ICsgJyAnICsgcm90YXRlZFBvaW50RC55ICtcbiAgICAgICAgJyBaJztcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0aWNrUmVsYXRpb25zaGlwc1RleHRzKCkge1xuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBUZXh0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBhbmdsZSA9ICh0aGlzT2JqLnJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCkgKyAzNjApICUgMzYwLFxuICAgICAgICBtaXJyb3IgPSBhbmdsZSA+IDkwICYmIGFuZ2xlIDwgMjcwLFxuICAgICAgICBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfSxcbiAgICAgICAgbiA9IHRoaXNPYmoudW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICBuV2VpZ2h0ID0gbWlycm9yID8gMiA6IC0zLFxuICAgICAgICBwb2ludCA9IHsgeDogKGQudGFyZ2V0LnggLSBkLnNvdXJjZS54KSAqIDAuNSArIG4ueCAqIG5XZWlnaHQsIHk6IChkLnRhcmdldC55IC0gZC5zb3VyY2UueSkgKiAwLjUgKyBuLnkgKiBuV2VpZ2h0IH0sXG4gICAgICAgIHJvdGF0ZWRQb2ludCA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCBwb2ludCwgYW5nbGUpO1xuXG4gICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgcm90YXRlZFBvaW50LnggKyAnLCAnICsgcm90YXRlZFBvaW50LnkgKyAnKSByb3RhdGUoJyArIChtaXJyb3IgPyAxODAgOiAwKSArICcpJztcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1bml0YXJ5Tm9ybWFsVmVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBuZXdMZW5ndGg9MSkge1xuICAgIHZhciBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICB2YXIgdmVjdG9yID0gdGhpcy51bml0YXJ5VmVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBuZXdMZW5ndGgpO1xuICAgIHJldHVybiB0aGlzLnJvdGF0ZVBvaW50KGNlbnRlciwgdmVjdG9yLCA5MCk7XG4gIH1cblxuICBwdWJsaWMgdW5pdGFyeVZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoPTEpIHtcbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KE1hdGgucG93KHRhcmdldC54IC0gc291cmNlLngsIDIpICsgTWF0aC5wb3codGFyZ2V0LnkgLSBzb3VyY2UueSwgMikpIC8gTWF0aC5zcXJ0KG5ld0xlbmd0aCB8fCAxKTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKHRhcmdldC54IC0gc291cmNlLngpIC8gbGVuZ3RoLFxuICAgICAgeTogKHRhcmdldC55IC0gc291cmNlLnkpIC8gbGVuZ3RoLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBvYnNlbGV0ZSBhbmQgbm90IHVzZWQgYW55IHdoZXJlXG4gICAqIEBvYnNlbGV0ZVxuICAgKiBAcGFyYW0gZDNEYXRhXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlV2l0aEQzRGF0YShkM0RhdGEpIHtcbiAgICB0aGlzLnVwZGF0ZU5vZGVzQW5kUmVsYXRpb25zaGlwcyhkM0RhdGEubm9kZXMsIGQzRGF0YS5yZWxhdGlvbnNoaXBzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgZGF0YSBmb3IgTmVvNGogVmlzdWFsaXphdGlvblxuICAgKiBAcGFyYW0gbmVvNGpEYXRhIFxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVdpdGhOZW80akRhdGEobmVvNGpEYXRhKSB7XG4gICAgdmFyIGQzRGF0YSA9IHRoaXMubmVvNGpEYXRhVG9EM0RhdGEobmVvNGpEYXRhKTtcbiAgICB0aGlzLnVwZGF0ZU5vZGVzQW5kUmVsYXRpb25zaGlwcyhkM0RhdGEubm9kZXMsIGQzRGF0YS5yZWxhdGlvbnNoaXBzKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVJbmZvKGQpIHtcbiAgICB0aGlzLmNsZWFySW5mbygpO1xuXG4gICAgaWYgKGQubGFiZWxzKSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50Q2xhc3MoJ2NsYXNzJywgZC5sYWJlbHNbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50UmVsYXRpb25zaGlwKCdjbGFzcycsIGQudHlwZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBlbmRJbmZvRWxlbWVudFByb3BlcnR5KCdwcm9wZXJ0eScsICcmbHQ7aWQmZ3Q7JywgZC5pZCk7XG4gICAgXG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICBPYmplY3Qua2V5cyhkLnByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgIHRoaXNPYmouYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eSgncHJvcGVydHknLCBwcm9wZXJ0eSwgSlNPTi5zdHJpbmdpZnkoZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZU5vZGVzKG4pIHtcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLm5vZGVzLCBuKTtcblxuICAgIHRoaXMubm9kZSA9IHRoaXMuc3ZnTm9kZXMuc2VsZWN0QWxsKCcubm9kZScpLmRhdGEodGhpcy5ub2RlcywgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSk7XG4gICAgdmFyIG5vZGVFbnRlciA9IHRoaXMuYXBwZW5kTm9kZVRvR3JhcGgoKTtcbiAgICB0aGlzLm5vZGUgPSBub2RlRW50ZXIubWVyZ2UodGhpcy5ub2RlKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMobiwgcikge1xuICAgIHRoaXMudXBkYXRlUmVsYXRpb25zaGlwcyhyKTtcbiAgICB0aGlzLnVwZGF0ZU5vZGVzKG4pO1xuXG4gICAgdGhpcy5zaW11bGF0aW9uLm5vZGVzKHRoaXMubm9kZXMpO1xuICAgIHRoaXMuc2ltdWxhdGlvbi5mb3JjZSgnbGluaycpLmxpbmtzKHRoaXMucmVsYXRpb25zaGlwcyk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlUmVsYXRpb25zaGlwcyhyKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5yZWxhdGlvbnNoaXBzLCByKTtcblxuICAgIHRoaXMucmVsYXRpb25zaGlwID0gdGhpcy5zdmdSZWxhdGlvbnNoaXBzLnNlbGVjdEFsbCgnLnJlbGF0aW9uc2hpcCcpLmRhdGEodGhpcy5yZWxhdGlvbnNoaXBzLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkOyB9KTtcbiAgICB2YXIgcmVsYXRpb25zaGlwID0gdGhpcy5hcHBlbmRSZWxhdGlvbnNoaXAoKTtcblxuICAgIHZhciByZWxhdGlvbnNoaXBFbnRlciA6IFJlbGF0aW9uc2hpcEVudGVyID0gdGhpcy5hcHBlbmRSZWxhdGlvbnNoaXBUb0dyYXBoKHJlbGF0aW9uc2hpcCk7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBFbnRlci5yZWxhdGlvbnNoaXAubWVyZ2UodGhpcy5yZWxhdGlvbnNoaXApO1xuXG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdXRsaW5lID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC5vdXRsaW5lJyk7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdXRsaW5lID0gcmVsYXRpb25zaGlwRW50ZXIub3V0bGluZS5tZXJnZSh0aGlzLnJlbGF0aW9uc2hpcE91dGxpbmUpO1xuXG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdmVybGF5ID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC5vdmVybGF5Jyk7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdmVybGF5ID0gcmVsYXRpb25zaGlwRW50ZXIub3ZlcmxheS5tZXJnZSh0aGlzLnJlbGF0aW9uc2hpcE92ZXJsYXkpO1xuXG4gICAgdGhpcy5yZWxhdGlvbnNoaXBUZXh0ID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC50ZXh0Jyk7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBUZXh0ID0gcmVsYXRpb25zaGlwRW50ZXIudGV4dC5tZXJnZSh0aGlzLnJlbGF0aW9uc2hpcFRleHQpO1xuICB9XG5cblxuXG5cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gICAgICAgICAgICBOZW80aiBVdGlsXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cblxuICBwdWJsaWMgZ2V0T3B0aW9uc1ByZXNlbnRhdGlvbigpIDogTmdOZW80akQzT3B0aW9ucyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFycm93U2l6ZTogNCxcbiAgICAgIGNvbG9yczogdW5kZWZpbmVkLFxuICAgICAgaGlnaGxpZ2h0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzczogJ1Byb2plY3QnLFxuICAgICAgICAgIHByb3BlcnR5OiAnbmFtZScsXG4gICAgICAgICAgdmFsdWU6ICduZW80amQzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdVc2VyJyxcbiAgICAgICAgICBwcm9wZXJ0eTogJ3VzZXJJZCcsXG4gICAgICAgICAgdmFsdWU6ICdlaXNtYW4nXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBpY29uczogTmdOZW80akQzSWNvbnMuZXhhbXBsZUljb25zKCksXG4gICAgICBpbWFnZXM6IE5nTmVvNGpEM0ljb25zLmV4YW1wbGVJbWFnZXMoKSxcbiAgICAgIGljb25NYXA6IHVuZGVmaW5lZCwgICAgLy8gVGhpcyB2YWx1ZSBhc3NpZ25lZCBpbiBOZW80alJhbmRvbVxuICAgICAgaW1hZ2VNYXA6IHVuZGVmaW5lZCxcbiAgICAgIGluZm9QYW5lbDogdHJ1ZSxcbiAgICAgIG1pbkNvbGxpc2lvbjogNjAsXG4gICAgICBuZW80akRhdGE6IE5lbzRqRDNSZWNvcmRzLFxuICAgICAgbm9kZU91dGxpbmVGaWxsQ29sb3I6IHVuZGVmaW5lZCxcbiAgICAgIG5lbzRqRGF0YVVybDogdW5kZWZpbmVkLFxuICAgICAgbm9kZVJhZGl1czogMjUsXG4gICAgICByZWxhdGlvbnNoaXBDb2xvcjogJyNhNWFiYjYnLFxuICAgICAgb25SZWxhdGlvbnNoaXBEb3VibGVDbGljazogZnVuY3Rpb24ocmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkb3VibGUgY2xpY2sgb24gcmVsYXRpb25zaGlwOiAnICsgSlNPTi5zdHJpbmdpZnkocmVsYXRpb25zaGlwKSk7XG4gICAgICB9LFxuICAgICAgem9vbUZpdDogdHJ1ZSxcbiAgICAgIHNob3dJY29uczogdHJ1ZSxcbiAgICAgIG9uTm9kZURvdWJsZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVDbGljazogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlTW91c2VFbnRlcjogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlTW91c2VMZWF2ZTogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlRHJhZ0VuZDogdW5kZWZpbmVkLFxuICAgICAgb25Ob2RlRHJhZ1N0YXJ0OiB1bmRlZmluZWRcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZVBvaW50KGMsIHAsIGFuZ2xlKSB7XG4gICAgcmV0dXJuIHRoaXMucm90YXRlKGMueCwgYy55LCBwLngsIHAueSwgYW5nbGUpO1xuICB9XG5cbiAgcHVibGljIHJvdGF0aW9uKHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIodGFyZ2V0LnkgLSBzb3VyY2UueSwgdGFyZ2V0LnggLSBzb3VyY2UueCkgKiAxODAgLyBNYXRoLlBJO1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZShjeCwgY3ksIHgsIHksIGFuZ2xlKSB7XG4gICAgdmFyIHJhZGlhbnMgPSAoTWF0aC5QSSAvIDE4MCkgKiBhbmdsZSxcbiAgICAgICAgY29zID0gTWF0aC5jb3MocmFkaWFucyksXG4gICAgICAgIHNpbiA9IE1hdGguc2luKHJhZGlhbnMpLFxuICAgICAgICBueCA9IChjb3MgKiAoeCAtIGN4KSkgKyAoc2luICogKHkgLSBjeSkpICsgY3gsXG4gICAgICAgIG55ID0gKGNvcyAqICh5IC0gY3kpKSAtIChzaW4gKiAoeCAtIGN4KSkgKyBjeTtcblxuICAgIHJldHVybiB7IHg6IG54LCB5OiBueSB9O1xuICB9XG5cbiAgcHVibGljIGluaXRJY29uTWFwKG9wdGlvbnMpIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLmljb25NYXApLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgdmFyIGtleXMgPSBrZXkuc3BsaXQoJywnKTtcbiAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnMuaWNvbk1hcFtrZXldO1xuXG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIG9wdGlvbnMuaWNvbk1hcFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3B0aW9ucy5pY29uTWFwO1xuICB9XG5cbiAgcHVibGljIGluaXRJbWFnZU1hcChvcHRpb25zKSB7XG4gICAgLy8gdmFyIGtleSwga2V5cywgc2VsZWN0b3I7XG4gICAgdmFyIGtleSwga2V5cztcbiAgICBmb3IgKGtleSBpbiBvcHRpb25zLmltYWdlcykge1xuICAgICAgaWYgKG9wdGlvbnMuaW1hZ2VzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAga2V5cyA9IGtleS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAoIW9wdGlvbnMuaW1hZ2VNYXBba2V5c1swXV0pIHtcbiAgICAgICAgICBvcHRpb25zLmltYWdlTWFwW2tleXNbMF1dID0gW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXS5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kVGV4dFRvUmVsYXRpb25zaGlwKHIpIHtcbiAgICB2YXIgclRleHQgPSByLmFwcGVuZCgndGV4dCcpO1xuICAgIHJldHVybiByVGV4dC5hdHRyKCdjbGFzcycsICd0ZXh0JykuYXR0cignZmlsbCcsICcjMDAwMDAwJykuYXR0cignZm9udC1zaXplJywgJzhweCcpLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkLnR5cGU7IH0pO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFJlbGF0aW9uc2hpcFRvR3JhcGgocmVsYXRpb25zaGlwKSA6IFJlbGF0aW9uc2hpcEVudGVyIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMuYXBwZW5kVGV4dFRvUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCk7XG4gICAgdmFyIG91dGxpbmUgPSByZWxhdGlvbnNoaXAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnb3V0bGluZScpLmF0dHIoJ2ZpbGwnLCAnI2E1YWJiNicpLmF0dHIoJ3N0cm9rZScsICdub25lJyk7XG4gICAgdmFyIG92ZXJsYXkgPSByZWxhdGlvbnNoaXAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnb3ZlcmxheScpO1xuXG4gICAgLy8gdGhpcy5yZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXA7XG4gICAgcmV0dXJuIHtcbiAgICAgIG91dGxpbmU6IG91dGxpbmUsXG4gICAgICBvdmVybGF5OiBvdmVybGF5LFxuICAgICAgcmVsYXRpb25zaGlwOiByZWxhdGlvbnNoaXAsXG4gICAgICB0ZXh0OiB0ZXh0XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZVByb3BlcnR5KHRhcmdldCwgc291cmNlKSB7XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICBjb25zdCBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICBpZihzb3VyY2VQcm9wZXJ0eSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYoIShzb3VyY2VQcm9wZXJ0eSBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgZWxzZSBpZihzb3VyY2VQcm9wZXJ0eS5sZW5ndGg+MClcbiAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB2ZXJzaW9uKCkge1xuICAgIHJldHVybiBcIjEuMC4wXCI7XG4gIH1cbn1cblxuIl19