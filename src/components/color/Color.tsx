import { HexColorPicker } from 'react-colorful';
import useSaveColor from './hooks/useSaveColor';

export const Color = ({
  color,
  setColor,
  className
}: {
  color: string;
  setColor: any;
  className: string;
}) => {
  useSaveColor({ color });
  return (
    <div className={className}>
      <HexColorPicker color={color} onChange={setColor} />
    </div>
  );
};
