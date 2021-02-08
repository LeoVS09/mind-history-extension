import React from 'react'
import { CytoscapeWrapper, CytoscapeWrapperProps } from './CytoscapeWrapper'

export const MAX_NODE_SIZE = 60

export interface TreesGraphProps extends CytoscapeWrapperProps {

}

export const TreesGraph: React.FC<TreesGraphProps> = (props) =>
    <CytoscapeWrapper
        stylesheet={graphStyles}
        {...props}
    />

const graphStyles = [
    {
        "selector": "core",
        "style": {
            "selection-box-color": "#AAD8FF",
            "selection-box-border-color": "#8BB0D0",
            "selection-box-opacity": "0.5"
        }
    },
    {
        "selector": "node",
        "style": {
            "width": `mapData(score, 1, 5, 30, ${MAX_NODE_SIZE})`,
            "height": `mapData(score, 1, 5, 30, ${MAX_NODE_SIZE})`,
            "label": "data(label)",
            "font-size": "14px",
            "text-valign": "bottom",
            "text-halign": "center",
            "background-color": "#777",
            "color": "#fff",
            "overlay-padding": "6px",
            "z-index": "10"
        }
    },
    {
        "selector": "node[favIconUrl]",
        "style": {
            "background-image": 'data(favIconUrl)'
        }
    },
    {
        "selector": "edge",
        "style": {
            'width': 1,
            "curve-style": "haystack",
            "haystack-radius": "0.1",
            "opacity": "0.4",
            "line-color": "red",
            "overlay-padding": "5px"
        }
    },
]