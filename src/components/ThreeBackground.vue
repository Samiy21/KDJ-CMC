<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, onBeforeUnmount, ref } from 'vue'

const container = ref(null)
let scene, camera, renderer, particles, lines
let mouseX = 0, mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

// Configuration
const particleCount = 100
const r = 800 // Radius of distribution
const rHalf = r / 2

const init = () => {
    // Scene
    scene = new THREE.Scene()
    // Transparent background to blend with site
    scene.background = null 

    // Camera
    camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 1, 10000)
    camera.position.z = 450

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    container.value.appendChild(renderer.domElement)

    // Particles Geometry
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesPositions = []
    
    // Add particles
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * r - rHalf
        const y = Math.random() * r - rHalf
        const z = Math.random() * r - rHalf

        particlesPositions.push(x, y, z)
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesPositions, 3))

    // Particles Material
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x4fc3f7, // Light Blue
        size: 6,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    })

    particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Lines Geometry
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15
    })
    
    // We will update line positions in animate loop based on proximity
    // For performance, let's just make a static web or a simpler dynamic one. 
    // Actually, calculating N^2 distances in JS loop might be heavy for 1000 particles, but for 100 it's fine.
    // Let's stick to 100 particles for a "Premium" sparse look.
    
    // Create a geometry for lines that can hold max segments
    const linesGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(particleCount * particleCount * 3) // Max possible connections
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    
    lines = new THREE.LineSegments(linesGeometry, linesMaterial)
    scene.add(lines)

    // Events
    window.addEventListener('resize', onWindowResize)
    document.addEventListener('mousemove', onDocumentMouseMove)
}

const onWindowResize = () => {
    if (!container.value) return
    windowHalfX = container.value.clientWidth / 2
    windowHalfY = container.value.clientHeight / 2
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

const onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.1
    mouseY = (event.clientY - windowHalfY) * 0.1
}

const animate = () => {
    requestAnimationFrame(animate)
    render()
}

const render = () => {
    camera.position.x += (mouseX - camera.position.x) * 0.05
    camera.position.y += (-mouseY - camera.position.y) * 0.05
    camera.lookAt(scene.position)

    const particlePositions = particles.geometry.attributes.position.array
    const linePositions = lines.geometry.attributes.position.array
    
    let vertexpos = 0
    let numConnected = 0

    // Connect particles nearby
    for (let i = 0; i < particleCount; i++) {
        // Slight movement
        // particlePositions[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.1

        for (let j = i + 1; j < particleCount; j++) {
            const dx = particlePositions[i * 3] - particlePositions[j * 3]
            const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1]
            const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2]
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

            if (dist < 150) { // Connection threshold
                linePositions[vertexpos++] = particlePositions[i * 3]
                linePositions[vertexpos++] = particlePositions[i * 3 + 1]
                linePositions[vertexpos++] = particlePositions[i * 3 + 2]

                linePositions[vertexpos++] = particlePositions[j * 3]
                linePositions[vertexpos++] = particlePositions[j * 3 + 1]
                linePositions[vertexpos++] = particlePositions[j * 3 + 2]
                
                numConnected++
            }
        }
    }

    lines.geometry.setDrawRange(0, numConnected * 2)
    lines.geometry.attributes.position.needsUpdate = true
    
    // Slow rotation
    scene.rotation.y += 0.002
    scene.rotation.x += 0.001

    renderer.render(scene, camera)
}

onMounted(() => {
    init()
    animate()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', onWindowResize)
    document.removeEventListener('mousemove', onDocumentMouseMove)
    if (renderer) {
        renderer.dispose()
    }
})
</script>

<style scoped>
.three-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
</style>
