/**
* Additional Information:
*
* This template populates the world with objects on devices that supports it.
* It also comes with an object spawner which uses a special instance spawning material 
* to optimize large number of object instantiation
* 
* To create your own objects:
* 1. Add your objects under the Objects Presets object
* 2. Duplicate the `Instanced Object Material Example [DUPLICATE_ME]` material, 
*    configure it, and apply it to your object
* 3. Create a Spawner Setup which allows you to define where you want that object to be spawned. 
*    The fastest way to do this is to duplicate one of the example objects under `Objects Controller`. 
*    Then reference your object and choose your spawning configuration. 
* 4. (optional) If multiple objects can use the same materials, you can use the `CloneMaterialToObjects` 
*    script to duplicate the material in runtime to further optimize your Lens. Check out the 
*    CloneMaterialToObjects' children for examples.
* 
* to learn more about this template, check out:
* https://lensstudio.snapchat.com/templates/world/world-mesh
*
**/