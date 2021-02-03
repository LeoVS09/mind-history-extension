import React from 'react'
import { TreesGraph, TreesGraphProps } from './TreesGraph'

export interface FullScreenTreesGraphProps extends TreesGraphProps {

}

export const FullScreenTreesGraph: React.FC<FullScreenTreesGraphProps> = (props) => {
    const width = getWindowWidth()
    const height = getWindowHeight()

    return <TreesGraph
        style={{ width: `${width}px`, height: `${height}px` }}
        {...props}
    />
}

const MAX_WIDTH = 1440
const MAX_HEIGHT = 720

function getWindowWidth() {
    return MAX_WIDTH
}

function getWindowHeight() {
    return MAX_HEIGHT
}