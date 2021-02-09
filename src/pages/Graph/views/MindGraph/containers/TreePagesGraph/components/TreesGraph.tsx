import React from 'react'
import { CytoscapeWrapper, CytoscapeWrapperProps } from './CytoscapeWrapper'

export interface TreesGraphProps extends CytoscapeWrapperProps {

}

export const TreesGraph: React.FC<TreesGraphProps> = (props) =>
    <CytoscapeWrapper
        layout={{
            name: 'cose',
            randomize: true,
        }}
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
            "width": "mapData(score, 1, 5, 30, 60)",
            "height": "mapData(score, 1, 5, 30, 60)",
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