import * as THREE from "three";
import { Hideable, Event, World } from "../../Types";
import { Components } from "../../Components";
import { Disposer } from "../../Disposer";
import { SimpleCamera } from "../../Worlds";

export interface GridConfig {
  color: THREE.Color;
  size1: number;
  size2: number;
  distance: number;
}

/**
 * An infinite grid. Created by
 * [fyrestar](https://github.com/Fyrestar/THREE.InfiniteGridHelper)
 * and translated to typescript by
 * [dkaraush](https://github.com/dkaraush/THREE.InfiniteGridHelper/blob/master/InfiniteGridHelper.ts).
 */
export class SimpleGrid implements Hideable, Disposable {
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  world: World;

  components: Components;

  /** {@link Hideable.visible} */
  get visible() {
    return this.three.visible;
  }

  /** {@link Hideable.visible} */
  set visible(visible: boolean) {
    if (visible) {
      const scene = this.world.scene.three;
      scene.add(this.three);
    } else {
      this.three.removeFromParent();
    }
  }

  /** The material of the grid. */
  get material() {
    return this.three.material as THREE.ShaderMaterial;
  }

  /**
   * Whether the grid should fade away with distance. Recommended to be true for
   * perspective cameras and false for orthographic cameras.
   */
  get fade() {
    return this._fade === 3;
  }

  /**
   * Whether the grid should fade away with distance. Recommended to be true for
   * perspective cameras and false for orthographic cameras.
   */
  set fade(active: boolean) {
    this._fade = active ? 3 : 0;
    this.material.uniforms.uFade.value = this._fade;
  }

  readonly three: THREE.Mesh;

  private _fade = 3;

  constructor(components: Components, world: World, config: GridConfig) {
    // Source: https://github.com/dkaraush/THREE.InfiniteGridHelper/blob/master/InfiniteGridHelper.ts
    // Author: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.InfiniteGridHelper)

    this.world = world;

    const { color, size1, size2, distance } = config;

    this.components = components;

    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,

      uniforms: {
        uSize1: {
          value: size1,
        },
        uSize2: {
          value: size2,
        },
        uColor: {
          value: color,
        },
        uDistance: {
          value: distance,
        },
        uFade: {
          value: this._fade,
        },
        uZoom: {
          value: 1,
        },
      },
      transparent: true,
      vertexShader: `
            
            varying vec3 worldPosition;
            
            uniform float uDistance;
            
            void main() {
            
                    vec3 pos = position.xzy * uDistance;
                    pos.xz += cameraPosition.xz;
                    
                    worldPosition = pos;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            
            }
            `,

      fragmentShader: `
            
            varying vec3 worldPosition;
            
            uniform float uZoom;
            uniform float uFade;
            uniform float uSize1;
            uniform float uSize2;
            uniform vec3 uColor;
            uniform float uDistance;
                
                
                
                float getGrid(float size) {
                
                    vec2 r = worldPosition.xz / size;
                    
                    
                    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
                    float line = min(grid.x, grid.y);
                    
                
                    return 1.0 - min(line, 1.0);
                }
                
            void main() {
            
                    
                    float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / uDistance, 1.0);
                    
                    float g1 = getGrid(uSize1);
                    float g2 = getGrid(uSize2);
                    
                    // Ortho camera fades the grid away when zooming out
                    float minZoom = step(0.2, uZoom);
                    float zoomFactor = pow(min(uZoom, 1.), 2.) * minZoom;
                    
                    gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, uFade));
                    gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2) * zoomFactor;
                    
                    if ( gl_FragColor.a <= 0.0 ) discard;
                    
            
            }
            
            `,

      extensions: {
        derivatives: true,
      },
    });

    this.three = new THREE.Mesh(geometry, material);
    this.three.frustumCulled = false;
    world.scene.three.add(this.three);

    this.setupEvents(true);
  }

  [Symbol.dispose](): void {
    throw new Error("Method not implemented.");
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.setupEvents(false);
    const disposer = this.components.get(Disposer);
    disposer.destroy(this.three);
    this.onDisposed.trigger();
    this.onDisposed.reset();
    this.world = null as any;
    this.components = null as any;
  }

  private setupEvents(active: boolean) {
    if (this.world.isDisposing) {
      return;
    }

    if (!(this.world.camera instanceof SimpleCamera)) {
      return;
    }
    const controls = this.world.camera.controls;
    if (active) {
      controls.addEventListener("update", this.updateZoom);
    } else {
      controls.removeEventListener("update", this.updateZoom);
    }
  }

  private updateZoom = () => {
    if (!(this.world.camera instanceof SimpleCamera)) {
      return;
    }
    this.material.uniforms.uZoom.value = this.world.camera.three.zoom;
  };
}
