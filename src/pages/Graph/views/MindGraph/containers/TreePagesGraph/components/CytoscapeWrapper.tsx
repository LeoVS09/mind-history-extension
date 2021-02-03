import React, { useState } from "react"
import CytoscapeComponent, { CytoscapeComponentProps, CytoscapeHook } from "react-cytoscapejs"

export interface CytoscapeWrapperProps extends CytoscapeComponentProps {
    onRerenderChange: CytoscapeHook
    onSetup: CytoscapeHook
}

export const CytoscapeWrapper: React.FC<CytoscapeWrapperProps> = ({ onRerenderChange, onSetup, ...props }) => {
    const [isCoreSetupComplete, setCoreSetupStatus] = useState(false)
    const coreSetupComplete = () => setCoreSetupStatus(true)

    // prevent multiple setups on updates
    const coreHookCallback: CytoscapeHook = core => {
        onRerenderChange(core)
        if (isCoreSetupComplete)
            return


        onSetup(core)
        coreSetupComplete()
    }

    return <CytoscapeComponent
        cy={coreHookCallback}
        {...props}
    />
}