import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory, hideEquipment?: boolean, isRight?: boolean }> = ({ inventory, hideEquipment, isRight }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);
  return (
    <>
      <div className={`inventory-grid-wrapper ${isRight ? 'inventory-grid-wrapper-right' : 'inventory-grid-wrapper-left'}`} style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div>
          <div className="inventory-grid-header-wrapper">
            <div className={`inventory-grid-header-icon icon-${inventory.type}`}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Octagon */}
                <path d="M10 2L26 2L34 10L34 26L26 34L10 34L2 26L2 10L10 2Z" 
                      className="header-icon-outer" 
                      strokeWidth="2" />
                {/* Inner Icon Shape mapped via CSS */}
                <g className="header-icon-inner"></g>
              </svg>
            </div>
            <div className="inventory-grid-header-content">
              <div className="inventory-grid-header-title">
                <p>{inventory.label}</p>
                <div className="inventory-grid-header-weight">
                  {inventory.maxWeight && (
                    <p>
                      {weight / 1000}/{inventory.maxWeight / 1000} lbs
                    </p>
                  )}
                </div>
              </div>
              <div className="inventory-grid-header-weight-bar">
                 <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
              </div>
            </div>
          </div>
        </div>
        <div className={`inventory-grid-container ${isRight ? 'inventory-grid-container-right' : 'inventory-grid-container-left'}`} ref={containerRef}>
          <>
            {(hideEquipment ? inventory.items.slice(5) : inventory.items)
              .slice(0, (page + 1) * PAGE_SIZE)
              .map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
