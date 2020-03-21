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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbmVvNGpkMy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbmVvNGpkMy8iLCJzb3VyY2VzIjpbImxpYi9uZy1uZW80amQzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7QUFFdEQ7SUFnRUU7UUEzRE8saUJBQVksR0FBYSxLQUFLLENBQUM7UUFDOUIsYUFBUSxHQUFhLEtBQUssQ0FBQztRQXFCM0IsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQU1yQixZQUFPLEdBQXNCO1lBQ2pDLFNBQVMsRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDckIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsS0FBSyxFQUFFLFNBQVM7WUFDaEIsT0FBTyxFQUFFLEVBQUU7O1lBQ1gsUUFBUSxFQUFFLEVBQUU7WUFDWixNQUFNLEVBQUUsU0FBUztZQUNqQixTQUFTLEVBQUUsSUFBSTtZQUNmLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLG9CQUFvQixFQUFFLFNBQVM7WUFDL0IsVUFBVSxFQUFFLEVBQUU7WUFDZCxpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsU0FBUyxFQUFFLElBQUk7WUFDZixpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLGdCQUFnQixF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QUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ2pLLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ3JHLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDekYsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDckksY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDekosY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssQ0FBQzs7d0JBQ2pQLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxLQUFLLENBQUM7O3dCQUNqUSxjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDOzt3QkFDakwsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEtB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LCtCQUFXOzs7OztJQUNYLG9DQUFpQjs7Ozs7SUFDakIsNENBQXlCOzs7OztJQUN6Qix3Q0FBcUI7Ozs7O0lBRXJCLDBDQUE0Qjs7Ozs7SUFDNUIsc0NBQTJCOzs7OztJQUMzQixzQ0FBdUI7Ozs7O0lBQ3ZCLG9DQUE2Qjs7Ozs7SUFFN0IsaUNBQWM7Ozs7O0lBRWQsd0NBQThCOzs7OztJQUU5QixtQ0F5QkUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XG5pbXBvcnQgeyBOZ05lbzRqRDNPcHRpb25zLCBSZWxhdGlvbnNoaXBFbnRlciB9IGZyb20gJy4vbmctbmVvNGpkMy5tb2RlbCc7XG5pbXBvcnQgeyBOZ05lbzRqRDNJY29ucyB9IGZyb20gJy4vbmctbmVvNGpkMy5pY29ucyc7XG5pbXBvcnQgeyBOZW80akQzUmVjb3JkcyB9IGZyb20gXCIuL25nLW5lbzRqZDMucmVjb3Jkc1wiO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ05lbzRqZDNTZXJ2aWNlIHtcblxuICBwdWJsaWMgb3V0T2ZDb250ZXh0IDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHZhbHVlU2V0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgY29udGFpbmVyO1xuICBwcml2YXRlIGNvbnRhaW5lcklkZW50aXR5O1xuICBwcml2YXRlIGluZm87XG4gIHByaXZhdGUgbm9kZTtcbiAgcHJpdmF0ZSBub2RlcztcblxuICBwcml2YXRlIHJlbGF0aW9uc2hpcDtcbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXBzIDogQXJyYXk8YW55PjtcbiAgcHJpdmF0ZSByZWxhdGlvbnNoaXBPdXRsaW5lO1xuICBwcml2YXRlIHJlbGF0aW9uc2hpcE92ZXJsYXk7XG4gIHByaXZhdGUgcmVsYXRpb25zaGlwVGV4dDtcblxuICBwcml2YXRlIHNpbXVsYXRpb247XG5cbiAgcHVibGljIHN2ZztcbiAgcHJpdmF0ZSBzdmdOb2RlcztcbiAgcHJpdmF0ZSBzdmdSZWxhdGlvbnNoaXBzO1xuICBwcml2YXRlIHN2Z1RyYW5zbGF0ZTtcbiAgXG4gIHByaXZhdGUgY2xhc3NlczJjb2xvcnMgPSB7fTtcbiAgcHJpdmF0ZSBqdXN0TG9hZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgbnVtQ2xhc3NlcyA9IDA7XG4gIHByaXZhdGUgc3ZnU2NhbGUgPSB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBsYWJlbDtcblxuICBwcml2YXRlIG9wdGlvbnNJbnB1dCA6IE9iamVjdDtcblxuICBwcml2YXRlIG9wdGlvbnMgOiBOZ05lbzRqRDNPcHRpb25zID0ge1xuICAgICAgYXJyb3dTaXplOiA0LFxuICAgICAgY29sb3JzOiB0aGlzLmNvbG9ycygpLFxuICAgICAgaGlnaGxpZ2h0OiB1bmRlZmluZWQsXG4gICAgICBpY29uczogdW5kZWZpbmVkLFxuICAgICAgaWNvbk1hcDogW10sICAgIC8vIFRoaXMgdmFsdWUgYXNzaWduZWQgaW4gTmVvNGpSYW5kb21cbiAgICAgIGltYWdlTWFwOiB7fSxcbiAgICAgIGltYWdlczogdW5kZWZpbmVkLFxuICAgICAgaW5mb1BhbmVsOiB0cnVlLFxuICAgICAgbWluQ29sbGlzaW9uOiB1bmRlZmluZWQsXG4gICAgICBuZW80akRhdGE6IHVuZGVmaW5lZCxcbiAgICAgIG5lbzRqRGF0YVVybDogdW5kZWZpbmVkLFxuICAgICAgbm9kZU91dGxpbmVGaWxsQ29sb3I6IHVuZGVmaW5lZCxcbiAgICAgIG5vZGVSYWRpdXM6IDI1LFxuICAgICAgcmVsYXRpb25zaGlwQ29sb3I6ICcjYTVhYmI2JyxcbiAgICAgIHpvb21GaXQ6IGZhbHNlLFxuICAgICAgc2hvd0ljb25zOiB0cnVlLFxuICAgICAgb25Ob2RlRG91YmxlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVNb3VzZUVudGVyOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVNb3VzZUxlYXZlOiB1bmRlZmluZWQsXG4gICAgICBvblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVEcmFnRW5kOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVEcmFnU3RhcnQ6IHVuZGVmaW5lZCxcbiAgICAgIGdyYXBoQ29udGFpbmVySGVpZ2h0OiAnMzAwcHgnXG4gIH07XG5cblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgcHVibGljIHNldFZhbHVlcyAoX3NlbGVjdG9yLCBfb3B0aW9uczphbnkpIDogdm9pZCB7XG4gICAgICBuZXcgTmdOZW80akQzSWNvbnModGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMuY29udGFpbmVySWRlbnRpdHkgPSBfc2VsZWN0b3I7XG4gICAgICB0aGlzLm9wdGlvbnNJbnB1dCA9IF9vcHRpb25zO1xuICAgICAgdGhpcy52YWx1ZVNldCA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgaXNWYWx1ZVNldCgpIDogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVNldDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRPcHRpb25zSW5wdXQoKSA6IE9iamVjdCB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zSW5wdXQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29udGFpbmVyKCkgOiBPYmplY3Qge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xuICB9XG5cblxuICBwdWJsaWMgaW5pdCgpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGQzLnNlbGVjdCh0aGlzLmNvbnRhaW5lcklkZW50aXR5KTtcbiAgICB0aGlzLmluaXRJY29uTWFwKHRoaXMub3B0aW9ucyk7XG5cbiAgICB0aGlzLm1lcmdlUHJvcGVydHkodGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnNJbnB1dCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmljb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zaG93SWNvbnMgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRpb25zLm1pbkNvbGxpc2lvbikge1xuICAgICAgICB0aGlzLm9wdGlvbnMubWluQ29sbGlzaW9uID0gdGhpcy5vcHRpb25zLm5vZGVSYWRpdXMgKiAyO1xuICAgIH1cbiAgICB0aGlzLmluaXRJbWFnZU1hcCh0aGlzLm9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb250YWluZXIuYXR0cignY2xhc3MnLCAnbmVvNGpkMycpXG4gICAgICAgICAgLmh0bWwoJycpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbmZvUGFuZWwpIHtcbiAgICAgICAgdGhpcy5pbmZvID0gdGhpcy5hcHBlbmRJbmZvUGFuZWwodGhpcy5jb250YWluZXIpO1xuICAgIH1cblxuICAgIHRoaXMuc3ZnID0gdGhpcy5hcHBlbmRHcmFwaCh0aGlzLmNvbnRhaW5lcik7XG5cbiAgICB0aGlzLnNpbXVsYXRpb24gPSB0aGlzLmluaXRTaW11bGF0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm5lbzRqRGF0YSkge1xuICAgICAgICB0aGlzLmxvYWROZW80akRhdGEoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5uZW80akRhdGFVcmwpIHtcbiAgICAgICAgdGhpcy5sb2FkTmVvNGpEYXRhRnJvbVVybCh0aGlzLm9wdGlvbnMubmVvNGpEYXRhVXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogYm90aCBuZW80akRhdGEgYW5kIG5lbzRqRGF0YVVybCBhcmUgZW1wdHkhJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBpbml0U2ltdWxhdGlvbigpIHtcblxuICAgICAgdmFyIHRoaXNPYmogPSB0aGlzO1xuXG4gICAgICB2YXIgcGFyZW50RWxlbWVudCA9IHRoaXMuc3ZnLm5vZGUoKS5wYXJlbnRFbGVtZW50O1xuICAgICAgaWYocGFyZW50RWxlbWVudD09dW5kZWZpbmVkIHx8IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudD09dW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjbGllbnRXaWR0aCA9IHRoaXMuc3ZnLm5vZGUoKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGggLyAyO1xuICAgICAgY29uc3QgY2xpZW50SGVpZ2h0ID0gdGhpcy5zdmcubm9kZSgpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAyO1xuXG4gICAgICB2YXIgc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbigpIFxuICAgICAgICAgIC8vIC52ZWxvY2l0eURlY2F5KDAuOClcbiAgICAgICAgICAvLyAuZm9yY2UoJ3gnLCBkMy5mb3JjZSgpLnN0cmVuZ3RoKDAuMDAyKSlcbiAgICAgICAgICAvLyAuZm9yY2UoJ3knLCBkMy5mb3JjZSgpLnN0cmVuZ3RoKDAuMDAyKSlcbiAgICAgICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai5vcHRpb25zLm1pbkNvbGxpc2lvbjtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5pdGVyYXRpb25zKDIpKVxuICAgICAgICAgIC5mb3JjZSgnY2hhcmdlJywgZDMuZm9yY2VNYW55Qm9keSgpKVxuICAgICAgICAgIC5mb3JjZSgnbGluaycsIGQzLmZvcmNlTGluaygpLmlkKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGQuaWQ7XG4gICAgICAgICAgfSkpXG4gICAgICAgICAgLmZvcmNlKCdjZW50ZXInLCBkMy5mb3JjZUNlbnRlcihjbGllbnRXaWR0aCwgY2xpZW50SGVpZ2h0KSlcbiAgICAgICAgICAub24oJ3RpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdGhpc09iai50aWNrKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLnpvb21GaXQgJiYgIXRoaXNPYmouanVzdExvYWRlZCkge1xuICAgICAgICAgICAgICAgIC8vIEZPUiBDVVNUT01JWkFUSU9OXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIHJldHVybiBzaW11bGF0aW9uO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEdyYXBoKGNvbnRhaW5lcikge1xuICAgICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICAgIHZhciBzdmcgPSBjb250YWluZXIuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzT2JqLm9wdGlvbnMuZ3JhcGhDb250YWluZXJIZWlnaHQpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICduZW80amQzLWdyYXBoJylcbiAgICAgICAgICAgICAgICAgLmNhbGwoZDMuem9vbSgpLm9uKCd6b29tJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSBkMy5ldmVudC50cmFuc2Zvcm0uayxcbiAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUgPSBbZDMuZXZlbnQudHJhbnNmb3JtLngsIGQzLmV2ZW50LnRyYW5zZm9ybS55XTtcblxuICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouc3ZnVHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlWzBdICs9IHRoaXNPYmouc3ZnVHJhbnNsYXRlWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVsxXSArPSB0aGlzT2JqLnN2Z1RyYW5zbGF0ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmouc3ZnU2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZSAqPSB0aGlzT2JqLnN2Z1NjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLnN2Zy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB0cmFuc2xhdGVbMF0gKyAnLCAnICsgdHJhbnNsYXRlWzFdICsgJykgc2NhbGUoJyArIHNjYWxlICsgJyknKTtcbiAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgIC5vbignZGJsY2xpY2suem9vbScsIG51bGwpXG4gICAgICAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAnMTAwJScpO1xuXG4gICAgICAgICAgICAgICAgICB0aGlzLnN2Z1JlbGF0aW9uc2hpcHMgPSBzdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAncmVsYXRpb25zaGlwcycpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5zdmdOb2RlcyA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdub2RlcycpO1xuICAgICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvUGFuZWwoY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICduZW80amQzLWluZm8nKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvRWxlbWVudChjbHMsIGlzTm9kZSwgcHJvcGVydHksIHZhbHVlPW51bGwpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy5pbmZvLmFwcGVuZCgnYScpO1xuXG4gICAgICBlbGVtLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAuYXR0cignY2xhc3MnLCBjbHMpXG4gICAgICAuaHRtbCgnPHN0cm9uZz4nICsgcHJvcGVydHkgKyAnPC9zdHJvbmc+JyArICh2YWx1ZSA/ICgnOiAnICsgdmFsdWUpIDogJycpKTtcblxuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgICAgICAgZWxlbS5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA6IChpc05vZGUgPyB0aGlzT2JqLmNsYXNzMmNvbG9yKHByb3BlcnR5KSA6IHRoaXNPYmouZGVmYXVsdENvbG9yKCkpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN0eWxlKCdib3JkZXItY29sb3InLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvcikgOiAoaXNOb2RlID8gdGhpc09iai5jbGFzczJkYXJrZW5Db2xvcihwcm9wZXJ0eSkgOiB0aGlzT2JqLmRlZmF1bHREYXJrZW5Db2xvcigpKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnY29sb3InLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLm9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKHRoaXNPYmoub3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvcikgOiAnI2ZmZic7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb0VsZW1lbnRDbGFzcyhjbHMsIG5vZGUpIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCB0cnVlLCBub2RlKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRJbmZvRWxlbWVudFByb3BlcnR5KGNscywgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50KGNscywgZmFsc2UsIHByb3BlcnR5LCB2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSW5mb0VsZW1lbnRSZWxhdGlvbnNoaXAoY2xzLCByZWxhdGlvbnNoaXApIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCBmYWxzZSwgcmVsYXRpb25zaGlwKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmROb2RlKCkge1xuICAgICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLm5vZGUuZW50ZXIoKVxuICAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgdmFyIGNsYXNzZXMgPSAnbm9kZSc7XG4gICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLmljb24oZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgKz0gJyBub2RlLWljb24nO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLmltYWdlKGQpKSB7XG4gICAgICAgICAgICAgICAgICAgICBjbGFzc2VzICs9ICcgbm9kZS1pbWFnZSc7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpc09iai5vcHRpb25zLmhpZ2hsaWdodC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGhpZ2hsaWdodCA9IHRoaXNPYmoub3B0aW9ucy5oaWdobGlnaHRbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZC5sYWJlbHNbMF0gPT09IGhpZ2hsaWdodC5jbGFzcyAmJiBkLnByb3BlcnRpZXNbaGlnaGxpZ2h0LnByb3BlcnR5XSA9PT0gaGlnaGxpZ2h0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgKz0gJyBub2RlLWhpZ2hsaWdodGVkJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzO1xuICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgIGQuZnggPSBkLmZ5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25Ob2RlQ2xpY2sgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vbk5vZGVDbGljayhkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5vbignZGJsY2xpY2snLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgIHRoaXNPYmouc3RpY2tOb2RlKGQpO1xuICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5vcHRpb25zLm9uTm9kZURvdWJsZUNsaWNrICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25Ob2RlRG91YmxlQ2xpY2soZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpc09iai5pbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpc09iai51cGRhdGVJbmZvKGQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vbk5vZGVNb3VzZUVudGVyICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25Ob2RlTW91c2VFbnRlcihkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzT2JqLmluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLmNsZWFySW5mbygpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPYmoub3B0aW9ucy5vbk5vZGVNb3VzZUxlYXZlICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzT2JqLm9wdGlvbnMub25Ob2RlTW91c2VMZWF2ZShkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5jYWxsKGQzLmRyYWcoKVxuICAgICAgICAgICAgICAgICAgICAgLm9uKCdzdGFydCcsICBmdW5jdGlvbihkKSB7IHRoaXNPYmouZHJhZ1N0YXJ0ZWQoZCk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAgLm9uKCdkcmFnJywgZnVuY3Rpb24oZCkgeyB0aGlzT2JqLmRyYWdnZWQoZCk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAgLm9uKCdlbmQnLCBmdW5jdGlvbihkKSB7IHRoaXNPYmouZHJhZ0VuZGVkKGQpOyB9ICkgKTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmROb2RlVG9HcmFwaCgpIHtcbiAgICAgIHZhciBuID0gdGhpcy5hcHBlbmROb2RlKCk7XG4gICAgICB0aGlzLmFwcGVuZFJpbmdUb05vZGUobik7XG4gICAgICB0aGlzLmFwcGVuZE91dGxpbmVUb05vZGUobik7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmljb25zKSB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRUZXh0VG9Ob2RlKG4pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbWFnZXMpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZEltYWdlVG9Ob2RlKG4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG47XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kT3V0bGluZVRvTm9kZShub2RlKSB7XG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgIHJldHVybiBub2RlLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnb3V0bGluZScpXG4gICAgICAgICAgICAgLmF0dHIoJ3InLCBvcHRpb25zLm5vZGVSYWRpdXMpXG4gICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgOiB0aGlzT2JqLmNsYXNzMmNvbG9yKGQubGFiZWxzWzBdKTtcbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IHRoaXNPYmouY2xhc3MyZGFya2VuQ29sb3Iob3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvcikgOiB0aGlzT2JqLmNsYXNzMmRhcmtlbkNvbG9yKGQubGFiZWxzWzBdKTtcbiAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgIC5hcHBlbmQoJ3RpdGxlJykudGV4dChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc09iai50b1N0cmluZyhkKTtcbiAgICAgICAgICAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjbGFzczJjb2xvcihjbHMpIHtcbiAgICAgIHZhciBjb2xvciA9IHRoaXMuY2xhc3NlczJjb2xvcnNbY2xzXTtcbiAgICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgICAvLyBjb2xvciA9IHRoaXMub3B0aW9ucy5jb2xvcnNbTWF0aC5taW4obnVtQ2xhc3NlcywgdGhpcy5vcHRpb25zLmNvbG9ycy5sZW5ndGggLSAxKV07XG4gICAgICAgICAgY29sb3IgPSB0aGlzLm9wdGlvbnMuY29sb3JzW3RoaXMubnVtQ2xhc3NlcyAlIHRoaXMub3B0aW9ucy5jb2xvcnMubGVuZ3RoXTtcbiAgICAgICAgICB0aGlzLmNsYXNzZXMyY29sb3JzW2Nsc10gPSBjb2xvcjtcbiAgICAgICAgICB0aGlzLm51bUNsYXNzZXMrKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb2xvcjtcbiAgfVxuXG4gIHB1YmxpYyBjbGFzczJkYXJrZW5Db2xvcihjbHMpIHtcbiAgICAgIHZhciBjb2xvclZhbHVlID0gdGhpcy5jbGFzczJjb2xvcihjbHMpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBDT0xPUiBPYmplY3QgaXMgbm90IHdvcmtpbmcgcHJvcGVybHkgd2hlbiB0aGUgb3B0aW1pemF0aW9uIGlzIHNldCB0cnVlXG4gICAgICAgICAgdmFyIGNvbG9yT2JqZWN0ID0gZDMucmdiKGNvbG9yVmFsdWUpO1xuICAgICAgICAgIHJldHVybiBjb2xvck9iamVjdC5kYXJrZXIoMSk7XG4gICAgICB9XG4gICAgICBjYXRjaChlcnIpIHt9XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kUmluZ1RvTm9kZShub2RlKSB7XG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG4gICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3JpbmcnKVxuICAgICAgICAgIC5hdHRyKCdyJywgdGhpcy5vcHRpb25zLm5vZGVSYWRpdXMgKiAxLjE2KVxuICAgICAgICAgIC5hcHBlbmQoJ3RpdGxlJykudGV4dChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXNPYmoudG9TdHJpbmcoZCk7XG4gICAgICB9KTtcbiAgfVxuXG5cbiAgcHVibGljIGFwcGVuZEltYWdlVG9Ob2RlKG5vZGUpIHtcbiAgICAgIHZhciB0aGlzT2JqID0gdGhpcztcbiAgICAgIC8vIFRPRE8gPj4gQ2hhbmdlIFRoaXMgVG8gQmVjb21lIFRoZSBDb250YWluZXJcbiAgICAgIC8vIEFkZGVkIHRoZSBbaWNvbkZsYWddIGF0dHJpYnV0ZSBpbiB0aGUgbm9kZSBvciAnZCcgdmFyaWFibGVcbiAgICAgIHJldHVybiBub2RlLmFwcGVuZCgnaW1hZ2UnKS5hdHRyKCd3aWR0aCcsICczNXB4JylcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsICczNXB4JykuYXR0cigneCcsICctMThweCcpLmF0dHIoJ3knLCAnLTE4cHgnKVxuICAgICAgICAuYXR0cigneGxpbms6aHJlZicsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHRoaXNPYmouaW1hZ2UoZCk7IH0pO1xuICAgICA7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kVGV4dFRvTm9kZShub2RlKSB7XG4gICAgICB2YXIgdGhpc09iaiA9IHRoaXM7XG4gICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICd0ZXh0JyArICh0aGlzT2JqLmljb24oZCkgPyAnIGljb24nIDogJycpOyB9KVxuICAgICAgICAgIC5hdHRyKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgICAgICAuYXR0cignZm9udC1zaXplJywgZnVuY3Rpb24oZCkgeyByZXR1cm4gKHRoaXNPYmouaWNvbihkKSA/ICcyNXB4JyA6ICcxMnB4Jyk7IH0pXG4gICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAgIC5hdHRyKCd4JywgZnVuY3Rpb24oZCkgeyByZXR1cm4gKHRoaXNPYmouaWNvbihkKSA/ICcyNXB4JyA6ICczMHB4Jyk7IH0pXG4gICAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbihkKSB7IHJldHVybiAodGhpc09iai5pY29uKGQpID8gJzI1cHgnIDogJzMwcHgnKTsgfSlcbiAgICAgICAgICAuYXR0cignc3R5bGUnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJnYiA9ICdmaWxsOiByZ2IoMjI1LCAyMjUsIDIyNSk7IHN0cm9rZTogcmdiKDAwMCwgMDAwLCAwMDApOyc7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzT2JqLmljb24oZCkgPyByZ2IgOiAnJztcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5odG1sKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgdmFyIF9pY29uID0gdGhpc09iai5pY29uKGQpO1xuICAgICAgICAgICAgICByZXR1cm4gX2ljb24gPyAnJiN4JyArIF9pY29uIDogZC5pZDtcbiAgICAgICAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRSYW5kb21EYXRhVG9Ob2RlKGQsIG1heE5vZGVzVG9HZW5lcmF0ZSkge1xuICAgICAgdmFyIGRhdGEgPSB0aGlzLnJhbmRvbUQzRGF0YShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpO1xuICAgICAgdGhpcy51cGRhdGVXaXRoTmVvNGpEYXRhKGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFJlbGF0aW9uc2hpcCgpIHtcbiAgICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgICAvLyBGdW5jdGlvbiA+IERvdWJsZSBDbGljayBcbiAgICAgIGNvbnN0IGZuRG91YmxlQ2xpY2sgPSBmdW5jdGlvbihkOmFueSkge1xuICAgICAgICAgIGlmICh0aGlzT2JqLm9wdGlvbnMub25SZWxhdGlvbnNoaXBEb3VibGVDbGljayAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgIHRoaXNPYmoub3B0aW9ucy5vblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrKGQpO1xuICAgICAgICAgIH1cbiAgICAgIH07XG4gICAgICAvLyBGdW5jdGlvbiA+IE1vdXNlIEVudGVyXG4gICAgICBjb25zdCBmbk1vdXNlRW50ZXIgPSBmdW5jdGlvbihkOmFueSkge1xuICAgICAgICAgIGlmICh0aGlzT2JqLmluZm8pIHtcbiAgICAgICAgICAgICAgdGhpc09iai51cGRhdGVJbmZvKGQpO1xuICAgICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy5yZWxhdGlvbnNoaXAuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdyZWxhdGlvbnNoaXAnKS5vbignZGJsY2xpY2snLCBmbkRvdWJsZUNsaWNrKS5vbignbW91c2VlbnRlcicsIGZuTW91c2VFbnRlcik7XG4gIH1cblxuICBwdWJsaWMgY2xlYXJJbmZvKCkge1xuICAgICAgdGhpcy5pbmZvLmh0bWwoJycpO1xuICB9XG5cbiAgcHVibGljIGNvbG9yKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb2xvcnNbdGhpcy5vcHRpb25zLmNvbG9ycy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpIDw8IDBdO1xuICB9XG5cbiAgcHVibGljIGNvbG9ycygpIDogQXJyYXk8U3RyaW5nPiB7XG4gICAgICAvLyBkMy5zY2hlbWVDYXRlZ29yeTEwLFxuICAgICAgLy8gZDMuc2NoZW1lQ2F0ZWdvcnkyMCxcbiAgICAgIHJldHVybiBbXG4gICAgICAgICAgJyM2OGJkZjYnLCAvLyBsaWdodCBibHVlXG4gICAgICAgICAgJyM2ZGNlOWUnLCAvLyBncmVlbiAjMVxuICAgICAgICAgICcjZmFhZmMyJywgLy8gbGlnaHQgcGlua1xuICAgICAgICAgICcjZjJiYWY2JywgLy8gcHVycGxlXG4gICAgICAgICAgJyNmZjkyOGMnLCAvLyBsaWdodCByZWRcbiAgICAgICAgICAnI2ZjZWE3ZScsIC8vIGxpZ2h0IHllbGxvd1xuICAgICAgICAgICcjZmZjNzY2JywgLy8gbGlnaHQgb3JhbmdlXG4gICAgICAgICAgJyM0MDVmOWUnLCAvLyBuYXZ5IGJsdWVcbiAgICAgICAgICAnI2E1YWJiNicsIC8vIGRhcmsgZ3JheVxuICAgICAgICAgICcjNzhjZWNiJywgLy8gZ3JlZW4gIzIsXG4gICAgICAgICAgJyNiODhjYmInLCAvLyBkYXJrIHB1cnBsZVxuICAgICAgICAgICcjY2VkMmQ5JywgLy8gbGlnaHQgZ3JheVxuICAgICAgICAgICcjZTg0NjQ2JywgLy8gZGFyayByZWRcbiAgICAgICAgICAnI2ZhNWY4NicsIC8vIGRhcmsgcGlua1xuICAgICAgICAgICcjZmZhYjFhJywgLy8gZGFyayBvcmFuZ2VcbiAgICAgICAgICAnI2ZjZGExOScsIC8vIGRhcmsgeWVsbG93XG4gICAgICAgICAgJyM3OTdiODAnLCAvLyBibGFja1xuICAgICAgICAgICcjYzlkOTZmJywgLy8gcGlzdGFjY2hpb1xuICAgICAgICAgICcjNDc5OTFmJywgLy8gZ3JlZW4gIzNcbiAgICAgICAgICAnIzcwZWRlZScsIC8vIHR1cnF1b2lzZVxuICAgICAgICAgICcjZmY3NWVhJyAgLy8gcGlua1xuICAgICAgXTtcbiAgfVxuXG4gIHB1YmxpYyBjb250YWluc1Jlc3VsdChhcnJheSwgaWQpIHtcbiAgICAgIHZhciBmaWx0ZXIgPSBhcnJheS5maWx0ZXIoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgIHJldHVybiBlbGVtLmlkID09PSBpZDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZpbHRlci5sZW5ndGggPiAwO1xuICB9XG5cbiAgcHVibGljIGRlZmF1bHRDb2xvcigpIHtcbiAgcmV0dXJuIHRoaXMub3B0aW9ucy5yZWxhdGlvbnNoaXBDb2xvcjtcbiAgfVxuXG4gIHB1YmxpYyBkZWZhdWx0RGFya2VuQ29sb3IoKSB7XG4gICAgICB2YXIgY29sb3JWYWx1ZSA9IHRoaXMub3B0aW9ucy5jb2xvcnNbdGhpcy5vcHRpb25zLmNvbG9ycy5sZW5ndGggLSAxXTtcbiAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gQ09MT1IgT2JqZWN0IGlzIG5vdCB3b3JraW5nIHByb3Blcmx5IHdoZW4gdGhlIG9wdGltaXphdGlvbiBpcyBzZXQgdHJ1ZVxuICAgICAgICAgIHZhciBjb2xvck9iamVjdCA9IGQzLnJnYihjb2xvclZhbHVlKTtcbiAgICAgICAgICByZXR1cm4gY29sb3JPYmplY3QuZGFya2VyKDEpO1xuICAgICAgfVxuICAgICAgY2F0Y2goZXJyKSB7IH1cbiAgfVxuXG4gIHB1YmxpYyBkcmFnRW5kZWQoZCkge1xuICAgICAgaWYgKCFkMy5ldmVudC5hY3RpdmUpIHtcbiAgICAgICAgICB0aGlzLnNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub25Ob2RlRHJhZ0VuZCAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uTm9kZURyYWdFbmQoZCk7XG4gICAgICB9XG4gIH1cblxuICBwdWJsaWMgZHJhZ2dlZChkKSB7XG4gICAgICB0aGlzLnN0aWNrTm9kZShkKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmFnU3RhcnRlZChkKSB7XG4gICAgICBpZiAoIWQzLmV2ZW50LmFjdGl2ZSkge1xuICAgICAgICAgIHRoaXMuc2ltdWxhdGlvbi5hbHBoYVRhcmdldCgwLjMpLnJlc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIGQuZnggPSBkLng7XG4gICAgICBkLmZ5ID0gZC55O1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbk5vZGVEcmFnU3RhcnQgIT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5vbk5vZGVEcmFnU3RhcnQoZCk7XG4gICAgICB9XG4gIH1cblxuICBwdWJsaWMgZXh0ZW5kKG9iajEsIG9iajIpIHtcbiAgICB2YXIgb2JqID0ge307XG4gICAgdGhpcy5tZXJnZVByb3BlcnR5KG9iaiwgb2JqMSk7XG4gICAgdGhpcy5tZXJnZVByb3BlcnR5KG9iaiwgb2JqMik7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG5cbiAgcHVibGljIGljb24oZCkge1xuICAgIHZhciBjb2RlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pY29uTWFwICYmIHRoaXMub3B0aW9ucy5zaG93SWNvbnMgJiYgdGhpcy5vcHRpb25zLmljb25zKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dICYmIHRoaXMub3B0aW9ucy5pY29uTWFwW3RoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV1dKSB7XG4gICAgICAgICAgICBjb2RlID0gdGhpcy5vcHRpb25zLmljb25NYXBbdGhpcy5vcHRpb25zLmljb25zW2QubGFiZWxzWzBdXV07XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmljb25NYXBbZC5sYWJlbHNbMF1dKSB7XG4gICAgICAgICAgICBjb2RlID0gdGhpcy5vcHRpb25zLmljb25NYXBbZC5sYWJlbHNbMF1dO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV0pIHtcbiAgICAgICAgICAgIGNvZGUgPSB0aGlzLm9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvZGU7XG4gIH1cblxuICBwdWJsaWMgaW1hZ2UoZCkge1xuICAgIHZhciBpLCBpbWFnZXNGb3JMYWJlbCwgaW1nLCBpbWdMZXZlbCwgbGFiZWwsIGxhYmVsUHJvcGVydHlWYWx1ZSwgcHJvcGVydHksIHZhbHVlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbWFnZXMpIHtcbiAgICAgICAgY29uc3QgaW1nUmVmID0gZC5pbWc9PXVuZGVmaW5lZCA/IGQubGFiZWxzWzBdIDogZC5pbWc7XG4gICAgICAgIGltYWdlc0ZvckxhYmVsID0gdGhpcy5vcHRpb25zLmltYWdlTWFwW2ltZ1JlZl07XG5cbiAgICAgICAgaWYgKGltYWdlc0ZvckxhYmVsKSB7XG4gICAgICAgICAgICBpbWdMZXZlbCA9IDA7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbWFnZXNGb3JMYWJlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxhYmVsUHJvcGVydHlWYWx1ZSA9IGltYWdlc0ZvckxhYmVsW2ldLnNwbGl0KCd8Jyk7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGxhYmVsUHJvcGVydHlWYWx1ZVsyXTtcbiAgICAgICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gbGFiZWxQcm9wZXJ0eVZhbHVlWzFdO1xuICAgICAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBsYWJlbFByb3BlcnR5VmFsdWVbMF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGltZ1JlZiA9PT0gbGFiZWwgJiZcbiAgICAgICAgICAgICAgICAgICAgKCFwcm9wZXJ0eSB8fCBkLnByb3BlcnRpZXNbcHJvcGVydHldICE9PSB1bmRlZmluZWQpICYmXG4gICAgICAgICAgICAgICAgICAgICghdmFsdWUgfHwgZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSA9PT0gdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbFByb3BlcnR5VmFsdWUubGVuZ3RoID4gaW1nTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IHRoaXMub3B0aW9ucy5pbWFnZXNbaW1hZ2VzRm9yTGFiZWxbaV1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nTGV2ZWwgPSBsYWJlbFByb3BlcnR5VmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGltZztcbiAgfVxuXG4gIHB1YmxpYyBsb2FkTmVvNGpEYXRhKCkge1xuICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcHMgPSBbXTtcbiAgICB0aGlzLnVwZGF0ZVdpdGhOZW80akRhdGEodGhpcy5vcHRpb25zLm5lbzRqRGF0YSk7XG4gIH1cblxuICBwdWJsaWMgbG9hZE5lbzRqRGF0YUZyb21VcmwobmVvNGpEYXRhVXJsKSB7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgIHRoaXMucmVsYXRpb25zaGlwcyA9IFtdO1xuXG4gICAgZDMuanNvbihuZW80akRhdGFVcmwsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVXaXRoTmVvNGpEYXRhKGRhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5lbzRqRGF0YVRvRDNEYXRhKGRhdGEpIHtcbiAgICB2YXIgZ3JhcGggPSB7XG4gICAgICAgIG5vZGVzOiBbXSxcbiAgICAgICAgcmVsYXRpb25zaGlwczogW11cbiAgICB9O1xuXG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICBkYXRhLnJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0LmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBkYXRhLmdyYXBoLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpc09iai5jb250YWluc1Jlc3VsdChncmFwaC5ub2Rlcywgbm9kZS5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGgubm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzLmZvckVhY2goZnVuY3Rpb24ocmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLnNvdXJjZSA9IHJlbGF0aW9uc2hpcC5zdGFydE5vZGU7XG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLnRhcmdldCA9IHJlbGF0aW9uc2hpcC5lbmROb2RlO1xuICAgICAgICAgICAgICAgIGdyYXBoLnJlbGF0aW9uc2hpcHMucHVzaChyZWxhdGlvbnNoaXApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYS5zb3VyY2UgPiBiLnNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGEuc291cmNlIDwgYi5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhLnRhcmdldCA+IGIudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhLnRhcmdldCA8IGIudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpICE9PSAwICYmIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpXS5zb3VyY2UgPT09IGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpLTFdLnNvdXJjZSAmJiBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaV0udGFyZ2V0ID09PSBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaS0xXS50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLmxpbmtudW0gPSBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaSAtIDFdLmxpbmtudW0gKyAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpXS5saW5rbnVtID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKGQpIHtcbiAgICB2YXIgcyA9IGQubGFiZWxzID8gZC5sYWJlbHNbMF0gOiBkLnR5cGU7XG4gICAgcyArPSAnICg8aWQ+OiAnICsgZC5pZDtcbiAgICBPYmplY3Qua2V5cyhkLnByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgcyArPSAnLCAnICsgcHJvcGVydHkgKyAnOiAnICsgSlNPTi5zdHJpbmdpZnkoZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSk7XG4gICAgfSk7XG4gICAgcyArPSAnKSc7XG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICBwdWJsaWMgcmFuZG9tRDNEYXRhKGQsIG1heE5vZGVzVG9HZW5lcmF0ZSkge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgICBub2RlczogW10sXG4gICAgICAgIHJlbGF0aW9uc2hpcHM6IFtdXG4gICAgfTtcblxuICAgIHZhciBudW1Ob2RlcyA9IChtYXhOb2Rlc1RvR2VuZXJhdGUgKiBNYXRoLnJhbmRvbSgpIDw8IDApICsgMTtcbiAgICB2YXIgcyA9IHRoaXMuc2l6ZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XG4gICAgICAvLyB2YXIgaWNvbnMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuaWNvbk1hcCk7XG4gICAgICBjb25zdCBsYWJlbCA9IFwiSGVsbG9cIjsgLy8gaWNvbnNbaWNvbnMubGVuZ3RoICogTWF0aC5yYW5kb20oKSA8PCAwXTtcblxuICAgICAgY29uc3Qgbm9kZSA9IHtcbiAgICAgICAgICBpZDogcy5ub2RlcyArIDEgKyBpLFxuICAgICAgICAgIGxhYmVsczogW2xhYmVsXSxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHJhbmRvbTogbGFiZWxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHg6IGQueCxcbiAgICAgICAgICB5OiBkLnlcbiAgICAgIH07XG5cbiAgICAgIGRhdGEubm9kZXNbZGF0YS5ub2Rlcy5sZW5ndGhdID0gbm9kZTtcblxuICAgICAgY29uc3QgcmVsYXRpb25zaGlwID0ge1xuICAgICAgICAgIGlkOiBzLnJlbGF0aW9uc2hpcHMgKyAxICsgaSxcbiAgICAgICAgICB0eXBlOiBsYWJlbC50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIHN0YXJ0Tm9kZTogZC5pZCxcbiAgICAgICAgICBlbmROb2RlOiBzLm5vZGVzICsgMSArIGksXG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBmcm9tOiBEYXRlLm5vdygpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzb3VyY2U6IGQuaWQsXG4gICAgICAgICAgdGFyZ2V0OiBzLm5vZGVzICsgMSArIGksXG4gICAgICAgICAgbGlua251bTogcy5yZWxhdGlvbnNoaXBzICsgMSArIGlcbiAgICAgIH07XG5cbiAgICAgIGRhdGEucmVsYXRpb25zaGlwc1tkYXRhLnJlbGF0aW9uc2hpcHMubGVuZ3RoXSA9IHJlbGF0aW9uc2hpcDtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwdWJsaWMgc2l6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbm9kZXM6IHRoaXMubm9kZXMubGVuZ3RoLFxuICAgICAgcmVsYXRpb25zaGlwczogdGhpcy5yZWxhdGlvbnNoaXBzLmxlbmd0aFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgc3RpY2tOb2RlKGQpIHtcbiAgICBkLmZ4ID0gZDMuZXZlbnQueDtcbiAgICBkLmZ5ID0gZDMuZXZlbnQueTtcbiAgfVxuXG4gIHB1YmxpYyB0aWNrKCkge1xuICAgIHRoaXMudGlja05vZGVzKCk7XG4gICAgdGhpcy50aWNrUmVsYXRpb25zaGlwcygpO1xuICB9XG5cbiAgcHVibGljIHRpY2tOb2RlcygpIHtcbiAgICBpZiAodGhpcy5ub2RlKSB7XG4gICAgICB0aGlzLm5vZGUuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCkge1xuICAgICAgICBpZihkIT11bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywgJyArIGQueSArICcpJztcbiAgICAgICAgY29uc3QgbXNnID0gXCI9PT09PT09PT0+Pj4+Pj4+Pj4+Pj4+PiBFUlJPUiA+PiB0aWNrTm9kZXNcIjtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0aWNrUmVsYXRpb25zaGlwcygpIHtcbiAgICBpZiAodGhpcy5yZWxhdGlvbnNoaXApIHtcbiAgICAgIGNvbnN0IHRoaXNPYmogPSB0aGlzO1xuICAgICAgdGhpcy5yZWxhdGlvbnNoaXAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCkge1xuICAgICAgICBpZihkIT11bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgYW5nbGUgPSB0aGlzT2JqLnJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCk7XG4gICAgICAgICAgaWYoZC5zb3VyY2UhPXVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIGQuc291cmNlLnggKyAnLCAnICsgZC5zb3VyY2UueSArICcpIHJvdGF0ZSgnICsgYW5nbGUgKyAnKSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1zZyA9IFwiPT09PT09PT09Pj4+Pj4+Pj4+Pj4+Pj4gRVJST1IgPj4gdGlja1JlbGF0aW9uc2hpcHNcIjtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgICBcbiAgICAgIH0pO1xuICAgICAgdGhpcy50aWNrUmVsYXRpb25zaGlwc1RleHRzKCk7XG4gICAgICB0aGlzLnRpY2tSZWxhdGlvbnNoaXBzT3V0bGluZXMoKTtcbiAgICAgIHRoaXMudGlja1JlbGF0aW9uc2hpcHNPdmVybGF5cygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0aWNrUmVsYXRpb25zaGlwc091dGxpbmVzKCkge1xuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXAuZWFjaCggKHJlbGF0aW9uc2hpcCwgaW5kZXgsIGcpID0+IHtcbiAgICAgIHZhciBvYmogPSBnW2luZGV4XTtcbiAgICAgIHZhciByZWwgPSBkMy5zZWxlY3Qob2JqKTtcbiAgICAgIHZhciBvdXRsaW5lO1xuICAgICAgdHJ5IHtvdXRsaW5lID0gcmVsLnNlbGVjdCgnLm91dGxpbmUnKTt9XG4gICAgICBjYXRjaChlcnIpIHsgcmV0dXJuOyB9XG4gICAgICBcbiAgICAgIHZhciB0ZXh0ID0gcmVsLnNlbGVjdCgnLnRleHQnKTtcbiAgICAgIFxuICAgICAgdHJ5IHt2YXIgYmJveCA9IHRleHQubm9kZSgpLmdldEJCb3goKTt9XG4gICAgICBjYXRjaChlcnIpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHZhciBwYWRkaW5nID0gMztcblxuICAgICAgb3V0bGluZS5hdHRyKCdkJywgZnVuY3Rpb24oZCkge1xuICAgICAgICB0cnkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXNPYmoub3B0aW9ucztcbiAgICAgICAgdmFyIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxuICAgICAgICAgIGFuZ2xlID0gdGhpc09iai5yb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICAgIHRleHRCb3VuZGluZ0JveCA9IHRleHQubm9kZSgpLmdldEJCb3goKSxcbiAgICAgICAgICB0ZXh0UGFkZGluZyA9IDUsXG4gICAgICAgICAgdSA9IHRoaXNPYmoudW5pdGFyeVZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICAgIHRleHRNYXJnaW4gPSB7IHg6IChkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtICh0ZXh0Qm91bmRpbmdCb3gud2lkdGggKyB0ZXh0UGFkZGluZykgKiB1LngpICogMC41LCB5OiAoZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAodGV4dEJvdW5kaW5nQm94LndpZHRoICsgdGV4dFBhZGRpbmcpICogdS55KSAqIDAuNSB9LFxuICAgICAgICAgIG4gPSB0aGlzT2JqLnVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRBMSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgKyAodGhpc09iai5vcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIG4ueCwgeTogMCArICh0aGlzT2JqLm9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRCMSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IHRleHRNYXJnaW4ueCAtIG4ueCwgeTogdGV4dE1hcmdpbi55IC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRDMSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IHRleHRNYXJnaW4ueCwgeTogdGV4dE1hcmdpbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnREMSA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgKyAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LngsIHk6IDAgKyAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEEyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSB0ZXh0TWFyZ2luLnggLSBuLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gdGV4dE1hcmdpbi55IC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRCMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gbi54IC0gdS54ICogb3B0aW9ucy5hcnJvd1NpemUsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IC0gbi55IC0gdS55ICogb3B0aW9ucy5hcnJvd1NpemUgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEMyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSBuLnggKyAobi54IC0gdS54KSAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIG4ueSArIChuLnkgLSB1LnkpICogb3B0aW9ucy5hcnJvd1NpemUgfSwgYW5nbGUpLFxuICAgICAgICAgIHJvdGF0ZWRQb2ludEQyID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRFMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54ICsgKC0gbi54IC0gdS54KSAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSArICgtIG4ueSAtIHUueSkgKiBvcHRpb25zLmFycm93U2l6ZSB9LCBhbmdsZSksXG4gICAgICAgICAgcm90YXRlZFBvaW50RjIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIHUueCAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIHUueSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcbiAgICAgICAgICByb3RhdGVkUG9pbnRHMiA9IHRoaXNPYmoucm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gdGV4dE1hcmdpbi54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIHRleHRNYXJnaW4ueSB9LCBhbmdsZSk7XG5cbiAgICAgICAgcmV0dXJuICdNICcgKyByb3RhdGVkUG9pbnRBMS54ICsgJyAnICsgcm90YXRlZFBvaW50QTEueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCMS54ICsgJyAnICsgcm90YXRlZFBvaW50QjEueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRDMS54ICsgJyAnICsgcm90YXRlZFBvaW50QzEueSArXG4gICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnREMS54ICsgJyAnICsgcm90YXRlZFBvaW50RDEueSArXG4gICAgICAgICAgJyBaIE0gJyArIHJvdGF0ZWRQb2ludEEyLnggKyAnICcgKyByb3RhdGVkUG9pbnRBMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEIyLnggKyAnICcgKyByb3RhdGVkUG9pbnRCMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEMyLnggKyAnICcgKyByb3RhdGVkUG9pbnRDMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEQyLnggKyAnICcgKyByb3RhdGVkUG9pbnREMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEUyLnggKyAnICcgKyByb3RhdGVkUG9pbnRFMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEYyLnggKyAnICcgKyByb3RhdGVkUG9pbnRGMi55ICtcbiAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEcyLnggKyAnICcgKyByb3RhdGVkUG9pbnRHMi55ICtcbiAgICAgICAgICAnIFonO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycikgeyByZXR1cm47IH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG91dGxpbmVGdW5jdGlvbihkLCB0ZXh0KSB7XG4gICAgICBcbiAgfVxuXG4gIHB1YmxpYyB0aWNrUmVsYXRpb25zaGlwc092ZXJsYXlzKCkge1xuICAgIHZhciB0aGlzT2JqIDogTmdOZW80amQzU2VydmljZSA9IHRoaXM7XG4gICAgdGhpcy5yZWxhdGlvbnNoaXBPdmVybGF5LmF0dHIoJ2QnLCBmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXG4gICAgICAgIGFuZ2xlID0gdGhpc09iai5yb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICBuMSA9IHRoaXNPYmoudW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICBuID0gdGhpc09iai51bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCwgNTApLFxuICAgICAgICByb3RhdGVkUG9pbnRBID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogMCAtIG4ueCwgeTogMCAtIG4ueSB9LCBhbmdsZSksXG4gICAgICAgIHJvdGF0ZWRQb2ludEIgPSB0aGlzT2JqLnJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIG4ueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICByb3RhdGVkUG9pbnRDID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggKyBuLnggLSBuMS54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSArIG4ueSAtIG4xLnkgfSwgYW5nbGUpLFxuICAgICAgICByb3RhdGVkUG9pbnREID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHsgeDogMCArIG4ueCAtIG4xLngsIHk6IDAgKyBuLnkgLSBuMS55IH0sIGFuZ2xlKTtcblxuICAgICAgcmV0dXJuICdNICcgKyByb3RhdGVkUG9pbnRBLnggKyAnICcgKyByb3RhdGVkUG9pbnRBLnkgK1xuICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEIueCArICcgJyArIHJvdGF0ZWRQb2ludEIueSArXG4gICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50Qy54ICsgJyAnICsgcm90YXRlZFBvaW50Qy55ICtcbiAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRELnggKyAnICcgKyByb3RhdGVkUG9pbnRELnkgK1xuICAgICAgICAnIFonO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHRpY2tSZWxhdGlvbnNoaXBzVGV4dHMoKSB7XG4gICAgdmFyIHRoaXNPYmogOiBOZ05lbzRqZDNTZXJ2aWNlID0gdGhpcztcbiAgICB0aGlzLnJlbGF0aW9uc2hpcFRleHQuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIGFuZ2xlID0gKHRoaXNPYmoucm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSArIDM2MCkgJSAzNjAsXG4gICAgICAgIG1pcnJvciA9IGFuZ2xlID4gOTAgJiYgYW5nbGUgPCAyNzAsXG4gICAgICAgIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxuICAgICAgICBuID0gdGhpc09iai51bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgIG5XZWlnaHQgPSBtaXJyb3IgPyAyIDogLTMsXG4gICAgICAgIHBvaW50ID0geyB4OiAoZC50YXJnZXQueCAtIGQuc291cmNlLngpICogMC41ICsgbi54ICogbldlaWdodCwgeTogKGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55KSAqIDAuNSArIG4ueSAqIG5XZWlnaHQgfSxcbiAgICAgICAgcm90YXRlZFBvaW50ID0gdGhpc09iai5yb3RhdGVQb2ludChjZW50ZXIsIHBvaW50LCBhbmdsZSk7XG5cbiAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyByb3RhdGVkUG9pbnQueCArICcsICcgKyByb3RhdGVkUG9pbnQueSArICcpIHJvdGF0ZSgnICsgKG1pcnJvciA/IDE4MCA6IDApICsgJyknO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHVuaXRhcnlOb3JtYWxWZWN0b3Ioc291cmNlLCB0YXJnZXQsIG5ld0xlbmd0aD0xKSB7XG4gICAgdmFyIGNlbnRlciA9IHsgeDogMCwgeTogMCB9O1xuICAgIHZhciB2ZWN0b3IgPSB0aGlzLnVuaXRhcnlWZWN0b3Ioc291cmNlLCB0YXJnZXQsIG5ld0xlbmd0aCk7XG4gICAgcmV0dXJuIHRoaXMucm90YXRlUG9pbnQoY2VudGVyLCB2ZWN0b3IsIDkwKTtcbiAgfVxuXG4gIHB1YmxpYyB1bml0YXJ5VmVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBuZXdMZW5ndGg9MSkge1xuICAgIHZhciBsZW5ndGggPSBNYXRoLnNxcnQoTWF0aC5wb3codGFyZ2V0LnggLSBzb3VyY2UueCwgMikgKyBNYXRoLnBvdyh0YXJnZXQueSAtIHNvdXJjZS55LCAyKSkgLyBNYXRoLnNxcnQobmV3TGVuZ3RoIHx8IDEpO1xuICAgIHJldHVybiB7XG4gICAgICB4OiAodGFyZ2V0LnggLSBzb3VyY2UueCkgLyBsZW5ndGgsXG4gICAgICB5OiAodGFyZ2V0LnkgLSBzb3VyY2UueSkgLyBsZW5ndGgsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIG9ic2VsZXRlIGFuZCBub3QgdXNlZCBhbnkgd2hlcmVcbiAgICogQG9ic2VsZXRlXG4gICAqIEBwYXJhbSBkM0RhdGFcbiAgICovXG4gIHB1YmxpYyB1cGRhdGVXaXRoRDNEYXRhKGQzRGF0YSkge1xuICAgIHRoaXMudXBkYXRlTm9kZXNBbmRSZWxhdGlvbnNoaXBzKGQzRGF0YS5ub2RlcywgZDNEYXRhLnJlbGF0aW9uc2hpcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBkYXRhIGZvciBOZW80aiBWaXN1YWxpemF0aW9uXG4gICAqIEBwYXJhbSBuZW80akRhdGEgXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlV2l0aE5lbzRqRGF0YShuZW80akRhdGEpIHtcbiAgICB2YXIgZDNEYXRhID0gdGhpcy5uZW80akRhdGFUb0QzRGF0YShuZW80akRhdGEpO1xuICAgIHRoaXMudXBkYXRlTm9kZXNBbmRSZWxhdGlvbnNoaXBzKGQzRGF0YS5ub2RlcywgZDNEYXRhLnJlbGF0aW9uc2hpcHMpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUluZm8oZCkge1xuICAgIHRoaXMuY2xlYXJJbmZvKCk7XG5cbiAgICBpZiAoZC5sYWJlbHMpIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnRDbGFzcygnY2xhc3MnLCBkLmxhYmVsc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXBwZW5kSW5mb0VsZW1lbnRSZWxhdGlvbnNoaXAoJ2NsYXNzJywgZC50eXBlKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGVuZEluZm9FbGVtZW50UHJvcGVydHkoJ3Byb3BlcnR5JywgJyZsdDtpZCZndDsnLCBkLmlkKTtcbiAgICBcbiAgICB2YXIgdGhpc09iaiA6IE5nTmVvNGpkM1NlcnZpY2UgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKGQucHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgdGhpc09iai5hcHBlbmRJbmZvRWxlbWVudFByb3BlcnR5KCdwcm9wZXJ0eScsIHByb3BlcnR5LCBKU09OLnN0cmluZ2lmeShkLnByb3BlcnRpZXNbcHJvcGVydHldKSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlTm9kZXMobikge1xuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMubm9kZXMsIG4pO1xuXG4gICAgdGhpcy5ub2RlID0gdGhpcy5zdmdOb2Rlcy5zZWxlY3RBbGwoJy5ub2RlJykuZGF0YSh0aGlzLm5vZGVzLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkOyB9KTtcbiAgICB2YXIgbm9kZUVudGVyID0gdGhpcy5hcHBlbmROb2RlVG9HcmFwaCgpO1xuICAgIHRoaXMubm9kZSA9IG5vZGVFbnRlci5tZXJnZSh0aGlzLm5vZGUpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZU5vZGVzQW5kUmVsYXRpb25zaGlwcyhuLCByKSB7XG4gICAgdGhpcy51cGRhdGVSZWxhdGlvbnNoaXBzKHIpO1xuICAgIHRoaXMudXBkYXRlTm9kZXMobik7XG5cbiAgICB0aGlzLnNpbXVsYXRpb24ubm9kZXModGhpcy5ub2Rlcyk7XG4gICAgdGhpcy5zaW11bGF0aW9uLmZvcmNlKCdsaW5rJykubGlua3ModGhpcy5yZWxhdGlvbnNoaXBzKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVSZWxhdGlvbnNoaXBzKHIpIHtcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLnJlbGF0aW9uc2hpcHMsIHIpO1xuXG4gICAgdGhpcy5yZWxhdGlvbnNoaXAgPSB0aGlzLnN2Z1JlbGF0aW9uc2hpcHMuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwJykuZGF0YSh0aGlzLnJlbGF0aW9uc2hpcHMsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7IH0pO1xuICAgIHZhciByZWxhdGlvbnNoaXAgPSB0aGlzLmFwcGVuZFJlbGF0aW9uc2hpcCgpO1xuXG4gICAgdmFyIHJlbGF0aW9uc2hpcEVudGVyIDogUmVsYXRpb25zaGlwRW50ZXIgPSB0aGlzLmFwcGVuZFJlbGF0aW9uc2hpcFRvR3JhcGgocmVsYXRpb25zaGlwKTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcEVudGVyLnJlbGF0aW9uc2hpcC5tZXJnZSh0aGlzLnJlbGF0aW9uc2hpcCk7XG5cbiAgICB0aGlzLnJlbGF0aW9uc2hpcE91dGxpbmUgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAgLm91dGxpbmUnKTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcE91dGxpbmUgPSByZWxhdGlvbnNoaXBFbnRlci5vdXRsaW5lLm1lcmdlKHRoaXMucmVsYXRpb25zaGlwT3V0bGluZSk7XG5cbiAgICB0aGlzLnJlbGF0aW9uc2hpcE92ZXJsYXkgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAgLm92ZXJsYXknKTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcE92ZXJsYXkgPSByZWxhdGlvbnNoaXBFbnRlci5vdmVybGF5Lm1lcmdlKHRoaXMucmVsYXRpb25zaGlwT3ZlcmxheSk7XG5cbiAgICB0aGlzLnJlbGF0aW9uc2hpcFRleHQgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAgLnRleHQnKTtcbiAgICB0aGlzLnJlbGF0aW9uc2hpcFRleHQgPSByZWxhdGlvbnNoaXBFbnRlci50ZXh0Lm1lcmdlKHRoaXMucmVsYXRpb25zaGlwVGV4dCk7XG4gIH1cblxuXG5cblxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyAgICAgICAgICAgIE5lbzRqIFV0aWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuXG4gIHB1YmxpYyBnZXRPcHRpb25zUHJlc2VudGF0aW9uKCkgOiBOZ05lbzRqRDNPcHRpb25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgYXJyb3dTaXplOiA0LFxuICAgICAgY29sb3JzOiB1bmRlZmluZWQsXG4gICAgICBoaWdobGlnaHQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAnUHJvamVjdCcsXG4gICAgICAgICAgcHJvcGVydHk6ICduYW1lJyxcbiAgICAgICAgICB2YWx1ZTogJ25lbzRqZDMnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzczogJ1VzZXInLFxuICAgICAgICAgIHByb3BlcnR5OiAndXNlcklkJyxcbiAgICAgICAgICB2YWx1ZTogJ2Vpc21hbidcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGljb25zOiBOZ05lbzRqRDNJY29ucy5leGFtcGxlSWNvbnMoKSxcbiAgICAgIGltYWdlczogTmdOZW80akQzSWNvbnMuZXhhbXBsZUltYWdlcygpLFxuICAgICAgaWNvbk1hcDogdW5kZWZpbmVkLCAgICAvLyBUaGlzIHZhbHVlIGFzc2lnbmVkIGluIE5lbzRqUmFuZG9tXG4gICAgICBpbWFnZU1hcDogdW5kZWZpbmVkLFxuICAgICAgaW5mb1BhbmVsOiB0cnVlLFxuICAgICAgbWluQ29sbGlzaW9uOiA2MCxcbiAgICAgIG5lbzRqRGF0YTogTmVvNGpEM1JlY29yZHMsXG4gICAgICBub2RlT3V0bGluZUZpbGxDb2xvcjogdW5kZWZpbmVkLFxuICAgICAgbmVvNGpEYXRhVXJsOiB1bmRlZmluZWQsXG4gICAgICBub2RlUmFkaXVzOiAyNSxcbiAgICAgIHJlbGF0aW9uc2hpcENvbG9yOiAnI2E1YWJiNicsXG4gICAgICBvblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrOiBmdW5jdGlvbihyZWxhdGlvbnNoaXApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RvdWJsZSBjbGljayBvbiByZWxhdGlvbnNoaXA6ICcgKyBKU09OLnN0cmluZ2lmeShyZWxhdGlvbnNoaXApKTtcbiAgICAgIH0sXG4gICAgICB6b29tRml0OiB0cnVlLFxuICAgICAgc2hvd0ljb25zOiB0cnVlLFxuICAgICAgb25Ob2RlRG91YmxlQ2xpY2s6IHVuZGVmaW5lZCxcbiAgICAgIG9uTm9kZUNsaWNrOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVNb3VzZUVudGVyOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVNb3VzZUxlYXZlOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVEcmFnRW5kOiB1bmRlZmluZWQsXG4gICAgICBvbk5vZGVEcmFnU3RhcnQ6IHVuZGVmaW5lZCxcbiAgICAgIGdyYXBoQ29udGFpbmVySGVpZ2h0OiAnMTAwJSdcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZVBvaW50KGMsIHAsIGFuZ2xlKSB7XG4gICAgcmV0dXJuIHRoaXMucm90YXRlKGMueCwgYy55LCBwLngsIHAueSwgYW5nbGUpO1xuICB9XG5cbiAgcHVibGljIHJvdGF0aW9uKHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIodGFyZ2V0LnkgLSBzb3VyY2UueSwgdGFyZ2V0LnggLSBzb3VyY2UueCkgKiAxODAgLyBNYXRoLlBJO1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZShjeCwgY3ksIHgsIHksIGFuZ2xlKSB7XG4gICAgdmFyIHJhZGlhbnMgPSAoTWF0aC5QSSAvIDE4MCkgKiBhbmdsZSxcbiAgICAgICAgY29zID0gTWF0aC5jb3MocmFkaWFucyksXG4gICAgICAgIHNpbiA9IE1hdGguc2luKHJhZGlhbnMpLFxuICAgICAgICBueCA9IChjb3MgKiAoeCAtIGN4KSkgKyAoc2luICogKHkgLSBjeSkpICsgY3gsXG4gICAgICAgIG55ID0gKGNvcyAqICh5IC0gY3kpKSAtIChzaW4gKiAoeCAtIGN4KSkgKyBjeTtcblxuICAgIHJldHVybiB7IHg6IG54LCB5OiBueSB9O1xuICB9XG5cbiAgcHVibGljIGluaXRJY29uTWFwKG9wdGlvbnMpIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLmljb25NYXApLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgdmFyIGtleXMgPSBrZXkuc3BsaXQoJywnKTtcbiAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnMuaWNvbk1hcFtrZXldO1xuXG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIG9wdGlvbnMuaWNvbk1hcFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3B0aW9ucy5pY29uTWFwO1xuICB9XG5cbiAgcHVibGljIGluaXRJbWFnZU1hcChvcHRpb25zKSB7XG4gICAgLy8gdmFyIGtleSwga2V5cywgc2VsZWN0b3I7XG4gICAgdmFyIGtleSwga2V5cztcbiAgICBmb3IgKGtleSBpbiBvcHRpb25zLmltYWdlcykge1xuICAgICAgaWYgKG9wdGlvbnMuaW1hZ2VzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAga2V5cyA9IGtleS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAoIW9wdGlvbnMuaW1hZ2VNYXBba2V5c1swXV0pIHtcbiAgICAgICAgICBvcHRpb25zLmltYWdlTWFwW2tleXNbMF1dID0gW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXS5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kVGV4dFRvUmVsYXRpb25zaGlwKHIpIHtcbiAgICB2YXIgclRleHQgPSByLmFwcGVuZCgndGV4dCcpO1xuICAgIHJldHVybiByVGV4dC5hdHRyKCdjbGFzcycsICd0ZXh0JykuYXR0cignZmlsbCcsICcjMDAwMDAwJykuYXR0cignZm9udC1zaXplJywgJzhweCcpLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkLnR5cGU7IH0pO1xuICB9XG5cbiAgcHVibGljIGFwcGVuZFJlbGF0aW9uc2hpcFRvR3JhcGgocmVsYXRpb25zaGlwKSA6IFJlbGF0aW9uc2hpcEVudGVyIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMuYXBwZW5kVGV4dFRvUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCk7XG4gICAgdmFyIG91dGxpbmUgPSByZWxhdGlvbnNoaXAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnb3V0bGluZScpLmF0dHIoJ2ZpbGwnLCAnI2E1YWJiNicpLmF0dHIoJ3N0cm9rZScsICdub25lJyk7XG4gICAgdmFyIG92ZXJsYXkgPSByZWxhdGlvbnNoaXAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnb3ZlcmxheScpO1xuXG4gICAgLy8gdGhpcy5yZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXA7XG4gICAgcmV0dXJuIHtcbiAgICAgIG91dGxpbmU6IG91dGxpbmUsXG4gICAgICBvdmVybGF5OiBvdmVybGF5LFxuICAgICAgcmVsYXRpb25zaGlwOiByZWxhdGlvbnNoaXAsXG4gICAgICB0ZXh0OiB0ZXh0XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZVByb3BlcnR5KHRhcmdldCwgc291cmNlKSB7XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICBjb25zdCBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICBpZihzb3VyY2VQcm9wZXJ0eSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYoIShzb3VyY2VQcm9wZXJ0eSBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgZWxzZSBpZihzb3VyY2VQcm9wZXJ0eS5sZW5ndGg+MClcbiAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB2ZXJzaW9uKCkge1xuICAgIHJldHVybiBcIjAuMS42XCI7XG4gIH1cbn1cblxuIl19