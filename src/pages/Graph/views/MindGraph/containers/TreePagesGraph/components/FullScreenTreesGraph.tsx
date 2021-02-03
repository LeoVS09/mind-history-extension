import React from 'react'
import { TreesGraph, TreesGraphProps } from './TreesGraph'

export interface FullScreenTreesGraphProps extends TreesGraphProps {

}

export const FullScreenTreesGraph: React.FC<FullScreenTreesGraphProps> = (props) => {
    const width = getWidth()
    const height = getHeight()

    return <TreesGraph
        style={{ width: `${width}px`, height: `${height}px` }}
        {...props}
    />
}

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    )
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    )
}