import React, { useState } from 'react';
import { getItemUrl, isSlotWithItem } from '../../helpers';
import useNuiEvent from '../../hooks/useNuiEvent';
import { Items } from '../../store/items';
import WeightBar from '../utils/WeightBar';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { SlotWithItem } from '../../typings';
import SlideUp from '../utils/transitions/SlideUp';

const InventoryHotbar: React.FC = () => {
  const [hotbarVisible, setHotbarVisible] = useState(false);
  const items = useAppSelector(selectLeftInventory).items.slice(0, 5);

  //stupid fix for timeout
  const [handle, setHandle] = useState<NodeJS.Timeout>();
  useNuiEvent('toggleHotbar', () => {
    if (hotbarVisible) {
      setHotbarVisible(false);
    } else {
      if (handle) clearTimeout(handle);
      setHotbarVisible(true);
      setHandle(setTimeout(() => setHotbarVisible(false), 3000));
    }
  });

  return (
    <SlideUp in={hotbarVisible}>
      <div className="hotbar-container">
        {items.map((item) => {
          const durabilityColor = item?.durability !== undefined ? `hsla(${(item.durability * 80) / 100}, 85%, ${30 + (item.durability * 0.2)}%, 0.4)` : 'transparent';
          const durabilityFill = item?.durability !== undefined 
            ? `radial-gradient(circle at bottom, ${durabilityColor} 0%, transparent ${Math.max(20, item?.durability)}%)` 
            : '';
          
          return (
            <div
              className={`hotbar-item-slot ${item?.durability !== undefined ? 'has-durability' : ''}`}
              style={{
                backgroundImage: item?.name 
                  ? `url(${getItemUrl(item as SlotWithItem)}), ${durabilityFill ? durabilityFill + ',' : ''} radial-gradient(circle, rgba(62, 69, 82, 0.8) 0%, rgba(20, 23, 30, 0.95) 100%)` 
                  : `radial-gradient(circle, rgba(62, 69, 82, 0.8) 0%, rgba(20, 23, 30, 0.95) 100%)`,
                backgroundSize: item?.name ? (durabilityFill ? `7vh, 100% 100%, 100% 100%` : `7vh, 100% 100%`) : `100% 100%`,
                border: item?.durability !== undefined ? `1px solid hsla(${(item.durability * 120) / 100}, 60%, 40%, 0.3)` : '',
                boxShadow: item?.durability !== undefined ? `inset 0 -10px 20px hsla(${(item.durability * 120) / 100}, 75%, 25%, 0.2)` : '',
                borderRadius: '8px',
              }}
              key={`hotbar-${item.slot}`}
            >
              {isSlotWithItem(item) && (
                <div className="item-slot-wrapper">
                  <div className="item-slot-header-wrapper">
                    <div className="inventory-slot-number">{item.slot}</div>
                  </div>
                  <div>
                    {/* Durability is now handled via background gradient */}
                    <div className="inventory-slot-label-box">
                      <div className="inventory-slot-label-text">
                        {item.metadata?.label ? item.metadata.label : Items[item.name]?.label || item.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SlideUp>
  );
};

export default InventoryHotbar;
