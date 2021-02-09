import React from 'react'
import { Helmet } from 'react-helmet'
import { NavBar } from './containers/NavBar'
import { TreePagesGraph, TreePagesGraphProps } from './containers/TreePagesGraph'

export interface MindGraphProps extends TreePagesGraphProps {
}


export const MindGraph: React.FC<MindGraphProps> = ({ pages, history, nodeUrl }) => {
    const current = nodeUrl && pages[nodeUrl]
    const { title } = current || {}

    return (
        <div>
            <Helmet>
                <title>{title ? `${title} | Mind History Graph` : 'Mind History Graph'}</title>
            </Helmet>

            <NavBar />

            <TreePagesGraph
                {...{ pages, history, nodeUrl }}
            />
        </div>
    )

}


