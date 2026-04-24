// import {loadGLTF} from "./libs/loader.js"
// const THREE = window.MINDAR.IMAGE.THREE;

// document.addEventListener('DOMContentLoaded', () => {
//     const start = async() => {
//       const mindarThree = new window.MINDAR.IMAGE.MindARThree({
//         container: document.body,
//         imageTargetSrc: './targets.mind',
//         uiScanning: "no",
//         uiLoading: "no",
//       });
//       const {renderer, scene, camera} = mindarThree;
  
//       // const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
//       // scene.add(light);

//       // Light
//     const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
//     scene.add(light);
//     const dirLight = new THREE.DirectionalLight(0xffffff, 2);
//     dirLight.position.set(1, 2, 3);
//     scene.add(dirLight);
  
//       const burger1 = await loadGLTF('./model/französischer_truffle_smash.glb');
//       burger1.scene.scale.set(1,1,1);
//       burger1.scene.rotation.set(90,0,0);
//       burger1.scene.position.set(0, -0.4, 0);
  
//       const burger2 = await loadGLTF('./model/italien_grando.glb');
//       burger2.scene.scale.set(1,1,1);
//       burger2.scene.rotation.set(90,0,0);
//       burger2.scene.position.set(0, -0.4, 0);

//       const burger3 = await loadGLTF('./model/j11.glb');
//       burger3.scene.scale.set(1,1,1);
//       burger3.scene.rotation.set(90,0,0);
//       burger3.scene.position.set(0, -0.4, 0);
      
//       const burger4 = await loadGLTF('./model/new_york_style.glb');
//       burger4.scene.scale.set(1,1,1);
//       burger4.scene.rotation.set(90,0,0);
//       burger4.scene.position.set(0, -0.4, 0);
      
//       const burger5 = await loadGLTF('./model/tikka_burger.glb');
//       burger5.scene.scale.set(1,1,1);
//       burger5.scene.rotation.set(90,0,0);
//       burger5.scene.position.set(0, -0.4, 0);

    


// // Anchors
  
//       const burger1Anchor = mindarThree.addAnchor(0);
//       burger1Anchor.group.add(burger1.scene);
  
//       const burger2Anchor = mindarThree.addAnchor(1);
//       burger2Anchor.group.add(burger2.scene);
      
//       const burger3Anchor = mindarThree.addAnchor(2);
//       burger3Anchor.group.add(burger3.scene);
  
//       const burger4Anchor = mindarThree.addAnchor(3);
//       burger4Anchor.group.add(burger4.scene);

//       const burger5Anchor = mindarThree.addAnchor(4);
//       burger5Anchor.group.add(burger5.scene);

  
//       await mindarThree.start();
//       renderer.setAnimationLoop(() => {
//         renderer.render(scene, camera);
//       });
//     }
//     start();
//   });
  

import { loadGLTF } from "./libs/loader.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "./targets.mind",
      uiScanning: "no",
      uiLoading: "no",
    });

    const { renderer, scene, camera } = mindarThree;

    // ---------------- LIGHT ----------------
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);

    // ---------------- BACKGROUND IMAGE FOR EACH TARGET ----------------
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load("./elevenburgers-background.png"); // your background image

    const bgGeometry = new THREE.PlaneGeometry(1.8, 1);

    function createBackground() {
      const bgMaterial = new THREE.MeshBasicMaterial({
        map: bgTexture,
        transparent: true,
      });

      const plane = new THREE.Mesh(bgGeometry, bgMaterial);
      plane.position.set(0, 0, -0.1); // behind burger
      return plane;
    }

    // ---------------- LOAD MODELS ----------------
    const burger1 = await loadGLTF("./model/französischer_truffle_smash.glb");
    const burger2 = await loadGLTF("./model/italien_grando.glb");
    const burger3 = await loadGLTF("./model/j11.glb");
    const burger4 = await loadGLTF("./model/new_york_style.glb");
    const burger5 = await loadGLTF("./model/tikka_burger.glb");

    const burgers = [burger1, burger2, burger3, burger4, burger5];

    burgers.forEach((burger) => {
      burger.scene.scale.set(0.2, 0.2, 0.2); // start small
      burger.scene.position.set(0, -1, 0);   // start below
      burger.scene.rotation.set(Math.PI / 2, 0, 0);
    });

    // ---------------- ANCHORS ----------------
    const anchors = [];

    for (let i = 0; i < 5; i++) {
      const anchor = mindarThree.addAnchor(i);

      // add background
      anchor.group.add(createBackground());

      // add model
      anchor.group.add(burgers[i].scene);

      anchor.isAnimating = false;

      anchor.onTargetFound = () => {
        anchor.isAnimating = true;

        // reset animation start
        burgers[i].scene.position.y = -1;
        burgers[i].scene.scale.set(0.2, 0.2, 0.2);
      };

      anchor.onTargetLost = () => {
        anchor.isAnimating = false;
      };

      anchors.push(anchor);
    }

    // ---------------- START ----------------
    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      for (let i = 0; i < anchors.length; i++) {
        const burger = burgers[i].scene;

        // always slow rotate
        burger.rotation.y += 0.01;

        if (anchors[i].isAnimating) {
          // rise animation
          burger.position.y += (0.0 - burger.position.y) * 0.08;

          // scale animation
          burger.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);

          // faster rotate while appearing
          burger.rotation.y += 0.03;
        }
      }

      renderer.render(scene, camera);
    });
  };

  start();
});