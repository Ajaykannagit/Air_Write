import React from 'react';

interface DrawingControlsProps {
    onAddSpace: () => void;
    onDeleteLast: () => void;
    onClearDrawing: () => void;
}

const DrawingControls: React.FC<DrawingControlsProps> = ({
    onAddSpace,
    onDeleteLast,
    onClearDrawing
}) => {
    return (
        <div className="absolute top-4 right-4 flex space-x-2">
            <button
                onClick={onAddSpace}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-blue-500/25 hover:scale-105"
            >
                Space
            </button>
            <button
                onClick={onDeleteLast}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-orange-500/25 hover:scale-105"
            >
                ⌫ Delete
            </button>
            <button
                onClick={onClearDrawing}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-red-500/25 hover:scale-105"
            >
                Clear All
            </button>
        </div>
    );
};

export default DrawingControls;
