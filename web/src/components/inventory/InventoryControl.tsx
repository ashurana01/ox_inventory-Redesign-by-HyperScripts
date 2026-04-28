import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { DragSource } from '../../typings';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import UsefulControls from './UsefulControls';

const InventoryControl: React.FC = () => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();

  const [infoVisible, setInfoVisible] = useState(false);

  const [, use] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [, give] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.valueAsNumber =
      isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0 ? 0 : Math.floor(event.target.valueAsNumber);
    dispatch(setItemAmount(event.target.valueAsNumber));
  };

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
      <div className="inventory-control">
        <div className="inventory-control-bottom-container">
          <input
            className="inventory-control-input"
            type="number"
            defaultValue={itemAmount}
            onChange={inputHandler}
            min={0}
          />
          <button className="inventory-control-hexagon-btn" ref={use} title={Locale.ui_use || 'Use'}>
            <svg viewBox="0 0 100 100" className="hex-bg">
              <polygon points="30 5 70 5 95 30 95 70 70 95 30 95 5 70 5 30" fill="rgba(12, 14, 18, 0.9)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
            </svg>
            <svg viewBox="0 0 24 24" className="btn-icon">
              {/* Hand Icon for Use */}
              <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11H17A3,3 0 0,1 20,14V17A5,5 0 0,1 15,22H9A5.5,5.5 0 0,1 3.5,16.5V11C3.5,9.6 4.4,8.4 5.7,8.1C6.1,8.9 6.9,9.5 7.9,9.5A2.5,2.5 0 0,0 10.4,7V5A2,2 0 0,1 12.4,3Z" />
            </svg>
          </button>
          
          <button className="inventory-control-hexagon-btn" ref={give} title={Locale.ui_give || 'Give'}>
            <svg viewBox="0 0 100 100" className="hex-bg">
              <polygon points="30 5 70 5 95 30 95 70 70 95 30 95 5 70 5 30" fill="rgba(12, 14, 18, 0.9)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
            </svg>
            <svg viewBox="0 0 24 24" className="btn-icon">
              {/* Share/Give Arrow Icon */}
              <path fill="currentColor" d="M21,12L14,5V9C7,10 4,15 3,20C5.5,16.5 9,14.9 14,14.9V19L21,12Z" />
            </svg>
          </button>
          
          <button className="inventory-control-hexagon-btn inventory-control-btn-danger" onClick={() => fetchNui('exit')} title={Locale.ui_close || 'Close'}>
            <svg viewBox="0 0 100 100" className="hex-bg">
              <polygon points="30 5 70 5 95 30 95 70 70 95 30 95 5 70 5 30" fill="rgba(40, 10, 10, 0.9)" stroke="rgba(255, 50, 50, 0.4)" strokeWidth="2" />
            </svg>
            <svg viewBox="0 0 24 24" className="btn-icon">
              {/* Close X Icon */}
              <path fill="rgba(255, 80, 80, 0.9)" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
      </div>

      <button className="useful-controls-button" onClick={() => setInfoVisible(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 524 524">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>
      </button>
    </>
  );
};

export default InventoryControl;
