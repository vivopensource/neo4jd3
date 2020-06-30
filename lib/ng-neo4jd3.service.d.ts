import { NgNeo4jD3Options, RelationshipEnter } from './ng-neo4jd3.model';
export declare class NgNeo4jd3Service {
    outOfContext: boolean;
    private valueSet;
    private container;
    private containerIdentity;
    private info;
    private node;
    private nodes;
    private relationship;
    private relationships;
    private relationshipOutline;
    private relationshipOverlay;
    private relationshipText;
    private simulation;
    svg: any;
    private svgNodes;
    private svgRelationships;
    private svgTranslate;
    private classes2colors;
    private justLoaded;
    private numClasses;
    private svgScale;
    private optionsInput;
    private options;
    constructor();
    setValues(_selector: any, _options: any): void;
    isValueSet(): boolean;
    getOptionsInput(): Object;
    getContainer(): Object;
    init(): NgNeo4jD3Options;
    initSimulation(): any;
    appendGraph(container: any): any;
    appendInfoPanel(container: any): any;
    appendInfoElement(cls: any, isNode: any, property: any, value?: any): void;
    appendInfoElementClass(cls: any, node: any): void;
    appendInfoElementProperty(cls: any, property: any, value: any): void;
    appendInfoElementRelationship(cls: any, relationship: any): void;
    appendNode(): any;
    appendNodeToGraph(): any;
    appendOutlineToNode(node: any): any;
    class2color(cls: any): any;
    class2darkenColor(cls: any): any;
    appendRingToNode(node: any): any;
    appendImageToNode(node: any): any;
    appendTextToNode(node: any): any;
    appendRandomDataToNode(d: any, maxNodesToGenerate: any): void;
    appendRelationship(): any;
    clearInfo(): void;
    color(): any;
    colors(): Array<String>;
    containsResult(array: any, id: any): boolean;
    defaultColor(): string;
    defaultDarkenColor(): any;
    dragEnded(d: any): void;
    dragged(d: any): void;
    dragStarted(d: any): void;
    extend(obj1: any, obj2: any): {};
    icon(d: any): any;
    image(d: any): any;
    loadNeo4jData(): void;
    loadNeo4jDataFromUrl(neo4jDataUrl: any): void;
    neo4jDataToD3Data(data: any): {
        nodes: any[];
        relationships: any[];
    };
    toString(d: any): any;
    randomD3Data(d: any, maxNodesToGenerate: any): {
        nodes: any[];
        relationships: any[];
    };
    size(): {
        nodes: any;
        relationships: number;
    };
    stickNode(d: any): void;
    tick(): void;
    tickNodes(): void;
    tickRelationships(): void;
    tickRelationshipsOutlines(): void;
    outlineFunction(d: any, text: any): void;
    tickRelationshipsOverlays(): void;
    tickRelationshipsTexts(): void;
    unitaryNormalVector(source: any, target: any, newLength?: number): {
        x: any;
        y: any;
    };
    unitaryVector(source: any, target: any, newLength?: number): {
        x: number;
        y: number;
    };
    /**
     * This function is obselete and not used any where
     * @obselete
     * @param d3Data
     */
    updateWithD3Data(d3Data: any): void;
    /**
     * Update data for Neo4j Visualization
     * @param neo4jData
     */
    updateWithNeo4jData(neo4jData: any): void;
    updateInfo(d: any): void;
    updateNodes(n: any): void;
    updateNodesAndRelationships(n: any, r: any): void;
    updateRelationships(r: any): void;
    getOptionsPresentation(): NgNeo4jD3Options;
    rotatePoint(c: any, p: any, angle: any): {
        x: any;
        y: any;
    };
    rotation(source: any, target: any): number;
    rotate(cx: any, cy: any, x: any, y: any, angle: any): {
        x: any;
        y: any;
    };
    initIconMap(options: any): any;
    initImageMap(options: any): void;
    appendTextToRelationship(r: any): any;
    appendRelationshipToGraph(relationship: any): RelationshipEnter;
    mergeProperty(target: any, source: any): void;
    version(): string;
    private mergeRelationshipWithSameNodes;
    private mergeKeys;
    private assignAttributes;
    private assignAttributesValue;
}
