import classNames from 'classnames';
import { NeuButton } from './NeuButton';

interface NavButtonProps {
  isOpen: boolean;
  toggleIsOpen: () => void;
}
const NavButton = ({ isOpen, toggleIsOpen }: NavButtonProps) => {
  const hamburgLine =
    'h-0.5 w-6 my-1 rounded-full bg-white transition-all duration-150 delay-200';
  return (
    <NeuButton
      onClick={toggleIsOpen}
      className={classNames(
        'fixed top-1/2 left-2 z-10 flex flex-col h-12 w-12 justify-center items-center group transition-all duration-150 cursor-pointer'
      )}
    >
      <div
        className={classNames(
          hamburgLine,
          isOpen
            ? 'rotate-45 translate-y-[10px] opacity-50 group-hover:opacity-100'
            : 'opacity-50 group-hover:opacity-100'
        )}
      ></div>
      <div
        className={classNames(
          hamburgLine,
          isOpen ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
        )}
      ></div>
      <div
        className={classNames(
          hamburgLine,
          isOpen
            ? '-rotate-45 -translate-y-[10px] opacity-50 group-hover:opacity-100'
            : 'opacity-50 group-hover:opacity-100'
        )}
      ></div>
    </NeuButton>
  );
};

export default NavButton;
