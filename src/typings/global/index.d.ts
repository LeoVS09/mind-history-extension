
declare module 'react-cytoscapejs' {
    import React from 'react'
    import { NodeDataDefinition, EdgeDataDefinition, ElementsDefinition, CssStyleDeclaration, LayoutOptions, Core } from 'cytoscape'


    export type CytoscapeHook = (core: Core) => void
    export interface CytoscapeComponentProps {
        elements: Array<NodeDataDefinition | EdgeDataDefinition>
        style?: React.CSSProperties
        stylesheet?: CssStyleDeclaration
        layout?: LayoutOptions
        cy?: CytoscapeHook
    }

    export default class CytoscapeComponent extends React.Component<CytoscapeComponentProps> {
        static normalizeElements(definititons: ElementsDefinition): Array<NodeDataDefinition | EdgeDataDefinition>
    }
}

declare module "graphlib" {

    export interface GraphOptions {
        compound?: boolean
        multigraph?: boolean
    }
    export class Graph {

        constructor(props?: GraphOptions)

        setNode(id: string, value?: any)
        node<T = any>(id: string): T | undefined
        setEdge(from: string, to: string, value?: any)
        setParent(child: string, parent: string)
        edges(): Array<{ v: string, w: string }> // v source, w target
        sources(): Array<string>
        children(id: string): Array<string> | undefined
        nodeEdges(id: string): Array<any> | undefined
    }
}

declare module "*.svg" {
    const content: any
    export default content
}