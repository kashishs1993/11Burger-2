import {loadGLTF} from "./libs/loader.js"
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
    const start = async() => {
      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.body,
        imageTargetSrc: './targets.mind',
        uiScanning: "no",
        uiLoading: "no",
      });
      const {renderer, scene, camera} = mindarThree;
  
      const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
      scene.add(light);
  
      const burger1 = await loadGLTF('./model/französischer_truffle_smash.glb');
      burger1.scene.scale.set(0.5, 0.5, 0.5);
      burger1.scene.rotation.set(90,0,0);
      burger1.scene.position.set(0, -0.4, 0);
  
      const burger2 = await loadGLTF('./model/italien_grando.glb');
      burger2.scene.scale.set(0.5, 0.5, 0.5);
      burger2.scene.rotation.set(90,0,0);
      burger2.scene.position.set(0, -0.4, 0);

      const burger3 = await loadGLTF('./model/j11.glb');
      burger3.scene.scale.set(0.5, 0.5, 0.5);
      burger3.scene.rotation.set(90,0,0);
      burger3.scene.position.set(0, -0.4, 0);
      
      const burger4 = await loadGLTF('./model/new_york_style.glb');
      burger4.scene.scale.set(0.1, 0.1, 0.1);
      burger4.scene.rotation.set(90,0,0);
      burger4.scene.position.set(0, -0.4, 0);
      
      const burger5 = await loadGLTF('./model/tikka_burger.glb');
      burger5.scene.scale.set(0.5, 0.5, 0.5);
      burger5.scene.rotation.set(90,0,0);
      burger5.scene.position.set(0, -0.4, 0);

    


// Anchors
  
      const burger1Anchor = mindarThree.addAnchor(0);
      burger1Anchor.group.add(burger1.scene);
  
      const burger2Anchor = mindarThree.addAnchor(1);
      burger2Anchor.group.add(burger2.scene);
      
      const burger3Anchor = mindarThree.addAnchor(2);
      burger3Anchor.group.add(burger3.scene);
  
      const burger4Anchor = mindarThree.addAnchor(3);
      burger4Anchor.group.add(burger4.scene);

      const burger5Anchor = mindarThree.addAnchor(4);
      burger5Anchor.group.add(burger5.scene);

  
      await mindarThree.start();
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    }
    start();
  });
  