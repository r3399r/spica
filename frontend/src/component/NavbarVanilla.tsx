import BackButton from 'src/component/BackButton';

type Props = {
  text: string;
};

const NavbarVanilla = ({ text }: Props) => (
  <div className="mt-[15px] mb-5">
    <BackButton text={text} />
  </div>
);

export default NavbarVanilla;
