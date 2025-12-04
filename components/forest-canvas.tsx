"use client"

import { useEffect, useRef } from "react"

interface Tree {
  x: number
  y: number
  size: number
  sway: number
}

export function ForestCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const treesRef = useRef<Tree[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Generate trees
    if (treesRef.current.length === 0) {
      for (let i = 0; i < 30; i++) {
        treesRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height - Math.random() * 100,
          size: 20 + Math.random() * 40,
          sway: Math.random() * Math.PI * 2,
        })
      }
    }

    let animationId: number

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#87CEEB")
      gradient.addColorStop(1, "#E8F5E9")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ground
      ctx.fillStyle = "#8B7355"
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50)

      // Draw grass
      ctx.fillStyle = "#4CAF50"
      ctx.fillRect(0, canvas.height - 55, canvas.width, 10)

      // Draw trees
      treesRef.current.forEach((tree) => {
        const swayAmount = Math.sin(time / 1000 + tree.sway) * 5

        // Tree trunk
        ctx.fillStyle = "#6D4C41"
        ctx.fillRect(tree.x - tree.size / 8 + swayAmount, tree.y - tree.size, tree.size / 4, tree.size)

        // Tree foliage
        ctx.fillStyle = "#2E7D32"
        ctx.beginPath()
        ctx.arc(tree.x + swayAmount, tree.y - tree.size, tree.size / 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#388E3C"
        ctx.beginPath()
        ctx.arc(tree.x - tree.size / 4 + swayAmount, tree.y - tree.size - tree.size / 4, tree.size / 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(tree.x + tree.size / 4 + swayAmount, tree.y - tree.size - tree.size / 4, tree.size / 3, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
}
