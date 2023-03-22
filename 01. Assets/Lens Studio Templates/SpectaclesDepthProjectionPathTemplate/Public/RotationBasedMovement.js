// -----JS CODE-----

// @input SceneObject camera
var camera = script.camera;
var cameraTransform = camera.getTransform()

var worldSphere = script.getSceneObject();
var worldSphereTransform = worldSphere.getTransform();

// @input bool EnableRotation = true

// @input float rotationMultiplier = 0.01
var rotationMultiplier = script.rotationMultiplier;

var prevCamPos = cameraTransform.getWorldPosition();
var frameCounter = 0;
var isFirstFrameProcessed = false;

var currentSphereRotation = cameraTransform.getWorldRotation().invert()

script.createEvent("UpdateEvent").bind(function () {
    if(!script.EnableRotation)
    {
        return;
    }
    frameCounter++;
    
    var camPos = cameraTransform.getWorldPosition();
    worldSphereTransform.setWorldPosition(camPos);

    var moveVec = camPos.sub(prevCamPos);
    moveVec.y = 0;
    var rotAxis = vecMult(new vec3(0, 1, 0), moveVec).normalize();

    var moveDistance = camPos.distance(prevCamPos);

    var addAngle = moveDistance * rotationMultiplier;
    var addRot = quat.angleAxis(addAngle, rotAxis);
    if (isNaN(addRot.x)) {
        return;
    }

    if (!isFirstFrameProcessed) {
        isFirstFrameProcessed = true
    }
    currentSphereRotation = addRot.multiply(currentSphereRotation);

    worldSphereTransform.setWorldRotation(currentSphereRotation);

    prevCamPos = camPos;
});

function vecMult(a, b) {
    return new vec3(a.y * b.z - a.z * b.y, (a.z * b.x - a.x * b.z), a.x * b.y - a.y * b.x);
}

function quatMult(a, b) {
    var angle = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
    var axis = new vec3(
        a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y,
        a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
        a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
    );

    return quat.angleAxis(angle, axis);
}