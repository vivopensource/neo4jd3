import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { NgNeo4jD3Options, RelationshipEnter } from './ng-neo4jd3.model';
import { NgNeo4jD3Icons } from './ng-neo4jd3.icons';
import { Neo4jD3Records } from "./ng-neo4jd3.records";

@Injectable({
  providedIn: 'root'
})
export class NgNeo4jd3Service {

  public outOfContext : boolean = false;
  private valueSet : boolean = false;

  private container;
  private containerIdentity;
  private info;
  private node;
  private nodes;

  private relationship;
  private relationships : Array<any>;
  private relationshipOutline;
  private relationshipOverlay;
  private relationshipText;

  private simulation;

  public svg;
  private svgNodes;
  private svgRelationships;
  private svgTranslate;
  
  private classes2colors = {};
  private justLoaded = false;
  private numClasses = 0;
  private svgScale = undefined;

  private label;

  private optionsInput : Object;

  private options : NgNeo4jD3Options = {
      arrowSize: 4,
      colors: this.colors(),
      highlight: undefined,
      icons: undefined,
      iconMap: [],    // This value assigned in Neo4jRandom
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


  constructor() {}

  public setValues (_selector, _options:any) : void {
      new NgNeo4jD3Icons(this.options);
      this.containerIdentity = _selector;
      this.optionsInput = _options;
      this.valueSet = true;
  }

  public isValueSet() : boolean {
      return this.valueSet;
  }

  public getOptionsInput() : Object {
      return this.optionsInput;
  }

  public getContainer() : Object {
      return this.container;
  }


  public init() {
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
    } else if (this.options.neo4jDataUrl) {
        this.loadNeo4jDataFromUrl(this.options.neo4jDataUrl);
    } else {
        console.error('Error: both neo4jData and neo4jDataUrl are empty!');
    }

    return this.options;
  }

  public initSimulation() {

      var thisObj = this;

      var parentElement = this.svg.node().parentElement;
      if(parentElement==undefined || parentElement.parentElement==undefined) {
          return;
      }

      const clientWidth = this.svg.node().parentElement.parentElement.clientWidth / 2;
      const clientHeight = this.svg.node().parentElement.parentElement.clientHeight / 2;

      var simulation = d3.forceSimulation() 
          // .velocityDecay(0.8)
          // .force('x', d3.force().strength(0.002))
          // .force('y', d3.force().strength(0.002))
          .force('collide', d3.forceCollide().radius(function(d) {
              return thisObj.options.minCollision;
          })
          .iterations(2))
          .force('charge', d3.forceManyBody())
          .force('link', d3.forceLink().id(function(d) {
              return d.id;
          }))
          .force('center', d3.forceCenter(clientWidth, clientHeight))
          .on('tick', function() {
              thisObj.tick();
          })
          .on('end', function() {
              if (thisObj.options.zoomFit && !thisObj.justLoaded) {
                // FOR CUSTOMIZATION
              }
          });
      return simulation;
  }

  public appendGraph(container) {
      var thisObj : NgNeo4jd3Service = this;
      var svg = container.append('svg')
                 .attr('width', '100%')
                 .attr('height', '100%')
                 .attr('class', 'neo4jd3-graph')
                 .call(d3.zoom().on('zoom', function() {
                     var scale = d3.event.transform.k,
                         translate = [d3.event.transform.x, d3.event.transform.y];

                     if (thisObj.svgTranslate) {
                         translate[0] += thisObj.svgTranslate[0];
                         translate[1] += thisObj.svgTranslate[1];
                     }

                     if (thisObj.svgScale) {
                         scale *= thisObj.svgScale;
                     }

                     thisObj.svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
                 }))
                 .on('dblclick.zoom', null)
                 .append('g')
                 .attr('width', '100%')
                 .attr('height', '100%');

                  this.svgRelationships = svg.append('g').attr('class', 'relationships');
                  this.svgNodes = svg.append('g').attr('class', 'nodes');
      return svg;
  }

  public appendInfoPanel(container) {
      return container.append('div')
                  .attr('class', 'neo4jd3-info');
  }

  public appendInfoElement(cls, isNode, property, value=null) {
      var elem = this.info.append('a');

      elem.attr('href', '#')
      .attr('class', cls)
      .html('<strong>' + property + '</strong>' + (value ? (': ' + value) : ''));

      if (!value) {
          var thisObj : NgNeo4jd3Service = this;
          elem.style('background-color', function(d) {
              return thisObj.options.nodeOutlineFillColor ? thisObj.options.nodeOutlineFillColor : (isNode ? thisObj.class2color(property) : thisObj.defaultColor());
          })
          .style('border-color', function(d) {
              return thisObj.options.nodeOutlineFillColor ? thisObj.class2darkenColor(thisObj.options.nodeOutlineFillColor) : (isNode ? thisObj.class2darkenColor(property) : thisObj.defaultDarkenColor());
          })
          .style('color', function(d) {
              return thisObj.options.nodeOutlineFillColor ? thisObj.class2darkenColor(thisObj.options.nodeOutlineFillColor) : '#fff';
          });
      }
  }

  public appendInfoElementClass(cls, node) {
      this.appendInfoElement(cls, true, node);
  }

  public appendInfoElementProperty(cls, property, value) {
      this.appendInfoElement(cls, false, property, value);
  }

  public appendInfoElementRelationship(cls, relationship) {
      this.appendInfoElement(cls, false, relationship);
  }

  public appendNode() {
      var thisObj : NgNeo4jd3Service = this;
      return this.node.enter()
             .append('g')
             .attr('class', function(d) {
                 var classes = 'node';
                 if (thisObj.icon(d)) {
                     classes += ' node-icon';
                 }
                 if (thisObj.image(d)) {
                     classes += ' node-image';
                 }
                 if (thisObj.options.highlight) {
                     for (var i = 0; i < thisObj.options.highlight.length; i++) {
                         const highlight = thisObj.options.highlight[i];

                         if (d.labels[0] === highlight.class && d.properties[highlight.property] === highlight.value) {
                             classes += ' node-highlighted';
                             break;
                         }
                     }
                 }
                 return classes;
             })
             .on('click', function(d) {
                  d.fx = d.fy = null;
                  if (thisObj.options.onNodeClick != undefined ) {
                      thisObj.options.onNodeClick(d);
                  }
             })
             .on('dblclick', function(d) {
                 thisObj.stickNode(d);
                 if (thisObj.options.onNodeDoubleClick != undefined ) {
                      thisObj.options.onNodeDoubleClick(d);
                  }
             })
             .on('mouseenter', function(d) {
                  if (thisObj.info) {
                      thisObj.updateInfo(d);
                  }
                  if (thisObj.options.onNodeMouseEnter != undefined ) {
                      thisObj.options.onNodeMouseEnter(d);
                  }
             })
             .on('mouseleave', function(d) {
                  if (thisObj.info) {
                      thisObj.clearInfo();
                  }
                  if (thisObj.options.onNodeMouseLeave != undefined ) {
                      thisObj.options.onNodeMouseLeave(d);
                  }
             })
             .call(d3.drag()
                     .on('start',  function(d) { thisObj.dragStarted(d); } )
                     .on('drag', function(d) { thisObj.dragged(d); } )
                     .on('end', function(d) { thisObj.dragEnded(d); } ) );
  }

  public appendNodeToGraph() {
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

  public appendOutlineToNode(node) {
      var thisObj = this;
      var options = this.options;
      return node.append('circle')
             .attr('class', 'outline')
             .attr('r', options.nodeRadius)
             .style('fill', function(d) {
                 return options.nodeOutlineFillColor ? options.nodeOutlineFillColor : thisObj.class2color(d.labels[0]);
             })
             .style('stroke', function(d) {
                 return options.nodeOutlineFillColor ? thisObj.class2darkenColor(options.nodeOutlineFillColor) : thisObj.class2darkenColor(d.labels[0]);
             })
             .append('title').text(function(d) {
                  return thisObj.toString(d);
             });
  }

  public class2color(cls) {
      var color = this.classes2colors[cls];
      if (!color) {
          // color = this.options.colors[Math.min(numClasses, this.options.colors.length - 1)];
          color = this.options.colors[this.numClasses % this.options.colors.length];
          this.classes2colors[cls] = color;
          this.numClasses++;
      }
      return color;
  }

  public class2darkenColor(cls) {
      var colorValue = this.class2color(cls);
      try {
          // COLOR Object is not working properly when the optimization is set true
          var colorObject = d3.rgb(colorValue);
          return colorObject.darker(1);
      }
      catch(err) {}
  }

  public appendRingToNode(node) {
      var thisObj = this;
      return node.append('circle')
          .attr('class', 'ring')
          .attr('r', this.options.nodeRadius * 1.16)
          .append('title').text(function(d) {
          return thisObj.toString(d);
      });
  }


  public appendImageToNode(node) {
      var thisObj = this;
      // TODO >> Change This To Become The Container
      // Added the [iconFlag] attribute in the node or 'd' variable
      return node.append('image').attr('width', '35px').attr('height', '35px').attr('x', '-18px').attr('y', '-18px')
      .attr('xlink:href', function(d) { return thisObj.image(d); });
     ;
  }

  public appendTextToNode(node) {
      var thisObj = this;
      return node.append('text')
          .attr('class', function(d) { return 'text' + (thisObj.icon(d) ? ' icon' : ''); })
          .attr('fill', 'black')
          .attr('font-size', function(d) { return (thisObj.icon(d) ? '25px' : '12px'); })
          .attr('pointer-events', 'none')
          .attr('text-anchor', 'middle')
          .attr('x', function(d) { return (thisObj.icon(d) ? '25px' : '30px'); })
          .attr('y', function(d) { return (thisObj.icon(d) ? '25px' : '30px'); })
          .attr('style', function(d) {
              const rgb = 'fill: rgb(225, 225, 225); stroke: rgb(000, 000, 000);';
              return thisObj.icon(d) ? rgb : '';
          })
          .html(function(d) {
              var _icon = thisObj.icon(d);
              return _icon ? '&#x' + _icon : d.id;
          });
  }

  public appendRandomDataToNode(d, maxNodesToGenerate) {
      var data = this.randomD3Data(d, maxNodesToGenerate);
      this.updateWithNeo4jData(data);
  }

  public appendRelationship() {
      var thisObj : NgNeo4jd3Service = this;
      // Function > Double Click 
      const fnDoubleClick = function(d:any) {
          if (thisObj.options.onRelationshipDoubleClick != undefined ) {
              thisObj.options.onRelationshipDoubleClick(d);
          }
      };
      // Function > Mouse Enter
      const fnMouseEnter = function(d:any) {
          if (thisObj.info) {
              thisObj.updateInfo(d);
          }
      };
      return this.relationship.enter().append('g').attr('class', 'relationship').on('dblclick', fnDoubleClick).on('mouseenter', fnMouseEnter);
  }

  public clearInfo() {
      this.info.html('');
  }

  public color() {
      return this.options.colors[this.options.colors.length * Math.random() << 0];
  }

  public colors() : Array<String> {
      // d3.schemeCategory10,
      // d3.schemeCategory20,
      return [
          '#68bdf6', // light blue
          '#6dce9e', // green #1
          '#faafc2', // light pink
          '#f2baf6', // purple
          '#ff928c', // light red
          '#fcea7e', // light yellow
          '#ffc766', // light orange
          '#405f9e', // navy blue
          '#a5abb6', // dark gray
          '#78cecb', // green #2,
          '#b88cbb', // dark purple
          '#ced2d9', // light gray
          '#e84646', // dark red
          '#fa5f86', // dark pink
          '#ffab1a', // dark orange
          '#fcda19', // dark yellow
          '#797b80', // black
          '#c9d96f', // pistacchio
          '#47991f', // green #3
          '#70edee', // turquoise
          '#ff75ea'  // pink
      ];
  }

  public containsResult(array, id) {
      var filter = array.filter(function(elem) {
          return elem.id === id;
      });
      return filter.length > 0;
  }

  public defaultColor() {
  return this.options.relationshipColor;
  }

  public defaultDarkenColor() {
      var colorValue = this.options.colors[this.options.colors.length - 1];
      try {
          // COLOR Object is not working properly when the optimization is set true
          var colorObject = d3.rgb(colorValue);
          return colorObject.darker(1);
      }
      catch(err) { }
  }

  public dragEnded(d) {
      if (!d3.event.active) {
          this.simulation.alphaTarget(0);
      }

      if (this.options.onNodeDragEnd != undefined ) {
          this.options.onNodeDragEnd(d);
      }
  }

  public dragged(d) {
      this.stickNode(d);
  }

  public dragStarted(d) {
      if (!d3.event.active) {
          this.simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
      if (this.options.onNodeDragStart != undefined ) {
          this.options.onNodeDragStart(d);
      }
  }

  public extend(obj1, obj2) {
    var obj = {};
    this.mergeProperty(obj, obj1);
    this.mergeProperty(obj, obj2);
    return obj;
  }


  public icon(d) {
    var code;

    if (this.options.iconMap && this.options.showIcons && this.options.icons) {
        if (this.options.icons[d.labels[0]] && this.options.iconMap[this.options.icons[d.labels[0]]]) {
            code = this.options.iconMap[this.options.icons[d.labels[0]]];
        } else if (this.options.iconMap[d.labels[0]]) {
            code = this.options.iconMap[d.labels[0]];
        } else if (this.options.icons[d.labels[0]]) {
            code = this.options.icons[d.labels[0]];
        }
    }

    return code;
  }

  public image(d) {
    var i, imagesForLabel, img, imgLevel, label, labelPropertyValue, property, value;

    if (this.options.images) {
        const imgRef = d.img==undefined ? d.labels[0] : d.img;
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

  public loadNeo4jData() {
    this.nodes = [];
    this.relationships = [];
    this.updateWithNeo4jData(this.options.neo4jData);
  }

  public loadNeo4jDataFromUrl(neo4jDataUrl) {
    this.nodes = [];
    this.relationships = [];

    d3.json(neo4jDataUrl, function(error, data) {
        if (error) {
            throw error;
        }
        this.updateWithNeo4jData(data);
    });
  }

  public neo4jDataToD3Data(data) {
    var graph = {
        nodes: [],
        relationships: []
    };

    var thisObj : NgNeo4jd3Service = this;
    data.results.forEach(function(result) {
        result.data.forEach(function(data) {
            data.graph.nodes.forEach(function(node) {
                if (!thisObj.containsResult(graph.nodes, node.id)) {
                    graph.nodes.push(node);
                }
            });

            data.graph.relationships.forEach(function(relationship) {
                relationship.source = relationship.startNode;
                relationship.target = relationship.endNode;
                graph.relationships.push(relationship);
            });

            data.graph.relationships.sort(function(a, b) {
                if (a.source > b.source) {
                    return 1;
                } else if (a.source < b.source) {
                    return -1;
                } else {
                    if (a.target > b.target) {
                        return 1;
                    }

                    if (a.target < b.target) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            });

            for (var i = 0; i < data.graph.relationships.length; i++) {
                if (i !== 0 && data.graph.relationships[i].source === data.graph.relationships[i-1].source && data.graph.relationships[i].target === data.graph.relationships[i-1].target) {
                    data.graph.relationships[i].linknum = data.graph.relationships[i - 1].linknum + 1;
                } else {
                    data.graph.relationships[i].linknum = 1;
                }
            }
        });
    });

    return graph;
  }

  public toString(d) {
    var s = d.labels ? d.labels[0] : d.type;
    s += ' (<id>: ' + d.id;
    Object.keys(d.properties).forEach(function(property) {
        s += ', ' + property + ': ' + JSON.stringify(d.properties[property]);
    });
    s += ')';
    return s;
  }

  public randomD3Data(d, maxNodesToGenerate) {
    var data = {
        nodes: [],
        relationships: []
    };

    var numNodes = (maxNodesToGenerate * Math.random() << 0) + 1;
    var s = this.size();

    for (var i = 0; i < numNodes; i++) {
      // var icons = Object.keys(this.options.iconMap);
      const label = "Hello"; // icons[icons.length * Math.random() << 0];

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

  public size() {
    return {
      nodes: this.nodes.length,
      relationships: this.relationships.length
    };
  }

  public stickNode(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  public tick() {
    this.tickNodes();
    this.tickRelationships();
  }

  public tickNodes() {
    if (this.node) {
      this.node.attr('transform', function(d) {
        if(d!=undefined)
            return 'translate(' + d.x + ', ' + d.y + ')';
        const msg = "=========>>>>>>>>>>>>>> ERROR >> tickNodes";
        console.error(msg);
        throw new Error(msg);
      });
    }
  }

  public tickRelationships() {
    if (this.relationship) {
      const thisObj = this;
      this.relationship.attr('transform', function(d) {
        if(d!=undefined) {
          var angle = thisObj.rotation(d.source, d.target);
          if(d.source!=undefined) {
            return 'translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')';
          }
        }
        const msg = "=========>>>>>>>>>>>>>> ERROR >> tickRelationships";
        console.error(msg);
        throw new Error(msg);
          
      });
      this.tickRelationshipsTexts();
      this.tickRelationshipsOutlines();
      this.tickRelationshipsOverlays();
    }
  }

  public tickRelationshipsOutlines() {
    var thisObj : NgNeo4jd3Service = this;
    this.relationship.each( (relationship, index, g) => {
      var obj = g[index];
      var rel = d3.select(obj);
      var outline;
      try {outline = rel.select('.outline');}
      catch(err) { return; }
      
      var text = rel.select('.text');
      
      try {var bbox = text.node().getBBox();}
      catch(err) { return; }

      var padding = 3;

      outline.attr('d', function(d) {
        try {
        var options = thisObj.options;
        var center = { x: 0, y: 0 },
          angle = thisObj.rotation(d.source, d.target),
          textBoundingBox = text.node().getBBox(),
          textPadding = 5,
          u = thisObj.unitaryVector(d.source, d.target),
          textMargin = { x: (d.target.x - d.source.x - (textBoundingBox.width + textPadding) * u.x) * 0.5, y: (d.target.y - d.source.y - (textBoundingBox.width + textPadding) * u.y) * 0.5 },
          n = thisObj.unitaryNormalVector(d.source, d.target),
          rotatedPointA1 = thisObj.rotatePoint(center, { x: 0 + (thisObj.options.nodeRadius + 1) * u.x - n.x, y: 0 + (thisObj.options.nodeRadius + 1) * u.y - n.y }, angle),
          rotatedPointB1 = thisObj.rotatePoint(center, { x: textMargin.x - n.x, y: textMargin.y - n.y }, angle),
          rotatedPointC1 = thisObj.rotatePoint(center, { x: textMargin.x, y: textMargin.y }, angle),
          rotatedPointD1 = thisObj.rotatePoint(center, { x: 0 + (options.nodeRadius + 1) * u.x, y: 0 + (options.nodeRadius + 1) * u.y }, angle),
          rotatedPointA2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x - n.x, y: d.target.y - d.source.y - textMargin.y - n.y }, angle),
          rotatedPointB2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - n.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - n.y - u.y * options.arrowSize }, angle),
          rotatedPointC2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - n.x + (n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - n.y + (n.y - u.y) * options.arrowSize }, angle),
          rotatedPointD2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y }, angle),
          rotatedPointE2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x + (- n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y + (- n.y - u.y) * options.arrowSize }, angle),
          rotatedPointF2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - u.y * options.arrowSize }, angle),
          rotatedPointG2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x, y: d.target.y - d.source.y - textMargin.y }, angle);

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
        catch(err) { return; }
      });
    });
  }

  public outlineFunction(d, text) {
      
  }

  public tickRelationshipsOverlays() {
    var thisObj : NgNeo4jd3Service = this;
    this.relationshipOverlay.attr('d', function(d) {
      var center = { x: 0, y: 0 },
        angle = thisObj.rotation(d.source, d.target),
        n1 = thisObj.unitaryNormalVector(d.source, d.target),
        n = thisObj.unitaryNormalVector(d.source, d.target, 50),
        rotatedPointA = thisObj.rotatePoint(center, { x: 0 - n.x, y: 0 - n.y }, angle),
        rotatedPointB = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - n.x, y: d.target.y - d.source.y - n.y }, angle),
        rotatedPointC = thisObj.rotatePoint(center, { x: d.target.x - d.source.x + n.x - n1.x, y: d.target.y - d.source.y + n.y - n1.y }, angle),
        rotatedPointD = thisObj.rotatePoint(center, { x: 0 + n.x - n1.x, y: 0 + n.y - n1.y }, angle);

      return 'M ' + rotatedPointA.x + ' ' + rotatedPointA.y +
        ' L ' + rotatedPointB.x + ' ' + rotatedPointB.y +
        ' L ' + rotatedPointC.x + ' ' + rotatedPointC.y +
        ' L ' + rotatedPointD.x + ' ' + rotatedPointD.y +
        ' Z';
    });
  }

  public tickRelationshipsTexts() {
    var thisObj : NgNeo4jd3Service = this;
    this.relationshipText.attr('transform', function(d) {
      var angle = (thisObj.rotation(d.source, d.target) + 360) % 360,
        mirror = angle > 90 && angle < 270,
        center = { x: 0, y: 0 },
        n = thisObj.unitaryNormalVector(d.source, d.target),
        nWeight = mirror ? 2 : -3,
        point = { x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight, y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight },
        rotatedPoint = thisObj.rotatePoint(center, point, angle);

      return 'translate(' + rotatedPoint.x + ', ' + rotatedPoint.y + ') rotate(' + (mirror ? 180 : 0) + ')';
    });
  }

  public unitaryNormalVector(source, target, newLength=1) {
    var center = { x: 0, y: 0 };
    var vector = this.unitaryVector(source, target, newLength);
    return this.rotatePoint(center, vector, 90);
  }

  public unitaryVector(source, target, newLength=1) {
    var length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)) / Math.sqrt(newLength || 1);
    return {
      x: (target.x - source.x) / length,
      y: (target.y - source.y) / length,
    };
  }

  /**
   * This function is obselete and not used any where
   * @obselete
   * @param d3Data
   */
  public updateWithD3Data(d3Data) {
    this.updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
  }

  /**
   * Update data for Neo4j Visualization
   * @param neo4jData 
   */
  public updateWithNeo4jData(neo4jData) {
    var d3Data = this.neo4jDataToD3Data(neo4jData);
    this.updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
  }

  public updateInfo(d) {
    this.clearInfo();

    if (d.labels) {
      this.appendInfoElementClass('class', d.labels[0]);
    } else {
      this.appendInfoElementRelationship('class', d.type);
    }

    this.appendInfoElementProperty('property', '&lt;id&gt;', d.id);
    
    var thisObj : NgNeo4jd3Service = this;
    Object.keys(d.properties).forEach(function(property) {
      thisObj.appendInfoElementProperty('property', property, JSON.stringify(d.properties[property]));
    });
  }

  public updateNodes(n) {
    Array.prototype.push.apply(this.nodes, n);

    this.node = this.svgNodes.selectAll('.node').data(this.nodes, function(d) { return d.id; });
    var nodeEnter = this.appendNodeToGraph();
    this.node = nodeEnter.merge(this.node);
  }

  public updateNodesAndRelationships(n, r) {
    this.updateRelationships(r);
    this.updateNodes(n);

    this.simulation.nodes(this.nodes);
    this.simulation.force('link').links(this.relationships);
  }

  public updateRelationships(r) {
    Array.prototype.push.apply(this.relationships, r);

    this.relationship = this.svgRelationships.selectAll('.relationship').data(this.relationships, function(d) { return d.id; });
    var relationship = this.appendRelationship();

    var relationshipEnter : RelationshipEnter = this.appendRelationshipToGraph(relationship);
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



  public getOptionsPresentation() : NgNeo4jD3Options {
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
      iconMap: undefined,    // This value assigned in Neo4jRandom
      imageMap: undefined,
      infoPanel: true,
      minCollision: 60,
      neo4jData: Neo4jD3Records,
      nodeOutlineFillColor: undefined,
      neo4jDataUrl: undefined,
      nodeRadius: 25,
      relationshipColor: '#a5abb6',
      onRelationshipDoubleClick: function(relationship) {
        console.log('double click on relationship: ' + JSON.stringify(relationship));
      },
      zoomFit: true,
      showIcons: true,
      onNodeDoubleClick: undefined,
      onNodeClick: undefined,
      onNodeMouseEnter: undefined,
      onNodeMouseLeave: undefined,
      onNodeDragEnd: undefined,
      onNodeDragStart: undefined
    };
  }

  public rotatePoint(c, p, angle) {
    return this.rotate(c.x, c.y, p.x, p.y, angle);
  }

  public rotation(source, target) {
    return Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
  }

  public rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

    return { x: nx, y: ny };
  }

  public initIconMap(options) {
    Object.keys(options.iconMap).forEach(function(key, index) {
      var keys = key.split(',');
      var value = options.iconMap[key];

      keys.forEach(function(key) {
        options.iconMap[key] = value;
      });
    });
    return options.iconMap;
  }

  public initImageMap(options) {
    // var key, keys, selector;
    var key, keys;
    for (key in options.images) {
      if (options.images.hasOwnProperty(key)) {
        keys = key.split('|');
        if (!options.imageMap[keys[0]]) {
          options.imageMap[keys[0]] = [key];
        } else {
          options.imageMap[keys[0]].push(key);
        }
      }
    }
  }

  public appendTextToRelationship(r) {
    var rText = r.append('text');
    return rText.attr('class', 'text').attr('fill', '#000000').attr('font-size', '8px').attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .text(function(d) { return d.type; });
  }

  public appendRelationshipToGraph(relationship) : RelationshipEnter {
    var text = this.appendTextToRelationship(relationship);
    var outline = relationship.append('path').attr('class', 'outline').attr('fill', '#a5abb6').attr('stroke', 'none');
    var overlay = relationship.append('path').attr('class', 'overlay');

    // this.relationship = relationship;
    return {
      outline: outline,
      overlay: overlay,
      relationship: relationship,
      text: text
    };
  }

  public mergeProperty(target, source) {
    Object.keys(source).forEach(function(property) {
      const sourceProperty = source[property];
      if(sourceProperty != undefined) {
        if(!(sourceProperty instanceof Array))
          target[property] = source[property];
        else if(sourceProperty.length>0)
          target[property] = source[property];
      }
    });
  }

  public version() {
    return "1.0.0";
  }
}

