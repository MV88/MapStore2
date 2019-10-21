const { compose, withHandlers } = require('recompose');

export default compose(
    withHandlers({
        onMapViewChanges: ({ onChange = () => { } }) => map => {
            onChange('map', map);
            onChange('mapStateSource', map.mapStateSource);
        }
    })
);
