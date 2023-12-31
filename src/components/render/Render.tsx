interface RenderProps {
  if?: boolean;
  children: React.ReactNode;
}
const Render = ({ if: show = false, children }: RenderProps) => {
  return show === true ? children : null;
};

export default Render;
