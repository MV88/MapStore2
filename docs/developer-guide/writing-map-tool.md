# How to write a map tool

> ┻┳|  
> ┳┻| _  
> ┻┳| •.•) 💬 *"Hey, Checkout this awesome documentation on how to write a map tool!"*  
> ┳┻|⊂ﾉ     
> ┻┳|  

## Premises
We wish to:
- being able to define map tools/support as plugins, with a Map container
- allow a single ReactJS component and different (dynamically loaded) implementations for the different mapping libraries

In [this](https://github.com/geosolutions-it/MapStore2/pull/6006) pr we made a refactor on the locate plugin that can be used to create your own map tool or map support or migrate an existing one

## Steps
- You can start by adding a new map container inside the map tool you are [refactoring](https://github.com/geosolutions-it/MapStore2/pull/6006/files#diff-ad8a2ac6a2d1aadb86756a00b02afc44d23d26d813dea4a43489d3bdf8766fb8R56-R66)

`
 Map: {
    name: "Locate",
    Tool: connect((state) => ({
        status: state.locate && state.locate.state,
        messages: state.locale && state.locale.messages ? state.locale.messages.locate : undefined
    }), {
        changeLocateState,
        onLocateError
    })(LocateTool),
    priority: 1
}
`

- [remove](https://github.com/geosolutions-it/MapStore2/pull/6006/files#diff-7fe64fb8a440f8d88eea28d07442b02d81011cef71ea8a2c5b2d6a69a69245d8L216-R216) that tool if present, from the default map tool, it will be included as plugin directly as a child of the map
- [clean](https://github.com/geosolutions-it/MapStore2/pull/6006/files#diff-064ff22000f3ba1d62c147f1cb4a30fbdf22409ced300195f0c47eac7c5481a7L15-R110) up also the index that gathers supports or tools
- continue the clean up [here](https://github.com/geosolutions-it/MapStore2/pull/6006/files#diff-cdbb5c16fa137021718a4d8d9242f0f1605f3ad4d805467c4f14823b02bde844L13) and [here](https://github.com/geosolutions-it/MapStore2/pull/6006/files#diff-90e9c33847a4f39451c18e28b60cea034a456a7e1c668f34613621d7423b22daL17)
- adjust plugins [import](https://github.com/geosolutions-it/MapStore2/pull/6006/files#diff-12914c878def7e2331e05bdcdc559471b70f8ca6dee5ca776efcb0558bc9035cL70-R70) if needed

Now you are ready to create map tools or supports for the mapTypes you need.

Create a new component that will act as interface that will use the various implementations and place it in `web/client/components/mapcontrols/<toolName>/<ToolName>Tool.jsx`

place a new <toolName>.js in web/client/map/<mayType> if you are working on the product, or simply your js/map folder if it is a project

This file will contain the implementation of that library.

Now you are good to go!

