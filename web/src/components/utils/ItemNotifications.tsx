import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';
import useNuiEvent from '../../hooks/useNuiEvent';
import useQueue from '../../hooks/useQueue';
import { Locale } from '../../store/locale';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';
import { Items } from '../../store/items';
import Fade from './transitions/Fade';

interface ItemNotificationProps {
  item: SlotWithItem;
  text: string;
}

export const ItemNotificationsContext = React.createContext<{
  add: (item: ItemNotificationProps) => void;
} | null>(null);

export const useItemNotifications = () => {
  const itemNotificationsContext = useContext(ItemNotificationsContext);
  if (!itemNotificationsContext) throw new Error(`ItemNotificationsContext undefined`);
  return itemNotificationsContext;
};

const ItemNotification = React.forwardRef(
  (props: { item: ItemNotificationProps; style?: React.CSSProperties }, ref: React.ForwardedRef<HTMLDivElement>) => {
    const slotItem = props.item.item;

    const durabilityColor = slotItem?.durability !== undefined ? `hsla(${(slotItem.durability * 80) / 100}, 85%, ${30 + (slotItem.durability * 0.2)}%, 0.4)` : 'transparent';
    const durabilityFill = slotItem?.durability !== undefined 
      ? `radial-gradient(circle at bottom, ${durabilityColor} 0%, transparent ${Math.max(20, slotItem?.durability)}%)` 
      : '';

    return (
      <div
        className={`item-notification-item-box ${slotItem?.durability !== undefined ? 'has-durability' : ''}`}
        style={{
          backgroundImage: slotItem?.name 
            ? `url(${getItemUrl(slotItem)}), ${durabilityFill ? durabilityFill + ',' : ''} radial-gradient(circle, rgba(62, 69, 82, 0.8) 0%, rgba(20, 23, 30, 0.95) 100%)` 
            : `radial-gradient(circle, rgba(62, 69, 82, 0.8) 0%, rgba(20, 23, 30, 0.95) 100%)`,
          backgroundSize: slotItem?.name ? (durabilityFill ? '7vh, 100% 100%, 100% 100%' : '7vh, 100% 100%') : '100% 100%',
          border: slotItem?.durability !== undefined ? `1px solid hsla(${(slotItem.durability * 120) / 100}, 60%, 40%, 0.3)` : '',
          boxShadow: slotItem?.durability !== undefined ? `inset 0 -10px 20px hsla(${(slotItem.durability * 120) / 100}, 75%, 25%, 0.2)` : '',
          ...props.style,
        }}
        ref={ref}
      >
        <div className="item-slot-wrapper">
          <div className="item-notification-action-box">
            <p>{props.item.text}</p>
          </div>
          <div className="inventory-slot-label-box">
            <div className="inventory-slot-label-text">{slotItem.metadata?.label || Items[slotItem.name]?.label}</div>
          </div>
        </div>
      </div>
    );
  }
);

export const ItemNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const queue = useQueue<{
    id: number;
    item: ItemNotificationProps;
    ref: React.RefObject<HTMLDivElement>;
  }>();

  const add = (item: ItemNotificationProps) => {
    const ref = React.createRef<HTMLDivElement>();
    const notification = { id: Date.now(), item, ref: ref };

    queue.add(notification);

    const timeout = setTimeout(() => {
      queue.remove();
      clearTimeout(timeout);
    }, 2500);
  };

  useNuiEvent<[item: SlotWithItem, text: string, count?: number]>('itemNotify', ([item, text, count]) => {
    add({ item: item, text: count ? `${Locale[text]} ${count}x` : `${Locale[text]}` });
  });

  return (
    <ItemNotificationsContext.Provider value={{ add }}>
      {children}
      {createPortal(
        <TransitionGroup className="item-notification-container">
          {queue.values.map((notification, index) => (
            <Fade key={`item-notification-${index}`}>
              <ItemNotification item={notification.item} ref={notification.ref} />
            </Fade>
          ))}
        </TransitionGroup>,
        document.body
      )}
    </ItemNotificationsContext.Provider>
  );
};
