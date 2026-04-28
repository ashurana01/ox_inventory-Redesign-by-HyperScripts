import React, { RefObject, useRef } from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';
import { DragSource } from '../../typings';

interface DragLayerProps {
  data: DragSource;
  currentOffset: XYCoord | null;
  isDragging: boolean;
}

const subtract = (a: XYCoord, b: XYCoord): XYCoord => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
};

const calculateParentOffset = (monitor: DragLayerMonitor): XYCoord => {
  const client = monitor.getInitialClientOffset();
  const source = monitor.getInitialSourceClientOffset();
  if (client === null || source === null || client.x === undefined || client.y === undefined) {
    return { x: 0, y: 0 };
  }
  return subtract(client, source);
};

export const calculatePointerPosition = (monitor: DragLayerMonitor, childRef: RefObject<Element>): XYCoord | null => {
  const offset = monitor.getClientOffset();
  if (offset === null) {
    return null;
  }

  if (!childRef.current || !childRef.current.getBoundingClientRect) {
    return subtract(offset, calculateParentOffset(monitor));
  }

  const bb = childRef.current.getBoundingClientRect();
  const middle = { x: bb.width / 2, y: bb.height / 2 };
  return subtract(offset, middle);
};

const DragPreview: React.FC = () => {
  const element = useRef<HTMLDivElement>(null);

  const { data, isDragging, currentOffset } = useDragLayer<DragLayerProps>((monitor) => ({
    data: monitor.getItem(),
    currentOffset: calculatePointerPosition(monitor, element),
    isDragging: monitor.isDragging(),
  }));

  return (
    <>
      {isDragging && currentOffset && data.item && (
        <div
          className="item-drag-preview inventory-slot"
          ref={element}
          style={{
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
            backgroundImage: data.image
              ? `${data.image}, radial-gradient(circle, rgba(62, 69, 82, 0.8) 0%, rgba(20, 23, 30, 0.95) 100%)`
              : `radial-gradient(circle, rgba(62, 69, 82, 0.8) 0%, rgba(20, 23, 30, 0.95) 100%)`,
            backgroundSize: data.image ? '7vh, 100% 100%' : '100% 100%',
            backgroundRepeat: data.image ? 'no-repeat, no-repeat' : 'no-repeat',
            backgroundPosition: data.image ? 'center, center' : 'center',
            border: '2px solid rgba(69, 187, 219, 0.8)', /* Cyan border for active drag */
            width: '11.2vh', /* force size match with new 11.2vh gridSize */
            height: '11.2vh',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {data.itemData && (
            <div className="item-slot-wrapper">
              <div className="item-slot-header-wrapper">
                <div className="item-slot-info-wrapper">
                  {/* Count on left, Weight on right matching mockup */}
                  <p className="item-count-display">
                    {data.itemData.count > 0 ? `x${data.itemData.count.toLocaleString('en-us')}` : ''}
                  </p>
                  <p className="item-weight-display">
                    {data.itemData.weight > 0
                      ? data.itemData.weight >= 1000
                        ? `${(data.itemData.weight / 1000).toLocaleString('en-us', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} kg`
                        : `${data.itemData.weight.toLocaleString('en-us', { minimumFractionDigits: 0 })} g`
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DragPreview;
