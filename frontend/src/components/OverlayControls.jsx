import React, { useState } from "react"
import { Plus, Eye, EyeOff, Type, Palette, Trash2 } from "lucide-react"

const OverlayControls = ({
  overlays,
  onAddOverlay,
  onUpdateOverlay,
  onDeleteOverlay,
}) => {
  const [isCreating, setIsCreating] = useState(false)
  const [allOverlaysVisible, setAllOverlaysVisible] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [newOverlay, setNewOverlay] = useState({
    text: "",
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    x: 0,
    y: 0,
  })

  const handleCreateOverlay = () => {
    if (newOverlay.text.trim()) {
      onAddOverlay({
        ...newOverlay,
        id: Date.now(),
        visible: true,
      })
      setNewOverlay({ text: "", fontSize: 16, color: "#ffffff", backgroundColor: "rgba(0,0,0,0.6)", x: 0, y: 0 })
      setIsCreating(false)
    }
  }

  const handleUpdateOverlay = (id, updates) => {
    onUpdateOverlay(id, updates)
    setEditingId(null)
  }

  const handleDeleteOverlay = (id) => {
    onDeleteOverlay(id)
    if (editingId === id) setEditingId(null)
  }

  const toggleAllOverlays = () => {
    const newVisibility = !allOverlaysVisible
    setAllOverlaysVisible(newVisibility)
    overlays.forEach((overlay) => {
      onUpdateOverlay(overlay.id, { ...overlay, visible: newVisibility })
    })
  }

  return (
    <div className="absolute top-4 left-4 z-30 bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-xl border border-gray-300 space-y-4 w-80 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-800 font-semibold text-lg flex items-center space-x-2">
          <button onClick={toggleAllOverlays} className="focus:outline-none">
            {allOverlaysVisible ? (
              <Eye className="w-5 h-5 text-blue-500 cursor-pointer" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-500 cursor-pointer" />
            )}
          </button>
          <span>Overlay Manager</span>
        </h3>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-700">Text Overlays</h4>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center cursor-pointer space-x-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {isCreating && (
          <div className="bg-gray-50 p-3 rounded-lg space-y-3 mb-3">
            <input
              type="text"
              value={newOverlay.text}
              onChange={(e) =>
                setNewOverlay((prev) => ({ ...prev, text: e.target.value }))
              }
              placeholder="Enter overlay text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="12"
                  max="36"
                  value={newOverlay.fontSize}
                  onChange={(e) =>
                    setNewOverlay((prev) => ({
                      ...prev,
                      fontSize: parseInt(e.target.value),
                    }))
                  }
                  className="w-16"
                />
                <span className="text-xs text-gray-500">
                  {newOverlay.fontSize}px
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-gray-500" />
                <input
                  type="color"
                  value={newOverlay.color}
                  onChange={(e) =>
                    setNewOverlay((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="h-6 w-6 rounded border"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-600">X</label>
                <input
                  type="number"
                  value={newOverlay.x}
                  onChange={(e) =>
                    setNewOverlay((prev) => ({ ...prev, x: parseInt(e.target.value) }))
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600">Y</label>
                <input
                  type="number"
                  value={newOverlay.y}
                  onChange={(e) =>
                    setNewOverlay((prev) => ({ ...prev, y: parseInt(e.target.value) }))
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleCreateOverlay}
                className="bg-green-500 text-white cursor-pointer px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {allOverlaysVisible && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {overlays.map((overlay) => (
              <div key={overlay.id} className="bg-gray-50 p-3 rounded-lg">
                {editingId === overlay.id ? (
                  <OverlayEditor
                    overlay={overlay}
                    onSave={(updates) => handleUpdateOverlay(overlay.id, updates)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 truncate">
                        {overlay.text || "Untitled Overlay"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Position: ({overlay.x}, {overlay.y})
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingId(overlay.id)}
                        className="p-1 cursor-pointer text-gray-500 hover:text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOverlay(overlay.id)}
                        className="p-1 cursor-pointer text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const OverlayEditor = ({ overlay, onSave, onCancel }) => {
  const [editData, setEditData] = useState({
    text: overlay.text,
    fontSize: overlay.fontSize,
    color: overlay.color,
    backgroundColor: overlay.backgroundColor,
    x: overlay.x,
    y: overlay.y,
  })

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={editData.text}
        onChange={(e) =>
          setEditData((prev) => ({ ...prev, text: e.target.value }))
        }
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
      />

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <Type className="w-3 h-3 text-gray-500" />
          <input
            type="range"
            min="12"
            max="36"
            value={editData.fontSize}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                fontSize: parseInt(e.target.value),
              }))
            }
            className="w-12"
          />
          <span className="text-xs">{editData.fontSize}px</span>
        </div>

        <input
          type="color"
          value={editData.color}
          onChange={(e) =>
            setEditData((prev) => ({ ...prev, color: e.target.value }))
          }
          className="h-5 w-5 rounded border"
        />
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-600">X</label>
          <input
            type="number"
            value={editData.x}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                x: parseInt(e.target.value),
              }))
            }
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600">Y</label>
          <input
            type="number"
            value={editData.y}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                y: parseInt(e.target.value),
              }))
            }
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onSave({ ...overlay, ...editData })}
          className="bg-green-500 text-white px-2 py-1 rounded text-xs cursor-pointer hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white cursor-pointer px-2 py-1 rounded text-xs hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default OverlayControls
