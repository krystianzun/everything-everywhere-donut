// -----JS CODE-----
// PlaceObjectsOnPath.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that allows you to place any content on the camera path.
// Just place any content as a child of the PlaceObjectsOnPath [OBJECTS_HERE] and it will appear on the camera path.

var pathData;
var childObject = [];
var thisSceneObject;
var childCount;

function onLensTurnOn() {
    getChildObjects();
    if (childObject.length == 0) {
        return;
    }
    getPathData();
    placeObjectsOnPath();
    configureTransform();
}

function getPathData() {
    if (script.customPath) {
        pathData = global.pathDataManager.createPathData({
            startOffset: script.startOffset,
            endOffset: script.endOffset,
            frameResolution: script.removeFrameAmount,
            smoothingAmount: script.smoothingAmount,
            randomizeValue: script.randPosValue
        });
    } else {
        pathData = global.pathDataManager.createPathData();
    }
}

function getChildObjects() {
    thisSceneObject = script.getSceneObject();
    childCount = thisSceneObject.getChildrenCount();

    if (childCount == 0) {
        print("PlaceObjectsOnPath: ERROR: No Children found in " + script.getSceneObject().name);
    } else {
        for (var i = 0; i < childCount; i++) {
            childObject[i] = thisSceneObject.getChild(i);
        }
    }
}

function placeObjectsOnPath() {
    if (script.objectDistribution === "count") {
        countPopulate();
    } else {
        distancePopulate();
    }
}

function countPopulate() {
    var length = pathData.length - 1;
    var pathIndex = 0;
    var ratio = Math.floor(length / script.objectCount);

    for (var i = 0; i < script.objectCount; i++) {
        if (pathIndex >= length) {
            pathIndex -= length;
        }

        var index = getIndex(i, childCount);

        if (i >= childCount) {
            childObject.push(thisSceneObject.copyWholeHierarchy(childObject[index]));
            index = childObject.length - 1;
        }

        childObject[index].getTransform().setWorldPosition(pathData[pathIndex].position);

        if (script.applyRotation) {
            childObject[index].getTransform().setWorldRotation(pathData[pathIndex].rotation);
        }

        pathIndex += ratio;
    }

    if (childCount > script.objectCount) {
        for (var j = script.objectCount; j < childCount; j++) {
            childObject[j].enabled = false;
        }
    }
}

function distancePopulate() {
    var previousPos = null;
    var objectIndex = 0;
    var rawPath = global.pathDataManager.getRawPathData();

    if (rawPath == null) {
        return;
    }

    var ratio = pathData.length / rawPath.length;

    for (var i = 0; i < rawPath.length; i++) {
        var rawData = rawPath[i];
        if (!previousPos || previousPos.distance(rawData.position) >= script.objectDistance) {
            var smoothedIndex = i * ratio;

            var index = getIndex(objectIndex, childCount);
            if (objectIndex > childCount) {
                childObject.push(thisSceneObject.copyWholeHierarchy(childObject[index]));
                index = childObject.length - 1;
            }

            var smoothedPosition = global.pathDataManager.getEasedPosition(pathData, smoothedIndex);
            childObject[index].getTransform().setWorldPosition