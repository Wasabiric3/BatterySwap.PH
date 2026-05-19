'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({
  className,
  ...props
}: DottedSurfaceProps) {
  const { resolvedTheme, theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const currentTheme = resolvedTheme ?? theme ?? 'dark';
    const isDark = currentTheme === 'dark';
    const SEPARATION = 150;
    const AMOUNT_X = isMobile ? 20 : 40;
    const AMOUNT_Y = isMobile ? 30 : 60;
    const totalPoints = AMOUNT_X * AMOUNT_Y;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(isDark ? 0x080808 : 0xffffff, 2000, 10000);

    const getSize = () => ({
      width: container.clientWidth || window.innerWidth,
      height: container.clientHeight || window.innerHeight,
    });

    const initialSize = getSize();
    const camera = new THREE.PerspectiveCamera(
      60,
      initialSize.width / initialSize.height,
      1,
      10000,
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(initialSize.width, initialSize.height);
    renderer.setClearColor(scene.fog.color, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);
    const colorValue = isDark ? 1.0 : 0.08;

    let pointIndex = 0;
    for (let ix = 0; ix < AMOUNT_X; ix++) {
      for (let iy = 0; iy < AMOUNT_Y; iy++) {
        const index = pointIndex * 3;
        positions[index] = ix * SEPARATION - (AMOUNT_X * SEPARATION) / 2;
        positions[index + 1] = 0;
        positions[index + 2] = iy * SEPARATION - (AMOUNT_Y * SEPARATION) / 2;

        colors[index] = colorValue;
        colors[index + 1] = colorValue;
        colors[index + 2] = colorValue;
        pointIndex++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isDark ? 12 : 7,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.95 : 0.58,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
      return () => {
        scene.remove(points);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    let count = 0;
    let animationId = 0;

    const animate = () => {
      animationId = window.requestAnimationFrame(animate);

      const positionAttribute = geometry.getAttribute(
        'position',
      ) as THREE.BufferAttribute;
      const pointPositions = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNT_X; ix++) {
        for (let iy = 0; iy < AMOUNT_Y; iy++) {
          const index = i * 3;
          pointPositions[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.1;
    };

    const handleResize = () => {
      const { width, height } = getSize();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationId);

      scene.remove(points);
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [resolvedTheme, theme]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)}
      {...props}
    />
  );
}
