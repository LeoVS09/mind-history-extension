
declare module 'react-cytoscapejs' {
    import React from 'react'
    import { NodeDataDefinition, EdgeDataDefinition, ElementsDefinition, CssStyleDeclaration, LayoutOptions, Core } from 'cytoscape'


    type cyHook = (core: Core) => void
    export interface CytoscapeComponentProps {
        elements: Array<NodeDataDefinition | EdgeDataDefinition>
        style?: React.CSSProperties
        stylesheet?: CssStyleDeclaration
        layout?: LayoutOptions
        cy?: cyHook
    }

    export default class CytoscapeComponent extends React.Component<CytoscapeComponentProps> {
        static normalizeElements(definititons: ElementsDefinition): Array<NodeDataDefinition | EdgeDataDefinition>
    }
}

declare module "graphlib" {
    export class Graph {
        setNode(id: string, value?: any)
        node(id: string): any
        setEdge(from: string, to: string, value?: any)
        edges(): Array<{ v: string, w: string }> // v source, w target
        sources(): Array<string>
    }
}