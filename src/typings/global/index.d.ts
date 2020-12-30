
declare module 'react-cytoscapejs' {
    import React from 'react';
    import { NodeDataDefinition, EdgeDataDefinition, ElementsDefinition, CssStyleDeclaration, LayoutOptions, Core } from 'cytoscape'

    export interface CytoscapeComponentProps {
        elements: Array<NodeDataDefinition | EdgeDataDefinition>
        style?: React.CSSProperties
        stylesheet?: CssStyleDeclaration
        layout?: LayoutOptions
        cy?(handle: (core: Core) => void): void
    }

    export default class CytoscapeComponent extends React.Component<CytoscapeComponentProps> {
        static normalizeElements(definititons: ElementsDefinition): Array<NodeDataDefinition | EdgeDataDefinition>
    }
}