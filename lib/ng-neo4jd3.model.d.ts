export declare class RelationshipEnter {
    outline: any;
    overlay: any;
    relationship: any;
    text: any;
}
export declare class NgNeo4jD3Data {
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
export declare class NgNeo4jD3Options {
    arrowSize: number;
    colors: Array<any>;
    highlight: Array<any>;
    iconMap: Object;
    icons: Object;
    imageMap: Object;
    images: Object;
    infoPanel: boolean;
    minCollision: number;
    nodeOutlineFillColor: number;
    nodeRadius: number;
    relationshipColor: string;
    zoomFit: boolean;
    showIcons: boolean;
    onNodeClick: Function;
    onNodeDoubleClick: Function;
    onNodeMouseEnter: Function;
    onNodeMouseLeave: Function;
    onRelationshipDoubleClick: Function;
    onNodeDragEnd: Function;
    onNodeDragStart: Function;
    neo4jData: NgNeo4jD3Data;
    neo4jDataUrl: string;
    graphContainerHeight: string;
}
