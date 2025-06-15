import { useState, useRef, useEffect } from "react"
import { Trash2, Move, Edit3 } from "lucide-react"

const DraggableOverlay = ({ overlay, onUpdate, onDelete, containerRef, isEditing, onEditToggle }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: overlay.x, y: overlay.y })
  const overlayRef = useRef(null)

  useEffect(() => {
    setPosition({ x: overlay.x, y: overlay.y })
  }, [overlay.x, overlay.y])

  const handleMouseDown = (e) => {
    if (isEditing) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newX = Math.max(0, Math.min(e.clientX - dragStart.x - containerRect.left, containerRect.width - 200))
    const newY = Math.max(0, Math.min(e.clientY - dragStart.y - containerRect.top, containerRect.height - 50))

    setPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      onUpdate(overlay.id, { ...overlay, x: position.x, y: position.y })
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart, position])

  return (
    <div
      ref={overlayRef}
      className={`absolute group cursor-move select-none ${isDragging ? "z-50" : "z-20"}`}
      style={{
        left: position.x,
        top: position.y,
        fontSize: `${overlay.fontSize}px`,
        color: overlay.color,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative">
        {/* Overlay Content */}
        <div
          className="bg-black/60 text-white px-3 py-1 rounded-md backdrop-blur-sm"
          style={{
            fontSize: `${overlay.fontSize}px`,
            color: overlay.color,
            backgroundColor: overlay.backgroundColor || "rgba(0,0,0,0.6)",
          }}
        >
          {overlay.text}
        </div>

        {/* Control Buttons */}
        <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-md shadow-lg flex items-center space-x-1 p-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEditToggle(overlay.id)
            }}
            className="p-1 hover:bg-gray-100 rounded text-blue-500"
            title="Edit"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(overlay.id)
            }}
            className="p-1 hover:bg-gray-100 rounded text-red-500"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <div className="p-1 text-gray-400">
            <Move className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DraggableOverlay
