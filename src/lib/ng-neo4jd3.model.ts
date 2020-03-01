
export class RelationshipEnter {
    outline: any;
    overlay: any;
    relationship: any;
    text: any;
}


export class NgNeo4jD3Data {
    results: Array<{
        columns: Array<string>;
        data: Array<{
            graph: {
                nodes: Array<Object>;
                relationships: Array<Object>;
            };
        }>;
    }>;
    errors: Array<any>;
  }
  
  export class NgNeo4jD3Options {
    arrowSize: number ;
    colors: Array<any> = [];
    highlight: Array<any> = [];
    iconMap: Object = {};
    icons: Object = {};
    imageMap: Object = {};
    images: Object = {};
    infoPanel: boolean = true;
    minCollision: number;
    nodeOutlineFillColor: number;
    nodeRadius: number = 25;
    relationshipColor: string = '#a5abb6';
    zoomFit: boolean = false;
    showIcons: boolean = true;
    onNodeClick: Function = () => { console.log("onNodeClick >> Default Method!") };
    onNodeDoubleClick: Function = () => { console.log("onNodeDoubleClick >> Default Method!") };
    onNodeMouseEnter: Function =  () => { console.log("onNodeMouseEnter >> Default Method!") };
    onNodeMouseLeave: Function = () => { console.log("onNodeMouseLeave >> Default Method!") };
    onRelationshipDoubleClick: Function = () => { console.log("onRelationshipDoubleClick >> Default Method!") };
    onNodeDragEnd: Function = () => { console.log("onNodeDragEnd >> Default Method!") };
    onNodeDragStart: Function = () => { console.log("onNodeDragStart >> Default Method!") };
    // Neo4j Data
    neo4jData: NgNeo4jD3Data;
    neo4jDataUrl: string = undefined;
  }
