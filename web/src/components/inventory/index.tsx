import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch, useAppSelector } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory, selectLeftInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps, SlotWithItem, Slot } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import { Items } from '../../store/items';
import { getItemUrl } from '../../helpers';
import InventorySlot from './InventorySlot';

const StatusOctagon: React.FC<{ percent: number; color: string; icon: React.ReactNode; type: string }> = ({
  percent,
  color,
  icon,
  type,
}) => (
  <div className="status-octagon-wrapper">
    <svg viewBox="0 0 100 100" className="status-octagon-svg">
      <defs>
        <clipPath id={`clip-octagon-${type}`}>
          <polygon points="30 5, 70 5, 95 30, 95 70, 70 95, 30 95, 5 70, 5 30" />
        </clipPath>
      </defs>
      {/* Background Octagon */}
      <polygon
        points="30 5, 70 5, 95 30, 95 70, 70 95, 30 95, 5 70, 5 30"
        className="status-octagon-bg"
      />
      {/* Fill Octagon */}
      <rect
        x="0"
        y={100 - percent}
        width="100"
        height={percent}
        fill={color}
        clipPath={`url(#clip-octagon-${type})`}
        className="status-octagon-fill"
      />
      {/* Border Octagon */}
      <polygon
        points="30 5, 70 5, 95 30, 95 70, 70 95, 30 95, 5 70, 5 30"
        className="status-octagon-border"
      />
    </svg>
    <div className="status-octagon-icon">{icon}</div>
  </div>
);

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const dispatch = useAppDispatch();
  const leftInventory = useAppSelector(selectLeftInventory);
  const playerInfo = useAppSelector((state) => state.inventory.info);

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
    info?: any;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="layout-overlay">
          {/* Bottom Right Player Info */}
          <div className="player-info-container">

            <div className="player-stats-row">
              <StatusOctagon
                type="health"
                percent={playerInfo?.health || 0}
                color="rgba(0, 200, 255, 1)"
                icon={<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.41,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.59,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg>}
              />
              <StatusOctagon
                type="armor"
                percent={playerInfo?.armor || 0}
                color="rgba(0, 200, 255, 1)"
                icon={<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z" /></svg>}
              />
              <StatusOctagon
                type="hunger"
                percent={playerInfo?.hunger || 0}
                color="rgba(0, 200, 255, 1)"
                icon={<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2C10.9,2 10,2.9 10,4V10H8V4C8,2.89 7.11,2 6,2S4,2.89 4,4V10H3V11L4.5,18.5C4.75,20 6.06,21 7.5,21H10V22H12V22C14,22 16,22 18,22V21H20.5C21.94,21 23.25,20 23.5,18.5L25,11V10H24V4C24,2.89 23.11,2 22,2S20,2.89 20,4V10H18V4C18,2.89 17.11,2 16,2S14,2.89 14,4V10H14V2H12Z" /></svg>}
              />
              <StatusOctagon
                type="thirst"
                percent={playerInfo?.thirst || 0}
                color="rgba(0, 200, 255, 1)"
                icon={<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" /></svg>}
              />
              <StatusOctagon
                type="stress"
                percent={playerInfo?.stress || 0}
                color="rgba(0, 200, 255, 1)"
                icon={<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg>}
              />
            </div>

            <div className="player-finances">
              <div className="finance-row cash">
                <span className="finance-icon">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z" /></svg>
                </span>
                <span className="finance-amount">${(playerInfo?.cash || 0).toLocaleString()}</span>
              </div>
              <div className="finance-row bank">
                <span className="finance-icon">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M11.5,1L2,6V8H21V6L11.5,1M11.5,14.5A2.5,2.5 0 0,1 14,17A2.5,2.5 0 0,1 11.5,19.5A2.5,2.5 0 0,1 9,17A2.5,2.5 0 0,1 11.5,14.5M2,20V23H21V20H2Z" /></svg>
                </span>
                <span className="finance-amount">${(playerInfo?.bank || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="player-name">{playerInfo?.name || 'UNKNOWN'}</div>
          </div>

          <div className="global-inventory-header">
            <div className="header-text-container">
              <div className="server-name">HYPER SCRIPTS</div>
              <div className="inventory-title">INVENTORY</div>
            </div>
            <div className="header-logo-container">
              {/* Replace with your actual logo URL */}
              <img src="https://r2.fivemanage.com/oOi80So5WX1xwJUMDQTXH/white.png" alt="Logo" className="inventory-logo" />
            </div>
          </div>

          <div className="full-inventory-layout">
            {/* Extreme Left Equipment Panel */}
            <div className="equipment-panel">
              <div className="equipment-grid">
                {/* Map the first 5 slots using actual InventorySlot components for DND support */}
                {leftInventory?.items?.slice(0, 5).map((item, index) => {
                  const isLargeWeapon = index === 4;

                  return (
                    <div
                      className={isLargeWeapon ? "equipment-wrapper-large" : "equipment-wrapper"}
                      key={`equipment-${leftInventory.id}-${item.slot}`}
                    >
                      <InventorySlot
                        item={item}
                        inventoryType={leftInventory.type}
                        inventoryGroups={leftInventory.groups}
                        inventoryId={leftInventory.id}
                      />
                    </div>
                  );
                })}
                {/* Pad out empty slots if less than 5 items exist */}
                {Array.from({ length: Math.max(0, 5 - (leftInventory?.items?.slice(0, 5).length || 0)) }).map((_, i) => (
                  <div
                    className={(i + (leftInventory?.items?.slice(0, 5).length || 0)) === 4 ? "equipment-wrapper-large" : "equipment-wrapper"}
                    key={`equipment-empty-${i}`}
                  >
                    {/* Placeholder InventorySlot for empty spaces required for dropping */}
                    <InventorySlot
                      item={{ name: '', count: 0, weight: 0, slot: (leftInventory?.items?.slice(0, 5).length || 0) + i + 1 }}
                      inventoryType={leftInventory?.type || 'player'}
                      inventoryGroups={leftInventory?.groups}
                      inventoryId={leftInventory?.id || ''}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Main Interactive Inventory Flow */}
            <div className="inventory-wrapper">
              <LeftInventory />
              <div className="inventory-right-side-group">
                <RightInventory />
                <InventoryControl />
              </div>
              <Tooltip />
              <InventoryContext />
            </div>
          </div>
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
